
import {
    same, evaluate, defineMethod, extendMethod, replaceMethod, defineGetProperty, assert
} from "./misc.js";
import {
    AVLTree, ESet, List, EMap, dichotomousSearch, insertionSort
} from "./collections.js";
import {
    addPhysicToContainer, Physic
} from "./physics.js";
import {
    CloneableObject, Events, Memento
} from "./toolkit.js";
import {
    Box2D, Box3D, Matrix2D, Point2D, Point3D
} from "./geometry.js";

export class SAPRecord2D {

    constructor(element, sweepAndPrune) {
        this._element = element;
        this._sweepAndPrune = sweepAndPrune;
    }

    _createBound(element) {
        let geometry = element.localGeometry;
        let widthSlim = same(geometry.left, geometry.right);
        let heightSlim = same(geometry.top, geometry.bottom);
        let bound = {
            element: element,
            left: {first: true, value: geometry.left, slim:widthSlim, element, index: -1, opened: new ESet([element])},
            right: {first: false, value: geometry.right, slim:widthSlim, element, index: -1, opened: new ESet()},
            top: {first: true, value: geometry.top, slim:heightSlim, element, index: -1, opened: new ESet([element])},
            bottom: {first: false, value: geometry.bottom, slim:heightSlim, element, index: -1, opened: new ESet()}
        };
        bound.left.index = this._sweepAndPrune._xAxis.length;
        bound.right.index = this._sweepAndPrune._xAxis.length + 1;
        this._sweepAndPrune._xAxis.push(bound.left, bound.right);
        this._sweepAndPrune._xAxis.dirty = 2;
        bound.top.index = this._sweepAndPrune._yAxis.length;
        bound.bottom.index = this._sweepAndPrune._yAxis.length + 1;
        this._sweepAndPrune._yAxis.push(bound.top, bound.bottom);
        this._sweepAndPrune._yAxis.dirty = 2;
        return bound;
    }

    createBounds() {
        this._x = this._element.lx;
        this._y = this._element.ly;
        this._bound = this._createBound(this._element);
    }

    get bounds() {
        return new List(this._bound);
    }

    _removeBound(bound) {
        bound.left.removed = true;
        bound.right.removed = true;
        bound.top.removed = true;
        bound.bottom.removed = true;
    }

    remove() {
        this._removeBound(this._bound);
        this._sweepAndPrune._xAxis.dirty = 2;
        this._sweepAndPrune._yAxis.dirty = 2;
    }

    _updateBound(bound, box) {
        bound.left.value = box.left;
        bound.right.value = box.right;
        bound.top.value = box.top;
        bound.bottom.value = box.bottom
    }

    update() {
        this._x = this._element.lx;
        this._y = this._element.ly;
        this._updateBound(this._bound, this._element.localGeometry);
        if (!this._sweepAndPrune._xAxis.dirty) {
            this._sweepAndPrune._xAxis.dirty=1;
        } else {
            this._sweepAndPrune._xAxis.dirty++;
        }
        if (!this._sweepAndPrune._yAxis.dirty) {
            this._sweepAndPrune._yAxis.dirty=1;
        } else {
            this._sweepAndPrune._yAxis.dirty++;
        }
    }

    left(element) {
        return this._bound.left.value;
    }

    right(element) {
        return this._bound.right.value;
    }

    top(element) {
        return this._bound.top.value;
    }

    bottom(element) {
        return this._bound.bottom.value;
    }

    x(element) {
        return this._x;
    }

    y(element) {
        return this._y;
    }

    get box() {
        return new Box2D(
            this._bound.left.value,
            this._bound.top.value,
            this._bound.right.value-this._bound.left.value,
            this._bound.bottom.value-this._bound.top.value
        );
    }

}

export class SweepAndPrune2D {

    constructor() {
        this._elements = new Map();
        this._xAxis = new List();
        this._yAxis = new List();
    }

    clear() {
        this._elements.clear();
        this._xAxis.clear();
        this._yAxis.clear();
    }

    log() {
        console.log("-------------------")
        console.log("X Axis: ", [...this._xAxis]);
        console.log("Y Axis: ", [...this._yAxis]);
    }

    get elements() {
        return this._elements.keys();
    }

    left(element) {
        let record = this._getRecord(element);
        return record ? record.left(element) : null;
    }

    right(element) {
        let record = this._getRecord(element);
        return record ? record.right(element) : null;
    }

    top(element) {
        let record = this._getRecord(element);
        return record ? record.top(element) : null;
    }

    bottom(element) {
        let record = this._getRecord(element);
        return record ? record.bottom(element) : null;
    }

    has(element) {
        return this._elements.has(element);
    }

    add(element) {
        if (!this.has(element)) {
            let record = this._createRecord(element);
            for (let bound of record.bounds) {
                this._elements.set(bound.element, record);
            }
            return true;
        }
        return false;
    }

    remove(element) {
        if (this.has(element)) {
            let record = this._getRecord(element);
            record.remove();
            this._elements.delete(element);
            return true;
        }
        return false;
    }

    _updateOnAxis(axis, startBoundary, endBoundary) {
        // 1st case : the starting bound is moved back
        let index = startBoundary.index;
        while (index > 0 && this._comparator(axis[index - 1], startBoundary) > 0) {
            let otherBoundary = axis[index - 1];
            axis[index - 1] = startBoundary;
            axis[index] = otherBoundary;
            startBoundary.index = index - 1;
            otherBoundary.index = index;
            otherBoundary.opened.add(startBoundary.element);
            if (otherBoundary.first) {
                startBoundary.opened.delete(otherBoundary.element);
            } else {
                startBoundary.opened.add(otherBoundary.element);
            }
            index--;
        }

        // 2nd case : the ending bound is moved forward
        index = endBoundary.index;
        while (
            index < axis.length - 1 &&
            this._comparator(axis[index + 1], endBoundary) < 0
            ) {
            let otherBoundary = axis[index + 1];
            axis[index + 1] = endBoundary;
            axis[index] = otherBoundary;
            endBoundary.index = index + 1;
            otherBoundary.index = index;
            otherBoundary.opened.add(endBoundary.element);
            if (otherBoundary.first) {
                endBoundary.opened.add(otherBoundary.element);
            } else {
                endBoundary.opened.delete(otherBoundary.element);
            }
            index++;
        }

        // 3nd case : the starting bound is moved forward
        index = startBoundary.index;
        while (
            index < axis.length - 1 &&
            this._comparator(axis[index + 1], startBoundary) < 0
            ) {
            let otherBoundary = axis[index + 1];
            axis[index + 1] = startBoundary;
            axis[index] = otherBoundary;
            startBoundary.index = index + 1;
            otherBoundary.index = index;
            otherBoundary.opened.delete(startBoundary.element);
            if (otherBoundary.first) {
                startBoundary.opened.add(otherBoundary.element);
            } else {
                startBoundary.opened.delete(otherBoundary.element);
            }
            index++;
        }

        // last case : the ending bound is moved back
        index = endBoundary.index;
        while (index > 0 && this._comparator(axis[index - 1], endBoundary) > 0) {
            let otherBoundary = axis[index - 1];
            axis[index - 1] = endBoundary;
            axis[index] = otherBoundary;
            endBoundary.index = index - 1;
            otherBoundary.index = index;
            otherBoundary.opened.delete(endBoundary.element);
            if (otherBoundary.first) {
                endBoundary.opened.delete(otherBoundary.element);
            } else {
                endBoundary.opened.add(otherBoundary.element);
            }
            index--;
        }
    };

