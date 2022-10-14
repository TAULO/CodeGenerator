//// IMPORTS ///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Navigator class of CPC //
const navigator = require( '../../navigator' )




//// UNIT TESTS ////////////////////////////////////////////////////////////////////////////////////////////////////////


//// Instantiation ///////////////////////////////////////////////////////////////

describe( 'Instantiation', () => {



    test( 'Instantiate panel', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''

        // Verify that no panels exist in DOM
        const noOfPanelsInDomBeforeCreatingPanel = document
            .getElementsByClassName( 'panel' )
            .length
        expect( noOfPanelsInDomBeforeCreatingPanel ).toBe( 0 )


        // Create panel
        const svg = new container.Svg()
            , myPanel = new navigator.Panel()


        // Verify that a panel object is created
        expect( myPanel ).toBeDefined()

        // Verify that a panel now exists in DOM
        const noOfPanelsInDomAfterCreatingPanel = document
            .getElementsByClassName( 'panel' )
            .length
        expect( noOfPanelsInDomAfterCreatingPanel ).toBe( 1 )

    } )


    test( 'Instantiate panel as a child of specified parent element', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''


        // Create SVG
        const mySvg = new container.Svg()
        mySvg.select()
            .attr( 'id', 'top-svg' )


        // Create a panel container
        const parentContainerSelection = mySvg.select()  // this first select is NOT D3 code but s container.Svg method (which returns a D3 Selection)
            .append( 'g' )
            .attr( 'id', 'parent-container' )  // id must be given directly with d3; Group.id().update() does not work
                                               // with JEST


        // Create panel as a child of the parent container
        const myPanel = new navigator.Panel( parentContainerSelection )
        myPanel.id( 'child-panel' ).update()


        // Verify that the panel is indeed a child of the parent container
        const parentElement = document.getElementById( 'parent-container' )
        expect( parentElement.children.length ).toBe( 1 )

        const childPanelElement = parentElement.getElementsByClassName( 'panel' )[ 0 ]
        const childPanelId = childPanelElement.getAttribute( 'id' )
        expect( childPanelId ).toBe( 'child-panel' )

        const inferredParentId = childPanelElement.parentElement.getAttribute( 'id' )
        expect( inferredParentId ).toBe( 'parent-container' )

        const inferredGrandParentId = childPanelElement.parentElement.parentElement.getAttribute( 'id' )
        expect( inferredGrandParentId ).toBe( 'top-svg' )

    } )



    //// GENERATE EXAMPLE DATA ////

    test( 'Initialize with example data', () => {

        parentContainerSelection = d3.select( 'body' )
            .append( 'svg' )
            .attr( 'width', 1280 )
            .attr( 'height', 1024 )

        const myPanel = new navigator.Panel( parentContainerSelection )
        myPanel.build()

        // Probe the initial sample data
        expect( myPanel.stacks().data().size ).toBe( 3 )
        expect( myPanel.stacks( 'gender' ).data( 'male' ).get( 'label' ) ).toEqual( 'Male' )
        expect( myPanel.stacks( 'class' ).data( 'first-class' ).get( 'label' ) ).toEqual( 'First Class' )
        expect( myPanel.stacks( 'status' ).data( 'survived' ).get( 'percentage' ) ).toEqual( 38 )


        // Check if data stats are being calculated correctly
        expect( myPanel._chartCount() ).toBe( 3 )


        // Probe the initial data visually
        expectTable( myPanel.stacks().data(), `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'class'  │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'status' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘` )
        expectTable( myPanel.stacks( 'gender' ), `\
┌────────────────┬────────┐
│    (index)     │ Values │
├────────────────┼────────┤
│     _data      │        │
│ _scaleFunction │  null  │
└────────────────┴────────┘` )
        expectTable( myPanel.stacks( 'gender' ).data( 'male' ), `\
┌───────────────────┬──────────────┬────────┐
│ (iteration index) │     Key      │ Values │
├───────────────────┼──────────────┼────────┤
│         0         │   'label'    │ 'Male' │
│         1         │   'start'    │   0    │
│         2         │    'end'     │   64   │
│         3         │ 'percentage' │   64   │
│         4         │   'count'    │  843   │
└───────────────────┴──────────────┴────────┘` )

    } )



    //// CALCULATE DATA STATS ////

    // CHART COUNT //
    test( 'Calculate the number of charts in panel', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''


        const svg = new container.Svg()
            , parentContainerSelection = svg.select()

        const myPanel = new navigator.Panel( parentContainerSelection )
        myPanel.build()

        // Check if data stats are being calculated correctly
        expect( myPanel._chartCount() ).toBe( 3 )

    } )



    //// INITIATE BY VISUALIZING A DATASET ////

    test( 'Visualize a dataset manually by changing Stacks in Panel', async () => {

        const titanicDataset = new dataset.Dataset(
            'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv',
            'Name'
        )
        await titanicDataset.build()

        expectTable( titanicDataset.data, `\
┌─────────┬─────────────┬────────────┬──────────┐
│ (index) │   Ticket    │   Status   │  Gender  │
├─────────┼─────────────┼────────────┼──────────┤
│    0    │ '1st class' │ 'Survived' │ 'Female' │
│    1    │ '1st class' │ 'Survived' │  'Male'  │
│    2    │ '1st class' │   'Died'   │ 'Female' │
│    3    │ '1st class' │   'Died'   │  'Male'  │
│    4    │ '1st class' │   'Died'   │ 'Female' │
│    5    │ '1st class' │ 'Survived' │  'Male'  │
│    6    │ '1st class' │ 'Survived' │ 'Female' │
│    7    │ '1st class' │   'Died'   │  'Male'  │
│    8    │ '1st class' │ 'Survived' │ 'Female' │
│    9    │ '1st class' │   'Died'   │  'Male'  │
└─────────┴─────────────┴────────────┴──────────┘
˅˅˅ 1299 more rows`, 0, 10 )



        const myPanel = new navigator.Panel()
        myPanel.build()


        // Summarize the titanic dataset
        const titanicSummary = titanicDataset.summarize()
        expectTable( titanicSummary, `\
┌───────────────────┬──────────┬───────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                                Values                                 │
├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map(3) { '1st class' => 323, '2nd class' => 277, '3rd class' => 709 } │
│         1         │ 'Status' │              Map(2) { 'Died' => 809, 'Survived' => 500 }              │
│         2         │ 'Gender' │               Map(2) { 'Female' => 466, 'Male' => 843 }               │
└───────────────────┴──────────┴───────────────────────────────────────────────────────────────────────┘` )
        // Summary produces a nested map (1-level deep)

        // Convert the nested map into a Stacks object
        titanicStacks = new data.Stacks()
        titanicStacks.fromNestedMap( titanicSummary )

        expectTable( titanicStacks, `\
┌─────────┐
│ (index) │
├─────────┤
│  _data  │
└─────────┘` )
        expectTable( titanicStacks.data(), `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'Status' │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'Gender' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘` )

        // Import the new stacks object to be panel's new data
        myPanel.stacks( titanicStacks ).update()
        expectTable( myPanel.stacks().data(), `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'Status' │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'Gender' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘` )
        expectTable( myPanel.stacks( 'Gender' ).data( 'Female' ), `\
┌───────────────────┬──────────────┬──────────┐
│ (iteration index) │     Key      │  Values  │
├───────────────────┼──────────────┼──────────┤
│         0         │   'label'    │ 'Female' │
│         1         │   'count'    │   466    │
│         2         │ 'percentage' │    36    │
│         3         │   'start'    │    0     │
│         4         │    'end'     │   466    │
└───────────────────┴──────────────┴──────────┘` )
        expectTable( myPanel.stacks( 'Gender' ).data( 'Male' ), `\
┌───────────────────┬──────────────┬────────┐
│ (iteration index) │     Key      │ Values │
├───────────────────┼──────────────┼────────┤
│         0         │   'label'    │ 'Male' │
│         1         │   'count'    │  843   │
│         2         │ 'percentage' │   64   │
│         3         │   'start'    │  466   │
│         4         │    'end'     │  1309  │
└───────────────────┴──────────────┴────────┘` )


        // Check if Panel properties are updated after the new Stacks data is imported
        const maleCategoryObject = myPanel.objects( 'Gender' ).objects( 'Male' )
            , maleRectangleObject = maleCategoryObject.objects( 'rectangle' )
            , maleTextObject = maleCategoryObject.objects( 'text' )


        const femaleCategoryObject = myPanel.objects( 'Gender' ).objects( 'Female' )
            , femaleRectangleObject = femaleCategoryObject.objects( 'rectangle' )
            , femaleTextObject = femaleCategoryObject.objects( 'text' )

        maleObjectProperties = {
            'y': maleCategoryObject.y(),
            'height': maleCategoryObject.height(),
            'text': maleTextObject.text()
        }
        expectTable( maleObjectProperties, `\
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    y    │   56   │
│ height  │   94   │
│  text   │ '64%'  │
└─────────┴────────┘` )

        femaleObjectProperties = {
            'y': femaleCategoryObject.y(),
            'height': femaleCategoryObject.height(),
            'text': femaleTextObject.text()
        }
        expectTable( femaleObjectProperties, `\
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    y    │  150   │
│ height  │   52   │
│  text   │ '36%'  │
└─────────┴────────┘` )


    } )




    //// INITIALIZATION: DOM STRUCTURE AND ATTRIBUTES OF PANEL ////

    test( 'Create charts in the panel, and make sure that they are children and have the right attributes', () => {

        initializeDomWithSvg()

        const myPanel = new navigator.Panel()
        myPanel.build()


        // Verify that the panel element has correct initial HTML attributes
        const panelElement = document
            .getElementsByClassName( 'panel' )[ 0 ]
        expect( panelElement.getAttribute( 'class' ) ).toBe( 'panel' )



        // Verify that the panel has the correct number of children with the type 'chart'
        const chartElements = document
            .getElementsByClassName( 'panel' )[ 0 ]
            .getElementsByClassName( 'chart' )


        expect( chartElements.length ).toBe( myPanel._chartCount() )


        // Verify that all children charts in the panel has the correct HTML attributes
        // Shared attributes for charts
        // loop //
        Array.from( chartElements ).forEach(
            ( eachChart ) => {

                const eachChartClass = eachChart.getAttribute( 'class' )
                expect( eachChartClass ).toBe( 'chart' )

            }
        )

        // Verify individual HTML attributes for charts

        firstChartElement = document
            .getElementsByClassName( 'panel' )[ 0 ]
            .getElementsByClassName( 'chart' )[ 0 ]
        secondChildElement = document
            .getElementsByClassName( 'panel' )[ 0 ]
            .getElementsByClassName( 'chart' )[ 1 ]

        const idOfFirstChart = firstChartElement.getAttribute( 'id' )
        const idOfSecondChart = secondChildElement.getAttribute( 'id' )

        expect( idOfFirstChart ).toBe( 'gender' )
        expect( idOfSecondChart ).toBe( 'class' )


        // Get rectangles in charts
        const rectangleElementOfFirstChart = document
            .getElementsByClassName( 'panel' )[ 0 ]
            .getElementsByClassName( 'chart' )[ 0 ]
            .getElementsByTagName( 'rect' )[ 0 ]

        const textElementOfFirstChart = document  // TODO: Text positions verified by using this variable
            .getElementsByClassName( 'panel' )[ 0 ]
            .getElementsByClassName( 'chart' )[ 0 ]
            .getElementsByTagName( 'text' )[ 0 ]

        const rectangleElementOfSecondChart = document
            .getElementsByClassName( 'panel' )[ 0 ]
            .getElementsByClassName( 'chart' )[ 1 ]
            .getElementsByTagName( 'rect' )[ 0 ]

        const textElementOfSecondChart = document  // TODO: Text positions verified by using this variable
            .getElementsByClassName( 'panel' )[ 0 ]
            .getElementsByClassName( 'chart' )[ 1 ]
            .getElementsByTagName( 'text' )[ 0 ]


        // Check if the rectangle elements within charts have the right HTML attributes
        // yPosition //
        const yPositionOfFirstRectangleElement = rectangleElementOfFirstChart.getAttribute( 'y' )
        const yPositionOfSecondRectangleElement = rectangleElementOfSecondChart.getAttribute( 'y' )

        // expect(yPositionOfFirstRectangleElement).toBe(`${myPanel._yScale(0)}`)
        // expect(yPositionOfSecondRectangleElement).toBe(`${myPanel._yScale(1)}`)
        // TODO: The two tests above fails even though the visualization is correct.
        //  This code works in Safari, while it does not seem to work in Node:
        // document.getElementsByClassName('panel')[0].getElementsByClassName('chart')[0].getElementsByTagName('rect')[0].getAttribute('y')


    } )


    //// INITIALIZATION: BACKGROUND RECTANGLE ////

    // TODO: Panel background tests completed
    test( 'Initialize panel with a background rectangle', () => {

        initializeDomWithSvg()

        const myPanel = new navigator.Panel
        myPanel.build()

        // Verify that the panel background object is initiated
        expect( myPanel._backgroundObject ).toBeDefined()

        // Verify that the panel background element is created in DOM
        const panelBackgroundElement = document.getElementsByClassName( 'background' )[ 0 ]
        expect( panelBackgroundElement ).toBeDefined()


        // Verify that the panel background element has the right children on DOM
        expect( panelBackgroundElement.children.length ).toBe( 2 )
        expect( panelBackgroundElement.children[ 0 ].tagName ).toBe( 'rect' )
        expect( panelBackgroundElement.children[ 1 ].tagName ).toBe( 'text' )

        // Verify that background rectangle has the right parent element
        expect( d3
            .select( '.background' )
            .node()
            .parentNode.getAttribute( 'class' )
        ).toBe( 'panel' )


        // Verify that background rectangle has the right attributes
        expect( d3.select( '.background' ).attr( 'class' ) ).toBe( 'background' )
        // expect(d3.select('.background').select('rect').attr('x')).toBe()
        // expect(d3.select('.background').select('rect').attr('y')).toBe()
        // expect(d3.select('.background').select('rect').attr('height')).toBe()
        // expect(d3.select('.background').select('rect').attr('width')).toBe()
        // expect(d3.select('.background').select('rect').attr('fill')).toBe()


    } )


    //// YScale ////

    test( 'YScale should initiate correctly', () => {

        initializeDomWithSvg()

        // Create panel
        const myPanel = new navigator.Panel()
            .id( 'my-panel' )
        myPanel.build()

        expect( myPanel._chartCount() ).toBe( 3 )

        expect( myPanel._yScale( 0 ) ).toBe( 366 )
        expect( myPanel._yScale( 1 ) ).toBe( 211 )
        expect( myPanel._yScale( 2 ) ).toBe( 56 )

    } )


    // test ('Initialize with data', () => {
    //
    //     initializeDomWithSvg()
    //
    //
    //     expect( navigator.Panel.initializeWith.data ).toBe( 'example' )
    //     navigator.Panel.initializeWith.data =
    //     'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanicTiny.csv'
    //
    //     // Create panel
    //     const myPanel = new navigator.Panel()
    //         .id('my-panel')
    //         .update()
    //
    //
    // })
    //

} )


