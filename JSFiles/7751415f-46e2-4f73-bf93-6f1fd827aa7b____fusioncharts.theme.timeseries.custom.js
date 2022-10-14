FusionCharts.addDep({
    extension: {
        name: 'connectNullDataTheme',
        theme: {
            timeseries: {
                "plotconfig": {
                    line: {
                        "style": {
                            "plot.null": {
                                "stroke": "#ff0000",
                                "stroke-opacity": 0.4
                            },
                            "line.null": {
                                "stroke": '#00ff00',
                                "stroke-width": 8,
                                "stroke-dasharray": "20 10",
                                "stroke-linecap": "butt"
                            }
                        }
                    },
                    'smooth-line': {
                        "style": {
                            "plot.null": {
                                "stroke": "#ff0000",
                                "stroke-opacity": 0.4
                            },
                            "line.null": {
                                "stroke": '#00ff00',
                                "stroke-width": 8,
                                "stroke-dasharray": "20 10",
                                "stroke-linecap": "butt"
                            }
                        }
                    },
                    'step-line': {
                        "style": {
                            "plot.null": {
                                "stroke": "#ff0000",
                                "stroke-opacity": 0.4
                            },
                            "line.null": {
                                "stroke": '#00ff00',
                                "stroke-width": 8,
                                "stroke-dasharray": "20 10",
                                "stroke-linecap": "butt"
                            }
                        }
                    },
                    'area': {
                        "style": {
                            "plot.null": {
                                "fill": "#ffff00",
                                "fill-opacity": 0.2
                            },
                            "line.null": {
                                "stroke": "#00ff00",
                                "stroke-width": 8,
                                "stroke-dasharray": "20 10",
                                "stroke-opacity": 0.4,
                                "stroke-linecap": "butt"
                            },
                            "area.null": {
                                "fill": "#ff0000"
                            }
                        }
                    },
                    'smooth-area': {
                        "style": {
                            "plot.null": {
                                "fill": "#ffff00",
                                "fill-opacity": 0.2
                            },
                            "line.null": {
                                "stroke": "#00ff00",
                                "stroke-width": 8,
                                "stroke-dasharray": "20 10",
                                "stroke-opacity": 0.4,
                                "stroke-linecap": "butt"
                            },
                            "area.null": {
                                "fill": "#ff0000"
                            }
                        }
                    },
                    'step-area': {
                        "style": {
                            "plot.null": {
                                "fill": "#ffff00",
                                "fill-opacity": 0.2
                            },
                            "line.null": {
                                "stroke": "#00ff00",
                                "stroke-width": 8,
                                "stroke-dasharray": "20 10",
                                "stroke-opacity": 0.4,
                                "stroke-linecap": "butt"
                            },
                            "area.null": {
                                "fill": "#ff0000"
                            }
                        }
                    }
                }
            }
        }
    },
    name: 'myTheme',
    type: 'theme'
});
FusionCharts.addDep({
    extension: {
        name: 'connectNullDataTheme2',
        theme: {
            timeseries: {
                yaxis: [{
                    plot: [{
                        style: {
                            "plot.null": {
                                "fill": "#ffff00",
                                "fill-opacity": 0.2
                            },
                            "line.null": {
                                "stroke": "#00ff00",
                                "stroke-width": 8,
                                "stroke-dasharray": "20 10",
                                "stroke-opacity": 0.4,
                                "stroke-linecap": "butt"
                            },
                            "area.null": {
                                "fill": "#ff0000"
                            }
                        }
                    }],
                    style: {
                        title: {
                            fill: '#ff0000'
                        }
                    }
                }]
            }
        }
    },
    name: 'myTheme2',
    type: 'theme'
});
FusionCharts.addDep({
    extension: {
        name: 'ft_QA_theme',
        theme: {
            timeseries: {
                caption: {
                    style: {
                        text: {
                            "font-size": 30,
                            "font-family": "mono",
                            "font-style": "italic",
                            "opacity": 0.7,
                            "fill": "#00ff00",
                            "font-weight": "bold"
                        }
                    }
                },
                subcaption: {
                    style: {
                        text: {
                            "font-size": 25,
                            "font-family": "arial",
                            "font-style": "oblique",
                            "opacity": 0.8,
                            "fill": "#0000ff",
                            'font-weight': 'bolder'
                        }
                    }
                },
                legend: {
                    "item": {
                        "style": {
                            "text": {
                                "font-size": 20,
                                "font-family": "times",
                                "font-weight": "bold",
                                "fill": "#ff0000",
                                "opacity": 0.5
                            }
                        }
                    }
                },
                chart: {
                    paletteColors: [
                        "#ff0000",
                        "#00ff00",
                        "#0000ff",
                        "#ffff00",
                        "#000000",
                        "#ffffff"
                    ],
                    // 'enableNavigator': 0,
                    'multiCanvas': 1,
                    'animation': 0,
                    'animationDuration': 1,
                    // 'clickURL': 'n-http://www.google.com',
                    'showPrintMenuItem': '1',
                    'showToolTip': 0,
                    'exportEnabled': 1,
                    'exportAction': '',
                    'exportHandler': '',
                    'exportFormats': '',
                    'exportAtClientSide': '',
                    'exportShowMenuItem': '',
                    'exportTargetWindow': '',
                    'exportFileName': 'export-set-via-theme',
                    // 'multiCanvasTooltip': 0,
                    "style": {
                        text: {
                            'font-family': 'Felipa'
                        },
                        navigator: {
                            brush: {
                                "handle": {
                                    'fill': '#ff0000'
                                }, // Only fill can be changed
                                "overlay": {
                                    opacity: 0.5
                                } //Only opacity can be changed
                            },
                            scroller: {
                                "button": {
                                    'fill': '#aeecf9'
                                }, // Only fill can be changed
                                "track": {
                                    'fill': '#00ff00'
                                }, // Only fill can be changed
                                "scrollbar": {
                                    'fill': '#f9aef1'
                                } // Only fill can be changed
                            }
                        },
                        "canvas": {
                            "stroke": "#ff0000",
                            "fill": "#f77ee9",
                            "fill-opacity": 0.1,
                            "stroke-opacity": 0.3,
                            "stroke-width": 5
                        },
                        "background": {
                            "stroke": "#00ff00",
                            "fill": "#0000ff",
                            "fill-opacity": 0.2,
                            "stroke-opacity": 0.2,
                            "stroke-width": 10
                        },
                        "text": {
                            "font-size": 20,
                            "font-family": "mono"
                        },
                        tooltip: {
                            'font-family': 'arial',
                            'font-size': '15',
                            'font-weight': 'bold',
                            'color': '#0000ff',
                            'background-color': '#fccdae',
                            'background-opacity': '0.1',
                            // 'background': '#ff0000 url(https://www.gettyimages.com/gi-resources/images/CreativeLandingPage/HP_Sept_24_2018/CR3_GettyImages-159018836.jpg) repeat fixed center',
                            'background': '#ff0000 url(http://localhost/projects/test/obama.jpg) repeat fixed center',
                            'border-radius': '15',
                            'border-width': '5',
                            'border-color': '#ff0000',
                            'border': '15px solid #f76cf0'
                        }
                    }
                },
                xaxis: {
                    timemarker: [{
                        style: {
                            "text": {
                                "font-family": "mono",
                                "fill": "#ff0000",
                                "font-weight": "bold",
                                // "font-size": 12,
                                // "opacity": 0.5
                            },
                            "marker": {
                                "fill": "#0000ff",
                                // "opacity": 0.7,
                                // "fill-opacity": 0.3,
                                "stroke": "#ff0000",
                                "stroke-width": 5,
                                // "stroke-opacity": 0.4
                            }
                        }
                    }],
                    style: {
                        "ticks": {
                            "major": {
                                "fill": "#ff0000",
                            },
                            "minor": {
                                "fill": "#0000ff",
                            }
                        },
                        "text": {
                            "font-family": "times",
                            "font-weight": "bold"
                        },
                        "line": {
                            "stroke-width": 5
                        }
                    }
                },
                datamarker: [{
                    style: {
                        "text": {
                            "font-family": "Indie Flower",
                            "font-size": "15",
                            "fill": "#ff0000",
                            "font-weight": "bold",
                            "font-style": "italic",
                            "opacity": 0.8
                        },
                        "marker": {
                            "fill": "#0000ff",
                            "opacity": 0.3,
                            // "fill-opacity": 0,
                            "stroke": "#ff0000",
                            "stroke-width": 15,
                            "stroke-opacity": 0.4
                        }
                    }
                }],
                extensions: {
                    "standardRangeSelector": {
                        // initialSelection: {
                        //     unit: "month",
                        //     multiplier: "1"
                        // },
                        style: {
                            button: {
                                text: {
                                    fill: '#ff0000',
                                    // 'font-size': 20,
                                    'opacity': '0.5'
                                },
                                background: {
                                    fill: '#0000ff',
                                    'fill-opacity': '0.3'
                                }
                            },
                            'button:hover': {
                                text: {
                                    fill: '#00ff00',
                                    'opacity': '0.8',
                                    'font-weight': 900,
                                    'font-size': 15,
                                    'stroke-width': 5
                                },
                                background: {
                                    fill: '#0000ff',
                                    'fill-opacity': '0.5'
                                }
                            },
                            'button:active': {
                                text: {
                                    'font-family': 'Indie Flower',
                                    fill: '#0000ff',
                                    'font-size': 20,
                                    'opacity': '0.2',
                                    'fill-opacity': '1'
                                },
                                background: {
                                    fill: '#ffff00',
                                    'fill-opacity': '0.2'
                                }
                            },
                            separator: {
                                stroke: '#00ff00',
                                'stroke-opacity': '0.9',
                                'stroke-width': 2
                            }
                        }
                    },
                    "customRangeSelector": {
                        "enabled": 1,
                        "style": {
                            "title": {
                                text: {
                                    fill: '#ff0000'
                                },
                                icon: {
                                    fill: '#00ff00'
                                }
                            },
                            "title:hover": {
                                text: {
                                    fill: '#00ff00'
                                },
                                icon: {
                                    fill: '#ff0000'
                                }
                            },
                            "title:active": {
                                text: {
                                    fill: '#0000ff'
                                },
                                icon: {
                                    fill: '#000000'
                                }
                            },
                            "background": {
                                'background': '#ffff00',
                                'border': '2px solid #ff0000'
                            },
                            "label": {
                                color: '#ff0000'
                            },
                            "button": {
                                apply: {
                                    background: '#00ff00',
                                    border: '3px solid #0000ff',
                                    color: '#ff0000',
                                    opacity: 0.5
                                },
                                cancel: {
                                    'font-size': '15px',
                                    background: '#ffffff'
                                }
                            },
                            "button:hover": {
                                apply: {
                                    // background: '#00ff00'
                                    opacity: 0.5
                                },
                                cancel: {
                                    color: '#ff0000',
                                    background: '#00ff00'
                                }
                            },
                            "select": {
                                'background-color': '#ff0000',
                                'font-size': '15px'
                            },
                            "input": {
                                'font-size': '15px'
                            }
                        }
                    }
                },
                yaxis: [{
                    plot: [{
                        style: {
                            // "column": {
                            //     "fill-opacity": 0.4
                            // },
                            // "line": {
                            //     "stroke-width": 0,
                            //     // "opacity": 0
                            // }
                        }
                    }],
                    style: {
                        // "column": {
                        //     "fill-opacity": 0.4
                        // },
                        // "line": {
                        //     "stroke-width": 0,
                        //     "opacity": 0
                        // },
                        "tick-mark": {
                            'stroke': '#ff0000',
                            'stroke-width': 10,
                            'stroke-opacity': 0.5,
                            // 'opacity': 0
                        },
                        "label": {
                            'color': '#0000ff',
                            
                            'font-family': 'Indie Flower',
                            'font-size': '15',
                            'font-weight': 'bold'
                        },
                        "grid-line": {
                            'stroke': '#00ff00',
                            'stroke-width': 10,
                            'stroke-opacity': 0.5,
                            'stroke-dasharray': '10 2'
                        },
                        "title": {
                            'fill': '#ff0000',
                            
                            'font-family': 'Indie Flower',
                            'font-size': '43',
                            opacity: 0.5,
                            'fill-opacity': 0.7
                        }
                    }
                }]
            }
        }
    },
    name: 'myTheme3',
    type: 'theme'
});
FusionCharts.addDep({
    extension: {
        name: 'dataMarkerTheme',
        theme: {
            timeseries: {
                datamarker: [{
                    style: {
                        "text": {
                            "font-family": "san-seriff",
                            "font-size": "15",
                            "fill": "#ff0000",
                            "font-weight": "bold",
                            "font-style": "italic",
                            "opacity": 0.8
                        },
                        "marker": {
                            "fill": "#0000ff",
                            "opacity": 0.5,
                            // "fill-opacity": 0,
                            "stroke": "#00ff00",
                            "stroke-width": 3,
                            "stroke-opacity": 0.4
                        }
                    }
                }]
            }
        }
    },
    name: 'theme-dm',
    type: 'theme'
});
FusionCharts.addDep({
    extension: {
        name: 'timeNavigatorTheme',
        theme: {
            timeseries: {
                navigator: {
                    "scrollbar": {
                        "style": {
                            "button": {
                                "fill": "#00ff00",
                                "stroke": "#ff0000",
                                "stroke-width": 2,
                                "opacity": 0.5
                            },
                            "arrow": {
                                "fill": "#0000ff",
                                "stroke": "#ff0000",
                                "stroke-width": 2,
                                "opacity": 0.3
                            },
                            "scroller": {
                                "fill": "#ffff00",
                                "stroke": "#ff0000",
                                "stroke-width": 2,
                                "opacity": 0.5
                            },
                            "grip": {
                                "stroke": "#0000ff"
                            },
                            "track": {
                                "fill": "#0000ff",
                                "stroke": "#ff0000",
                                "stroke-width": 2,
                                "opacity": 0.5
                            }
                        }
                    },
                    "window": {
                        "style": {
                            "handle": {
                                "fill": "#ff0000",
                                "stroke": "#00ff00",
                                "stroke-width": 2,
                                "opacity": 0.2
                            },
                            "handle-grip": {
                                "stroke": "#0000ff",
                                "stroke-width": 3,
                                "opacity": 0.2
                            },
                            "mask": {
                                "fill": "#00ff00",
                                "stroke": "#ff0000",
                                "stroke-width": 2,
                                "opacity": 0.5
                            },
                            "label": {
                                fill: '#0000ff',
                                "fill-opacity": 0.6
                            },
                            "label-background": {
                                fill: '#ffff00',
                                stroke: '#ff0000',
                                "stroke-width": 2,
                                'stroke-opacity': 0.5,
                                'fill-opacity': 0.4
                            }
                        }
                    }
                }
            }
        }
    },
    name: 'theme-tn',
    type: 'theme'
});
FusionCharts.addDep({
    extension: {
        name: 'yAxisOldStyle',
        theme: {
            timeseries: {
                yaxis: [{
                    style: {
                        "tick-mark": {
                            'stroke': '#ff0000',
                            'stroke-width': 10,
                            'stroke-opacity': 0.5
                        },
                        "label": {
                            'fill': '#0000ff',
                            'font-family': 'sans-serif',
                            'font-size': '15',
                            'font-weight': 'bold'
                        },
                        "grid-line": {
                            'stroke': '#00ff00',
                            'stroke-width': 10,
                            'stroke-opacity': 0.5
                        },
                        "title": {
                            'fill': '#ff0000',
                            'font-family': 'sans-serif',
                            'font-size': '43',
                            "opacity": 0.5,
                            'fill-opacity': 0.7
                        }
                    }
                }]
            }
        }
    },
    name: 'theme-yAxisOld',
    type: 'theme'
});
FusionCharts.addDep({
    extension: {
        name: 'yAxisNewStyle',
        theme: {
            timeseries: {
                yaxis: [{
                    style: {
                        'tick-mark-major': {
                            'stroke': '#0000ff',
                            'stroke-width': 5,
                            'stroke-opacity': 0.7
                        },
                        'label-major': {
                            'fill': '#00ff00',
                            'font-family': 'sans-serif',
                            'font-size': '20',
                            'font-weight': 'bold',
                            'font-style': 'italic',
                            'opacity': 0.4
                        },
                        "title": {
                            'fill': '#ff0000',
                            'font-family': 'sans-serif',
                            'font-size': '43',
                            "opacity": 0.5,
                            'fill-opacity': 0.7
                        }
                    }
                }]
            }
        }
    },
    name: 'theme-yAxisNew',
    type: 'theme'
});
FusionCharts.addDep({
    extension: {
        name: 'caption_subcaption',
        theme: {
            timeseries: {
                caption: {
                    style: {
                        text: {
                            'font-family': 'felipa',
                            'fill': '#0000ff',
                            'font-size': '40',
                            'opacity': 0.5,
                            'stroke': '#ff0000',
                            'stroke-width': 2,
                            'font-weight': 'bold',
                            'font-style': 'italic'
                        }
                    }
                },
                subcaption: {
                    style: {
                        text: {
                            'font-family': 'arial',
                            'fill': '#f142f4',
                            'font-size': '40',
                            'opacity': 0.7,
                            'stroke': '#5df2f4',
                            'stroke-width': 2,
                            'font-weight': 'bold',
                            'font-style': 'italic'
                        }
                    }
                }
            }
        }
    },
    name: 'theme-caption',
    type: 'theme'
});
FusionCharts.addDep({
    extension: {
        name: 'legendTheme',
        theme: {
            timeseries: {
                legend: {
                    item: {
                        "style": {
                            "text": {
                                fill: '#ff0000',
                                stroke: '#0000ff',
                                'stroke-width': 2,
                                opacity: 0.4,
                                'font-size': '30',
                                'font-style': 'italic',
                                'font-family': 'times',
                                'font-weight': 'bold'
                            }
                        }
                    }
                }
            }
        }
    },
    name: 'theme-legend',
    type: 'theme'
});
FusionCharts.addDep({
    extension: {
        name: 'contextLabelTheme',
        theme: {
            timeseries: {
                xaxis: {
                    style: {
                        'label-context': {
                            'font-family': 'times',
                            'fill': '#0000ff',
                            'font-size': '20',
                            'opacity': 0.5,
                            'stroke': '#ff0000',
                            'stroke-width': 2,
                            'font-weight': 'bold',
                            'font-style': 'italic'
                        }
                    }
                }
            }
        }
    },
    name: 'theme-context-label',
    type: 'theme'
});
FusionCharts.addDep({
    extension: {
        name: 'tooltipTheme',
        theme: {
            timeseries: {
                tooltip: {
                    enabled: true,
                    "style": {
                        "container": {
                            // "color": "#ffff00",
                            "border": "5px solid red",
                            "background-color": "#ccf7f9",
                            "border-radius": "10px",
                            'background': '#ff0000 url(http://192.168.2.131/projects/test/obama.jpg)', // repeat fixed center
                            'padding': '5px 15px 10px 20px',
                            // 'padding-left': '5px',
                            // 'padding-right': '15px',
                            // 'padding-top': '10px',
                            // 'padding-bottom': '20px',
                            // 'background-image': 'url(http://localhost/projects/test/obama.jpg)',
                            // 'width': '600px',
                            // 'height': '300px',
                            // 'max-width': '',
                            // 'max-height': '',
                            // 'transform': 'rotate(20deg)',
                            // 'transform': 'skewY(20deg)',
                            // 'transform': 'scaleY(1.5)',
                            // 'visibility': 'hidden'
                        },
                        "text": {
                            "font-family": "times",
                            // "font-size": "30px",
                            "font-weight": "bold",
                            "font-style": "italic",
                            "color": "#ff0000"
                        },
                        "header": {
                            "font-family": "Felipa",
                            "background-color": "#000000",
                            "opacity": "0.6",
                            "font-size": "20px",
                            "font-weight": "bold",
                            "color": "#ffffff"
                        },
                        "body": {
                            "font-family": "Indie Flower",
                            "font-size": "30px",
                            "opacity": 0.8,
                            // "font-weight": "bold",
                            // "font-style": "italic",
                            "color": "#e804e0"
                        }
                    }
                }
            }
        }
    },
    name: 'theme-context-label',
    type: 'theme'
});
FusionCharts.addDep({
    extension: {
        name: 'chartStyleTheme',
        theme: {
            timeseries: {
                "chart": {
                    "style": {
                        "text": {
                            'font-family': 'Indie Flower',
                            'fill': '#ff0000',
                            'color': '#ff0000',
                            'font-size': '30px',
                            'opacity': 0.8,
                            'stroke': '#00ff00',
                            'stroke-width': 0.5,
                            // 'font-weight': 'bold',
                            'font-style': 'italic'
                        },
                        "canvas": {
                            "stroke": "#0000ff",
                            "fill": "#ff0000",
                            "fill-opacity": 0.6,
                            "opacity": 0.5,
                            "stroke-opacity": 0.7,
                            "stroke-width": 15
                        },
                        "background": {
                            "stroke": "#ff0000",
                            "fill": "#00ff00",
                            "fill-opacity": 0.6,
                            "opacity": 0.4,
                            "stroke-opacity": 0.8,
                            "stroke-width": 10
                        }
                    }
                }
            }
        }
    },
    name: 'theme-chart-style',
    type: 'theme'
});