    _mustRefreshEverything() {
        return this._xAxis.dirty >= 2 || this._yAxis.dirty >= 2;
    }

    _refreshRecord(record) {
        for (let bound of record.bounds) {
            this._updateOnAxis(this._xAxis, bound.left, bound.right);
        }
        delete this._xAxis.dirty;
        for (let bound of record.bounds) {
            this._updateOnAxis(this._xAxis, bound.left, bound.right);
        }
        delete this._yAxis.dirty;
    }

    update(element) {
        evaluate("SAP update element collisions", () => {
            let record = this._getRecord(element);
            record.update();
            if (this._mustRefreshEverything()) {
                this.updateInternals();
            } else {
                this._refreshRecord(record);
            }
        });
    }

    _createDefaultRecord(element) {
        return  new SAPRecord2D(element, this);
    }

    _createRecord(element) {
        let record = element._createSAPRecord ? element._createSAPRecord(this) : this._createDefaultRecord(element)
        record.createBounds();
        return record;
    }

    _getRecord(element) {
        return this._elements.get(element);
    }

    elementsInPoint(x, y) {
        this.updateInternals();
        let collectedOnX = new ESet();
        let index = dichotomousSearch(this._xAxis, x, (v, b) => v - b.value);
        if (index > 0) {
            for (let element of this._xAxis[index - 1].opened) {
                // Verify that element may collide only on x axis because if element not selected here, it cannot be
                // processed thereafter
                if (!element.mayNotCollide) {
                    collectedOnX.add(element);
                }
            }
        }
        let result = new List();
        index = dichotomousSearch(this._yAxis, y, (v, b) => v - b.value);
        if (index > 0) {
            for (let element of this._yAxis[index - 1].opened) {
                if (collectedOnX.delete(element)) {
                    result.add(element);
                }
            }
        }
        return result;
    }

    elementBox(element) {
        this.updateInternals();
        let record = this._getRecord(element);
        return record.box;
    }

    elementsInBox(box) {
        let left = box.left;
        let top = box.top;
        let right = box.right;
        let bottom = box.bottom;
        this.updateInternals();
        let collectedOnX = new ESet();
        let index = dichotomousSearch(this._xAxis, left, (v, b) => v - b.value);
        if (index > 0 && index < this._xAxis.length && this._xAxis[index].value > left) index--;
        while ( this._xAxis[index] && this._xAxis[index].value < right) {
            if (this._xAxis[index].value!==left || this._xAxis[index].first) {
                for (let element of this._xAxis[index].opened) {
                    // Verify that element may collide only on x axis because if element not selected here, it cannot be
                    // processed thereafter
                    if (!element.mayNotCollide) {
                        collectedOnX.add(element);
                    }
                }
            }
            index++;
        }
        let result = new List();
        index = dichotomousSearch(this._yAxis, top, (v, b) => v - b.value);
        if (index > 0 && index < this._yAxis.length && this._yAxis[index].value > top) index--;
        while (this._yAxis[index] && this._yAxis[index].value < bottom) {
            if (this._yAxis[index].value!==top || this._yAxis[index].first) {
                for (let element of this._yAxis[index].opened) {
                    if (collectedOnX.delete(element)) {
                        result.add(element);
                    }
                }
            }
            index++;
        }
        return result;
    }

    _comparator(e1, e2) {
        let diff = e1.value - e2.value;
        if (diff) return diff;
        // Same value... more complicated...
        // Same element = slim element : first bound is before last bound
        if (e1.element === e2.element) {
            return e1.first ? -1 : 1;
        }
        // Not same element
        else if (e1.first === e2.first) {
            // if an "element" is slim (width=0 or height=0), it is before or after the other element but cannot be
            // "inside" the "fat" element
            let e1w = e1.slim === e1.first ? 0 : 1; // XOR slim and first
            let e2w = e2.slim === e2.first ? 0 : 1;
            return e1w - e2w;
        }
        // Deux éléments avec des bornes différentes : la "fin" de l'un précède le "début" de l'autre (afin qu'ils apparaissent disjoints)
        else {
            return e1.first ? 1 : -1;
        }
    }

    _updateAxis(axis) {
        if (axis.dirty) {
            insertionSort(axis, this._comparator);
            for (let index = 0; index < axis.length; index++) {
                axis[index].index = index;
            }
            let opened = new List();
            for (let boundary of axis) {
                if (boundary.first) {
                    opened.add(boundary.element);
                    boundary.opened = new ESet(opened);
                } else {
                    opened.remove(boundary.element);
                    boundary.opened = new ESet(opened);
                }
            }
            delete axis.dirty;
        }
    }

    updateInternals() {
        this._updateAxis(this._xAxis);
        this._updateAxis(this._yAxis);
    }

    collideWith(box) {
        return this.elementsInBox(box.grow(-SweepAndPrune2D.COLLISION_MARGIN));
    }

    near(element, left) {
        let record = this._getRecord(element);
        if (!record) return new List();
        let result = this.elementsInBox(record.box.grow(1));
        result.remove(element);
        return result;
    }
}
SweepAndPrune2D.COLLISION_MARGIN = 0.0001;
SweepAndPrune2D.ADJUST_MARGIN = 40;