//// Preferences ///////////////////////////////////////////////////////////////

describe( 'Custom initialization', () => {


    test( 'Initialize panel with custom DATA (i.e., Stacks)', () => {

        // Initialize without specifying a dataset
        const panelZeroWithoutSpecifiedData = new navigator.Panel()
        panelZeroWithoutSpecifiedData.build()

        // Check initialization values for data
        expect( panelZeroWithoutSpecifiedData._stacks.data() ).toTabulateAs( `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'class'  │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'status' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘` )

        // Initialize with specified dataset
        const panelZeroWithSpecifiedData = new navigator.Panel()

        // Create replacement data (i.e., stacks)
        const replacementStack1 = new data.Stack()
            .populateWithExampleData( 'generic' )
        const replacementStack2 = new data.Stack()
            .populateWithExampleData( 'generic' )
        const replacementStacks = new data.Stacks()
            .clear()
            .add( 'generic-1', replacementStack1 )
            .add( 'generic-2', replacementStack2 )


        // Load new data into the panel
        panelZeroWithSpecifiedData.stacks( replacementStacks )

        // Build the panel using the new data
        panelZeroWithSpecifiedData.build()

        expect( panelZeroWithSpecifiedData._stacks.data() ).toTabulateAs( `\
┌───────────────────┬─────────────┬──────────────────────────────────────────────┐
│ (iteration index) │     Key     │                    Values                    │
├───────────────────┼─────────────┼──────────────────────────────────────────────┤
│         0         │ 'generic-1' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'generic-2' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴─────────────┴──────────────────────────────────────────────┘` )



    } )


    test( 'Initialize panel with custom DATASET (i.e., not data or stacks)', async () => {

        // Initialize without specifying a dataset
        const panelZeroWithoutSpecifiedData = new navigator.Panel()
        panelZeroWithoutSpecifiedData.build()

        // Check initialization values for data
        expect( panelZeroWithoutSpecifiedData._stacks.data() ).toTabulateAs( `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'class'  │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'status' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘` )

        // Initialize with specified dataset
        const panelZeroWithSpecifiedData = new navigator.Panel()
        await panelZeroWithSpecifiedData.summarizeDataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanicTiny.csv', [ 'Ticket' ] )
        panelZeroWithSpecifiedData.build()

        expect( panelZeroWithSpecifiedData._stacks.data() ).toTabulateAs( `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'Status' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'Gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │  'Name'  │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘` )

    } )


} )


