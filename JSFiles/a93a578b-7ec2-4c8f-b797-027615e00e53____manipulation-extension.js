import { CAP_TYPES } from "./vicowa-webgl-definitions.js";
import { vectorLength, angleToPoint, pointToAngle, vectorSubtract, vectorAdd, toRadians } from "../utilities/mathHelpers.js";

const MANIPULATOR_GROUP_TYPES = Object.freeze({
	MOVE: "MOVE",
	SCALE: "SCALE",
	ROTATE: "ROTATE",
});

export const MANIPULATOR_TYPES = Object.freeze({
	MOVE_X: "MOVE_X",
	MOVE_Y: "MOVE_Y",
	MOVE_Z: "MOVE_Z",
	MOVE_PLANE: "MOVE_PLANE",
	SCALE: "SCALE",
	SCALE_X: "SCALE_X",
	SCALE_Y: "SCALE_Y",
	SCALE_Z: "SCALE_Z",
	ROTATE_X: "ROTATE_X",
	ROTATE_Y: "ROTATE_Y",
	ROTATE_Z: "ROTATE_Z",
});

const privateData = Symbol("privateData");
const manipulation = Symbol("manipulation");
const manipulatorRenderingGroup = 1;

function createMoveObject(name, extensionData) {
	const moveObject = extensionData.webglIF.createGroup(name);
	moveObject.addChild(extensionData.webglIF.createSphere({ diameter: 0.2, rotation: { x: 90, y: 0, z: 0 }, material: "move-manipulator-unselected", renderingGroupId: manipulatorRenderingGroup }));
	moveObject.addChild(extensionData.webglIF.createCylinder({ diameter: 0.05, height: 0.15, position: { y: -0.2 }, renderingGroupId: manipulatorRenderingGroup }));
	moveObject.addChild(extensionData.webglIF.createCylinder({ diameterTop: 0, diameterBottom: 0.1, height: 0.1, position: { y: -0.3 }, rotation: { x: 0, y: 0, z: 180 }, renderingGroupId: manipulatorRenderingGroup }));
	moveObject.addChild(extensionData.webglIF.createCylinder({ diameter: 0.05, height: 0.15, position: { y: 0.2 }, renderingGroupId: manipulatorRenderingGroup }));
	moveObject.addChild(extensionData.webglIF.createCylinder({ diameterTop: 0, diameterBottom: 0.1, height: 0.1, position: { y: 0.3 }, renderingGroupId: manipulatorRenderingGroup }));
	moveObject.visible = false;

	return moveObject;
}

function createPlaneMoveObject(name, extensionData) {
	const moveObject = extensionData.webglIF.createGroup(name);
	moveObject.addChild(extensionData.webglIF.createSphere({ diameter: 0.2, rotation: { x: 90, y: 0, z: 0 }, material: "move-manipulator-unselected", renderingGroupId: manipulatorRenderingGroup }));
	moveObject.addChild(extensionData.webglIF.createCylinder({ diameter: 0.05, height: 0.15, position: { y: -0.2 }, renderingGroupId: manipulatorRenderingGroup }));
	moveObject.addChild(extensionData.webglIF.createCylinder({ diameterTop: 0, diameterBottom: 0.1, height: 0.1, position: { y: -0.3 }, rotation: { z: 180 }, renderingGroupId: manipulatorRenderingGroup }));
	moveObject.addChild(extensionData.webglIF.createCylinder({ diameter: 0.05, height: 0.15, position: { y: 0.2 }, renderingGroupId: manipulatorRenderingGroup }));
	moveObject.addChild(extensionData.webglIF.createCylinder({ diameterTop: 0, diameterBottom: 0.1, height: 0.1, position: { y: 0.3 }, renderingGroupId: manipulatorRenderingGroup }));

	moveObject.addChild(extensionData.webglIF.createCylinder({ diameter: 0.05, height: 0.15, position: { z: -0.2 }, rotation: { x: 90 }, renderingGroupId: manipulatorRenderingGroup }));
	moveObject.addChild(extensionData.webglIF.createCylinder({ diameterTop: 0, diameterBottom: 0.1, height: 0.1, position: { z: -0.3 }, rotation: { x: 90, z: 180 }, renderingGroupId: manipulatorRenderingGroup }));
	moveObject.addChild(extensionData.webglIF.createCylinder({ diameter: 0.05, height: 0.15, position: { z: 0.2 }, rotation: { x: -90 }, renderingGroupId: manipulatorRenderingGroup }));
	moveObject.addChild(extensionData.webglIF.createCylinder({ diameterTop: 0, diameterBottom: 0.1, height: 0.1, position: { z: 0.3 }, rotation: { x: -90, z: 180 }, renderingGroupId: manipulatorRenderingGroup }));
	moveObject.visible = false;

	return moveObject;
}