export function makeAbstractCollisionPhysic(superClass) {

    replaceMethod(superClass,
        function _init(...args) {
            this._elements = new ESet();
            this._createSweepAndPrunes();
            this._valids = new EMap();
        }
    );

    replaceMethod(superClass,
        function _refresh() {
            this._avoidCollisionsForElements();
        }
    );

    replaceMethod(superClass,
        function _reset() {
            this._elements = this._acceptedElements(this._host.children);
            this._dragAndDropSAP.clear();
            this._supportSAP.clear();
            this._valids.clear();
            for (let element of this._elements) {
                this._supportSAP.add(element);
                this._valids.set(element, element.validLocation);
            }
        }
    );

    replaceMethod(superClass,
        function hover(elements) {
            let previousElements = this._acceptedElements(this._dragAndDropSAP.elements);
            let managedElements = this.managedElements(elements);
            this._hover(previousElements, managedElements);
            this._refresh();
            this._host._fire(Physic.events.REFRESH_HOVER, this, managedElements);
            return this;
        }
    );

    defineMethod(superClass,
        /**
         * Adjust physic's internals when a dragged element moves inside the physic's host area.
         * @param element moving element
         * @private
         */
        function _moveHovered(element) {
            this._dragAndDropSAP.update(element);
        }
    );

    defineMethod(superClass,
        /**
         * Adjust physic's internals when a dragged element enters the physic's host area.
         * @param element entering element
         * @private
         */
        function _addHovered(element) {
            if (this._supportSAP.has(element)) {
                this._remove(element);
            }
            this._dragAndDropSAP.add(element);
        }
    );

    defineMethod(superClass,
        /**
         * Adjust physic's internals when a dragged element leaves the physic's host area.
         * @param element leaving element
         * @private
         */
        function _removeHovered(element) {
            this._dragAndDropSAP.remove(element);
        }
    );

    replaceMethod(superClass,
        /**
         * Adjust physic's internal when elements hovers physic's host.
         * @param previousElements elements that hover physic's host when previous mouse event occurred.
         * This data is important to identify elements that enter or leave the physic's host area.
         * @param elements elements that currently hover physic's host.
         * @private
         */
        function _hover(previousElements=new ESet(), elements) {
            let hoveredElements = new List(...elements);
            for (let element of hoveredElements) {
                if (previousElements.has(element)) {
                    previousElements.delete(element);
                    this._moveHovered(element);
                }
                else {
                    this._addHovered(element);
                }
            }
            for (let element of previousElements) {
                this._removeHovered(element);
            }
            this._dragAndDropSAP.updateInternals();
            this._avoidCollisionsForDraggedElements(hoveredElements);
        }
    );

    replaceMethod(superClass,
        /**
         * Adjust physic's internals when an element id added to physic's host.
         * @param element added element
         * @private
         */
        function _add(element) {
            if (this._dragAndDropSAP.has(element)) {
                this._dragAndDropSAP.remove(element);
            }
            this._elements.add(element);
            this._supportSAP.add(element);
            this._valids.set(element, element.validLocation);
        }
    );

    replaceMethod(superClass,
        /**
         * Adjust physic's internals when an element previously owned by physic's host is removed.
         * @param element removed element
         * @private
         */
        function _remove(element) {
            this._elements.delete(element);
            this._supportSAP.remove(element);
            this._valids.delete(element);
        }
    );

    replaceMethod(superClass,
        /**
         * Adjust physic's internals when an element owned by physic's host is moved.
         * @param element moved element
         * @private
         */
        function _move(element) {
            this._supportSAP.update(element);
        }
    );

    defineMethod(superClass,
        /**
         * Gets the elements owned by physic's host or those which are currently dragged on it AND which
         * collide with a given element.
         * @param element element to check.
         * @param exclude elements to exclude from processing (these element are those that are not already processed so
         * their positions are not relevant).
         * @param sap Sweep And Prune object that manages the element's location.
         * @returns {List} list of elements which collide with the given element
         * @private
         */
        function _collideWith(element, exclude, sap) {
            let elementBox = sap.elementBox(element);
            let collisions = new List(
                ...this._supportSAP.collideWith(elementBox),
                ...this._dragAndDropSAP.collideWith(elementBox)
            );
            let result = new List();
            for (let target of collisions) {
                let sweepAndPrune = this.sweepAndPrune(target);
                if (!exclude.has(target) &&
                    elementBox.intersects(sweepAndPrune.elementBox(target))) {
                    result.add(target);
                }
            }
            return result;
        }
    );

    defineMethod(superClass,
        /**
         * Gets the "Sweep And Prune" (SAP) that manage the element location. If the element is currently dragged,
         * this SAP is the one which manages dragged elements, otherwise, it's the one for managed elements
         * owned by physic's host.
         * @param element
         */
        function sweepAndPrune(element) {
            if (this._dragAndDropSAP.has(element)) {
                return this._dragAndDropSAP;
            }
            else {
                return this._supportSAP;
            }
        }
    );

    defineMethod(superClass,
        /**
         * Get a proposition on the a given axis. This proposition is the nearest position between the one given by
         * "current" toward the "original" (= lasted valid) position of the element.
         * @param target element to "avoid".
         * @param o original position
         * @param h the proposition.
         * @returns {*}
         */
        function _adjustOnAxis (target, o, h, sweepAndPrune, min, max, length) {
            if (o > h) {
                let r = max.call(sweepAndPrune, target) + length / 2;
                return o+SweepAndPrune2D.COLLISION_MARGIN < r || same(r, h) ? null : r;
            } else if (o < h) {
                let r = min.call(sweepAndPrune, target) - length / 2;
                return o-SweepAndPrune2D.COLLISION_MARGIN > r || same(r, h) ? null : r;
            } else return null;
        }
    );

    defineMethod(superClass,
        /**
         * Fix the position of a MOVED element so this element (if possible...) does not collide with another one on
         * physic host.
         * @param element element to fix
         * @param exclude elements to exclude from processing (these element are those that are not already processed so
         * their positions are not relevant).
         * @private
         */
        function _avoidCollisionsForElement(element, exclude, sap, record) {

            function adjust(targets, o, h) {
                for (let target of targets) {
                    let result = this._adjustOnTarget(element, target, o, h);
                    if (result) return result;
                }
                return this._noResult;
            }

            exclude.add(element);
            let s = element.lloc;
            let h = element.lloc;
            let finished = false;
            // Coords of last valid position of the element (we have to "go" in this direction...)
            let o = record.duplicate();
            // In order to avoid (= bug ?) infinite loop
            let cycleCount = 0;
            while (!finished && cycleCount < 100) {
                cycleCount++;
                let targets = this._collideWith(element, exclude, sap);
                if (targets.length > 0) {
                    // Get a proposition
                    let f = adjust.call(this, targets, o, h);
                    finished = this._getPlacement(f, h, o);
                    this._put(element, sap, h);
                } else {
                    finished = true;
                }
            }
            // If proposed position is "too far" from "current" position, revert to current position, but mark element
            // drag as invalid.
            if (h.getDistance(s) > SweepAndPrune2D.ADJUST_MARGIN) {
                this._put(element, sap, s);
                record.invalid = true;
            } else {
                // Fixing accepted: update drag infos.
                record = element.lloc;
                delete record.invalid;
            }
            exclude.delete(element);
        }
    );

    /**
     * Sets locations of dragged elements in order to avoid collisions between these dragged elements and
     * those already on physic's host, and dragged elements between them.
     * @param elements dragged elements
     */
    defineMethod(superClass,
        function _avoidCollisionsForDraggedElements(elements) {
            let exclude = new ESet(elements);
            for (let element of elements) {
                this._avoidCollisionsForElement(
                    element, exclude, this._dragAndDropSAP, element.validLocation);
            }
        }
    );

    defineMethod(superClass,
        function _avoidCollisionsForElements() {
            let elements = new List();
            for (let element of this._valids.keys()) {
                let record = this._valids.get(element);
                if (record.equals(element.lloc)) {
                    elements.add(element);
                }
            }
            let exclude = new ESet(elements);
            for (let element of elements) {
                this._avoidCollisionsForElement(
                    element, exclude, this._supportSAP, this._valids.get(element));
            }
        }
    );

}

