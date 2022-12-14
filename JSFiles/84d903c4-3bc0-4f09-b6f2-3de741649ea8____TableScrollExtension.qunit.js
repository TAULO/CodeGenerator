/*global QUnit, sinon, oTable, oTreeTable */

sap.ui.require([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/Device"
], function(qutils, Device) {
	"use strict";

	// mapping of global function calls
	var createTables = window.createTables;
	var destroyTables = window.destroyTables;
	var initRowActions = window.initRowActions;
	var getCell = window.getCell;
	var getColumnHeader = window.getColumnHeader;
	var getRowHeader = window.getRowHeader;
	var getRowAction = window.getRowAction;
	var getSelectAll = window.getSelectAll;
	var iNumberOfRows = window.iNumberOfRows;

	QUnit.module("Initialization", {
		beforeEach: function() {
			createTables();
		},
		afterEach: function() {
			destroyTables();
		}
	});

	QUnit.test("_init", function(assert) {
		var oExtension = oTable._getScrollExtension();
		assert.ok(!!oExtension, "Scroll Extension available");

		var iCount = 0;
		for (var i = 0; i < oTable.aDelegates.length; i++) {
			if (oTable.aDelegates[i].oDelegate === oExtension._delegate) {
				iCount++;
			}
		}
		assert.ok(iCount == 1, "Scroll Delegate registered");
	});

	QUnit.test("_debug", function(assert) {
		var oScrollExtension = oTable._getScrollExtension();

		assert.ok(!oScrollExtension._ScrollingHelper, "No debug mode: ScrollingHelper is not accessible");
		assert.ok(!oScrollExtension._ExtensionDelegate, "No debug mode: ExtensionDelegate is not accessible");
		assert.ok(!oScrollExtension._HorizontalScrollingHelper, "No debug mode: HorizontalScrollingHelper is not accessible");
		assert.ok(!oScrollExtension._VerticalScrollingHelper, "No debug mode: VerticalScrollingHelper is not accessible");

		oScrollExtension._debug();
		assert.ok(oScrollExtension._ScrollingHelper, "Debug mode: ScrollingHelper is accessible");
		assert.ok(oScrollExtension._ExtensionDelegate, "Debug mode: ExtensionDelegate is accessible");
		assert.ok(oScrollExtension._HorizontalScrollingHelper, "Debug mode: HorizontalScrollingHelper is accessible");
		assert.ok(oScrollExtension._VerticalScrollingHelper, "Debug mode: VerticalScrollingHelper is accessible");
	});

	QUnit.module("Destruction", {
		beforeEach: function() {
			createTables();
		}
	});

	QUnit.test("destroy", function(assert) {
		var oExtension = oTable._getScrollExtension();
		oTable.destroy();
		assert.ok(!oExtension.getTable(), "Table cleared");
		assert.ok(!oExtension._delegate, "Delegate cleared");
		oTreeTable.destroy();
	});

	QUnit.module("Scrollbars", {
		beforeEach: function() {
			createTables();

			oTreeTable.destroy();
			oTable.getColumns()[1].setWidth("5000px");
			sap.ui.getCore().applyChanges();

			this.oScrollExtension = oTable._getScrollExtension();
			this.oScrollExtension._debug();
		},
		afterEach: function() {
			destroyTables();
		}
	});

	QUnit.test("Horizontal scrollbar visibility", function(assert) {
		oTable.setFixedColumnCount(0);
		sap.ui.getCore().applyChanges();

		this.oHSb = this.oScrollExtension.getHorizontalScrollbar();

		assert.ok(this.oHSb.offsetWidth > 0 && this.oHSb.offsetHeight > 0,
			"Table content does not fit width -> Horizontal scrollbar is visible");

		oTable.getColumns()[1].setWidth("10px");
		sap.ui.getCore().applyChanges();

		this.oHSb = this.oScrollExtension.getHorizontalScrollbar();

		assert.ok(this.oHSb.offsetWidth === 0 && this.oHSb.offsetHeight === 0,
			"Table content fits width -> Horizontal scrollbar is not visible");
	});

	QUnit.test("Vertical scrollbar visibility", function(assert) {
		sinon.stub(oTable, "_getTotalRowCount").returns(4);
		oTable.setVisibleRowCount(3);
		sap.ui.getCore().applyChanges();

		this.oVSb = this.oScrollExtension.getVerticalScrollbar();

		assert.ok(this.oVSb.offsetWidth > 0 && this.oVSb.offsetHeight > 0,
			"Table content does not fit height -> Vertical scrollbar is visible");

		oTable._getTotalRowCount.returns(3);
		oTable.invalidate();
		sap.ui.getCore().applyChanges();

		this.oVSb = this.oScrollExtension.getVerticalScrollbar();

		assert.ok(this.oVSb.offsetWidth === 0 && this.oVSb.offsetHeight === 0,
			"Table content fits height -> Vertical scrollbar is not visible");

		oTable._getTotalRowCount.restore();
	});

	QUnit.test("Restoration of scroll positions", function(assert) {
		var iAssertionDelay = 150;
		var done = assert.async();
		var that = this;

		if (Device.browser.msie) {
			iAssertionDelay = 200;
		}

		function assertScrollPositions(sAction, iHorizontalScrollPosition, iVerticalScrollPosition) {
			var oHSb = that.oScrollExtension.getHorizontalScrollbar();
			var oVSb = that.oScrollExtension.getVerticalScrollbar();
			var oHeaderScroll = oTable.getDomRef("sapUiTableColHdrScr");
			var oContentScroll = oTable.getDomRef("sapUiTableCtrlScr");

			assert.strictEqual(oHSb.scrollLeft, iHorizontalScrollPosition,
				sAction + ":  The horizontal scroll position is " + iHorizontalScrollPosition);
			assert.ok(oHSb.scrollLeft === oHeaderScroll.scrollLeft && oHSb.scrollLeft === oContentScroll.scrollLeft,
				sAction + ":  The horizontal scroll positions are synchronized" +
				" [HSb: " + oHSb.scrollLeft
				+ ", Header: " + oHeaderScroll.scrollLeft
				+ ", Content: " + oContentScroll.scrollLeft + "]");
			assert.strictEqual(oVSb.scrollTop, iVerticalScrollPosition,
				sAction + ":  The vertical scroll position is " + iVerticalScrollPosition);
		}

		function assertOnAfterRenderingEventHandlerCall(sAction) {
			assert.ok(that.oOnAfterRenderingEventHandler.calledOnce,
				sAction + ": The onAfterRendering event handler of the scrolling extension has been called once");
			that.oOnAfterRenderingEventHandler.reset();
		}

		new Promise(function(resolve) {
			window.setTimeout(function() {
				assertScrollPositions("Initial", 0, 0);
				that.oScrollExtension.getHorizontalScrollbar().scrollLeft = 50;
				that.oScrollExtension.getVerticalScrollbar().scrollTop = 110;
				resolve();
			}, iAssertionDelay);
		}).then(function() {
			return new Promise(function(resolve) {
				window.setTimeout(function() {
					assertScrollPositions("Scrolled", 50, 110);
					that.oOnAfterRenderingEventHandler = sinon.spy(that.oScrollExtension._ExtensionDelegate, "onAfterRendering");
					oTable.invalidate();
					resolve();
				}, iAssertionDelay);
			});
		}).then(function() {
			return new Promise(function(resolve) {
				window.setTimeout(function() {
					assertOnAfterRenderingEventHandlerCall("Invalidated");
					assertScrollPositions("Invalidated", 50, 110);
					// Add data to test a binding length change and later visibleRowCountMode "Auto".
					oTable.getModel().oData.rows = oTable.getModel().oData.rows.concat(oTable.getModel().oData.rows);
					oTable.getModel().oData.rows = oTable.getModel().oData.rows.concat(oTable.getModel().oData.rows);
					oTable.getModel().oData.rows = oTable.getModel().oData.rows.concat(oTable.getModel().oData.rows);
					oTable.getModel().refresh();
					resolve();
				}, iAssertionDelay);
			});
		}).then(function() {
			return new Promise(function(resolve) {
				window.setTimeout(function() {
					assertScrollPositions("Binding length increased", 50, 110);
					oTable.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Auto, true);
					oTable._updateTableSizes();
					resolve();
				}, iAssertionDelay);
			});
		}).then(function() {
			return new Promise(function(resolve) {
				window.setTimeout(function() {
					assertOnAfterRenderingEventHandlerCall("Content updated");
					assertScrollPositions("Content updated", 50, 110);
					oTable.getModel().oData.rows.splice(oTable.getVisibleRowCount() + 1);
					oTable.getModel().refresh();
					resolve();
				}, iAssertionDelay);
			});
		}).then(function() {
			return new Promise(function(resolve) {
				window.setTimeout(function() {
					assertScrollPositions("Binding length decreased", 50, 49);
					oTable.invalidate();
					resolve();
				}, iAssertionDelay);
			});
		}).then(function() {
			return new Promise(function(resolve) {
				window.setTimeout(function() {
					assertOnAfterRenderingEventHandlerCall("Invalidated");
					assertScrollPositions("Invalidated", 50, 49);
					oTable.getModel().oData.rows.splice(oTable.getVisibleRowCount());
					oTable.getModel().refresh();
					resolve();
				}, iAssertionDelay);
			});
		}).then(function() {
			return new Promise(function(resolve) {
				window.setTimeout(function() {
					assertScrollPositions("Binding length decreased - Vertical scrolling is no longer possible", 50, 0);
					oTable.getModel().oData.rows = oTable.getModel().oData.rows.concat(oTable.getModel().oData.rows);
					oTable.getModel().oData.rows = oTable.getModel().oData.rows.concat(oTable.getModel().oData.rows);
					oTable.getModel().oData.rows = oTable.getModel().oData.rows.concat(oTable.getModel().oData.rows);
					oTable.getModel().refresh();
					resolve();
				}, iAssertionDelay);
			});
		}).then(function() {
			window.setTimeout(function() {
				assertScrollPositions("Binding length increased - Vertical scrolling is possible again", 50, 0);
				done();
			}, iAssertionDelay);
		});
	});

	QUnit.module("Extension methods", {
		beforeEach: function() {
			createTables();

			this.oScrollExtension = oTable._getScrollExtension();
			this.oHSb = this.oScrollExtension.getHorizontalScrollbar();
			this.oVSb = this.oScrollExtension.getVerticalScrollbar();
		},
		afterEach: function() {
			destroyTables();
		}
	});

	QUnit.test("scrollVertically", function(assert) {
		var iVisibleRowCount = 5;
		var iFixedTop = 2;
		var iFixedBottom = 1;
		var iNotVisibleRows = iNumberOfRows - iVisibleRowCount;
		var iPageSize = iVisibleRowCount - iFixedTop - iFixedBottom;
		var iPages = Math.ceil((iNumberOfRows - iFixedTop - iFixedBottom) / iPageSize);
		var i;

		oTable.setVisibleRowCount(iVisibleRowCount);
		oTable.setFixedRowCount(iFixedTop);
		oTable.setFixedBottomRowCount(iFixedBottom);
		sap.ui.getCore().applyChanges();

		var bScrolled = false;

		for (i = 0; i < iNotVisibleRows + 2; i++) {
			if (i < iNotVisibleRows) {
				assert.equal(oTable.getFirstVisibleRow(), i, "First visible row before scroll (forward, stepwise, " + i + ")");
				bScrolled = this.oScrollExtension.scrollVertically(true, false);
				assert.ok(bScrolled, "scroll function indicates that scrolling was performed");
				assert.equal(oTable.getFirstVisibleRow(), i + 1, "First visible row after scroll");
			} else {
				assert.equal(oTable.getFirstVisibleRow(), iNotVisibleRows, "First visible row before scroll (forward, stepwise, " + i + ")");
				bScrolled = this.oScrollExtension.scrollVertically(true, false);
				assert.ok(!bScrolled, "scroll function indicates that no scrolling was performed");
				assert.equal(oTable.getFirstVisibleRow(), iNotVisibleRows, "First visible row after scroll");
			}
		}

		for (i = 0; i < iNotVisibleRows + 2; i++) {
			if (i < iNotVisibleRows) {
				assert.equal(oTable.getFirstVisibleRow(), iNotVisibleRows - i, "First visible row before scroll (backward, stepwise, " + i + ")");
				bScrolled = this.oScrollExtension.scrollVertically(false, false);
				assert.ok(bScrolled, "scroll function indicates that scrolling was performed");
				assert.equal(oTable.getFirstVisibleRow(), iNotVisibleRows - i - 1, "First visible row after scroll");
			} else {
				assert.equal(oTable.getFirstVisibleRow(), 0, "First visible row before scroll (backward, stepwise, " + i + ")");
				bScrolled = this.oScrollExtension.scrollVertically(false, false);
				assert.ok(!bScrolled, "scroll function indicates that no scrolling was performed");
				assert.equal(oTable.getFirstVisibleRow(), 0, "First visible row after scroll");
			}
		}

		var iPos = 0;
		for (i = 0; i < iPages + 2; i++) {
			if (i < iPages - 1) {
				assert.equal(oTable.getFirstVisibleRow(), iPos, "First visible row before scroll (forward, pagewise, " + i + ")");
				bScrolled = this.oScrollExtension.scrollVertically(true, true);
				assert.ok(bScrolled, "scroll function indicates that scrolling was performed");
				iPos = iPos + iPageSize;
				assert.equal(oTable.getFirstVisibleRow(), Math.min(iPos, iNotVisibleRows), "First visible row after scroll");
			} else {
				assert.equal(oTable.getFirstVisibleRow(), iNotVisibleRows, "First visible row before scroll (forward, pagewise, " + i + ")");
				bScrolled = this.oScrollExtension.scrollVertically(true, true);
				assert.ok(!bScrolled, "scroll function indicates that no scrolling was performed");
				assert.equal(oTable.getFirstVisibleRow(), iNotVisibleRows, "First visible row after scroll");
			}
		}

		iPos = iNotVisibleRows;
		for (i = 0; i < iPages + 2; i++) {
			if (i < iPages - 1) {
				assert.equal(oTable.getFirstVisibleRow(), iPos, "First visible row before scroll (backward, pagewise, " + i + ")");
				bScrolled = this.oScrollExtension.scrollVertically(false, true);
				assert.ok(bScrolled, "scroll function indicates that scrolling was performed");
				iPos = iPos - iPageSize;
				assert.equal(oTable.getFirstVisibleRow(), Math.max(iPos, 0), "First visible row after scroll");
			} else {
				assert.equal(oTable.getFirstVisibleRow(), 0, "First visible row before scroll (backward, pagewise, " + i + ")");
				bScrolled = this.oScrollExtension.scrollVertically(false, true);
				assert.ok(!bScrolled, "scroll function indicates that no scrolling was performed");
				assert.equal(oTable.getFirstVisibleRow(), 0, "First visible row after scroll");
			}
		}
	});

	QUnit.test("scrollVerticallyMax", function(assert) {
		var bScrolled;

		/* More data rows than visible rows */
		// ??? Down
		assert.equal(oTable.getFirstVisibleRow(), 0, "First visible row before scrolling");
		bScrolled = this.oScrollExtension.scrollVerticallyMax(true);
		assert.ok(bScrolled, "Scroll function indicates that scrolling was performed");
		assert.equal(oTable.getFirstVisibleRow(), iNumberOfRows - oTable.getVisibleRowCount(), "First visible row after scrolling");
		// ??? Up
		bScrolled = this.oScrollExtension.scrollVerticallyMax(false);
		assert.ok(bScrolled, "Scroll function indicates that scrolling was performed");
		assert.equal(oTable.getFirstVisibleRow(), 0, "First visible row after scrolling");

		/* Less data rows than visible rows */
		oTable.setVisibleRowCount(10);
		sap.ui.getCore().applyChanges();
		// ??? Down
		assert.equal(oTable.getFirstVisibleRow(), 0, "First visible row before scrolling");
		bScrolled = this.oScrollExtension.scrollVerticallyMax(true);
		assert.ok(!bScrolled, "Scroll function indicates that no scrolling was performed");
		assert.equal(oTable.getFirstVisibleRow(), 0, "First visible row after scrolling");
		// ??? Up
		bScrolled = this.oScrollExtension.scrollVerticallyMax(false);
		assert.ok(!bScrolled, "Scroll function indicates that no scrolling was performed");
		assert.equal(oTable.getFirstVisibleRow(), 0, "First visible row after scrolling");

		/* More data rows than visible rows and fixed top/bottom rows */
		oTable.setVisibleRowCount(6);
		oTable.setFixedRowCount(2);
		oTable.setFixedBottomRowCount(2);
		sap.ui.getCore().applyChanges();
		// ??? Down
		assert.equal(oTable.getFirstVisibleRow(), 0, "First visible row before scrolling");
		bScrolled = this.oScrollExtension.scrollVerticallyMax(true);
		assert.ok(bScrolled, "Scroll function indicates that scrolling was performed");
		assert.equal(oTable.getFirstVisibleRow(), iNumberOfRows - oTable.getVisibleRowCount(), "First visible row after scrolling");
		// ??? Up
		bScrolled = this.oScrollExtension.scrollVerticallyMax(false);
		assert.ok(bScrolled, "Scroll function indicates that scrolling was performed");
		assert.equal(oTable.getFirstVisibleRow(), 0, "First visible row after scrolling");

		/* Less data rows than visible rows and fixed top/bottom rows */
		oTable.setVisibleRowCount(10);
		sap.ui.getCore().applyChanges();
		// ??? Down
		assert.equal(oTable.getFirstVisibleRow(), 0, "First visible row before scrolling");
		bScrolled = this.oScrollExtension.scrollVerticallyMax(true);
		assert.ok(!bScrolled, "Scroll function indicates that no scrolling was performed");
		assert.equal(oTable.getFirstVisibleRow(), 0, "First visible row after scrolling");
		// ??? Up
		bScrolled = this.oScrollExtension.scrollVerticallyMax(false);
		assert.ok(!bScrolled, "Scroll function indicates that no scrolling was performed");
		assert.equal(oTable.getFirstVisibleRow(), 0, "First visible row after scrolling");
	});

	QUnit.test("getHorizontalScrollbar", function(assert) {
		assert.strictEqual(this.oScrollExtension.getHorizontalScrollbar(), oTable.getDomRef(sap.ui.table.SharedDomRef.HorizontalScrollBar),
			"Returned: Horizontal scrollbar element");

		this.oScrollExtension.destroy();
		assert.strictEqual(this.oScrollExtension.getHorizontalScrollbar(), null,
			"Returned null: The ScrollExtension is destroyed and has no reference to the table");
	});

	QUnit.test("getVerticalScrollbar", function(assert) {
		assert.strictEqual(this.oScrollExtension.getVerticalScrollbar(), oTable.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar),
			"Returned: Vertical scrollbar element");

		this.oScrollExtension.destroy();
		assert.strictEqual(this.oScrollExtension.getVerticalScrollbar(), null,
			"Returned null: The ScrollExtension is destroyed and has no reference to the table");
	});

	QUnit.test("isHorizontalScrollbarVisible", function(assert) {
		oTable.setFixedColumnCount(0);
		oTable.removeAllColumns();
		oTable.addColumn(new sap.ui.table.Column({
			label: "large column",
			template: "dummy",
			width: "5000px"
		}));
		sap.ui.getCore().applyChanges();

		assert.ok(this.oScrollExtension.isHorizontalScrollbarVisible(),
			"Table content does not fit width -> Horizontal scrollbar is visible");

		oTable.getColumns()[0].setWidth("10px");
		sap.ui.getCore().applyChanges();

		assert.ok(!this.oScrollExtension.isHorizontalScrollbarVisible(),
			"Table content fits width -> Horizontal scrollbar is not visible");
	});

	QUnit.test("isVerticalScrollbarVisible", function(assert) {
		sinon.stub(oTable, "_getTotalRowCount").returns(4);
		oTable.setVisibleRowCount(3);
		sap.ui.getCore().applyChanges();

		assert.ok(this.oScrollExtension.isVerticalScrollbarVisible(),
			"Table content does not fit height -> Vertical scrollbar is visible");

		oTable._getTotalRowCount.returns(2);
		oTable.invalidate();
		sap.ui.getCore().applyChanges();

		assert.ok(!this.oScrollExtension.isVerticalScrollbarVisible(),
			"Table content fits height -> Vertical scrollbar is not visible");
	});

	QUnit.test("updateHorizontalScrollbar", function(assert) {
		var oTableSizes = oTable._collectTableSizes(oTable._collectRowHeights());
		var oHSbContent = oTable.getDomRef("hsb-content");

		oTable.removeAllColumns();

		oTableSizes.tableCtrlScrWidth = 392;
		oTableSizes.tableCtrlScrollWidth = 393;
		oTableSizes.tableCtrlFixedWidth = 10;
		oTableSizes.tableRowHdrScrWidth = 20;
		this.oScrollExtension.updateHorizontalScrollbar(oTableSizes);
		assert.ok(this.oScrollExtension.isHorizontalScrollbarVisible(), "The scrollbar is visible");
		assert.strictEqual(this.oHSb.style.marginLeft, "30px", "The left margin is correct");
		assert.strictEqual(this.oHSb.style.marginRight, "", "The right margin is correct");
		assert.strictEqual(oHSbContent.style.width, "393px", "The scroll range is correct");

		oTable._bRtlMode = true;
		this.oScrollExtension.updateHorizontalScrollbar(oTableSizes);
		assert.ok(this.oScrollExtension.isHorizontalScrollbarVisible(), "RTL: The scrollbar is visible");
		assert.strictEqual(this.oHSb.style.marginLeft, "", "RTL: The left margin is correct");
		assert.strictEqual(this.oHSb.style.marginRight, "30px", "RTL: The right margin is correct");
		assert.strictEqual(oHSbContent.style.width, "393px", "RTL: The scroll range is correct");

		oTable._bRtlMode = false;
		oTableSizes.tableCtrlScrWidth = 393;
		oTableSizes.tableCtrlFixedWidth = 20;
		oTableSizes.tableRowHdrScrWidth = 30;
		this.oScrollExtension.updateHorizontalScrollbar(oTableSizes);
		assert.ok(!this.oScrollExtension.isHorizontalScrollbarVisible(), "The scrollbar is not visible");
		assert.strictEqual(this.oHSb.style.marginLeft, "", "RTL: The left margin is correct");
		assert.strictEqual(this.oHSb.style.marginRight, "30px", "RTL: The right margin is correct");
		assert.strictEqual(oHSbContent.style.width, "393px", "The scroll range is correct");

		oTableSizes.tableCtrlScrollWidth = 444;
		this.oScrollExtension.updateHorizontalScrollbar(oTableSizes);
		assert.ok(this.oScrollExtension.isHorizontalScrollbarVisible(), "The scrollbar is visible");
		assert.strictEqual(this.oHSb.style.marginLeft, "50px", "The left margin is correct");
		assert.strictEqual(this.oHSb.style.marginRight, "", "The right margin is correct");
		assert.strictEqual(oHSbContent.style.width, "444px", "The scroll range is correct");
	});

	QUnit.test("updateVerticalScrollbarHeight", function(assert) {
		var oGetVerticalScrollbarHeightStub = sinon.stub(this.oScrollExtension, "getVerticalScrollbarHeight");

		function getHeight(oElement) {
			if (Device.browser.msie || Device.browser.edge) {
				return parseInt(window.getComputedStyle(oElement).height, 10);
			} else {
				return oElement.getBoundingClientRect().height;
			}
		}

		var iInitialVSbHeight = getHeight(this.oVSb);

		oGetVerticalScrollbarHeightStub.returns(15);
		this.oScrollExtension.updateVerticalScrollbarHeight();
		assert.strictEqual(getHeight(this.oVSb), 15, "The height is 15px");
		assert.strictEqual(window.getComputedStyle(this.oVSb).maxHeight, "15px", "The maximum height is 15px");

		oGetVerticalScrollbarHeightStub.returns(iInitialVSbHeight);
		this.oScrollExtension.updateVerticalScrollbarHeight();
		assert.strictEqual(getHeight(this.oVSb), iInitialVSbHeight,
			"The height is " + iInitialVSbHeight + "px");
		assert.strictEqual(window.getComputedStyle(this.oVSb).maxHeight, iInitialVSbHeight + "px",
			"The maximum height is " + iInitialVSbHeight + "px");

		oGetVerticalScrollbarHeightStub.restore();
	});

	QUnit.test("updateVerticalScrollbarPosition", function(assert) {
		var iExpectedTopPosition;

		oTable.getDomRef().querySelector(".sapUiTableColHdrCnt").style.height = "78px";
		this.oScrollExtension.updateVerticalScrollbarPosition();
		iExpectedTopPosition = oTable.getDomRef("tableCCnt").offsetTop;
		assert.strictEqual(window.getComputedStyle(this.oVSb).top, iExpectedTopPosition + "px",
			"The top position is " + iExpectedTopPosition + "px");

		oTable.setFixedRowCount(1); // Note: Adds 48px to the top position.
		sap.ui.getCore().applyChanges();
		oTable.getDomRef().querySelector(".sapUiTableColHdrCnt").style.height = "78px";
		this.oScrollExtension.updateVerticalScrollbarPosition();
		iExpectedTopPosition = oTable.getDomRef("tableCCnt").offsetTop + 48;
		assert.strictEqual(window.getComputedStyle(this.oScrollExtension.getVerticalScrollbar()).top, iExpectedTopPosition + "px",
			"The top position is " + iExpectedTopPosition + "px");
	});

	QUnit.test("updateVerticalScrollPosition", function(assert) {
		var done = assert.async();
		var that = this;

		function testAsync(mTestConfig) {
			var fnPromiseResolver;
			var oPromise = new Promise(function(resolve) {
				fnPromiseResolver = resolve;
			});

			window.requestAnimationFrame(function() {
				window.setTimeout(function() {
					mTestConfig.test();
					fnPromiseResolver();
				}, 0);
			});

			mTestConfig.act();

			return oPromise;
		}

		new Promise(function(resolve) {
			// First let the table finish rendering.
			window.setTimeout(function() {
				resolve();
			}, 0);
		}).then(function() {
			return testAsync({
				act: function() {
					that.oScrollExtension.updateVerticalScrollPosition(27);
				},
				test: function() {
					assert.strictEqual(that.oVSb.scrollTop, 27, "The vertical scroll position was updated correctly");
				}
			});
		}).then(function() {
			return testAsync({
				act: function() {
					oTable.setFirstVisibleRow(oTable._getMaxRowIndex() + 1);
				},
				test: function() {
					assert.strictEqual(that.oVSb.scrollTop, oTable._getMaxRowIndex() * 49, "The vertical scroll position was updated correctly");
				}
			});
		}).then(function() {
			return testAsync({
				act: function() {
					oTable.setFirstVisibleRow(4);
				},
				test: function() {
					assert.strictEqual(that.oVSb.scrollTop, 4 * 49, "The vertical scroll position was updated correctly");
				}
			});
		}).then(function() {
			return testAsync({
				act: function() {
					sinon.stub(that.oScrollExtension, "isVerticalScrollbarRequired").returns(false);
					that.oScrollExtension.updateVerticalScrollPosition(27);
					that.oScrollExtension.isVerticalScrollbarRequired.restore();
				},
				test: function() {
					assert.strictEqual(that.oVSb.scrollTop, 4 * 49,
						"The vertical scroll position does not need to change, if the vertical scrollbar is not required.");
				}
			});
		}).then(done);
	});

	QUnit.test("updateVerticalScrollHeight", function(assert) {
		var oGetVerticalScrollHeightStub = sinon.stub(this.oScrollExtension, "getVerticalScrollHeight");

		oGetVerticalScrollHeightStub.returns(888);
		this.oScrollExtension.updateVerticalScrollHeight();
		assert.strictEqual(this.oVSb.scrollHeight, 888, "The scroll range is 888px");

		oGetVerticalScrollHeightStub.returns(999999);
		this.oScrollExtension.updateVerticalScrollHeight();
		assert.strictEqual(this.oVSb.scrollHeight, 999999, "The scroll range is 999999px");

		oGetVerticalScrollHeightStub.restore();
	});

	QUnit.test("getVerticalScrollHeight", function(assert) {
		var oGetTotalRowCountStub = sinon.stub(oTable, "_getTotalRowCount");
		var oGetVisibleRowCountStub = sinon.stub(oTable, "getVisibleRowCount");
		var oGetDefaultRowHeightStub = sinon.stub(oTable, "_getDefaultRowHeight");

		oTable._bVariableRowHeightEnabled = false;
		oGetTotalRowCountStub.returns(11);
		oGetVisibleRowCountStub.returns(10);
		oGetDefaultRowHeightStub.returns(100);
		assert.strictEqual(this.oScrollExtension.getVerticalScrollHeight(), 11 * 100,
			"Total row count > Visible row count: The vertical scroll height is correct");

		oGetTotalRowCountStub.returns(10);
		assert.strictEqual(this.oScrollExtension.getVerticalScrollHeight(), 10 * 100,
			"Total row count = Visible row count: The vertical scroll height is correct");

		oGetTotalRowCountStub.returns(9);
		assert.strictEqual(this.oScrollExtension.getVerticalScrollHeight(), 10 * 100,
			"Total row count < Visible row count: The vertical scroll height is correct");

		oTable._bVariableRowHeightEnabled = true;
		oGetTotalRowCountStub.returns(12);
		assert.strictEqual(this.oScrollExtension.getVerticalScrollHeight(), 12 * 100,
			"Variable row heights enabled & Total row count > Visible row count: The vertical scroll height is correct");

		oGetTotalRowCountStub.returns(11);
		assert.strictEqual(this.oScrollExtension.getVerticalScrollHeight(), 11 * 100,
			"Variable row heights enabled & Total row count = Visible row count: The vertical scroll height is correct");

		oGetTotalRowCountStub.returns(10);
		assert.strictEqual(this.oScrollExtension.getVerticalScrollHeight(), 11 * 100,
			"Variable row heights enabled & Total row count < Visible row count: The vertical scroll height is correct");

		oGetTotalRowCountStub.restore();
		oGetVisibleRowCountStub.restore();
		oGetDefaultRowHeightStub.restore();
	});

	QUnit.test("updateVerticalScrollbarVisibility", function(assert) {
		var oIsVerticalScrollbarRequiredStub = sinon.stub(this.oScrollExtension, "isVerticalScrollbarRequired");

		oIsVerticalScrollbarRequiredStub.returns(true);
		this.oScrollExtension.updateVerticalScrollbarVisibility();
		assert.ok(this.oScrollExtension.isVerticalScrollbarVisible(), "The scrollbar is visible");

		oIsVerticalScrollbarRequiredStub.returns(false);
		this.oVSb.scrollTop = 1;
		this.oScrollExtension.updateVerticalScrollbarVisibility();
		assert.ok(!this.oScrollExtension.isVerticalScrollbarVisible(), "The scrollbar is visible");
		assert.strictEqual(this.oVSb.scrollTop, 0, "The scroll position was reset");

		oIsVerticalScrollbarRequiredStub.returns(true);
		this.oScrollExtension.updateVerticalScrollbarVisibility();
		assert.ok(this.oScrollExtension.isVerticalScrollbarVisible(), "The scrollbar is visible");

		oIsVerticalScrollbarRequiredStub.restore();
	});

	QUnit.test("isVerticalScrollbarRequired", function(assert) {
		var oGetTotalRowCountStub = sinon.stub(oTable, "_getTotalRowCount");
		var oGetVisibleRowCountStub = sinon.stub(oTable, "getVisibleRowCount");
		var that = this;

		function test(iTotalRowCount, iVisibleRowCount, iRowHeightsDelta, bVSbShouldBeRequired) {
			oGetTotalRowCountStub.returns(iTotalRowCount);
			oGetVisibleRowCountStub.returns(iVisibleRowCount);
			that.oScrollExtension._iInnerVerticalScrollRange = iRowHeightsDelta;

			assert.strictEqual(that.oScrollExtension.isVerticalScrollbarRequired(), bVSbShouldBeRequired,
				"Total row count: " + iTotalRowCount + ", Visible row count: " + iVisibleRowCount + ", Row heights delta: " + iRowHeightsDelta);
		}

		test(10, 10, 0, false); // Total row count <= Visible row count
		test(10, 1, 0, true); // Total row count > Visible row count
		test(1, 10, 1, true); // Total row count <= Visible row count, but row heights delta > 0 (increased row heights)
		test(10, 1, 1, true); // Total row count > Visible row count

		oGetTotalRowCountStub.restore();
		oGetVisibleRowCountStub.restore();
	});

	QUnit.test("getRowIndexAtScrollPosition", function(assert) {
		var oGetMaxRowIndexStub = sinon.stub(oTable, "_getMaxRowIndex");
		var oGetScrollingPixelsForRowStub = sinon.stub(this.oScrollExtension, "getVerticalScrollRangeRowFraction");
		var oGetVirtualScrollRangeStub = sinon.stub(this.oScrollExtension, "getVerticalScrollRange");
		var mTestSettings;
		var that = this;

		function test(mTestSettings) {
			oGetMaxRowIndexStub.returns(mTestSettings.maxRowIndex);
			oGetScrollingPixelsForRowStub.returns(mTestSettings.scrollingPixelsForRow);
			oGetVirtualScrollRangeStub.returns(mTestSettings.scrollRange);

			assert.strictEqual(that.oScrollExtension.getRowIndexAtScrollPosition(mTestSettings.scrollPosition), mTestSettings.expectedRowIndex,
				JSON.stringify(mTestSettings).replace(/"([^(\")]+)":/g, "$1: ").replace(/(\d+,)/g, "$1 "));
		}

		mTestSettings = {
			maxRowIndex: 0,
			scrollingPixelsForRow: 50,
			scrollRange: 1001,
			scrollPosition: 1000,
			expectedRowIndex: 0
		};
		test(mTestSettings);

		mTestSettings.maxRowIndex = 1;
		mTestSettings.expectedRowIndex = 1;
		test(mTestSettings);

		mTestSettings.maxRowIndex = 21;
		mTestSettings.expectedRowIndex = 20;
		test(mTestSettings);

		mTestSettings.scrollRange = 1000.99999;
		mTestSettings.expectedRowIndex = 21;
		test(mTestSettings);

		mTestSettings.scrollPosition = 999.99999;
		mTestSettings.expectedRowIndex = 19;
		test(mTestSettings);

		oGetMaxRowIndexStub.restore();
		oGetScrollingPixelsForRowStub.restore();
		oGetVirtualScrollRangeStub.restore();
	});

	QUnit.test("getVerticalScrollRange", function(assert) {
		var oGetVerticalScrollHeightStub = sinon.stub(this.oScrollExtension, "getVerticalScrollHeight");
		var oGetVerticalScrollbarHeightStub = sinon.stub(this.oScrollExtension, "getVerticalScrollbarHeight");
		var mTestSettings;
		var that = this;

		function test(mTestSettings) {
			oGetVerticalScrollHeightStub.returns(mTestSettings.verticalScrollHeight);
			oGetVerticalScrollbarHeightStub.returns(mTestSettings.verticalScrollbarHeight);
			oTable._bVariableRowHeightEnabled = mTestSettings.variableRowHeightsEnabled;
			that.oScrollExtension._iInnerVerticalScrollRange = mTestSettings.rowHeightsDelta;

			assert.strictEqual(that.oScrollExtension.getVerticalScrollRange(), mTestSettings.expectedScrollRange,
				JSON.stringify(mTestSettings).replace(/"([^(\")]+)":/g, "$1: ").replace(/(\d+,)/g, "$1 "));
		}

		mTestSettings = {
			verticalScrollbarHeight: 0,
			verticalScrollHeight: 0,
			variableRowHeightsEnabled: false,
			rowHeightsDelta: 0,
			expectedScrollRange: 1
		};
		test(mTestSettings);

		mTestSettings.verticalScrollbarHeight = 200;
		test(mTestSettings);

		mTestSettings.verticalScrollHeight = 200;
		test(mTestSettings);

		mTestSettings.verticalScrollHeight = 1000;
		mTestSettings.expectedScrollRange = 800;
		test(mTestSettings);

		mTestSettings.rowHeightsDelta = 50;
		test(mTestSettings);

		mTestSettings.variableRowHeightsEnabled = true;
		mTestSettings.expectedScrollRange = 750;
		test(mTestSettings);

		mTestSettings.rowHeightsDelta = 1000;
		mTestSettings.expectedScrollRange = 1;
		test(mTestSettings);

		oGetVerticalScrollHeightStub.restore();
		oGetVerticalScrollbarHeightStub.restore();
	});

	QUnit.test("getVerticalScrollRangeRowFraction", function(assert) {
		var oGetVerticalScrollRangeStub = sinon.stub(this.oScrollExtension, "getVerticalScrollRange");
		var oGetMaxRowIndexStub = sinon.stub(oTable, "_getMaxRowIndex");
		var that = this;

		function test(mTestSettings) {
			oGetVerticalScrollRangeStub.returns(mTestSettings.verticalScrollRange);
			oGetMaxRowIndexStub.returns(mTestSettings.maxRowIndex);

			assert.strictEqual(that.oScrollExtension.getVerticalScrollRangeRowFraction(), mTestSettings.expectedResult,
				JSON.stringify(mTestSettings).replace(/"([^(\")]+)":/g, "$1: ").replace(/(\d+,)/g, "$1 "));
		}

		test({verticalScrollRange: 0, maxRowIndex: 0, expectedResult: 1});
		test({verticalScrollRange: 0, maxRowIndex: 10, expectedResult: 0.1});
		test({verticalScrollRange: 1000, maxRowIndex: 0, expectedResult: 1000});
		test({verticalScrollRange: 1000, maxRowIndex: 1, expectedResult: 1000});
		test({verticalScrollRange: 1000, maxRowIndex: 10, expectedResult: 100});
		test({verticalScrollRange: 1000, maxRowIndex: 3, expectedResult: 1000 / 3});

		oGetVerticalScrollRangeStub.restore();
		oGetMaxRowIndexStub.restore();
	});

	QUnit.test("getVerticalScrollRangeDelta", function(assert) {
		var oGetVerticalScrollHeightStub = sinon.stub(this.oScrollExtension, "getVerticalScrollHeight");
		var oGetVerticalScrollbarHeightStub = sinon.stub(this.oScrollExtension, "getVerticalScrollbarHeight");
		var oGetVerticalScrollRangeStub = sinon.stub(this.oScrollExtension, "getVerticalScrollRange");
		var oGetTotalRowCountStub = sinon.stub(oTable, "_getTotalRowCount");
		var oGetVisibleRowCountStub = sinon.stub(oTable, "getVisibleRowCount");
		var mTestSettings;
		var that = this;

		function test(mTestSettings) {
			oGetVerticalScrollHeightStub.returns(mTestSettings.verticalScrollHeight);
			oGetVerticalScrollbarHeightStub.returns(mTestSettings.verticalScrollbarHeight);
			oGetVerticalScrollRangeStub.returns(mTestSettings.verticalScrollRange);
			oGetTotalRowCountStub.returns(mTestSettings.totalRowCount);
			oGetVisibleRowCountStub.returns(mTestSettings.visibleRowCount);

			assert.strictEqual(that.oScrollExtension.getVerticalScrollRangeDelta(), mTestSettings.expectedResult,
				JSON.stringify(mTestSettings).replace(/"([^(\")]+)":/g, "$1: ").replace(/(\d+,)/g, "$1 "));
		}

		mTestSettings = {
			verticalScrollbarHeight: 0,
			verticalScrollHeight: 0,
			verticalScrollRange: 0,
			totalRowCount: 0,
			visibleRowCount: 0,
			expectedResult: 0
		};
		test(mTestSettings);

		mTestSettings.verticalScrollbarHeight = 200;
		test(mTestSettings);

		mTestSettings.verticalScrollHeight = 1000;
		mTestSettings.expectedResult = 800;
		test(mTestSettings);

		mTestSettings.visibleRowCount = 10;
		test(mTestSettings);

		mTestSettings.totalRowCount = 20;
		mTestSettings.expectedResult = 800;
		test(mTestSettings);

		mTestSettings.verticalScrollRange = 801;
		mTestSettings.expectedResult = 0;
		test(mTestSettings);

		mTestSettings.verticalScrollRange = 800;
		test(mTestSettings);

		mTestSettings.verticalScrollRange = 799;
		mTestSettings.expectedResult = 1;
		test(mTestSettings);

		oGetVerticalScrollHeightStub.restore();
		oGetVerticalScrollbarHeightStub.restore();
		oGetVerticalScrollRangeStub.restore();
		oGetTotalRowCountStub.restore();
		oGetVisibleRowCountStub.restore();
	});

	QUnit.module("Horizontal scrolling", {
		beforeEach: function() {
			createTables();

			oTable.getColumns()[1].setWidth("1000px");
			sap.ui.getCore().applyChanges();

			this.oScrollExtension = oTable._getScrollExtension();
			this.oScrollExtension._debug();

			this.oHSb = this.oScrollExtension.getHorizontalScrollbar();
			this.oHeaderScroll = oTable.getDomRef("sapUiTableColHdrScr");
			this.oContentScroll = oTable.getDomRef("sapUiTableCtrlScr");
		},
		afterEach: function() {
			destroyTables();
		},
		assertSynchronization: function(assert, iScrollPosition) {
			if (iScrollPosition == null) {
				iScrollPosition = this.oHSb.scrollLeft;
			}

			var bIsSynchronized = this.oHSb.scrollLeft === iScrollPosition &&
								  (this.oHSb.scrollLeft === this.oHeaderScroll.scrollLeft && this.oHSb.scrollLeft === this.oContentScroll.scrollLeft);

			assert.ok(bIsSynchronized, "Scroll positions are synchronized at position " + iScrollPosition +
									   " [HSb: " + this.oHSb.scrollLeft + ", Header: " + this.oHeaderScroll.scrollLeft + ", Content: "
									   + this.oContentScroll.scrollLeft + "]");
		}
	});

	QUnit.test("Imitating scrollbar scrolling", function(assert) {
		var done = assert.async();
		var iAssertionDelay = 50;

		// Scroll right to 200
		/* eslint-disable no-loop-func */
		for (var i = 1; i <= 20; i++) {
			window.setTimeout(function(_i) {
				this.oHSb.scrollLeft = _i * 10;

				if (_i === 20) { // Delay the asserts so that all the scroll event handlers can be called before.
					window.setTimeout(function() {
						assert.strictEqual(this.oHSb.scrollLeft, 200, "Horizontal scrollbar scroll position is 200");
						assert.strictEqual(this.oHeaderScroll.scrollLeft, 200, "Header scroll position is 200");
						assert.strictEqual(this.oContentScroll.scrollLeft, 200, "Content scroll position is 200");
						scrollLeftTo20.bind(this)();
					}.bind(this), iAssertionDelay);
				}

			}.bind(this, i), i);
		}

		function scrollLeftTo20() {
			for (var i = 1; i <= 18; i++) {
				window.setTimeout(function(_i) {
					this.oHSb.scrollLeft = 200 - _i * 10;

					if (_i === 18) { // Delay the asserts so that all the scroll event handlers can be called before.
						window.setTimeout(function() {
							assert.strictEqual(this.oHSb.scrollLeft, 20, "Horizontal scrollbar scroll position is 20");
							assert.strictEqual(this.oHeaderScroll.scrollLeft, 20, "Header scroll position is 20");
							assert.strictEqual(this.oContentScroll.scrollLeft, 20, "Content scroll position is 20");
							done();
						}.bind(this), iAssertionDelay);
					}

				}.bind(this, i), i);
			}
		}

		/* eslint-enable no-loop-func */
	});

	QUnit.test("Imitating Arrow Left/Right and Home/End key navigation", function(assert) {
		var done = assert.async();
		var that = this;
		var iNumberOfCols = oTable.getColumns().length;
		var iAssertionDelay = 50;

		// Start at the first cell in the header.
		var iRowIndex = 0;
		var iColIndex = 0;
		var oCell = jQuery.sap.domById((oTable._getVisibleColumns()[iColIndex]).getId());
		oCell.focus();

		function navigateHorizontal(bRight) {
			return new Promise(
				function(resolve) {
					iColIndex = bRight ? iColIndex + 1 : iColIndex - 1;

					var sKey = bRight ? "ARROW_RIGHT" : "ARROW_LEFT";
					qutils.triggerKeydown(oCell, sKey, false, false, false);

					if (iRowIndex === 0) {
						oCell = jQuery.sap.domById((oTable._getVisibleColumns()[iColIndex]).getId());
					} else {
						oCell = jQuery.sap.domById(oTable.getId() + "-rows-row" + (iRowIndex - 1) + "-col" + iColIndex);
					}

					window.setTimeout(function() {
						that.assertSynchronization(assert);
						resolve();
					}, iAssertionDelay);
				}
			);
		}

		// Header: Navigate from the first column header cell to the last.
		navigateHorizontal(true).then(function() {	// 2
			return navigateHorizontal(true);		// 3
		}).then(function() {
			return navigateHorizontal(true);		// 4
		}).then(function() {
			return navigateHorizontal(true);		// 5
		}).then(function() {

			// Header: Navigate to the content.
			iRowIndex++;
			qutils.triggerKeydown(oCell, "ARROW_DOWN", false, false, false);
			oCell = jQuery.sap.domById(oTable.getId() + "-rows-row" + (iRowIndex - 1) + "-col" + iColIndex);

			// Content: Navigate to the first cell.
			return navigateHorizontal(false);		// 4
		}).then(function() {
			return navigateHorizontal(false);		// 3
		}).then(function() {
			return navigateHorizontal(false);		// 2
		}).then(function() {
			return navigateHorizontal(false);		// 1
		}).then(function() {

			// Content: Navigate to the last cell.
			return navigateHorizontal(true);		// 2
		}).then(function() {
			return navigateHorizontal(true);		// 3
		}).then(function() {
			return navigateHorizontal(true);		// 4
		}).then(function() {
			return navigateHorizontal(true);		// 5
		}).then(function() {

			// Content: Navigate to the header.
			iRowIndex--;
			qutils.triggerKeydown(oCell, "ARROW_UP", false, false, false);
			oCell = jQuery.sap.domById((oTable._getVisibleColumns()[iColIndex]).getId());

			// Header: Navigate to the first cell.
			return navigateHorizontal(false);		// 4
		}).then(function() {
			return navigateHorizontal(false);		// 3
		}).then(function() {
			return navigateHorizontal(false);		// 2
		}).then(function() {
			return navigateHorizontal(false);		// 1
		}).then(function() {

			// Header: Navigate to the last cell.
			iColIndex = iNumberOfCols - 1;
			qutils.triggerKeydown(oCell, "END", false, false, false);
			oCell = jQuery.sap.domById((oTable._getVisibleColumns()[iColIndex]).getId());

			return new Promise(
				function(resolve) {
					window.setTimeout(function() {
						that.assertSynchronization(assert);
						resolve();
					}, iAssertionDelay);
				}
			);

			// Header: Navigate to the first cell.
		}).then(function() {
			return navigateHorizontal(false);		// 4
		}).then(function() {
			return navigateHorizontal(false);		// 3
		}).then(function() {
			return navigateHorizontal(false);		// 2
		}).then(function() {
			return navigateHorizontal(false);		// 1
		}).then(function() {

			// Header: Navigate to the content.
			iRowIndex++;
			qutils.triggerKeydown(oCell, "ARROW_DOWN", false, false, false);
			oCell = jQuery.sap.domById(oTable.getId() + "-rows-row" + (iRowIndex - 1) + "-col" + iColIndex);

			// Content: Navigate to the last cell.
			return navigateHorizontal(true);		// 2
		}).then(function() {
			return navigateHorizontal(true);		// 3
		}).then(function() {
			return navigateHorizontal(true);		// 4
		}).then(function() {
			return navigateHorizontal(true);		// 5
		}).then(function() {

			// Content: Navigate to the first cell.
			return navigateHorizontal(false);		// 4
		}).then(function() {
			return navigateHorizontal(false);		// 3
		}).then(function() {
			return navigateHorizontal(false);		// 2
		}).then(function() {
			return navigateHorizontal(false);		// 1
		}).then(function() {

			// Content: Navigate to the header.
			iRowIndex--;
			qutils.triggerKeydown(oCell, "ARROW_UP", false, false, false);
			oCell = jQuery.sap.domById((oTable._getVisibleColumns()[iColIndex]).getId());

			// Header: Navigate to the last cell.
			return navigateHorizontal(true);		// 2
		}).then(function() {
			return navigateHorizontal(true);		// 3
		}).then(function() {
			return navigateHorizontal(true);		// 4
		}).then(function() {
			return navigateHorizontal(true);		// 5
		}).then(function() {

			// Navigate to the first cell in the header.
			qutils.triggerKeydown(oCell, "HOME", false, false, false);

			window.setTimeout(function() {
				that.assertSynchronization(assert, 0);
				done();
			}, iAssertionDelay);
		});
	});

	QUnit.test("Imitating mouse wheel", function(assert) {
		initRowActions(oTable, 1, 1);
		this.oHSb = this.oScrollExtension.getHorizontalScrollbar();
		this.oHeaderScroll = oTable.getDomRef("sapUiTableColHdrScr");
		this.oContentScroll = oTable.getDomRef("sapUiTableCtrlScr");

		var done = assert.async();
		var that = this;
		var iAssertionDelay = 100;
		var iCurrentScrollPosition = this.oHSb.scrollLeft;
		var iMinColumnWidth = sap.ui.table.TableUtils.Column.getMinColumnWidth();
		var DeltaMode = {
			PIXEL: 0,
			LINE: 1,
			PAGE: 2
		};

		function scrollForwardAndBackToBeginning(oTargetElement) {
			that.oHSb.scrollLeft = 0;
			iCurrentScrollPosition = 0;

			return scrollWithMouseWheel(oTargetElement, 150, DeltaMode.PIXEL, true, iCurrentScrollPosition + 150, true).then(function() {
				return scrollWithMouseWheel(oTargetElement, 3, DeltaMode.LINE, true, iCurrentScrollPosition + iMinColumnWidth, true);
			}).then(function() {
				return scrollWithMouseWheel(oTargetElement, 2, DeltaMode.PAGE, true, iCurrentScrollPosition + iMinColumnWidth, true);
			}).then(function() {
				return scrollWithMouseWheel(oTargetElement, -100, DeltaMode.PIXEL, true, iCurrentScrollPosition - 100, true);
			}).then(function() {
				return scrollWithMouseWheel(oTargetElement, -50, DeltaMode.PIXEL, false, iCurrentScrollPosition - 50, true);
			}).then(function() {
				return scrollWithMouseWheel(oTargetElement, -3, DeltaMode.LINE, true, iCurrentScrollPosition - iMinColumnWidth, true);
			}).then(function() {
				return scrollWithMouseWheel(oTargetElement, -2, DeltaMode.PAGE, true, iCurrentScrollPosition - iMinColumnWidth, true);
			});
		}

		function scrollBeyondBoundaries(oTargetElement) {
			that.oHSb.scrollLeft = 0;
			iCurrentScrollPosition = 0;

			return scrollWithMouseWheel(oTargetElement, -150, DeltaMode.PIXEL, true, 0, true).then(function() {
				that.oHSb.scrollLeft = that.oHSb.scrollWidth - that.oHSb.getBoundingClientRect().width;
				iCurrentScrollPosition = that.oHSb.scrollLeft;

				return scrollWithMouseWheel(oTargetElement, 150, DeltaMode.PIXEL, true, iCurrentScrollPosition, true);
			});
		}

		function scrollOnInvalidTarget(oTargetElement) {
			that.oHSb.scrollLeft = 50;
			iCurrentScrollPosition = 50;

			return scrollWithMouseWheel(oTargetElement, 150, DeltaMode.PIXEL, true, iCurrentScrollPosition, false).then(function() {
				return scrollWithMouseWheel(oTargetElement, -150, DeltaMode.PIXEL, true, iCurrentScrollPosition, false);
			});
		}

		function scrollWithMouseWheel(oTargetElement, iScrollDelta, iDeltaMode, bShift, iExpectedScrollPosition, bValidTarget) {
			return new Promise(function(resolve) {
				var oWheelEvent;

				if (typeof Event === "function") {
					oWheelEvent = new window.WheelEvent("wheel", {
						deltaY: bShift ? iScrollDelta : 0,
						deltaX: bShift ? 0 : iScrollDelta,
						deltaMode: iDeltaMode,
						shiftKey: bShift,
						bubbles: true,
						cancelable: true
					});
				} else { // IE or PhantomJS
					oWheelEvent = document.createEvent("Event");
					oWheelEvent.deltaY = bShift ? iScrollDelta : 0;
					oWheelEvent.deltaX = bShift ? 0 : iScrollDelta;
					oWheelEvent.deltaMode = iDeltaMode;
					oWheelEvent.shiftKey = bShift;
					oWheelEvent.initEvent("wheel", true, true);

					if (Device.browser.msie) {
						var fnOriginalPreventDefault = oWheelEvent.preventDefault;
						oWheelEvent.preventDefault = function() {
							fnOriginalPreventDefault.apply(this, arguments);
							Object.defineProperty(this, "defaultPrevented", {get: function() {return true;}});
						};
					}
				}

				var oStopPropagationSpy = sinon.spy(oWheelEvent, "stopPropagation");

				oTargetElement.dispatchEvent(oWheelEvent);

				window.setTimeout(function() {
					that.assertSynchronization(assert, iExpectedScrollPosition);

					if (!bValidTarget) {
						assert.ok(!oWheelEvent.defaultPrevented, "Target does not support mousewheel scrolling: Default action was not prevented");
						assert.ok(oStopPropagationSpy.notCalled, "Target does not support mousewheel scrolling: Propagation was not stopped");
					} else if (iCurrentScrollPosition === 0 && iScrollDelta < 0) {
						assert.ok(oWheelEvent.defaultPrevented, "Scroll position is already at the beginning: Default action was prevented");
						assert.ok(oStopPropagationSpy.calledOnce, "Scroll position is already at the beginning: Propagation was stopped");
					} else if (iCurrentScrollPosition === that.oHSb.scrollWidth - that.oHSb.getBoundingClientRect().width && iScrollDelta > 0) {
						assert.ok(oWheelEvent.defaultPrevented, "Scroll position is already at the end: Default action was prevented");
						assert.ok(oStopPropagationSpy.calledOnce, "Scroll position is already at the end: Propagation was stopped");
					} else {
						assert.ok(oWheelEvent.defaultPrevented, "Default action was prevented");
						assert.ok(oStopPropagationSpy.calledOnce, "Propagation was stopped");
					}

					iCurrentScrollPosition = iExpectedScrollPosition;

					resolve();
				}, iAssertionDelay);
			});
		}

		scrollForwardAndBackToBeginning(getCell(0, 0)[0]).then(function() { // Cell in fixed column.
			return scrollForwardAndBackToBeginning(getCell(2, 2)[0]); // Cell in scrollable column.
		}).then(function() {
			return scrollForwardAndBackToBeginning(getRowHeader(0)[0]);
		}).then(function() {
			return scrollForwardAndBackToBeginning(getRowAction(0)[0]);
		}).then(function() {
			return scrollBeyondBoundaries(getCell(2, 2)[0]); // Cell in scrollable column.
		}).then(function() {
			return scrollOnInvalidTarget(getSelectAll()[0]);
		}).then(function() {
			return scrollOnInvalidTarget(getColumnHeader(1)[0]);
		}).then(done);
	});

	QUnit.test("Imitating touch", function(assert) {
		var bOriginalPointerSupport = Device.support.pointer;
		var bOriginalTouchSupport = Device.support.touch;
		Device.support.pointer = false;
		Device.support.touch = true;

		oTable._getKeyboardExtension()._suspendItemNavigation(); // Touch can set the focus, which can lead to scrolling. Prevent it!
		oTable.setFixedRowCount(1);
		initRowActions(oTable, 1, 1);
		this.oHSb = this.oScrollExtension.getHorizontalScrollbar();
		this.oHeaderScroll = oTable.getDomRef("sapUiTableColHdrScr");
		this.oContentScroll = oTable.getDomRef("sapUiTableCtrlScr");

		var done = assert.async();
		var that = this;
		var iAssertionDelay = 100;
		var iTouchPosition;
		var iCurrentScrollPosition = this.oHSb.scrollLeft;

		function scrollForwardAndBackToBeginning(oTargetElement) {
			that.oHSb.scrollLeft = 0;
			iCurrentScrollPosition = 0;

			initTouchScrolling(oTargetElement, 200);
			return scrollWithTouch(oTargetElement, 150, iCurrentScrollPosition + 150, true).then(function() {
				return scrollWithTouch(oTargetElement, -150, iCurrentScrollPosition - 150, true);
			});
		}

		function scrollBeyondBoundaries(oTargetElement) {
			that.oHSb.scrollLeft = 0;
			iCurrentScrollPosition = 0;

			initTouchScrolling(oTargetElement, 200);
			return scrollWithTouch(oTargetElement, -150, 0, true).then(function() {
				that.oHSb.scrollLeft = that.oHSb.scrollWidth - that.oHSb.getBoundingClientRect().width;
				iCurrentScrollPosition = that.oHSb.scrollLeft;

				initTouchScrolling(oTargetElement, 200);
				return scrollWithTouch(oTargetElement, 150, iCurrentScrollPosition, true);
			});
		}

		function scrollOnInvalidTarget(oTargetElement) {
			that.oHSb.scrollLeft = 50;
			iCurrentScrollPosition = 50;

			initTouchScrolling(oTargetElement, 200);
			return scrollWithTouch(oTargetElement, 150, iCurrentScrollPosition, false).then(function() {
				initTouchScrolling(oTargetElement, 200);
				return scrollWithTouch(oTargetElement, -150, iCurrentScrollPosition, false);
			});
		}

		function initTouchScrolling(oTargetElement, iPageX) {
			var oTouchEvent;

			iTouchPosition = iPageX;

			if (typeof Event === "function" && typeof window.Touch === "function") {
				var oTouchObject = new window.Touch({
					identifier: Date.now(),
					target: oTargetElement,
					pageX: iTouchPosition,
					pageY: 0
				});

				oTouchEvent = new window.TouchEvent("touchstart", {
					bubbles: true,
					cancelable: true,
					touches: [oTouchObject]
				});
			} else { // Firefox, Edge, IE, PhantomJS
				oTouchEvent = document.createEvent("Event");
				oTouchEvent.touches = [
					{
						pageX: iTouchPosition,
						pageY: 0
					}
				];
				oTouchEvent.initEvent("touchstart", true, true);
			}

			oTargetElement.dispatchEvent(oTouchEvent);
		}

		function scrollWithTouch(oTargetElement, iScrollDelta, iExpectedScrollPosition, bValidTarget) {
			return new Promise(function(resolve) {
				var oTouchEvent;

				iTouchPosition -= iScrollDelta;

				if (typeof Event === "function" && typeof window.Touch === "function") {
					var oTouchObject = new window.Touch({
						identifier: Date.now(),
						target: oTargetElement,
						pageX: iTouchPosition,
						pageY: 0
					});

					oTouchEvent = new window.TouchEvent("touchmove", {
						bubbles: true,
						cancelable: true,
						touches: [oTouchObject]
					});
				} else { // Firefox, Edge, IE, PhantomJS
					oTouchEvent = document.createEvent("Event");
					oTouchEvent.touches = [
						{
							pageX: iTouchPosition,
							pageY: 0
						}
					];
					oTouchEvent.initEvent("touchmove", true, true);

					if (Device.browser.msie) {
						var fnOriginalPreventDefault = oTouchEvent.preventDefault;
						oTouchEvent.preventDefault = function() {
							fnOriginalPreventDefault.apply(this, arguments);
							Object.defineProperty(this, "defaultPrevented", {get: function() {return true;}});
						};
					}
				}

				oTargetElement.dispatchEvent(oTouchEvent);

				window.setTimeout(function() {
					that.assertSynchronization(assert, iExpectedScrollPosition);

					// Touch move is also a swipe on touch devices. See the moveHandler method in jquery-mobile-custom.js, to know why
					// preventDefault is always called on touch devices (except in chrome on desktop).

					if (!bValidTarget) {
						if (!bOriginalTouchSupport || bOriginalTouchSupport && Device.system.desktop && Device.browser.chrome) {
							assert.ok(!oTouchEvent.defaultPrevented, "Target does not support touch scrolling: Default action was not prevented");
						} else {
							assert.ok(oTouchEvent.defaultPrevented,
								"Target does not support touch scrolling: Default action was still prevented on a touch device (swipe action)");
						}
					} else if (iCurrentScrollPosition === 0 && iScrollDelta < 0) {
						if (!bOriginalTouchSupport || bOriginalTouchSupport && Device.system.desktop && Device.browser.chrome) {
							assert.ok(!oTouchEvent.defaultPrevented, "Scroll position is already at the beginning: Default action was not prevented");
						} else {
							assert.ok(oTouchEvent.defaultPrevented,
								"Scroll position is already at the beginning: Default action was still prevented on a touch device (swipe action)");
						}
					} else if (iCurrentScrollPosition === that.oHSb.scrollWidth - that.oHSb.getBoundingClientRect().width && iScrollDelta > 0) {
						if (!bOriginalTouchSupport || bOriginalTouchSupport && Device.system.desktop && Device.browser.chrome) {
							assert.ok(!oTouchEvent.defaultPrevented, "Scroll position is already at the end: Default action was not prevented");
						} else {
							assert.ok(oTouchEvent.defaultPrevented,
								"Scroll position is already at the end: Default action was still prevented on a touch device (swipe action)");
						}
					} else {
						assert.ok(oTouchEvent.defaultPrevented, "Default action was prevented");
					}

					iCurrentScrollPosition = iExpectedScrollPosition;

					resolve();
				}, iAssertionDelay);
			});
		}

		scrollForwardAndBackToBeginning(getCell(0, 0)[0]).then(function() { // Cell in fixed column.
			return scrollForwardAndBackToBeginning(getCell(2, 2)[0]); // Cell in scrollable column.
		}).then(function() {
			return scrollForwardAndBackToBeginning(getRowHeader(0)[0]);
		}).then(function() {
			return scrollForwardAndBackToBeginning(getRowAction(0)[0]);
		}).then(function() {
			return scrollBeyondBoundaries(getCell(2, 2)[0]); // Cell in scrollable column.
		}).then(function() {
			return scrollOnInvalidTarget(getSelectAll()[0]);
		}).then(function() {
			return scrollOnInvalidTarget(getColumnHeader(1)[0]);
		}).then(function() {
			Device.support.pointer = bOriginalPointerSupport;
			Device.support.touch = bOriginalTouchSupport;
			done();
		});
	});

	QUnit.module("Vertical scrolling", {
		beforeEach: function() {
			createTables();

			this.oDefaultSetting = {
				length: 30,
				visibleRowCount: 10,
				expectedFirstVisibleRow: 0,
				tolerance: 0,
				scrollTop: 0,
				rowHeight: 50,
				variableRowHeight: false
			};

			this.iAssertionDelay = 75;
		},
		afterEach: function() {
			destroyTables();
		},
		doTest: function(assert, oSetting) {
			var done = assert.async();
			oSetting = jQuery.extend({}, this.oDefaultSetting, oSetting);
			oTable.setVisibleRowCount(oSetting.visibleRowCount);
			oTable.setRowHeight(oSetting.rowHeight);
			oTable.unbindRows();
			oTable.bindRows("/rows");
			oTable._bVariableRowHeightEnabled = oSetting.variableRowHeight;
			if (oTable._bVariableRowHeightEnabled) {
				oTable.setFixedRowCount(0);
				oTable.setFixedBottomRowCount(0);
				oTable._collectRowHeights = function() {
					var oDomRef = this.getDomRef();
					if (!oDomRef) {
						return [];
					}
					var aResult = [];
					for (var i = 0; i < oSetting.visibleRowCount; i++) {
						aResult.push(i == 1 ? 70 : oSetting.rowHeight);
					}
				};
			}
			oTable.getBinding("rows").getLength = function() {
				return oSetting.length;
			};
			sap.ui.getCore().applyChanges();

			var iDelay = this.iAssertionDelay;

			setTimeout(function() {
				var oVSb = oTable.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar);
				oVSb.scrollTop = oSetting.scrollTop;

				setTimeout(function() {
					var iExpectedFirstVisibleRow = oSetting.expectedFirstVisibleRow;
					if (typeof oSetting.expectedFirstVisibleRow === "function") {
						iExpectedFirstVisibleRow = oSetting.expectedFirstVisibleRow();
					}
					if (oSetting.tolerance > 0) {
						assert.ok(oTable.getFirstVisibleRow() >= iExpectedFirstVisibleRow - oSetting.tolerance, "Check FirstVisibleRow (>)");
						assert.ok(oTable.getFirstVisibleRow() <= iExpectedFirstVisibleRow + oSetting.tolerance, "Check FirstVisibleRow (<)");
					} else {
						assert.strictEqual(oTable.getFirstVisibleRow(), iExpectedFirstVisibleRow, "Check FirstVisibleRow");
					}
					done();
				}, iDelay);
			}, iDelay);
		}
	});

	QUnit.test("To Middle - small data - no variable row heights", function(assert) {

		this.doTest(assert, {scrollTop: 750, expectedFirstVisibleRow: 15});
	});

	QUnit.test("To End - small data - no variable row heights", function(assert) {
		this.doTest(assert, {scrollTop: 1000, expectedFirstVisibleRow: 20});
	});

	QUnit.test("To Middle - big data - no variable row heights", function(assert) {
		this.doTest(assert, {
			length: 20000000,
			tolerance: 5200,
			scrollTop: 1000000 / 2,
			expectedFirstVisibleRow: 10000000
		});
	});

	QUnit.test("To End - big data - no variable row heights", function(assert) {
		this.doTest(assert, {
			length: 20000000,
			scrollTop: 1000000,
			expectedFirstVisibleRow: 20000000 - 10
		});
	});

	QUnit.test("To Middle - small data - variable row heights", function(assert) {
		this.doTest(assert, {scrollTop: 750, expectedFirstVisibleRow: 15});
	});

	QUnit.test("To End - small data - variable row heights", function(assert) {
		this.doTest(assert, {scrollTop: 1000, expectedFirstVisibleRow: 20});
	});

	QUnit.test("To Middle - big data - variable row heights", function(assert) {
		this.doTest(assert, {
			length: 20000000,
			tolerance: 5200,
			scrollTop: 1000000 / 2,
			expectedFirstVisibleRow: 10000000
		});
	});

	QUnit.test("To End - big data - variable row heights", function(assert) {
		this.doTest(assert, {
			length: 20000000,
			scrollTop: 1000000,
			expectedFirstVisibleRow: 20000000 - 10
		});
	});

	QUnit.module("Special cases", {
		beforeEach: function() {
			createTables();
		},
		afterEach: function() {
			destroyTables();
		}
	});

	QUnit.test("Scrolling inside the cell", function(assert) {
		var done = assert.async();
		var iAssertionDelay = Device.browser.msie ? 100 : 0;

		function test(iRowIndex, iColumnIndex) {
			var oCellContentInColumn;

			return new Promise(function(resolve) {
				window.setTimeout(function() {
					oCellContentInColumn = oTreeTable.getRows()[iRowIndex].getCells()[iColumnIndex].getDomRef();
					oCellContentInColumn.focus();
					resolve();
				}, iAssertionDelay);
			}).then(function(resolve) {
				return new Promise(function(resolve) {
					window.setTimeout(function() {
						var oInnerCellElement = sap.ui.table.TableUtils.getCell(oTreeTable, oCellContentInColumn).find(".sapUiTableCell")[0];

						assert.strictEqual(document.activeElement, oCellContentInColumn,
							"The content of the cell in row " + iRowIndex + " column " + iColumnIndex + " is focused");
						assert.strictEqual(oInnerCellElement.scrollLeft, 0, "The cell content is not scrolled horizontally");
						assert.strictEqual(oInnerCellElement.scrollTop, 0, "The cell content is not scrolled vertically");

						resolve();
					}, iAssertionDelay);
				});
			});
		}

		var DummyControl = sap.ui.core.Control.extend("sap.ui.table.test.DummyControl", {
			renderer: function(oRm, oControl) {
				oRm.write("<div style=\"display: flex; flex-direction: column\">");
				oRm.write("<span tabindex=\"0\" style=\"width: 100px; margin-top: 100px;\">really very looooooooooong text</span>");

				oRm.write("<span tabindex=\"0\" style=\"width: 100px; margin-left: 100px;\"");
				oRm.writeControlData(oControl); // This element should be returned by getDomRef()
				oRm.write(">");
				oRm.writeEscaped("really very looooooooooong text");
				oRm.write("</span>");

				oRm.write("</div>");
			}
		});

		var oColumn1 = oTreeTable.getColumns()[0];
		var oColumn2 = oTreeTable.getColumns()[1];

		oTreeTable.setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Auto);
		oTreeTable.setRowHeight(10);
		oColumn1.setTemplate(new DummyControl());
		oColumn1.setWidth("20px");
		oColumn2.setTemplate(new DummyControl());
		oColumn2.setWidth("20px");

		test(0, 0).then(function() {
			return test(0, 1);
		}).then(function() {
			done();
		});
	});
});