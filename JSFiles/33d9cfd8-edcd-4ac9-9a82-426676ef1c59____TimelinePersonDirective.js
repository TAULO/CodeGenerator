emmetApp.directive('timelineperson', [
'DataService', 
'TimeService', 
'CanvasService', 
'ColorService', 
'SymbolsService', 
'LocationService',
'PopupService',
'$routeParams', 
'HighlightService', 
function(
	DataService, 
	TimeService, 
	CanvasService, 
	ColorService, 
	SymbolsService, 
	LocationService,
	PopupService,
	$routeParams, 
	HighlightService)
{
	return {
		restrict: 'E',
		replace: true,
		scope: 
		{
			
		},
		controller: 'TimelinePersonController',
		templateUrl: 'app/templates/TimelinePerson.tpl.html',
		link: function(scope, element, attrs)
		{
			d3.selectAll(".menu-item").classed("active", false);
			d3.selectAll(".menu-item").filter(".person").classed("active", true);
			
			// *************************************************************************
			// CONFIGURATION CONSTANTS 
			// *************************************************************************
			scope.X_AXIS_HEIGHT = 13;
			scope.X_AXIS_FONT_FAMILY = "'Gentium Basic', serif";
			scope.X_AXIS_FONT_WEIGHT = "500";
			scope.X_AXIS_FONT_SIZE = "10px";
			
			scope.HORIZONTAL_SLICE_HEIGHT = 15;
			scope.HORIZONTAL_SLICE_HEIGHT_MULTI = 8;
			
			scope.DISTANCE_AUTHOR_NAME_TO_BEZIER_CURVES = 10;
			scope.DISTANCE_BEZIER_CURVES_TO_TIMELINE = 10;
			scope.DISTANCE_TIMELINE_TO_VERTICAL_LINES = 10;
			scope.DISTANCE_PERSON_NAME_TO_FIRST_LETTER = 10;
			scope.DISTANCE_PERSON_NAME_FROM_BASELINE = -3;
			
			scope.VERTICAL_LINES_DASHARRAY_AUTHOR = "";
			scope.VERTICAL_LINES_DASHARRAY_RECIPIENT = "3,2";
			scope.VERTICAL_LINES_OFFSET_AUTHOR = -2;
			scope.VERTICAL_LINES_OFFSET_RECIPIENT = 6;
			scope.VERTICAL_LINES_OFFSET_VERTICAL = -3;
				
			scope.HORIZONTAL_LINES_OFFSET_AUTHOR = -3;
			scope.HORIZONTAL_LINES_OFFSET_RECIPIENT = 3;
			scope.HORIZONTAL_LINES_OFFSET_VERTICAL = -5;
				
			scope.RECT_OFFSET_AUTHOR = -5;
			scope.RECT_OFFSET_RECIPIENT = 3;
			scope.RECT_OFFSET_VERTICAL = -8;
			scope.RECT_WIDTH = 6;
			scope.RECT_HEIGHT = 6;
			
			scope.PLACEMARK_HEIGHT = scope.RECT_HEIGHT;
			scope.PLACEMARK_WIDTH_SINGLE = scope.RECT_WIDTH;
			scope.PLACEMARK_WIDTH_MULTI = 2*scope.RECT_WIDTH + 2;
			scope.PLACEMARK_OFFSET_AUTHOR = scope.RECT_OFFSET_AUTHOR;
			scope.PLACEMARK_OFFSET_RECIPIENT = scope.RECT_OFFSET_RECIPIENT;
			scope.PLACEMARK_OFFSET_VERTICAL = scope.RECT_OFFSET_VERTICAL;
			
			scope.TIMELINE_EXTENSION_HEIGHT = 30;
			scope.TIMELINE_EXTENSION_DISTANCE_FROM_PLACEMARK = 5; // -2 is collapsed to placemark
			scope.TIMELINE_EXTENSION_CURVES_HEIGHT = 20;
			
			// *************************************************************************
			// DATA
			// *************************************************************************
			scope.dataTimelinePerson = null;
			
			// *************************************************************************
			// DRAWN ELEMENTS DUMMY VARIABLES
			// *************************************************************************
			scope.processedLetterIds = new Array();
			scope.processedRecipientIds = new Array();
			
		    scope.drawnLettersByRecipient = new Array();
			scope.drawnRecipientsByContainer = new Array();
			scope.drawnBezierCurvesAuthorByYear = new Array();
		    scope.drawnBezierCurvesRecipientByYear = new Array();
		    scope.drawnRecipientNames = new Array();
			scope.drawnVerticalLinesAuthorByYear = new Array();
		    scope.drawnVerticalLinesRecipientByYear = new Array();
			scope.drawnHorizontalLinesByRecipient = new Array();
		   
			// *************************************************************************
			// TIMELINE EXPANSION MGMT
			// *************************************************************************
			scope.yearIsExpandAll = new Array(); // true if corresponding year has to expand all placemarks, false if collapse all
			scope.isTimelineExpandedForRecipient = new Array(); // contains the year of currently open timeline expansion for each recipient
			scope.baseViewerHeight = 0;
			scope.recipientContainerCount = 0;
			
		    // *************************************************************************
			// WATCH LISTENERS
			// *************************************************************************
			
		    scope.$watch(function() {return DataService.hasData();}, 
					function (newValue, oldValue) {if (newValue) {scope.draw();}}, true);
			
		    scope.$watch(
					function() {return HighlightService.getPersonId();}, 
					function (newValue, oldValue) 
					{
						if (!HighlightService.isPersistent() && !PopupService.isPersistent())
                    	{
							if (newValue) 
							{
								d3.selectAll(".letter-rect").classed("opacized", true);
								d3.selectAll(".letter-rect").filter(".p" + newValue).classed("opacized", false);
								
								d3.selectAll(".placemark").classed("opacized", true);
								d3.selectAll(".placemark").filter(".p" + newValue).classed("opacized", false);
								
								d3.selectAll(".expansion-text").classed("opacized", true);
								d3.selectAll(".expansion-text").filter(".p" + newValue).classed("highlighted", true).classed("opacized", false);
								
								d3.selectAll(".person-name-token").classed("opacized", true);
								d3.selectAll(".person-name-token").filter(".p" + newValue).classed("highlighted", true).classed("opacized", false);
								
								d3.selectAll(".bezier-curve").filter(".p" + newValue).classed("highlighted", true);
								d3.selectAll(".horizontal-line").filter(".p" + newValue).classed({'highlighted': true, 'hidden': false});
		                        d3.selectAll(".vertical-line").filter(".p" + newValue).classed({'highlighted': true, 'hidden': false});
							}
							else
							{
								d3.selectAll(".letter-rect").classed("opacized", false);
								
								d3.selectAll(".placemark").classed("opacized", false);
								
								d3.selectAll(".expansion-text").classed("highlighted", false);
								d3.selectAll(".expansion-text").classed("opacized", false);
								
								d3.selectAll(".person-name-token").classed("highlighted", false);
								d3.selectAll(".person-name-token").classed("opacized", false);
								
								d3.selectAll(".bezier-curve").classed("highlighted", false);
								d3.selectAll(".horizontal-line").classed({'highlighted': false, 'hidden': true});
								d3.selectAll(".horizontal-line").filter("#static").classed("hidden", false);
								d3.selectAll(".vertical-line").classed({'highlighted': false, 'hidden': true});
								d3.selectAll(".vertical-line").filter("#static").classed("hidden", false);
							}
                    	}
					}, true);
			
			scope.$watch(
					function() {return HighlightService.getLetterId();}, 
					function (newValue, oldValue) 
					{
						if (!HighlightService.isPersistent() && !PopupService.isPersistent())
                    	{
							if (newValue) 
							{
								d3.selectAll(".letter-rect").classed("opacized", true);
								d3.selectAll(".letter-rect").filter(".l" + newValue).classed("opacized", false);
								
								d3.selectAll(".placemark").classed("opacized", true);
								d3.selectAll(".placemark").filter(".l" + newValue).classed("opacized", false);
								
								d3.selectAll(".expansion-text").classed("opacized", true);
								d3.selectAll(".expansion-text").filter(".l" + newValue).classed("highlighted", true).classed("opacized", false);
								
								d3.selectAll(".person-name-token").classed("opacized", true);
								d3.selectAll(".person-name-token").filter(".l" + newValue).classed("highlighted", true).classed("opacized", false);
								
								d3.selectAll(".horizontal-line").filter(".l" + newValue).classed({'highlighted': true, 'hidden': false});
								d3.selectAll(".vertical-line").filter(".l" + newValue).classed({'highlighted': true, 'hidden': false});
								d3.selectAll(".bezier-curve").filter(".l" + newValue).classed("highlighted", true);
							}	
							else
							{
								d3.selectAll(".letter-rect").classed("opacized", false);
								
								d3.selectAll(".placemark").classed("opacized", false);
								
								d3.selectAll(".expansion-text").classed("highlighted", false);
								d3.selectAll(".expansion-text").classed("opacized", false);
								
								d3.selectAll(".person-name-token").classed("highlighted", false);
								d3.selectAll(".person-name-token").classed("opacized", false);
								d3.selectAll(".horizontal-line").classed({'highlighted': false, 'hidden': true});
								d3.selectAll(".horizontal-line").filter("#static").classed("hidden", false);
								d3.selectAll(".vertical-line").classed({'highlighted': false, 'hidden': true});
								d3.selectAll(".vertical-line").filter("#static").classed("hidden", false);
								d3.selectAll(".bezier-curve").classed("highlighted", false);
								
							}
                    	}
					}, true);
			
			scope.$watch(
					function() {return HighlightService.getTopicId();}, 
					function (newValue, oldValue) 
					{
						if (!HighlightService.isPersistent() && !PopupService.isPersistent())
                    	{
							if (newValue) 
							{
								d3.selectAll(".letter-rect").classed("opacized", true);
								d3.selectAll(".letter-rect").filter(".t" + newValue).classed("opacized", false);
								d3.selectAll(".placemark").classed("opacized", true);
								d3.selectAll(".placemark").filter(".t" + newValue).classed("opacized", false);
								d3.selectAll(".person-name-token").classed("opacized", true);
								d3.selectAll(".person-name-token").filter(".t" + newValue).classed("opacized", false);
								d3.selectAll(".expansion-text").classed("opacized", true);
								d3.selectAll(".expansion-text").filter(".t" + newValue).classed("opacized", false);
								
								d3.selectAll(".horizontal-line").filter("#static").classed("opacized", true);
								d3.selectAll(".horizontal-line").classed("opacized", true);
								//d3.selectAll(".horizontal-line").filter(".t" + newValue).classed({"hidden": true, "opacized": false});
								
								d3.selectAll(".vertical-line").filter("#static").classed("opacized", true);
								d3.selectAll(".vertical-line").classed("opacized", true);
								d3.selectAll(".vertical-line").filter(".t" + newValue).classed({"hidden": false, "opacized": false});
								
								d3.selectAll(".bezier-curve").classed("opacized", true);
								d3.selectAll(".bezier-curve").filter(".t" + newValue).classed("opacized", false);
							}	
							else
							{
								d3.selectAll(".letter-rect").classed("opacized", false);
								d3.selectAll(".placemark").classed("opacized", false);
								d3.selectAll(".person-name-token").classed("opacized", false);
								d3.selectAll(".expansion-text").classed("opacized", false);
								
								d3.selectAll(".horizontal-line").classed({'opacized': false, 'hidden': true});
								d3.selectAll(".horizontal-line").filter("#static").classed("hidden", false);
								d3.selectAll(".vertical-line").classed({'opacized': false, 'hidden': true});
								d3.selectAll(".vertical-line").filter("#static").classed("hidden", false);
								d3.selectAll(".bezier-curve").classed("opacized", false);
								
							}
                    	}
					}, true);
			
			
			// *************************************************************************
			// METHODS
			// *************************************************************************
			
			// Main drawing method
			scope.draw = function() 
			{
				CanvasService.initOnContainer('viewer-contents');
				HighlightService.reset();
				PopupService.reset();
				
				scope.xScale = d3.scale.ordinal()
	    			.rangeBands([0, CanvasService.getWidth()], .75)
	    			.domain(TimeService.getYears());
				
				scope.dataTimelinePerson = DataService.getData($routeParams.dataType, SymbolsService.dataTimelineAuthor, $routeParams.personId);
				var maximumSlicesHeight = scope.dataTimelinePerson.length * scope.HORIZONTAL_SLICE_HEIGHT;
			    var maximumViewerHeight = CanvasService.getMargin().top + CanvasService.getMargin().bottom + CanvasService.getHeight()/3 + scope.X_AXIS_HEIGHT + maximumSlicesHeight;
				scope.baseViewerHeight = maximumViewerHeight;
			    
				scope.initializeDummyVariables();
				
				var svg = d3.select(".timeline-person").append("svg")
		        	.attr("class", "viewer")
		        	.attr("width", CanvasService.getWidth())
		        	.attr("height", Math.max(maximumViewerHeight, CanvasService.getHeight()));
			    
				var chartBackground = svg.append("g")
			    	.attr("class", "chartBackground");
				
				chartBackground.append("rect")
			    	.attr("class", "background")
			    	.attr("width", CanvasService.getWidth())
			        .attr("height", Math.max(maximumViewerHeight, CanvasService.getHeight()))
	                .attr("y", 0)
	                .attr("x", 0)
	                .style("fill", ColorService.getColorFor("pageBackground"))
	                .attr("transform", "translate(" + CanvasService.getMargin().left + "," + (CanvasService.getMargin().top) + ")")
	                .on("click", function() 
	                {
	                	if (PopupService.isVisible() && PopupService.isPersistent())
	                	{
	                		PopupService.setPersistent(false);
	                		PopupService.hidePopup();
	                		
	                		scope.$apply(function() {HighlightService.setLetterHoverId(null);});
							scope.$apply(function() {HighlightService.setPersonHoverId(null);});
							
							if (!HighlightService.isPersistent())
							{
								d3.selectAll(".letter-rect").classed("opacized", false);
								d3.selectAll(".placemark").classed("opacized", false);
								d3.selectAll(".expansion-text").classed("highlighted", false);
								d3.selectAll(".expansion-text").classed("opacized", false);
								d3.selectAll(".person-name-token").classed("highlighted", false);
								d3.selectAll(".person-name-token").classed("opacized", false);
								
								d3.selectAll(".horizontal-line").classed({"highlighted": false, 'opacized': false, 'hidden': true});
								d3.selectAll(".horizontal-line").filter("#static").classed("hidden", false);
								d3.selectAll(".vertical-line").classed({"highlighted": false, 'opacized': false, 'hidden': true});
								d3.selectAll(".vertical-line").filter("#static").classed("hidden", false);
								d3.selectAll(".bezier-curve").classed({"highlighted": false, "opacized": false});
							}
	                	}
	                });
				
				
				var xAxis = d3.svg.axis()
		        	.scale(scope.xScale)
		        	.orient("bottom");
				
			    var chartArea = svg.append("g")
		    		.attr("class", "chartArea")
		    		.attr("transform", "translate(" + CanvasService.getMargin().left + "," + CanvasService.getMargin().top + ")");
		    
			    svg.append("g")
			        .attr("class", "xAxis")
			        .attr("transform", "translate(" + CanvasService.getMargin().left + "," + (CanvasService.getMargin().top + CanvasService.getHeight()/3 - scope.X_AXIS_HEIGHT - 3) + ")")
			        .call(xAxis)
			        .selectAll("text")
			        	.attr("class", function(d) {return "y" + d3.select(this).text();})
			        	.on("click", function(d) 
			        	{
			        		if (d3.select(this).classed("expand-all")) scope.handleClickOnYear(parseInt(d3.select(this).text()));
			        	});
			    
			    var curvesContainer = svg.append("g")
			    	.attr("id", "curves-container")
			    	.attr("transform", "translate(" + CanvasService.getMargin().left + "," + (CanvasService.getMargin().top + CanvasService.getHeight()/6 + scope.DISTANCE_AUTHOR_NAME_TO_BEZIER_CURVES) + ")");
			    
			    var verticalLinesContainer = chartArea.append("g")
			    	.attr("id", "vertical-lines-container");
			    
			    var horizontalLinesContainer = chartArea.append("g")
			    	.attr("id", "horizontal-lines-container");
			    
			    svg.append("text")
			    	.text(DataService.getPersonById($routeParams.dataType, $routeParams.personId).name)
			    	.attr("class", "author-name")
			    	.attr("text-anchor", "middle")
			    	.attr("transform", "translate(" + (CanvasService.getWidth()/2 + CanvasService.getMargin().left)  + "," + (CanvasService.getMargin().top + CanvasService.getHeight()/6) + ")");
			    
			    var years = TimeService.getYears();
			    for (var yearIndex = 0; yearIndex < years.length; yearIndex++)
			    {
			    	var year = years[yearIndex];
			    	scope.recipientContainerCount = scope.dataTimelinePerson.length;
			    	for (var sliceIndex = 0; sliceIndex < scope.dataTimelinePerson.length; sliceIndex++)
			    	{
			    		var sliceLetters = scope.dataTimelinePerson[sliceIndex];
			    		if (!scope.hasProcessedRecipient(sliceIndex) && scope.sliceHasLettersInYear(sliceLetters, year))
			    		{
			    			var recipientContainer = scope.drawRecipientContainer(chartArea, sliceIndex, sliceLetters);
			    			var sliceClass = scope.drawName(recipientContainer, sliceIndex, sliceLetters);
				    		
				    		scope.processedRecipientIds.push(sliceIndex);
				    		scope.drawHorizontalLine(horizontalLinesContainer, sliceLetters, sliceIndex, sliceClass);
			    			
				    		for (var letterIndex = 0; letterIndex < sliceLetters.length; letterIndex++)
				    		{
				    			var letter = sliceLetters[letterIndex];
				    			if (!scope.hasProcessedLetter(letter.id))
				    			{
				    				scope.processedLetterIds.push(letter.id);
					    			scope.drawBezierCurve(curvesContainer, letter);
					    			scope.drawVerticalLine(verticalLinesContainer, letter, sliceIndex);
					    			
				    			}
				    		}
				    		
				    		scope.drawLetters(recipientContainer, sliceIndex, sliceLetters);
				    		
			    		}
			    	}
			    }
			};
			
			// ===============================================================================================
			// TIMELINE EXPANSION MGMT
			// ===============================================================================================
			
			// Opens the nested timeline for the specified slice index and year
			scope.openNestedTimeline = function(selectedSliceIndex, year)
			{
				scope.isTimelineExpandedForRecipient[selectedSliceIndex] = year;
				scope.expandTimeline(selectedSliceIndex);
				scope.drawTimelineExpansion(selectedSliceIndex, year);
			};
			
			// Closes the nested timeline for the specified slice index and year
			scope.closeNestedTimeline = function(selectedSliceIndex, year)
			{
				scope.isTimelineExpandedForRecipient[selectedSliceIndex] = 0;
				scope.compressTimeline(selectedSliceIndex);
				d3.select(".rce" + selectedSliceIndex).remove();
			};
			
			// Handles the logic of expand/collapse for a click on a year
			scope.handleClickOnYear = function(year)
			{
				var selection = d3.selectAll(".placemark").filter(".y" + year).each(function(d, i)
        		{
    				var sliceIndex = parseInt(d3.select(this).attr("recipient-container-id"));
    				
    				if (scope.yearIsExpandAll[year - TimeService.getTimelineStartYear()])
    				{
    					// before expanding, check whether there is an open expansion for the same recipient in another year and close it
    					if (scope.isTimelineExpandedForRecipient[sliceIndex] != 0 && scope.isTimelineExpandedForRecipient[sliceIndex] != year)
    					{
    						scope.handleClickOnPlacemark(sliceIndex, scope.isTimelineExpandedForRecipient[sliceIndex]);
    					}
    					
    					// open timeline expansion only if it is not already open
    					if (!(scope.isTimelineExpandedForRecipient[sliceIndex] == year))
    					{
    						scope.openNestedTimeline(sliceIndex, year);
    					}
    				}
    				else
    				{
    					// close timeline expansion only if it is not already closed
    					if (scope.isTimelineExpandedForRecipient[sliceIndex] == year)
    					{
    						scope.closeNestedTimeline(sliceIndex, year);
    					}
    				}
        		});
    			
				// switch year expand-all state
    			scope.yearIsExpandAll[year - TimeService.getTimelineStartYear()] = !scope.yearIsExpandAll[year - TimeService.getTimelineStartYear()];
				
			};
			
			// Handles the logic of expand/collapse for a click on a placemark
			scope.handleClickOnPlacemark = function(selectedSliceIndex, year)
			{
				if (scope.isTimelineExpandedForRecipient[selectedSliceIndex] == 0)
				{					
					scope.openNestedTimeline(selectedSliceIndex, year); // no other placemark is expanded for the same corresponding author
					
					// if the opened timeline expansion was the last/unique one for the specified year, set the year as collapse all
					var placemarkCount = d3.selectAll(".placemark").filter(".y" + year)[0].length;
					var openPlacemarkCount = 0;
					for (var i = 0; i < scope.isTimelineExpandedForRecipient.length; i++) if (scope.isTimelineExpandedForRecipient[i] == year) openPlacemarkCount++;
					if (openPlacemarkCount == placemarkCount) scope.yearIsExpandAll[year - TimeService.getTimelineStartYear()] = false;
				}	
				else
				{
					var existingYear = scope.isTimelineExpandedForRecipient[selectedSliceIndex]; // a placemark is expanded
					scope.closeNestedTimeline(selectedSliceIndex, year); // close the selected one
					if (existingYear != year) scope.handleClickOnPlacemark(selectedSliceIndex, year); // if it was another placemark, expand the selected one
					
					// if the closed timeline expansion was the last/unique one for the specified year, set the year as expand all
					var found = false;
					for (var i = 0; i < scope.isTimelineExpandedForRecipient.length; i++)
					{
						if (scope.isTimelineExpandedForRecipient[i] == year)
						{
							found = true;
							break;
						}
					}
					
					if (!found) scope.yearIsExpandAll[year - TimeService.getTimelineStartYear()] = true;
					
				}
			};
			
			// Handles the expansion of the whole person timeline
			scope.expandTimeline = function(selectedSliceIndex)
			{
				d3.select(".viewer").attr("height", (parseFloat(d3.select(".viewer").attr("height")) + scope.TIMELINE_EXTENSION_HEIGHT));
				
				for (var k = selectedSliceIndex + 1; k < scope.recipientContainerCount; k++)
				{
					d3.selectAll(".recipient-container").filter(".rc" + k)
						.attr("baseX", function(d, i) {return (parseFloat(d3.select(this).attr("baseX")) + 0);})
						.attr("baseY", function(d, i) {return (parseFloat(d3.select(this).attr("baseY")) + scope.TIMELINE_EXTENSION_HEIGHT);})
						.attr("transform", function(d, i) {return "translate(" + d3.select(this).attr("baseX") + "," + d3.select(this).attr("baseY") + ")";});
					
					d3.selectAll(".vertical-line").filter(".rc" + k)
						.attr("y2", function(d, i) {return parseFloat(d3.select(this).attr("y2")) + scope.TIMELINE_EXTENSION_HEIGHT;});
					
					d3.selectAll(".horizontal-line").filter(".rc" + k)
						.attr("y1", function(d, i) {return parseFloat(d3.select(this).attr("y1")) + scope.TIMELINE_EXTENSION_HEIGHT;})
						.attr("y2", function(d, i) {return parseFloat(d3.select(this).attr("y2")) + scope.TIMELINE_EXTENSION_HEIGHT;});
				}
			};
			
			// Handles the compression of the whole person timeline
			scope.compressTimeline = function(selectedSliceIndex)
			{
				for (var k = selectedSliceIndex + 1; k < scope.recipientContainerCount; k++)
				{
					d3.selectAll(".recipient-container").filter(".rc" + k)
						.attr("baseX", function(d, i) {return (parseFloat(d3.select(this).attr("baseX")) + 0);})
						.attr("baseY", function(d, i) {return (parseFloat(d3.select(this).attr("baseY")) - scope.TIMELINE_EXTENSION_HEIGHT);})
						.attr("transform", function(d, i) {return "translate(" + d3.select(this).attr("baseX") + "," + d3.select(this).attr("baseY") + ")";});
					
					d3.selectAll(".vertical-line").filter(".rc" + k)
						.attr("y2", function(d, i) {return parseFloat(d3.select(this).attr("y2")) - scope.TIMELINE_EXTENSION_HEIGHT;});
					
					d3.selectAll(".horizontal-line").filter(".rc" + k)
						.attr("y1", function(d, i) {return parseFloat(d3.select(this).attr("y1")) - scope.TIMELINE_EXTENSION_HEIGHT;})
						.attr("y2", function(d, i) {return parseFloat(d3.select(this).attr("y2")) - scope.TIMELINE_EXTENSION_HEIGHT;});
				}
				
				d3.select(".viewer").attr("height", (parseFloat(d3.select(".viewer").attr("height")) - scope.TIMELINE_EXTENSION_HEIGHT));
			};
			
			// Handles the drawing of the timeline expansion
			scope.drawTimelineExpansion = function(selectedSliceIndex, year)
			{
				var yearLetters = scope.getSliceLettersInYear(selectedSliceIndex, year);
				var parentPlacemark = d3.selectAll(".placemark").filter(".pm" + selectedSliceIndex).filter(".y" + year);
				var placemarkType = parseInt(parentPlacemark.attr("type"));
				var xPlacemark = parseFloat(parentPlacemark.attr("baseX"));
				
				
				var sliceOffset = (selectedSliceIndex + 1) * scope.HORIZONTAL_SLICE_HEIGHT;
				var letterWidth = 15; // width for each letter
				var canvasWidth = CanvasService.getWidth();
			    var widthOfTimelineExpansion = letterWidth * yearLetters.length;
			    var topOfTimelineExpansion = (CanvasService.getHeight()/3 + scope.X_AXIS_HEIGHT + sliceOffset);
				for (var i = 0; i < selectedSliceIndex; i++) if (scope.isTimelineExpandedForRecipient[i]) topOfTimelineExpansion += scope.TIMELINE_EXTENSION_HEIGHT;
				
				var leftOfTimelineExpansion = 0;
			    if (xPlacemark < widthOfTimelineExpansion/2) leftOfTimelineExpansion = 0;
			    else if (xPlacemark > (canvasWidth - widthOfTimelineExpansion/2)) leftOfTimelineExpansion = canvasWidth - widthOfTimelineExpansion;
			    else leftOfTimelineExpansion = xPlacemark - widthOfTimelineExpansion/2;
			    
			    var expansionContainer = d3.select(".chartArea").insert("g", "g.rc" + (selectedSliceIndex))
					.attr("class", "recipient-container expansion rce" + selectedSliceIndex + " rc" + selectedSliceIndex)
					.attr("baseX", 0)
	            	.attr("baseY", topOfTimelineExpansion)
	            	.attr("transform", "translate(0, " + topOfTimelineExpansion + ")");
				
				var timelineExpansionScaleDomain = new Array();
				for (var i = 0; i < yearLetters.length; i++) timelineExpansionScaleDomain.push(i);
				
				var timelineExpansionScale = d3.scale.ordinal()
	    			.rangePoints([0, widthOfTimelineExpansion], 0)
	    			.domain(timelineExpansionScaleDomain);
				
				expansionContainer.append("rect")
					.attr("width", widthOfTimelineExpansion + 80)
					.attr("height", 25)
					.style("fill", "#F5EEDF")
					.style("fill-opacity", "0.70")
					.attr("transform", "translate(" + (leftOfTimelineExpansion - 57) + "," + 4 + ")");
			    
			    var textComposedClass;				   
			    // add people id
			    var isAuthor = DataService.isPersonAuthorById($routeParams.personId, yearLetters[0]); 
			    if (isAuthor) for (var i = 0; i < yearLetters[0].recipients.length; i++) textComposedClass += " p" + yearLetters[0].recipients[i].id;
			    else for (var i = 0; i < yearLetters[0].authors.length; i++) textComposedClass += " p" + yearLetters[0].authors[i].id;
			    
			    // add letters id
			    for (var i = 0; i < yearLetters.length; i++) textComposedClass += " l" + yearLetters[i].id + " t" + yearLetters[i].chapterId;				    
			    
			    // add opacized if needed
		    	if (HighlightService.isPersistent())
		    	{
		    		var highlightedTopicId = HighlightService.getTopicId();
		    		if (highlightedTopicId != null)
		    		{
			    		var found = false;
			    		for (var i = 0; i < yearLetters.length; i++)
			    		{
			    			if (yearLetters[i].chapterId == highlightedTopicId)
			    			{
			    				found = true;
			    				break;
			    			}
			    		}
			    		
			    		if (!found) textComposedClass += " opacized";
		    		}
		    	}
			    
			    expansionContainer.append("text")
			    	.attr("class", "expansion-text " + textComposedClass)
			    	.text(yearLetters[0].accuratYear + "   [")
			    	.attr("text-anchor", "end")
			    	.attr("transform", "translate(" + (leftOfTimelineExpansion - 8) + ",23)");
			    
			    expansionContainer.append("text")
			    	.attr("class", "expansion-text " + textComposedClass)
			    	.text("]")
			    	.attr("text-anchor", "start")
			    	.attr("transform", "translate(" + (leftOfTimelineExpansion - 8 + widthOfTimelineExpansion + 8 + 14) + ",23)");

			    var placemarkOffset = 0;
				if (placemarkType == 0) placemarkOffset = scope.RECT_WIDTH/2;
			    else if (placemarkType == 1) placemarkOffset = scope.RECT_WIDTH/2;
			    else placemarkOffset = scope.RECT_WIDTH;
				
			    for (var i = 0; i < yearLetters.length; i++)
			    {
			    	var letter = yearLetters[i];
			    	var isAuthor = DataService.isPersonAuthorById($routeParams.personId, letter);
			    	var xOffset = leftOfTimelineExpansion + timelineExpansionScale(i);
			    	var lineDasharray;
			    	var lineComposedClass = " l" + letter.id;
			    	
			    	var personComposedClass = "";
			    	if (isAuthor)
			    	{
			    		lineDasharray = scope.VERTICAL_LINES_DASHARRAY_AUTHOR;
			    		for (var k = 0; k < letter.recipients.length; k++) personComposedClass += " p" + letter.recipients[k].id;
			    	}
			    	else
			    	{
			    		lineDasharray = scope.VERTICAL_LINES_DASHARRAY_RECIPIENT;
			    		for (var k = 0; k < letter.authors.length; k++) personComposedClass += " p" + letter.authors[k].id;
			    	}
			    	
			    	var opacizedClass = "";
			    	if (HighlightService.isPersistent())
			    	{
			    		var highlightedTopicId = HighlightService.getTopicId();
			    		if (highlightedTopicId != null && letter.chapterId != highlightedTopicId) opacizedClass = " opacized";
			    	}
			    	
				    // ================================================================================================
			       	// QUADRATIC BEZIER
			       	//var xBezierCurveStart = placemarkOffset + xPlacemark;
				    //var yBezierCurveStart = scope.TIMELINE_EXTENSION_DISTANCE_FROM_PLACEMARK;
				   	//var xBezierCurveEnd = placemarkOffset + xOffset;
			       	//var yBezierCurveEnd = scope.TIMELINE_EXTENSION_CURVES_HEIGHT;			            	
			       	//var xBezierCurveControl = placemarkOffset + xOffset;
			       	//var yBezierCurveControl = scope.TIMELINE_EXTENSION_DISTANCE_FROM_PLACEMARK;
			       	//var dQuadratic = "M" + xBezierCurveStart + "," + yBezierCurveStart + " Q" + xBezierCurveControl1 + "," + yBezierCurveControl1 + " " + xBezierCurveEnd + "," + yBezierCurveEnd;

			    	// ================================================================================================
			       	// CUBIC BEZIER 
			    	var xBezierCurveStart = placemarkOffset + xPlacemark;
				    var yBezierCurveStart = 0; //scope.TIMELINE_EXTENSION_DISTANCE_FROM_PLACEMARK;
			       	var xBezierCurveControl1 = placemarkOffset + xPlacemark;
			       	var yBezierCurveControl1 = scope.TIMELINE_EXTENSION_CURVES_HEIGHT;
			       	var xBezierCurveControl2 = placemarkOffset + xOffset;
			       	var yBezierCurveControl2 = 0; //scope.TIMELINE_EXTENSION_DISTANCE_FROM_PLACEMARK;				       	
			       	var xBezierCurveEnd = placemarkOffset + xOffset;
			       	var yBezierCurveEnd = scope.TIMELINE_EXTENSION_CURVES_HEIGHT;			            	
			       	var dCubic = "M" + xBezierCurveStart + "," + yBezierCurveStart + " C" + xBezierCurveControl1 + "," + yBezierCurveControl1 + " " + xBezierCurveControl2 + "," + yBezierCurveControl2 + " " + xBezierCurveEnd + "," + yBezierCurveEnd;
			       					       	
		        	expansionContainer.append("path")
		        		.attr("class", "bezier-curve " + lineComposedClass + personComposedClass + opacizedClass + " t" + letter.chapterId)
		        		.attr("d", dCubic)
		        		.style("stroke-dasharray", lineDasharray);
					
		        	expansionContainer.append("rect")
		            	.attr("class", "letter-rect l" + letter.id + " t" + letter.chapterId + personComposedClass + opacizedClass)
		        		.style("fill", ColorService.getChapterColor($routeParams.dataType, letter.chapterId))
		            	.attr("letter-id", letter.id)
	        	   		.attr("letter-year", letter.accuratYear)
		            	.attr("transform", "translate(" + (placemarkOffset + xOffset - scope.RECT_WIDTH/2)  + "," + (scope.TIMELINE_EXTENSION_CURVES_HEIGHT - scope.RECT_HEIGHT/2) + ")")
	        	   		.attr("width", scope.RECT_WIDTH)
	        	   		.attr("height", scope.RECT_HEIGHT)
	        	   		.on("mouseover", function(d)
		                {
	        	   			var element = d3.select(this);
	        	   			if (!element.classed("opacized"))
	                    	{
								scope.$apply(function() {HighlightService.setLetterHoverId(element.attr("letter-id"));});
	                    	}
		                })
		                .on("mouseout", function(d)
		                {
		                	var element = d3.select(this);
	        	   			if (!element.classed("opacized"))
	                    	{
			                	var element = d3.select(this);
			                	scope.$apply(function() {HighlightService.setLetterHoverId(null);});
	                    	}
		                })
		                .on("click", function() 
		                {
		                	var element = d3.select(this);
	        	   			if (!element.classed("opacized"))
	        	   			{
	        	   				scope.$apply(function() {PopupService.setPersistent(true);});
	        	   			}
		                });
			    }
			};
			
			
			// ===============================================================================================
			// ELEMENTS DRAWING
			// ===============================================================================================
			
			// Handles recipient containers drawing
			scope.drawRecipientContainer = function(chartArea, sliceIndex, sliceLetters)
			{
				var sliceHeight = scope.HORIZONTAL_SLICE_HEIGHT;
		    	var sliceOffset = (sliceIndex + 1) * scope.HORIZONTAL_SLICE_HEIGHT;
    			
		    	var recipientContainer;
		    	if (scope.drawnRecipientsByContainer[sliceIndex] == null)
		    	{
	    			recipientContainer = chartArea.append("g")
		            	.attr("class", "recipient-container rc" + sliceIndex)
		            	.attr("baseX", 0)
		            	.attr("baseY", (CanvasService.getHeight()/3 + scope.X_AXIS_HEIGHT + sliceOffset))
		            	.attr("transform", "translate(0," + (CanvasService.getHeight()/3 + scope.X_AXIS_HEIGHT + sliceOffset) + ")");
	    			
	    			scope.drawnRecipientsByContainer[sliceIndex] = recipientContainer;
		    	}
		    	else recipientContainer = scope.drawnRecipientsByContainer[sliceIndex];
				
		    	return recipientContainer;
			};
			
			// Manages letters drawing
			scope.drawLetters = function(container, sliceIndex, sliceLetters)
			{
				if (!scope.drawnLettersByRecipient[sliceIndex])
				{
					scope.drawnLettersByRecipient[sliceIndex] = true;
					
					var sliceOffset = (sliceIndex + 1) * scope.HORIZONTAL_SLICE_HEIGHT;
					var sliceLettersByYear = new Array();
					for (var i = 0; i < sliceLetters.length; i++)
					{
						if (!sliceLettersByYear[sliceLetters[i].accuratYear]) sliceLettersByYear[sliceLetters[i].accuratYear] = new Array();
						sliceLettersByYear[sliceLetters[i].accuratYear].push(sliceLetters[i]);
					}
					
					for (var i in sliceLettersByYear)
					{
						var yearLetters = sliceLettersByYear[i];
						if (yearLetters.length == 1) scope.drawRectangle(container, yearLetters[0]);
						else scope.drawPlacemark(container, yearLetters, sliceIndex);
					}
				}				
			};
			
			// Handles rectangles drawing
			scope.drawRectangle = function(container, letter)
			{
				var isAuthor = DataService.isPersonAuthorById($routeParams.personId, letter);
				var rectOffsetActual;
				var composedClass = "";
				
            	if (isAuthor)
            	{
            		rectOffsetActual = scope.RECT_OFFSET_AUTHOR;
            		for (var i = 0; i < letter.recipients.length; i++) composedClass += " p" + letter.recipients[i].id;
            	}
            	else
            	{
            		rectOffsetActual = scope.RECT_OFFSET_RECIPIENT;
            		for (var i = 0; i < letter.authors.length; i++) composedClass += " p" + letter.authors[i].id;
            	}
                
            	container.append("rect")
	            	.attr("class", "letter-rect l" + letter.id + " t" + letter.chapterId + composedClass)
	            	.style("fill", ColorService.getChapterColor($routeParams.dataType, letter.chapterId))
	            	.attr("letter-id", letter.id)
        	   		.attr("letter-year", letter.accuratYear)
	            	.attr("transform", "translate(" + (scope.xScale(letter.accuratYear) + rectOffsetActual)  + "," + scope.RECT_OFFSET_VERTICAL + ")")
        	   		.attr("width", scope.RECT_WIDTH)
        	   		.attr("height", scope.RECT_HEIGHT)
        	   		.on("mouseover", function(d)
	                {
        	   			var element = d3.select(this);
        	   			if (!element.classed("opacized"))
                    	{
							scope.$apply(function() {HighlightService.setLetterHoverId(element.attr("letter-id"));});
                    	}
	                })
	                .on("mouseout", function(d)
	                {
	                	var element = d3.select(this);
        	   			if (!element.classed("opacized"))
                    	{
		                	var element = d3.select(this);
		                	scope.$apply(function() {HighlightService.setLetterHoverId(null);});
                    	}
	                })
	                .on("click", function() 
	                {
	                	var element = d3.select(this);
        	   			if (!element.classed("opacized"))
	                	{
        	   				scope.$apply(function() {PopupService.setPersistent(true);});
	                	}
	                });
        	};
			
        	// Handles placemarks drawing
			scope.drawPlacemark = function(container, yearLetters, sliceIndex)
			{
				var composedClass = "";
				for (var i = 0; i < yearLetters.length; i++) composedClass += " t" + yearLetters[i].chapterId + " l" + yearLetters[i].id;
				
				var isAuthor = false;
				for (var i = 0; i < yearLetters.length; i++)
				{
					if (DataService.isPersonAuthorById($routeParams.personId, yearLetters[i]))
					{
						isAuthor = true;
						for (var j = 0; j < yearLetters[i].recipients.length; j++) composedClass += " p" + yearLetters[i].recipients[j].id;
					}
				}
				
				var isRecipient = false;
				for (var i = 0; i < yearLetters.length; i++)
				{
					if (DataService.isPersonRecipientById($routeParams.personId, yearLetters[i]))
					{
						isRecipient = true;
						for (var j = 0; j < yearLetters[i].authors.length; j++) composedClass += " p" + yearLetters[i].authors[j].id;
					}
				}
				
				var placemarkType = 0;
				if (!isAuthor && isRecipient) placemarkType = 1;
				else if (isAuthor && isRecipient) placemarkType = 2; 
				
				var placemarkOffsetActual;
				var placemarkWidthActual;
				
				if (placemarkType == 0)
				{
					// author is only author
					placemarkOffsetActual = scope.PLACEMARK_OFFSET_AUTHOR;
					placemarkWidthActual = scope.PLACEMARK_WIDTH_SINGLE;
				}
				else if (placemarkType == 1)
				{
					// author is only recipient
					placemarkOffsetActual = scope.PLACEMARK_OFFSET_RECIPIENT;
					placemarkWidthActual = scope.PLACEMARK_WIDTH_SINGLE;
				}
				else
				{
					// author is both
					placemarkOffsetActual = scope.PLACEMARK_OFFSET_AUTHOR;
					placemarkWidthActual = scope.PLACEMARK_WIDTH_MULTI;
				}
				
				var year = yearLetters[0].accuratYear;
				var placemarkOffsetHorizontal = (scope.xScale(year) + placemarkOffsetActual);
				
				container.append("rect")
                   	.attr("class", "placemark pm" + sliceIndex + " y" + year + composedClass)
                   	.attr("recipient-container-id", sliceIndex)
                   	.attr("year", year)
                   	.attr("type", placemarkType)
                   	.attr("baseX", placemarkOffsetHorizontal)
            	   	.attr("transform", "translate(" + placemarkOffsetHorizontal  + "," + scope.PLACEMARK_OFFSET_VERTICAL + ")")
        	   		.attr("width", placemarkWidthActual)
        	   		.attr("height", scope.PLACEMARK_HEIGHT)
        	   		.on("click", function(d)
	                {
        	   			var element = d3.select(this);
        	   			if (!element.classed("opacized"))
        	   			{
        	   				scope.handleClickOnPlacemark(parseInt(d3.select(this).attr("recipient-container-id")), parseInt(d3.select(this).attr("year")));
        	   			}
	                });
				
				d3.selectAll("text").filter(".y" + year).classed("expand-all", true);
            	
			};
			
        	// Handles horizontal lines drawing 
			scope.drawHorizontalLine = function(horizontalLinesContainer, sliceLetters, sliceIndex, sliceClass)
			{
				if (sliceLetters.length > 1)
				{
					var sliceOffset = (sliceIndex + 1) * scope.HORIZONTAL_SLICE_HEIGHT;
					
					var firstLetter = sliceLetters[0];
					var lastLetter = sliceLetters[sliceLetters.length - 1];
	        		
					var x1base = scope.xScale(firstLetter.accuratYear);
		            var x1offset;
		            if (DataService.isPersonAuthorById($routeParams.personId, firstLetter)) x1offset = scope.HORIZONTAL_LINES_OFFSET_AUTHOR;
		            else x1offset = scope.HORIZONTAL_LINES_OFFSET_RECIPIENT;
		            var x1 = x1base + x1offset;
					
		            // skip first letter
					for (var i = 1; i < sliceLetters.length; i++)
					{
		        		var letter = sliceLetters[i];
						
		        		// ignore multiple first letters 
		        		if (letter.accuratYear != firstLetter.accuratYear)
		        		{
			        		var x2base = scope.xScale(letter.accuratYear); 
				            var x2offset;
				            if (DataService.isPersonAuthorById($routeParams.personId, letter)) x2offset = scope.HORIZONTAL_LINES_OFFSET_AUTHOR;
				            else x2offset = scope.HORIZONTAL_LINES_OFFSET_RECIPIENT;
				            var x2 = x2base + x2offset;
			        		
				            var length = x2-x1;
				            
			        		var horizontalLine = horizontalLinesContainer.insert("line", ":first-child")
			        			.attr("class", "horizontal-line " + sliceClass + " l" + letter.id + " rc" + sliceIndex + " t" + letter.chapterId)
			        			.attr("length", length)
			        			.attr("x1", x1)
				                .attr("y1", scope.HORIZONTAL_LINES_OFFSET_VERTICAL)
				                .attr("x2", x2)
				                .attr("y2", scope.HORIZONTAL_LINES_OFFSET_VERTICAL)
				                .attr("transform", "translate(0," + (CanvasService.getHeight()/3 + scope.X_AXIS_HEIGHT + sliceOffset) + ")");
				                //.style("stroke", scope.HORIZONTAL_LINES_COLOR)
				                //.style("stroke-width", scope.HORIZONTAL_LINES_WIDTH);
							
			        		var existingHorizontalLine = scope.drawnHorizontalLinesByRecipient[sliceIndex];
							if (existingHorizontalLine == null)
							{
								// no existing lines in year
								// make visible the one just drawn
								horizontalLine.attr("id", "static");
								scope.drawnHorizontalLinesByRecipient[sliceIndex] = horizontalLine;
							}
							else
							{
								// there exist already drawn lines
								if (parseFloat(horizontalLine.attr("length")) >= parseFloat(existingHorizontalLine.attr("length")))
								{
									existingHorizontalLine.classed("hidden", true);
									existingHorizontalLine.attr("id", "dynamic");									
									horizontalLine.attr("id", "static");
									scope.drawnHorizontalLinesByRecipient[sliceIndex] = horizontalLine;
								}
								else
								{
									horizontalLine.classed("hidden", true);
									horizontalLine.attr("id", "dynamic");
								}
							}
		        		}
					}
				}
			};
			
			// Handles vertical lines drawing
			scope.drawVerticalLine = function(container, letter, sliceIndex)
			{
				var sliceOffset = (sliceIndex + 1) * scope.HORIZONTAL_SLICE_HEIGHT;
				var isAuthor = DataService.isPersonAuthorById($routeParams.personId, letter);
				var drawnVerticalLinesByYear;
				var verticalLineOffsetActual;
				var verticalLineDasharray;
				var composedClass;
				
				if (isAuthor)
			    {
					drawnVerticalLinesByYear = scope.drawnVerticalLinesAuthorByYear;
					verticalLineOffsetActual = scope.VERTICAL_LINES_OFFSET_AUTHOR;
    				verticalLineDasharray = scope.VERTICAL_LINES_DASHARRAY_AUTHOR;
    				composedClass = DataService.getComposedRecipientClass(letter);
			    }
			    else
			    {
			    	drawnVerticalLinesByYear = scope.drawnVerticalLinesRecipientByYear;
			    	verticalLineOffsetActual = scope.VERTICAL_LINES_OFFSET_RECIPIENT;
    				verticalLineDasharray = scope.VERTICAL_LINES_DASHARRAY_RECIPIENT;
    				composedClass = DataService.getComposedAuthorClass(letter);
			    }
				
				var verticalLine = container.insert("line", ":first-child")
					.attr("class", "vertical-line " + composedClass + " l" + letter.id + " rc" + sliceIndex + " t" + letter.chapterId)
					.attr("length", sliceOffset)
	                .style("stroke-dasharray", verticalLineDasharray)
	                .attr("transform", "translate(0," + (CanvasService.getHeight()/3 + scope.X_AXIS_HEIGHT + sliceOffset) + ")")
                	.attr("x1", scope.xScale(letter.accuratYear) + verticalLineOffsetActual)
	                .attr("y1", -(sliceOffset + scope.DISTANCE_TIMELINE_TO_VERTICAL_LINES))
	                .attr("x2", scope.xScale(letter.accuratYear) + verticalLineOffsetActual)
	                .attr("y2", scope.VERTICAL_LINES_OFFSET_VERTICAL);
				
				var existingVerticalLine = drawnVerticalLinesByYear[letter.accuratYear];
				if (existingVerticalLine == null)
				{
					// no existing lines in year
					// make visible the one just drawn
					verticalLine.attr("id", "static");
					drawnVerticalLinesByYear[letter.accuratYear] = verticalLine;
				}
				else
				{
					// there exist already drawn lines
					if (parseFloat(verticalLine.attr("length")) > parseFloat(existingVerticalLine.attr("length")))
					{
						// new one is longer than existing one
						existingVerticalLine.classed("hidden", true);
						existingVerticalLine.attr("id", "dynamic");
						verticalLine.attr("id", "static");
						drawnVerticalLinesByYear[letter.accuratYear] = verticalLine;
					}
					else
					{
						verticalLine.classed("hidden", true);
						verticalLine.attr("id", "dynamic");
					}
				}
			};
			
			// Handles bezier curves drawing
			scope.drawBezierCurve = function(container, letter)
			{
				var isAuthor = DataService.isPersonAuthorById($routeParams.personId, letter);
				
				// punto fisso di partenza delle curve di bezier
			    var xBezierCurveStart = (CanvasService.getWidth()/2);
			    var yBezierCurveStart = 0;
			    
			    var drawnBezierCurvesByYear;
			    var verticalLineOffsetActual;
			    var verticalLineDasharray;
			    
			    var composedClass;
			    
			    if (isAuthor)
			    {
			    	drawnBezierCurvesByYear = scope.drawnBezierCurvesAuthorByYear;
			    	verticalLineOffsetActual = scope.VERTICAL_LINES_OFFSET_AUTHOR;
    				verticalLineDasharray = scope.VERTICAL_LINES_DASHARRAY_AUTHOR;
    				composedClass = DataService.getComposedRecipientClass(letter) + " l" + letter.id + " t" + letter.chapterId;
			    }
			    else
			    {
			    	drawnBezierCurvesByYear = scope.drawnBezierCurvesRecipientByYear;
			    	verticalLineOffsetActual = scope.VERTICAL_LINES_OFFSET_RECIPIENT;
    				verticalLineDasharray = scope.VERTICAL_LINES_DASHARRAY_RECIPIENT;
    				composedClass = DataService.getComposedAuthorClass(letter) + " l" + letter.id + " t" + letter.chapterId;
			    }
			    
			    var existingBezierCurve = drawnBezierCurvesByYear[letter.accuratYear];
				if (existingBezierCurve == null)
				{
					// no existing beziers in year
					// draw the curve
					// make it visible
					// set it as drawn
					
					var xBezierCurveEnd = scope.xScale(letter.accuratYear) + verticalLineOffsetActual;
		        	var yBezierCurveEnd = CanvasService.getHeight()/6 - scope.DISTANCE_AUTHOR_NAME_TO_BEZIER_CURVES - scope.DISTANCE_BEZIER_CURVES_TO_TIMELINE;			            	
		        	var xBezierCurveControl = scope.xScale(letter.accuratYear) + verticalLineOffsetActual;
		        	var yBezierCurveControl = 0;
		        	
		        	var d = "M" + xBezierCurveStart + "," + yBezierCurveStart + " Q" + xBezierCurveControl + "," + yBezierCurveControl + " " + xBezierCurveEnd + "," + yBezierCurveEnd;
		        	
		        	var bezierCurve = container.append("path")
		        		.attr("class", "bezier-curve " + composedClass)
		        		.attr("id", "static")
		        		.attr("d", d)
		        		.style("stroke-dasharray", verticalLineDasharray);
					
					drawnBezierCurvesByYear[letter.accuratYear] = bezierCurve;
				}
				else
				{
					// curve is already existing
					// just update curve class attributes
					var existingBezierCurveClass = existingBezierCurve.attr("class");
					existingBezierCurveClass += " " + composedClass;
					existingBezierCurve.attr("class", existingBezierCurveClass);
				}
			};
			
			// Handles corresponding authors' names drawing
			scope.drawName = function(container, sliceIndex, sliceLetters)
			{
        		var firstLetter = sliceLetters[0];
				var isAuthor = DataService.isPersonAuthorById($routeParams.personId, firstLetter);
        		
				var composedClass;
        		if (isAuthor) composedClass = DataService.getComposedRecipientClass(firstLetter);
        		else composedClass = DataService.getComposedAuthorClass(firstLetter);
        		
        		if (!scope.drawnRecipientNames[sliceIndex])
	    		{
	    			scope.drawnRecipientNames[sliceIndex] = true;
	    		
	    			var label = container.append("text")
						.attr("class", "corresponding-person-container")
						.attr("text-anchor", "end")
						.attr("transform", "translate(" + (scope.xScale(firstLetter.accuratYear) - scope.DISTANCE_PERSON_NAME_TO_FIRST_LETTER)  + "," + scope.DISTANCE_PERSON_NAME_FROM_BASELINE + ")");
					
					var peopleCollection;
					if (isAuthor) peopleCollection = firstLetter.recipients;
					else peopleCollection = firstLetter.authors;
					
					for (var i = 0; i < peopleCollection.length; i++)
					{
						var nameToken;
						if (isAuthor) nameToken = DataService.getComposedRecipientNameToken(firstLetter, i);
						else nameToken = DataService.getComposedAuthorNameToken(firstLetter, i);
						
						var composedClassLetters = "";
						for (var j = 0; j < sliceLetters.length; j++) composedClassLetters += " l" + sliceLetters[j].id + " t" + sliceLetters[j].chapterId;
						
						label.append("tspan")
		        			.text(nameToken)
		        			.attr("class", "person-name-token p" + peopleCollection[i].id + composedClassLetters)
		        			.attr("person-id", peopleCollection[i].id)
		        			.on("click", function(d) 
			                {
		        				var element = d3.select(this);
		        				if (!element.classed("opacized"))
		        				{
			        				HighlightService.setPersonHoverId(null);
			        				var url = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWho);
			                    	url = LocationService.setUrlParameter(SymbolsService.urlTokenPerson, element.attr("person-id"));
			                    	window.location = url;
		        				}
			                })
			                .on("mouseover", function(d)
			                {
								var element = d3.select(this);
								scope.$apply(function() {HighlightService.setPersonHoverId(element.attr("person-id"));});
			                })
			                .on("mouseout", function(d)
			                {
			                	var element = d3.select(this);
			                	scope.$apply(function() {HighlightService.setPersonHoverId(null);});
			                });
					}
	    		}
        		
        		return composedClass;
			};
			
			// ===============================================================================================
			// HELPER METHODS
			// ===============================================================================================
			
			scope.initializeDummyVariables = function()
			{
			    for (var year in TimeService.getYears())
			    {
			    	scope.drawnBezierCurvesAuthorByYear[year] = false;
				    scope.drawnBezierCurvesRecipientByYear[year] = false;
				    
				    scope.drawnVerticalLinesAuthorByYear[year] = null;
				    scope.drawnVerticalLinesRecipientByYear[year] = null;
				    
				    scope.yearIsExpandAll[year] = true;
			    }
			    
			    for (var recipientIndex = 0; recipientIndex < scope.dataTimelinePerson.length; recipientIndex++)
			    {
			    	scope.drawnRecipientsByContainer[recipientIndex] = null;
			    	scope.drawnLettersByRecipient[recipientIndex] = false;
			    	scope.drawnRecipientNames[recipientIndex] = false;
			    	scope.drawnHorizontalLinesByRecipient[recipientIndex] = null;
			    	scope.isTimelineExpandedForRecipient[recipientIndex] = 0;
			    }
			};
			
			scope.sliceHasLettersInYear = function(sliceLetters, year)
			{
				var found = false;
				for (var i = 0; i < sliceLetters.length; i++)
				{
					if (sliceLetters[i].accuratYear == year)
					{
						found = true;
						break;
					}
				}
				return found;
			};
			
			scope.hasProcessedLetter = function(letterId)
			{
				found = false;
				for (var i = 0; i < scope.processedLetterIds.length; i++)
				{
					if (scope.processedLetterIds[i] == letterId)
					{
						found = true;
						break;
					}
				}
				return found;
			};
			
			scope.hasProcessedRecipient = function(recipientId)
			{
				found = false;
				for (var i = 0; i < scope.processedRecipientIds.length; i++)
				{
					if (scope.processedRecipientIds[i] == recipientId)
					{
						found = true;
						break;
					}
				}
				return found;
			};
			
			scope.getSliceLettersInYear = function(sliceIndex, year)
			{
				var sliceLettersInYear = [];
				if (sliceIndex == null) return sliceLettersInYear;
				if (year == null) return sliceLettersInYear;
				
				for (var i = 0; i < scope.dataTimelinePerson[sliceIndex].length; i++)
				{
					if (scope.dataTimelinePerson[sliceIndex][i].accuratYear == year) sliceLettersInYear.push(scope.dataTimelinePerson[sliceIndex][i]);
				}
				
				return sliceLettersInYear;
			};
			
		}
	};
}]);