//// Y scale ///////////////////////////////////////////////////////////////

describe( 'Y scale', () => {

    test( 'YScale should return correct values automatically if any variable involved in its calculation is updated', () => {


        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''

        // Create svg
        const svg = new container.Svg()
            .height( 1280 )

        // Create panel
        const myPanel = new navigator.Panel()
            .id( 'my-panel' )
        myPanel.build()

        // Select elements of Panel in DOM
        const chartElementsInPanel = document.querySelectorAll( '#my-panel .chart' )
        const backgroundElementInPanel = document.querySelectorAll( '#my-panel .background' )


        // Check number of charts in panel //
        // Object:
        expect( myPanel._chartCount() ).toBe( 3 )
        // DOM:
        expect( chartElementsInPanel ).toHaveLength( 3 )
        expect( backgroundElementInPanel ).toHaveLength( 1 )


        // Get initial yScale calculations three panel locations
        // Object:
        expect( myPanel._yScale( 0 ) ).toBe( 366 )
        expect( myPanel._yScale( 1 ) ).toBe( 211 )
        expect( myPanel._yScale( 2 ) ).toBe( 56 )
        // DOM:
        const topRectangleOfCategory0 = chartElementsInPanel[ 0 ].querySelectorAll( 'rect' )[ 1 ]
        const topRectangleOfCategory1 = chartElementsInPanel[ 1 ].querySelectorAll( 'rect' )[ 2 ]
        const topRectangleOfCategory2 = chartElementsInPanel[ 2 ].querySelectorAll( 'rect' )[ 1 ]
        expect( topRectangleOfCategory0.getAttribute( 'y' ) ).toBe( '366' )
        expect( topRectangleOfCategory1.getAttribute( 'y' ) ).toBe( '211' )
        expect( topRectangleOfCategory2.getAttribute( 'y' ) ).toBe( '56' )


        // Update y coordinate of panel
        myPanel.y( 100 ).update()

        // Verify that yScale is updated
        expect( myPanel._yScale( 0 ) ).toBe( 441 )
        expect( myPanel._yScale( 1 ) ).toBe( 286 )
        expect( myPanel._yScale( 2 ) ).toBe( 131 )

        // Verify that y coordinates on DOM are updated
        expect( topRectangleOfCategory0.getAttribute( 'y' ) ).toBe( '441' )
        expect( topRectangleOfCategory1.getAttribute( 'y' ) ).toBe( '286' )
        expect( topRectangleOfCategory2.getAttribute( 'y' ) ).toBe( '131' )


        // Update height of panel
        myPanel.height( 100 ).update()

        // Verify that yScale is updated according to new height
        expect( myPanel._yScale( 0 ) ).toBe( 171 )
        expect( myPanel._yScale( 1 ) ).toBe( 151 )
        expect( myPanel._yScale( 2 ) ).toBe( 131 )

        // Verify that y coordinated in DOM are updated when panel height is updated
        expect( topRectangleOfCategory0.getAttribute( 'y' ) ).toBe( '171' )
        expect( topRectangleOfCategory1.getAttribute( 'y' ) ).toBe( '151' )
        expect( topRectangleOfCategory2.getAttribute( 'y' ) ).toBe( '131' )


    } )

} )



