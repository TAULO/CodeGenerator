/// <reference path="../../../../Definitions/knockout.extensionstypes.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../../../Util/Detection", "../../../Util/Util", "../../../Util/Resize", "./Grid"], function (require, exports, Detection, Util, Resize, Grid) {
    var Main;
    (function (Main) {
        "use strict";
        var $ = jQuery, global = window, gridScrollableClass = "azc-grid-scrollable", templateVirtualScrollingBody = "<!-- ko template: { name: ko.pureComputed(function () { return  func.getPlugin(\"azc-grid-scrollable\").asyncItems().length ? 'bodyCore' : 'bodyNoItems'; }), data: $data, templateEngine: $root.customTemplateEngine } --><!-- /ko -->", templateVirtualScrollingBodyCore = "<tbody class='azc-grid-groupdata' role='rowgroup'>" + "<tr class='azc-grid-scrollable-above'></tr>" + "<!-- ko foreach: func.getPlugin(\"azc-grid-scrollable\").asyncItems -->" + "<!-- ko template: { name: template, data: item(), templateEngine: $root.customTemplateEngine } --><!-- /ko -->" + "<!-- /ko -->" + "</tbody>", templateVirtualScrollingBodyRowsLoading = "<tr class='azc-grid-scrollable-loading'><td class='azc-br-muted' data-bind='attr: { colspan: $root.func._getTotalColumns() }'></td></tr>", templateVirtualScrollingBodyRowsError = "<tr class='azc-grid-scrollable-error'><td class='azc-br-muted' data-bind='attr: { colspan: $root.func._getTotalColumns() }'></td></tr>";
        (function (AsyncItemState) {
            /**
             * The item is loading.
             */
            AsyncItemState[AsyncItemState["Loading"] = 0] = "Loading";
            /**
             * The item has been loaded.
             */
            AsyncItemState[AsyncItemState["Loaded"] = 1] = "Loaded";
            /**
             * There was a error loading the item.
             */
            AsyncItemState[AsyncItemState["Error"] = 2] = "Error";
        })(Main.AsyncItemState || (Main.AsyncItemState = {}));
        var AsyncItemState = Main.AsyncItemState;
        var AsyncItem = (function () {
            /**
             * Constructs an async item for display in the virtualized grid.
             */
            function AsyncItem(index, state, item) {
                var _this = this;
                this.index = index;
                this.item = ko.observable(item);
                this.state = ko.observable(state);
                this.template = ko.pureComputed(function () {
                    switch (_this.state()) {
                        case 0 /* Loading */:
                            return "bodyRowsLoading";
                        case 2 /* Error */:
                            return "bodyRowsError";
                        case 1 /* Loaded */:
                        default:
                            return "bodyRows";
                    }
                });
            }
            return AsyncItem;
        })();
        Main.AsyncItem = AsyncItem;
        var ScrollableExtension = (function (_super) {
            __extends(ScrollableExtension, _super);
            /**
             * Creates the scrollable row extension.
             *
             * @param options Options associated with the extension.
             */
            function ScrollableExtension(options) {
                this._options = $.extend(this._getDefaultScrollableOptions(), options);
                if (this.virtualScrolling) {
                    this.asyncItems = ko.observableArray([]);
                    this._resetAsyncItemCache();
                }
                _super.call(this);
            }
            Object.defineProperty(ScrollableExtension.prototype, "options", {
                /**
                 * Gets the options of the plugin.
                 */
                get: function () {
                    return this._options;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScrollableExtension.prototype, "virtualScrolling", {
                /**
                 * Indicates if virtual scrolling is enabled.
                 */
                get: function () {
                    return !!this.options.dataProvider;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * See interface.
             */
            ScrollableExtension.prototype.afterCreate = function () {
                var _this = this;
                // Listen to resize events and update the virtual scroll as appropriate
                this._scrollContainer = this._widget.element.find(".azc-grid-tableScrollContainer");
                this._scrollContainer.on("scroll.azcGridScrollable", this._scrollHandler = function () {
                    _this._update();
                });
                if (this.virtualScrolling) {
                    // Listen to resize events and update the virtual scroll as appropriate
                    this._resizeTracker = Resize.track(this._widget.element, function () {
                        _this._update();
                    });
                    // Listen to changes in the total re-render without cached data
                    this._totalItemCountSubscription = this.options.dataProvider.totalItemCount.subscribe(function () {
                        _this._resetAsyncItemCache();
                        _this._update();
                    });
                }
                // Update the scroll
                this._update();
            };
            /**
             * See interface.
             */
            ScrollableExtension.prototype.afterSetTemplates = function (templateEngine) {
                if (this.virtualScrolling) {
                    templateEngine.setTemplate("body", templateVirtualScrollingBody);
                    templateEngine.setTemplate("bodyCore", templateVirtualScrollingBodyCore);
                    templateEngine.setTemplate("bodyRowsLoading", templateVirtualScrollingBodyRowsLoading);
                    templateEngine.setTemplate("bodyRowsError", templateVirtualScrollingBodyRowsError);
                }
            };
            /**
             * See inteface.
             */
            ScrollableExtension.prototype.getDefaultColumnProperties = function () {
                return {};
            };
            /**
             * See interface.
             */
            ScrollableExtension.prototype.beforeDestroy = function () {
                if (this._updateViewportAsyncTimeout) {
                    global.clearTimeout(this._updateViewportAsyncTimeout);
                    this._updateViewportAsyncTimeout = null;
                }
                if (this._scrollHandler) {
                    if (this._scrollContainer) {
                        this._scrollContainer.off("scroll.azcGridScrollable", this._scrollHandler);
                    }
                    this._scrollHandler = null;
                }
                if (this._totalItemCountSubscription) {
                    this._totalItemCountSubscription.dispose();
                    this._totalItemCountSubscription = null;
                }
                if (this._resizeTracker) {
                    this._resizeTracker.dispose();
                    this._resizeTracker = null;
                }
                this._asyncItemCache = null;
                this._latestRequest = null;
                this._scrollContainer = null;
            };
            /**
             * See parent.
             */
            ScrollableExtension.prototype.getName = function () {
                return ScrollableExtension.Name;
            };
            /**
             * See interface.
             */
            ScrollableExtension.prototype.getOrder = function () {
                return 15;
            };
            /**
             * Resets navigation to the starting position.
             * Puts the scrollbar back to the top and clears any cached data.
             */
            ScrollableExtension.prototype.reset = function () {
                this._resetAsyncItemCache();
                if (this.virtualScrolling) {
                    this._widget.options.items.removeAll();
                }
                if (this._scrollContainer) {
                    this._scrollContainer.scrollLeft(0);
                    this._scrollContainer.scrollTop(0);
                    this._update();
                }
            };
            /**
             * Gets the default scrollable options.
             *
             * @return The default options.
             */
            ScrollableExtension.prototype._getDefaultScrollableOptions = function () {
                return {
                    dataProvider: null
                };
            };
            /**
             * Clears the async item cache.
             */
            ScrollableExtension.prototype._resetAsyncItemCache = function () {
                this._asyncItemCache = [];
                this._asyncItemCache.length = ScrollableExtension._asyncItemCacheSize;
            };
            /**
             * Updates the table header horizontal position and width and height for the scroll container as needed.
             */
            ScrollableExtension.prototype._updateHeader = function () {
                var header, headerLeft, headerWidth, headerHeight;
                header = this._scrollContainer.find(".azc-grid-tableHeader");
                if (header.length) {
                    headerLeft = -this._scrollContainer.scrollLeft();
                    header.css("left", headerLeft < 0 ? headerLeft + "px" : "");
                    headerWidth = Util.truncate(this._scrollContainer[0].offsetWidth - this._scrollContainer[0].clientWidth);
                    header.css("width", headerWidth > 0 ? "calc(100% - " + headerWidth + "px)" : "");
                    headerHeight = header.outerHeight();
                    this._scrollContainer.parent(".azc-grid-tableContainer").css("padding-top", headerHeight + "px");
                }
            };
            /**
             * Updates the table layout for scrollbars.
             * This occurs on overy scroll event and should be quick to keep the scrollbars responsive.
             */
            ScrollableExtension.prototype._update = function () {
                // Update the header to ensure it fits and is aligned with the horizontal scroll
                this._updateHeader();
                // Update the viewport when virtualizing data
                if (this.virtualScrolling) {
                    this._updateViewportAsync();
                }
            };
            /**
             * Triggers a debounced async update to the viewport for virtualized data.
             */
            ScrollableExtension.prototype._updateViewportAsync = function () {
                var _this = this;
                var timeout = this._options.updateViewportAsyncDebounceTime || ScrollableExtension._updateViewportAsyncDebounceTime;
                if (!this._updateViewportAsyncTimeout) {
                    // Very first request is handled right away
                    timeout = 0;
                }
                else {
                    global.clearTimeout(this._updateViewportAsyncTimeout);
                }
                this._updateViewportAsyncTimeout = global.setTimeout(function () {
                    if (_this._updateViewportAsyncTimeout) {
                        try {
                            _this._updateViewport();
                            _this._updateHeader();
                        }
                        catch (error) {
                        }
                    }
                }, timeout);
            };
            /**
             * Gets the row height to use for calculating virtual row positions.
             *
             * @return The row hight in pixels.
             */
            ScrollableExtension.prototype._getRowHeight = function () {
                var rowHeight, td;
                td = this._scrollContainer.find(".azc-grid-full td");
                if (td.length) {
                    rowHeight = td.outerHeight();
                }
                return rowHeight || this._options.defaultRowHeight || ScrollableExtension._defaultRowHeight;
            };
            /**
             * Gets the total scroll height accounting for browser limitations.
             *
             * @return The total scroll height in pixels.
             */
            ScrollableExtension.prototype._getTotalScrollHeight = function (totalRows, rowHeight) {
                var idealHeight, maxHeight, totalHeight;
                // Browsers have a maximum pixel height for an element this keeps in it in a usable range
                maxHeight = Math.floor(ScrollableExtension._maxElementHeightFactor * Detection.Detection.Features.maxElementHeight);
                idealHeight = Math.floor(totalRows * rowHeight);
                totalHeight = Math.min(idealHeight, maxHeight);
                return totalHeight;
            };
            /**
             * Updates the table container height so the scrollHeight does not re-adjust as we alter the table.
             */
            ScrollableExtension.prototype._updateContentHeight = function (height) {
                var tableContainer = this._widget.element.find(".azc-grid-tableContent");
                tableContainer.height(height);
            };
            /**
             * Updates the buffer wow height.
             */
            ScrollableExtension.prototype._updateAboveRowHeight = function (height) {
                var aboveRow = this._scrollContainer.find(".azc-grid-scrollable-above");
                aboveRow.css("height", height || "");
            };
            /**
             * Updates the viewport for virtualized data.
             */
            ScrollableExtension.prototype._updateViewport = function () {
                var totalRows, rowHeight, totalHeight, height, scrollTop, scrollHeight, aboveRows, visibleRows, startRow, endRow, countRows, aboveHeight, requestedItems;
                // Calculate the total
                totalRows = this.options.dataProvider.totalItemCount();
                if (Util.isNullOrUndefined(totalRows)) {
                    // If the data provider does not return a total assume one
                    // so we can make a request which may return a proper total
                    totalRows = ScrollableExtension._defaultRequestCount;
                }
                // Calculate the heights
                rowHeight = this._getRowHeight();
                totalHeight = this._getTotalScrollHeight(totalRows, rowHeight);
                // Set a fixed height for the content so the scroll does not recalculate when changing the rows
                this._updateContentHeight(totalHeight);
                // Get the viewport scroll dimensions
                height = this._scrollContainer[0].clientHeight;
                scrollTop = this._scrollContainer[0].scrollTop || 0;
                scrollHeight = this._scrollContainer[0].scrollHeight || totalHeight || height;
                if (height) {
                    // Calculate the rows above and in the viewport
                    aboveRows = Math.floor(totalRows * (scrollTop / scrollHeight));
                    visibleRows = Math.ceil(height / rowHeight);
                    // Adjust window to include extra items above and below the viewport for rendering
                    startRow = Math.max(aboveRows - visibleRows, 0);
                    endRow = Math.min(aboveRows + visibleRows + visibleRows, totalRows);
                    countRows = endRow - startRow;
                    // Update the space above the rendered rows
                    aboveHeight = Math.floor(scrollHeight * (startRow / totalRows));
                    this._updateAboveRowHeight(aboveHeight);
                    // Request and render the new data asynchronously
                    requestedItems = this._request(startRow, countRows);
                    this._render(requestedItems);
                }
            };
            /**
             * Merges the newly fetched async items with the current items as needed.
             *
             * @param requestedItems The newly requested items to render in the grid.
             */
            ScrollableExtension.prototype._render = function (requestedItems) {
                var edits, loadedItems = [];
                edits = ko.utils.compareArrays(this.asyncItems(), requestedItems);
                edits = ko.utils.fixupArrayEdits(edits);
                ko.utils.applyArrayEdits(this.asyncItems, edits);
                // Push any already loaded items into the grid for metadata
                requestedItems.forEach(function (requestedItem) {
                    if (requestedItem && requestedItem.state.peek() === 1 /* Loaded */) {
                        loadedItems.push(requestedItem.item.peek());
                    }
                });
            };
            /**
             * Pushes the latest requested items into the grid.
             *
             * @param items The grid items.
             */
            ScrollableExtension.prototype._updateGridItems = function (items) {
                var gridItems, spliceArgs;
                if (items && items.length) {
                    gridItems = this._widget.options.items.peek();
                    if (gridItems) {
                        spliceArgs = [gridItems.length, 0];
                        items.forEach(function (item) {
                            if (gridItems.indexOf(item) < 0) {
                                spliceArgs.push(item);
                            }
                        });
                        if (spliceArgs.length > 2) {
                            this._widget.options.items.splice.apply(this._widget.options.items, spliceArgs);
                        }
                    }
                    else {
                        this._widget.options.items(items);
                    }
                }
            };
            /**
             * Requests the data from the provider.
             *
             * @param start The starting position in the data.
             * @param count The number of data items to render.
             * @return The async items.
             */
            ScrollableExtension.prototype._request = function (start, count) {
                var _this = this;
                var asyncItems = [], i, request;
                for (i = 0; i < count; i++) {
                    var index = start + i, asyncItem, cacheIndex = index % this._asyncItemCache.length;
                    asyncItem = this._asyncItemCache[cacheIndex];
                    if (!asyncItem || asyncItem.index !== index) {
                        asyncItem = new AsyncItem(index, 0 /* Loading */, null);
                        this._asyncItemCache[cacheIndex] = asyncItem;
                        if (asyncItem.state() === 2 /* Error */) {
                            asyncItem.state(0 /* Loading */);
                        }
                    }
                    asyncItems.push(asyncItem);
                }
                // Request the items
                if (count > 0) {
                    request = this.options.dataProvider.fetch(start, count);
                    this._latestRequest = request;
                    request.then(function (items) {
                        var loadedItems = [];
                        // Update the loaded items
                        asyncItems.forEach(function (asyncItem, index) {
                            var item = items[index];
                            if (item) {
                                asyncItem.item(item);
                                asyncItem.state(1 /* Loaded */);
                                loadedItems.push(item);
                            }
                            else {
                                // If the request succeeds but the item is null mark it in error
                                asyncItem.state(2 /* Error */);
                            }
                        });
                        // Push the underlying grid items to the grid
                        if (request === _this._latestRequest) {
                            _this._updateGridItems(loadedItems);
                        }
                    }, function () {
                        // Update the failed items
                        asyncItems.forEach(function (asyncItem) {
                            if (asyncItem.state() !== 1 /* Loaded */) {
                                asyncItem.state(2 /* Error */);
                            }
                        });
                    });
                }
                return asyncItems;
            };
            /**
             * See interface.
             */
            ScrollableExtension.prototype.shouldRetainRowMetadata = function (rowMetadata) {
                // For now we are retaining metadata
                return true;
            };
            /**
             * Scrolls the grid to the specified index.
             *
             * @param index The index within the total rows where to scroll the grid.
             */
            ScrollableExtension.prototype.scrollTo = function (index) {
                this._scrollContainer[0].scrollTop = (index / this._options.dataProvider.totalItemCount.peek()) * this._scrollContainer[0].scrollHeight;
                this._updateViewport();
            };
            /**
             * Name of the extension.
             */
            ScrollableExtension.Name = "azc-grid-scrollable";
            ScrollableExtension._updateViewportAsyncDebounceTime = 256;
            ScrollableExtension._asyncItemCacheSize = 2048;
            ScrollableExtension._defaultRowHeight = 36;
            ScrollableExtension._maxElementHeightFactor = 0.80;
            ScrollableExtension._defaultRequestCount = 100;
            return ScrollableExtension;
        })(Grid.Extension);
        Main.ScrollableExtension = ScrollableExtension;
    })(Main || (Main = {}));
    return Main;
});