export function makeCollisionPhysicForElements(superClass) {

    makeAbstractCollisionPhysic(superClass);

    defineMethod(superClass,
        function _createSweepAndPrunes() {
            this._supportSAP = new SweepAndPrune2D();
            this._dragAndDropSAP = new SweepAndPrune2D();
        }
    );

    defineGetProperty(superClass,
        function _noResult() {
            return {x: null, y: null}
        }
    );

    defineMethod(superClass,
        /**
         * Set the fixed position of the element and update physics internal structures accordingly. Note that this
         * element is ALWAYS a DnD'ed one.
         * @param element element to displace.
         * @param x new X ccords of the element
         * @param y new Y coords of the element.
         */
        function _put(element, sap, point) {
            // setLocation(), not move(), on order to keep the DnD fluid (floating elements not correlated).
            element.setLocation(point);
            sap.update(element);
        }
    );

    defineMethod(superClass,
        function _adjustOnTarget(element, target, o, h) {
            let sap = this.sweepAndPrune(target);
            let fx = this._adjustOnAxis(target, o.x, h.x, sap, sap.left, sap.right, element.width);
            let fy = this._adjustOnAxis(target, o.y, h.y, sap, sap.top, sap.bottom, element.height);
            if (fx !== null || fy !== null) {
                return {x: fx, y: fy};
            }
        }
    );

    defineMethod(superClass,
        /**
         * Looks for a valid location, using a proposed location (f) and an original - valid- location (o).
         * The result is given by the "h" point which is between f (best option) and o (worst option). for
         * ONE dimension (x OR y).
         * @param f proposal
         * @param h final location
         * @param o original (= last valid) location
         * @returns true if the final location is valid, false otherwise
         * @private
         */

        function _getPlacement(f, h, o) {
            // First case : we have to choice between X and Y : we get the smallest
            if (f.x !== null && f.y !== null) {
                let d = new Point2D(
                    f.x > h.x ? f.x - h.x : h.x - f.x,
                    f.y > h.y ? f.y - h.y : h.y - f.y
                );
                if (d.x > d.y) {
                    h.y = f.y;
                } else {
                    h.x = f.x;
                }
                // 2nd case : only one dimension is available
            } else if (f.x !== null) {
                h.x = f.x;
            } else if (f.y !== null) {
                h.y = f.y;
            } else {
                // Last case : no proposition is available. We revert to last valid position
                h.x = o.x;
                h.y = o.y;
                return true;
            }
            return false;
        }
    );
}

/**
 * Class of objects that materialize a container border, in order to prevent contained elements to collide with such
 * borders. Borders help to "box" contained element inside their container.
 */
export class PhysicBorder2D {

    /**
     * Creates a new Border
     * @param physic collision physic which this border object belong.
     * @param x <b>function, not value<b> that compute the central point location of the border on horizontal axis.
     * @param y <b>function, not value<b> that compute the central point location of the border on vertical axis.
     * @param width <b>function, not value<b> that compute the width of the border (0 or host's width, depending on border).
     * @param height <b>function, not value<b> that compute the height of the border (0 or host's width, depending on border).
     */
    constructor(physic, x, y, width, height) {
        this._physic = physic;
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    /**
     * Returns the border central point location on horizontal axis (in host's coordinate system).
     * @returns {*}
     */
    get lx() {
        return this._x();
    }

    /**
     * Returns the border central point location on vertical axis (in host's coordinate system).
     * @returns {*}
     */
    get ly() {
        return this._y();
    }

    /**
     * Returns the bounding box of the border (in host's coordinate system)
     * @returns {Box}
     */
    get localGeometry() {
        return new Box2D(this._x()-this._width()/2, this._y()-this._height()/2, this._width(), this._height());
    }

}

/**
 * This Trait add the "Borders" capability to a collision physic. A collision physic (only) with this capability may
 * prevent a contained element to collide with all or some of its (collision physic's) host borders (left/right/top/bottom).
 * @param superClass collision phuysic class
 * @param bordersCollide specify which borders may be "activated".
 */
export function addBordersToCollisionPhysicForElements(superClass, {bordersCollide}) {

    /**
     * Extends physic's init method in order to create the borders objects (inside collision physic) and bounds (inside
     * "supportSAP" object). Note that only borders mentioned in the borderCollide specificaion ave created.
     */
    extendMethod(superClass, $init=>
        function _init(...args) {
            $init.call(this, ...args);
            if (bordersCollide.left || bordersCollide.all) {
                this._addLeftBorder();
            }
            if (bordersCollide.right || bordersCollide.all) {
                this._addRightBorder();
            }
            if (bordersCollide.top || bordersCollide.all) {
                this._addTopBorder();
            }
            if (bordersCollide.bottom || bordersCollide.all) {
                this._addBottomBorder();
            }
            this._trigger();
        }
    );

    /**
     * Add a "left" border to collision physic.
     * @private
     */
    defineMethod(superClass,
        function _addLeftBorder() {
            this._leftBorder = new PhysicBorder2D(
                this,
                () => -this.host.width / 2,
                () => 0,
                () => 0,
                () => this.host.height
            );
            this._supportSAP.add(this._leftBorder);
            return this;
        }
    );

    /**
     * Add a "right" border to collision physic.
     * @private
     */
    defineMethod(superClass,
        function _addRightBorder() {
            this._rightBorder = new PhysicBorder2D(
                this,
                () => this.host.width / 2,
                () => 0,
                () => 0,
                () => this.host.height
            );
            this._supportSAP.add(this._rightBorder);
            return this;
        }
    );

    /**
     * Add a "top" border to collision physic.
     * @private
     */
    defineMethod(superClass,
        function _addTopBorder() {
            this._topBorder = new PhysicBorder2D(
                this,
                () => 0,
                () => -this.host.height / 2,
                () => this.host.width,
                () => 0
            );
            this._supportSAP.add(this._topBorder);
            return this;
        }
    );

    /**
     * Add a "bottom" border to collision physic.
     * @private
     */
    defineMethod(superClass,
        function _addBottomBorder() {
            this._bottomBorder = new PhysicBorder2D(
                this,
                () => 0,
                () => this.host.height / 2,
                () => this.host.width,
                () => 0
            );
            this._supportSAP.add(this._bottomBorder);
            return this;
        }
    );

    /**
     * Extends collision physic resize method so that method can warn the "support Sweep And Prune" object that borders
     * have moved (according to new host dimension) and their related bounds must be updated.
     * @param widrh new collision physic's host width
     * @param height new collision physic's host height
     */
    extendMethod(superClass, $resize=>
        function resize(width, height) {
            $resize && $resize.call(this, width, height);
            if (this._leftBorder) {
                this._supportSAP.update(this._leftBorder);
            }
            if (this._rightBorder) {
                this._supportSAP.update(this._rightBorder);
            }
            if (this._topBorder) {
                this._supportSAP.update(this._topBorder);
            }
            if (this._bottomBorder) {
                this._supportSAP.update(this._bottomBorder);
            }
        }
    );

    /**
     * Extends collision physic reset method so that method includes borders object and bounds in the
     * (re-)initialisation process.
     */
    extendMethod(superClass, $reset=>
        function _reset() {
            $reset.call(this);
            this._leftBorder && this._supportSAP.add(this._leftBorder);
            this._rightBorder && this._supportSAP.add(this._rightBorder);
            this._topBorder && this._supportSAP.add(this._topBorder);
            this._bottomBorder && this._supportSAP.add(this._bottomBorder);
        }
    );

}

/**
 * Utility method that creates a basic collision physic class.
 * @param predicate prdicate used by the new collision physic class to select elements subject to its placement logic.
 * @returns {CollisionPhysic}
 */
export function createCollisionPhysicForElements({predicate}) {
    class CollisionPhysic extends Physic {
        constructor(host, ...args) {
            super(host, predicate, ...args);
        }
    }
    makeCollisionPhysicForElements(CollisionPhysic);
    return CollisionPhysic;
}

export function makeCollisionContainerForElements(superClass, {predicate, bordersCollide = null}) {
    let ContainerPhysic = createCollisionPhysicForElements({predicate});
    if (bordersCollide) {
        addBordersToCollisionPhysicForElements(ContainerPhysic, {bordersCollide});
    }
    addPhysicToContainer(superClass, {
        physicBuilder: function() {
            return new ContainerPhysic(this);
        }
    });
    return superClass;
}

class GroundStructure2D {