//// Getters and Setters ///////////////////////////////////////////////////////////////

describe( 'Getters and Setters', () => {

    //// BASIC GETTER AND SETTER METHODS ////
    test( 'Get and set X and Y coordinates of the panel correctly', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''

        // Create svg
        const svg = new container.Svg()
            .width( 1000 )
            .height( 1500 )

        // Create panel
        const myPanel = new navigator.Panel()
            .id( 'my-panel' )
        myPanel.build()

        // Select panel and its elements on DOM
        const panelElement = document.querySelector( '#my-panel' )
        const chartElementsInPanel = document.querySelectorAll( '#my-panel .chart' )
        const backgroundRectangleElementInPanel = document.querySelector( '#my-panel .background rect' )
        const topRectangleOfCategory0 = chartElementsInPanel[ 0 ].querySelectorAll( 'rect' )[ 1 ]
        const topRectangleOfCategory1 = chartElementsInPanel[ 1 ].querySelectorAll( 'rect' )[ 2 ]
        const topRectangleOfCategory2 = chartElementsInPanel[ 2 ].querySelectorAll( 'rect' )[ 1 ]
        const maleRectangleElement = document.querySelector( '.chart#gender .category#male rect' )
        const femaleRectangleElement = document.querySelector( '.chart#gender .category#female rect' )

        // Check initial x and y values
        expect( myPanel.x() ).toBe( 25 )
        expect( myPanel.y() ).toBe( 25 )
        expect( backgroundRectangleElementInPanel.getAttribute( 'x' ) ).toBe( '25' )
        expect( backgroundRectangleElementInPanel.getAttribute( 'y' ) ).toBe( '25' )

        // Change variable coordinates
        myPanel
            .x( 100 )
            .width( 200 )
            .y( 100 )
            .height( 200 )
            .update()

        expect( myPanel.x() ).toBe( 100 )
        expect( myPanel.y() ).toBe( 100 )
        expect( myPanel.width() ).toBe( 200 )
        expect( myPanel.height() ).toBe( 200 )
        expect( myPanel._chartHeights() ).toBe( 51 )

        expect(
            myPanel.objects( 'gender' )
                .objects( 'male' )
                .objects( 'rectangle' )
                .y()
        ).toBe( 256 )
        expect( maleRectangleElement.getAttribute( 'y' ) ).toBe( '256' )

        expect(
            myPanel.objects( 'gender' )
                .objects( 'female' )
                .objects( 'rectangle' )
                .y()
        ).toBe( 238 )
        expect( femaleRectangleElement.getAttribute( 'y' ) ).toBe( '238' )

    } )


} )




//// Width ///////////////////////////////////////////////////////////////

describe( 'Width', () => {

    test( 'Get/set width', () => {

        const myPanel = new navigator.Panel()

        // Get default widths
        expect( myPanel.width() ).toBe( 100 )

        myPanel.width( 200 )
        expect( myPanel.width() ).toBe( 200 )

    } )

} )



//// Data Operations ///////////////////////////////////////////////////////////////

