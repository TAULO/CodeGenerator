//var chart; // global
var receiver = 0;
var checked = 0;



$(document).ready(function() {
    "use strict";
    $.ajaxSetup({
        cache: false
    });

    /*******************************************************************************
     * DataTables twitter bootstrap
     ********************************************************************************/
    $.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings) {
        return{"iStart": oSettings._iDisplayStart, "iEnd": oSettings.fnDisplayEnd(), "iLength": oSettings._iDisplayLength, "iTotal": oSettings.fnRecordsTotal(), "iFilteredTotal": oSettings.fnRecordsDisplay(), "iPage": Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength), "iTotalPages": Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)}
    };
    $.extend($.fn.dataTableExt.oPagination, {"bootstrap": {"fnInit": function(oSettings, nPaging, fnDraw) {
                var oLang = oSettings.oLanguage.oPaginate;
                var fnClickHandler = function(e) {
                    e.preventDefault();
                    if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
                        fnDraw(oSettings)
                    }
                };
                $(nPaging).addClass('pagination').append('<ul>' + '<li class="prev disabled"><a href="#">&larr; ' + oLang.sPrevious + '</a></li>' + '<li class="next disabled"><a href="#">' + oLang.sNext + ' &rarr; </a></li>' + '</ul>');
                var els = $('a', nPaging);
                $(els[0]).bind('click.DT', {action: "previous"}, fnClickHandler);
                $(els[1]).bind('click.DT', {action: "next"}, fnClickHandler)
            }, "fnUpdate": function(oSettings, fnDraw) {
                var iListLength = 5;
                var oPaging = oSettings.oInstance.fnPagingInfo();
                var an = oSettings.aanFeatures.p;
                var i, j, sClass, iLen, iStart, iEnd, iHalf = Math.floor(iListLength / 2);
                if (oPaging.iTotalPages < iListLength) {
                    iStart = 1;
                    iEnd = oPaging.iTotalPages;
                } else if (oPaging.iPage <= iHalf) {
                    iStart = 1;
                    iEnd = iListLength;
                } else if (oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
                    iStart = oPaging.iTotalPages - iListLength + 1;
                    iEnd = oPaging.iTotalPages;
                } else {
                    iStart = oPaging.iPage - iHalf + 1;
                    iEnd = iStart + iListLength - 1;
                }

                for (i = 0, iLen = an.length; i < iLen; i++) {
                    $('li:gt(0)', an[i]).filter(':not(:last)').remove();
                    for (j = iStart; j <= iEnd; j++) {
                        sClass = (j == oPaging.iPage + 1) ? 'class="active"' : '';
                        $('<li ' + sClass + '><a href="#">' + j + '</a></li>').insertBefore($('li:last', an[i])[0]).bind('click', function(e) {
                            e.preventDefault();
                            oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
                            fnDraw(oSettings);
                        });
                    }
                    if (oPaging.iPage === 0) {
                        $('li:first', an[i]).addClass('disabled');
                    } else {
                        $('li:first', an[i]).removeClass('disabled');
                    }
                    if (oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0) {
                        $('li:last', an[i]).addClass('disabled');
                    } else {
                        $('li:last', an[i]).removeClass('disabled');
                    }
                }
            }}});


    function PlotViewModel() {
        // Data
        var self = this;

        //View Model Variables
        self.chart = ko.observable();
        self.chart2 = ko.observable();
        self.plot = ko.observable();
        self.testBench = ko.observable();
        self.configuration = ko.observable();
        self.sim = ko.observable();
        self.simTable = ko.observable();
        self.recentPlotTable = ko.observable();

        self.timeSeriesVar = ko.observable();
        self.variables = ko.observableArray();
        self.searchVariables = ko.observableArray();
        self.checkedVariables = ko.observableArray();
        self.varDownloadLink = ko.observable();
        self.paramDownloadLink = ko.observable();
        self.csvExportReady = ko.observable(false);
        self.graphItems = ko.observableArray([]);
        self.tbItems = ko.observableArray([]);
        self.confItems = ko.observableArray([]);
        self.simItems = ko.observableArray([]);
        self.plotItems = ko.observableArray([]);

        self.plotName = ko.observable();
        self.simID = ko.observable();

        self.newTestBenchName = ko.observable();
        self.openAddTestbenchModal = function() {
            $("#addTestbenchModal").modal('show');
        };
        self.addTestBench = function() {

            $("#testBenchCreateSubmitButton").hide();
            $("#testBenchCreatingButton").show();

            var post_data = {
                testBenchName: self.newTestBenchName()
            };

            console.log(post_data);

            $.post("/simviz_rest/createTestBench/", post_data, function(result) {
                //var json = $.parseJSON(result);
                console.log(result);

                if (result.status === 1)
                {
                    $.sticky(result.message, {autoclose: 5000, position: "top-center", type: "st-success"});

                    $("#addTestbenchModal").modal('hide');
                    $("#testBenchCreateSubmitButton").show();
                    $("#testBenchCreatingButton").hide();

                    //getTestBenches
                    self.getTestBenches();
                }
                else
                {
                    $.sticky(result.message, {autoclose: 5000, position: "top-center", type: "st-error"});
                    $("#testBenchCreateSubmitButton").show();
                    $("#testBenchCreatingButton").hide();
                }

            });
        };

        self.newConfigurationName = ko.observable();
        self.openAddConfigurationModal = function() {
            console.log("add config clicked");
            $("#addConfigurationModal").modal('show');
        };
        self.addConfiguration = function() {

            $("#configurationCreateSubmitButton").hide();
            $("#configurationCreatingButton").show();

            var post_data = {
                configName: self.newConfigurationName()
            };

            console.log(post_data);

            $.post("/simviz_rest/createConfiguration/", post_data, function(result) {
                //var json = $.parseJSON(result);
                console.log(result);

                if (result.status === 1)
                {
                    $.sticky(result.message, {autoclose: 5000, position: "top-center", type: "st-success"});

                    $("#addConfigurationModal").modal('hide');
                    $("#configurationCreateSubmitButton").show();
                    $("#configurationCreatingButton").hide();

                    //getTestBenches
                    self.getConfigurations();
                }
                else
                {
                    $.sticky(result.message, {autoclose: 5000, position: "top-center", type: "st-error"});
                    $("#configurationCreateSubmitButton").show();
                    $("#configurationCreatingButton").hide();
                }

            });
        };

        self.dashPage = ko.observable();
        self.confID = ko.observable(0);
        self.tbID = ko.observable(0);

        self.selectedTestBench = ko.observable(0);
        self.selectedConfiguration = ko.observable(0);

        self.includeFilePath = "/simviz/";
        self.fileUploadEntry = ko.observable();

        self.initPlot = function(plotID) {
            //      var post_data = {
            //        plotID: plotID
            //      };

            //            $.post("/simviz_rest/getPlotJSON", post_data, function(result) {
            //              var json = $.parseJSON(result);
            //              self.plot(new Plot(json));
            //
            //              console.log(self.plot().plot_id());
            //
            //              self.initTime();
            //              self.initializeChart();
            //              self.initChartSettings();
            //            });
            //            
            $.post("/simviz_rest/getPlotInfoFromDB/" + plotID, {}, function(result) {
                //var json = $.parseJSON(result);
                self.plot(new Plot(result.settings));
                self.graphItems = ko.observableArray([]);

                console.log(self.plot().plotSettings());

                self.initializeD3Chart();
                self.initChartSettings();
            });
        };
        self.getTestBenchInfo = function(tbID) {
            $.post("/simviz_rest/getTestBench/" + tbID, {}, function(result) {
                //var json = $.parseJSON(result);
                self.testBench(new TestBench(result.data));
                console.log(self.testBench());
            });
        };
        self.getSimulationInfo = function(simID) {
            $.post("/simviz_rest/getSimulation/" + simID, {}, function(result) {
                //var json = $.parseJSON(result);
                self.sim(new Simulation(result.data[0]));
                console.log(self.sim().simIndexedFlag());

                if (!self.sim().simIndexedFlag())
                {
                    console.log("This sim needs to be indexed");
                    $("#IndexingDialog").modal({backdrop: false});
                    $("#IndexingDialog").modal('show');
//                    $("#IndexingDialog").modal("show");
                    $.post("/simviz_rest/loadVariables/" + simID, {}, function(result) {
                        $("#IndexingDialog").modal("hide");
                    });
                }
            });
        };
        self.getConfigurationInfo = function(confID) {
            $.post("/simviz_rest/getConfiguration/" + confID, {}, function(result) {
                //var json = $.parseJSON(result);
                self.configuration(new Configuration(result.data));
                console.log(self.configuration());
            });
        };

        self.getSimulations = function(tbID, confID) {

            var url = "/simviz_rest/getSimulationByTestBenchConfigIDs/" + tbID + "/" + confID;
            console.log(url);

            if (tbID === 0 && confID === 0) {
                url = "/simviz_rest/getSimulations/";
            }

            //self.simItems.removeAll();

            $.post(url, {}, function(result) {
                //var json = $.parseJSON(result);
                self.simItems.removeAll();

                $.each(result.data[0], function() {
                    self.simItems.push(new Simulation(this));
                });
                console.log(self.simItems());

                if ($('#simListTable').length)
                {
                    console.log('exists');

                    if (self.simTable() == false || self.simTable() == null || self.simTable() == undefined || self.simTable().fnSettings().aoData.length == 0)
                    {
                        self.simTable($('#simListTable').dataTable({
                            "bJQueryUI": false,
                            "bAutoWidth": false,
                            "sPaginationType": "bootstrap",
                            "sDom": '<"H"fl>t<"F"ip>',
                            "aaSorting": [[4, "desc"]],
                            "iDisplayLength": 25,
                            "aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                            "aoColumnDefs": [
                                {"iDataSort": 4, "aTargets": [3]},
                                {"bVisible": 0, "aTargets": [4]}
                            ]
                        }));

                    }
                }
            });
        };

        self.getConfigurations = function() {

            var url = "/simviz_rest/getConfigurations/";

            $.post(url, {}, function(result) {
                //var json = $.parseJSON(result);
                self.confItems.removeAll();

                $.each(result.data, function() {
                    self.confItems.push(new Configuration(this));
                });
                console.log(self.confItems());
            });
        };

        self.getTestBenches = function() {

            var url = "/simviz_rest/getTestBenches/";

            $.post(url, {}, function(result) {
                //var json = $.parseJSON(result);
                self.tbItems.removeAll();

                $.each(result.data, function() {
                    self.tbItems.push(new TestBench(this));
                });
                console.log(self.tbItems());
            });
        };

        self.getPlots = function(simID) {

            var url = "/simviz_rest/getPlotsBySimID/" + simID;

            if (simID === 0) {
                url = "/simviz_rest/getPlots/";
            }

            $.post(url, {}, function(result) {
                //var json = $.parseJSON(result);
                
                console.log(result.data);
                $.each(result.data, function() {
                    console.log(new Plot(this));
                    self.plotItems.push(new Plot(this));
                });
                //console.log(self.plotItems());
                
                
                
                
            });
        };

        self.getRecentPlots = function() {

            var url = "/simviz_rest/getRecentPlots/";
            $.post(url, {}, function(result) {
                //var json = $.parseJSON(result);
                $.each(result.data, function() {
                    self.plotItems.push(new Plot(this));
                });
                //console.log(self.plotItems());
                
                if ($('#plotListTable').length)
                {
                    //console.log('exists');

                    if (self.recentPlotTable() == false || self.recentPlotTable() == null || self.recentPlotTable() == undefined || self.recentPlotTable().fnSettings().aoData.length == 0)
                    {
                        self.recentPlotTable($('#plotListTable').dataTable({
                            "bJQueryUI": false,
                            "bAutoWidth": false,
                            "sPaginationType": "bootstrap",
                            "sDom": '<"H"fl>t<"F"ip>',
                            "aaSorting": [[6, "desc"]],
                            "iDisplayLength": 25,
                            "aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                            "aoColumnDefs": [
                                {"iDataSort": 5, "aTargets": [4]},
                                {"bVisible": 0, "aTargets": [5]},
                                {"iDataSort": 7, "aTargets": [6]},
                                {"bVisible": 0, "aTargets": [7]}
                            ]
                        }));

                    }
                }
                
            });
        };


        self.fileUploadEntry.subscribe(function(newValue) {
            var filename = $("#fileUploadEntry").val();
            var extension = filename.replace(/^.*\./, '');

            // Iff there is no dot anywhere in filename, we would have extension == filename,
            // so we account for this possibility now
            if (extension == filename) {
                extension = '';
            } else {
                // if there is an extension, we convert to lower case
                // (N.B. this conversion will not effect the value of the extension
                // on the file upload.)
                extension = extension.toLowerCase();
            }

            if (extension == "zip") {
                console.log('Extension is Zip');
                $("#testbench").hide();
                $("#configuration").hide();
            } else {
                console.log("Extension is: " + extension);

                $("#testbench").show();
                $("#configuration").show();

            }


//            alert(filename);
        });

        self.createNewPlot = function() {
            $("#submitCreatePlotForm").hide();
            $("#plotCreatingButton").show();

			console.log(self.sim());
			
            var post_data = {
                simID: self.sim().simID(),
                plotName: self.plotName()
            };

            console.log(post_data);

            $.post("/simviz_rest/createPlot/", post_data, function(result) {
                //var json = $.parseJSON(result);
                console.log(result);

                if (result.status === 1)
                {
                    $.sticky(result.message, {autoclose: 5000, position: "top-center", type: "st-success"});

                    $("#newPlotDialog").modal('hide');
                    $("#submitCreatePlotForm").show();
                    $("#plotCreatingButton").hide();

                    window.location = "/simviz/plot.html?plotID=" + result.plot.plotID;
                }
                else
                {
                    $.sticky(result.message, {autoclose: 5000, position: "top-center", type: "st-error"});
                    $("#submitCreatePlotForm").show();
                    $("#plotCreatingButton").hide();
                }

            });
        };

        self.initStaticPlot = function() {

            $.post("/simviz_rest/getPlotJson/", {}, function(result) {
                //var json = $.parseJSON(result);
                self.plot(new Plot(result.settings));
                self.graphItems = ko.observableArray([]);

                console.log(self.plot().plotSettings());

                self.initializeD3Chart();
                self.initChartSettings();
            });
        };
        self.initTime = function() {
            var post_data = {
                plotID: 1
            };

            $.post("/simviz_rest/getTimeSeries/", post_data, function(result) {
                console.log(result);
                //var json = $.parseJSON(result);
                self.timeSeriesVar(new Variable(result.time));

                console.log(self.timeSeriesVar().variable_id());

                //Do Dummy Variables
                var var1 = {
                    variable_id: 51006,
                    name: "MassSpringDamper.Damper__Damper_10.Damper_mo.lossPower",
                    short_name: "lossPower",
                    data_link: "var_0.json",
                    plot_id: 1,
                    type: "var"
                };
                //
                //              var var2 = {
                //                variable_id: 51002,
                //                name: "MassSpringDamper.Damper__Damper_10.Damper_mo.flange_a.f",
                //                short_name: "f",
                //                data_link: "var_0.json",
                //                plot_id: 1,
                //                type: "var"
                //              };
                //
                //              var var3 = {
                //                variable_id: 51002,
                //                name: "MassSpringDamper.Damper__Damper_10.Damper_mo.v_rel",
                //                short_name: "f",
                //                data_link: "var_0.json",
                //                plot_id: 1,
                //                type: "var"
                //              };

                $.each(self.plot().plotSettings().series, function() {
                    console.log(this);
                    self.doD3ChartYDraw(new Variable(this));
                });

                self.doD3ChartYDraw(new Variable(var1));
                //              self.doD3ChartYDraw(new Variable(var2));
                //              self.doD3ChartYDraw(new Variable(var3));

            });
        };
        self.initializeD3Chart = function() {
            nv.addGraph(function() {

                var chart = nv.models.lineChart();
                chart.xAxis
                        .axisLabel('Time (ms)')
                        .tickFormat(d3.format(',r'));

                chart.yAxis
                        .axisLabel('')
                        .tickFormat(d3.format('.02f'));

                d3.select('#chart svg')
                        .datum(self.graphItems())
                        .transition().duration(500)
                        .call(chart);

                nv.utils.windowResize(function() {
                    d3.select('#chart svg').call(chart);
                });

                self.chart(chart);

                return chart;
            });

            self.initTime();
        };

        self.initializeD3ScatterPlotChart = function() {
            nv.addGraph(function() {

                var chart = nv.models.scatterChart()
                        .showDistX(true)
                        .showDistY(true)
                        .color(d3.scale.category10().range());

                //              chart.xAxis
                //                      .axisLabel('Time (ms)')
                //                      .tickFormat(d3.format(',r'));
                //
                //              chart.yAxis
                //                      .axisLabel('')
                //                      .tickFormat(d3.format('.02f'));

                chart.xAxis.axisLabel('Time (ms)').tickFormat(d3.format('.02f'));
                chart.yAxis.tickFormat(d3.format('.02f'));

                d3.select('#chart svg')
                        .datum(self.graphItems())
                        .transition().duration(500)
                        .call(chart);

                nv.utils.windowResize(function() {
                    d3.select('#chart svg').call(chart);
                });

                self.chart(chart);

                return chart;
            });

            self.initTime();
        };
        self.initializeD3BarChart = function() {
            nv.addGraph(function() {


                var width = nv.utils.windowSize().width - 40,
                        height = nv.utils.windowSize().height - 40;

                var chart = nv.models.multiBar()
                        .width(width)
                        .height(height)
                        .stacked(true)

                d3.select('#chart svg')
                        .datum(testData())
                        .transition().duration(500)
                        .call(chart);

                nv.utils.windowResize(function() {
                    d3.select('#chart svg').call(chart);
                });

                self.chart(chart);

                return chart;
            });

            self.initTime();
        };
        self.doD3ChartYDraw = function(yvar) {
            var settings = self.plot().plotSettings(),
                    name = yvar.name(),
                    seriesShortName = yvar.name(),
                    id = yvar.variable_id(),
                    data_link = "";

            var time_data_link = self.includeFilePath
                    + settings.data_folder
                    + self.timeSeriesVar().data_link();
            console.log(time_data_link);

            var time = new Array();

            $.getJSON(time_data_link, function(json) {
                $.each(json, function(i, obj) {

                    if (obj.name === "time") {
                        data_link = self.includeFilePath + settings.data_folder + obj.data_link;
                        $.getJSON(data_link, function(ts_json) {
                            $.each(ts_json[obj.index], function(j, obj2) {
                                time.push(obj2);
                            });
                            //                      console.log(time);

                            //Once we have time, do awesome things
                            if (yvar.data_link().indexOf("var") > -1) {
                                console.log("var");
                                var var_data_link = self.includeFilePath + settings.data_folder + yvar.data_link();
                                console.log(var_data_link);
                                $.getJSON(var_data_link, function(json) {
                                    console.log(name);

                                    $.each(json, function(i, varObj) {
                                        if (varObj.name === name) {
                                            console.log(varObj.name);
                                            data_link = self.includeFilePath + settings.data_folder + varObj.data_link;

                                            $.getJSON(data_link, function(json) {
                                                console.log("getJson");

                                                var line = [];

                                                $.each(json[varObj.index], function(j, obj2) {
                                                    line.push({
                                                        x: time[j],
                                                        y: obj2
                                                    });
                                                });

                                                self.graphItems.push({
                                                    values: line,
                                                    key: name,
                                                    color: '#' + Math.floor(Math.random() * 16777215).toString(16)
                                                });

                                                d3.select('#chart svg')
                                                        .datum(self.graphItems())
                                                        .transition().duration(500)
                                                        .call(self.chart());
                                                //
                                                //                              series.name = seriesShortName;
                                                //                              self.chart().xAxis[0].setCategories(categories);
                                                //                              self.chart().addSeries(series);
                                                //                              console.log("Series Added to Chart object");
                                                //                              self.chart().redraw();
                                            })
                                                    .error(function(request, err) {
                                                console.log('error');
                                                console.log(err);
                                            });

                                            return false;
                                        }
                                    });
                                });
                            } else if (yvar.data_link().indexOf("param") > -1) {
                                console.log("param");
                                var var_data_link = self.includeFilePath + settings.data_folder + '/' + yvar.data_link();
                                //console.log(var_data_link);
                                $.getJSON(var_data_link, function(json) {

                                    console.log(name);

                                    $.each(json, function(i, varObj) {
                                        if (varObj.name === name) {
                                            console.log("getJson");
                                            var categories = [];
                                            var pointRatio = $("#pointRatio").html();

                                            console.log('Looking for SeriesName: ' + name);
                                            var series = {
                                                data: []
                                            }
                                            var pCounter = 0;


                                            var objValue = varObj.value;

                                            $.each(time, function(j, obj2) {
                                                var arr = new Array();
                                                if (pCounter % pointRatio === 0) {
                                                    series.data.push(objValue);
                                                    var timeAdj = time[j] * 100;
                                                    var timeArray = String(timeAdj).split('.');
                                                    categories.push(timeArray[0]);
                                                }
                                                pCounter++;
                                            });

                                            series.name = seriesShortName;
                                            self.chart().xAxis[0].setCategories(categories);
                                            self.chart().addSeries(series);
                                            console.log("Series Added to Chart object");
                                            self.chart().redraw();

                                            return false;
                                        }
                                    });
                                });
                            }
                            return false;
                        });

                        return false;
                    }
                });
            });
        };
        self.initializeChart = function() {
            var chartTitle = 'TestBench' + self.plot().testbench_name() + ' / Configuration: ' + self.plot().config_name() + ' / Plot Version #' + self.plot().plotVersion();
            var options = {
                chart: {
                    renderTo: 'container',
                    zoomType: 'x',
                    resetZoomButton: {
                        position: {
                            x: 50,
                            y: -30
                        }
                    },
                    type: 'line',
                    marginRight: 130,
                    marginBottom: 75,
                    events: {
                        selection: function(event) {
                            if (event.xAxis != null) {
                                var preMin = self.chart().xAxis[0].min;
                                var preMax = self.chart().xAxis[0].max;
                                var postMin = event.xAxis[0].min;
                                var postMax = event.xAxis[0].max;
                                console.log(self.chart().xAxis[0].min);
                                console.log(self.chart().xAxis[0].max);
                                console.log(event.xAxis[0].min);
                                console.log(event.xAxis[0].max);
                                var maxes = Math.abs(postMax - preMax);
                                var mins = Math.abs(postMin - preMin);
                                console.log(maxes);
                                console.log(mins);
                                var diff = maxes / (mins);
                                console.log("Diff:" + diff);
                                console.log("Chart Interval Pre: " + self.chart().xAxis[0].tickInterval);
                                self.chart().xAxis[0].tickInterval = self.chart().xAxis[0].tickInterval / diff;
                                self.chart().redraw();
                                console.log("Chart Interval Post: " + self.chart().xAxis[0].tickInterval);
                                console.log(Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', event.xAxis[0].min),
                                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', event.xAxis[0].max));
                                console.log(event.yAxis[0].min, event.yAxis[0].max);
                                $("#extremeLow").html(postMin);
                                $("#extremeHigh").html(postMax);
                                $("#zoomSend").trigger('click');
                            } else {
                                console.log("reset?");
                                $("#extremeLow").html('0');
                                $("#extremeHigh").html('500');
                                $("#zoomSend").trigger('click');
                            }
                        }
                    }
                },
                xAxis: {
                    title: {
                        text: 'Seconds',
                        margin: 15
                    },
                    tickInterval: 7,
                    labels: {
                        rotation: -90,
                        align: 'right',
                        style: {
                            fontSize: '10px',
                            fontFamily: 'Helvetica, sans-serif'
                        },
                        formatter: function() {
                            var milli = this.value;
                            var secs = milli;
                            return secs;
                        }
                    }
                },
                title: {
                    text: chartTitle,
                    x: -20
                },
                yAxis: {
                    title: {
                        text: 'Value'
                    },
                    plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                },
                tooltip: {
                    formatter: function() {

                        var milli = this.x;
                        var secs = milli;

                        return '<b>' + this.series.name + '</b><br/>' +
                                secs + ' secs | ' + this.y + 'units';
                    },
                    crosshairs: true
                },
                plotOptions: {
                    series: {
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 3,
                            states: {
                                hover: {
                                    enabled: true
                                }
                            }
                        }
                    }
                },
                legend: {
                    enabled: false,
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -10,
                    y: 100,
                    borderWidth: 0
                },
                exporting: {
                    filename: 'something',
                    buttons: {
                        exportButton: {
                            menuItems: [{
                                    textKey: 'downloadPNG',
                                    onclick: function() {
                                        this.exportChart();
                                    }
                                }, {
                                    textKey: 'downloadJPEG',
                                    onclick: function() {
                                        this.exportChart({
                                            type: 'image/jpeg'
                                        });
                                    }
                                }, {
                                    textKey: 'downloadPDF',
                                    onclick: function() {
                                        this.exportChart({
                                            type: 'application/pdf'
                                        });
                                    }
                                }, {
                                    textKey: 'downloadSVG',
                                    onclick: function() {
                                        this.exportChart({
                                            type: 'image/svg+xml'
                                        });
                                    }
                                }, {
                                    text: 'Download CSV document',
                                    onclick: function() {
                                        $.post("simviz_rest/csvExportPlotSeriesWithVariablesColumns/" + self.plot().plotID(), {}, function(result) {
                                            var json = $.parseJSON(result);
                                            console.log(json);

                                            self.varDownloadLink(json.var_link);
                                            self.paramDownloadLink(json.param_link);
                                            self.csvExportReady(true);
                                        });
                                    }
                                }]
                        }
                    }
                },
                series: {
                    data: []
                }
            };

            self.chart(new Highcharts.Chart(options));
        };
        self.initChartSettings = function() {
            var settings = self.plot().plotSettings();
            console.log(settings.series);
            var mappedSettingsVars = $.map(settings.series, function(item) {
                return new Variable(item)
            });

            //            $.each(mappedSettingsVars, function(i, obj) {
            //              self.varBoxClick(obj);
            //              //self.clickYAxisVariable(obj);
            //            });


            //        $("#plotSettings").html(settings);
            //        var setName = settings.series.name;
            //        var finName = setName.split(".").join("__");
            //        doChartYDraw('<?php echo base_url(); ?>include/'+settings.series.data_link, finName);
            //        $('#y'+finName).prop("checked", true);
            //        chart.redraw();
            //        $('#x'+finName).prop("checked", true);
            //        chart.showResetZoom();
        };
        self.doChartXDraw = function(jsonFilePath, name) {
            name = name.split("__").join(".");
            $.getJSON(jsonFilePath, function(json) {
                var categories = [];
                $.each(json.variables, function(i, obj) {
                    if (obj.name === name) {
                        var series = {
                            data: []
                        }
                        var pCounter = 0;
                        $.each(obj.data, function(j, obj2) {
                            if (pCounter % 25 === 0)
                                categories.push(obj2);
                            pCounter++;
                        });
                        chart.xAxis[0].setCategories(categories);
                    }
                });
            });
        };
        self.findClick = function() {
            $("#barLoader").show();
            var search = $.trim($("#variableSerach").val());

            var post_data = {
                search: search
            };

            $.post('/simviz_rest/getSearchResults/' + self.plot().plotID(), post_data, function(result) {

                //var json = $.parseJSON(result);
                var json = result;
                console.log(json);

                var mappedVars = $.map(json.vars, function(item) {
                    return new Variable(item);
                });
                self.searchVariables(mappedVars);

                //$("#searchResults").html(result);
                $("#barLoader").hide();
            });
        };
        self.varBoxClick = function(clckVar) {
            self.searchVariables.remove(clckVar);
            self.variables.push(clckVar);

            var found = false;

            ko.utils.arrayForEach(self.plot().plotSettings().series, function(item) {
                console.log(item);
                console.log(item.variable_id + ' - ' + clckVar.variable_id());
                if (item.variable_id === clckVar.variable_id()) {
                    found = true;
                }
            });

            if (!found) {
                //Add variable to plot settings json
                var name = clckVar.name();
                var seriesShortName = clckVar.name();
                var id = clckVar.variable_id();

                var post_data = {
                    plotID: self.plot().plotID(),
                    name: name,
                    id: id,
                    data_link: clckVar.data_link(),
                    type: clckVar.type()
                };

                $.post("simviz_rest/updatePlotSettings/", post_data, function(result) {
                    var json = $.parseJSON(result);
                    console.log(json);
                });
            }

            //        $(this).css('background-color', '#ccc');
            //        var newCheckBox = "";
            //        newCheckBox += '<li>';
            //        newCheckBox += '<input type="checkbox" name="elements[]" id="y'+id+'" seriesName="'+name+'" seriesShortName="'+shortname+'" value="'+datalink+'" class="yaxisvar" />';
            //        newCheckBox += '<label for="y'+id+'" class="eltLabel">'+shortname+'</label>';
            //        newCheckBox += '</li>';
            //        $("#yaxislist").append(newCheckBox);
        };
        self.initVariableDialog = function() {
            //Global Variables
            var plotSettings = {};
            $("#plotSettings").html('' + plotSettings);

            //Add variable / Variable Search Functions
            //            $('#AddVariableDialog').dialog({
            //              autoOpen: false,
            //              width: 1000,
            //              height: 600,
            //              buttons: {
            //                "Close": function() {
            //                  $(this).dialog("close");
            //                }
            //              }
            //            });

            //            $('#AddVariableDialog_open').live("click", function() {
            //              $('#AddVariableDialog').dialog('open');
            //              return false;
            //            });
            //
            //            $('#ClearVariable').live("click", function() {
            //              for (var i = 0; i < series.length; i++)
            //              {
            //                console.log("series name: " + series[i].name);
            //                chart.series[i].remove(true);
            //              }
            //            });
        };
        self.clickXAxisVariable = function(xvar) {
            var data_link = $(this).val();
            console.log(data_link);
            var name = $(this).attr("id");
            name = name.substring(1);
            console.log(name);
            if ($(this).is(':checked')) {
                var categories = [];
                chart.xAxis[0].setCategories(categories);
                doChartXDraw(data_link, name);
                chart.redraw();
            }
        };
        self.clickYAxisVariable = function(yvar) {

            var settings = self.plot().plotSettings();
            var name = yvar.name;
            var seriesShortName = yvar.name;
            var id = yvar.variable_id();

            console.log(id);
            console.log("#y" + id);

            if (!$("#y" + id).is(':checked')) {
                //                $("#y" + id).attr('checked', '');
                //                console.log("attempt remove");
                //
                //                var series = self.chart().series;
                //                console.log(series);
                //                for (var i = 0; i < series.length; i++)
                //                {
                //                  console.log("series name: " + series[i].name);
                //                  console.log("seriesShortName: " + seriesShortName());
                //                  if (series[i].name === seriesShortName())
                //                  {
                //                    console.log("remove series");
                //                    self.chart().series[i].remove(true);
                //                    break;
                //                  }
                //                }

                //Remove variable from plot settings json
            } else {
                $("#y" + id).attr('checked', 'checked');
                console.log("checked!");

                self.doD3ChartYDraw(yvar);
            }

            return true;
        };
        self.refreshAfterTabClick = function() {
            console.log('refresh');
            //HACK!!! Shouldn't have to trigger a window resize for the layout to reset. Weird bug in isotope?
            $(window).trigger('resize');
            self.chart().update();
        };
        self.refreshStaticChart1 = function() {
            self.initStaticPlot();
        };
        self.refreshMSD1 = function() {
            self.initPlot(37);
        };
        self.refreshMSD2 = function() {
            self.initPlot(37);
        };

        self.openAddNewPlotDialog = function() {
            $("#newPlotDialog").modal({backdrop: false});
            $("#newPlotDialog").modal('show');
        };

        //Init Calls
        self.initPlotID = ko.observable();


        var page = $.QueryString("page");
        self.dashPage(page);

        if (page === "" || page === undefined || page === null || page === "upload") {
            self.getRecentPlots();
            self.getConfigurations();
            self.getTestBenches();
        } else if (page === "tb") {
            var tbID = $.QueryString("tbID");
            if (tbID !== null) {
                self.getTestBenchInfo(tbID);
            } else {
                //get all tbs
                self.getTestBenches();
            }
        } else if (page === "sim") {
            self.dashPage(page);

            self.tbID.subscribe(function() {

                var tTBID = self.tbID();
                var tConfID = self.confID();

                if (tTBID == undefined)
                    tTBID = 0;
                if (tConfID == undefined)
                    tConfID = 0;

                self.getSimulations(tTBID, tConfID);
            });

            self.confID.subscribe(function() {

                var tTBID = self.tbID();
                var tConfID = self.confID();

                if (tTBID == undefined)
                    tTBID = 0;
                if (tConfID == undefined)
                    tConfID = 0;

                self.getSimulations(tTBID, tConfID);
            });

            self.getTestBenches();
            self.getConfigurations();

            var simID = $.QueryString("simID");
            if (simID !== null) {
                self.getSimulationInfo(simID);
            } else {
                var tbID = $.QueryString("tbID");
                var confID = $.QueryString("confID");

                if ((confID !== null) && (tbID !== null)) {
                    //get sim based on both
                    self.getSimulations(tbID, confID);
                } else if (tbID !== null) {
                    //get sim based on tb
                    self.getSimulations(tbID, 0);
                } else if (confID !== null) {
                    //get sim based on config
                    self.getSimulations(0, confID);
                } else {
                    //get all sims
                    self.getSimulations(0, 0);
                }

            }
        } else if (page === "conf") {
            var confID = $.QueryString("confID");
            if (confID !== null) {
                self.getConfigurationInfo(confID);
            } else {
                //get all configs
                self.getConfigurations();
            }
        } else if (page === "plot") {
            var simID = $.QueryString("simID");
            if (simID !== null) {
                self.getPlots(simID);
            } else {

            }
        } else if (page === "simHome") {
            var simID = $.QueryString("simID");
            if (simID !== null) {
                self.getSimulationInfo(simID);
                self.getPlots(simID);
            } else {
                //redirect to sims selection again
                window.location('/dashboard.html?page=sim');
            }
        }


        //            var pID = $.QueryString("plotID");
        //            if (pID != "" && pID != null)
        //            {
        //              self.initPlotID(pID);
        //              self.initPlot(self.initPlotID());
        //            }
        //
        //            var tbID = $.QueryString("tbID");
        //            if (tbID != "" && tbID != null)
        //            {
        //              self.getTestBenchInfo(tbID);
        //            }
        //
        //            var simID = $.QueryString("simID");
        //            if (simID != "" && simID != null)
        //            {
        //              self.getSimulationInfo(simID);
        //            }
        //
        //            var confID = $.QueryString("confID");
        //            if (confID != "" && confID != null)
        //            {
        //              self.getConfigurationInfo(confID);
        //            }




        self.initVariableDialog();
    }

    var plotViewModel = new PlotViewModel();
    ko.applyBindings(plotViewModel);


    //DataTable Init