    constructor() {
        this._id = 0;
        this._zones = new AVLTree((s1, s2)=>{
            let value = s1.right-s2.right;
            return value ? value : s1.id-s2.id;
        });
    }

    filter(element, record) {
        let left = record.left(element);
        let right = record.right(element);
        let it = this._zones.inside({right:left+SweepAndPrune2D.COLLISION_MARGIN, id:0}, null);
        let insideZones = [];
        let zone = it.next().value;
        while (zone && zone.left+SweepAndPrune2D.COLLISION_MARGIN < right) {
            insideZones.push(zone);
            zone = it.next().value;
        }
        return insideZones;
    }

    update(element, record, zone) {
        let left = record.left(element);
        let right = record.right(element);
        if (zone.left < left) {
            this._zones.insert({
                left:zone.left, right:left, id:this._id++, top:zone.top, element:zone.element
            });
        }
        if (zone.right > right) {
            zone.left = right;
        }
        else {
            this._zones.delete(zone);
        }
    }

    add(element, record) {
        let left = record.left(element);
        let right = record.right(element);
        let top = record.top(element);
        this._zones.insert({left, right, id:this._id++, top, element});
    }
}

export class AbstractGround {

    constructor(physic) {
        this._physic = physic;
        this._structure = this._createGroundStructure();
    }

    process(element, update=true) {

        function setCarriedBy(element, under, supports) {
            element._fall.carriers = new ESet(supports);
            for (let support of under) {
                if (!support._fall.under) support._fall.under = new ESet();
                support._fall.under.add(element);
            }
            for (let support of supports) {
                if (!support._fall.carried) support._fall.carried = new ESet();
                support._fall.carried.add(element);
            }
        }

        let record = this._physic._supportSAP._getRecord(element);
        let top = record.top(element);
        let ground = this._physic._host.bottom;
        let supports = new ESet();
        let under = new ESet();
        for (let segment of this._structure.filter(element, record)) {
            under.add(segment.element);
            if (same(segment.top, ground)) {
                supports.add(segment.element);
            }
            else if (segment.top < ground) {
                ground = segment.top;
                supports = new ESet([segment.element]);
            }
            this._structure.update(element, record, segment);
        }
        if (update && this._physic._canFall(element)) {
            let ly = ground - (record.bottom(element) - record.y(element));
            if (ly !== element.ly) {
                element.setLocation(this._fallingPoint(element, ly));
                this._physic._supportSAP.update(element);
                top = record.top(element);
            }
        }
        setCarriedBy(element, under, supports);
        this._structure.add(element, record);
    }

}

export class GroundForElements extends AbstractGround {

    _createGroundStructure() {
        return new GroundStructure2D();
    }