function createScaleObject(name, extensionData) {
	const scaleObject = extensionData.webglIF.createGroup(name);
	scaleObject.addChild(extensionData.webglIF.createSphere({ diameter: 0.15, diameterZ: 0.3, rotation: { x: 90, y: 0, z: 0 }, material: "scale-manipulator-unselected", renderingGroupId: manipulatorRenderingGroup }));
	scaleObject.addChild(extensionData.webglIF.createCylinder({ diameterTop: 0, diameterBottom: 0.1, height: 0.1, position: { y: -0.3 }, rotation: { x: 0, y: 0, z: 180 }, renderingGroupId: manipulatorRenderingGroup }));
	scaleObject.addChild(extensionData.webglIF.createCylinder({ diameter: 0.05, height: 0.6, renderingGroupId: manipulatorRenderingGroup }));
	scaleObject.addChild(extensionData.webglIF.createCylinder({ diameterTop: 0, diameterBottom: 0.1, height: 0.1, position: { y: 0.3 }, renderingGroupId: manipulatorRenderingGroup }));
	scaleObject.visible = false;

	return scaleObject;
}

function createRotateObject(name, extensionData) {
	const rotateObject = extensionData.webglIF.createGroup(name);
	rotateObject.addChild(extensionData.webglIF.createSphere({ diameter: 0.2, rotation: { x: 90, y: 0, z: 0 }, material: "rotate-manipulator-unselected", renderingGroupId: manipulatorRenderingGroup }));
	const path = [];
	const arc = toRadians(270);
	const startAngle = toRadians(0);
	const stepSize = arc / 16;
	const dist = 0.2;
	for (let rad = startAngle; rad < startAngle + arc; rad += stepSize) {
		path.push([Math.sin(rad) * dist, Math.cos(rad) * dist, 0]);
	}
	rotateObject.addChild(extensionData.webglIF.createTube({ radius: 0.025, cap: CAP_TYPES.CAP_ALL, path, renderingGroupId: manipulatorRenderingGroup }));
	rotateObject.addChild(extensionData.webglIF.createCylinder({ diameterTop: 0, diameterBottom: 0.1, height: 0.1, position: { x: -0.2 }, rotation: { x: 0, y: 0, z: 0 }, renderingGroupId: manipulatorRenderingGroup }));
	rotateObject.visible = false;

	return rotateObject;
}

function createManipulatorTemplates(extension) {
	const extensionData = extension[privateData];
	extensionData.manipulators[MANIPULATOR_TYPES.MOVE_X] = extensionData.manipulators[MANIPULATOR_TYPES.MOVE_Y] = extensionData.manipulators[MANIPULATOR_TYPES.MOVE_Z] = createMoveObject("move-manipulator", extensionData);
	extensionData.manipulators[MANIPULATOR_TYPES.MOVE_PLANE] = createPlaneMoveObject("move-manipulator", extensionData);
	extensionData.manipulators[MANIPULATOR_TYPES.SCALE_X] = extensionData.manipulators[MANIPULATOR_TYPES.SCALE_Y] = extensionData.manipulators[MANIPULATOR_TYPES.SCALE_Z] = extensionData.manipulators[MANIPULATOR_TYPES.SCALE] = createScaleObject("scale-manipulator", extensionData);
	extensionData.manipulators[MANIPULATOR_TYPES.ROTATE_X] = extensionData.manipulators[MANIPULATOR_TYPES.ROTATE_Y] = extensionData.manipulators[MANIPULATOR_TYPES.ROTATE_Z] = createRotateObject("rotate-manipulator", extensionData);
}

function createAndAttachManipulatorInstance(manipulatorName, extension, obj, settings) {
	const extensionData = extension[privateData];
	const name = `${manipulatorName}-${obj.name}`;
	obj.getChildren((childObject) => childObject.name === name).forEach((childObject) => obj.removeChild(childObject));
	const clonedObject = extensionData.manipulators[manipulatorName].clone(name);
	extensionData.webglIF.applySettings(Object.assign({ collisions: true, visible: true }, settings), clonedObject);
	clonedObject.manipulatorType = manipulatorName;
	obj.addChild(clonedObject);
}

function attachMoveXManipulator(extension, object, settings) {
	createAndAttachManipulatorInstance(MANIPULATOR_TYPES.MOVE_X, extension, object, settings);
}
function attachMoveYManipulator(extension, object, settings) {
	createAndAttachManipulatorInstance(MANIPULATOR_TYPES.MOVE_Y, extension, object, settings);
}
function attachMoveZManipulator(extension, object, settings) {
	createAndAttachManipulatorInstance(MANIPULATOR_TYPES.MOVE_Z, extension, object, settings);
}
function attachMovePlaneManipulator(extension, object, settings) {
	createAndAttachManipulatorInstance(MANIPULATOR_TYPES.MOVE_PLANE, extension, object, settings);
}
function attachScaleXManipulator(extension, object, settings) {
	createAndAttachManipulatorInstance(MANIPULATOR_TYPES.SCALE_X, extension, object, settings);
}
function attachScaleYManipulator(extension, object, settings) {
	createAndAttachManipulatorInstance(MANIPULATOR_TYPES.SCALE_Y, extension, object, settings);
}
function attachScaleZManipulator(extension, object, settings) {
	createAndAttachManipulatorInstance(MANIPULATOR_TYPES.SCALE_Z, extension, object, settings);
}
function attachScaleManipulator(extension, object, settings) {
	createAndAttachManipulatorInstance(MANIPULATOR_TYPES.SCALE, extension, object, settings);
}
function attachRotateAroundXManipulator(extension, object, settings) {
	createAndAttachManipulatorInstance(MANIPULATOR_TYPES.ROTATE_X, extension, object, settings);
}
function attachRotateAroundYManipulator(extension, object, settings) {
	createAndAttachManipulatorInstance(MANIPULATOR_TYPES.ROTATE_Y, extension, object, settings);
}
function attachRotateAroundZManipulator(extension, object, settings) {
	createAndAttachManipulatorInstance(MANIPULATOR_TYPES.ROTATE_Z, extension, object, settings);
}

