/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/library",
	"sap/ui/thirdparty/jquery",
	"sap/base/assert",
	"sap/base/Log",
	"sap/ui/core/Control",
	"sap/ui/model/ChangeReason",
	"sap/base/util/values",
	"sap/ui/layout/Splitter",
	"sap/ui/layout/SplitterLayoutData",
	"sap/ui/core/ResizeHandler",
	"./InnerGanttChart",
	"./GanttHeader",
	"./GanttSyncedControl",
	"../control/AssociateContainer",
	"../axistime/ProportionZoomStrategy",
	"./SelectionModel",
	"./ExpandModel",
	"./ShapeScheme",
	"./GanttExtension",
	"./GanttScrollExtension",
	"./GanttZoomExtension",
	"./GanttPointerExtension",
	"./GanttDragDropExtension",
	"./GanttPopoverExtension",
	"./GanttConnectExtension",
	"./GanttResizeExtension",
	"./GanttLassoExtension",
	"./GanttUtils",
	"./RenderUtils",
	"../misc/Format",
	"../misc/Utility",
	"../config/TimeHorizon",
	"sap/ui/export/Spreadsheet",
	"sap/m/OverflowToolbar",
	'sap/ui/core/Core',
	'sap/base/util/uid',
	'sap/m/Dialog',
	'sap/m/Input',
	'sap/m/Label',
	'sap/m/VBox',
	'sap/m/Button',
	'sap/ui/model/json/JSONModel',
	'sap/m/Menu',
	'sap/m/MenuButton',
	'sap/m/MenuItem',
	"sap/ui/fl/write/api/ControlPersonalizationWriteAPI",
	"./GanttChartWithTableRenderer"
], function (
	library,
	jQuery,
	assert,
	Log,
	Control,
	ChangeReason,
	values,
	Splitter,
	SplitterLayoutData,
	ResizeHandler,
	InnerGanttChart,
	GanttHeader,
	GanttSyncedControl,
	AssociateContainer,
	ProportionZoomStrategy,
	SelectionModel,
	ExpandModel,
	ShapeScheme,
	GanttExtension,
	GanttScrollExtension,
	GanttZoomExtension,
	GanttPointerExtension,
	GanttDragDropExtension,
	GanttPopoverExtension,
	GanttConnectExtension,
	GanttResizeExtension,
	GanttLassoExtension,
	GanttUtils,
	RenderUtils,
	Format,
	Utility,
	TimeHorizon,
	Spreadsheet,
	OverflowToolbar,
	Core,
	uid,
	Dialog,
	Input,
	Label,
	VBox,
	Button,
	JSONModel,
	Menu,
	MenuButton,
	MenuItem,
	ControlPersonalizationWriteAPI
) {
	"use strict";

	var GanttChartWithTableDisplayType = library.simple.GanttChartWithTableDisplayType,
		VisibleHorizonUpdateType = library.simple.VisibleHorizonUpdateType,
		ExportTableCustomDataType = library.simple.exportTableCustomDataType;

	var VISIBLE_HORIZON_UPDATE_TYPE_MAP = Object.freeze({
		"totalHorizonUpdated": VisibleHorizonUpdateType.TotalHorizonUpdated,
		"mouseWheelZoom": VisibleHorizonUpdateType.MouseWheelZoom,
		"syncVisibleHorizon": VisibleHorizonUpdateType.SyncVisibleHorizon,
		"initialRender": VisibleHorizonUpdateType.InitialRender,
		"horizontalScroll": VisibleHorizonUpdateType.HorizontalScroll,
		"zoomLevelChanged": VisibleHorizonUpdateType.ZoomLevelChanged,
		"timePeriodZooming": VisibleHorizonUpdateType.TimePeriodZooming
	});

	var oResourceBundle = Core.getLibraryResourceBundle("sap.gantt");//Get Resource Bundle to fetch text/ tooltip info

	var MARGIN_OF_ERROR = 10;
	var MIN_AREA_WIDTH = 60;

	function add(a, b) {
		return a + b;
	}

	function almostEqual(a, b) {
		return Math.abs(a - b) < MARGIN_OF_ERROR;
	}

	/**
	 * Creates and initializes a new Gantt Chart
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * The Gantt Chart control provides a comprehensive set of features to display hierarchical data and visualized shapes together.
	 * It's designed to fully support OData binding, declaring hierarchical data and shapes bindings in XML view.
	 * It's the recommended control for new applications.
	 *
	 * @extend sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.88.0
	 * @since 1.60
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.GanttChartWithTable
	 */

	var GanttChartWithTable = Control.extend("sap.gantt.simple.GanttChartWithTable", /** @lends sap.ui.core.Control.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {

				/**
				 * Width of the control.
				 */
				width: {type: "sap.ui.core.CSSSize", defaultValue: "100%"},

				/**
				 * Height of the control.
				 */
				height: {type: "sap.ui.core.CSSSize", defaultValue: "100%"},

				/**
				 * Shape selection mode of the Gantt Chart. This property controls whether single or multiple shapes can be selected.
				 * When the selection mode is changed, the current selection is removed.
				 *
				 * The shapeSelectionMode only works if <code>selectable</code> property on the defined Shape is set to true.
				 */
				shapeSelectionMode: {type : "sap.gantt.SelectionMode", defaultValue : library.SelectionMode.MultiWithKeyboard},

				/**
				 * Specifies whether shape is rendered over relationship or relationship over shape when
				 * relationship leads through shape.
				 *
				 * If enabled, shapes are rendered over relationships. If disabled, relationships are rendered over
				 * shapes.
				 *
				 * @since 1.76
				 */
				shapeOverRelationship: {type: "boolean", defaultValue: true},

				/**
				 * A JSON object containing the shapeSelectionSettings which will be used to configure shape selection
				 * styles. If nothing is specified, then the default selection styles (2px dashed red border) is set.
				 * New properties 'shapeColor' and 'fillOpacity' are introduced as of SAPUI5 1.85 release. Using these,
                                 * you can configure color and opacity of highlighted shapes in a gantt chart.
				 * <i>Below you can find a brief example</i>
				 * <pre><code>
				 * {
				 *    color: "#808080",
				 *    strokeWidth: 2,
				 *    strokeDasharray: "5,1"
				 *    shapeColor: null,
				 *    fillOpacity: 0
				 * }
				 * </code></pre>
				 */
				shapeSelectionSettings: {type: "object", defaultValue: null},

				/**
				 * Flag whether to show or hide the cursor line when moving your mouse cursor
				 */
				enableCursorLine: {type: "boolean", defaultValue: true},

				/**
				 * Flag whether to show or hide the present time indicator.
				 */
				enableNowLine: {type: "boolean", defaultValue: true},

				/**
				 * Flag whether to show the <code>nowLine</code> in UTC or in local time.
				 *
				 * @since 1.68
				 */
				nowLineInUTC: {type: "boolean", defaultValue: true},

				/**
				 * Flag to show or hide vertical lines representing intervals along the time axis
				 */
				enableVerticalLine: {type: "boolean", defaultValue: true},

				/**
				 * Flag to show or hide adhoc lines representing milestones and events along the time axis
				 */
				enableAdhocLine: {type: "boolean", defaultValue: true},

				/**
				 * Specifies on which layer adhoc lines reside. By default, adhoc lines are on top of all other shapes and patterns.
				 */
				adhocLineLayer: {type: "string", defaultValue: library.AdhocLineLayer.Top},

				/**
				* Flag to show or hide Delta Lines
				* @since 1.84
				*/
				enableDeltaLine: { type: "boolean", defaultValue: true },

				/**
				* Flag to show or hide non-working time
				* @since 1.86
				*/
				enableNonWorkingTime: { type: "boolean", defaultValue: true },

				/**
				* Flag to show or hide Chart Delta Area highlighting
				* @since 1.84
				*/
				enableChartDeltaAreaHighlight: { type: "boolean", defaultValue: true },

				/**
				* Specifies the layer on which Delta Lines reside. By default, Delta Lines are above all shapes and patterns.
				* @since 1.84
				*/
				deltaLineLayer: { type: "string", defaultValue: library.DeltaLineLayer.Bottom },

				/**
				* Specifies how the application's date is displayed in the gantt chart. For example: "dd.MM.yyyy" (31.01.2018)
				* @since 1.86
				*/
				datePattern: { type: "string", defaultValue: library.config.DEFAULT_DATE_PATTERN },

				/**
				* Specifies how the application's time is displayed in the gantt chart. For example: "hh:mm a" (12:05 PM)
				* @since 1.86
				*/
				timePattern: { type: "string", defaultValue: library.config.DEFAULT_TIME_PATTERN },

				/** Property to enable borders for expanded rows. By default, only row borders are enabled.
				 * @since 1.84
				 */
				enableExpandedRowBorders: { type: "boolean", defaultValue: true },

				/**
				 * Property to enable the background color for expanded rows. By default, this would show the row background
				 * @since 1.84
				 */
				enableExpandedRowBackground: { type: "boolean", defaultValue: true },

				/** Property to define the height of an expanded row in pixels.
				 * * @since 1.85
				 */
				expandedRowHeight: { type: "int" },

				/**
				 * Drag orientation of Gantt Chart.
				 *
				 * This property doesn't limit the mouse cursor position but the dragging ghost position when dragging it around. This property has 3 values:
				 * <ul>
				 *   <li>Free: The dragging ghost moves along with your mouse cursor.</li>
				 *   <li>Horizontal: The dragged ghost only moves horizontally, cross row dragging is restricted. You can use this mode if you only need to change the times of the dragging shape</li>
				 *   <li>Vertical: <em>Notice</em> Vertical works if only one shape is selected (regardless shapeSelectionMode), it's showing forbidden cursor style on multiple shape selections when you are dragging.
				 *       You can use this vertical mode if you only want to change the assignment without changing shape times.</li>
				 * </ul>
				 */
				dragOrientation: {type: "sap.gantt.DragOrientation", defaultValue: library.DragOrientation.Free},

				/**
				 * The dragging ghost alignment of Gantt Chart. This property define the visual effect of ghost position on dragging, it also effect the parameter value
				 * in event <code>shapeDragEnd</code>
				 *
				 * @see {sap.gantt.dragdrop.GhostAlignment}
				 */
				ghostAlignment: {type: "string", defaultValue: library.dragdrop.GhostAlignment.None},

				/**
				 * Flag to show or hide the start time and end time of a shape when you drag it along the time line
				 */
				showShapeTimeOnDrag: {type: "boolean", defaultValue: false},

				/**
				 * The width of selection panel.
				 *
				 * In <code>sap.gantt.simple.GanttChartWithTable</code>, the selectionPanelSize is the Table/TreeTable width in
				 * the embedded Splitter.
				 */
				selectionPanelSize: {type: "sap.ui.core.CSSSize", defaultValue: "30%"},

				/**
				 * Defines how the Gantt chart is displayed.
				 * <ul>
				 * <li>If set to <code>Both</code>, both the table and the chart are displayed.</li>
				 * <li>If set to <code>Chart</code>, only the chart is displayed.</li>
				 * <li>If set to <code>Table</code>, only the table is displayed.</li>
				 * </ul>
				 * When the parent element of the Gantt chart is the {@link sap.gantt.simple.GanttChartContainer}, this
				 * property overrides the <code>displayType</code> property of {@link sap.gantt.simple.GanttChartContainer}.
				 */
				displayType: {type: "sap.gantt.simple.GanttChartWithTableDisplayType", defaultValue: GanttChartWithTableDisplayType.Both},

				/**
				 * Disables or enables the <code>shapeDoubleClick</code> event.
				 * If set to <code>true</code>, the <code>shapeDoubleClick</code> event is disabled.
				 */
				disableShapeDoubleClickEvent: {type: "boolean", defaultValue: false},

				/**
				 * Flag to show or hide the Export Button for a Table.
				 * <b>Note:</b>CustomData - Mandatory field for Export table to Excel functionality. It contains properties that can be configured based on the column configuration, where the key name is restricted to exportTableColumnConfig.
				 * The custom data is created for aggregation of columns in a table.
				 * Export to excel feature is supported for both OData and JSON models, with the limitation that the tree structure converts to a flat array for a JSON model.
				 * The fields supported in the custom data are:
				 * <ul>
				 *  <li>leadingProperty - DataSource field for a column. This is a mandatory field.</li>
				 *  <li>columnKey - Identifier for individual columns.</li>
				 *  <li>dataType - Data type for the given column element. The supported data types are dateTime, stringDate, date, time, boolean, string and numeric.</li>
				 *  <li>isCurrency - Boolean value to determine if the column type contains Currency.</li>
				 *  <li>unit - Text to display as the unit of measurement of a numeric value.</li>
				 *  <li>unitProperty - Name of the DataSource field that contains the unit/currency texts.</li>
				 *  <li>scale - Number of digits after the decimal point of numeric values.</li>
				 *  <li>precision - Precision for numeric values.</li>
				 *  <li>displayFormat - Date format to be displayed. The default for dateTime is DD-MM-YY HH:MM, and the default for date is DD-MM-YY.</li>
				 *  <li>hierarchyNodeLevel - DataSource field which contains the hierarchy level. This is currently supported only for OData models.</li>
				 *  <li>wrap - Boolean value to determine whether the contents of the table should be wrapped.</li>
				 * </ul>
				 * Example:
				 * <pre>
				 * 	<code>
				 * 		&lt;Column sortProperty="ObjectName" filterProperty="ObjectName"&gt;
				 * 			&lt;customData&gt;
				 * 				&lt;core:CustomData key="exportTableColumnConfig"
				 * 					value='{"columnKey": "ObjectName",
				 *	 				"leadingProperty":"ObjectName",
				 * 					"dataType": "string",
				 * 					"hierarchyNodeLevel": "HierarchyNodeLevel",
				 * 					"wrap": true}' /&gt;
				 * 			&lt;/customData&gt;
				 * 			&lt;m:Text text="Object Name"/&gt;
				 * 			&lt;template&gt;
				 * 				&lt;m:Label text="{data>ObjectName}"/&gt;
				 * 			&lt;/template&gt;
				 * 		&lt;/Column&gt;
				 * 	</code>
				 * </pre>
				 */
				showExportTableToExcel: {type: "boolean", defaultValue: false},

				/**
				 * Allows to drag, drop, and resize a shape on explicitly selecting the shape.
				 * @since 1.85
				 */
				enableSelectAndDrag: {type: "boolean", defaultValue: true},

				/**
				 * Property to add custom color to the highlighted area between delta lines. This would default to Fiori standard color
				 * @since 1.86
				 */
				deltaAreaHighlightColor: {type: "string", defaultValue: "@sapUiListSelectionBackgroundColor"},

				/**
				 * Enables inversion on shape selection while drawing lasso
				 */
				enableLassoInvert: {type: "boolean", defaultValue: false},

				/**
				 * Option to show or hide the parent row on expand. This is applicable only for multi-activity row settings.
				 * @since 1.86
				 */
				showParentRowOnExpand: {type: "boolean", defaultValue: true}

			},
			aggregations: {
				/**
				 * Table of the Gantt Chart
				 *
				 * You can use {sap.ui.table.Table} if you have a flat list data or {sap.ui.table.TreeTable} if you have hierarchical data.
				 */
				table: {type: "sap.ui.table.Table", multiple: false},

				/**
				 * The aggregation is used to store configuration of adhoc lines, adhoc lines represent milestones and events in axis time.
				 * @deprecated Since version 1.84, use {@link sap.gantt.simple.AdhocLine} instead.
				 */
				adhocLines: {type: "sap.gantt.AdhocLine", multiple: true, singularName: "adhocLine", bindable: "bindable", visibility: "public"},

				/**
				 * The aggregation is used to store configuration of adhoc lines, adhoc lines represent milestones and events in axis time.
				 * @since 1.84
				 */
				simpleAdhocLines: {type: "sap.gantt.simple.AdhocLine", multiple: true, singularName: "simpleAdhocLine", bindable: "bindable", visibility: "public"},

				/**
				* The aggregation is used to store configuration of Delta Lines
				* @since 1.84
				*/
				deltaLines: { type: "sap.gantt.simple.DeltaLine", multiple: true, singularName: "deltaLine", bindable: "bindable", visibility: "public"
				},

				/**
				 * SVG reusable element definitions.
				 *
				 * If this property is provided, the paint server definition of the SVG is rendered. Method <code>getDefString()</code> should be
				 * implemented by all paint server classes that are passed in in this property.
				 * We recommend that you set the type of this argument to <code>sap.gantt.def.SvgDefs</code>. Otherwise some properties you set may not function properly.
				 */
				svgDefs: {type: "sap.gantt.def.SvgDefs", multiple: false, singularName: "svgDef"},

				/**
				 * Shape schemes of Gantt Chart.
				 *
				 * Defines all the possible shape schemes in the Gantt chart control.
				 * <b>Note:</b>If you don't use expand chart, you can omit this aggregations.
				 * If not set, a default <code>sap.gantt.simple.ShapeScheme</code> is provided automatically.
				 */
				shapeSchemes: {type: "sap.gantt.simple.ShapeScheme", multiple: true, singularName: "shapeScheme"},

				/**
				 * Paint servers consumed by special shape <code>sap.gantt.shape.cal.Calendar</code>.
				 *
				 * This aggregation is designed to improve performance of calendar shapes. Rows usually share a similar definition with calendar shapes.
				 * It is possible to define a Calendar paint server to draw only one rectangle for each row. Notes for classes extended from
				 * <code>sap.gantt.def.cal.CalendarDef</code>: Different from property <code>paintServerDefs</code>, paint servers defined here must
				 * implement method <code>getDefNode()</code> instead of method <code>getDefString()</code>.
				 */
				calendarDef: {type: "sap.gantt.def.cal.CalendarDefs", multiple: false, bindable: "bindable"},

				/**
				 * This aggregation controls the zoom strategies and zoom rate in Gantt Chart.
				 */
				axisTimeStrategy: {type: "sap.gantt.axistime.AxisTimeStrategyBase", multiple: false, bindable: "bindable"},

				/**
				 * Configuration of locale settings.
				 *
				 * Most locale settings can be configured in sap.ui.configuration objects. Only the time zone and day-light-saving time options
				 * are provided by locale settings.
				 * We recommend that you set the type of this argument to <code>sap.gantt.config.Locale</code>. Otherwise some properties you set may not function properly.
				 */
				locale: {type: "sap.gantt.config.Locale", multiple: false},

				/**
				 * private aggregation for resizing the selection panel
				 * @private
				 */
				_splitter: {type: "sap.ui.layout.Splitter", multiple: false, visibility:"hidden"},

				/**
				 * Header of the Gantt Chart
				 * @private
				 */
				_header: {type: "sap.gantt.simple.GanttHeader", multiple : false, defaultValue: null, visibility:"hidden"},

				/**
				 * Inner Gantt chart
				 * @private
				 */
				_innerGantt: {type: "sap.gantt.simple.InnerGanttChart", multiple: false, visibility:"hidden"}
			},
			events: {
				/**
				 * Fired when the shape selection of the gantt chart has been changed.
				 */
				shapeSelectionChange: {
					parameters: {
						/**
						 * all selected shape UID.
						 */
						shapeUids: {type: "string[]"}
					}
				},

				/**
				 * Fired when a shape is resized.
				 */
				shapeResize: {
					parameters: {
						/**
						 * UID of the resized shape.
						 */
						shapeUid: {type: "string"},

						/**
						 * Shape instance of the resized shape
						 */
						shape: {type: "sap.gantt.simple.BaseShape"},

						/**
						 * Row object of the resizing shape.
						 */
						rowObject: {type: "object"},

						/**
						 * Original shape time array, including the start time and end time.
						 */
						oldTime: {type: "string[]"},

						/**
						 * New shape time array, including the start time and end time.
						 */
						newTime: {type: "string[]"}
					}
				},

				/**
				 * Event fired when a shape is hovered over.
				 */
				shapeMouseEnter: {
					parameters: {
						/**
						 * The data of the shape which fires this event.
						 */
						shape: {type: "sap.gantt.simple.BaseShape"},

						/**
						 * The mouse position relative to the left edge of the document.
						 */
						pageX: {type: "int"},

						/**
						 * The mouse position relative to the top edge of the document.
						 */
						pageY: {type: "int"}
					}
				},

				/**
				 * Fired when the mouse pointer leaves the shape.
				 */
				shapeMouseLeave: {
					parameters: {
						/**
						 * which shape element trigger the event.
						 */
						shape: {type: "sap.gantt.simple.BaseShape"},

						/**
						 * Original JQuery event object.
						 */
						originEvent: {type: "object"}

					}
				},

				/**
				 * This event is fired when a shape is clicked or tapped.
				 */
				shapePress: {
					parameters:{
						/**
						 * Offset for an {@link sap.m.Popover} placement on the x axis, in pixels.
						 */
						popoverOffsetX: {type: "int"},

						/**
						 * Row settings of the row that has been clicked or tapped.
						 */
						rowSettings: {type: "sap.gantt.simple.GanttRowSettings"},

						/**
						 * Instance of the shape that has been clicked or tapped.
						 */
						shape: {type: "sap.gantt.simple.BaseShape"}
					},
					allowPreventDefault: true
				},

				/**
				 * This event is fired when a shape is double-clicked or double-tapped.
				 */
				shapeDoubleClick: {
					parameters:{
						/**
						 * Offset for an {@link sap.m.Popover} placement on the x axis, in pixels.
						 */
						popoverOffsetX: {type: "int"},

						/**
						 * Row settings of the double-clicked row.
						 */
						rowSettings: {type: "sap.gantt.simple.GanttRowSettings"},

						/**
						 * Instance of the double-clicked shape.
						 */
						shape: {type: "sap.gantt.simple.BaseShape"}
					}
				},

				/**
				 * This event is fired when you right-click the shape.
				 */
				shapeContextMenu: {
					parameters:{
						/**
						 * The mouse position relative to the left edge of the document.
						 */
						pageX: {type: "int"},

						/**
						 * The mouse position relative to the top edge of the document.
						 */
						pageY: {type: "int"},

						/**
						 * Offset for an {@link sap.m.Popover} placement on the x axis, in pixels.
						 */
						popoverOffsetX: {type: "int"},

						/**
						 * Row settings of the right-clicked row.
						 */
						rowSettings: {type: "sap.gantt.simple.GanttRowSettings"},

						/**
						 * Instance of the right-clicked shape.
						 */
						shape: {type: "sap.gantt.simple.BaseShape"}
					}
				},

				/**
				 * Event fired when a drag-and-drop begins
				 */
				dragStart: {
					parameters: {
						/** The source Gantt chart */
						sourceGanttChart: {type: "sap.gantt.simple.GanttChartWithTable"},

						/**
						 * Object of dragged shapes dates, it's structured as follows:
						 * <pre>
						 * {
						 *     "shapeUid1": {
						 *          "time": date1,
						 *          "endTime": date2,
						 *     },
						 *     "shapeUid2": {
						 *          "time": date3,
						 *          "endTime": date4,
						 *     },
						 * }
						 * </pre>
						 *
						 * You can't get all selected shape instances because scrolling might destroy shapes on the invisible rows.
						 */
						draggedShapeDates: {type: "object"},

						/** The last shape out of those being dragged. */
						lastDraggedShapeUid: {type: "string"},

						/**
						 * Represents the mouse pointer's date & time when the <code>dragStart</code> event was fired.
						 */
						cursorDateTime: {type: "object"}
					}
				},

				/**
				 * Event fired when a drag-and-drop occurs on one or more selected shapes.
				 */
				shapeDrop: {
					parameters: {

						/** The source gantt chart */
						sourceGanttChart: { type: "sap.gantt.simple.GanttChartWithTable" },

						/** The target gantt chart */
						targetGanttChart: { type: "sap.gantt.simple.GanttChartWithTable" },

						/**
						 * Object of dragged shapes date, it's structure is:
						 * <pre>
						 * {
						 *     "shapeUid1": {
						 *          "time": date1,
						 *          "endTime": date2,
						 *     },
						 *     "shapeUid2": {
						 *          "time": date3,
						 *          "endTime": date4,
						 *     },
						 * }
						 * </pre>
						 *
						 * It's impossible to get all selected shape instances because of scrolling might destroy shapes on the invisible rows
						 */
						draggedShapeDates: { type: "object" },

						/** The last dragged shape */
						lastDraggedShapeUid: {type: "string"},

						/**
						 * The target row of gantt chart.
						 * No source row because of user might drag multiple shapes on different rows.
						 */
						targetRow: { type: "sap.ui.table.Row"},

						/**
						 * Represent the cursor date & time when drop event fired
						 */
						cursorDateTime: {type: "object"},

						/**
						 * The startTime or endTime of a dropped shape.
						 * In Free or Horizontal drag orientation, the value depends on the ghost alignment:
						 * <ul>
						 * <li>Start: newDateTime is the shape new start time, newDateTime is equal with cursorDateTime</li>
						 * <li>None: newDateTime is the shape new start time</li>
						 * <li>End: newDateTime is the shape new end time, newDateTime is equal with cursorDateTime</li>
						 * </ul>
						 *
						 * In Veritcal drag orientation, newDateTime is the shape new start time, and not equal with cursorDateTime in usual.
						 *
						 * @see sap.gantt.dragdrop.GhostAlignment
						 * @see sap.gantt.DragOrientation
						 */
						newDateTime: {type: "object"},

						/**
						 * Represents the shape which the dragged shape dropped on.
						 */
						targetShape: {type: "sap.gantt.simple.BaseShape"}
					}
				},

				/**
				 * Event fired when one shape dragged and connected to another shape.
				 */
				shapeConnect: {
					parameters: {
						/**
						 * The source shape's shapeUid
						 */
						fromShapeUid: {type: "string"},
						/**
						 * The target shape's shapeUid
						 */
						toShapeUid: {type: "string"},
						/**
						 * The value comes from <code>sap.gantt.simple.RelationshipType</code>, which represents type of relationship
						 */
						type: {type: "sap.gantt.simple.RelationshipType"}
					}
				},

				/**
				 * This event is fired when the visible horizon is changed.
				 *
				 * @since 1.68
				 */
				visibleHorizonUpdate: {
					parameters: {
						/**
						 * Specifies how the update was initiated.
						 */
						type: {type: "sap.gantt.simple.VisibleHorizonUpdateType"},

						/**
						 * Value of the visible horizon before the current update. Some types of this event don't have this value.
						 */
						lastVisibleHorizon: {type: "sap.gantt.config.TimeHorizon"},

						/**
						 * Value of the visible horizon after the current update.
						 */
						currentVisibleHorizon: {type: "sap.gantt.config.TimeHorizon"}
					}
				}
			}
		}
	});

	GanttChartWithTable.prototype.init = function () {
		// this is the svg width with some buffer on both left and right sides.
		this.iGanttRenderedWidth = -1;
		this._bExtensionsInitialized = false;

		this._oExpandModel = new ExpandModel();
		this._aExpandedIndices = []; //store expanded row indices to be used in printing

		this._oSplitter = new Splitter({
			id: this.getId() + "-ganttChartSplitter"
		});
		this.setAggregation("_splitter", this._oSplitter);

		this._oSyncedControl = new GanttSyncedControl();
		this.setAggregation("_innerGantt", new InnerGanttChart());
		this.setAggregation("_header", new GanttHeader());

		// Indicates previous display type
		this._sPreviousDisplayType = this.getDisplayType();
	};

	/**
	 * sap.gantt library internal use only
	 *
	 * @private
	 * @returns {sap.gantt.simple.InnerGanttChart} Embedded Gantt instance
	 */
	GanttChartWithTable.prototype.getInnerGantt = function() {
		return this.getAggregation("_innerGantt");
	};

	GanttChartWithTable.prototype.onSplitterResize = function(oEvent){
		var aOldSizes = oEvent.getParameter("oldSizes"),
			aNewSizes = oEvent.getParameter("newSizes"),
			bResizedX = aOldSizes.length > 0 && aNewSizes.length > 0 && aOldSizes[0] !== aNewSizes[0],
			sDisplayType = this.getDisplayType(),
			iNewSizeX = aNewSizes[0];

		if (bResizedX) {
			if (sDisplayType === GanttChartWithTableDisplayType.Both) {
				this._onResize(bResizedX);
			}

			var fnIsValidZeroValue = function (aSizes) {
				// Sometimes during rerendering phase, splitter fires resize with first value being zero
				// even though selectionPanelSize is not set to zero. SelectionPanelSize is then set to wrong value
				// and this causes wrong overlap on the table (see BCP 1970349825).
				return this.getSelectionPanelSize().startsWith("0") || aSizes[0] !== 0;
			}.bind(this);

			// We need to determine if the resize happened by user resizing splitter or if the entire container changed size.
			// We cannot use exact equal, as sometimes rounding errors cause few pixels error
			if (almostEqual(aOldSizes.reduce(add), aNewSizes.reduce(add)) && aOldSizes[0] !== aNewSizes[0] && fnIsValidZeroValue(aOldSizes)) {
				this.setProperty("selectionPanelSize", iNewSizeX + "px", true);
				this.fireEvent("_selectionPanelResize", {
					newWidth: iNewSizeX,
					displayType: sDisplayType
				});
			}
			this._draw();
		}
	};

	/**
	 * Sets the {@link sap.ui.core.LayoutData} defining the layout constraints
	 * for this control when it is used inside a layout.
	 *
	 * @param {sap.ui.core.LayoutData} oLayoutData which should be set
	 * @returns {this} Returns <code>this</code> to allow method chaining
	 * @public
	 */
	GanttChartWithTable.prototype.setLayoutData = function(oLayoutData) {
		this.setAggregation("layoutData", oLayoutData, true);
		this.fireEvent("_layoutDataChange");
		return this;
	};

	GanttChartWithTable.prototype.setDisplayType = function (sDisplayType) {
		this._sPreviousDisplayType = this.getDisplayType();
		if (this._sPreviousDisplayType === GanttChartWithTableDisplayType.Both && sDisplayType !== GanttChartWithTableDisplayType.Both) {
			// if exiting Both display type, save its table sizeX (it's used when going back to Both display type in the future)
			//this._iLastTableAreaSize = this.getAggregation("_splitter").getCalculatedSizes()[0];
			this._iLastTableAreaSize = this.getAggregation("_splitter").getContentAreas()[0] &&  this.getAggregation("_splitter").getContentAreas()[0].getLayoutData().getSize();
		}

		this.setProperty("displayType", sDisplayType, false); // needs to be called before this._setupDisplayType()

		if (sDisplayType === GanttChartWithTableDisplayType.Table) {
			this.setProperty("selectionPanelSize", "auto", true);
			// no jump to visible horizon needed for gantt since it won't be rendered
		} else {
			delete this._bPreventInitialRender; // might need to jump to visible horizon before rendering
		}
		this._setupDisplayType();
		return this;
	};

	GanttChartWithTable.prototype.setSelectionPanelSize = function (sSelectionPanelSize) {
		this.setProperty("selectionPanelSize", sSelectionPanelSize, false);
		delete this._iLastTableAreaSize; // because selectionPanelSize will take precedence now
		this._setSplitterLayoutData(sSelectionPanelSize, "auto");
		return this;
	};

	GanttChartWithTable.prototype.applySettings = function(mSettings, oScope) {
		mSettings = mSettings || {};
		this._applyMissingSettings(mSettings);
		Control.prototype.applySettings.call(this, mSettings, oScope);
		// init the selection model with shape selection mode
		this._initSelectionModel(this.getProperty("shapeSelectionMode"));
	};

	/**
	 * Apply the missing settings.
	 *
	 * GanttChartWithTable requires axisTimeStrategy, locale and shapeScheme aggregations when initializing.
	 * If user didn't apply those settings, fallback to the default ones.
	 * @private
	 * @param {object} mSettings The constructor settings
	 */
	GanttChartWithTable.prototype._applyMissingSettings = function(mSettings) {
		if (!mSettings.axisTimeStrategy) {
			mSettings.axisTimeStrategy = new ProportionZoomStrategy();
		}

		if (!mSettings.locale) {
			// use cloned locale just in case it's destroyed by the framework
			mSettings.locale = library.config.DEFAULT_LOCALE_CET.clone();
		}

		if (!mSettings.shapeSchemes) {
			mSettings.shapeSchemes = [ new ShapeScheme({key : "default", primary: true}) ];
		} else {
			var bHasPrimaryScheme = mSettings.shapeSchemes.some(function(oScheme) {
				return oScheme.getPrimary();
			});
			if (!bHasPrimaryScheme) {
				Log.warning("you need set a ShapeSheme with primary:true");
			}
		}
	};

	/**
	 * Return the first primary shape scheme
	 *
	 * @private
	 * @returns {sap.gantt.simple.ShapeScheme} the primary shape scheme
	 */
	GanttChartWithTable.prototype.getPrimaryShapeScheme = function() {
		return this.getShapeSchemes().filter(function(oScheme){
			return oScheme.getPrimary();
		})[0];
	};

	/**
	 * Return the internal control which used for table & gantt synchronization
	 * This method shall be used only inside the library
	 *
	 * @private
	 * @returns {sap.gantt.simple.GanttSyncedControl} the slave control for synchronization
	 */
	GanttChartWithTable.prototype.getSyncedControl = function() {
		return this._oSyncedControl;
	};

	/**
	 * return the table row heights
	 * This method shall be used only inside the library
	 * @private
	 * @returns {int[]} all visible row heights
	 */
	GanttChartWithTable.prototype.getTableRowHeights = function() {
		return this.getSyncedControl().getRowHeights();
	};

	GanttChartWithTable.prototype.setTable = function (oTable) {
		this.setAggregation("table", oTable);

		// Enable the variable row height feature (half row scrolling)
		oTable._bVariableRowHeightEnabled = true;

		// Try to remove the first content in splitter, just in case it's already there
		var oOldTableWrapper = this._oSplitter.removeContentArea(0);

		// add the wrapped table as the first splitter content
		this._oSplitter.insertContentArea(new AssociateContainer({
			content: oTable,
			enableRootDiv: true,
			layoutData: oTable.getLayoutData() ? oTable.getLayoutData().clone() : new SplitterLayoutData({size: this.getSelectionPanelSize()})
		}), 0);

		if (oOldTableWrapper == null) {
			// first time the table is set as aggregation, the syncWith shall be called only once
			this._oSyncedControl.syncWith(oTable);

			// the GanttSyncControl as the second content
			this._oSplitter.addContentArea(this._oSyncedControl);
		} else if (oOldTableWrapper && oOldTableWrapper.getContent() !== oTable.getId()) {
			// the table instance is replaced
			this._oSyncedControl.syncWith(oTable);
		}

		oTable.detachEvent("_rowsUpdated", this._onTableRowsUpdated, this);
		oTable.attachEvent("_rowsUpdated", this._onTableRowsUpdated, this);
		oTable.attachEvent("columnMove", this._onTableColumnMove, this);
		oTable.attachEvent("filter", this._onTableFilter, this);
		oTable.attachEvent("sort", this._onTableSorter, this);
		oTable.attachEvent("columnVisibility", this._onColumnVisible, this);

	};

	/**
	 * Enable or disable table's variable row height feature
	 * @param {boolean} bEnabled The flag to control it
	 * @protected
	 */
	GanttChartWithTable.prototype.setEnableVariableRowHeight = function(bEnabled) {
		if (this.getTable()) {
			this.getTable()._bVariableRowHeightEnabled = bEnabled;
		} else {
			Log.warning("you need to set table aggregation first");
		}
	};

	/**
	 * Implementation of sap.gantt.simple.GanttChartWithTable.setLargeDataScrolling method.
	 * @param {boolean} bEnabled The flag to control it
	 * @protected
	 */
	GanttChartWithTable.prototype.setLargeDataScrolling = function(bEnabled) {
		if (this.getTable()) {
			this.getTable()._setLargeDataScrolling(bEnabled);
		} else {
			Log.warning("you need to set table aggregation first");
		}
	};

	GanttChartWithTable.prototype.getRenderedTimeRange = function() {
		return this.getAxisTime().getTimeRangeSlice(0, this.iGanttRenderedWidth);
	};

	GanttChartWithTable.prototype._initSelectionModel = function(sSelectionMode) {
		if (this.oSelection) {
			this.oSelection.detachSelectionChanged(this._onSelectionChanged, this);
		}
		this.oSelection = new SelectionModel(sSelectionMode);
		this.oSelection.attachSelectionChanged(this._onSelectionChanged, this);
		return this;
	};

	GanttChartWithTable.prototype.setShapeSelectionMode = function(sSelectionMode) {
		this.setProperty("shapeSelectionMode", sSelectionMode);
		if (this.oSelection) {
			this.oSelection.setSelectionMode(sSelectionMode);
		}
		return this;
	};

	/**
	 * Get selected shapes in gantt chart.
	 *
	 * @public
	 *
	 * @return {Object[]} Array of shape object
	 */
	GanttChartWithTable.prototype.getSelectedShapeUid = function () {
		return this.oSelection.allUid();
	};

	/**
	 * Selects a group of shapes specified by the <code>aShapeUids</code> array. Alternatively, this method
	 * deselects all selected shapes when no shape UIDs are provided.
	 * @param {Array.<string>} aShapeUids An array of shape UIDs to select.
	 * @returns {this} a reference to the {@link sap.gantt.simple.GanttChartWithTable} control, can be used for chaining.
	 * @public
	 * @since 1.84
	 */
	GanttChartWithTable.prototype.setSelectedShapeUid = function (aShapeUids) {
		return this.selectShapes(aShapeUids,true);
	};

	/**
	 * Selects a group of shapes specified by the <code>aShapeUids</code> array. Alternatively, this method
	 * deselects all selected shapes when no shape UIDs are provided and the <code>bExclusive</code> parameter is <code>true</code>.
	 *
	 * @param {Array.<string>} aShapeUids An array of shape UIDs to select.
	 * @param {boolean} bExclusive Optional, whether or not to deselect all previously selected shapes.
	 * @returns {this} a reference to the {@link sap.gantt.simple.GanttChartWithTable} control, can be used for chaining.
	 * @public
	 * @since 1.75
	 */
	GanttChartWithTable.prototype.selectShapes = function (aShapeUids, bExclusive) {
		if (!this.oSelection) {
			return this;
		}
		if ((!aShapeUids || aShapeUids.length === 0) && bExclusive) {
			this.oSelection.clear(true);
			return this;
		}

		if (bExclusive) {
			this.oSelection.clear(false);
		}
		this._updateShapes(aShapeUids, true);
		return this;
	};

	/**
	 * Deselects a group of shapes specified by the <code>aShapeUids</code> array.
	 *
	 * @param {Array.<string>} aShapeUids An array of shape UIDs to deselect.
	 * @returns {this} a reference to the {@link sap.gantt.simple.GanttChartWithTable} control, can be used for chaining.
	 * @public
	 * @since 1.75
	 */
	GanttChartWithTable.prototype.deselectShapes = function (aShapeUids) {
		if (!this.oSelection || !aShapeUids || aShapeUids.length === 0) {
			return this;
		}

		this._updateShapes(aShapeUids, false);
		return this;
	};

	GanttChartWithTable.prototype._updateShapes = function (aShapeUids, bSelect) {
		var mShapesToUpdate = {};
		var aShapes = GanttUtils.getShapesWithUid(this.getId(), aShapeUids);
		for (var i = 0; i < aShapeUids.length; i++) {
			mShapesToUpdate[aShapeUids[i]] = {
				selected: bSelect,
				ctrl: false // since there is no user interaction
			};
			if (aShapes[i]) {
				mShapesToUpdate.draggable = aShapes[i].getDraggable();
				mShapesToUpdate.time = aShapes[i].getTime();
				mShapesToUpdate.endTime = aShapes[i].getEndTime();
			}
		}
		this.oSelection.updateShapes(mShapesToUpdate);
	};

	GanttChartWithTable.prototype._onSelectionChanged = function (oEvent) {
		var aShapeUid = oEvent.getParameter("shapeUid"),
			aDeselectedUid = oEvent.getParameter("deselectedUid"),
			bSilent = oEvent.getParameter("silent");

		this._updateShapeSelections(aShapeUid, aDeselectedUid);

		if (!bSilent) {
			this.fireShapeSelectionChange({
				shapeUids: aShapeUid
			});
		}
	};

	/**
	 * Update the shape selection `metadata` into the SelectionModel.
	 *
	 * @param {object} mParam shape selected parameters
	 * @private
	 */
	GanttChartWithTable.prototype.handleShapePress = function(mParam) {
		var oShape = mParam.shape,
			sShapeUid = oShape.getShapeUid(),
			bCtrl = mParam.ctrlOrMeta,
			oDragDropExtension = this._getDragDropExtension();

		var bNewSelected = !oShape.getSelected();
		if (oDragDropExtension.shapeSelectedOnMouseDown && !oDragDropExtension.initiallySelected && !this.getEnableSelectAndDrag()){
            bNewSelected = oDragDropExtension.shapeSelectedOnMouseDown;
        }

		this.oSelection.updateShape(sShapeUid, {
			selected: bNewSelected,
			ctrl: bCtrl,
			draggable: oShape.getDraggable(),
			time: oShape.getTime(),
			endTime: oShape.getEndTime()
		});
		oDragDropExtension.shapeSelectedOnMouseDown = false;
	};

	/**
	 * Allows to resize a shape without explicitly selecting the shape.
	 *
	 * @param {object} mParam shape selected parameters
	 * @private
	 */
	GanttChartWithTable.prototype.handleShapeMouseEnter = function(mParam) {
		if (!this.getEnableSelectAndDrag()) {
			var oShape = mParam.shape,

			// Handle resize cursor
			oResizeExtension = this._getResizeExtension();
			if (!oShape.getSelected()){
				oResizeExtension.addResizerOnMouseOver(oShape);
			}

			// Handle drag cursor
			var oDragDropExtension = this._getDragDropExtension();
			if (oShape.getDraggable()) {
				oDragDropExtension.updateCursorStyle("move");
			}
		}
	};

	/**
	 * Handler for mouse leave of shapes.
	 *
	 * @param {object} mParam shape selected parameters
	 * @private
	 */
	GanttChartWithTable.prototype.handleShapeMouseLeave = function(mParam) {
		if (!this.getEnableSelectAndDrag()) {
			// Handle drag cursor
			var oDragDropExtension = this._getDragDropExtension();
			oDragDropExtension.updateCursorStyle("default");
		}
	};

	GanttChartWithTable.prototype._updateShapeSelections = function(aShapeUid, aDeselectedUid) {
		var oSelMode = this.getShapeSelectionMode();
		if (oSelMode === library.SelectionMode.None) {
			// there is no selection which needs to be updated. With the switch of the
			// selection mode the selection was cleared (and updated within that step)
			return;
		}

		RenderUtils.updateShapeSelections(this, aShapeUid, aDeselectedUid);
	};

	/**
	 * Adds vertical scrollbar container to the gantt charts having no vertical scrollbar, if any gantt chart in the container has a vertical scrollbar
	 *
	 * @private
	 */
	GanttChartWithTable.prototype._updateVsbContainers = function() {
		if (this.getParent().isA("sap.gantt.simple.GanttChartContainer") && this.getParent().getGanttCharts().length > 1) {
			var oGanttCharts = this.getParent().getGanttCharts();
			var bVsbContainer = false;
			var i, oGantt;
			for (i = 0; i < oGanttCharts.length; i++) {
				oGantt = oGanttCharts[i];
				if (!oGantt.getTable()._getScrollExtension().getVerticalScrollbar().classList.contains("sapUiTableHidden")) {
					bVsbContainer = true;
					break;
				}
			}

			if (bVsbContainer) {
				for (i = 0; i < oGanttCharts.length; i++) {
					oGantt = oGanttCharts[i];
					var aClassList = oGantt.getTable()._getScrollExtension().getVerticalScrollbar().classList;
					if (aClassList.contains("sapUiTableHidden")) {
						aClassList.add("sapVerticalScrollBarContainer");
					} else {
						aClassList.remove("sapVerticalScrollBarContainer");
					}
				}
			} else {
				for (i = 0; i < oGanttCharts.length; i++) {
					oGantt = oGanttCharts[i];
					oGantt.getTable()._getScrollExtension().getVerticalScrollbar().classList.remove("sapVerticalScrollBarContainer");
				}
			}
		}
	};

	/**
	 * Return the shape selection model.
	 *
	 * @private
	 * @returns {sap.gantt.simple.SelectionModel} the selection model
	 */
	GanttChartWithTable.prototype.getSelection = function() {
		return this.oSelection;
	};

	GanttChartWithTable.prototype.getExpandedBackgroundData = function () {
		if (this._oExpandModel.hasExpandedRows()) {
			var aRows = this.getTable().getRows();
			var iRowCount = aRows.length;

			var iFirstVisibleRow = this.getTable().getFirstVisibleRow();
			var aRowUid = [];

			for (var i = 0; i < iRowCount; i++){
				if (aRows[i].getIndex() >= iFirstVisibleRow){
					var oRowSettings = aRows[i].getAggregation("_settings");
					aRowUid.push(oRowSettings.getRowUid());
				}
			}
			return this._oExpandModel.collectExpandedBgData(aRowUid, this.getExpandedRowHeight(), this.getShowParentRowOnExpand());
		}
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.setAxisTimeStrategy = function (oAxisTimeStrategy) {
		oAxisTimeStrategy.attachEvent("_redrawRequest", this._onRedrawRequest, this);
		delete this._bPreventInitialRender; // we will need to jump to visible horizon
		return this.setAggregation("axisTimeStrategy", oAxisTimeStrategy, false);
	};

	GanttChartWithTable.prototype._onTableFilter = function (oEvent) {
		var aChanges = [{
			"selectorElement": oEvent.mParameters.column,
			"changeSpecificData": {
				"changeType": "TableColumnFilterValue",
				"content": {
					propertyName: "filterValue",
					newValue: oEvent.mParameters.value,
					oldValue: ""
				}
			}
		}];
		//once changes are complete, write them
		ControlPersonalizationWriteAPI.add({
		changes: aChanges
		});
	};
	GanttChartWithTable.prototype._onTableSorter = function (oEvent) {

		var aChanges = [{
			"selectorElement": oEvent.mParameters.column,
			"changeSpecificData": {
				"changeType": "TableColumnSortOrder",
				"content": {
					propertyName: "sortOrder",
					newValue: oEvent.mParameters.sortOrder,
					oldValue: "Ascending"
				}
			}
		}];
		//once changes are complete, write them
		 ControlPersonalizationWriteAPI.add({
		changes: aChanges
		});
	};

	GanttChartWithTable.prototype._onColumnVisible = function (oEvent) {
		var visible = oEvent.mParameters.newVisible;
		var aChanges = [{
			"selectorElement": oEvent.mParameters.column,
			"changeSpecificData": {
				"changeType": "TableColumnVisibility",
				"content": {
					propertyName: "visible",
					newValue: visible,
					oldValue: !visible
				}
			}
		}];
		//once changes are complete, write them
		ControlPersonalizationWriteAPI.add({
		changes: aChanges
		});
	};
	GanttChartWithTable.prototype._onTableColumnMove = function (oEvent) {

		var aOldListOfColumnIds = oEvent.getSource().getAggregation('columns').map(function(x){
			return x.getId();
		});
		var iOldIdx = oEvent.getParameter('column').getIndex();
		var iNewIdx = oEvent.getParameter('newPos');
		var aTempOldArr = Array.from(new Set(aOldListOfColumnIds));
		var aNewArr = GanttUtils.arrayMove(aTempOldArr, iOldIdx, iNewIdx);
		var aUpdatedListOfColumnIds = [];
		aNewArr.forEach(function(id, idx){
			var oTempColumn = oEvent.getSource().getAggregation('columns').find(function(y){
				return y.getId() === id;
			});
			aUpdatedListOfColumnIds.push(oTempColumn.getId());
		});

		var aChanges = [];
		aChanges.push({
			"selectorElement": this.getTable(),
			"changeSpecificData": {
				"changeType": "GanttTableColumnOrder",
				"content": {
					"aggregationName": "columns",
					"newValue":  aUpdatedListOfColumnIds,
					"oldValue": aOldListOfColumnIds
				}
			}
		});

		//once changes are complete, write them
		ControlPersonalizationWriteAPI.add({
			changes: aChanges
		});
	};

	GanttChartWithTable.prototype._onTableRowsUpdated = function (oEvent) {
		if (!this.getVisible()) {
			return;
		}

		var sReason = oEvent.getParameter("reason"),
			oInnerGantt = this.getInnerGantt();

		// whenever model changed, need invalidate gantt as well
		var aModelChangeReason = values(ChangeReason).slice();

		// All reasons that need to invalidate the control which allows render manager to rerender it
		// Each UI interaction shall only render once
		var aInvalidateReasons = aModelChangeReason.concat(["Render", "FirstVisibleRowChange", "Resize"]);

		if (aInvalidateReasons.indexOf(sReason) !== -1) {

			// do not scrolling while invalidating control
			this.getSyncedControl().setAllowContentScroll(false);
			oInnerGantt.invalidate();
		} else if (sReason === "VerticalScroll") {
			// table is already invalidasting the content on scroll, hence do nothing.
		} else {
			oInnerGantt.getRenderer().renderImmediately(this);
		}
	};

	/**
	 * @private
	 * this function is designed for all sync operation, in this function will remove the scroll event deadlock
	 * @private
	 */
	GanttChartWithTable.prototype.syncVisibleHorizon = function (oTimeHorizon, iVisibleWidth, bKeepStartTime, sReason){
		var oGanttAxisTimeStrategy = this.getAxisTimeStrategy();
		var oTotalHorizon = oGanttAxisTimeStrategy.getTotalHorizon();

		var oTargetVisibleHorizon;
		var iCurrentVisibleWidth = this.getVisibleWidth();
		if (iVisibleWidth !== undefined) {
			if (iCurrentVisibleWidth === undefined){
				return;
			}
			if (bKeepStartTime){
				var oCurrentVisibleHorizon = oGanttAxisTimeStrategy.getVisibleHorizon();
				var oCurrentStartTime = Format.abapTimestampToDate(oCurrentVisibleHorizon.getStartTime());
				oTargetVisibleHorizon = Utility.calculateHorizonByWidth(oTimeHorizon, iVisibleWidth, iCurrentVisibleWidth, oCurrentStartTime);
			} else {
				oTargetVisibleHorizon = Utility.calculateHorizonByWidth(oTimeHorizon, iVisibleWidth, iCurrentVisibleWidth);
			}

		} else {
			oTargetVisibleHorizon = oTimeHorizon;
		}

		if (oTotalHorizon.getEndTime() < oTargetVisibleHorizon.getEndTime()){
			var iTargetTimeSpan = Format.abapTimestampToDate(oTargetVisibleHorizon.getEndTime()).getTime() - Format.abapTimestampToDate(oTargetVisibleHorizon.getStartTime()).getTime();
			var oTotalHorizonEndTime = Format.abapTimestampToDate(oTotalHorizon.getEndTime());
			var oStartTime = new Date();
			oStartTime.setTime(oTotalHorizonEndTime.getTime() - iTargetTimeSpan);

			oTargetVisibleHorizon = new TimeHorizon({
				startTime: oStartTime,
				endTime: oTotalHorizonEndTime
			});
		}

		this._updateVisibleHorizon(oTargetVisibleHorizon, sReason || "syncVisibleHorizon", iCurrentVisibleWidth);
	};

	GanttChartWithTable.prototype._updateVisibleHorizon = function (oTimeHorizon, sReasonCode, nVisibleWidth) {
		var oAxisTimeStrategy = this.getAxisTimeStrategy();
		oAxisTimeStrategy.updateGanttVisibleWidth(nVisibleWidth);
		if (oTimeHorizon && (oTimeHorizon.getStartTime() || oTimeHorizon.getEndTime())) {
			oAxisTimeStrategy.setVisibleHorizonWithReason(oTimeHorizon, sReasonCode);
		}
	};


	/**
	 * this function should only be triggered by sync mouse wheel zoom from ganttchart container, in this function will remove the scroll event deadlock
	 *
	 * @private
	 */
	GanttChartWithTable.prototype.syncMouseWheelZoom = function (oEvent){
		this._getZoomExtension().performMouseWheelZooming(oEvent.originEvent, true);
	};

	GanttChartWithTable.prototype.syncTimePeriodZoomOperation = function (oEvent, bTimeScrollSync, sOrientation){
		this._getZoomExtension().syncTimePeriodZoomOperation(oEvent, bTimeScrollSync, sOrientation);
	};

	GanttChartWithTable.prototype._onRedrawRequest = function (oEvent) {
		var oValueBeforeChange = oEvent.getParameter("valueBeforeChange");
		var sReasonCode = oEvent.getParameter("reasonCode");

		if (oValueBeforeChange && sReasonCode !== "totalHorizonUpdated" && sReasonCode !== "initialRender" && sReasonCode !== "syncVisibleHorizon") {
			this._syncContainerGanttCharts(sReasonCode, oEvent.getParameter("originEvent"));
		}
		this.fireVisibleHorizonUpdate({
			type: VISIBLE_HORIZON_UPDATE_TYPE_MAP[sReasonCode],
			lastVisibleHorizon: oValueBeforeChange,
			currentVisibleHorizon: this.getAxisTimeStrategy().getVisibleHorizon()
		});

		this.redraw(sReasonCode);
		this._setupDisplayType();
	};

	/**
	 * Redraw the chart svg if the surrounding conditions change, e.g zoom strategy updated, row binding context changed
	 * or while scrolling out of the buffer etc.
	 * @param {string} sReasonCode Reason code for calling redraw.
	 * @private
	 */
	GanttChartWithTable.prototype.redraw = function (sReasonCode) {
		this._draw(sReasonCode);
	};

	GanttChartWithTable.prototype._draw = function (sReasonCode) {
		if (this.getDisplayType() === GanttChartWithTableDisplayType.Table) {
			// Adjust zoom level to support multiple variants with different zoom levels
			this.getParent().getToolbar().updateZoomLevel(this.getAxisTimeStrategy().getZoomLevel());
		} else {
			var iVisibleWidth = this.getVisibleWidth();
			if (!iVisibleWidth) {
				return;
			}
			//Changes to set ZoomLevel during the Initial Rendering of the GanttChart
			var oSyncZoomStrategyResult = this.getAxisTimeStrategy().syncContext(iVisibleWidth);
			if (this.getAxisTimeStrategy().initialSettings != null && this.getAxisTimeStrategy().initialSettings.zoomLevel != null
				&& this.getAxisTimeStrategy().initialSettings.zoomLevel != 0 && sReasonCode == "initialRender"
				&& !this.getAxisTimeStrategy().isA("sap.gantt.axistime.FullScreenStrategy")
				&& !this.isPrint) {
					var oAxisTimeStrategy =  this.getAxisTimeStrategy();
					var binitialZoomLevel = oAxisTimeStrategy.initialSettings.zoomLevel;
					oAxisTimeStrategy.setProperty("zoomLevel", binitialZoomLevel, true);
					oSyncZoomStrategyResult.zoomLevel = binitialZoomLevel;
					var visibleHorizon = oAxisTimeStrategy.calVisibleHorizonByRate(oAxisTimeStrategy._aZoomRate[binitialZoomLevel]);
					oAxisTimeStrategy.updateInitialVisibleHorizon(visibleHorizon, binitialZoomLevel);
			}
			this.fireEvent("_zoomInfoUpdated", oSyncZoomStrategyResult);

			var oScrollExtension = this._getScrollExtension();
			if (oSyncZoomStrategyResult.axisTimeChanged) {
				// clear SVG offset to ensure rerender
				oScrollExtension.clearOffsetWidth();
			}

			oScrollExtension.needRerenderGantt(function () {
				// This is need render fast. otherwise UI has flicker
				this.getInnerGantt().getRenderer().renderImmediately(this);
			}.bind(this), sReasonCode);
		}
	};

	GanttChartWithTable.prototype._syncContainerGanttCharts = function (sReasonCode, oOriginEvent) {
		var oGanttParent = this.getParent();
		if (oGanttParent && oGanttParent.isA("sap.gantt.simple.GanttChartContainer") && oGanttParent.getGanttCharts().length > 1) {
			this.fireEvent("_initialRenderGanttChartsSync", {
				reasonCode: sReasonCode, visibleHorizon: this.getAxisTimeStrategy().getVisibleHorizon(), visibleWidth: this.getVisibleWidth(), originEvent: oOriginEvent
			});
		}
	};

	/**
	 * Function is called before the control is rendered.
	 * @private
	 * @override
	 */
	GanttChartWithTable.prototype.onBeforeRendering = function(oEvent) {
		this._updateRowHeightInExpandModel(this.getTable());
		GanttExtension.detachEvents(this);

		this._oSplitter.detachResize(this.onSplitterResize, this);

		if (this._sResizeHandlerId) {
			ResizeHandler.deregister(this._sResizeHandlerId);
		}

		if (this.getDisplayType() !== GanttChartWithTableDisplayType.Table) {
			// make sure InnerGantt is invalidated because it's not in some cases like GanttChartWithTable's managed property update
			this.getInnerGantt().invalidate();
		}

		var oTable = this.getTable();
		//Add Export button to the Table if the showExportTableToExcel property is set to True
		if (this.getShowExportTableToExcel()) {
			if (this.oExportTableToExcelButton == null) { //Check for availability of export button.
				this.oExportTableToExcelButton = new MenuButton(this.getId() + "-exportTableToExcelButton", {
					icon:  "sap-icon://excel-attachment",
					tooltip: oResourceBundle.getText("EXPORT_BUTTON_TEXT"),
					type: sap.m.ButtonType.Transparent,
					buttonMode: sap.m.MenuButtonMode.Split,
					useDefaultActionOnly: true,
					defaultAction: [
						function() {
							this._exportTableToExcel();
						}, this
					],
					menu: [
						new Menu({
							items: [
								new MenuItem({
									text: oResourceBundle.getText("QUICK_EXPORT"),
									press: [
										function() {
											this._exportTableToExcel();
										}, this
									]
								}),
								new MenuItem({
									text: oResourceBundle.getText("EXPORT_WITH_SETTINGS"),
									press: [
										function() {
											this._createExportDialogBox();
										}, this
									]
								})
							]
						})
					]
				});
			}
			GanttUtils.addToolbarToTable(this, oTable, true);
		} else if (!this.getShowExportTableToExcel() && (oTable.getExtension().length > 0 && !(oTable.getExtension()[0].getContent().indexOf(this.oExportTableToExcelButton) === -1))) {//Check to remove the Export button when ShowExportTableToExcel = false
			if (oTable.getExtension()[0].getContent().length == 1) { //If only single content is present, remove the entire Table.extension.
				oTable.removeExtension(oTable.getExtension()[0]);
			}else if (oTable.getExtension()[0].getContent().length > 1) {
				oTable.getExtension()[0].removeContent(this.oExportTableToExcelButton); //If multiple contents are present, remove only the Export button.
			}
		}
	};

	/**
	 * Function is called after the control is rendered.
	 * @private
	 * @override
	 */
	GanttChartWithTable.prototype.onAfterRendering = function (oEvent) {
		this._attachExtensions();
		GanttExtension.attachEvents(this);

		this._oSplitter.attachResize(this.onSplitterResize, this);

		this._sResizeHandlerId = ResizeHandler.register(this, this._onResize.bind(this));

		// at this point, there are no shapes rendered at all, so GanttScrollExtension.jumpToVisibleHorizon("initialRender")
		// will change the zoomRate then trigger redraw (this is executed in InnerGanttChart.prototype.onBeforeRendering)

		//If a fixed height has been specified to GanttChartWithTable/GanttChartContainer
		//set the VisibleRowCountMode=Auto which makes the table calculate number of rows to be displayed within the given height and make the GanttChart displays the HorizontalScrollBar
		if (this.mProperties.hasOwnProperty("height") || (this.getParent() && this.getParent().mProperties.hasOwnProperty("height"))) {
			this.getTable().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Auto);
			this.getTable().setMinAutoRowCount(1);//Change the default value of minAutoRowCount to 1 form the default vlue of 5 for GanttChart with minimal height.
		}
	};

	/**
	 * Keep both parts of the splitter always visible in case splitter or browser is resized
	 *
	 * @private
	 */
	GanttChartWithTable.prototype._onResize = function (isSplitterResized) {
		if (this.getDisplayType() !== GanttChartWithTableDisplayType.Both) {
			return;
		}
		var oSplitter = this.getAggregation("_splitter");
		this._sPreviousDisplayType = this.getDisplayType();
		if (this._sPreviousDisplayType === GanttChartWithTableDisplayType.Both) {
			this._iLastTableAreaSize = this.getAggregation("_splitter").getContentAreas()[0] &&  this.getAggregation("_splitter").getContentAreas()[0].getLayoutData().getSize();
		}
		if (oSplitter.getContentAreas()[0] && oSplitter.getContentAreas()[0].getLayoutData()) {
			var oLeftPart = oSplitter.getContentAreas()[0],
				oLayoutData = oLeftPart.getLayoutData(),
				iFullWidth = this.getDomRef().offsetWidth,
				iNewSize;
			if (iFullWidth < MIN_AREA_WIDTH * 2) {
				iNewSize = iFullWidth / 2;
				iNewSize = iNewSize + "px";
			} else {
				var iLeftWidth = oLeftPart.getDomRef().offsetWidth;
				if (iLeftWidth > MIN_AREA_WIDTH) {
					return;
				}
				//Check if iLeftWidth is 0 and the resize is not trigerred from the method onSplitterResize then take the value form selectionPanelSize
				//If the splitter is resized and the _onResize is trigerred from onSplitterResize check if the table width is set to to 0px then set the default width of 60 px to the table from the else condition.
				if (this.getSelectionPanelSize() != null && iLeftWidth == 0 && isSplitterResized != true) {
					iNewSize = this.getSelectionPanelSize();
				} else {
					iNewSize = Math.max(Math.min(iLeftWidth, iFullWidth - MIN_AREA_WIDTH), MIN_AREA_WIDTH);
					iNewSize = iNewSize + "px";
				}
			}
			oLayoutData.setSize(iNewSize);
		}
	};

	GanttChartWithTable.prototype._setupDisplayType = function () {
		var sDisplayType = this.getDisplayType();
		if (sDisplayType === GanttChartWithTableDisplayType.Table) {
			var iVSbWidth = this.getSyncedControl().$().find(".sapGanttBackgroundVScrollContentArea").width();
			if (iVSbWidth !== null) {
				this._setSplitterLayoutData("auto", iVSbWidth + "px");
			}
		} else if (sDisplayType === GanttChartWithTableDisplayType.Chart) {
			this._setSplitterLayoutData("0px", "auto");
		} else if (sDisplayType !== this._sPreviousDisplayType) {
			this._setSplitterLayoutData(this._iLastTableAreaSize ? this._iLastTableAreaSize : this.getSelectionPanelSize(), "auto");
		}
	};

	GanttChartWithTable.prototype._setSplitterLayoutData = function (sTableSize, sChartSize) {
		var aSplitterContentAreas = this._oSplitter.getContentAreas();
		if (aSplitterContentAreas.length > 1) {
			var oTableAreaLayoutData = aSplitterContentAreas[0].getLayoutData(),
				oChartAreaLayoutData = aSplitterContentAreas[1].getLayoutData(),
				bResizable = this.getDisplayType() === GanttChartWithTableDisplayType.Both;

			oTableAreaLayoutData.setSize(sTableSize).setResizable(bResizable);
			oChartAreaLayoutData.setSize(sChartSize).setResizable(bResizable);
		}
	};

	GanttChartWithTable.prototype._updateRowHeightInExpandModel = function(oTable) {
		var iTableRowHeight = oTable.getRowHeight();
		if (iTableRowHeight === 0) {
			iTableRowHeight = oTable._getDefaultRowHeight();
		}
		this._oExpandModel.setBaseRowHeight(iTableRowHeight);
	};

	/**
	 * Jumps to a given position on the time axis by updating the visible horizon.
	 *
	 * Can be used to implement the function of 'Jump To First', 'Jump To Last' and 'Jump To Current'.
	 *
	 * @param {(Date|string|Array)} vValue A date object or a 14-digit timestamp string in this format: YYYYMMDDHHMMSS.
	 * An array can also be passed where the two values determine the start time and end time of the visible horizon.
	 * @public
	 * @since 1.75
	 */
	GanttChartWithTable.prototype.jumpToPosition = function (vValue) {
		if (Object.prototype.toString.call(vValue) === "[object Date]" || typeof vValue === "string") {
			this._updateVisibleHorizon(new TimeHorizon({
				startTime: vValue
			}), "jumpToPosition", this.getVisibleWidth());
		} else if (Array.isArray(vValue)) {
			this._updateVisibleHorizon(new TimeHorizon({
				startTime: vValue[0],
				endTime: vValue[1]
			}), "jumpToPosition", this.getVisibleWidth());
		} else if (vValue === undefined) {
			this._updateVisibleHorizon(this.getAxisTimeStrategy().getTotalHorizon(), "jumpToPosition", this.getVisibleWidth());
		}
	};

	GanttChartWithTable.prototype.exit = function() {
		if (this._sResizeHandlerId) {
			ResizeHandler.deregister(this._sResizeHandlerId);
		}

		this._detachExtensions();
		delete this._bPreventInitialRender;
	};

	GanttChartWithTable.prototype._attachExtensions = function() {
		if (this._bExtensionsInitialized) {
			return;
		}
		GanttExtension.enrich(this, GanttScrollExtension);
		GanttExtension.enrich(this, GanttZoomExtension);
		GanttExtension.enrich(this, GanttPointerExtension);
		GanttExtension.enrich(this, GanttDragDropExtension);
		GanttExtension.enrich(this, GanttPopoverExtension);
		GanttExtension.enrich(this, GanttConnectExtension);
		GanttExtension.enrich(this, GanttResizeExtension);
		GanttExtension.enrich(this, GanttLassoExtension);

		this._bExtensionsInitialized = true;
	};

	GanttChartWithTable.prototype._detachExtensions = function(){
		GanttExtension.cleanup(this);
	};

	/**
	 * This is a shortcut method for GanttChart instance to get the AxisTime.
	 *
	 * @protected
	 * @returns {sap.gantt.misc.AxisTime} the AxisTime instance
	 */
	GanttChartWithTable.prototype.getAxisTime = function () {
		var oAxisTime = this.getAxisTimeStrategy().getAxisTime();
		if (!oAxisTime) {
			this.getAxisTimeStrategy().createAxisTime(this.getLocale());
			oAxisTime = this.getAxisTimeStrategy().getAxisTime();
		}

		return oAxisTime;
	};

	/**
	 * Return the Chart Content width by calculating the Axistime zoom strategy
	 * timeline distances, the unit is in pixel.
	 *
	 * @private
	 * @returns {int} the cnt width in pixel
	 */
	GanttChartWithTable.prototype.getContentWidth = function() {
		var oAxisTime = this.getAxisTime(),
			oRange = oAxisTime.getViewRange();
		return (Math.abs(Math.ceil(oRange[1]) - Math.ceil(oRange[0])) - 1);
	};

	/**
	 * Visible SVG width
	 * @private
	 * @returns {int} the visible width in chart area
	 */
	GanttChartWithTable.prototype.getVisibleWidth = function() {
		return this._getScrollExtension ? this._getScrollExtension().getVisibleWidth() : undefined;
	};

	/**
	 * expand one or more rows indices by the shape scheme key.
	 * This function takes effect only after the control is fully rendered, otherwise it's doing nothing.
	 *
	 * @param {string} sSchemeKey the key defined in <code>sap.gantt.simple.ShapeScheme</code>
	 * @param {int|int[]} vRowIndex A single index or an array of indices of the rows to be collapsed
	 * @public
	 */
	GanttChartWithTable.prototype.expand = function(sSchemeKey, vRowIndex) {
		this.toggleShapeScheme(true, sSchemeKey, vRowIndex);
		// Append the expanded indices
		this._aExpandedIndices = this._aExpandedIndices.concat(vRowIndex);
		// Remove duplicates as the Expand button can be selected multiple times
		this._aExpandedIndices = Array.from(new Set(this._aExpandedIndices));
	};

	/**
	 * Collapse the selected row indices by the shape scheme key.
	 * This function takes effect only after the control is fully rendered, otherwise it's doing nothing.
	 *
	 * @param {string} sSchemeKey the key defined in <code>sap.gantt.simple.ShapeScheme</code>
	 * @param {int|int[]} vRowIndex A single index or an array of indices of the rows to be collapsed
	 * @public
	 */
	GanttChartWithTable.prototype.collapse = function(sSchemeKey, vRowIndex) {
		this.toggleShapeScheme(false, sSchemeKey, vRowIndex);
		var aRowIndex = [];
		aRowIndex = aRowIndex.concat(vRowIndex);
		// Remove collapsed row index/indices
		this._aExpandedIndices = this._aExpandedIndices.filter(function(value){
			return aRowIndex.indexOf(value) == -1;
		});
	};

	/**
	 * @private
	 */
	GanttChartWithTable.prototype.toggleShapeScheme = function(bExpanded, sShapeScheme, vRowIndex) {
		var aIndices = [];
		if (typeof vRowIndex === "number") {
			aIndices = [vRowIndex];
		} else if (Array.isArray(vRowIndex)) {
			aIndices = vRowIndex;
		}

		if (aIndices.length === 0 || !sShapeScheme) { return; }

		var aExpandScheme = this.getShapeSchemes().filter(function(oScheme){
			return oScheme.getKey() === sShapeScheme;
		});

		if (aExpandScheme == null || aExpandScheme.length === 0 || aExpandScheme.length > 1) {
			assert(false, "shape scheme must not be null or not found in shapeSchemes");
			return;
		}

		var oPrimaryScheme = this.getPrimaryShapeScheme();

		var bExpandToggled = this._oExpandModel.isTableRowHeightNeedChange(bExpanded, this.getTable(), aIndices, oPrimaryScheme, aExpandScheme[0]);

		if (bExpandToggled) {
			this.getTable().invalidate();
		}
	};

	/**
	 * Determine whether the shape times fit into the visible horizon.
	 *
	 * @param {sap.gantt.simple.BaseShape} oShape any shape inherits from BaseShape
	 * @returns {boolean} return true if shape time range fit into visible area
	 */
	GanttChartWithTable.prototype.isShapeVisible = function(oShape) {
		if (oShape && oShape.isVisible()) {
			return true;
		}

		if (!oShape.getVisible()) {
			return false;
		}

		var mTimeRange = this.getRenderedTimeRange(),
			oMinTime = mTimeRange[0],
			oMaxTime = mTimeRange[1];

		var oStartTime = oShape.getTime(),
			oEndTime = oShape.getEndTime();

		var fnFallInRange = function(oTime) {
			return (oTime >= oMinTime && oTime <= oMaxTime);
		};
		if (oShape.getSelected() || !oStartTime || !oEndTime) {
			//time not set
			return true;
		} else if (oStartTime && oEndTime) {
			// both has value
			//     start time fall in range  OR end time fall in range  OR start time and end time cross the range
			return fnFallInRange(oStartTime) || fnFallInRange(oEndTime) || (oStartTime <= oMinTime && oEndTime >= oMaxTime);
		} else if (oStartTime && !oEndTime) {
			return fnFallInRange(oStartTime);
		} else if (!oStartTime && oEndTime) {
			return fnFallInRange(oEndTime);
		}
	};

	/**
	 * The Gantt Chart performs Bird Eye on all visible rows or on a specific row depending on the setting of iRowIndex.
	 * @param {int} iRowIndex zero-based index indicating which row to perform Bird Eye on. If you do not specify iRowIndex, the Gantt chart performs Bird Eye on all visible rows.
	 *
	 * @public
	 */
	GanttChartWithTable.prototype.doBirdEye = function(iRowIndex) {
		var oZoomExtension = this._getZoomExtension();
		oZoomExtension.doBirdEye(iRowIndex);
	};

	/**
	 *	Function to handle Export to Excel feature of a table within a GanttChart
	 *  @private
	 */
	GanttChartWithTable.prototype._exportTableToExcel = function(exportExcelConfig) {
		var aCols, oSettings, oSheet, bJSONModel, oTable, oRowBinding;

		oTable = this.getTable();

		if (oTable) {
			oRowBinding = oTable.getBinding(oTable._sAggregation);
		}

		//For JSON model, set the flag bJSONModel to True
		if (oRowBinding.getModel().isA('sap.ui.model.json.JSONModel')) {
			bJSONModel = true;
		}

		//Create column definition from the CustomData to export.
		aCols = this._createColumnConfig();

		var oModel = oRowBinding.getModel();

		//Create the settings parameter for Export.
		oSettings = {
			workbook: { columns: aCols },
			fileName: exportExcelConfig && exportExcelConfig.fileName ?  exportExcelConfig.fileName  : "GanttTableExport.xlsx",
			worker: false
		};

		//Create DataSource based on current DataModel.
		if (bJSONModel) { //JSONModel
			oSettings.dataSource = this._createJSONDataSource(oTable);
		} else { //ODATA Model
			oSettings.dataSource = {
				type: "odata",
				dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
				serviceUrl: this._sServiceUrl,
				headers: oModel.getHeaders ? oModel.getHeaders() : null,
				count: oRowBinding.getLength ? oRowBinding.getLength() : null
			};
		}

		//Set hierarchy level for a GanttChart.
		if (oTable.getColumns()[0].data("exportTableColumnConfig") && oTable.getColumns()[0].data("exportTableColumnConfig").hierarchyNodeLevel) {
			oSettings.workbook.hierarchyLevel =  oTable.getColumns()[0].data("exportTableColumnConfig").hierarchyNodeLevel;
		}

		//Create a new instance of spreadsheet for download.
		oSheet = new Spreadsheet(oSettings);
		oSheet.build().finally(function() {
			oSheet.destroy();
		});
	};

	/**
	 *	Function to create a dialog box for Save.
	 *  @private
	 */
	GanttChartWithTable.prototype._createExportDialogBox = function() {
		//Function to create a dialog box for Save.
		this._getExportSettingsViaDialog().then(function(exportExcelConfig) {
			this._exportTableToExcel(exportExcelConfig);
		}.bind(this));

	};

	//Function to create a dialog box for Save.
	GanttChartWithTable.prototype._getExportSettingsViaDialog = function(fnCallback) {
		return new Promise(function (fnResolve, fnReject) {
			var oExportSettingsDialog;
			var oExportConfigModel = new JSONModel();
			var oDefaultConfig = {
				fileName: "GanttTableExport",
				fileType: [
					{key: "xlsx"}
				],
				selectedFileType: "xlsx"
			};
			oExportConfigModel.setData(oDefaultConfig);

			var sDialogId = uid();

			oExportSettingsDialog = new Dialog({
				id: sDialogId,
				title: oResourceBundle.getText("EXPORT_SETTINGS_TITLE"),
				content: [
					new VBox({
						renderType: "Bare",
						width: "100%",
						items: [
							new Label({
								text: oResourceBundle.getText("FILE_NAME"),
								labelFor: sDialogId + "-fileName"
							}),
							new Input({
								id: sDialogId + "-fileName",
								value: "{/fileName}",
								liveChange: function (oEvent) {
									//Validate user inputs for a file name.
									var oInput = oEvent.getSource();
									var sFileName = oEvent.getParameter("value");
									var oRegEx = /[\\/:|?"*<>]/;
									var oExportBtn = Core.byId(sDialogId + "-export");
									var bValidate = oRegEx.test(sFileName);
									if (bValidate) {
										oInput.setValueState(sap.ui.core.ValueState.Error);
										oInput.setValueStateText(oResourceBundle.getText("FILENAME_ERROR"));
									} else if (sFileName.length > 100) {
										oInput.setValueState(sap.ui.core.ValueState.Warning);
										oInput.setValueStateText(oResourceBundle.getText("FILENAME_WARNING"));
									} else {
										oInput.setValueState(sap.ui.core.ValueState.None);
										oInput.setValueStateText(null);
									}
									oExportBtn.setEnabled(!bValidate);
								}
							}).addStyleClass("sapUiTinyMarginBottom")
						]
					//Use the style class from the Form layout to render colon after a label.
					}).addStyleClass("sapUiExportSettingsLabel")
				],
				endButton: new Button({
					id: sDialogId + "-cancel",
					text: oResourceBundle.getText("CANCEL_BUTTON"),
					press: function () {
						oExportSettingsDialog.close();
					}
				}),
				beginButton: new Button({
					id: sDialogId + "-export",
					text: oResourceBundle.getText("QUICK_EXPORT"),
					type:  sap.m.ButtonType.Emphasized,
					press: function () {
						if (oExportSettingsDialog) {
							oExportSettingsDialog._bSuccess = true;
							oExportSettingsDialog.close();
							fnResolve(oExportConfigModel.getData());
						}
					}
				}),
				afterClose: function () {
					if (!oExportSettingsDialog._bSuccess) {
						//Select Cancel after Close when Export button is not selected
						//because Close can also be triggered via ESC button on the keyboard.
						Log.warning("sap.gantt.simple.GanttChartWithTable ", "Cancel Click on Export to Excel PopOver", this);
						fnReject(null);
					}
					oExportSettingsDialog.destroy();
					oExportSettingsDialog = null;
				}
			});
			//Use the style class from the Form layout to render colon after a label.
			oExportSettingsDialog.addStyleClass("sapUiContentPadding sapUiExportSettings");
			oExportSettingsDialog.setModel(oExportConfigModel);
			oExportSettingsDialog.open();
			if (fnCallback) {
				fnCallback(oExportSettingsDialog);
			}

		});

	};

	//Function to create ColumnData from the CustomData
	GanttChartWithTable.prototype._createColumnConfig = function() {
		var aColumns, i, iLen, oColumn, oColumnData, sLabel, sPath, nWidth, sType, aSheetColumns = [], falseValue, trueValue, format;

		this._oTable = this.getTable();
		//Get all the columns of the Table.
		aColumns = this._oTable.getColumns();
		iLen = aColumns.length;

		for (i = 0; i < iLen; i++) {
			sPath = null;
			falseValue = null;
			trueValue = null;
			format = null;
			sType = null;
			oColumn = aColumns[i];

			if (oColumn.getVisible()) {
				oColumnData = oColumn.data("exportTableColumnConfig");//Get customData based on the constant key.

				if (!sPath && oColumnData) {
					sPath = oColumnData["leadingProperty"];
				}

				if (Array.isArray(sPath)) {
					sPath = sPath[0];
				}

				if (sPath) {
					sLabel = this._getColumnLabel(oColumn);//Function to return the label for a column.
					nWidth = oColumn.getWidth().toLowerCase() || oColumnData.width || "";
					nWidth = this._getColumnWidthNumber(nWidth); //Function to get the width of the column.

					//Checks to handle setting of sType.
					if (oColumnData.unitProperty) {
						sType = oColumnData.isCurrency ? sap.ui.export.EdmType.Currency : sap.ui.export.EdmType.Number;
					} else if (oColumnData.isDigitSequence) {
						sType = sap.ui.export.EdmType.Number;
					}
					if (!sType) {
						switch (oColumnData.dataType){
							case ExportTableCustomDataType.Numeric:  sType = sap.ui.export.EdmType.Number; break;
							case ExportTableCustomDataType.DateTime: sType = sap.ui.export.EdmType.DateTime; format = oColumnData.displayFormat; break;
							case ExportTableCustomDataType.StringDate:
							case ExportTableCustomDataType.Date: sType = sap.ui.export.EdmType.Date; format = oColumnData.displayFormat; break;
							case ExportTableCustomDataType.Boolean: sType = sap.ui.export.EdmType.Boolean; falseValue = "false"; trueValue = "true"; break;
							case ExportTableCustomDataType.String: sType = sap.ui.export.EdmType.String; break;
							case ExportTableCustomDataType.Time: sType = sap.ui.export.EdmType.Time; break;
							default: sType = sap.ui.export.EdmType.String; break;
						}
					}
					//Create column structure.
					aSheetColumns.push({
						columnId: oColumn.getId(),
						property: sPath,
						type: sType,
						format: format ? format : undefined,
						label: sLabel ? sLabel : sPath,
						width: nWidth,
						textAlign: oColumn.getHAlign(),
						trueValue: (sType === sap.ui.export.EdmType.Boolean && trueValue) ? trueValue : undefined,
						falseValue: (sType === sap.ui.export.EdmType.Boolean && falseValue) ? falseValue : undefined,
						unitProperty: (sType === sap.ui.export.EdmType.Currency || (sType === sap.ui.export.EdmType.Number)) ? oColumnData.unitProperty : undefined,
						displayUnit: sType === sap.ui.export.EdmType.Currency,
						unit: oColumnData.unit ? oColumnData.unit : undefined,
						precision: oColumnData.precision ? oColumnData.precision : undefined,
						scale: oColumnData.scale ? oColumnData.scale : undefined,
						wrap: oColumnData.wrap ? oColumnData.wrap : false
					});
				}
			}
		}

		return aSheetColumns;
	};

	//Function to get column label.
	GanttChartWithTable.prototype._getColumnLabel = function(oColumn) {
		var oLabel;

		if (!oColumn) {
			return null;
		}

		if (oColumn.getLabel) {
			oLabel = oColumn.getLabel();
		}

		if (oColumn.getHeader) {
			oLabel = oColumn.getHeader();
		}

		return (oLabel && oLabel.getText) ? oLabel.getText() : null;
	};

	//Funtion to return the column width as number
	GanttChartWithTable.prototype._getColumnWidthNumber = function(sWidth) {
		if (sWidth.indexOf("em") > 0) {
			return Math.round(parseFloat(sWidth));
		}
		if (sWidth.indexOf("px") > 0) {
			return Math.round(parseInt(sWidth,10) / 16);
		}
		return "";
	};

	//Function to create DataSource for JSON Model.
	GanttChartWithTable.prototype._createJSONDataSource = function(oTable){
		var aAttributeName, sPath, aData, aFinalArray = [];
		aAttributeName = oTable.getBinding(oTable._sAggregation).mParameters.arrayNames[0];
		sPath = oTable.getBinding().sPath;
		aData = oTable.getModel().getProperty(sPath);
		aFinalArray = this._generateJSONRowData(aData[aAttributeName],aAttributeName,aFinalArray);
		return aFinalArray;
	};

	//Function to generate data from JSON model recursively.
	GanttChartWithTable.prototype._generateJSONRowData = function(aData,aAttributeName,aFinalArray) {
		if (!aData) {
			return [];
		}
		if (!aFinalArray) {
			aFinalArray = [];
		}
		for ( var i = 0; i < aData.length; i++) {
			aFinalArray.push(aData[i]);
			if ( aData[i][aAttributeName] ) {
				this._generateJSONRowData(aData[i][aAttributeName],aAttributeName,aFinalArray);
			}
		}
		return aFinalArray;
	};

	/**
	 * Provides a custom row height based on the application logic.
	 * @param {object} oRowsCustomHeight A key-value pair of a row ID and its custom height.
	 * The key is the ID that is mapped to the rowID property of the rowSettings.
	 * The value is the custom height of the row.
	 *
	 * @public
	 * @experimental As of version 1.88
	 */
	GanttChartWithTable.prototype.setRowsHeight = function (oRowsCustomHeight) {
		this.oRowsCustomHeight = oRowsCustomHeight;
		this.getTable().invalidate();
	};

	return GanttChartWithTable;

}, true);