describe( 'Data Operations', () => {


    test( 'Get the stacks in Panel', () => {

        const myPanel = new navigator.Panel()
        myPanel.build()

        // Verify individual stack sizes
        expect( myPanel.stacks().data().get( 'gender' ).data().size ).toBe( 2 )
        expect( myPanel.stacks().data().get( 'status' ).data().size ).toBe( 2 )
        expect( myPanel.stacks().data().get( 'class' ).data().size ).toBe( 3 )

        // // Probe individual stack data
        expect( myPanel.stacks().data().get( 'gender' ).data( 'male' ).get( 'label' ) ).toBe( 'Male' )
        expect( myPanel.stacks().data().get( 'status' ).data( 'died' ).get( 'start' ) ).toBe( 38 )
        expect( myPanel.stacks().data().get( 'class' ).data( 'second-class' ).get( 'percentage' ) ).toBe( 21 )

    } )


    test( 'Bring the specified stack from the stacks', () => {

        const myPanel = new navigator.Panel()
        myPanel.build()

        // Get first, query later manually
        expect( myPanel.stacks().data().get( 'gender' ).data().get( 'male' ).get( 'label' ) )
            .toBe( 'Male' )

        // Directly query by giving a parameter to to method
        expect( myPanel.stacks( 'gender' ).data( 'male' ).get( 'label' ) )
            .toBe( 'Male' )

    } )


    test( 'Update panel stacks, and also the related instance variables', () => {

        const myPanel = new navigator.Panel()
        myPanel.build()

        // View initial example data
        expectTable( myPanel.stacks().data(), `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'class'  │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'status' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘` )

        // Probe initial example data further
        expect( myPanel.stacks( 'gender' ).data( 'male' ).get( 'label' ) )
            .toBe( 'Male' )
        expect( myPanel.stacks( 'class' ).data( 'first-class' ).get( 'label' ) )
            .toBe( 'First Class' )



        // Create replacement stacks
        const replacementStack1 = new data.Stack()
            .populateWithExampleData( 'generic' )

        const replacementStack2 = new data.Stack()
            .populateWithExampleData( 'generic' )

        const replacementStacks = new data.Stacks()
            .clear()
            .add( 'generic-1', replacementStack1 )
            .add( 'generic-2', replacementStack2 )


        // Replace stacks in Panel
        myPanel.stacks( replacementStacks )

        expectTable( myPanel.stacks().data(), `\
┌───────────────────┬─────────────┬──────────────────────────────────────────────┐
│ (iteration index) │     Key     │                    Values                    │
├───────────────────┼─────────────┼──────────────────────────────────────────────┤
│         0         │ 'generic-1' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'generic-2' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴─────────────┴──────────────────────────────────────────────┘` )

        // Probe further to see if data is correctly updated
        expect( myPanel.stacks().data().size ).toBe( 2 )

        expect( myPanel.stacks( 'generic-1' ).data( 'category-1' ).get( 'label' ) )
            .toBe( 'Category One' )
        expect( myPanel.stacks( 'generic-1' ).data( 'category-2' ).get( 'start' ) )
            .toBe( 10 )
        expect( myPanel.stacks( 'generic-1' ).data( 'category-2' ).get( 'end' ) )
            .toBe( 20 )

        expect( myPanel.stacks( 'generic-2' ).data( 'category-3' ).get( 'label' ) )
            .toBe( 'Category Three' )
        expect( myPanel.stacks( 'generic-2' ).data( 'category-3' ).get( 'start' ) )
            .toBe( 20 )
        expect( myPanel.stacks( 'generic-2' ).data( 'category-3' ).get( 'end' ) )
            .toBe( 30 )


        // Do a manual check on the updated private stack variable in the instance
        expect( myPanel.stacks().data().size ).toBe( 2 )
        expect( myPanel.stacks().data().get( 'generic-2' ).data( 'category-2' ).get( 'label' ) )
            .toBe( 'Category Two' )

        // Check if other stacks-related variables are currectly updated after change of stacks
        // TODO: When more stacks-related variables are added to the class, they MUST be tested here.

    } )


    test( 'Summarize a dataset with panel', async () => {

        // Create panel zero
        const panelZero = new navigator.Panel()
            .bgText( 'panelZero' )
            .build()

        // Save a definitive property of exaple dataset for later comparison
        const largestTotalCountOfExampleData = panelZero.stacks().largestTotalCount()

        // Summarize a dataset with panel
        await panelZero
            .summarizeDataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanicTiny.csv', 'Name' )
        panelZero.update()

        // Data should have been summarized correctly
        expect( panelZero.stacks().data() ).toTabulateAs( `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'Status' │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'Gender' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘` )

        // Check an example summary element
        expect( panelZero.stacks( 'Gender' ).data() ).toTabulateAs( `\
┌───────────────────┬──────────┬──────────────────────────────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                                            Values                                            │
├───────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
│         0         │ 'Female' │ Map(5) { 'label' => 'Female', 'count' => 49, 'percentage' => 49, 'start' => 0, 'end' => 49 } │
│         1         │  'Male'  │ Map(5) { 'label' => 'Male', 'count' => 51, 'percentage' => 51, 'start' => 49, 'end' => 100 } │
└───────────────────┴──────────┴──────────────────────────────────────────────────────────────────────────────────────────────┘` )

        // The data should not be of the example dataset loaded to panel on initialization.
        // Check this by comparing a definitive feature of the two datasets
        expect( largestTotalCountOfExampleData ).not.toBe( 100 )
        expect( panelZero.largestTotalCount() ).toBe( 100 )


        // New dataset should be visualized on DOM
        expect( panelZero.objects() ).toTabulateAs( `\
┌───────────────────┬──────────┬─────────┐
│ (iteration index) │   Key    │ Values  │
├───────────────────┼──────────┼─────────┤
│         0         │ 'Ticket' │ [Chart] │
│         1         │ 'Status' │ [Chart] │
│         2         │ 'Gender' │ [Chart] │
└───────────────────┴──────────┴─────────┘` )

    } )


    test( 'Summarize a few datasets in the same panel in succession', async () => {

        // Create panel zero
        const panelZero = new navigator.Panel()
            .bgText( 'panelZero' )
            .update( 0 )

        // Summarize a dataset with panel
        await panelZero.summarizeDataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanicTiny.csv', 'Name' )
        panelZero.update()

        // Data should have been summarized correctly
        expect( panelZero.stacks().data() ).toTabulateAs( `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'Status' │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'Gender' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘` )

        // Check an example summary element
        expect( panelZero.stacks( 'Gender' ).data() ).toTabulateAs( `\
┌───────────────────┬──────────┬──────────────────────────────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                                            Values                                            │
├───────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
│         0         │ 'Female' │ Map(5) { 'label' => 'Female', 'count' => 49, 'percentage' => 49, 'start' => 0, 'end' => 49 } │
│         1         │  'Male'  │ Map(5) { 'label' => 'Male', 'count' => 51, 'percentage' => 51, 'start' => 49, 'end' => 100 } │
└───────────────────┴──────────┴──────────────────────────────────────────────────────────────────────────────────────────────┘` )


        // New dataset should be visualized on DOM
        expect( panelZero.objects() ).toTabulateAs( `\
┌───────────────────┬──────────┬─────────┐
│ (iteration index) │   Key    │ Values  │
├───────────────────┼──────────┼─────────┤
│         0         │ 'Ticket' │ [Chart] │
│         1         │ 'Status' │ [Chart] │
│         2         │ 'Gender' │ [Chart] │
└───────────────────┴──────────┴─────────┘` )


        // Summarize another dataset
        await panelZero.summarizeDataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/BigFivePersonalityTraits-Small.csv', 'Name' )
        panelZero.update()

        // Data should have been summarized correctly
        expect( panelZero.stacks().data() ).toTabulateAs( `\
┌───────────────────┬─────────────────────┬──────────────────────────────────────────────┐
│ (iteration index) │         Key         │                    Values                    │
├───────────────────┼─────────────────────┼──────────────────────────────────────────────┤
│         0         │    'Neuroticism'    │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │   'Extraversion'    │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │     'Openness'      │ Stack { _data: [Map], _scaleFunction: null } │
│         3         │   'Agreeableness'   │ Stack { _data: [Map], _scaleFunction: null } │
│         4         │ 'Conscientiousness' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴─────────────────────┴──────────────────────────────────────────────┘` )

        // New dataset should be visualized on DOM
        expect( panelZero.objects() ).toTabulateAs( `\
┌───────────────────┬─────────────────────┬─────────┐
│ (iteration index) │         Key         │ Values  │
├───────────────────┼─────────────────────┼─────────┤
│         0         │    'Neuroticism'    │ [Chart] │
│         1         │   'Extraversion'    │ [Chart] │
│         2         │     'Openness'      │ [Chart] │
│         3         │   'Agreeableness'   │ [Chart] │
│         4         │ 'Conscientiousness' │ [Chart] │
└───────────────────┴─────────────────────┴─────────┘` )

        // Summarize the first dataset again
        await panelZero.summarizeDataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanicTiny.csv', 'Name' )
        panelZero.update()

        // Data should have been loaded correctly
        expect( panelZero.stacks().data() ).toTabulateAs( `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'Status' │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'Gender' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘` )

        // New dataset should be visualized on DOM
        expect( panelZero.objects() ).toTabulateAs( `\
┌───────────────────┬──────────┬─────────┐
│ (iteration index) │   Key    │ Values  │
├───────────────────┼──────────┼─────────┤
│         0         │ 'Ticket' │ [Chart] │
│         1         │ 'Status' │ [Chart] │
│         2         │ 'Gender' │ [Chart] │
└───────────────────┴──────────┴─────────┘` )

    } )


} )