function attachManipulators(extension, object, clickPoint) {
	const extensionData = extension[privateData];
	const allowed = object[manipulation].allowed;
	const activeGroup = object[manipulation].activeGroup;
	const manipulatorPlane = object[manipulation].manipulatorPlane;
	extension.removeManipulators(object.name);

	if (allowed && Object.keys(allowed).find((key) => MANIPULATOR_TYPES[key] && allowed[key])) {
		const center = object.center;
		const boundingVectors = object.boundingVectors;

		const manipulatorObject = extensionData.webglIF.createGroup(`manipulator-for-${object.name}`);
		extensionData.activeManipulationObjects[manipulatorObject.name] = manipulatorObject;
		manipulatorObject.manipulatedObject = object;
		manipulatorObject.manipulatedObject.onRemove = (removingObject) => {
			extension.removeManipulators(removingObject.name);
		};

		const getPosition = (targetOffsetX, targetOffsetY) => {
			const screenPoint = extensionData.webglIF.pointToScreenPoint(clickPoint || center);
			const planePointPair = extensionData.webglIF.screenPointToBoundingProjection(screenPoint, object);
			const distance = vectorLength(vectorSubtract(planePointPair.intersection, planePointPair.start));
			const factor = 1 / distance;
			const position = {
				x: planePointPair.intersection.x - ((planePointPair.intersection.x - planePointPair.start.x) * factor),
				y: planePointPair.intersection.y - ((planePointPair.intersection.y - planePointPair.start.y) * factor),
				z: planePointPair.intersection.z - ((planePointPair.intersection.z - planePointPair.start.z) * factor),
			};
			const vector = vectorSubtract(planePointPair.intersection, planePointPair.start);
			const zAngle = 0;
			const yAngle = 90 - pointToAngle({ x: vector.x, y: vector.z });
			const xAngle = (vector.z > 0) ? -pointToAngle({ x: vector.z, y: vector.y }) : pointToAngle({ x: vector.z, y: vector.y });

			const tempPlane = extensionData.webglIF.createPlane({
				width: 10000 / extensionData.webgl.unitMultiplier,
				height: 10000 / extensionData.webgl.unitMultiplier,
				position,
				rotation: { x: xAngle, y: yAngle, z: zAngle },
				collisions: true,
				sideOrientation: 2,
				visible: true,
			});
			tempPlane.updateCoordinates();
			const planePos = extensionData.webglIF.screenToObjectPoint({ x: screenPoint.x + targetOffsetX, y: screenPoint.y + targetOffsetY }, tempPlane);
			tempPlane.remove();

			return {
				position: planePos,
				scale: {
					x: distance / 5,
					y: distance / 5,
					z: distance / 5,
				},
			};
		};

		if (activeGroup === MANIPULATOR_GROUP_TYPES.MOVE) {
			if (allowed[MANIPULATOR_TYPES.MOVE_PLANE]) {
				if (manipulatorPlane) {
					const pos = getPosition(0, 0);
					attachMovePlaneManipulator(extension, manipulatorObject, { position: pos.position, scale: pos.scale, rotation: { x: 0, y: manipulatorPlane.rotation.y + 90, z: manipulatorPlane.rotation.x } });
					manipulatorObject.getChildren()[0].manipulatorPlane = manipulatorPlane;
				}
			} else {
				if (allowed[MANIPULATOR_TYPES.MOVE_X]) {
					const pos = getPosition(60, 60);
					attachMoveXManipulator(extension, manipulatorObject, { position: pos.position, scale: pos.scale, rotation: { x: 0, y: 0, z: 90 } });
				}
				if (allowed[MANIPULATOR_TYPES.MOVE_Y]) {
					const pos = getPosition(-60, -60);
					attachMoveYManipulator(extension, manipulatorObject, { position: pos.position, scale: pos.scale, rotation: { x: 0, y: 0, z: 0 } });
				}
				if (allowed[MANIPULATOR_TYPES.MOVE_Z]) {
					const pos = getPosition(-60, 60);
					attachMoveZManipulator(extension, manipulatorObject, { position: pos.position, scale: pos.scale, rotation: { x: 90, y: 0, z: 0 } });
				}
			}
		} else if (activeGroup === MANIPULATOR_GROUP_TYPES.SCALE) {
			if (allowed[MANIPULATOR_TYPES.SCALE]) {
				const pos = getPosition(60, -60);
				attachScaleManipulator(extension, manipulatorObject, { position: pos.position, scale: pos.scale, rotation: { x: -45, y: -45, z: 0 } });
			} else {
				if (allowed[MANIPULATOR_TYPES.SCALE_X]) {
					const pos = getPosition(60, 60);
					attachScaleXManipulator(extension, manipulatorObject, { position: boundingVectors[0], scale: pos.scale, rotation: { x: 0, y: 0, z: 90 } });
				}
				if (allowed[MANIPULATOR_TYPES.SCALE_Y]) {
					const pos = getPosition(-60, -60);
					attachScaleYManipulator(extension, manipulatorObject, { position: boundingVectors[1], scale: pos.scale, rotation: { x: 0, y: 0, z: 0 } });
				}
				if (allowed[MANIPULATOR_TYPES.SCALE_Z]) {
					const pos = getPosition(-60, 60);
					attachScaleZManipulator(extension, manipulatorObject, { position: boundingVectors[2], scale: pos.scale, rotation: { x: 90, y: 0, z: 0 } });
				}
			}
		} else if (activeGroup === MANIPULATOR_GROUP_TYPES.ROTATE) {
			if (allowed[MANIPULATOR_TYPES.ROTATE_X]) {
				const pos = getPosition(60, 60);
				attachRotateAroundXManipulator(extension, manipulatorObject, { position: boundingVectors[0], scale: pos.scale, rotation: { x: 180, y: 270, z: -90 } });
			}
			if (allowed[MANIPULATOR_TYPES.ROTATE_Y]) {
				const pos = getPosition(-60, -60);
				attachRotateAroundYManipulator(extension, manipulatorObject, { position: boundingVectors[1], scale: pos.scale, rotation: { x: 90, y: 270, z: 0 } });
			}
			if (allowed[MANIPULATOR_TYPES.ROTATE_Z]) {
				const pos = getPosition(-60, 60);
				attachRotateAroundZManipulator(extension, manipulatorObject, { position: boundingVectors[2], scale: pos.scale, rotation: { x: 0, y: 0, z: 90 } });
			}
		}
	}
}