//    var vTable = $('.vTable').dataTable({
//        "bJQueryUI": false,
//        "bAutoWidth": false,
//        "sDom": '<"H"fl>t<"F"ip>'
//    });
//    vTable.fnSort([
//        [1, 'desc']
//    ]);
    $('#dyna .tOptions').click(function() {
        $('#dyna .tablePars').slideToggle(200);
    });
    $('.tOptions').click(function() {
        $(this).toggleClass("act");
    });
    $('#zoomSend').click(function() {

        console.log("high" + $('#extremeHigh').html());
        console.log("high" + $('#extremeHigh').val());
        console.log("high" + $('#extremeHigh').text());

        var message = '{ "low" : ' + $('#extremeLow').html() + ', "high" : ' + $('#extremeHigh').html() + '}';
    });
    //        $(".uSlider").slider({
    //          range: "min",
    //          value: 25,
    //          min: 1,
    //          max: 100,
    //          slide: function(event, ui) {
    //            //$( "#minRangeAmount" ).val( "$" + ui.value );
    //          }
    //        });

    $("#select_tb").change(function() {
        console.log($(this).val());
        if ($(this).val() == 0)
        {
            $("#new_tb").show();
        }
        else
        {
            $("#new_tb").hide();
            //go get configs for that TB and fill select
        }
    });

    $("#select_config").change(function() {
        if ($(this).val() == 0)
        {
            $("#new_configuration").show();
        }
        else
        {
            $("#new_configuration").hide();
            //go get configs for that TB and fill select
        }
    });


});