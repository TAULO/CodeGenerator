
		/**
		
		* @property {Boolean} [Lock=false]
			
		* True to initially render this column as locked. Columns which are locked must specify a fixed width. They do NOT support a width expressed in percentage nor AutoResize.
		* @member gxui.GridExtensionColumn
		*/
	
		/**
		
		* @property {Boolean} [Resizable=true]
			
		* False to disable column resizing. Defaults to true.
		* @member gxui.GridExtensionColumn
		*/
	
		/**
		
		* @property {Boolean} [Sortable=false]
			
		* True if sorting is to be allowed on this column. Check the value of {@link gxui.GridExtension#RemoteSort} property, because by default, it is set to sort on the server side, and this needs extra programming. To sort on the client side, set {@link gxui.GridExtension#RemoteSort} = False.
		* @member gxui.GridExtensionColumn
		*/
	
		/**
		
		* @property {Boolean} [Hidden=false]
			
		* True to initially render the column hidden.
		* @member gxui.GridExtensionColumn
		*/
	
		/**
		
		* @property {Boolean} [Hideable=true]
			
		* Specify as false to prevent the user from hiding this column (defaults to true).
		* @member gxui.GridExtensionColumn
		*/
	
		/**
		
		* @property {Boolean} [MenuDisabled=false]
			
		* True to disable the column menu. Defaults to false.
		* @member gxui.GridExtensionColumn
		*/
	
		/**
		
		* @property {Boolean} [AutoExpand=false]
			
		* True if this column should expand to fill unused space in the grid. Deprecated set Width=100% instead.
		* @member gxui.GridExtensionColumn
		*/
	
		/**
		
		* @property {Combo} [SummaryType=No summary]
			
		* Function to use when calculating the summary of a column (only applies when {@link gxui.GridExtension#ShowGroupingSummary grouping summary} is enabled in the grid.)
		* Possible values: 
		*
		* - No summary
		* - Count
		* - Sum
		* - Min
		* - Max
		* - Average
		*
	
		* @member gxui.GridExtensionColumn
		*/
	
		/**
		
		* @property {Text} [HeaderGroup]
			
		* If specified, this column is rendered inside a parent header whose text is the one specified in this property. All the columns with the same HeaderGroup value are shown inside the same header group.
		* @member gxui.GridExtensionColumn
		*/
	
		/**
		
		* @property {Text} [Title]
			
		* Optional title for the grid.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Boolean} [AddToParentGxUIControl=true]
			
		* True to add the control to its parent GxUI control (if there's one). Defaults to true.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Boolean} [UseThemeClasses=false]
			
		* True to use the Theme classes asigned to the grid and columns, false to ignore them.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Text} [EditableCellClass]
			
		* Theme class for editable cells.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Boolean} [EnableColumnLocking=false]
			
		* True to allow column locking ala Ms Excel's "Freeze Panes" option.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Boolean} [EnableTextSelection=false]
			
		* True to enable text selections.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Combo} [SelectionModel=Row]
			
		* The selection model to use with the grid: Row (rows are selected by clicking on the row) or Checkbox (a check box appears in the first column of the grid). If the grid has at least one editable column, the selection model is ignored as a cell by cell model is used.
		* Possible values: 
		*
		* - Row
		* - Checkbox
		*
	
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Combo} [EditModel=Cell]
			
		* The edit model to use with the grid. If Row is selected, when editing begins, a small floating dialog will be shown for the appropriate row. Each editable column will show a field for editing. There is a button to save or cancel all changes for the edit. If Cell is selected, only a single cell will be editable at a time.
		* Possible values: 
		*
		* - Cell
		* - Row
		*
	
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Combo} [ClicksToEdit=1]
			
		* The number of clicks on a grid required to display the editor. The only accepted values are 1 and 2.
		* Possible values: 
		*
		* - 1
		* - 2
		*
	
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Text} [DragDropGroup]
			
		* A named drag drop group to which this object belongs. If a group is specified, then this object will only interact with other drag drop objects in the same group. This is useful when using drag and drop between a {@link gxui.Treeview tree} and a grid.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Text} [DragDropText]
			
		* Configures the text in the drag proxy that is shown during the drag/drop operation.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Boolean} [PrimaryButtonOnly=true]
			
		* Set to false to allow drag and drop to start with any mouse click that is propogated by the browser.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Boolean} [Grouping=false]
			
		* True to allow to display the grid rows aggregated into groups. The group will show the title for the group name and then the appropriate records for the group underneath. The groups can also be expanded and collapsed.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Boolean} [ShowGroupingSummary=false]
			
		* True to add an aggregate summary row at the bottom of each group.
* The summary value needs to be calculated for each column in the grid. This is controlled by the {@link gxui.GridExtensionColumn#SummaryType} option specified on the column.
									
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Text} [GroupField]
			
		* The name of the attribute or variable to group on (case sensitive). When a SDT is bound to the grid, use the name of the SDT member. Data should be sorted by this field when paging is enabled.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Boolean} [HideGroupedField=false]
			
		* True to hide the grouping field.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Text} [GroupTemplate={name}]
			
		* The template used to render the group header.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Boolean} [ForceFit=false]
			
		* True to auto expand/contract the size of the columns to fit the grid width and prevent horizontal scrolling.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Integer} [MinColumnWidth=25]
			
		* The minimum width a column can be resized to.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Boolean} [EnableColumnHide=true]
			
		* True to enable hiding of columns with the header context menu.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Boolean} [EnableColumnMove=true]
			
		* True to enable drag and drop reorder of columns.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Boolean} [RemoteSort=true]
			
		* 
								Indicates if sort operations will be performed locally (on the current page) or remotely over the whole data set.
								* To accomplish this, orders must be programmed on the webpanel accordingly. For example, in a grid with CustomerName and CustomerAddress fields,
								* the order clauses should be:
								*
								*		CustomerName when (Grid1.SortField = 'CustomerName' and Grid1.SortOrder = 'ASC')  or Grid1.SortField = ''
								*		(CustomerName) when Grid1.SortField = 'CustomerName' and Grid1.SortOrder = 'DESC'
								*		CustomerAddress when Grid1.SortField = 'CustomerAddress' and Grid1.SortOrder = 'ASC'
								*		(CustomerAddress) when Grid1.SortField = 'CustomerAddress' and Grid1.SortOrder = 'DESC'
								*
								* Bear in mind that sorting must be enabled by setting the {@link gxui.GridExtensionColumn#Sortable Sortable} = True in the column.
							
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Text} [SortField]
			
		* The field used to sort the grid.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Combo} [SortOrder=Ascendent]
			
		* The sort order of the grid (ASC|DESC). Defaults to ASC.
		* Possible values: 
		*
		* - Ascendent
		* - Descendent
		*
	
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Text} [FirstText=First Page]
			
		* Text of the "First page" button.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Text} [LastText=Last Page]
			
		* Text of the "Last page" button.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Text} [NextText=Next Page]
			
		* Text of the "Next page" button.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Text} [PreviousText=Previous Page]
			
		* Text of the "Previous page" button.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Text} [RefreshText=Refresh]
			
		* Text of the "Refresh" button.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Text} [StatusText]
			
		* Text shown at the right side of the paging bar. Useful to show status messages or a text indicating the current page and the page count.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Boolean} [Stateful=true]
			
		* A flag which causes the Component to attempt to restore the state of internal properties from a saved state on startup.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Text} [StateId]
			
		* The unique id for this component to use for state management purposes.
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Integer} [SelectedRow=0]
			
		* The index of the selected row. Changing this property changes the selected row. (Runtime)
		* @member gxui.GridExtension
		*/
	
		/**
		
		* @property {Integer} [Width=100]
			
		* Control width. Ignored if {@link #Nested} is false.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Integer} [Height=100]
			
		* Control height. Ignored if {@link #Nested} is false.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Text} [Cls]
			
		* An optional extra CSS class that will be added to this control's element. This can be useful for adding customized styles to the component or any of its children using standard CSS rules.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [Nested=False]
			
		* Set to true if you want to nest this control inside another control. Set to false if you want it to render itself to the document body (full screen), and automatically size itself to the size of the browser viewport and manage window resizing.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [NorthHidden=False]
			
		* Set to true if you want to hide this region.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [NorthSplit=True]
			
		* Set to true if you want to enable a splitbar in this region.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [NorthAutoScroll=True]
			
		* Set to true True to show scroll bars automatically when necessary, false to clip any overflowing content.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Text} [NorthMargins=0,0,0,0]
			
		* Region margins in the format: top, right, bottom, left.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [NorthBorder=true]
			
		* True to display the borders of the region's body element, false to hide them (defaults to true).
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Combo} [NorthLayout=Fit]
			
		* The layout type to be used in this container.
										* Use Fit if inside the container a single GxUI child control will be shown.
										* This child control will expand to fit the layout's container if its AddToParentGxUIControl property is set to true.
										* Important: Fit layout will disable the container scrollbars, so it should only be used when showing a single, expanded, GxUI control inside. In any other case, Default layout should be used.
									
		* Possible values: 
		*
		* - Default
		* - Fit
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [NorthTitleBar=True]
			
		* True to show the title bar on top of the region.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Text} [NorthTitle=North]
			
		* The title text to display in the title bar. When a title is specified the header element will automatically be created and displayed unless the title bar is explicitly set to false.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Text} [NorthHeight=100]
			
		* Region initial height. It can be expressed in pixels or with a percentage.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Integer} [NorthMinHeight=0]
			
		* Region minimum height in pixels.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Integer} [NorthMaxHeight=300]
			
		* Region maximum height in pixels.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [NorthCollapsible=True]
			
		* True to allow the user to collapse this region. If true, an expand/collapse tool button will automatically be rendered into the title bar of the region, otherwise the button will not be shown. Note that a title bar is required to display the toggle button.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [NorthCollapsed=False]
			
		* True to render the region collapsed, false to render it expanded.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [NorthFloatable=True]
			
		* True to allow clicking a collapsed region's bar to display the region's panel floated above the layout, false to force the user to fully expand a collapsed region by clicking the expand button to see it again.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [NorthAnimate=True]
			
		* True to animate resizing, collapsing and floating actions.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Integer} [NorthDuration=300]
			
		* Animation duration if Animate is true.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [SouthHidden=False]
			
		* Set to true if you want to hide this region.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [SouthSplit=True]
			
		* Set to true if you want to enable a splitbar in this region.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [SouthAutoScroll=True]
			
		* Set to true True to show scroll bars automatically when necessary, false to clip any overflowing content.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Text} [SouthMargins=0,0,0,0]
			
		* Region margins in the format: top, right, bottom, left.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [SouthBorder=true]
			
		* True to display the borders of the region's body element, false to hide them (defaults to true).
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Combo} [SouthLayout=Fit]
			
		* 
										The layout type to be used in this container.
										* Use Fit if inside the container a single GxUI child control will be shown.
										* This child control will expand to fit the layout's container if its AddToParentGxUIControl property is set to true.
										* Important: Fit layout will disable the container scrollbars, so it should only be used when showing a single, expanded, GxUI control inside. In any other case, Default layout should be used.
									
		* Possible values: 
		*
		* - Default
		* - Fit
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [SouthTitleBar=True]
			
		* True to show the title bar on top of the region.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Text} [SouthTitle=South]
			
		* The title text to display in the title bar. When a title is specified the header element will automatically be created and displayed unless the title bar is explicitly set to false.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Text} [SouthHeight=100]
			
		* Region initial height. It can be expressed in pixels or with a percentage.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Integer} [SouthMinHeight=0]
			
		* Region minimum height in pixels.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Integer} [SouthMaxHeight=300]
			
		* Region maximum height in pixels.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [SouthCollapsible=True]
			
		* True to allow the user to collapse this region. If true, an expand/collapse tool button will automatically be rendered into the title bar of the region, otherwise the button will not be shown. Note that a title bar is required to display the toggle button.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [SouthCollapsed=False]
			
		* True to render the region collapsed, false to render it expanded.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [SouthFloatable=True]
			
		* True to allow clicking a collapsed region's bar to display the region's panel floated above the layout, false to force the user to fully expand a collapsed region by clicking the expand button to see it again.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [SouthAnimate=True]
			
		* True to animate resizing, collapsing and floating actions.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Integer} [SouthDuration=300]
			
		* Animation duration if Animate is true.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [WestHidden=False]
			
		* Set to true if you want to hide this region.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [WestSplit=True]
			
		* Set to true if you want to enable a splitbar in this region.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [WestAutoScroll=True]
			
		* Set to true True to show scroll bars automatically when necessary, false to clip any overflowing content.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Text} [WestMargins=0,0,0,0]
			
		* Region margins in the format: top, right, bottom, left.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [WestBorder=true]
			
		* True to display the borders of the region's body element, false to hide them (defaults to true).
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Combo} [WestLayout=Fit]
			
		* 
										The layout type to be used in this container.
										* Use Fit if inside the container a single GxUI child control will be shown.
										* This child control will expand to fit the layout's container if its AddToParentGxUIControl property is set to true.
										* Important: Fit layout will disable the container scrollbars, so it should only be used when showing a single, expanded, GxUI control inside. In any other case, Default layout should be used.
									
		* Possible values: 
		*
		* - Default
		* - Fit
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [WestTitleBar=True]
			
		* True to show the title bar on top of the region.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Text} [WestTitle=West]
			
		* The title text to display in the title bar. When a title is specified the header element will automatically be created and displayed unless the title bar is explicitly set to false.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Text} [WestWidth=200]
			
		* Region initial width. It can be expressed in pixels or with a percentage.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Integer} [WestMinWidth=50]
			
		* Region minimum width in pixels.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Integer} [WestMaxWidth=400]
			
		* Region maximum width in pixels.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [WestCollapsible=True]
			
		* True to allow the user to collapse this region. If true, an expand/collapse tool button will automatically be rendered into the title bar of the region, otherwise the button will not be shown. Note that a title bar is required to display the toggle button.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [WestCollapsed=False]
			
		* True to render the region collapsed, false to render it expanded.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [WestFloatable=True]
			
		* True to allow clicking a collapsed region's bar to display the region's panel floated above the layout, false to force the user to fully expand a collapsed region by clicking the expand button to see it again.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [WestAnimate=True]
			
		* True to animate resizing, collapsing and floating actions.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Integer} [WestDuration=300]
			
		* Animation duration if Animate is true.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [CenterHidden=False]
			
		* Set to true if you want to hide this region.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [CenterSplit=True]
			
		* Set to true if you want to enable a splitbar in this region.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [CenterAutoScroll=True]
			
		* Set to true True to show scroll bars automatically when necessary, false to clip any overflowing content.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Text} [CenterMargins=0,0,0,0]
			
		* Region margins in the format: top, right, bottom, left.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [CenterBorder=true]
			
		* True to display the borders of the region's body element, false to hide them (defaults to true).
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Combo} [CenterLayout=Fit]
			
		* 
										The layout type to be used in this container.
										* Use Fit if inside the container a single GxUI child control will be shown.
										* This child control will expand to fit the layout's container if its AddToParentGxUIControl property is set to true.
										* Important: Fit layout will disable the container scrollbars, so it should only be used when showing a single, expanded, GxUI control inside. In any other case, Default layout should be used.
									
		* Possible values: 
		*
		* - Default
		* - Fit
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [CenterTitleBar=True]
			
		* True to show the title bar on top of the region.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Text} [CenterTitle=Center]
			
		* The title text to display in the title bar. When a title is specified the header element will automatically be created and displayed unless the title bar is explicitly set to false.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [CenterCollapsible=True]
			
		* True to allow the user to collapse this region. If true, an expand/collapse tool button will automatically be rendered into the title bar of the region, otherwise the button will not be shown. Note that a title bar is required to display the toggle button.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [CenterCollapsed=False]
			
		* True to render the region collapsed, false to render it expanded.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [CenterFloatable=True]
			
		* True to allow clicking a collapsed region's bar to display the region's panel floated above the layout, false to force the user to fully expand a collapsed region by clicking the expand button to see it again.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [CenterAnimate=True]
			
		* True to animate resizing, collapsing and floating actions.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Integer} [CenterDuration=300]
			
		* Animation duration if Animate is true.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [EastHidden=False]
			
		* Set to true if you want to hide this region.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [EastSplit=True]
			
		* Set to true if you want to enable a splitbar in this region.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [EastAutoScroll=True]
			
		* Set to true True to show scroll bars automatically when necessary, false to clip any overflowing content.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Text} [EastMargins=0,0,0,0]
			
		* Region margins in the format: top, right, bottom, left.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [EastBorder=true]
			
		* True to display the borders of the region's body element, false to hide them (defaults to true).
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Combo} [EastLayout=Fit]
			
		* 
										The layout type to be used in this container.
										* Use Fit if inside the container a single GxUI child control will be shown.
										* This child control will expand to fit the layout's container if its AddToParentGxUIControl property is set to true.
										* Important: Fit layout will disable the container scrollbars, so it should only be used when showing a single, expanded, GxUI control inside. In any other case, Default layout should be used.
									
		* Possible values: 
		*
		* - Default
		* - Fit
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [EastTitleBar=True]
			
		* True to show the title bar on top of the region.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Text} [EastTitle=East]
			
		* The title text to display in the title bar. When a title is specified the header element will automatically be created and displayed unless the title bar is explicitly set to false.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Text} [EastWidth=200]
			
		* Region initial width. It can be expressed in pixels or with a percentage.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Integer} [EastMinWidth=50]
			
		* Region minimum width in pixels.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Integer} [EastMaxWidth=400]
			
		* Region maximum width in pixels.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [EastCollapsible=True]
			
		* True to allow the user to collapse this region. If true, an expand/collapse tool button will automatically be rendered into the title bar of the region, otherwise the button will not be shown. Note that a title bar is required to display the toggle button.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [EastCollapsed=False]
			
		* True to render the region collapsed, false to render it expanded.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [EastFloatable=True]
			
		* True to allow clicking a collapsed region's bar to display the region's panel floated above the layout, false to force the user to fully expand a collapsed region by clicking the expand button to see it again.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [EastAnimate=True]
			
		* True to animate resizing, collapsing and floating actions.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Integer} [EastDuration=300]
			
		* Animation duration if Animate is true.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Boolean} [Stateful=True]
			
		* A flag which causes the Component to attempt to restore the state of internal properties from a saved state on startup.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {Text} [StateId]
			
		* The unique id for this component to use for state management purposes.
		* @member gxui.Layout
		*/
	
		/**
		
		* @property {gxuiToolbarItem} [Menu]
			
		* 
						A variable based on a collection of gxuiToolbarItem SDT, with the menu definition.
						* @property {String} Menu.Id An identifier for the item. When a menu option is pressed, the {@link #ItemClickedId} property is set with the identifier set here, so you will know which menu option was pressed when the {@link #ItemClick} event is fired.
						* @property {String} Menu.Text The text of the menu option. Applies to Button, Menu and Text.
						* @property {String} Menu.Tooltip A tooltip to show when the mouse hovers the item. Applies to Button and Menu.
						* @property {String} Menu.Icon The path to an image to display in the item icon. Applies to Button and Menu.
						* @property {String} Menu.IconCls A css class which sets a background image to be used as the icon for this menu option. Applies to Button and Menu.
						* @property {String} Menu.Cls A CSS class to apply to the item's main element
						* @property {Boolean} Menu.Disabled True to start disabled. Applies to Button, and Menu.
						* @property {gxuiToolbarItemTypes} Menu.Type Defines the type of the item (defaults to Button). The supported types are:
						*
						* - Button: A simple button. Customisations include aligned icons, tooltips and sizing options.
						* - Text: A text to be rendered inside the toolbar.
						* - Separator: Adds a vertical separator bar between toolbar items. It can't be a direct child of a Group item.
						* - Menu: A button that opens a menu. The menu options are set through the Items property. An arrow is automatically added to the button.
						* @property {Boolean} Menu.Hidden True to start hidden.
						* @property {gxuiToolbarItem[]} Menu.Items Collection of children items of the menu option. Applies to Menu only.
					
		* @member gxui.Menu
		*/
	
		/**
		
		* @property {Text} [ItemClickedId]
			
		* The identifier of the menu option that was pressed. This property is useful when the {@link #ItemClick} event is fired. (Runtime)
		* @member gxui.Menu
		*/
	
		/**
		
		* @property {Combo} [Show=False]
			
		* Deprecated. If true, when a user event is executed, the message is shown. Use {@link #ShowMessage} method instead.
		* Possible values: 
		*
		* - False
		* - True
		*
	
		* @member gxui.Message
		*/
	
		/**
		
		* @property {Text} [Title=Title]
			
		* Title of the message.
		* @member gxui.Message
		*/
	
		/**
		
		* @property {Text} [Message=This is the message]
			
		* Text of the message.
		* @member gxui.Message
		*/
	
		/**
		
		* @property {Combo} [Type=Alert]
			
		* Indicates the way messages will be shown by default.
						* If you want to show an alert, a modal message dialog will appear.
						* If you want to show a notification, a non-modal notification window will appear, similar to the one used by Microsoft Outlook when a new mail message arrives.
					
		* Possible values: 
		*
		* - Alert
		* - Notification
		*
	
		* @member gxui.Message
		*/
	
		/**
		
		* @property {Combo} [Icon=Info]
			
		* Indicates which icon to use in the dialog.
		* Possible values: 
		*
		* - Info
		* - Error
		* - Question
		* - Warning
		*
	
		* @member gxui.Message
		*/
	
		/**
		
		* @property {Text} [Cls]
			
		* An optional extra CSS class that will be added to this control's element.
		* @member gxui.Message
		*/
	
		/**
		
		* @property {Combo} [Position=Top Center]
			
		* Screen position where the notification will be shown.
		* Possible values: 
		*
		* - Top Left
		* - Top Center
		* - Top Right
		* - Center Left
		* - Center Center
		* - Center Right
		* - Bottom Left
		* - Bottom Center
		* - Bottom Right
		*
	
		* @member gxui.Message
		*/
	
		/**
		
		* @property {Integer} [Duration=1]
			
		* Duration of the animation used to show the notification, in seconds.
		* @member gxui.Message
		*/
	
		/**
		
		* @property {Integer} [Width=100]
			
		* Control width.
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Integer} [Height=100]
			
		* Control height.
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Boolean} [ShowAsWindow=false]
			
		* True make the panel behave like a floating Window.
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Combo} [Layout=Default]
			
		* 
						The layout type to be used in this container.
						* Use Fit if inside the container a single GxUI child control will be shown.
						* This child control will expand to fit the layout's container if its AddToParentGxUIControl property is set to true.
						* Important: Fit layout will disable the container scrollbars, so it should only be used when showing a single, expanded, GxUI control inside. In any other case, Default layout should be used.
					
		* Possible values: 
		*
		* - Default
		* - Fit
		*
	
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Boolean} [AddToParentGxUIControl=true]
			
		* True to add the control to its parent GxUI control (if there's one). Defaults to true.
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Combo} [AutoWidth=True]
			
		* True to automatically calculate width from the panel content, false to use fixed width.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Combo} [AutoHeight=False]
			
		* True to automatically calculate height from the panel content, false to use fixed height.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Text} [Title]
			
		* The title text to display in the panel header.
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Combo} [HeaderPosition=Top]
			
		* Position of the panel header (defaults to Top).
		* Possible values: 
		*
		* - Top
		* - Bottom
		* - Left
		* - Right
		*
	
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Text} [IconCls]
			
		* A CSS class that will provide a background image to be used as the panel header icon.
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Text} [Cls]
			
		* An optional extra CSS class that will be added to this control's element. This can be useful for adding customized styles to the component or any of its children using standard CSS rules.
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Combo} [Frame=False]
			
		* True to render the panel with custom rounded borders, false to render with plain 1px square borders.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Boolean} [Border=true]
			
		* True to display the borders of the panel's body element, false to hide them (defaults to true). By default, the border is a 2px wide inset border.
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Boolean} [Modal=false]
			
		* True to make the window modal and mask everything behind it when displayed, false to display it without restricting access to other UI elements (defaults to false).
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Combo} [UseToolbar=False]
			
		* True to enable a buttons toolbar at the top of the panel.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Combo} [ToolbarPosition=Top]
			
		* Position where the toolbar will be docked. (Runtime)
		* Possible values: 
		*
		* - Top
		* - Right
		* - Bottom
		* - Left
		*
	
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {gxuiToolbar} [ToolbarData]
			
		* A variable based on gxuiToolbar SDT, with the toolbar definition. See {@link gxui.Toolbar#Data gxuiToolbar Data property} for detailed information.
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Combo} [Resizable=False]
			
		* True to enable resizing of the panel.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Integer} [MinWidth=100]
			
		* The minimum width for the element.
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Integer} [MaxWidth=800]
			
		* The maximum width for the element.
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Integer} [MinHeight=100]
			
		* The minimum height for the element.
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Integer} [MaxHeight=600]
			
		* The maximum height for the element.
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Text} [Handles=s e se]
			
		* 
* String consisting of the resize handles to display.
*
* - 'n'	    north
* - 's'	    south
* - 'e'	    east
* - 'w'     west
* - 'nw'    northwest
* - 'sw'    southwest
* - 'se'    southeast
* - 'ne'    northeast
* - 'all'   all
									
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Combo} [Collapsible=False]
			
		* True to make the panel collapsible and have the expand/collapse toggle button automatically rendered into the header, false to keep the panel statically sized with no button.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Combo} [Collapsed=False]
			
		* True to render the panel collapsed, false to render it expanded (defaults to false).
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Combo} [AnimateCollapse=False]
			
		* True to animate the transition when the panel is collapsed, false to skip the animation.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Combo} [CollapseDirection=Top]
			
		* The direction to collapse the Panel when the toggle button is clicked (defaults to HeaderPosition).
		* Possible values: 
		*
		* - Top
		* - Bottom
		* - Left
		* - Right
		*
	
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Combo} [Stateful=True]
			
		* A flag which causes the Component to attempt to restore the state of internal properties from a saved state on startup.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Text} [StateId]
			
		* The unique id for this component to use for state management purposes.
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Text} [ButtonPressedId]
			
		* @inheritdoc gxui.Toolbar#ButtonPressedId (Runtime)
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Text} [EditFieldValue]
			
		* @inheritdoc gxui.Toolbar#EditFieldValue (Runtime)
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Boolean} [Visible=true]
			
		* Set to true to hide the panel. (Runtime)
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Boolean} [Refresh=true]
			
		* (Deprecated) Set to true to refresh the panel properties. (Runtime)
		* @member gxui.Panel
		*/
	
		/**
		
		* @property {Boolean} [RevertTablePaddingReset=true]
			
		* True to revert ExtJS CSS reset of TH and TD elements padding.
		* @member gxui.Settings
		*/
	
		/**
		
		* @property {Boolean} [RevertTableSpacingReset=true]
			
		* True to revert ExtJS CSS reset of TABLE elements border-spacing and border-collapse properties.
		* @member gxui.Settings
		*/
	
		/**
		
		* @property {Combo} [Language=English]
			
		* Language for ExtJS standard texts (for example, {@link gxui.GridExtension grid's} column menu options). This property should be used for setting the language on page load. For changing the language in a user event use {@link #SetLanguage} method instead.
		* Possible values: 
		*
		* - Afrikaans
		* - Bulgarian
		* - Catalan / Valencian
		* - Czech
		* - Danish
		* - German
		* - Modern Greek
		* - English
		* - British English
		* - Spanish / Castilian
		* - Persian Arab
		* - Finnish
		* - French
		* - French Canada
		* - Hebrew
		* - Croatian
		* - Hungarian
		* - Indonesian
		* - Italian
		* - Japanese
		* - Korean
		* - Lithuanian
		* - Latvian
		* - Macedonia
		* - Dutch
		* - Norwegian (NB)
		* - Norwegian (NN)
		* - Polish
		* - Portuguese
		* - Portuguese Brazil
		* - Portuguese Portugal
		* - Romanian
		* - Russian
		* - Slovak
		* - Slovenian
		* - Serbian
		* - Serbian Cyrillic
		* - Swedish
		* - Thailand
		* - Turkish
		* - Ukrainian
		* - Vietnamese
		* - Simplified Chinese
		* - Traditional Chinese
		*
	
		* @member gxui.Settings
		*/
	
		/**
		
		* @property {Combo} [Enable=True]
			
		* True to enable state management so the state of GxUI controles is remembered ({@link gxui.GridExtension} columns position and width, {@link gxui.Layout} regions collapsing and dimensions, {@link gxui.Treeview} nodes collapsing, etc).
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Settings
		*/
	
		/**
		
		* @property {Combo} [Provider=Cookie]
			
		* State management provider. If Cookie is selected, the state is stored in cookies. If HTTP is selected, state is stored in a remote server, through HTTP calls to the URL configured in {@link #SaveURL} property. Cookie is not recommended for production environments, with many controls.
		* Possible values: 
		*
		* - Cookie
		* - HTTP
		*
	
		* @member gxui.Settings
		*/
	
		/**
		
		* @property {gxuiState} [InitialState]
			
		* The variable where the initial state is stored. State is stored as a key/value pair.
		* @member gxui.Settings
		*/
	
		/**
		
		* @property {Text} [SaveURL]
			
		* The URL of the web service where the state changes will be notified.
		* @member gxui.Settings
		*/
	
		/**
		
		* @property {Integer} [Delay=750]
			
		* The milliseconds to delay the buffer changes.
		* @member gxui.Settings
		*/
	
		/**
		
		* @property {Text} [Width=100]
			 
		* @member gxui.Splash
		*/
	
		/**
		
		* @property {Text} [Height=100]
			 
		* @member gxui.Splash
		*/
	
		/**
		
		* @property {Integer} [Duration=5]
			 
		* @member gxui.Splash
		*/
	
		/**
		
		* @property {Text} [Message=Loading...]
			 
		* @member gxui.Splash
		*/
	
		/**
		
		* @property {Text} [Cls=gxuiSplash]
			 
		* @member gxui.Splash
		*/
	
		/**
		
		* @property {Integer} [Width=100]
			
		* Control width.
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Integer} [Height=100]
			
		* Control height.
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Combo} [Layout=Fit]
			
		* 
						The layout type to be used in each tab.
						* Use Fit if inside the each tab a single GxUI child control will be shown.
						* This child control will expand to fit the layout's container if its AddToParentGxUIControl property is set to true.
						* Important: Fit layout will disable the container scrollbars, so it should only be used when showing a single, expanded, GxUI control inside. In any other case, Default layout should be used.
					
		* Possible values: 
		*
		* - Fit
		* - Default
		*
	
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Boolean} [AddToParentGxUIControl=true]
			
		* 
						True to add the control to its parent GxUI control (if it's contained inside one). This property is useful when the control
						* is contained inside a {@link gxui.Panel Panel}, {@link gxui.TabPanel TabPanel} or {@link gxui.Layout Layout} control and you want its dimensions to be
						* controlled from the parent control.
						* Bear in mind that if there are other controls between the control and its parent (for example, a Table or Group), in runtime the parent control will move
						* the control out of the controls in the middle, to make it its direct descendant. The controls in the middle will be ignored.
					
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Combo} [TabPosition=top]
			
		* The position where the tab strip should be rendered. Can be top or bottom.
		* Possible values: 
		*
		* - top
		* - bottom
		*
	
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Combo} [AutoWidth=False]
			
		* True to automatically calculate width from the tab content, false to use fixed width.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Combo} [AutoHeight=False]
			
		* True to automatically calculate height from the tab content, false to use fixed height.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Text} [Cls]
			
		* An optional extra CSS class that will be added to this control's element. This can be useful for adding customized styles to the component or any of its children using standard CSS rules.
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Text} [TabCls]
			
		* An optional extra CSS class that will be added to each tab's element. This can be useful for adding customized styles to each tab or any of its children using standard CSS rules.
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Combo} [Frame=False]
			
		* True to render the tab panel with custom rounded borders, false to render with plain 1px square borders.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Boolean} [Border=true]
			
		* True to display the borders of the panel's body element, false to hide them (defaults to true). By default, the border is a 2px wide inset border.
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Integer} [MinTabWidth=60]
			
		* The minimum width in pixels for each tab.
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Combo} [EnableTabScroll=True]
			
		* True to enable scrolling to tabs that may be invisible due to overflowing the overall TabPanel width. Only available with tabs on top.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Boolean} [HandleUniqueId=true]
			
		* True to automatically create a unique identifier for each tab. Set to false when handling tabs by id with any of the gxui.TabPanel methods.
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Text} [DesignTimeTabs]
			
		* @ignore
						* @private
					
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Text} [ClosedTabId]
			
		* Identifier of the last closed tab. This property is used to know which tab was closed in {@link #BeforeTabClosed} and {@link #TabClosed} events (Runtime)
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Text} [ActiveTabId]
			
		* Identifier of the currently selected tab. (Runtime)
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Boolean} [CancelEvent=false]
			
		* When a tab is closed the {@link #BeforeTabClosed} event is fired, before closing the tab. If this property is set to true in the {@link #BeforeTabClosed} event, the closing event is cancelled and the tab remains opened. (Runtime)
		* @member gxui.TabPanel
		*/
	
		/**
		
		* @property {Text} [Width=auto]
			
		* Control width in pixels. If auto is specified, the width is the sum of the width of the items.
		* @member gxui.Toolbar
		*/
	
		/**
		
		* @property {Text} [Height=auto]
			
		* Control height in pixels. If auto is specified, the height is the sum of the height of the items.
		* @member gxui.Toolbar
		*/
	
		/**
		
		* @property {gxuiToolbar} [Data]
			
		* 
								A variable based on gxuiToolbar SDT, with the toolbar definition.
								* @property {gxuiToolbarItem[]} Data.Buttons A collection containing the list of toolbar items to render.
								* @property {String} Data.Buttons.Id An identifier for the item. When a button is pressed, the {@link #ButtonPressedId} property is set with the identifier set here, so you will know which button was pressed when the {@link #ButtonPressed} event is fired.
								* @property {String} Data.Buttons.Text The text of the toolbar item. Applies to Button, Menu, SplitButton, Group, Edit (shown as placeholder) and Text.
								* @property {String} Data.Buttons.Tooltip A tooltip to show when the mouse hovers the item. Applies to Button, Menu and SplitButton.
								* @property {String} Data.Buttons.Icon The path to an image to display in the item icon. Applies to Button, Menu and SplitButton.
								* @property {String} Data.Buttons.IconCls A css class which sets a background image to be used as the icon for this toolbar item. Applies to Button, Menu and SplitButton.
								* @property {gxuiToolbarItemIconAlign} Data.Buttons.IconAlign The side of the Button box to render the icon. Four values are allowed:
								*
								* - Top
								* - Right
								* - Bottom
								* - Left
								*
								* Applies to Button, Menu and SplitButton.
								* @property {String} Data.Buttons.Cls A CSS class to apply to the item's main element
								* @property {Boolean} Data.Buttons.EnableToggle True to enable pressed/not pressed toggling. Applies to Button and SplitButton.
								* @property {Boolean} Data.Buttons.Pressed True to start pressed (only if EnableToggle = true). Applies to Button and SplitButton.
								* @property {Boolean} Data.Buttons.Disabled True to start disabled. Applies to Button, Edit, Menu and SplitButton.
								* @property {gxuiToolbarItemTypes} Data.Buttons.Type Defines the type of the item (defaults to Button). The available types are:
								*
								* - Button: A simple button. Customisations include aligned icons, tooltips and sizing options.
								* - Text: A text to be rendered inside the toolbar.
								* - Edit: An edit field. Its value can be retrieved through the {@link #EditFieldValue} property.
								* - ComboBox: A combo box. The items inside the combo box are set through the Items property, by setting the Id and Text properties of each child item. Its value can be retrieved through the {@link #EditFieldValue} property.
								* - Fill: A non-rendering placeholder item. When used, all items at its right side are right aligned.
								* - Separator: Adds a vertical separator bar between toolbar items. It can't be a direct child of a Group item.
								* - Menu: A button that opens a menu. The menu options are set through the Items property. An arrow is automatically added to the button.
								* You can change the alignment of the arrow using the ArrowAlign property.
								* - SplitButton: A split button that provides a built-in dropdown arrow used to display a dropdown menu that provides additional options to the primary button action.
								* - Group: A container for arranging a group of related Buttons in a tabular manner. The items inside the group are set through the Items property.
								* By setting RowSpan and ColSpan properties in child items, complex layouts can be accomplished within the table.
								* The basic concept of building a layout inside the group is conceptually very similar to building up a standard HTML table.
								* You simply add each item that you want to include along with any span attributes specified as the special config properties of RowSpan and ColSpan
								* which work exactly like their HTML counterparts. Rather than explicitly creating and nesting rows and columns as you would in HTML,
								* you simply specify the total column count in the GroupColumns property and start adding items in their natural order from left to right, top to bottom.
								* The layout will automatically figure out, based on the column count, rowspans and colspans, how to position each item within the table.
								* Just like with HTML tables, your rowspans and colspans must add up correctly in your overall layout or you'll end up with missing and/or extra items.
								* Example usage:
								*
								*         gxuiToolbar
								*         {
								*             Buttons
								*             {
								*                 Item
								*                 {
								*                     Text = 'File'
								*                     Type = gxuiToolbarItemTypes.Group
								*                     GroupColumns = 3
								*                     Items
								*                     {
								*                         Item
								*                         {
								*                             Id = !'New'
								*                             Text = 'New'
								*                             Type = gxuiToolbarItemTypes.Button
								*                             Scale = gxuiToolbarItemScale.Large
								*                             RowSpan = 3
								*                         }
								*                         Item
								*                         {
								*                             Id = !'Open'
								*                             Text = 'Open'
								*                             Type = gxuiToolbarItemTypes.Button
								*                             Scale = gxuiToolbarItemScale.Large
								*                             RowSpan = 3
								*                         }
								*                         Item
								*                         {
								*                             Id = !'Close'
								*                             Text = 'Close'
								*                             Type = gxuiToolbarItemTypes.Button
								*                         }
								*                         Item
								*                         {
								*                             Id = !'CloseKB'
								*                             Text = 'Close KB'
								*                             Type = gxuiToolbarItemTypes.Button
								*                         }
								*                         {
								*                             Id = !'Exit'
								*                             Text = 'Exit'
								*                             Type = gxuiToolbarItemTypes.Button
								*                         }
								*                     }
								*                 }
								*             }
								*         }
								*
								* @property {Boolean} Data.Buttons.Hidden True to start hidden.
								* @property {Number} Data.Buttons.GroupColumns Groups show toolbar items in a tabular manner. The total number of columns to create in the table is set through this property. If not specified it will be rendered into a single row using one column per item. Applies only to Group.
								* @property {gxuiToolbarItemScale} Data.Buttons.Scale The size of the Button. Three values are allowed:
								*
								* - Small - Results in the button element being 16px high.
								* - Medium - Results in the button element being 24px high.
								* - Large - Results in the button element being 32px high.
								*
								* Applies to Button, Menu and SplitButton.
								* @property {gxuiToolbarItemArrowAlign} Data.Buttons.ArrowAlign The side of the button box to render the arrow if the button has an associated menu. Two values are allowed:
								*
								* - Right
								* - Bottom
								*
								* Applies to Menu and SplitButton.
								* @property {Number} Data.Buttons.RowSpan Number of rows the item will span. Only applies to items that are direct children of a Group item.
								* See the documentation about the Group item type for detailed information.
								* @property {Number} Data.Buttons.ColSpan Number of columns the item will span. Only applies to items that are direct children of a Group item.
								* See the documentation about the Group item type for detailed information.
								* @property {String} Data.Buttons.Value Initial value for Edit items.
								* @property {String} Data.Buttons.Width Item width in pixels.
								* @property {Boolean} Data.Buttons.AskConfirmation Indicates if the user should be prompted for confirmation when a button is pressed, before executing the {@link #ButtonPressed} event. If the user confirms, the event is executed.
								* @property {gxuiToolbarItem.Confirmation} Data.Buttons.Confirmation Configuration properties for the confirmation dialog.
								* @property {String} Data.Buttons.Confirmation.OKButtonText Text for the OK button (defaults to 'OK')
								* @property {String} Data.Buttons.Confirmation.CancelButtonText Text for the Cancel button (defaults to 'Cancel').
								* @property {String} Data.Buttons.Confirmation.Message (required) Text for the dialog message.
								* @property {String} Data.Buttons.Confirmation.Title Text for the dialog title.
								* @property {gxuiToolbarItem[]} Data.Buttons.Items Collection of children items of the button. Applies to Menu, SplitButton and Group.
							
		* @member gxui.Toolbar
		*/
	
		/**
		
		* @property {Text} [ButtonPressedId]
			
		* The identifier of the button that was pressed. This property is useful when the {@link #ButtonPressed} event is fired. (Runtime)
		* @member gxui.Toolbar
		*/
	
		/**
		
		* @property {Text} [EditFieldValue]
			
		* The value of the edit field that was lost focus or where the Enter key was pressed. (Runtime)
		* @member gxui.Toolbar
		*/
	
		/**
		
		* @property {Integer} [Width=100]
			
		* Control width.
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Integer} [Height=100]
			
		* Control height.
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Boolean} [AddToParentGxUIControl=true]
			
		* 
						True to add the control to its parent GxUI control (if it's contained inside one). This property is useful when the control
						* is contained inside a {@link gxui.Panel Panel}, {@link gxui.TabPanel TabPanel} or {@link gxui.Layout Layout} control and you want its dimensions to be
						* controlled from the parent control.
						* Bear in mind that if there are other controls between the control and its parent (for example, a Table or Group), in runtime the parent control will move
						* the control out of the controls in the middle, to make it its direct descendant. The controls in the middle will be ignored.
					
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Boolean} [Multiselection=false]
			
		* True to enable multiselection of tree nodes.
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Boolean} [Editable=false]
			
		* True to enable node text editing. When a node's text is changed, the NodeEdit event is raised.
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Boolean} [EnableCheckbox=false]
			
		* True to enable the rendering of a checked checkbox for the nodes of the tree (defaults to false).
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {} [CheckedNodes]
			
		* A variable where the ids of the checked nodes are stored. The variable must be a collection of Character.
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {} [UncheckedNodes]
			
		* A variable where the ids of the unchecked nodes are stored. The variable must be a collection of Character.
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [Title]
			
		* The title text to display in the panel header.
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [IconCls]
			
		* A CSS class that will provide a background image to be used as the panel header icon.
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [Cls]
			
		* An optional extra CSS class that will be added to this control's element. This can be useful for adding customized styles to the component or any of its children using standard CSS rules.
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Combo} [Frame=False]
			
		* True to render the panel with custom rounded borders, false to render with plain 1px square borders.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Combo} [Border=True]
			
		* True to display the borders of the panel's body element, false to hide them (defaults to true).
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Combo} [AutoScroll=True]
			
		* True to show scroll bars automatically when necessary, false to clip any overflowing content (defaults to false).
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Combo} [Animate=True]
			
		* True to enable animated expand/collapse.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Combo} [ExpandAll=False]
			
		* True to show the tree with all the nodes initially expanded.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Combo} [ShowLines=True]
			
		* False to disable tree lines.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Combo} [Sort=False]
			
		* True to sort the nodes.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [RootId=ROOT]
			
		* Root node identifier. If an identifier is not specified, one is generated.
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Combo} [RootVisible=True]
			
		* False to hide the root node.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [RootText]
			
		* Text for the root node.
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [RootIcon]
			
		* The path to an icon for the node. The preferred way to do this is to use the cls or iconCls attributes (here a CSS class defined in the Theme can be specified) and add the icon via a CSS background image.
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [RootCls]
			
		* A CSS class to be added to the root node (here a CSS class defined in the Theme can be specified).
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [RootIconCls]
			
		* A CSS class to be added to the root node icon element for applying CSS background images (here a CSS class defined in the Theme can be specified).
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Combo} [ExpandRoot=True]
			
		* True to show the tree with the root node expanded.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Combo} [EnableDragDrop=False]
			
		* True to enable drag and drop of nodes.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [DragDropGroup]
			
		* A named drag drop group to which this object belongs. If a group is specified, then this object will only interact with other drag drop objects in the same group (defaults to undefined).
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Combo} [AppendOnly=True]
			
		* True if the tree should only allow append drops (use for trees which are sorted).
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {} [DropData]
			
		* The variable (must be a SDT) where data from a row dropped from a grid will be available. The fields of the dragged row are mapped to the fields of the SDT by name.
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Combo} [DisableBranchEvents=False]
			
		* True to disable click events for branch (node with children) nodes.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Combo} [NotifyContext=False]
			 
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [NotifyDataType=gxuiTreeviewNode]
			 
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Combo} [LazyLoading=False]
			
		* True to load the nodes through the URL specified in {@link #LoaderURL}, false to load the nodes from the SDT variable specified in {@link #Children} property.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [LoaderURL=TreeLoader]
			
		* The URL where the nodes will be retrieved. The data must be a collection of gxuiTreeviewNode SDT, in Json format (check gxuiTreeviewSampleLoader procedure for a sample).
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {gxuiTreeviewNode} [Children]
			
		* 
								The variable where the tree nodes are stored. The nodes can also be lazy loaded from a URL, through the {@link #LoaderURL} property.
								* This property supports a single node or a collection of nodes.
								* @property {String} Children.id Identifier of the node. When an event is fired on a node, the value of this property is used to identify
								* the node (for example, when the {@link #Click} event is fired, the {@link #SelectedNode} property is set with the node identifier.
								* @property {String} Children.text The text to show on node label.
								* @property {String} Children.cls CSS class to apply for this node.
								* @property {String} Children.icon URL for this node's icon.
								* @property {String} Children.iconCls CSS class to apply for this node's icon.
								* @property {String} Children.qtip Tooltip text to show on this node.
								* @property {Boolean} Children.leaf Set to true to indicate that this child can have no children. The expand icon/arrow will then not be rendered for this node.
								* @property {Boolean} Children.checked Value of the node checkbox. Only applies when {@link #EnableCheckbox} = true.
								* @property {String} Children.href An URL for a link that's created when this config is specified.
								* @property {gxuiTreeviewNode[]} Children.children Collection of child nodes.
								* @property {Object} [Children.data] An SDT with data associated to the node.
								*
								* Other properties, for advanced uses, are supported. Take a look at {@link Ext.data.NodeInterface} config options, for a complete list.
							
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {} [SelectedNodeData]
			
		* The variable where the data associated to the selected node is stored (gxuiTreeviewNode.data property of the selected node).
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {gxuiTreeviewNode} [SelectedNodes]
			
		* The variable where the selected node's identifiers are stored (applies when {@link #Multiselection} = True).
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Combo} [Stateful=True]
			
		* A flag which causes the Component to attempt to restore the state of internal properties from a saved state on startup.
		* Possible values: 
		*
		* - True
		* - False
		*
	
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [StateId]
			
		* The unique id for this component to use for state management purposes.
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [SelectedNode]
			
		* Id of the selected node. (Runtime)
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [SelectedText]
			
		* Text of the selected node. (Runtime)
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [SelectedIcon]
			
		* Icon of the selected node. (Runtime)
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Boolean} [SelectedNodeChecked=false]
			
		* Indicates if the selected node is checked (when {@link #EnableCheckBox} = True) (Runtime)
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [DropTarget]
			
		* Id of the node targeted for a drop. (Runtime)
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [DropNode]
			
		* Id of the dropped node. (Runtime)
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [DropPoint]
			
		* The point of the drop - append, above or below. (Runtime)
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Text} [NodeEditText]
			
		* The node text after it was edited. (Runtime)
		* @member gxui.Treeview
		*/
	
		/**
		
		* @property {Boolean} [DropAllowed=true]
			
		* Indicates if dropping a node ({@link #DropNode}) is allowed over the current node ({@link #DropTarget}). Should be set to true or false in the {@link #NodeOver} event. (Runtime)
		* @member gxui.Treeview
		*/
	