function setNextGroup(extension, obj) {
	if (obj[manipulation].activeGroup) {
		if (obj[manipulation].activeGroup === MANIPULATOR_GROUP_TYPES.ROTATE) {
			if (obj[manipulation].allowed[MANIPULATOR_TYPES.MOVE_X] || obj[manipulation].allowed[MANIPULATOR_TYPES.MOVE_Y] || obj[manipulation].allowed[MANIPULATOR_TYPES.MOVE_Z] || obj[manipulation].allowed[MANIPULATOR_TYPES.MOVE_PLANE]) {
				obj[manipulation].activeGroup = MANIPULATOR_GROUP_TYPES.MOVE;
			} else if (obj[manipulation].allowed[MANIPULATOR_TYPES.SCALE_X] || obj[manipulation].allowed[MANIPULATOR_TYPES.SCALE_Y] || obj[manipulation].allowed[MANIPULATOR_TYPES.SCALE_Z] || obj[manipulation].allowed[MANIPULATOR_TYPES.SCALE]) {
				obj[manipulation].activeGroup = MANIPULATOR_GROUP_TYPES.SCALE;
			}
		} else if (obj[manipulation].activeGroup === MANIPULATOR_GROUP_TYPES.MOVE) {
			if (obj[manipulation].allowed[MANIPULATOR_TYPES.SCALE_X] || obj[manipulation].allowed[MANIPULATOR_TYPES.SCALE_Y] || obj[manipulation].allowed[MANIPULATOR_TYPES.SCALE_Z] || obj[manipulation].allowed[MANIPULATOR_TYPES.SCALE]) {
				obj[manipulation].activeGroup = MANIPULATOR_GROUP_TYPES.SCALE;
			} else if (obj[manipulation].allowed[MANIPULATOR_TYPES.ROTATE_X] || obj[manipulation].allowed[MANIPULATOR_TYPES.ROTATE_Y] || obj[manipulation].allowed[MANIPULATOR_TYPES.ROTATE_Z]) {
				obj[manipulation].activeGroup = MANIPULATOR_GROUP_TYPES.ROTATE;
			}
		} else if (obj[manipulation].activeGroup === MANIPULATOR_GROUP_TYPES.SCALE) {
			if (obj[manipulation].allowed[MANIPULATOR_TYPES.ROTATE_X] || obj[manipulation].allowed[MANIPULATOR_TYPES.ROTATE_Y] || obj[manipulation].allowed[MANIPULATOR_TYPES.ROTATE_Z]) {
				obj[manipulation].activeGroup = MANIPULATOR_GROUP_TYPES.ROTATE;
			} else if (obj[manipulation].allowed[MANIPULATOR_TYPES.MOVE_X] || obj[manipulation].allowed[MANIPULATOR_TYPES.MOVE_Y] || obj[manipulation].allowed[MANIPULATOR_TYPES.MOVE_Z] || obj[manipulation].allowed[MANIPULATOR_TYPES.MOVE_PLANE]) {
				obj[manipulation].activeGroup = MANIPULATOR_GROUP_TYPES.MOVE;
			}
		}
	} else {
		if (obj[manipulation].allowed[MANIPULATOR_TYPES.MOVE_X] || obj[manipulation].allowed[MANIPULATOR_TYPES.MOVE_Y] || obj[manipulation].allowed[MANIPULATOR_TYPES.MOVE_Z] || obj[manipulation].allowed[MANIPULATOR_TYPES.MOVE_PLANE]) {
			obj[manipulation].activeGroup = MANIPULATOR_GROUP_TYPES.MOVE;
		} else if (obj[manipulation].allowed[MANIPULATOR_TYPES.SCALE_X] || obj[manipulation].allowed[MANIPULATOR_TYPES.SCALE_Y] || obj[manipulation].allowed[MANIPULATOR_TYPES.SCALE_Z] || obj[manipulation].allowed[MANIPULATOR_TYPES.SCALE]) {
			obj[manipulation].activeGroup = MANIPULATOR_GROUP_TYPES.SCALE;
		} else if (obj[manipulation].allowed[MANIPULATOR_TYPES.ROTATE_X] || obj[manipulation].allowed[MANIPULATOR_TYPES.ROTATE_Y] || obj[manipulation].allowed[MANIPULATOR_TYPES.ROTATE_Z]) {
			obj[manipulation].activeGroup = MANIPULATOR_GROUP_TYPES.ROTATE;
		}
	}
}