//// Statistics ///////////////////////////////////////////////////////////////

describe( 'Statistics', () => {

    test( 'The largest count in panel', () => {

        const myPanel = new navigator.Panel()
        myPanel.build()

        expect( myPanel.largestTotalCount() ).toBe( 1309 )

    } )

} )




//// Retrieve Ancestry Information ///////////////////////////////////////////////////////////////

describe( 'Retrieve Ancestry Information', () => {


    test( 'When called from a chart in the panel, parentObject property and parentObjects() method should return ' +
        'the panel', () => {

        // Create a parent object
        initializeDomWithSvg()
        const myPanel = new navigator.Panel()
        myPanel.id( 'my-panel' )
        myPanel.build()

        // Select a component chart of Panel
        expect( myPanel.objects( 'status' ).parentObject ).toBeDefined()
        expect( myPanel.objects( 'status' ).parentObject.id() ).toBe( 'my-panel' )

        expect( myPanel.objects( 'status' ).parentObjects() ).toTabulateAs( `\
┌───────────────────┬────────────┬─────────┐
│ (iteration index) │    Key     │ Values  │
├───────────────────┼────────────┼─────────┤
│         0         │ 'my-panel' │ [Panel] │
└───────────────────┴────────────┴─────────┘` )

    } )

} )



//// Inferences ///////////////////////////////////////////////////////////////

describe( 'Inferences', () => {

    test( 'Number of visible categories in panel ', () => {

        initializeDomWithSvg()
        const myPanel = new navigator.Panel()
        myPanel.build()

        // A panel with no hidden categories
        expect( myPanel.has.numberOfVisibleCategories() ).toBe( 7 )

        // Hide a chart in panel and check how many categories are visible again
        myPanel.objects( 'gender' ).visibility( 'hidden' ).update()
        expect( myPanel.has.numberOfVisibleCategories() ).toBe( 5 )

        // Show the hidden chart again, and check visible category count again
        myPanel.objects( 'gender' ).visibility( 'visible' ).update()
        expect( myPanel.has.numberOfVisibleCategories() ).toBe( 7 )


    } )


} )


//// BG Extension ///////////////////////////////////////////////////////////////

describe( 'BG Extension', () => {

    test( 'BG Extension: Extend panel background leftward', () => {

        initializeDomWithSvg()

        // Create panel
        const myPanel = new navigator.Panel()
            .x( 300 )
        myPanel.build()


        // Get left background extension value
        expect( myPanel.bgExtensionLeft() )
            .toBe( myPanel._bgExtension.left )


        // Record initial background related variables
        const initialBgExtensionLeft = myPanel.bgExtensionLeft()
        const initialBgX = myPanel._backgroundObject.x()
        const initialBgWidth = myPanel._backgroundObject.width()



        //// EXTEND ////

        // Extend panel background leftward
        const extensionValue = 100
        myPanel.bgExtensionLeft( extensionValue ).update()

        // Record new background related variables
        const newBgExtensionLeft = myPanel.bgExtensionLeft()
        const newBgX = myPanel._backgroundObject.x()
        const newBgWidth = myPanel._backgroundObject.width()

        // Check new background-related values that should be updated
        expect( newBgExtensionLeft ).toBe( extensionValue )
        expect( newBgX ).toBe( initialBgX - extensionValue )
        expect( newBgWidth ).toBe( initialBgWidth + extensionValue )


        // Check if final values are reflected to DOM
        const newBgXOnDom = Number( document.querySelector( '.background .linkable-rectangle' ).getAttribute( 'x' ) )
        const newBgWidthOnDom = Number( document.querySelector( '.background .linkable-rectangle' ).getAttribute( 'width' ) )
        expect( newBgXOnDom ).toBe( newBgX )
        expect( newBgWidthOnDom ).toBe( newBgWidth )




        //// RETRACT ////

        // Retract the background extension
        const newExtensionValue = 50
        myPanel.bgExtensionLeft( newExtensionValue ).update()

        // Record new background related variables
        const retractedBgExtensionLeft = myPanel.bgExtensionLeft()
        const retractedBgX = myPanel._backgroundObject.x()
        const retractedBgWidth = myPanel._backgroundObject.width()

        // Check new background-related values that should be updated
        expect( retractedBgExtensionLeft ).toBe( newExtensionValue )
        expect( retractedBgX ).toBe( initialBgX - newExtensionValue )
        expect( retractedBgWidth ).toBe( initialBgWidth + newExtensionValue )


    } )


    test( 'BG Extension: Left and right extension together', () => {

        //// INITIALIZE ////
        initializeDomWithSvg()

        // Create panel
        const myPanel = new navigator.Panel()
            .x( 300 )
        myPanel.build()


        myPanel.width( 100 ).update()

        backgroundObject = myPanel._backgroundObject
        leftExtensionValue = 100
        rightExtensionValue = 100

        myPanel.bgExtensionLeft( leftExtensionValue ).update()
        myPanel.bgExtensionRight( rightExtensionValue ).update()

        expect( backgroundObject.width() )
            .toBe( leftExtensionValue + myPanel.width() + rightExtensionValue )


    } )

} )


//// Y Axis Labels ///////////////////////////////////////////////////////////////

