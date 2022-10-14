/**
 * @class element:cmp-doe
 * @noinstancector
 * @description
 * This component implements the DOE adapter editor.
 * Design of Experiments (DOE) is a general term that refers to any of the many formal methods
 * available for setting parameter values in a set of experiments. In Process Composer,
 * a DOE experiment is defined as an execution of the simulation process defined within the DOE adapter.
 */
require(['UWA/Core',
         'DS/SMAProcWebCMMUtils/SMAJSCMMUtils',
         'SMAProcWebDoeTechniquesBase/SMAProcDesignDriverDataHandler',
         'DS/JSCMM/SMAJSCMMExtensionConfig',
         'SMAProcWebDoeTechniquesBase/SMAProcDesignDriverFactorImpl',
         'DS/JSCMM/SMAJSCMMExtensionManager',
         'DS/'+'SMAProcWebAuthoringUtils/SMAProcWebAuthoringServices',
         'DS/SMAProcWebCMMUtils/SMAJSCMMParameterUtils',
         'DS/SMAProcWebCMMUtils/SMAJSCMMAuthoringUtils',
         'DS/JSCMM/SMAJSCMMParameter',
         'DS/Tweakers/TypeRepresentationFactory',
         'DS/Tree/TreeListView',
         'DS/SMAProcWebCommonControls/ExtensionChooser'],
function (UWA,
    SMAJSCMMUtils,
    SMAProcDesignDriverDataHandler,
    SMAJSCMMExtensionConfig,
    SMAProcDesignDriverFactorImpl,
    SMAJSCMMExtensionManager,
    SMAProcWebAuthoringServices,
    SMAJSCMMParameterUtils,
    SMAJSCMMAuthoringUtils,
    SMAJSCMMParameter,
    TypeRepFactory,
    TreeListView
){
    'use strict';

    //TLV
    //Instanciate a type factory and register custom enum
    var factorsTable;
    var TypeRepFactoryObj  = new TypeRepFactory();
    TypeRepFactoryObj.registerEnum('pcwDoeRelationTypes', ['diff', '%', 'values']);
     window.Polymer( /** @lends element:cmp-doe# */{
        is: 'cmp-doe',

        properties: /** @lends element:cmp-doe# */{
            //Variables
            /**
             * Activity containing DOE step
             * @type {Object}
             */
            _activity: {
                type: Object
            },
            /**
             * DOE Step ID
             * @type {Object}
             */
            _stepId: {
                type: Object
            },
            /**
             * DOE extension configuration containing plugin configurations and properties
             * @type {Object}
             */
            _extensionConfig: {
                type: Object
            },
            /**
             * An array of parameters on the activity containing DOE and the subflow parameters
             * @type {Array}
             */
            _activityparameters: {
                type: Array,
                value: function() { return []; }
            },
            /**
             * Array of subflow parameters that are temporarily added to the DOE activity
             * @type {Array}
             */
            _tempparameters: {
                type: Array,
                value: function() { return []; }
            },
            /**
             * Names of all the DOE plugins to retrieve extension descriptors
             * @type {Array}
             */
            extensions: {
                value: [
                        'com.dassault_systemes.sma.plugin.doe.BoxBehnken',
                        'com.dassault_systemes.sma.plugin.doe.CentralComposite',
                        'com.dassault_systemes.sma.plugin.doe.Datafile',
                        'com.dassault_systemes.sma.plugin.doe.FractionalFactorial',
                        'com.dassault_systemes.sma.plugin.doe.FullFactorial',
                        'com.dassault_systemes.sma.plugin.doe.LatinHypercube',
                        'com.dassault_systemes.sma.plugin.doe.OptimalLatinHypercube',
                        'com.dassault_systemes.sma.plugin.doe.OrthogonalArray',
                        'com.dassault_systemes.sma.plugin.doe.ParameterStudy'
                    ].join(', ')
            },
            /**
             * Selected plugin in extension chooser
             * @type {Object}
             */
            selectedPlugin: {
                type: Object,
                notify: true,
                observer: '_updateDOETechnique'
            },
            selectedExtensionName: {
                type: String,
                observer: '_selectedExtensionNameChanged'
            },
            /**
             * Extension configuration on the selected plugin
             * @type {Object}
             */
            pluginConfig: {
                type: Object,
                notify: true
            },
            /**
             * Technique options of the selected DOE technique/plugin
             * @type {Array}
             */
            techniqueOptions: {
                type: Array,
                notify: true,
                value: function() { return []; }
            },
            /**
             * DOE execution options
             * @type {Object}
             */
            executionOptions: {
                type: Object,
                notify: true,
                value: function() {
                    return {
                        'parallel' : false,
                        'execute subflow once' : false,
                        'failed runs policy' : 0,
                        'retry number': 1,
                        'replace pct': 1.0,
                        'update baselines': false
                    };
                }
            },
            /**
             * Web component of the selected DOE technique/plugin
             * @type {Object}
             */
            doetechnique: {
                type: Object,
                value: null,
                notify: true
            },
            /**
             * URL of the image to be rendered in the technique description section of the selected plugin
             * @type {String}
             */
            techniqueimagesrc: {
                type: String,
                value: '',
                notify: true
            },
            /**
             * Height of the factors and responses table.
             * @type {Number}
             */
            tableheight: {
                type: Number,
                value: 500
            },
            /**
             * Width of the factors and responses table.
             * @type {Number}
             */
            tablewidth: {
                type: Number,
                value: 620
            },
            /**
             * Factor names and their row indices in the factors table.
             * @type {Object}
             */
            factorRowIndex: {
                type: Object,
                notify: true,
                value: function() { return {}; }
            },
            /**
             * Column names in the factors table and their indices.
             * @type {Object}
             */
            factorColKeyIndex: {
                type: Object,
                readOnly: true,
                value: function () {
                    return {
                        'Name': 0,
                        'col_2': 1,
                        'numberoflevels': 2,
                        'Lower': 3,
                        'Upper': 4,
                        'Levels': 5,
                        'Relation': 6,
                        'Baseline': 7,
                        'Alpha': 8,
                        'Values': 9
                    };
                }
            },
            /**
             * Array of selected factors/parameters.
             * @type {Array}
             */
            factors: {
                type: Array,
                notify: true,
                value: function() { return []; }
            },
            /**
             * Response names and their row indices in the responses table.
             * @type {Object}
             */
            responseRowIndex: {
                type: Object,
                notify: true,
                value: function() { return {}; }
            },
            /**
             * Column names in the responses table and their indices.
             * @type {Object}
             */
            responseColKeyIndex: {
                type: Object,
                readOnly: true,
                value: function () {
                    return {
                        'Name': 0,
                        'col_2': 1,
                        'Objective': 2,
                        'Weight': 3,
                        'Target': 4
                    };
                }
            },
            /**
             * Array of selected responses/output parameters.
             * @type {Array}
             */
            responses: {
                type: Array,
                notify: true,
                value: function() { return []; }
            },
            /**
             * Values of the dropdown in the responses table.
             * @type {Object}
             */
            responseObjKey: {
                type: Object,
                readOnly: true,
                value: function () {
                    return {
                        0: 'minimize',
                        1: 'maximize',
                        2: 'target'
                    };
                }
            },
            /**
             * Columns in factors table to be provided to WebUX Tree list view.
             * @type {Array}
             */
            //TLV
            factorcolumns : {
                type: Array,
                value: function () {
                    return [
                      {
                        text: 'Name',
                        dataIndex: 'tree',
                        width: '30%',
                        isEditable: true,
                        isDraggable: false
                    }, {
                        text: '',
                        dataIndex: 'selection',
                        typeRepresentation: 'boolean',
                        width: '10%',
                        isDraggable: false
                    }, {
                        text: 'Lower',
                        dataIndex: 'Lower',
                        typeRepresentation: 'string',
                        isEditable: true,
                        isHidden: true,
                        isDraggable: false
                        //onCellRequest: onValueCellRequest
                    }, {
                        text: 'Upper',
                        dataIndex: 'Upper',
                        typeRepresentation: 'string',
                        isEditable: true,
                        isHidden: true,
                        isDraggable: false
                    }, {
                        text: 'Levels',
                        dataIndex: 'Levels',
                        typeRepresentation: 'string',
                        isEditable: true,
                        isHidden: true,
                        isDraggable: false
                    }, {
                        text: 'Relation',
                        dataIndex: 'Relation',
                        typeRepresentation: 'pcwDoeRelationTypes',
                        isEditable: true,
                        isHidden: true,
                        isDraggable: false
                    }, {
                        text: 'Baseline',
                        dataIndex: 'Baseline',
                        typeRepresentation: 'string',
                        isEditable: true,
                        isHidden: true,
                        isDraggable: false
                    }, {
                        text: 'Alpha',
                        dataIndex: 'Alpha',
                        typeRepresentation: 'string',
                        isEditable: true,
                        isHidden: true,
                        isDraggable: false
                    }, {
                        text: 'Values',
                        dataIndex: 'Values',
                        typeRepresentation: 'string',
                        isEditable: true,
                        isHidden: true,
                        isDraggable: false
                    }];
                }
            },
            /**
             * Columns in responses table to be provided to sp-tree-table web component.
             * @type {Array}
             */
            responsecolumns: {
                type: Array,
                value: function () {
                    return  [
                            {
                                name: 'Parameter',
                                key: 'Name',
                                type: 'text',
                                width_percent: 'auto'
                            },
                            {
                                name: '',
                                key: 'col_2',
                                type: 'checkbox',
                                width_percent: '10'
                            },
                            {
                                name: 'Objective',
                                key: 'Objective',
                                type: 'dropdown',
                                width_percent: 'auto',
                                options: [
                                    { value: 'Minimize' },
                                    { value: 'Maximize' },
                                    { value: 'Target' }
                                ]
                            },
                            {
                                name: 'Weight',
                                key: 'Weight',
                                type: 'text',
                                width_percent: 'auto'
                            },
                            {
                                name: 'Target',
                                key: 'Target',
                                type: 'text',
                                width_percent: 'auto'
                            }
                         ];
                },
                notify: true
            }
        },

        listeners: {
            'paramselected': 'addScannedParameters',
            'responsestable.onCellModified': '_responsestableCellModified'
          },

        observers: [
            'designPointOptionUpdated(executionOptions.failed runs policy)'
        ],

       /**
        * The ready callback is called when a Polymer element's (cmp-doe in this case) local DOM has been initialized.
        */
        ready: function() {
            console.log('<' + this.is + '> ready');

            //No fixed width leads to resizing the column to any extent
            /*this.$.factorstable.setFixedWidth(false);
            this.$.factorstable.setColumns(this.factorcolumns, this.tablewidth, this.tableheight);*/
            this.$.responsestable.setFixedWidth(false);
            this.$.responsestable.setColumns(this.responsecolumns, this.tablewidth, this.tableheight);
            this.ExtensionEditorImpl = {
                UpdateUI: this.UpdateUI.bind(this),
                Apply: this.Apply.bind(this)
            };
        },
        _factorstableCellModified: function (event) {
            console.log('<' + this.is + '> factorstable onCellModified handler');
            var cellinfo = event.detail.cellInfo;
            this._updateFactorRow(cellinfo);
            this._createParameterOnSelf(cellinfo);
        },
        _responsestableCellModified: function (event) {
            console.log('<' + this.is + '> responsestable onCellModified handler');
            var cellinfo = event.detail.cellInfo;
            this._updateResponseRow(cellinfo);
            this._createParameterOnSelf(cellinfo);
        },

        /**
         * Called after the element is attached to the document.
         * Can be called multiple times during the lifetime of an element.
         * The first `attached` callback is guaranteed not to fire until after `ready`.
         */
        attached: function () {
            //this._updateFactorsInView();
            /*var manger = this.factorsTable.getManager();
            manager.addEventListener('change', function(e, cellInfos){
                me._updateRows();
            });*/
        },

        /**
         * Initialize the the tree list view in factors tab with Input and Input/Output parameters
         */
        _intializeFactorsTable: function() {
            this._updateActivityParameters();
            //Icon for array parameters
            var arrayIcon = this.resolveUrl('../../SMAProcWebAuthoringUtils/assets/images/I_SMAWflArray.png');
        },

        /**
         * UpdateUI is called for an adapter in order to restore/repopulate the values from the
         * extension configuration received
         * @param {Object} activity - The activity of the adapter/step
         * @param {Object} stepId - The step ID of the adapter
         * @param {Object} ExtensionConfig - Extension configuration containing plugin config and properties for the step
         */
        UpdateUI: function (activity, stepId, ExtensionConfig) {
            console.log('<' + this.is + '> UpdateUI()');
            this._activity = activity;
            this._stepId = stepId;
            this._extensionConfig = ExtensionConfig;

            if (this._extensionConfig) {
                this.pluginConfig = this._extensionConfig.getPluginConfigurations()[0];
                if (this.pluginConfig) {
                    if (this.pluginConfig.getPropertyByName('Technique Options')){
                        this.techniqueOptions = this.pluginConfig.getPropertyByName('Technique Options').getProperties();
                    }
                    var extensionName = this.pluginConfig.getExtensionName();
                    this.selectedExtensionName = extensionName || 'com.dassault_systemes.sma.plugin.doe.LatinHypercube';
                } else {
                    this.selectedExtensionName = 'com.dassault_systemes.sma.plugin.doe.LatinHypercube';
                }
                this.parseExecutionOptionsProperty(this._extensionConfig.getPropertyByName('Execution Options'));
                var designParameters = this._extensionConfig.getPropertyByName('Design Parameters');
                if (designParameters) {
                    SMAProcDesignDriverDataHandler.parseDesignParametersProperty(
                        designParameters,
                        this._updateActivityParameters(),
                        this._activity,
                        this.factors,
                        this.responses
                    );
                }
                //Updating the parameters from the activity
                this._updateFactorsInView();
                this._updateFactorsAndResponses();
            }
        },

        /**
         * It saves the changes made by the user in the adapter definition.
         */
        Apply: function () {
            console.log('<' + this.is + '> Apply()');
            return;

            // Set descriptor values with attribute settings
            var extensionConfig = this._extensionConfig;
            if (!extensionConfig) {

            }
            var pluginConfig = this.selectedPlugin.createExtensionConfigData();
            var childConfigs = extensionConfig.getPluginConfigurations();

            while (childConfigs.length > 0) {
                extensionConfig.removePluginConfiguration(childConfigs[childConfigs.length-1]);
            }
            var pluginExtensionConfig = new SMAJSCMMExtensionConfig(pluginConfig);
            if (pluginExtensionConfig.getPropertyByName('Technique Options')) {
                this.doetechnique.Apply(pluginExtensionConfig);
            }
            var techniqueProperties = pluginExtensionConfig.getProperties();
            techniqueProperties.push(SMAProcDesignDriverDataHandler.createPluginNameProperty());
            extensionConfig.addPluginConfiguration(pluginExtensionConfig);

            var properties = extensionConfig.getProperties();
            properties.splice(0, properties.length);

            var factorPropertyStructure = SMAProcDesignDriverDataHandler.buildDesignParametersProperty(this.factors, this.responses);
            if (factorPropertyStructure) {
                properties.push(factorPropertyStructure);
           }

            this.updateAppData();
            var executionOptionsPropertyStructure = SMAProcDesignDriverDataHandler.buildExecutionOptionsProperty(this.executionOptions);
            properties.push(executionOptionsPropertyStructure);
        },

        /**
         * It is called during the apply of DOE step.
         * All the parameters that have been selected as factors for the DOE step will have their
         * Formulation App data (Lower bound and Upper bound) updated on the save of the step.
         */
        updateAppData: function () {
            var i, j;
            var len = this.factors.length;
            var updatedParameters = [];
            for (i = 0; i < len; i++) {
                var factor = this.factors[i];
                var name  = factor.Name;
                var index = name.indexOf('[');
                var pName = name, pIndex = '';
                //The index will be non-negative in case of array parameters.
                //For an array parameter, the formulation data would look like:
                //<AppData index = "[0,0,0]" key = "Formulation.LowerBound">4.25</AppData>
                //For a scalar parameter, the formulation data would look like:
                //<AppData index = "" key = "Formulation.LowerBound">0.9</AppData>
                if (index > -1) {
                    pName = name.substring(0, index);
                    pIndex = name.substring(index);
                }
                var param = SMAProcDesignDriverDataHandler.findParameterByName(pName, this._activityparameters);
                if (factor.Lower !== undefined) {
                    param.addAppData('Formulation', 'LowerBound', pIndex, factor.Lower);
                }
                if (factor.Upper !== undefined) {
                    param.addAppData('Formulation', 'UpperBound', pIndex, factor.Upper);
                }
                if (!this.isPresent(updatedParameters, param))
                    { updatedParameters.push(param); }
            }
            for (j = 0; j < updatedParameters.length; j++) {
                SMAJSCMMParameterUtils.modifyParameter(updatedParameters[j]);
            }
        },

        isPresent: function(arr, val) {
            return arr.some(function(arrVal) {
              return val.getName() === arrVal.getName();
            });
        },

        /**
         * It is called specifically for the Data File technique, in case of the Document Input.
         * Whenever a document input is selected and scanned for parameter, this event is triggered as
         * the user tries to create the scanned parameter on the activity containing DOE
         * @param {Object} event - The event details on parameter selection
         */
        addScannedParameters: function (event) {
            var cellinfo = event.detail.cellinfo;
            var paramName = event.detail.cellinfo.DOMrow.cells[0].textContent;
            var param = SMAProcDesignDriverDataHandler.findParameterByName(paramName, this._activityparameters);
            var isSelected = cellinfo.DOMrow.cells[1].getElementsByClassName('checkbox')[0].checked;
            var mode = SMAJSCMMUtils.Mode.client.In;
            var selectedMode  = event.detail.cellinfo.DOMrow.cells[2].getElementsByTagName('select')[0].value;
            if (SMAJSCMMUtils.Mode.client[selectedMode] !== SMAJSCMMUtils.Mode.InOut) {
                mode = SMAJSCMMUtils.Mode.InOut;
            } else if (selectedMode === 'Out') {
                mode = SMAJSCMMUtils.Mode.client.Out;
            }
            if (cellinfo.DOMcell.type === 'checkbox' && isSelected) {
                var newparam = new SMAJSCMMParameter();
                newparam.setName(paramName);
                newparam.setStructure(SMAJSCMMUtils.Structure.client.Scalar);
                newparam.setMode(mode);
                newparam.setDataType(SMAJSCMMUtils.DataType.client.Real);
                newparam.setValue(0);
                SMAJSCMMParameterUtils.addParameter(newparam, this._activity);
            } else if (cellinfo.DOMcell.type === 'checkbox' && !isSelected) {
                SMAJSCMMParameterUtils.deleteParameter(param);
            }
            if (cellinfo.DOMcell.type === 'dropdown' && isSelected) {
                param.setMode(mode);
            }

            this._updateFactorsAndResponses();
        },


        /**
         * If a child parameter is selected in either Factors or Response table,
         * it needs to be added to the DOE activity, which is the parent of the
         * parent activity of the selected parameter
         * @param {Object} cellinfo - Cell, row information of the selected parameter in the table
         */
        _createParameterOnSelf: function (cellinfo) {
            var paramName;
            /*if (this.$.factorstable._hasRoot(cellinfo.DOMrow))
                { paramName = paramName = this.buildParamName(this.$.factorstable._treeRootPath(cellinfo.DOMrow)); }
            else*/
                { paramName = cellinfo.DOMrow.cells[0].textContent.trim(); }
            var isSelected = cellinfo.DOMrow.cells[1].getElementsByClassName('checkbox')[0].checked;
            var index = -1;
           //TODO: Will need to fix this once we know how to identify if the property is array element or not
            if (paramName.indexOf('[') > -1) {
                paramName = paramName.substring(0, paramName.indexOf('['));

            }

            var selectedParam = SMAProcDesignDriverDataHandler.findParameterByName(paramName, this._updateActivityParameters());
            if (cellinfo.DOMcell.type === 'checkbox' && !isSelected) {
                //Pattern matching is done specifically to determine whether to delete the array parameter or not
                //If there is any other array element for the same parameter existing in the selected factors/responses
                //then the parameter cannot be deleted
                var re = new RegExp('^'+paramName + '\\[');
                for (var i = 0; i < this.factors.length; i++) {
                    if (this.factors[i]['Name'].match(re) !== null) {
                        index = i;
                    }
                }
                for (var i = 0; i < this.responses.length; i++) {
                    if (this.responses[i]['Name'].match(re) !== null) {
                        index = i;
                    }
                }
                //Another check that delete the parameter only if it exists in the temporary container
                //because if the parameter is on self, then it shouldn't be deleted.
                //**Delete the parameter (array or scalar) if and only if it was temporarily added and
                //**there is no other array parameter in either factors or responses
                if (index < 0 && this._tempparameters.indexOf(selectedParam.getName()) > -1) {
                    SMAJSCMMParameterUtils.deleteParameter(selectedParam);
                }
            }
            //**Add the parameter only if the parent of the selected parameter is not the activity containing DOE
            //**(i.e. if its a subflow parameter)
            if (cellinfo.DOMcell.type === 'checkbox' && isSelected && selectedParam !== undefined && selectedParam !== null
                    && selectedParam.getParent() !== this._activity) {
                if (selectedParam.getStructure() === SMAJSCMMUtils.Structure.client.Array) {
                    SMAJSCMMParameterUtils.initializeValuesForArrayParam(selectedParam);
                }
                SMAJSCMMParameterUtils.addParameter(selectedParam, this._activity);
                this.push('_tempparameters', paramName);
            }
        },

        /**
         * Populates the Factors table with the activity parameters (array and scalar)
         * Factors table takes the Input and InOut parameters
         */
        _updateFactorsInView: function () {

            this._updateActivityParameters();
            var arrayIcon = this.resolveUrl('../../SMAProcWebAuthoringUtils/assets/images/I_SMAWflArray.png');
            //Remove rows?
            var factorTreeData = {
                isEditable: false,
                columns: this.factorcolumns,
                data: [],
                height: 'auto',
                defaultCellHeight: 40,
                resize:{
                    rows: false,
                    columns: true
                },
                allowUnsafeHTMLContent : true // XSS_CHECKED 
            };
            var me = this;
            require(['DS/Tree/TreeListView',
                'DS/Tree/TreeDocument',
                'DS/Tree/TreeNodeModel'
                ],
            function (TreeListView,
                TreeDocument,
                TreeNodeModel) {
                try {
                    //Manager is used to manipulate/interact with the DataGrid model
                    var manager;
                    me.model = new TreeDocument({
                        useAsyncPreExpand: false
                    });
                    me.model.prepareUpdate();
                    for (var i = 0; i < me._activityparameters.length; i++) {
                        if (me.isParameterInput(me._activityparameters[i].getMode())) {
                            var factorRoot = new TreeNodeModel({
                                label: me._activityparameters[i].getName(),
                                grid: {
                                    selection: false,
                                    lower: '',
                                    upper: '',
                                    levels: '',
                                    relation: '',
                                    baseline: '',
                                    alpha: '',
                                    values: ''
                                }
                            });

                            if (me._activityparameters[i].getStructure() === SMAJSCMMUtils.Structure.client.Array) {

                                /* it gives the dimensions as an array for the array
                                 parameters
                                 eg: [4,5,6] or [2,3]*/
                                var parameter = me._activityparameters[i];
                                var dimensions = parameter.getDimensions();
                                // length of the dimensions array above
                                var paramDepth = dimensions.length;
                                // Values for mutli-dimensional array are stored in
                                // a 1-D array
                                // Eg: If the array is [2,3] then the values array
                                // will be of length 6.
                                var values = parameter.getValues();
                                var lastdim = paramDepth - 1;
                                var curdim = 0;
                                var dimindex = [];
                                var dims = [];
                                for (var j = 0; j < paramDepth; ++j) {
                                    dims.push(parseInt(dimensions[j]));
                                    dimindex.push(0);
                                }
                                var parentrow = factorRoot;
                                var done = false;

                                while (!done) {
                                    if (curdim === lastdim) {
                                        var childnode = new TreeNodeModel({
                                            label: dimindex[curdim].toString(),
                                            grid: {
                                                selection: false,
                                                lower: '',
                                                upper: '',
                                                levels: '',
                                                relation: '',
                                                baseline: '',
                                                alpha: '',
                                                values: ''
                                            }
                                        });
                                        parentrow.addChild(childnode);
                                        dimindex[lastdim]++;
                                    }

                                    if (dimindex[curdim] === dims[curdim]) {
                                        // compute next indices
                                        while (dimindex[curdim] === dims[curdim]) {
                                            if (curdim === 0) {
                                                done = true;
                                                break;
                                            }
                                            dimindex[curdim] = 0;
                                            --curdim;
                                            parentrow = parentrow.getParent();
                                        }
                                        dimindex[curdim]++;
                                    } else if (curdim != lastdim) {
                                        var childnode = new TreeNodeModel({
                                            label: dimindex[curdim].toString(),
                                            grid: {
                                                selection: false,
                                                lower: '',
                                                upper: '',
                                                levels: '',
                                                relation: '',
                                                baseline: '',
                                                alpha: '',
                                                values: ''
                                            }
                                        });
                                        parentrow.addChild(childnode);
                                        parentrow = childnode;
                                        curdim++;
                                }
                            }
                        }
                        me.model.addRoot(factorRoot);
                    }
                }

                me.model.pushUpdate();
                factorTreeData.show = {
                    rowHeaders: false,
                    columnHeaders: true
                };
                factorTreeData.defaultCellHeight = 30;
                factorTreeData.resize = {
                    columns : true,
                    rows: false
                };
                factorTreeData.showVerticalLines = true;
                factorTreeData.performances = {
                    buildLinks: false

                };

                factorTreeData.treeDocument = me.model;
                me.factorsTable = new TreeListView(factorTreeData);
                manager = me.factorsTable.getManager();
                manager.onReady(function() {
                    manager.loadDocument(me.model);
                    manager.addEventListener('change', function(e, cellInfos){
                        me._updateRows(e, cellInfos);
                    });
                });
                me.factorsTable.inject(me.$.factortablediv);
                } catch (error) {
                    window.console.log(error);
                }
            });
        },

        /**
         * Adds the value of the parameter selected as a factor as another attribute to the cellinfo
         * @param {Object} cellinfo - Cell, row information of the selected parameter in the table
         * @param {paramName} String - Name of the selected scalar or array parameter
         */
        _addParameterValue: function (cellinfo, paramName) {
            cellinfo.paramvalue = {};
            var pName = paramName;
            var pNum = 0;
            if (paramName.indexOf('[') > -1) {
                pName = paramName.substring(0, paramName.indexOf('['));
                pNum = paramName.substring(paramName.indexOf('[')+1, paramName.indexOf(']')).split(',');
            }
            var selectedParam = SMAProcDesignDriverDataHandler.findParameterByName(pName, this._updateActivityParameters());
            if (selectedParam.getStructure() === SMAJSCMMUtils.Structure.client.Scalar){
                cellinfo.paramvalue = selectedParam.getValue();
            } else if (selectedParam.getStructure() === SMAJSCMMUtils.Structure.client.Array) {
                var arrValues = selectedParam.getValues();
                var arrDim = selectedParam.getDimensions();
                var index = 0;
                var res = 0;
                var fac = 1;
                var len =  arrDim.length;
                for (var i = 0; i < arrDim.length; i++) {
                    index = len - i - 1;
                    if ((parseInt(pNum[index]) < parseInt(arrDim[index])) && (parseInt(pNum[index]) >= 0)) {
                        res = res + parseInt(pNum[index]) * fac;
                        fac = fac * parseInt(arrDim[index]);
                    }
                }
                cellinfo.paramvalue = arrValues[res];
            }
        },

        /**
         * Populates the Factors and Responses tables with the activity parameters (array and scalar)
         * Factors table takes the Input and InOut parameters
         * Responses table takes the Output parameters
         */
        _updateFactorsAndResponses: function () {
            this._updateActivityParameters();
            //Icon for array parameters
            var arrayIcon = this.resolveUrl('../../SMAProcWebAuthoringUtils/assets/images/I_SMAWflArray.png');
            var frowIndex = 0;
            var rrowIndex = 0;
            //Reset the table rows
           /* this.$.factorstable.removeRows();*/
            this.$.responsestable.removeRows();
            for (var i = 0; i < this._activityparameters.length; i++) {
                var rowcontent;
                var parameter = this._activityparameters[i];
                var mode = parameter.getMode();
                // Structure of a parameter: Scalar, Array, Aggregate
                if (parameter.getStructure() === SMAJSCMMUtils.Structure.client.Array && this.isParameterOutput(mode)) {
                    // Parent row, renders the name of the parameter
                    /*if (this.isParameterInput(mode)){
                        rowcontent = this._initializeFactorRowContent(parameter, arrayIcon, null);
                    }*/

                    if (this.isParameterOutput(mode)) {
                        rowcontent = this._initializeResponseRowContent(parameter, arrayIcon, null);
                    }
                    /**
                     * *** Start: Parsing multi-dimensional array ****
                     */
                    // it gives the dimensions as an array for the array
                    // parameters
                    // eg: [4,5,6] or [2,3]
                    var dimensions = parameter.getDimensions();
                    // length of the dimensions array above
                    var paramDepth = dimensions.length;
                    // Values for mutli-dimensional array are stored in
                    // a 1-D array
                    // Eg: If the array is [2,3] then the values array
                    // will be of length 6.
                    var values = parameter.getValues();
                    var lastdim = paramDepth - 1;
                    var curdim = 0;
                    var dimindex = [];
                    var dims = [];
                    for (var j = 0; j < paramDepth; ++j) {
                        dims.push(parseInt(dimensions[j]));
                        dimindex.push(0);
                    }
                    var parentrow = rowcontent;
                    var done = false;
                    if (this.isParameterInput(mode)) {
                        this.factorRowIndex[parameter.getName()] = frowIndex;
                        frowIndex++;
                    }
                    if (this.isParameterOutput(mode)) {
                        this.responseRowIndex[parameter.getName()] = rrowIndex;
                        rrowIndex++;
                    }
                    while (!done) {
                        if (curdim === lastdim) {
                            // leaf row, add parameter values
                            var childrow = {};
                            if (this.isParameterOutput(mode)) {
                                childrow = this._initializeResponseRowContent(parameter, null, dimindex[curdim].toString());
                            }

                            // add reference to parent row
                            childrow['parent'] = parentrow;

                            if (!parentrow.children) {
                                parentrow['children'] = [];
                            }

                            // append a reference to this row in parent
                            parentrow.children.push(childrow);
                            if (this.isParameterOutput(mode)) {
                                this.responseRowIndex[parameter.getName() + '[' + dimindex + ']'] = rrowIndex;
                                rrowIndex++;
                            }
                            dimindex[lastdim]++;
                        }

                        if (dimindex[curdim] === dims[curdim]) {
                            // compute next indices
                            while (dimindex[curdim] === dims[curdim]) {
                                if (curdim === 0) {
                                    done = true;
                                    break;
                                }
                                dimindex[curdim] = 0;
                                --curdim;
                                parentrow = parentrow.parent;
                            }
                            dimindex[curdim]++;
                        } else if (curdim != lastdim) {
                            // intermediate row, add array indices
                            if (!parentrow.children) {
                                parentrow['children'] = [];
                            }

                            var childrow = {
                                Name: {
                                    value : dimindex[curdim].toString(),
                                    editable : false
                                },
                                children: [],
                                parent: parentrow
                            };
                            parentrow.children.push(childrow);
                            parentrow = childrow;
                            curdim++;
                        }
                    }
                    /**
                     * *** End: Parsing multi-dimensional array ***
                     */

                } else {
                    // For a scalar parameter
                    /*if (this.isParameterInput(mode)) {
                        rowcontent = this._initializeFactorRowContent(parameter, null, null);
                        this.factorRowIndex[parameter.getName()] = frowIndex;
                        frowIndex++;
                    }*/

                    if (this.isParameterOutput(mode)) {
                        rowcontent =this._initializeResponseRowContent(parameter, null, null);
                        this.responseRowIndex[parameter.getName()] = rrowIndex;
                        rrowIndex++;
                    }
                }
                /*if (this.isParameterInput(mode)) {
                    var row = this.$.factorstable.insertRow(rowcontent, -1);
                    var cells = row.cells;
                    for (var j=0; j<cells.length; j++){
                        if (cells[j].type === 'dropdown') {
                            cells[j].getElementsByTagName('select')[0].disabled = true;
                        }
                    }
                }
                else*/
                if (this.isParameterOutput(mode)){
                    var row = this.$.responsestable.insertRow(rowcontent, -1);
                    var cells = row.cells;
                    for (var j=0; j<cells.length; j++){
                        if (cells[j].type === 'dropdown') {
                            cells[j].getElementsByTagName('select')[0].disabled = true;
                        }
                    }
                }
            }
            if (this.doetechnique) {
                this._updateFactorTableCols();
            }

        },

        /**
         * Determines if the parameter is input
         * @param {Number} mode - mode of the parameter
         * @returns {Boolean} True if its input
         */
        isParameterInput: function(mode) {
            return ((mode === SMAJSCMMUtils.Mode.client.In) || (mode === SMAJSCMMUtils.Mode.InOut));
        },

        /**
         * Determines if the parameter is output
         * @param {Number} mode - mode of the parameter
         * @returns {Boolean} True if its output
         */
        isParameterOutput: function(mode) {
            return mode === SMAJSCMMUtils.Mode.client.Out;
        },

        /**
         * Updates the activity parameters, if any newly selected parameters are added
         * @returns {Array} An array of all the updated parameters on the activity and subflow
         */
        _updateActivityParameters: function() {
            var selfchildparameters = [];
            var allparameters = [];
            this._activityparameters = [];
            if (this._activity !== null && this._activity !== undefined) {
                this._activityparameters.length = 0;
                selfchildparameters = SMAJSCMMParameterUtils.getPotentialParameters(this._activity);
                allparameters = selfchildparameters.self.concat(selfchildparameters.children?selfchildparameters.children:[]);
                for (var i = 0; i < allparameters.length; i++) {
                    if (allparameters[i].getDataType() === SMAJSCMMUtils.DataType.client.Integer ||
                            allparameters[i].getDataType() === SMAJSCMMUtils.DataType.client.Real) {
                        this._activityparameters.push(allparameters[i]);
                    }
                }
            }
            return this._activityparameters;
        },

        /**
         * Parses and formats the description from the plugin descriptor to be rendered in
         * the technique description section of the UI
         * @param {String} text Potentially unsafe HTML text
         * @returns {DOMElement} escaped DOM content with formatting
         */
        _textToUwaDom: function (text) {
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(text, 'text/html');
            return Array.prototype.map.call(htmlDoc.body.childNodes,
                function (childnode) {
                    var mappedEl;
                    // if an element, map its content with formatting if
                    // necessary
                    if (childnode.tagName) {
                        // span with bold font should map to <strong>
                        if (childnode.tagName === 'SPAN' && childnode.style.fontWeight === 'bold') {
                            mappedEl = {tag:'strong', text: childnode.textContent};
                        } else {
                            mappedEl = {text: childnode.textContent};
                        }
                    } else {
                        mappedEl = {text: childnode.textContent};
                    }
                    return mappedEl;
                }
            );
        },

        /**
         * Updates the technique data once a technique is selected/updated, that includes getting the
         * technique options and updating the factors table with appropriate columns and loading the
         * technique web components
         */
        _getTechniqueData: function() {
            var cmpDoe = this;
            var techOptionsFieldset = this.$.doetechniqueoptions;
            var techniqueComponents = techOptionsFieldset.children;

            var webCompName = this.selectedPlugin.getWebComponent();
            var wcUrl = this.selectedPlugin.getWebEditorUrl();

            for (var i = 1; i < techniqueComponents.length; i++){
                techniqueComponents[i].classList.add('hidden');
            }
            if (wcUrl && webCompName) {
                SMAProcWebAuthoringServices.importAndCreate(wcUrl, webCompName,
                        function success (wc) {
                            console.log('<' + cmpDoe.is + '> _getTechniqueData() loaded component:' + webCompName);
                            cmpDoe.doetechnique = wc;
                            cmpDoe.doetechnique.activity = cmpDoe._activity;
                            if (techniqueComponents.length === 1) {
                                techOptionsFieldset.appendChild(cmpDoe.doetechnique);
                            } else if ((techniqueComponents.length > 1) &&
                                (techniqueComponents[1].nodeName.toLowerCase() !== cmpDoe.doetechnique.nodeName.toLowerCase())) {
                                techOptionsFieldset.replaceChild(cmpDoe.doetechnique, techniqueComponents[1]);
                            }
                            cmpDoe._updateFactorTableCols();
                            cmpDoe._updateFactorAttributes();
                        }, function error (e) {
                            console.error('<' + cmpDoe.is + '> web component not loaded', e);
                        }
                );
            }
        },

        /**
         * Updates the technique data once a technique is selected/updated, that includes the
         * technique description and image.
         * @param {Object} newValue - The new selected technique
         */
        _updateDOETechnique: function(newValue) {
            if (newValue !== null) {
                var plugin = newValue.value || newValue;
                var descriptionDom = this._textToUwaDom(plugin.getLongDescription());
                var description = this.$.general.querySelector('#techniquedescription');
                UWA.extendElement(description).setContent(descriptionDom);
                this.techniqueimagesrc = this.resolveUrl('../assets/images/'+ plugin.getStreams()[0].sourceFilename);
                this._getTechniqueData();
            }
        },

        _selectedExtensionNameChanged: function () {
            var cmpDoe = this;
            var extensionName = cmpDoe.selectedExtensionName;
            SMAJSCMMAuthoringUtils.getExtensionDescriptor(extensionName, {
                onSuccess : function(descriptor) {
                    cmpDoe.selectedPlugin = descriptor;
                },
                onFailure: function () {
                    console.warn('<' + cmpDoe.is + '> failed to load extension descriptor for:', extensionName);
                }
            });
        },

        /**
         * Hides/shows the columns of the factors table based on the selected technique
         */
        _updateFactorTableCols: function() {
            if (this.factorsTable){
                var manager = this.factorsTable.getManager();
                //Hide all the columns first to be able to show only the technique specific columns
                this._hideAllColumns();
                if (this.doetechnique.factorColumns && manager) {
                    for (var i = 0; i < this.doetechnique.factorColumns.length; ++i) {
                        manager.showColumn(this.doetechnique.factorColumns[i]);
                    }
                }
            }
        },

        /**
         * Hides all the columns of the factors table except the first two that have the name and the selection
         * since they are visible for all the techniques
         */
        _hideAllColumns: function() {
            var manager = this.factorsTable.getManager();
            for (var i = 2; i < this.factorcolumns.length; i++) {
                manager.hideColumn(this.factorcolumns[i].dataIndex);
            }
        },

        /**
         * Updates the factor attributes if any selected and makes the cells of the selected
         * factors editable
         */
        _updateFactorAttributes: function() {
            if (!this.doetechnique) {
                console.warn('<' + this.is + '> _updateFactorAttributes missing doetechnique!', this);
            }
            if (this.doetechnique.updateTechniqueOptions) {
                this.doetechnique.updateTechniqueOptions(this.techniqueOptions);
            }
            var expfactors = this.factors;
            if (this.factors.length > 0){
                if (this.doetechnique.reviseFactorAttributes) {
                    this.factors = this.doetechnique.reviseFactorAttributes(this.factors);
                } else {
                    this.doetechnique.updatedFactors = this.factors;
                }
                for (var i = 0; i < this.factors.length; i++) {
                    var index = SMAProcDesignDriverFactorImpl.findFactor(this.factors[i].Name, expfactors);
                    this.factors[i]['Expression'] = this.doetechnique.updatedFactors[i]['Expression'] = {};
                    this.factors[i]['Expression'] = this.doetechnique.updatedFactors[i]['Expression'] = expfactors[index]['Expression'];
                }
                for (var i = 0; i < this.doetechnique.updatedFactors.length; i++) {
                    var factor = this.doetechnique.updatedFactors[i];
                    var rowIndex = this.factorRowIndex[factor.Name];
                    /*var row = this.$.factorstable.getRow(rowIndex);*/
                    this._makeFactorsCellsEditable(row, rowIndex, factor);
                }
            }
            if (this.responses.length > 0){
                for (var i = 0; i < this.responses.length; i++) {
                    var response = this.responses[i];
                    var rowIndex = this.responseRowIndex[response.Name];
                    var row = this.$.responsestable.getRow(rowIndex);
                    this._makeResponsesCellsEditable(row, rowIndex, response);
                }
            }
        },

        /**
         * Makes the cells of the selected factors editable in the Factors table
         * @param {Object} row row structure
         * @param {Integer} rowIndex index of row in factor table
         * @param {Object} factor factor for the row
         */
        _makeFactorsCellsEditable: function(row, rowIndex, factor) {
           /* var length = row.cells.length;
            for (var i=0; i<length; i++) {
                var cell = row.cells[i];
                if (cell.column.key !== 'Name') {
                    if (cell.column.key === 'col_2') {
                        this.$.factorstable.setCheckboxValue(cell.getElementsByClassName('checkbox')[0], true);
                        //cell.getElementsByClassName('checkbox')[0].checked = true
                        factor.cellinfo = this.$.factorstable.getCellInfo(rowIndex, i);
                    }
                    if ((cell.type === 'text') && (cell.column.key !== 'Values')) {
                        if (cell.column.key in factor) {
                            this.$.factorstable.makeTextCellEditable(rowIndex, cell.cellIndex, factor[cell.column.key]);
                        } else if (cell.column.key === 'numberoflevels' && '# Levels' in factor) {
                            this.$.factorstable.makeTextCellEditable(rowIndex, cell.cellIndex, factor['# Levels']);
                        } else {
                            this.$.factorstable.makeTextCellEditable(rowIndex, cell.cellIndex, '');
                        }
                        if ((factor['Expression'] !== undefined) && ((factor['Expression'][cell.column.key] !== undefined) ||
                                (cell.column.key === 'numberoflevels' && '# Levels' in factor['Expression']))) {
                            var input = cell.querySelector('input');
                            input.disabled = true;
                        }
                    }
                    if (cell.column.key === 'Values' && cell.hidden == false && this.doetechnique.populateFactorValues) {
                        this.doetechnique.populateFactorValues(factor);
                    }
                    if ((cell.type === 'dropdown') && (cell.column.key in factor)) {
                        var select = cell.getElementsByTagName('select')[0];
                        select.disabled = false;
                        select.selectedIndex = SMAProcDesignDriverFactorImpl.factorRelationOptions.value.indexOf(factor[cell.column.key]);
                        select.title = factor[cell.column.key];
                        if ((factor['Expression'] !== undefined) && (factor['Expression'][cell.column.key] !== undefined)) {
                            cell.contentEditable = false;
                            var select = cell.querySelector('select');
                            if ((select !== null) || (select !== undefined)){
                                select.disabled = true;
                            }
                        }
                    }
                }
            }*/
        },

        /**
         * Makes the cells of the selected responses editable in the Responses table
         * @param {Object} row row structure
         * @param {Integer} rowIndex index of row in factor table
         * @param {Object} response response for the row
         */
        _makeResponsesCellsEditable: function(row, rowIndex, response) {
            var length = row.cells.length;
            var select;
            for (var i=0; i<length; i++) {
                var cell = row.cells[i];
                if (cell.column.key !== 'Name') {
                    if (cell.column.key === 'col_2') {
                        /*this.$.factorstable.setCheckboxValue(cell.getElementsByClassName('checkbox')[0], true);*/
                        //cell.getElementsByClassName('checkbox')[0].checked = true
                        response.cellinfo = this.$.responsestable.getCellInfo(rowIndex, i);
                    }
                    if (cell.type === 'dropdown') {
                        select = cell.getElementsByTagName('select')[0];
                        select.disabled = false;
                        for (var key in this.responseObjKey) {
                            if (this.responseObjKey[key] === response[cell.column.key]) {
                                select.selectedIndex = key;
                                break;
                            }
                        }
                    }
                    if (cell.type === 'text') {
                        if (cell.column.key in response) {
                            this.$.responsestable.makeTextCellEditable(rowIndex, cell.cellIndex, response[cell.column.key]);
                        } else {
                            if ((cell.column.key === 'Target') && (select.selectedIndex === 2))
                                { this.$.responsestable.makeTextCellEditable(rowIndex, cell.cellIndex, '0'); }
                            /*else if(select.selectedIndex > -1)
                                this.$.responsestable.makeTextCellEditable(rowIndex, cell.cellIndex, '1');*/
                        }
                    }

                }
            }
        },

        /**
         * On selection of a new Factor the row is updated with default or recalculated based on the selected technique
         * @param {Object} event - The event that was triggered for update
         * @param {Object} cellinfo - Information of the selected cell and row
         */
        _updateRows: function (event, cellinfo) {
            var newVal = event.dsModel.value;
            var paramName = '';
            var path = cellinfo.nodeModel.getPath();
            if (path.length > 1) {
                paramName = this.buildParamNameFromPath(path);
            } else {
                paramName = cellinfo.nodeModel._options.label;
            }
            if ((cellinfo.dataIndex !== 'name') &&
                (cellinfo.dataIndex !== 'selection') &&
                (cellinfo.dataIndex !== 'values')) {
                cellinfo.nodeModel._options.grid[cellinfo.dataIndex] = newVal;
                this.doetechnique.updateFactorInfo(cellinfo, paramName);
            }
            //Since the column in consideration here is the checkbox, it can only either be true or false
            if (cellinfo.dataIndex === 'selection' && newVal) {
                this._addParameterValue(cellinfo.nodeModel._options, paramName);
                this.factors = this.doetechnique.populateDefaults(cellinfo.nodeModel._options, paramName);
            } else {
                this.factors = this.removeFactors(cellinfo.nodeModel._options, paramName);
                if (this.selectedPlugin.GetTitle() === 'Central Composite') {
                    this.doetechnique.factorRemoved(cellinfo);
                }
            }

        },

        /**
         * On selection of a new Factor the row is updated with default or recalculated based on the selected technique
         * @param {Object} cellinfo - Information of the selected cell and row
         */
        _updateFactorRow: function(cellinfo) {
            /*var paramName='';
            if (this.$.factorstable._hasRoot(cellinfo.DOMrow) === true){
                paramName = this.buildParamName(this.$.factorstable._treeRootPath(cellinfo.DOMrow));
            } else {
                paramName = cellinfo.DOMrow.cells[0].textContent.trim();
            }

            if ((cellinfo.DOMcell.type === 'text') || (cellinfo.DOMcell.type === 'dropdown')){
                this.doetechnique.updateFactorInfo(cellinfo, paramName);
            }

            var length = cellinfo.DOMrow.cells.length;
            if (cellinfo.DOMcell.type === 'checkbox'){
                if (cellinfo.srcElement.checked === true) {
                    for (var i=0; i<length; i++) {
                        var cell = cellinfo.DOMrow.cells[i];
                        if ((cell.column.key !== 'Name') && (cell.column.key !== 'col_2') && (cell.column.key !== 'Values')) {
                            if (cell.type === 'text')
                                { this.$.factorstable.makeTextCellEditable(cellinfo.rowIndex, cell.cellIndex, ''); }
                        }
                    }
                    cellinfo.paraminfo = {};
                    cellinfo.paraminfo.value = {};
                    var pName = paramName;
                    var pNum = 0;
                    if (paramName.indexOf('[') > -1) {
                        pName = paramName.substring(0, paramName.indexOf('['));
                        pNum = paramName.substring(paramName.indexOf('[')+1, paramName.indexOf(']')).split(',');
                    }
                    var selectedParam = SMAProcDesignDriverDataHandler.findParameterByName(pName, this._updateActivityParameters());
                    if (selectedParam.getStructure() === SMAJSCMMUtils.Structure.client.Scalar){
                        cellinfo.paraminfo.value = selectedParam.getValue();
                    } else if (selectedParam.getStructure() === SMAJSCMMUtils.Structure.client.Array) {
                        var arrValues = selectedParam.getValues();
                        var arrDim = selectedParam.getDimensions();
                        var index = 0;
                        var res = 0;
                        var fac = 1;
                        var len =  arrDim.length;
                        for (var i = 0; i < arrDim.length; i++) {
                            index = len - i - 1;
                            if ((parseInt(pNum[index]) < parseInt(arrDim[index])) && (parseInt(pNum[index]) >= 0)) {
                                res = res + parseInt(pNum[index]) * fac;
                                fac = fac * parseInt(arrDim[index]);
                            }
                        }
                        cellinfo.paraminfo.value = arrValues[res];
                    }

                    this.factors = this.doetechnique.populateDefaults(cellinfo, paramName);
                } else {
                    this.factors = this.removeFactors(cellinfo, paramName);
                    if (this.selectedPlugin.GetTitle() === 'Central Composite') {
                        this.doetechnique.factorRemoved(cellinfo);
                    }
                }
            }*/
        },

        /**
         * On selection of a new Response the row is updated with default or recalculated based on the selected technique
         * @param {Object} cellinfo - Information of the selected cell and row
         */
        _updateResponseRow: function(cellinfo) {
            var paramName='';
            if (this.$.responsestable._hasRoot(cellinfo.DOMrow) === true){
                paramName = this.buildParamName(this.$.responsestable._treeRootPath(cellinfo.DOMrow));
            } else {
                paramName = cellinfo.DOMrow.cells[0].textContent.trim();
            }

            var length = cellinfo.DOMrow.cells.length;
            if (cellinfo.DOMcell.type === 'checkbox'){
                if (cellinfo.srcElement.checked === true) {
                    var response = {
                            Name: paramName
                    };
                    this.push('responses', response);
                    for (var i=0; i<length; i++) {
                        var cell = cellinfo.DOMrow.cells[i];
                        if (cell.column.key === 'Objective') {
                            //cell.contentEditable = true;
                            var select = cell.querySelector('select');
                            if (select){
                                select.selectedIndex = -1;
                                select.disabled = false;
                            }
                        }
                    }
                } else {
                    var index = SMAProcDesignDriverFactorImpl.findFactor(paramName, this.responses);
                    //var response = this.responses[index];
                    if ((index >= 0) && (index < this.responses.length)) {
                        this.splice('responses', index, 1);
                    }
                    var cells = cellinfo.DOMrow.cells;
                    var select = cells[this.responseColKeyIndex.Objective].querySelector('select');
                    if (select){
                        select.selectedIndex = -1;
                        select.title = '';
                        select.disabled = true;
                    }
                    if (cells[this.responseColKeyIndex.Target].querySelector('input')) {
                        var input = cells[this.responseColKeyIndex.Target].querySelector('input');
                        input.value = '';
                        input.title = '';
                        input.disabled = true;
                    }
                    if (cells[this.responseColKeyIndex.Weight].querySelector('input')) {
                        var input = cells[this.responseColKeyIndex.Weight].querySelector('input');
                        input.value = '';
                        input.title = '';
                        input.disabled = true;
                    }
                }
            }

            if (cellinfo.DOMcell.type === 'dropdown'){
                var objective = cellinfo.DOMcell.querySelector('select').selectedIndex;
                var index = SMAProcDesignDriverFactorImpl.findFactor(paramName, this.responses);
                this.responses[index]['Objective'] = this.responseObjKey[objective];
                if (objective >= 0 && objective <= 2) {
                    var cells = cellinfo.DOMrow.cells;
                    //Enable Weight cell
                    if (!cells[this.responseColKeyIndex.Weight].querySelector('input'))
                        { this.$.responsestable.makeTextCellEditable(cellinfo.rowIndex, cells[this.responseColKeyIndex.Weight].cellIndex, ''); }
                    //Disable target cell
                    if (cells[this.responseColKeyIndex.Target].querySelector('input')) {
                        var input = cells[this.responseColKeyIndex.Target].querySelector('input');
                        input.value = '';
                        input.title = '';
                        input.disabled = true;
                    }
                    var weight = cells[this.responseColKeyIndex.Weight].querySelector('input');
                    weight.value = '1';
                    weight.title = '1';
                    this.responses[index]['Weight'] = 1;
                }
                if (objective === 2) {
                    var cells = cellinfo.DOMrow.cells;
                    this.$.responsestable.makeTextCellEditable(cellinfo.rowIndex, cells[this.responseColKeyIndex.Target].cellIndex, '');
                    var target = cells[4].querySelector('input');
                    target.value = '0';
                    target.title = '0';
                    this.responses[index]['Target'] = 0;
                }
            }

            if (cellinfo.DOMcell.type === 'text'){
                var index = SMAProcDesignDriverFactorImpl.findFactor(paramName, this.responses);
                if (this.responses[index]['Objective']) {
                    this.responses[index][cellinfo.DOMcell.column.key] = parseFloat(cellinfo.srcElement.value);
                }
            }
        },

        /**
         * Removes the factor/responses from the local data structure if its unselected from the respective tables
         * @param {Object} cellinfo - Information of the selected cell and row
         * @param {String} paramName - Name of the un-selected parameter
         * @returns {Object} updated Factors
         */
        removeFactors: function(cellinfo, paramName) {
            if (cellinfo.grid) {
                for (var attr in cellinfo.grid) {
                    if (attr !== 'selection') {
                        cellinfo.grid[attr] = '';
                    }
                }
            } else {
                var length = cellinfo.DOMrow.cells.length;
                for (var i=0; i<length; i++) {
                    var cell = cellinfo.DOMrow.cells[i];
                    if (cell.column.key === 'Values') {
                        cell.textContent = '';
                        cell.title = '';
                    }
                    else if ((cell.column.key !== 'Name') && (cell.column.key !== 'col_2')) {
                        if (cell.type === 'text') {
                            var input = cell.querySelector('input');
                            input.value = '';
                            input.title = '';
                            input.disabled = true;
                        }
                        else {
                            cell.contentEditable = false;
                            var select = cell.querySelector('select');
                            if (select) {
                                select.selectedIndex = -1;
                                select.title = '';
                                select.disabled = true;
                            }
                        }
                    }
                }
            }

            var index = SMAProcDesignDriverFactorImpl.findFactor(paramName, this.doetechnique.updatedFactors);
            if ((index >= 0) && (index < this.doetechnique.updatedFactors.length)) {
                this.splice('doetechnique.updatedFactors', index, 1);
            }
            return this.doetechnique.updatedFactors;
        },

        /**
         * Creates the name of the array parameter
         * ["Parameter1", "0", "1", "2"] -> Parameter1[0,1,2]
         * @param {Object} rootPath - Array of the path of the parameter
         * @returns {String} parameter name
         */
        buildParamName: function (rootPath) {
            var paramName = rootPath[0]+'[';
            for (var i = 1; i < rootPath.length; i++) {
                paramName += rootPath[i]+ ',';
            }
            paramName = paramName.slice(0, -1);
            paramName += ']';
            return paramName;
        },

        /**
         * Creates the name of the array parameter for WebUX Tree List View
         * [e, e, e, e, e] -> Parameter1[0,1,2]
         * @param {Object} rootPath - Array of the path of the parameter
         * @returns {String} parameter name
         */
        buildParamNameFromPath: function (rootPath) {
            var paramName = rootPath[0]._options.label+'[';
            for (var i = 1; i < rootPath.length; i++) {
                paramName += rootPath[i]._options.label+ ',';
            }
            paramName = paramName.slice(0, -1);
            paramName += ']';
            return paramName;
        },

        /**
         * Updates the execution options on selection of the dropdown
         */
        designPointOptionUpdated: function() {
            this.$.failrunpolicy.selectedIndex = this.executionOptions['failed runs policy'];
            this.hideDesignPointOptions(this.$.failrunpolicy.selectedIndex);
        },

        /**
         * Updates the execution options on selection of the dropdown
         */
        onPolicyChange: function () {
            this.executionOptions['failed runs policy'] = this.$.failrunpolicy.selectedIndex;
            this.hideDesignPointOptions(this.$.failrunpolicy.selectedIndex);
        },

        /**
         * Hides/Shows the other design options depending on the dropdown selection
         * @param {Number} index - Index of the elements to be shown
         */
        hideDesignPointOptions: function (index) {
            var designOptions = this.$.designpointoptions.children;
            for (var i = 0; i < designOptions.length; i++){
                designOptions[i].classList.add('hidden');
            }
            this.$.designpointoptions.children[index].classList.remove('hidden');
        },

        /**
         * Parses the execution options received from the definition xml
         * @param {Object} execOptionsProp - An array of technique options or [SMAJSCMMProperty]{@link module:DS/JSCMM/SMAJSCMMProperty.SMAJSCMMProperty} objects
         */
        parseExecutionOptionsProperty: function (execOptionsProp) {
            if (execOptionsProp) {
                var properties = execOptionsProp.getProperties();
                for (var i = 0; i < properties.length; i++) {
                    var propertyName = properties[i].getName();

                    //Need to specifically check null and undefined since the values may be boolean
                    if (this.executionOptions[propertyName] !== null && this.executionOptions[propertyName] !== undefined) {
                        var value = properties[i].getValue();
                        if (value === 'true') {
                            value = true;
                        } else if (value === 'false' || value === '') {
                            value = false;
                        }
                        this.set('executionOptions.' + propertyName, value);

                        var propertyExpression = properties[i].getExpression();
                        if (propertyName === 'execute subflow once' && propertyExpression) {
                            this.$.subflowexecution.readonly = true;
                            this.executionOptions.Expression = {};
                            this.set('executionOptions.Expression.' + propertyName, propertyExpression);
                        }
                    }
                }
            }
        },

        /**
         * Initialize the Row for the given factor in the Factor table
         * @param {Object} parameter - Input parameter to be inserted in the table
         * @param {String} arrayIcon - URL of the array icon if its an array parameter, null otherwise
         * @param {Object} val - Value of the Name cell
         * @returns {Object} row content with name filled in
         */
        _initializeFactorRowContent: function(parameter, arrayIcon, val) {
            var rowContent = {
                    Name : {
                        value : val ? val : parameter.getName(),
                        icon : arrayIcon,
                        defaultValue : val ? val : parameter.getName(),
                        editable : false
                    },
                    col_2 : {
                        value : 'false'
                    },
                    numberoflevels : {
                        value: '',
                        editable: false
                    },
                    Lower: {
                        value: '',
                        editable: false
                    },
                    Upper : {
                        value: '',
                        editable: false
                    },
                    Levels : {
                        value: '',
                        editable: false
                    },
                    Baseline : {
                        value: '',
                        editable: false
                    },
                    Relation : {
                        value: '',
                        editable: false
                    },
                    Alpha : {
                        value: '',
                        editable: false
                    },
                    Values: {
                        value: '',
                        editable: false
                    }
                };
            return rowContent;
        },

        /**
         * Initialize the Row for the given response in the Response table
         * @param {Object} parameter - Output parameter to be inserted in the table
         * @param {String} arrayIcon - URL of the array icon if its an array parameter, null otherwise
         * @param {Object} val - Value of the Name cell
         * @returns {Object} row content with name filled in
         */
        _initializeResponseRowContent: function(parameter, arrayIcon, val) {
            var rowContent = {
                    Name : {
                        value : val ? val : parameter.getName(),
                        icon : arrayIcon,
                        defaultValue : val ? val : parameter.getName(),
                        editable : false
                    },
                    col_2 : {
                        value : 'false'
                    },
                    Objective : {
                        value: '',
                        editable: false
                    },
                    Weight : {
                        value: '',
                        editable: false
                    },
                    Target: {
                        value: '',
                        editable: false
                    }
                };
            return rowContent;
        }
    });
});