export default class VicowaWebGLManipulationExtension {
	static getAllManipulatorsAllowed() {
		return Object.keys(MANIPULATOR_TYPES).reduce((previous, option) => { previous[option] = true; return previous; }, {});
	}

	constructor() {
		this[privateData] = {
			webgl: null,
			webglIF: null,
			manipulators: {},
			activeManipulationObjects: {},
			draggingManipulator: null,
		};
	}

	attach(webGL, webglInterface) {
		const extensionData = this[privateData];

		extensionData.webgl = webGL;
		extensionData.webglIF = webglInterface;

		extensionData.webgl.addMaterial("move-manipulator-unselected", { diffuse: { r: 0.6, g: 0.6, b: 1 } });
		extensionData.webgl.addMaterial("move-manipulator-selected", { diffuse: { r: 0, g: 0, b: 1 } });
		extensionData.webgl.addMaterial("scale-manipulator-unselected", { diffuse: { r: 0.6, g: 1, b: 1 } });
		extensionData.webgl.addMaterial("scale-manipulator-selected", { diffuse: { r: 0, g: 1, b: 1 } });
		extensionData.webgl.addMaterial("rotate-manipulator-unselected", { diffuse: { r: 1, g: 0.6, b: 1 } });
		extensionData.webgl.addMaterial("rotate-manipulator-selected", { diffuse: { r: 1, g: 0, b: 1 } });

		const getPlanePosition = () => ((extensionData.draggingManipulator && extensionData.draggingManipulator.manipulatorPlane) ? extensionData.webglIF.screenToObjectPoint(extensionData.webglIF.pointerPos, extensionData.draggingManipulator.manipulatorPlane) : null);

		extensionData.webglIF.addPointerClickListener((event) => {
			let hitObject = event.hitObject;
			while (hitObject && !MANIPULATOR_TYPES[hitObject.manipulatorType]) {
				hitObject = hitObject.parent;
			}
			if (hitObject && (!extensionData.draggingManipulator || !extensionData.draggingManipulator.hasMoved)) {
				let objectManipulator = hitObject;
				while (objectManipulator && !objectManipulator.manipulatedObject) {
					objectManipulator = objectManipulator.parent;
				}
				if (objectManipulator) {
					setNextGroup(this, objectManipulator.manipulatedObject);
					attachManipulators(this, objectManipulator.manipulatedObject);
				}
			}
		});

		extensionData.webglIF.addPointerDownListener((event) => {
			let hitObject = event.hitObject;
			while (hitObject && !MANIPULATOR_TYPES[hitObject.manipulatorType]) {
				hitObject = hitObject.parent;
			}
			if (hitObject) {
				extensionData.draggingManipulator = { manipulatorType: hitObject.manipulatorType, activeManipulator: hitObject };
				extensionData.draggingManipulator.hasMoved = false;
				let objectManipulator = hitObject;
				while (objectManipulator && !objectManipulator.manipulatedObject) {
					objectManipulator = objectManipulator.parent;
				}
				if (objectManipulator) {
					extensionData.draggingManipulator.activeManipulator.activeGroup = objectManipulator.manipulatedObject[manipulation].activeGroup;
					switch (hitObject.manipulatorType) {
						case MANIPULATOR_TYPES.MOVE_X:
						case MANIPULATOR_TYPES.SCALE_X:
						case MANIPULATOR_TYPES.ROTATE_Z:
							extensionData.draggingManipulator.manipulatorPlane = extensionData.webglIF.createPlane({
								width: 10000 / extensionData.webgl.unitMultiplier,
								height: 10000 / extensionData.webgl.unitMultiplier,
								position: hitObject.center,
								collisions: true,
								visible: false,
							});
							extensionData.draggingManipulator.manipulatorPlane.updateCoordinates();
							extensionData.draggingManipulator.startPoint = getPlanePosition();
							extensionData.draggingManipulator.startHandlerRotation = pointToAngle(vectorSubtract(extensionData.draggingManipulator.startPoint, objectManipulator.manipulatedObject.center));
							break;
						case MANIPULATOR_TYPES.SCALE:
							extensionData.draggingManipulator.manipulatorPlane = extensionData.webglIF.createPlane({
								width: 10000 / extensionData.webgl.unitMultiplier,
								height: 10000 / extensionData.webgl.unitMultiplier,
								position: hitObject.center,
								collisions: true,
								visible: false,
							});
							extensionData.draggingManipulator.manipulatorPlane.applySettings({ rotation: { x: 0, y: 45, z: 0 } });
							extensionData.draggingManipulator.manipulatorPlane.updateCoordinates();
							extensionData.draggingManipulator.startPoint = getPlanePosition();
							break;
						case MANIPULATOR_TYPES.MOVE_Y:
						case MANIPULATOR_TYPES.SCALE_Y:
							extensionData.draggingManipulator.manipulatorPlane = extensionData.webglIF.createPlane({
								width: 10000 / extensionData.webgl.unitMultiplier,
								height: 10000 / extensionData.webgl.unitMultiplier,
								position: hitObject.center,
								collisions: true,
								visible: false,
							});
							extensionData.draggingManipulator.manipulatorPlane.updateCoordinates();
							extensionData.draggingManipulator.startPoint = getPlanePosition();
							break;
						case MANIPULATOR_TYPES.ROTATE_X:
							extensionData.draggingManipulator.manipulatorPlane = extensionData.webglIF.createPlane({
								width: 10000 / extensionData.webgl.unitMultiplier,
								height: 10000 / extensionData.webgl.unitMultiplier,
								position: hitObject.center,
								collisions: true,
								visible: false,
								rotation: { x: 0, y: 90, z: 0 },
							});
							extensionData.draggingManipulator.manipulatorPlane.updateCoordinates();
							extensionData.draggingManipulator.startPoint = getPlanePosition();
							extensionData.draggingManipulator.startHandlerRotation = pointToAngle(vectorSubtract({ x: extensionData.draggingManipulator.startPoint.z, y: extensionData.draggingManipulator.startPoint.y }, { x: objectManipulator.manipulatedObject.center.z, y: objectManipulator.manipulatedObject.center.y }));
							break;
						case MANIPULATOR_TYPES.MOVE_Z:
						case MANIPULATOR_TYPES.SCALE_Z:
						case MANIPULATOR_TYPES.ROTATE_Y:
							extensionData.draggingManipulator.manipulatorPlane = extensionData.webglIF.createPlane({
								width: 10000 / extensionData.webgl.unitMultiplier,
								height: 10000 / extensionData.webgl.unitMultiplier,
								position: hitObject.center,
								collisions: true,
								visible: false,
								rotation: { x: 90, y: 0, z: 0 },
							});
							extensionData.draggingManipulator.manipulatorPlane.updateCoordinates();
							extensionData.draggingManipulator.startPoint = getPlanePosition();
							extensionData.draggingManipulator.startHandlerRotation = pointToAngle(vectorSubtract({ x: extensionData.draggingManipulator.startPoint.x, y: extensionData.draggingManipulator.startPoint.z }, { x: objectManipulator.manipulatedObject.center.x, y: objectManipulator.manipulatedObject.center.z }));
							break;
						case MANIPULATOR_TYPES.MOVE_PLANE:
							extensionData.draggingManipulator.manipulatorPlane = hitObject.manipulatorPlane;
							extensionData.draggingManipulator.startPoint = getPlanePosition();
							break;
					}

					extensionData.draggingManipulator.startPosition = extensionData.draggingManipulator.activeManipulator.position;
					extensionData.draggingManipulator.startScale = objectManipulator.manipulatedObject.scale;
					extensionData.draggingManipulator.startRotation = objectManipulator.manipulatedObject.rotation;
					if (extensionData.draggingManipulator.startPoint) {
						extensionData.draggingManipulator.manipulatorsObject = objectManipulator;
						extensionData.draggingManipulator.activeManipulator.getChildren()[0].applySettings({ material: (extensionData.draggingManipulator.activeManipulator.activeGroup === MANIPULATOR_GROUP_TYPES.SCALE) ? "scale-manipulator-selected" : (extensionData.draggingManipulator.activeManipulator.activeGroup === MANIPULATOR_GROUP_TYPES.ROTATE) ? "rotate-manipulator-selected" : "move-manipulator-selected" });
						extensionData.webglIF.detachCameraControl();
					} else {
						if (extensionData.draggingManipulator.manipulatorType !== MANIPULATOR_TYPES.MOVE_PLANE) {
							extensionData.draggingManipulator.manipulatorPlane.remove();
						}
						extensionData.draggingManipulator = null;
					}
				} else {
					extensionData.draggingManipulator.manipulatorPlane.remove();
					extensionData.draggingManipulator = null;
				}
			}
		});

		extensionData.webglIF.addPointerUpListener(() => {
			if (extensionData.draggingManipulator) {
				if (extensionData.draggingManipulator.manipulatorType !== MANIPULATOR_TYPES.MOVE_PLANE) {
					extensionData.draggingManipulator.manipulatorPlane.remove();
				}
				if (!extensionData.draggingManipulator.activeManipulator.isRemoved()) {
					extensionData.draggingManipulator.activeManipulator.getChildren()[0].applySettings({ material: (extensionData.draggingManipulator.activeManipulator.activeGroup === MANIPULATOR_GROUP_TYPES.SCALE) ? "scale-manipulator-unselected" : (extensionData.draggingManipulator.activeManipulator.activeGroup === MANIPULATOR_GROUP_TYPES.ROTATE) ? "rotate-manipulator-unselected" : "move-manipulator-unselected" });
				}
			}
			extensionData.draggingManipulator = null;
			extensionData.webglIF.attachCameraControl();
		});

		extensionData.webglIF.addPointerMoveListener(() => {
			if (extensionData.draggingManipulator && extensionData.draggingManipulator.startPoint) {
				const currentPoint = getPlanePosition();
				if (currentPoint) {
					extensionData.draggingManipulator.hasMoved = true;
					const targetObjectCenter = extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.center;
					const diff = { x: Math.round((currentPoint.x - extensionData.draggingManipulator.startPoint.x) * 1000) / 1000, y: Math.round((currentPoint.y - extensionData.draggingManipulator.startPoint.y) * 1000) / 1000, z: Math.round((currentPoint.z - extensionData.draggingManipulator.startPoint.z) * 1000) / 1000 };
					switch (extensionData.draggingManipulator.manipulatorType) {
						case MANIPULATOR_TYPES.MOVE_X:
							diff.y = 0;
							diff.z = 0;
							extensionData.draggingManipulator.manipulatorsObject.offset(diff);
							extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.offset(diff);
							extensionData.draggingManipulator.startPoint = currentPoint;
							break;
						case MANIPULATOR_TYPES.MOVE_Y:
							diff.x = 0;
							diff.z = 0;
							extensionData.draggingManipulator.manipulatorsObject.offset(diff);
							extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.offset(diff);
							extensionData.draggingManipulator.startPoint = currentPoint;
							break;
						case MANIPULATOR_TYPES.MOVE_Z:
							diff.x = 0;
							diff.y = 0;
							extensionData.draggingManipulator.manipulatorsObject.offset(diff);
							extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.offset(diff);
							extensionData.draggingManipulator.startPoint = currentPoint;
							break;
						case MANIPULATOR_TYPES.MOVE_PLANE:
							extensionData.draggingManipulator.manipulatorsObject.offset(diff);
							extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.offset(diff);
							extensionData.draggingManipulator.startPoint = currentPoint;
							break;
						case MANIPULATOR_TYPES.SCALE: {
							const oldRelativePoint = { x: extensionData.draggingManipulator.startPoint.x - targetObjectCenter.x, y: extensionData.draggingManipulator.startPoint.y - targetObjectCenter.y, z: extensionData.draggingManipulator.startPoint.z - targetObjectCenter.z };
							const oldDistance = Math.sqrt((oldRelativePoint.x * oldRelativePoint.x) + (oldRelativePoint.y * oldRelativePoint.y) + (oldRelativePoint.z * oldRelativePoint.z));
							const newRelativePoint = { x: currentPoint.x - targetObjectCenter.x, y: currentPoint.y - targetObjectCenter.y, z: currentPoint.z - targetObjectCenter.z };
							const newDistance = Math.sqrt((newRelativePoint.x * newRelativePoint.x) + (newRelativePoint.y * newRelativePoint.y) + (newRelativePoint.z * newRelativePoint.z));

							extensionData.draggingManipulator.activeManipulator.position = { x: extensionData.draggingManipulator.startPosition.x + currentPoint.x - extensionData.draggingManipulator.startPoint.x, y: extensionData.draggingManipulator.startPosition.y + currentPoint.y - extensionData.draggingManipulator.startPoint.y, z: extensionData.draggingManipulator.startPosition.z + currentPoint.z - extensionData.draggingManipulator.startPoint.z };
							extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.scale = {
								x: extensionData.draggingManipulator.startScale.x * newDistance / oldDistance,
								y: extensionData.draggingManipulator.startScale.y * newDistance / oldDistance,
								z: extensionData.draggingManipulator.startScale.z * newDistance / oldDistance,
							};
						}
							break;
						case MANIPULATOR_TYPES.SCALE_X: {
							const oldDistance = extensionData.draggingManipulator.startPoint.x - targetObjectCenter.x;
							const newDistance = currentPoint.x - targetObjectCenter.x;
							extensionData.draggingManipulator.activeManipulator.position = { x: extensionData.draggingManipulator.startPosition.x + currentPoint.x - extensionData.draggingManipulator.startPoint.x };
							extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.scale = { x: extensionData.draggingManipulator.startScale.x * newDistance / oldDistance };
						}
							break;
						case MANIPULATOR_TYPES.SCALE_Y: {
							const oldDistance = extensionData.draggingManipulator.startPoint.y - targetObjectCenter.y;
							const newDistance = currentPoint.y - targetObjectCenter.y;
							extensionData.draggingManipulator.activeManipulator.position = { y: extensionData.draggingManipulator.startPosition.y + currentPoint.y - extensionData.draggingManipulator.startPoint.y };
							extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.scale = { y: extensionData.draggingManipulator.startScale.y * newDistance / oldDistance };
						}
							break;
						case MANIPULATOR_TYPES.SCALE_Z: {
							const oldDistance = extensionData.draggingManipulator.startPoint.z - targetObjectCenter.z;
							const newDistance = currentPoint.z - targetObjectCenter.z;
							extensionData.draggingManipulator.activeManipulator.position = { z: extensionData.draggingManipulator.startPosition.z + currentPoint.z - extensionData.draggingManipulator.startPoint.z };
							extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.scale = { z: extensionData.draggingManipulator.startScale.z * newDistance / oldDistance };
						}
							break;
						case MANIPULATOR_TYPES.ROTATE_X: {
							const relevantCenter = { x: extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.center.z, y: extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.center.y };
							const relevantStart = { x: extensionData.draggingManipulator.startPoint.z, y: extensionData.draggingManipulator.startPoint.y };
							const newHandlerRotation = pointToAngle(vectorSubtract({ x: currentPoint.z, y: currentPoint.y }, relevantCenter));
							const newPos = angleToPoint(newHandlerRotation, vectorLength(vectorSubtract(relevantStart, relevantCenter)));
							const manipulatePos = vectorAdd({ x: newPos.x, y: newPos.y }, relevantCenter);
							extensionData.draggingManipulator.activeManipulator.position = { z: manipulatePos.x, y: manipulatePos.y };
							extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.rotation = { x: extensionData.draggingManipulator.startRotation.x - (newHandlerRotation - extensionData.draggingManipulator.startHandlerRotation) };
						}
							break;
						case MANIPULATOR_TYPES.ROTATE_Y: {
							const relevantCenter = { x: extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.center.x, y: extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.center.z };
							const relevantStart = { x: extensionData.draggingManipulator.startPoint.x, y: extensionData.draggingManipulator.startPoint.z };
							const newHandlerRotation = pointToAngle(vectorSubtract({ x: currentPoint.x, y: currentPoint.z }, relevantCenter));
							const newPos = angleToPoint(newHandlerRotation, vectorLength(vectorSubtract(relevantStart, relevantCenter)));
							const manipulatePos = vectorAdd({ x: newPos.x, y: newPos.y }, relevantCenter);
							extensionData.draggingManipulator.activeManipulator.position = { x: manipulatePos.x, z: manipulatePos.y };
							extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.rotation = { y: extensionData.draggingManipulator.startRotation.y - (newHandlerRotation - extensionData.draggingManipulator.startHandlerRotation) };
						}
							break;
						case MANIPULATOR_TYPES.ROTATE_Z: {
							const relevantCenter = { x: extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.center.x, y: extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.center.y };
							const relevantStart = { x: extensionData.draggingManipulator.startPoint.x, y: extensionData.draggingManipulator.startPoint.y };
							const newHandlerRotation = pointToAngle(vectorSubtract(currentPoint, relevantCenter));
							const newPos = angleToPoint(newHandlerRotation, vectorLength(vectorSubtract(relevantStart, relevantCenter)));
							const manipulatePos = vectorAdd({ x: newPos.x, y: newPos.y }, relevantCenter);
							extensionData.draggingManipulator.activeManipulator.position = { x: manipulatePos.x, y: manipulatePos.y };
							extensionData.draggingManipulator.manipulatorsObject.manipulatedObject.rotation = { z: extensionData.draggingManipulator.startRotation.z + (newHandlerRotation - extensionData.draggingManipulator.startHandlerRotation) };
						}
							break;
					}
				}
			}
		});
		createManipulatorTemplates(this);
	}