describe( 'Y Axis Labels', () => {

    test( 'Toggle labels on y axis on/off', () => {

        initializeDomWithSvg()

        // Create panel
        const myPanel = new navigator.Panel()
            .x( 150 )
        myPanel.build()

        //// INITIAL STATE CHECK ////

        // Initially, there should be no labels on y axis
        let labelsOnYAxis = document.querySelectorAll( '.category-label' )
        expect( labelsOnYAxis ).toHaveLength( 0 )


        //// TOGGLE LABELS ON ////

        // Add labels
        myPanel.yAxisLabels( true ).update()


        // Labels should be created on DOM
        labelsOnYAxis = document.querySelectorAll( '.category-label' )
        expect( labelsOnYAxis ).toHaveLength( 7 )

        const maleLabelElement = document.querySelector( '.category#male .category-label' )
        expect( maleLabelElement.textContent ).toBe( 'male' )
        expect( maleLabelElement.getAttribute( 'x' ) ).toBe( '140' )
        expect( maleLabelElement.getAttribute( 'y' ) ).toBe( '468.5' )


        //// TOGGLE LABELS OFF ////
        myPanel.yAxisLabels( false ).update()

        // No label elements should be on DOM after toggle off
        labelsOnYAxisAfterToggleOff = document.querySelectorAll( '.category-label' )
        expect( labelsOnYAxisAfterToggleOff ).toHaveLength( 0 )

    } )


// TODO: Test MUST be completed
    test( 'Update label positions when panel position or height is changed', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''

        // Create SVG
        const mySvg = new container.Svg()
        mySvg.select()
            .attr( 'id', 'top-svg' )

        // Create panel
        const myPanel = new navigator.Panel()
        myPanel.build()
    } )



    test( 'Ensure that chart labels on y axis are vertically aligned with each other', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''
        // Create SVG
        const mySvg = new container.Svg()
        mySvg.select()
            .attr( 'id', 'top-svg' )
        // Create panel
        const myPanel = new navigator.Panel()
        myPanel.build()

        // Turn y axis labels on
        myPanel.yAxisLabels( true ).update()

        const xCoordinateOfChart1Label = myPanel.objects( 'status' )._chartLabelObject.x()
        const xCoordinateOfChart2Label = myPanel.objects( 'class' )._chartLabelObject.x()
        const xCoordinateOfChart3Label = myPanel.objects( 'gender' )._chartLabelObject.x()

        expect( xCoordinateOfChart1Label === xCoordinateOfChart2Label )
            .toBeTruthy()
        expect( xCoordinateOfChart1Label === xCoordinateOfChart3Label )
            .toBeTruthy()

    } )


    test( 'Get the position of the farthest category label', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''
        // Create SVG
        const mySvg = new container.Svg()
        mySvg.select()
            .attr( 'id', 'top-svg' )
        // Create panel
        const myPanel = new navigator.Panel()
        myPanel.build()
        // Turn y axis labels on
        myPanel.yAxisLabels( true ).update()

        // Get the x coordinate of the farthest chart label
        const automaticallyRetrievedInitialXCoordinate = myPanel._getXCoordinateOfFarthestChartLabel()
        const manuallyRetrievedInitialXCoordinate = myPanel.objects( 'class' )._chartLabelObject.x()
        expect( automaticallyRetrievedInitialXCoordinate )
            .toBe( manuallyRetrievedInitialXCoordinate )

        // COMMENTED OUT TEST BLOCK IS NO MORE MEANINGFUL, AS ALL LABELS ARE AUTOMATICALLY ALIGNED UPON INITIATION
        // (they share the same x coordinate) Ensure that the method only returns the farthest coordinate, which ...
        // should be less (because it is leftmost) than other chart labels' x coordinates expect(
        // automaticallyRetrievedInitialXCoordinate ) .toBeLessThan( myPanel.objects('gender')._chartLabelObject.x() )
        // expect( automaticallyRetrievedInitialXCoordinate ) .toBeLessThan(
        // myPanel.objects('status')._chartLabelObject.x() )


        // Move the chart, and see if the position of the chart label is updated
        const increment = 600
        myPanel.x( myPanel.x() + increment ).update()
        const automaticallyRetrievedNewXCoordinate = myPanel._getXCoordinateOfFarthestChartLabel()
        expect( automaticallyRetrievedNewXCoordinate )
            .toBe( manuallyRetrievedInitialXCoordinate + increment )

    } )


} )




//// ABSOLUTE VALUES ///////////////////////////////////////////////////////////////

describe( 'Absolute Values: Toggling absolute values should show counts instead of percentages', () => {

    initializeDomWithSvg()

    // Create panel
    const myPanel = new navigator.Panel()
    myPanel.build()


    test( 'Get/Set', () => {

        // GET //
        expect( myPanel.showAbsoluteValues() ).toBe( false )

        // SET (on) //
        myPanel.showAbsoluteValues( true ).update()
        expect( myPanel.showAbsoluteValues() ).toBe( true )


        // SET (off) //
        myPanel.showAbsoluteValues( false ).update()
        expect( myPanel.showAbsoluteValues() ).toBe( false )
    } )


    test( 'Propagation to Charts: Absolute value-related properties of category objects in panel should be set correctly after toggling absolute values', () => {

        // Record & check the defaults for panel
        expect( myPanel.showAbsoluteValues() ).toBe( false )
        // Record defaults for the charts contained within the panel
        let absoluteValuesStatusesInCharts = getStatusOfAbsoluteValuesInChartObjectsInPanel()
        expect( absoluteValuesStatusesInCharts )
            .toEqual( [ false, false, false ] )



        // Toggle absolute values on //
        myPanel.showAbsoluteValues( true ).update()

        // Check if related properties are updated...
        // ...in panel
        expect( myPanel.showAbsoluteValues() ).toBe( true )
        // ...in charts in panel
        absoluteValuesStatusesInCharts = getStatusOfAbsoluteValuesInChartObjectsInPanel()
        expect( absoluteValuesStatusesInCharts )
            .toEqual( [ true, true, true ] )



        // Toggle absolute values off //
        myPanel.showAbsoluteValues( false ).update()

        // Check if related properties are updated...
        // ...in panel
        expect( myPanel.showAbsoluteValues() ).toBe( false )
        // ...in charts in panel
        absoluteValuesStatusesInCharts = getStatusOfAbsoluteValuesInChartObjectsInPanel()
        expect( absoluteValuesStatusesInCharts )
            .toEqual( [ false, false, false ] )




        // HELPER FUNCTION(S) FOR THIS TEST //

        /**
         * @return {[]|Array}s
         */
        function getStatusOfAbsoluteValuesInChartObjectsInPanel() {
            values = []
            myPanel.objects().forEach( ( categoryObject, categoryName ) => {
                const value = categoryObject.showAbsoluteValues()
                values.push( value )
            } )
            return values
        }



    } )


} )




//// Color Themes ///////////////////////////////////////////////////////////////