    _fallingPoint(element, y) {
        let record = this._physic._supportSAP._getRecord(element);
        return new Point2D(record.x(element), y);
    }

}

export function addGravitationToCollisionPhysic(superClass, {
    gravitationPredicate = element=>true,
    carryingPredicate = (carrier, carried, dpoint)=>true
}={}) {

    defineMethod(superClass,
        function _setCarried(elements) {
            for (let element of elements) {
                if (element.isCarriable && element._fall.carriers) {
                    for (let support of element._fall.carriers) {
                        let dpoint = element.lloc;
                        if (support.isCarrier && carryingPredicate(support, element, dpoint)) {
                            if (!element.carriedBy(support)) {
                                support.addCarried(element);
                            }
                            else {
                                support.moveCarried(element);
                            }
                        }
                    }
                }
                if (element.isCarrier) {
                    for (let child of element.carried) {
                        if (!element._fall.carried || !element._fall.carried.has(child)) {
                            element.removeCarried(child);
                        }
                    }
                }
                delete element._fall;
            }
        }
    );

    defineMethod(superClass,
        function _canFall(element) {
            return gravitationPredicate.call(this, element);
        }
    );

    defineMethod(superClass,
        function _letFall(elements, ground) {

            let comparator = (e1, e2)=> {
                let b1 = this._supportSAP.bottom(e1);
                let b2 = this._supportSAP.bottom(e2);
                return b2-b1;
            };

            elements.sort(comparator);
            for (let element of elements) {
                !element._fall && (element._fall = {});
            }
            for (let element of elements) {
                ground.process(element);
            }
        }
    );

    defineMethod(superClass,
        function _processElements() {
            let elements = new List(...this._elements);
            this._letFall(elements, this._createGround());
            this._setCarried(elements);
        }
    );

    extendMethod(superClass, $refresh=>
        function _refresh() {
            $refresh.call(this);
            this._processElements();
        }
    );

}

export function addGravitationToCollisionPhysicForElements(superClass, {gravitationPredicate, carryingPredicate}) {

    addGravitationToCollisionPhysic(superClass, {gravitationPredicate, carryingPredicate});

    defineMethod(superClass,
        function _createGround() {
            return new GroundForElements(this);
        }
    );

}

export function createGravitationPhysicForElements({predicate, gravitationPredicate, carryingPredicate}) {
    class GravitationPhysic extends createCollisionPhysicForElements({predicate}) {

        constructor(host, ...args) {
            super(host, ...args);
        }
    }
    addGravitationToCollisionPhysicForElements(GravitationPhysic, {gravitationPredicate, carryingPredicate});
    return GravitationPhysic;
}

export function makeGravitationContainerForElements(superClass, {
    predicate, gravitationPredicate, carryingPredicate, bordersCollide = null
}) {
    let ContainerPhysic = createGravitationPhysicForElements({predicate, gravitationPredicate, carryingPredicate});
    if (bordersCollide) {
        addBordersToCollisionPhysicForElements(ContainerPhysic, {bordersCollide});
    }

    addPhysicToContainer(superClass, {
        physicBuilder: function() {
            return new ContainerPhysic(this);
        }
    });

    return superClass;
}

export function makeCarrier(superClass) {

    defineGetProperty(superClass,
        function isCarrier() {
            return true;
        }
    );

    defineGetProperty(superClass,
        function carried() {
            return this._carried ? this._carried.keys() : [];
        }
    );

    defineMethod(superClass,
        function addCarried(element) {
            if (element.__addCarriedBy) {
                Memento.register(this);
                Memento.register(element);
                this._addCarried(element);
                this._fire(Events.ADD_CARRIED, element);
                element._fire(Events.ADD_CARRIER, this);
            }
        }
    );

    defineMethod(superClass,
        function moveCarried(element) {
            if (element.__addCarriedBy) {
                Memento.register(this);
                Memento.register(element);
                this._moveCarried(element);
                this._fire(Events.MOVE_CARRIED, element);
                element._fire(Events.MOVE_CARRIER, this);
            }
        }
    );

    defineMethod(superClass,
        function removeCarried(element) {
            if (element.__removeCarriedBy) {
                Memento.register(this);
                Memento.register(element);
                this._removeCarried(element);
                this._fire(Events.REMOVE_CARRIED, element);
                element._fire(Events.REMOVE_CARRIER, this);
            }
        }
    );

    defineMethod(superClass,
        function __addCarried(element, record) {
            if (!this._carried) {
                this._carried = new Map();
            }
            this._carried.set(element, record);
        }
    );

    defineMethod(superClass,
        function __moveCarried(element, record) {
            this._carried.set(element, record);
        }
    );

    defineMethod(superClass,
        function __removeCarried(element) {
            if (this._carried) {
                this._carried.delete(element);
                if (!this._carried.size) {
                    delete this._carried;
                }
            }
        }
    );

    defineMethod(superClass,
        function carry(element) {
            return this._carried && this._carried.has(element);
        }
    );

    defineMethod(superClass,
        function _addCarried(element) {
            let record = new CloneableObject({
                dx:element.lx-this.lx,
                dy:element.ly-this.ly
            });
            this.__addCarried(element, record);
            element.__addCarriedBy(this, record);
        }
    );

    defineMethod(superClass,
        function _moveCarried(element) {
            let record = new CloneableObject({
                dx:element.lx-this.lx,
                dy:element.ly-this.ly
            });
            this.__moveCarried(element, record);
            element.__moveCarriedBy(this, record);
        }
    );

    defineMethod(superClass,
        function _removeCarried(element) {
            this.__removeCarried(element);
            element.__removeCarriedBy(this);
        }
    );

    defineMethod(superClass,
        function _clearCarried() {
            delete this._carried;
        }
    );

    extendMethod(superClass, $getExtension=>
        function getExtension(extension) {
            let elemExtension = $getExtension ? $getExtension.call(this, extension) : new ESet();
            extension = extension ? extension.merge(elemExtension) : elemExtension;
            if (this._carried) {
                for (let element of this._carried.keys()) {
                    if (!extension.has(element)) {
                        extension.add(element);
                        if (element.getExtension) {
                            for (let child of element.getExtension(extension)) {
                                extension.add(child);
                            }
                        }
                    }
                }
            }
            return extension
        }
    );

    extendMethod(superClass, $move=>
        function move(point) {
            if ($move.call(this, point)) {
                if (this._carried) {
                    for (let element of this._carried.keys()) {
                        let record = this._carried.get(element);
                        if (element.support === this.support) {
                            element.move(new Point2D(this.lx + record.dx, this.ly + record.dy));
                        }
                    }
                }
                return true;
            }
            return false;
        }
    );

    extendMethod(superClass, $cancelDrop=>
        function _cancelDrop(dragOperation) {
            $cancelDrop && $cancelDrop.call(this, dragOperation);
            if (this._carried) {
                for (let element of this._carried.keys()) {
                    if (!dragOperation.dropCancelled(element)) {
                        dragOperation.cancelDrop(element);
                    }
                }
            }
        }
    );

    extendMethod(superClass, $cloned=>
        function _cloned(copy, duplicata) {
            $cloned && $cloned.call(this, copy, duplicata);
            if (this._carried) {
                for (let element of this._carried.keys()) {
                    let childCopy = duplicata.get(element);
                    let record = this._carried.get(element);
                    copy.__addCarried(childCopy, record);
                }
            }
        }
    );

    extendMethod(superClass, $revertDroppedIn=>
        function _revertDroppedIn() {
            $revertDroppedIn && $revertDroppedIn.call(this);
            if (this._carried) {
                for (let element of this._carried.keys()) {
                    let record = this._carried.get(element);
                    element.__addCarriedBy(this, record);
                }
            }
        }
    );

    extendMethod(superClass, $delete=>
        function delete_() {
            let result = $delete.call(this);
            if (this._carried) {
                for (let element of this._carried.keys()) {
                    this.removeCarried(element);
                }
            }
            return result;
        }
    );

    extendMethod(superClass, $memento=>
        function _memento() {
            let memento = $memento.call(this);
            if (this._carried) {
                memento._carried = new Map(this._carried);
            }
            return memento;
        }
    );

    extendMethod(superClass, $revert=>
        function _revert(memento) {
            $revert.call(this, memento);
            if (memento._carried) {
                this._carried = new Map(memento._carried);
            }
            else {
                delete this._carried;
            }
            return this;
        }
    );

}

export function makeCarriable(superClass) {

    defineGetProperty(superClass,
        function isCarriable() {
            return true;
        }
    );

    defineGetProperty(superClass,
        function carriers() {
            return this._carriedBy ? this._carriedBy.keys() : [];
        }
    );

    defineMethod(superClass,
        function _clearCarriedBy() {
            delete this._carriedBy;
        }
    );

    defineMethod(superClass,
        function __addCarriedBy(element, record) {
            if (!this._carriedBy) {
                this._carriedBy = new Map();
            }
            this._carriedBy.set(element, record);
        }
    );

    defineMethod(superClass,
        function __moveCarriedBy(element, record) {
            this._carriedBy.set(element, record);
        }
    );

    defineMethod(superClass,
        function __removeCarriedBy(element) {
            if (this._carriedBy) {
                this._carriedBy.delete(element);
                if (!this._carriedBy.size) {
                    delete this._carriedBy;
                }
            }
        }
    );

    defineMethod(superClass,
        function carriedBy(support) {
            return this._carriedBy && this._carriedBy.has(support);
        }
    );

    defineMethod(superClass,
        function clearCarriedBy() {
            if (this._carriedBy) {
                for (let support of [...this._carriedBy.keys()]) {
                    support.removeCarried(this);
                }
            }
        }
    );

    extendMethod(superClass, $draggedFrom=>
        function _draggedFrom(support, dragSet) {
            $draggedFrom && $draggedFrom.call(this, support, dragSet);
            if (this._carriedBy) {
                for (let support of [...this._carriedBy.keys()]) {
                    if (!dragSet.has(support)) {
                        support.removeCarried(this);
                    }
                }
            }
        }
    );

    extendMethod(superClass, $revertDroppedIn=>
        function _revertDroppedIn() {
            $revertDroppedIn && $revertDroppedIn.call(this);
            if (this._carriedBy) {
                for (let element of this._carriedBy.keys()) {
                    let record = this._carriedBy.get(element);
                    element.__addCarried(this, record);
                }
            }
        }
    );

    extendMethod(superClass, $cloned=>
        function _cloned(copy, duplicata) {
            $cloned && $cloned.call(this, copy, duplicata);
            if (this._carriedBy) {
                for (let element of this._carriedBy.keys()) {
                    let childCopy = duplicata.get(element);
                    let record = this._carriedBy.get(element);
                    copy.__addCarriedBy(childCopy, record);
                }
            }
        }
    );

    extendMethod(superClass, $delete=>
        function delete_() {
            let result = $delete.call(this);
            if (this._carriedBy) {
                for (let element of this._carriedBy.keys()) {
                    element.removeCarried(this);
                }
            }
            return result;
        }
    );

    extendMethod(superClass, $memento=>
        function _memento() {
            let memento = $memento.call(this);
            if (this._carriedBy) {
                memento._carriedBy = new Map(this._carriedBy);
            }
            return memento;
        }
    );

    extendMethod(superClass, $revert=>
        function _revert(memento) {
            $revert.call(this, memento);
            if (memento._carriedBy) {
                this._carriedBy = new Map(memento._carriedBy);
            }
            else {
                delete this._carriedBy;
            }
            return this;
        }
    );

}

export const Glue = {
    NONE:0,         // Elements should not be glued
    EXTEND:1,       // Elements should be glued. This element must add glued element to its extension
    BREAK:2         // Elements should be glued. This element must not add glued element to its extension
};

export function makeDroppedElementsToGlue(superClass, {gluingStrategy=(element1, element2)=>Glue.EXTEND}={}) {

    extendMethod(superClass, $receiveDrop=>
        function _receiveDrop(element, dragSet) {
            $receiveDrop.call(this);
            if (element.isGlueable) {
                let alreadyGlued = element.getGlued(true, true, true, true);
                let gluedElements = this._supportSAP.near(element, 1, 1, 1, 1);
                for (let neighbour of gluedElements) {
                    if (!alreadyGlued.has(neighbour)) {
                        if (gluingStrategy(element, neighbour)!==Glue.NONE) {
                            element.glue(neighbour, gluingStrategy);
                        }
                    }
                    else {
                        alreadyGlued.delete(neighbour);
                    }
                }
                for (let neighbour of alreadyGlued) {
                    element.unglue(neighbour);
                }
            }
        }
    );

}

export function makeGlueable(superClass) {

    defineGetProperty(superClass,
        function isGlueable() {
            return true;
        }
    );

    defineMethod(superClass,
        function __glue(element, record) {
            if (!this._gluedWith) {
                this._gluedWith = new Map();
            }
            this._gluedWith.set(element, record);
        }
    );

    defineMethod(superClass,
        function __unglue(element) {
            if (this._gluedWith) {
                this._gluedWith.delete(element);
                if (!this._gluedWith.size) {
                    delete this._gluedWith;
                }
            }
        }
    );

    defineMethod(superClass,
        function _glue(element, strategy) {
            this.__glue(element, this._createRecord(element, strategy));
            element.__glue(this, element._createRecord(this, strategy));
        }
    );

    defineMethod(superClass,
        function _unglue(element) {
            this.__unglue(element);
            element.__unglue(this);
        }
    );

    defineMethod(superClass,
        function glue(element, strategy=(element1, element2)=>Glue.EXTEND) {
            if (element.isGlueable && (!this._gluedWith || !this._gluedWith.has(element))) {
                Memento.register(this);
                Memento.register(element);
                this._glue(element, strategy);
                element._fire(Events.ADD_GLUED, this);
                this._fire(Events.ADD_GLUED, element);
            }
        }
    );

    defineMethod(superClass,
        function unglue(element) {
            if (element.isGlueable && this._gluedWith && this._gluedWith.has(element)) {
                Memento.register(this);
                Memento.register(element);
                this._unglue(element);
                element._fire(Events.REMOVE_GLUED, this);
                this._fire(Events.REMOVE_GLUED, element);
            }
        }
    );

    defineMethod(superClass,
        function _createRecord(element, strategy) {
            return new CloneableObject({
                dx: element.lx - this.lx,
                dy: element.ly - this.ly,
                strategy
            })
        }
    );

    defineMethod(superClass,
        function clearGlued() {
            if (this._gluedWith) {
                for (let element of [...this._gluedWith.keys()]) {
                    this.unglue(element);
                }
            }
        }
    );

    defineGetProperty(superClass,
        function gluedWith() {
            return this._gluedWith ? this._gluedWith.keys() : [];
        }
    );

    defineMethod(superClass,
        function getGlued(left = true, top = true, right = true, bottom = true) {
            let gluedWidth = new ESet();
            if (this._gluedWith) {
                let tlx = this.lx, tly = this.ly,
                    tw = this.width/2-SweepAndPrune2D.COLLISION_MARGIN,
                    th = this.height/2-SweepAndPrune2D.COLLISION_MARGIN;
                for (let neighbour of this._gluedWith) {
                    let nlx = neighbour.lx, nly = neighbour.ly,
                        nw = neighbour.width / 2 - SweepAndPrune2D.COLLISION_MARGIN,
                        nh = neighbour.height / 2 - SweepAndPrune2D.COLLISION_MARGIN;
                    if (left && nlx + nw <= tlx - tw) gluedWidth.add(neighbour);
                    else if (top && nly + nh <= tly - th) gluedWidth.add(neighbour);
                    else if (right && nlx - nw >= tlx + tw) gluedWidth.add(neighbour);
                    else if (bottom && nly - nh >= tly + th) gluedWidth.add(neighbour);
                }
            }
            return gluedWidth;
        }
    );

    extendMethod(superClass, $getExtension=>
        function getExtension(extension) {
            let elemExtension = $getExtension ? $getExtension.call(this, extension) : new ESet();
            extension = extension ? extension.merge(elemExtension) : elemExtension;
            if (this._gluedWith) {
                for (let element of this._gluedWith.keys()) {
                    let record = this._gluedWith.get(element);
                    if (!extension.has(element) && record.strategy(this, element, record.dx, record.dy)===Glue.EXTEND) {
                        extension.add(element);
                        if (element.getExtension) {
                            for (let child of element.getExtension(extension)) {
                                extension.add(child);
                            }
                        }
                    }
                }
            }
            return extension
        }
    );

    extendMethod(superClass, $draggedFrom=>
        function _draggedFrom(support, dragSet) {
            $draggedFrom && $draggedFrom.call(this, support, dragSet);
            if (this._gluedWith) {
                for (let element of [...this._gluedWith.keys()]) {
                    let record = this._gluedWith.get(element);
                    if (record.strategy(this, element, record.dx, record.dy)!==Glue.EXTEND && !dragSet.has(element)) {
                        this.unglue(element);
                    }
                }
            }
        }
    );

    extendMethod(superClass, $revertDroppedIn=>
        function _revertDroppedIn() {
            $revertDroppedIn && $revertDroppedIn.call(this);
            if (this._gluedWith) {
                for (let element of this._gluedWith.keys()) {
                    element.__glue(this, element._createRecord(this));
                }
            }
        }
    );

    extendMethod(superClass, $cancelDrop=>
        function _cancelDrop(dragOperation) {
            $cancelDrop && $cancelDrop.call(this, dragOperation);
            if (this._gluedWith) {
                for (let element of this._gluedWith.keys()) {
                    if (!dragOperation.dropCancelled(element)) {
                        dragOperation.cancelDrop(element);
                    }
                }
            }
        }
    );

    extendMethod(superClass, $cloned=>
        function _cloned(copy, duplicata) {
            $cloned && $cloned.call(this, copy, duplicata);
            if (this._gluedWith) {
                for (let element of this._gluedWith.keys()) {
                    let childCopy = duplicata.get(element);
                    let record = this._gluedWith.get(element);
                    copy.__glue(childCopy, record);
                }
            }
        }
    );

    extendMethod(superClass, $delete=>
        function delete_() {
            let result = $delete.call(this);
            if (this._gluedWith) {
                for (let element of this._gluedWith.keys()) {
                    element.removeCarried(this);
                }
            }
            return result;
        }
    );

    extendMethod(superClass, $memento=>
        function _memento() {
            let memento = $memento.call(this);
            if (this._gluedWith) {
                memento._gluedWith = new Map(this._gluedWith);
            }
            return memento;
        }
    );

    extendMethod(superClass, $revert=>
        function _revert(memento) {
            $revert.call(this, memento);
            if (memento._gluedWith) {
                this._gluedWith = new Map(memento._gluedWith);
            }
            else {
                delete this._gluedWith;
            }
            return this;
        }
    );

}

export function addGlueToGravitationPhysic(
    superClass) {

    addGravitationToCollisionPhysic(superClass);

    defineMethod(superClass,
        function _getBlocks(elements) {

            function setToBlock(blocks, element, block) {
                block.elements.add(element);
                blocks.set(element, block);
                element._fall.block = block;
            }

            let blocks = new Map();
            for (let element of elements) {
                let block = element._fall.block;
                if (!block) {
                    block = {
                        elements : new ESet(),
                        bottom : this._supportSAP.bottom(element)
                    };
                    setToBlock(blocks, element, block);
                }
                if (element.isGlueable) {
                    for (let neighbour of element.gluedWith) {
                        let nblock = neighbour._fall.block;
                        if (nblock) {
                            for (let friend of nblock.elements) {
                                setToBlock(blocks, friend, block);
                            }
                        }
                        else {
                            setToBlock(blocks, neighbour, block);
                        }
                    }
                }
            }
            return [...new ESet(blocks.values())];
        }
    );

    defineMethod(superClass,
        function _processBlock(block) {

            function ascend(element, dy, carrier) {
                if (same(dy, 0)) {
                    if (carrier) {
                        element._fall.carriers ? element._fall.carriers.add(carrier) : element._fall.carriers = new ESet([carrier]);
                        carrier._fall.carried ? carrier._fall.carried.add(element) : carrier._fall.carried = new ESet([element]);
                    }
                }
                else if (dy > 0) {
                    let ly = element.ly - dy;
                    let ely = ly - element._fall.ly;
                    if (element._fall.block.dy>ely) {
                        element._fall.block.dy = ely;
                    }
                    element.setLocation(new Point2D(element.lx, ly));
                    this._supportSAP.update(element);
                    if (element._fall.under) {
                        for (let carried of element._fall.under) {
                            let mdy = this._supportSAP.top(element)-this._supportSAP.bottom(carried);
                            ascend.call(this, carried, -mdy, element);
                        }
                    }
                    if (carrier) {
                        element._fall.carriers = new ESet([carrier]);
                        carrier._fall.carried = new ESet([element]);
                    }
                }
            }

            for (let element of block.elements) {
                let dy = element.ly-element._fall.ly-block.dy;
                ascend.call(this, element, dy, null);
            }
        }
    );

    replaceMethod(superClass,
        function _processElements() {
            function computeBlockFall(block) {
                block.dy = Infinity;
                for (let element of block.elements) {
                    let dy = element.ly - element._fall.ly;
                    if (dy<block.dy) block.dy = dy;
                }
            }

            let elements = new List(...this._elements);
            for (let element of elements) {
                element._clearCarried && element._clearCarried();
                element._clearCarriedBy && element._clearCarriedBy();
                element._fall = {ly: element.ly};
            }
            let blocks = this._getBlocks(elements);
            this._letFall(elements, new GroundForElements(this));
            for (let block of blocks) {
                computeBlockFall(block);
            }
            blocks.sort((b1, b2)=>b1.dy - b2.dy);
            for (let block of blocks) {
                this._processBlock(block);
            }
            this._setCarried(this._elements);
        }
    );

}

export function createStickyGravitationPhysicForElements({
      predicate, gravitationPredicate, carryingPredicate, gluingStrategy
  }) {

    class StickyGravitationPhysicForElements extends createCollisionPhysicForElements({
        predicate, gravitationPredicate, carryingPredicate
    }) {
        constructor(host, ...args) {
            super(host, predicate, ...args);
        }
    }
    addGlueToGravitationPhysic(StickyGravitationPhysicForElements);
    if (gluingStrategy) {
        makeDroppedElementsToGlue(StickyGravitationPhysicForElements, {gluingStrategy});
    }
    return StickyGravitationPhysicForElements;
}

export function makeStickyGravitationContainerForElements(superClass, {
    predicate, gravitationPredicate, carryingPredicate,
    gluingStrategy = null,
    bordersCollide
}) {
    class ContainerPhysic extends createStickyGravitationPhysicForElements({
        predicate, gravitationPredicate, carryingPredicate, gluingStrategy
    }) {}

    if (bordersCollide) {
        addBordersToCollisionPhysicForElements(ContainerPhysic, bordersCollide);
    }
    addPhysicToContainer(superClass, {
        physicBuilder: function() {
            return new ContainerPhysic(this);
        }
    });
    return superClass;
}