	setAllowedManipulators(obj, settings) {
		const extensionData = this[privateData];
		const targetObject = extensionData.webglIF.getObject(obj);
		targetObject[manipulation] = targetObject[manipulation] || { allowed: {}, manipulatorPlane: null };
		Object.keys(settings).forEach((key) => {
			if (MANIPULATOR_TYPES[key]) {
				targetObject[manipulation].allowed[key] = settings[key];
				if (key === MANIPULATOR_TYPES.MOVE_PLANE) {
					targetObject[manipulation].manipulatorPlane = settings.movePlane;
				}
			}
		});
	}

	removeManipulators(obj) {
		const extensionData = this[privateData];
		const targetObject = extensionData.webglIF.getObject(obj);
		const manipulatorName = `manipulator-for-${targetObject.name}`;
		if (extensionData.activeManipulationObjects[manipulatorName]) {
			extensionData.activeManipulationObjects[manipulatorName].remove();
			delete extensionData.activeManipulationObjects[manipulatorName];
		}
	}

	attachManipulators(obj, clickPoint) {
		const extensionData = this[privateData];
		const targetObject = extensionData.webglIF.getObject(obj);
		if (targetObject && targetObject[manipulation]) {
			if (!targetObject[manipulation].activeGroup) {
				setNextGroup(this, targetObject);
			}
			attachManipulators(this, targetObject, clickPoint);
		}
	}
}