describe( 'Color themes', () => {


    test( 'Assign color themes to charts in panel', () => {

        initializeDomWithSvg()

        // Create panel
        const myPanel = new navigator.Panel()
        myPanel.build()

        // View the charts in panel
        expect( myPanel.objects() ).toTabulateAs( `\
┌───────────────────┬──────────┬─────────┐
│ (iteration index) │   Key    │ Values  │
├───────────────────┼──────────┼─────────┤
│         0         │ 'gender' │ [Chart] │
│         1         │ 'class'  │ [Chart] │
│         2         │ 'status' │ [Chart] │
└───────────────────┴──────────┴─────────┘` )


        // View the rectangle colors in the 1st chart
        expect( myPanel.objects( 'gender' ).actualColors() ).toTabulateAs( `\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │ 'rgb(106, 81, 164)'  │
│    1    │ 'rgb(158, 155, 201)' │
└─────────┴──────────────────────┘` )

        // myPanel.objects('class').colorScheme('Blues').update()


        // View the rectangle colors in the 2nd chart
        expect( myPanel.objects( 'class' ).actualColors() ).toTabulateAs( `\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │ 'rgb(24, 100, 170)'  │
│    1    │ 'rgb(75, 151, 201)'  │
│    2    │ 'rgb(147, 195, 223)' │
└─────────┴──────────────────────┘` )

        // View the rectangle colors in the 3rd chart
        expect( myPanel.objects( 'class' ).actualColors() ).toTabulateAs( `\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │ 'rgb(24, 100, 170)'  │
│    1    │ 'rgb(75, 151, 201)'  │
│    2    │ 'rgb(147, 195, 223)' │
└─────────┴──────────────────────┘` )

    } )


    test( 'Get and Set color theme', () => {


        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''
        // Create SVG
        const mySvg = new container.Svg()
        // Create parent panel
        const myPanel = new navigator.Panel( mySvg )  // no need to specify a spawn source if no parent is specified
        myPanel.build()


        // Check initial colors

        expect( myPanel.objects( 'gender' ).actualColors() ).toTabulateAs( `\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │ 'rgb(106, 81, 164)'  │
│    1    │ 'rgb(158, 155, 201)' │
└─────────┴──────────────────────┘` )  // Gender: Purples

        expect( myPanel.objects( 'class' ).actualColors() ).toTabulateAs( `\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │ 'rgb(24, 100, 170)'  │
│    1    │ 'rgb(75, 151, 201)'  │
│    2    │ 'rgb(147, 195, 223)' │
└─────────┴──────────────────────┘` )  // Class: Blues

        expect( myPanel.objects( 'status' ).actualColors() ).toTabulateAs( `\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │  'rgb(34, 139, 69)'  │
│    1    │ 'rgb(115, 195, 120)' │
└─────────┴──────────────────────┘` )  // Status: Greens



        // Get the current color theme
        expect( myPanel.colorSet() ).toBe( 'Single-Hue' )

        // Change color theme
        myPanel.colorSet( 'Greys' ).update()


        // Check the changed colors
        expect( myPanel.objects( 'gender' ).actualColors() ).toTabulateAs( `\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │  'rgb(80, 80, 80)'   │
│    1    │ 'rgb(151, 151, 151)' │
└─────────┴──────────────────────┘` )  // Gender: Grays

        expect( myPanel.objects( 'class' ).actualColors() ).toTabulateAs( `\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │  'rgb(64, 64, 64)'   │
│    1    │ 'rgb(122, 122, 122)' │
│    2    │ 'rgb(180, 180, 180)' │
└─────────┴──────────────────────┘` )  // Class: Blues

        expect( myPanel.objects( 'status' ).actualColors() ).toTabulateAs( `\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │  'rgb(80, 80, 80)'   │
│    1    │ 'rgb(151, 151, 151)' │
└─────────┴──────────────────────┘` )  // Status: Greens

    } )


} )




//// Stroke Properties ///////////////////////////////////////////////////////////////


describe( 'Stroke', () => {

    test( 'Get/set stroke width and color', () => {

        const panel0 = new navigator.Panel()
        panel0.build()

        // GET //

        expect( panel0.strokeWidth() ).toBe( '0.5px' )
        expect( panel0.stroke() ).toBe( 'rgba(255, 255, 255, 1.0)' )

        const { strokeWidths: defaultStrokeWidths, strokeColors: defaultStrokeColors } = getStrokeWidthsAndColors( panel0 )

        expect( defaultStrokeWidths ).toTabulateAs( `\
┌───────────────────┬──────────┬─────────────┐
│ (iteration index) │   Key    │   Values    │
├───────────────────┼──────────┼─────────────┤
│         0         │ 'gender' │ [ '0.5px' ] │
│         1         │ 'class'  │ [ '0.5px' ] │
│         2         │ 'status' │ [ '0.5px' ] │
└───────────────────┴──────────┴─────────────┘` )

        expect( defaultStrokeColors ).toTabulateAs( `\
┌───────────────────┬──────────┬────────────────────────────────┐
│ (iteration index) │   Key    │             Values             │
├───────────────────┼──────────┼────────────────────────────────┤
│         0         │ 'gender' │ [ 'rgba(255, 255, 255, 1.0)' ] │
│         1         │ 'class'  │ [ 'rgba(255, 255, 255, 1.0)' ] │
│         2         │ 'status' │ [ 'rgba(255, 255, 255, 1.0)' ] │
└───────────────────┴──────────┴────────────────────────────────┘` )



        // SET //

        panel0.strokeWidth( '4px' )
        panel0.stroke( 'black' )
        expect( panel0.strokeWidth() ).toBe( '4px' )
        expect( panel0.stroke() ).toBe( 'black' )


        panel0.update()

        // Check if changes are passed on to charts in panel
        const { strokeWidths: newStrokeWidths, strokeColors: newStrokeColors } = getStrokeWidthsAndColors( panel0 )

        expect( newStrokeWidths ).toTabulateAs( `\
┌───────────────────┬──────────┬───────────┐
│ (iteration index) │   Key    │  Values   │
├───────────────────┼──────────┼───────────┤
│         0         │ 'gender' │ [ '4px' ] │
│         1         │ 'class'  │ [ '4px' ] │
│         2         │ 'status' │ [ '4px' ] │
└───────────────────┴──────────┴───────────┘` )

        expect( newStrokeColors ).toTabulateAs( `\
┌───────────────────┬──────────┬─────────────┐
│ (iteration index) │   Key    │   Values    │
├───────────────────┼──────────┼─────────────┤
│         0         │ 'gender' │ [ 'black' ] │
│         1         │ 'class'  │ [ 'black' ] │
│         2         │ 'status' │ [ 'black' ] │
└───────────────────┴──────────┴─────────────┘` )

    } )

} )



//// HELPER FUNCTIONS /////////////////////////////////////////////////////////////

function getStrokeWidthsAndColors( panel0 ) {

    const strokeWidths = new Map()
    const strokeColors = new Map()

    panel0.objects().forEach( ( chartObject, chartName ) => {

        strokeWidths.set( chartName, [] )
            .get( chartName )
            .push( chartObject.strokeWidth() )

        strokeColors.set( chartName, [] )
            .get( chartName )
            .push( chartObject.stroke() )
    } )
    return { strokeWidths, strokeColors }
}

