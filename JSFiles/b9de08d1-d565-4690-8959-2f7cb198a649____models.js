import React from 'react';
import { fromJS } from 'immutable';
import uuid from 'uuid';
import { PRIMITIVE_STRING_NAMESPACE, PRIMITIVE_STRING } from './config';
import {
  rtchartDefaultOptions, rtchartGaugeDefaultOptions, rechartDefaultOptions,
  rechartPieDefaultOptions, rechartScatterDefaultOptions,
  rechartComposedDefaultOptions, rechartRadarDefaultOptions, rechartRadialDefaultOptions,
} from './';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

/**
 * for creating stencils to canvas, use Material UI component
 * default present attributes (for user config but not all)
 *
 * @type {Object}
 * @see http://www.material-ui.com/
 * @see immutable.fromJS : Deeply converts plain JS objects and arrays to Immutable Maps and Lists
 * @example
 *
 *           stencil name (see ./materialUIList.js): {
 *             id: uuid string, distinguish other
 *             namespace: distinguish origin Material UI
 *             name: render tag <???>
 *             props: Material Component Properties, refer to offical website, give default value
 *             parentId: parent node
 *             children: child nodes
 *           }
 */
const stencils = {
  /*
   * Redefined chart library built with React and D3
   * @see http://recharts.org
   * DRC Charts is based on recharts with new style (smart manufacturing)
   */
  're-Area': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'Area',
    props: {
      dataKey: 'amt',
      type: 'monotone',
      fill: '#8884d8',
      stroke: '#8884d8',
      fillOpacity: 1,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  're-AreaChart': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'AreaChart',
    props: fromJS(rechartDefaultOptions),
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  're-Bar': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'Bar',
    props: {
      dataKey: 'pv',
      fill: '#413ea0',
      labelPosition: 'inner',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  're-BarChart': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'BarChart',
    props: fromJS(rechartDefaultOptions),
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  're-CartesianGrid': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'CartesianGrid',
    props: {
      strokeDasharray: '3 3',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  're-ComposedChart': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'ComposedChart',
    props: fromJS(rechartComposedDefaultOptions),
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  're-Legend': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'Legend',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  're-Line': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'Line',
    props: {
      dataKey: 'uv',
      type: 'monotone',
      stroke: '#ff7300',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  're-LineChart': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'LineChart',
    props: fromJS(rechartDefaultOptions),
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  're-Pie': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'Pie',
    props: {
      isAnimationActive: true,
      outerRadius: 140,
      innerRadius: 75,
      labelPosition: 'above',
      fill: '#008000',
      data: [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
      ],
      transformer: `function transformer(data) {
        if (data !== undefined) {
          return data;
        }
      }`,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  're-PieChart': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'PieChart',
    props: fromJS(rechartPieDefaultOptions),
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  're-PolarAngleAxis': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'PolarAngleAxis',
    props: {
      dataKey: 'subject',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  're-PolarGrid': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'PolarGrid',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  're-PolarRadiusAxis': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'PolarRadiusAxis',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  're-Radar': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'Radar',
    props: {
      name: 'Mike',
      dataKey: 'A',
      stroke: '#8884d8',
      fill: '#8884d8',
      fillOpacity: 0.6,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  're-RadarChart': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'RadarChart',
    props: fromJS(rechartRadarDefaultOptions),
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  're-RadialBar': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'RadialBar',
    props: {
      startAngle: 90,
      endAngle: -180,
      background: true,
      clockWise: true,
      dataKey: 'employees',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  're-RadialBarChart': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'RadialBarChart',
    props: fromJS(rechartRadialDefaultOptions),
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  're-Scatter': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'Scatter',
    props: {
      fill: '#ff0000',
      data: [
        { x: 250, y: 250, z: 200 },
        { x: 350, y: 350, z: 260 },
        { x: 450, y: 450, z: 400 },
        { x: 550, y: 550, z: 280 },
        { x: 650, y: 650, z: 500 },
        { x: 750, y: 750, z: 200 },
      ],
      transformer: `function transformer(data) {
        if (data !== undefined) {
          return data;
        }
      }`,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  're-ScatterChart': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'ScatterChart',
    props: fromJS(rechartScatterDefaultOptions),
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  're-Tooltip': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'Tooltip',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  're-Treemap': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'Treemap',
    props: {
      width: 730,
      height: 250,
      dataKey: 'size',
      ratio: 4 / 3,
      stroke: '#fff',
      fill: '#8884d8',
      data: [
        {
          name: 'axis',
          children: [
            { name: 'Axes', size: 1302 },
            { name: 'Axis', size: 24593 },
            { name: 'AxisGridLine', size: 652 },
            { name: 'AxisLabel', size: 636 },
            { name: 'CartesianAxes', size: 6703 },
          ],
        },
        {
          name: 'controls',
          children: [
            { name: 'AnchorControl', size: 2138 },
            { name: 'ClickControl', size: 3824 },
            { name: 'Control', size: 1353 },
            { name: 'ControlList', size: 4665 },
            { name: 'DragControl', size: 2649 },
            { name: 'ExpandControl', size: 2832 },
            { name: 'HoverControl', size: 4896 },
            { name: 'IControl', size: 763 },
            { name: 'PanZoomControl', size: 5222 },
            { name: 'SelectionControl', size: 7862 },
            { name: 'TooltipControl', size: 8435 },
          ],
        },
        {
          name: 'data',
          children: [
            { name: 'Data', size: 20544 },
            { name: 'DataList', size: 19788 },
            { name: 'DataSprite', size: 10349 },
            { name: 'EdgeSprite', size: 3301 },
            { name: 'NodeSprite', size: 19382 },
            {
              name: 'render',
              children: [
                { name: 'ArrowType', size: 698 },
                { name: 'EdgeRenderer', size: 5569 },
                { name: 'IRenderer', size: 353 },
                { name: 'ShapeRenderer', size: 2247 },
              ],
            },
            { name: 'ScaleBinding', size: 11275 },
            { name: 'Tree', size: 7147 },
            { name: 'TreeBuilder', size: 9930 },
          ],
        },
        {
          name: 'events',
          children: [
            { name: 'DataEvent', size: 7313 },
            { name: 'SelectionEvent', size: 6880 },
            { name: 'TooltipEvent', size: 3701 },
            { name: 'VisualizationEvent', size: 2117 },
          ],
        },
        {
          name: 'legend',
          children: [
            { name: 'Legend', size: 20859 },
            { name: 'LegendItem', size: 4614 },
            { name: 'LegendRange', size: 10530 },
          ],
        },
        {
          name: 'operator',
          children: [
            {
              name: 'distortion',
              children: [
                { name: 'BifocalDistortion', size: 4461 },
                { name: 'Distortion', size: 6314 },
                { name: 'FisheyeDistortion', size: 3444 },
              ],
            },
            {
              name: 'encoder',
              children: [
                { name: 'ColorEncoder', size: 3179 },
                { name: 'Encoder', size: 4060 },
                { name: 'PropertyEncoder', size: 4138 },
                { name: 'ShapeEncoder', size: 1690 },
                { name: 'SizeEncoder', size: 1830 },
              ],
            },
            {
              name: 'filter',
              children: [
                { name: 'FisheyeTreeFilter', size: 5219 },
                { name: 'GraphDistanceFilter', size: 3165 },
                { name: 'VisibilityFilter', size: 3509 },
              ],
            },
            { name: 'IOperator', size: 1286 },
            {
              name: 'label',
              children: [
                { name: 'Labeler', size: 9956 },
                { name: 'RadialLabeler', size: 3899 },
                { name: 'StackedAreaLabeler', size: 3202 },
              ],
            },
            {
              name: 'layout',
              children: [
                { name: 'AxisLayout', size: 6725 },
                { name: 'BundledEdgeRouter', size: 3727 },
                { name: 'CircleLayout', size: 9317 },
                { name: 'CirclePackingLayout', size: 12003 },
                { name: 'DendrogramLayout', size: 4853 },
                { name: 'ForceDirectedLayout', size: 8411 },
                { name: 'IcicleTreeLayout', size: 4864 },
                { name: 'IndentedTreeLayout', size: 3174 },
                { name: 'Layout', size: 7881 },
                { name: 'NodeLinkTreeLayout', size: 12870 },
                { name: 'PieLayout', size: 2728 },
                { name: 'RadialTreeLayout', size: 12348 },
                { name: 'RandomLayout', size: 870 },
                { name: 'StackedAreaLayout', size: 9121 },
                { name: 'TreeMapLayout', size: 9191 },
              ],
            },
            { name: 'Operator', size: 2490 },
            { name: 'OperatorList', size: 5248 },
            { name: 'OperatorSequence', size: 4190 },
            { name: 'OperatorSwitch', size: 2581 },
            { name: 'SortOperator', size: 2023 },
          ],
        },
      ],
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  're-XAxis': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'XAxis',
    props: {
      dataKey: 'page',
      label: 'Pages',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  're-YAxis': fromJS({
    id: '',
    namespace: 'DRC',
    name: 'YAxis',
    props: {
      label: 'Index',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  /*
   * Real time chart
   * @see https://github.com/emilmork/react-rt-chart
   * now we port this project, see http://twtpesir01.delta.corp/react/react-real-time-chart
   */
  'rt-area': fromJS({
    id: '',
    namespace: 'RTChart',
    name: 'RTChart',
    props: fromJS(rtchartDefaultOptions).mergeDeep(fromJS({
      // extral setting
      chart: {
        data: {
          type: 'area',
        },
        grid: {
          y: {
            show: true,
          },
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              count: 4,
              format: '%H:%M:%S',
            },
          },
        },
      },
    })),
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'rt-area-spline': fromJS({
    id: '',
    namespace: 'RTChart',
    name: 'RTChart',
    props: fromJS(rtchartDefaultOptions).mergeDeep(fromJS({
      // extral setting
      chart: {
        data: {
          type: 'area-spline',
        },
        grid: {
          y: {
            show: true,
          },
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              count: 4,
              format: '%H:%M:%S',
            },
          },
        },
      },
    })),
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'rt-area-step': fromJS({
    id: '',
    namespace: 'RTChart',
    name: 'RTChart',
    props: fromJS(rtchartDefaultOptions).mergeDeep(fromJS({
      // extral setting
      chart: {
        data: {
          type: 'area-step',
        },
        grid: {
          y: {
            show: true,
          },
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              count: 4,
              format: '%H:%M:%S',
            },
          },
        },
      },
    })),
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'rt-bar': fromJS({
    id: '',
    namespace: 'RTChart',
    name: 'RTChart',
    props: fromJS(rtchartDefaultOptions).mergeDeep(fromJS({
      // extral setting
      chart: {
        data: {
          type: 'bar',
        },
        grid: {
          y: {
            show: true,
          },
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              count: 4,
              format: '%H:%M:%S',
            },
          },
        },
      },
    })),
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'rt-gauge': fromJS({
    id: '',
    namespace: 'RTChart',
    name: 'RTChart',
    props: fromJS(rtchartGaugeDefaultOptions).mergeDeep(fromJS({
      // extral setting
      chart: {
        data: {
          type: 'gauge',
        },
        grid: {
          y: {
            show: true,
          },
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              count: 4,
              format: '%H:%M:%S',
            },
          },
        },
      },
    })),
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'rt-line': fromJS({
    id: '',
    namespace: 'RTChart',
    name: 'RTChart',
    props: fromJS(rtchartDefaultOptions).mergeDeep(fromJS({
      // extral setting
      chart: {
        data: {
          type: 'line',
        },
        grid: {
          y: {
            show: true,
          },
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              count: 4,
              format: '%H:%M:%S',
            },
          },
        },
      },
    })),
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'rt-spline': fromJS({
    id: '',
    namespace: 'RTChart',
    name: 'RTChart',
    props: fromJS(rtchartDefaultOptions).mergeDeep(fromJS({
      // extral setting
      chart: {
        data: {
          type: 'spline',
        },
        grid: {
          y: {
            show: true,
          },
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              count: 4,
              format: '%H:%M:%S',
            },
          },
        },
      },
    })),
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'rt-step': fromJS({
    id: '',
    namespace: 'RTChart',
    name: 'RTChart',
    props: fromJS(rtchartDefaultOptions).mergeDeep(fromJS({
      // extral setting
      chart: {
        data: {
          type: 'step',
        },
        grid: {
          y: {
            show: true,
          },
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              count: 4,
              format: '%H:%M:%S',
            },
          },
        },
      },
    })),
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  /*
  Material UI Component, http://www.material-ui.com/#/components
  */
  'App Bar': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'AppBar',
    props: {
      style: {
        backgroundColor: '#0087dc',
      },
      title: 'AppBar',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Auto Complete': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'AutoComplete',
    props: {
      floatingLabelText: 'Auto Complete Label',
      hintText: 'input something',
      // required (see website offical spec) ARRAY
      dataSource: [],
      fullWidth: false,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Avatar: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Avatar',
    props: {
      size: 30,
      backgroundColor: '#0087dc',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Badge: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Badge',
    props: {
      // required (see website offical spec)
      badgeContent: '1',
      primary: true,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  /*
  svg icon for Material UI - Floating Action Button and Icon Button, NO need to be wrapped by dnd
   */
  ButtonIcon: fromJS({
    id: '',
    namespace: 'button-icon',
    name: 'ContentAdd', // default as pre-built SVG Icon components (Material icons)
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  Card: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Card',
    props: {
      style: {
        width: 250,
      },
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  CardActions: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'CardActions',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  CardHeader: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'CardHeader',
    props: {
      avatar: null,
      title: 'Avatar Title',
      subtitle: 'Subtitle',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  CardText: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'CardText',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  CardTitle: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'CardTitle',
    props: {
      title: 'Card Title',
      subtitle: 'Subtitle',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  Checkbox: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Checkbox',
    props: {
      label: 'Label of Checkbox',
      labelPosition: 'right',
      style: {
        width: 250,
      },
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Chip: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Chip',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Circular Progress': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'CircularProgress',
    props: {
      size: 1,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Date Picker': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'DatePicker',
    props: {
      // https://github.com/callemall/material-ui/issues/4659
      floatingLabelText: 'Date Picker',
      defaultDate: new Date(),
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Dialog: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Dialog',
    props: {
      title: 'Dialog',
      // * required property
      open: true,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Divider: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Divider',
    props: {
      inset: false,
      style: {
        width: 250,
      },
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Drawer: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Drawer',
    props: {
      open: true,
      openSecondary: true,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Drop Down Menu': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'DropDownMenu',
    props: {
      value: 1,
      animated: true,
      disabled: false,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Flat Button': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'FlatButton',
    props: {
      label: 'FlatButton',
      primary: false,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Floating Action Button': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'FloatingActionButton',
    props: { // ! children has only one (could not be array)
      mini: true,
      secondary: false,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Font Icon': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'FontIcon',
    props: {
      /*
      see material-icons.css in dev folder
      @see https://material.io/icons/
       */
      className: 'material-icons material-icons_refresh',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Grid List': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'GridList',
    props: {
      cols: 2,
      style: {
        width: 500,
        height: 500,
        overflowY: 'auto',
        marginBottom: 24,
      },
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  GridTile: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'GridTile',
    props: {
      title: 'title',
      subtitle: 'subtitle',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  'Icon Button': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'IconButton',
    props: {
      /*
      see material-icons.css in dev folder
      @see https://material.io/icons/
      @see FontIcon
      @see SvgIcon
       */
      // don't use iconClassName, use SvgIcon as its child to show the icon
      // iconClassName: 'material-icons material-icons_refresh',
      disabled: false,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Icon Menu': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'IconMenu',
    props: {
      iconButtonElement: <IconButton><MoreVertIcon /></IconButton>,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  /*
  svg icon for Material UI - Icons, need to be wrapped by dnd
   */
  Icons: fromJS({
    id: '',
    namespace: 'icons',
    name: 'ContentAdd', // default as pre-built SVG Icon components (Material icons)
    props: {
      icon: 'ContentAdd',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Linear Progress': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'LinearProgress',
    props: {
      mode: 'determinate',
      value: 50,
      style: {
        width: 250,
      },
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  List: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'List',
    props: {
      style: {
        width: 300,
      },
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  ListItem: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'ListItem',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Menu: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Menu',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  MenuItem: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'MenuItem',
    props: {
      value: 1,
      primaryText: 'I am a menu item',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  Paper: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Paper',
    props: {
      zDepth: 1,
      style: {
        height: 100,
        width: 100,
        overflow: 'auto',
      },
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Popover: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Popover',
    props: {
      open: false,
      anchorOrigin: {
        horizontal: 'left',
        vertical: 'bottom',
      },
      targetOrigin: {
        horizontal: 'left',
        vertical: 'top',
      },
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Radio Button': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'RadioButton',
    props: {
      style: {
        width: 250,
      },
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  RadioButtonGroup: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'RadioButtonGroup',
    props: {
      name: 'radioButtonGroup',
      defaultSelected: 'radioButton1',
      style: {
        width: 250,
      },
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Raised Button': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'RaisedButton',
    props: {
      label: 'RaisedButton',
      primary: true,
      fullWidth: false,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Refresh Indicator': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'RefreshIndicator',
    props: {
      // required (see website offical spec)
      top: 0,
      // required (see website offical spec)
      left: 10,
      size: 40,
      status: 'loading',
      style: {
        display: 'inline-block',
        position: 'relative',
      },
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Select Field': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'SelectField',
    props: {
      disabled: false,
      autoWidth: true,
      maxHeight: 200,
      floatingLabelText: 'Select Field',
      floatingLabelStyle: {
        color: 'red',
      },
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Slider: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Slider',
    props: {
      min: 0,
      max: 1,
      step: 0.10,
      defaultValue: 0.5,
      style: {
        width: 250,
      },
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'SVG Icon': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'SvgIcon',
    props: {
      /*
      support only one path here : children -> <path d="???" />
      custom svg coding way

      @see https://facebook.github.io/react/docs/dom-elements.html#all-supported-svg-attributes
       */
      children: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
      color: 'blue',
      hoverColor: 'green',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Snackbar: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Snackbar',
    props: {
      open: true,
      message: 'I am a Snackbar, almostly you will put hint message here',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Stepper: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Stepper',
    props: {
      activeStep: 1,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Subheader: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Subheader',
    props: {
      inset: true,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  Table: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Table',
    props: {
      style: {
        width: 400,
      },
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  TableBody: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'TableBody',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  TableFooter: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'TableFooter',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  TableHeader: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'TableHeader',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  TableHeaderColumn: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'TableHeaderColumn',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  TableRow: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'TableRow',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  TableRowColumn: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'TableRowColumn',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  Tab: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Tab',
    props: {
      label: 'Tab Name',
      value: '',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
  Tabs: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Tabs',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Text Field': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'TextField',
    props: {
      floatingLabelText: 'Label of TextField',
      hintText: 'input something',
      fullWidth: false,
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Time Picker': fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'TimePicker',
    props: {
      disabled: false,
      format: '24hr',
      // https://github.com/callemall/material-ui/issues/4659
      floatingLabelText: 'Time Picker',
      defaultTime: new Date(),
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Toggle: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Toggle',
    props: {
      label: 'Lable of Toggled',
      defaultToggled: true,
      style: {
        width: 250,
      },
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Toolbar: fromJS({
    id: '',
    namespace: 'material-ui',
    name: 'Toolbar',
    props: {
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  /*
  HTML tag (HTML)
   */
  Block: fromJS({
    id: '',
    namespace: 'native',
    name: 'div',
    props: {
      style: {
        width: 240,
        height: 240,
        backgroundColor: 'lightgray',
        overflow: 'auto',
      },
    },
    parentId: null,
    children: [],
    extension: {
      prop: false,
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Heading 1': fromJS({
    id: '',
    namespace: 'native',
    name: 'h1',
    props: {
      /*
      native html eat data-* key props, react only accept this way : new prop
      @see https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
       */
      'data-children-primitiveString': 'I am a h1 style',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Heading 2': fromJS({
    id: '',
    namespace: 'native',
    name: 'h2',
    props: {
      /*
      native html eat data-* key props, react only accept this way : new prop
      @see https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
       */
      'data-children-primitiveString': 'I am a h2 style',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Heading 3': fromJS({
    id: '',
    namespace: 'native',
    name: 'h3',
    props: {
      /*
      native html eat data-* key props, react only accept this way : new prop
      @see https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
       */
      'data-children-primitiveString': 'I am a h3 style',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Heading 4': fromJS({
    id: '',
    namespace: 'native',
    name: 'h4',
    props: {
      /*
      native html eat data-* key props, react only accept this way : new prop
      @see https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
       */
      'data-children-primitiveString': 'I am a h4 style',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Heading 5': fromJS({
    id: '',
    namespace: 'native',
    name: 'h5',
    props: {
      /*
      native html eat data-* key props, react only accept this way : new prop
      @see https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
       */
      'data-children-primitiveString': 'I am a h5 style',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  'Heading 6': fromJS({
    id: '',
    namespace: 'native',
    name: 'h6',
    props: {
      /*
      native html eat data-* key props, react only accept this way : new prop
      @see https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
       */
      'data-children-primitiveString': 'I am a h6 style',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Iframe: fromJS({
    id: '',
    namespace: 'native',
    name: 'iframe',
    props: {
      src: 'http://www.cwb.gov.tw/V7/forecast/week/week.htm#area1',
      height: 200,
      width: 400,
      // default remove border & give a hint size
      style: {
        border: 0,
        background: '#eeeeee',
      },
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
      style: true,
    },
  }),
  Image: fromJS({
    id: '',
    namespace: 'native',
    name: 'img',
    props: {
      // src: 'http://www.lilybearings.com/wp-content/themes/theme/images/default.png',
      alt: 'default image',
      // width: 200,
      // height: 150,
      src: 'http://placehold.it/200x150', // @see https://placehold.it/
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Paragraph: fromJS({
    id: '',
    namespace: 'native',
    name: 'p',
    props: {
      /*
      native html eat data-* key props, react only accept this way : new prop
      @see https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
       */
      'data-children-primitiveString': 'You can write long sentence with default style',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  Text: fromJS({
    id: '',
    namespace: 'native',
    name: 'div',
    props: {
      /*
      native html eat data-* key props, react only accept this way : new prop
      @see https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
       */
      'data-children-primitiveString': 'I am a text',
    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  /*
  wrap react-flexbox-grid for custom prop
  @see https://github.com/roylee0704/react-flexbox-grid
   */
  'Grid Layout': fromJS({
    id: '',
    namespace: 'GridLayout',
    name: 'GridLayout',
    props: {
      /* test codes
      col: 3,
      scale: [1, 2, 1],
      colAlign: [undefined, 'center'],
      colDirection: ['vertical', 'horizontal'],
      contentHeight: ['300', '100'],
      contentHeightUnit: ['px'],
      contentPadding: [0, 0],
      contentPosition: ['top-left', 'center', 'bottom-right'],
      distribution: 'around',
      */
      col: 2,
      scale: [1, 1],
      colAlign: [undefined, undefined],
      colDirection: ['vertical', 'vertical'],
      contentHeight: [100, 100], // default use 100
      contentHeightUnit: ['px', 'px'],
      contentPadding: [0, 0],
      contentPosition: ['top-left', 'top-left'],
      isEditMode: true, // for edit mode
    },
    parentId: null,
    children: [],
    extension: {
      style: true,
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  GridLayoutCol: fromJS({
    id: '',
    namespace: 'GridLayout', // wrap in this
    name: 'Col', // output this stencil for drop, but not for drag and setting
    props: {
      // prop attribule generate by GridLayout way at real-time, not defined here
    },
    parentId: null,
    children: [],
    extension: {
      style: false,
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  /*
  common component in DRC in Delta company inc.
   */
  PlainTable: fromJS({
    id: '',
    namespace: 'DRC',
    name: 'PlainTable',
    props: {
      columnDefs: [],
      rowData: [],
      theme: 'material',
      rowHeight: 48,
      style: {
        height: 400,
        width: 400,
      },
      onGridReady: true,
      dataTransformer: {
        url: '',
        fields: ['columnDefs', 'rowData'],
        transformer: `function transformer(data) {
          if (data !== undefined) {
            return data;
          }
        }`,
      },

    },
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: true,
    },
  }),
  /*
   * special tag, for nowrap by react-dnd plugin
   * defined by coder, not framework
   */
  'Primitive String': fromJS({
    id: '',
    namespace: PRIMITIVE_STRING_NAMESPACE,
    name: 'A', // just text
    props: {}, // THIS NEVER HAS PROPS
    parentId: null,
    children: [],
    extension: {
      action: false,
      dataBinding: false,
      dnd: false,
    },
  }),
};
/**
 * map a stencil
 *
 * add a alias name
 *
 * @param  {String} stencilName name on the page in browser
 * @return {Object}             immutable map object data
 */
const getStencilTemplate = (stencilName) => {
  const stencil = stencils[stencilName].mergeDeep(fromJS({ alias: stencilName }));

  return stencil;
};

export { getStencilTemplate };
/**
 * createStencil, data from 'stencils' json config
 * @param  {String} stencilName name on the page in browser
 * @param  {Object} props       {...} merge default
 * @return {Object}             new immutable map object data || undefined
 */
export function createStencil(stencilName, props = undefined) {
  let stencil = getStencilTemplate(stencilName);

  if (stencil === undefined) {
    return undefined;
  }
  if (props) {
    /*
    overwrite all:
    stencil = stencil.set('props', fromJS(props));
    merge default (use this):
     */
    stencil = stencil.mergeDeep(fromJS({ props }));
  }
  if (stencilName === PRIMITIVE_STRING && props) {
    stencil = stencil.set('name', props.value);
  }
  if (stencilName.match(/^hc-/)) {
    stencil = stencil.setIn(['props', 'container'], uuid.v4());
  }
  /*
  uuid.v4(): generate and return a RFC4122 v4 UUID
  ex: '110ec58a-a0f2-4ac4-8393-c866d813b8d1'

  returns a new Map also containing the new key, value pair
  */
  return stencil.set('id', uuid.v4());
}
