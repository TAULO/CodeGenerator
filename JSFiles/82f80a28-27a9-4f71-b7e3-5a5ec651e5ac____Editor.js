/**
 * Copyright (c) 2006
 * Martin Czuchra, Nicolas Peters, Daniel Polak, Willi Tscheschner
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 **/

/**
 * @ignore(Hash)
 * @lint ignoreDeprecated(alert,eval) 
 */
qx.Class.define("ms123.oryx.Editor", {
	extend: qx.ui.container.Scroll,
	include: [ms123.util.MBindTo],

	/******************************************************************************
	 CONSTRUCTOR
	 ******************************************************************************/
	construct: function (context) {
		this.base(arguments);
		this.DOMEventListeners = new Hash();
		this.context = context;
		this.__init();
	},

	/******************************************************************************
	 STATICS
	 ******************************************************************************/
	statics: {
		graft: function (namespace, parent, t, doc) {

			doc = (doc || (parent && parent.ownerDocument) || document);
			var e;
			if (t === undefined) {
				throw "Can't graft an undefined value";
			} else if (t.constructor == String) {
				e = doc.createTextNode(t);
			} else {
				for (var i = 0; i < t.length; i++) {
					if (i === 0 && t[i].constructor == String) {
						var snared;
						snared = t[i].match(/^([a-z][a-z0-9]*)\.([^\s\.]+)$/i);
						if (snared) {
							e = doc.createElementNS(namespace, snared[1]);
							e.setAttributeNS(null, 'class', snared[2]);
							continue;
						}
						snared = t[i].match(/^([a-z][a-z0-9]*)$/i);
						if (snared) {
							e = doc.createElementNS(namespace, snared[1]); // but no class
							continue;
						}

						e = doc.createElementNS(namespace, "span");
						e.setAttribute(null, "class", "namelessFromLOL");
					}

					if (t[i] === undefined) {
						throw "Can't graft an undefined value in a list!";
					} else if (t[i].constructor == String || t[i].constructor == Array) {
						this.graft(namespace, e, t[i], doc);
					} else if (t[i].constructor == Number) {
						this.graft(namespace, e, t[i].toString(), doc);
					} else if (t[i].constructor == Object) {
						// hash's properties => element's attributes
						for (var k in t[i]) {
							e.setAttributeNS(null, k, t[i][k]);
						}
					} else {

					}
				}
			}
			if (parent) {
				parent.appendChild(e);
			} else {

			}
			return e; // return the topmost created node
		},

		SVGClassElementsAreAvailable: true,
		checkClassType: function (classInst, classType) {

			if (ms123.oryx.Editor.SVGClassElementsAreAvailable) {
				return classInst instanceof classType
			} else {
				return classInst == classType
			}
		},

		provideId: function () {
			var res = [],
				hex = '0123456789ABCDEF';

			for (var i = 0; i < 36; i++) res[i] = Math.floor(Math.random() * 0x10);

			res[14] = 4;
			res[19] = (res[19] & 0x3) | 0x8;

			for (var i = 0; i < 36; i++) res[i] = hex[res[i]];

			res[8] = res[13] = res[18] = res[23] = '-';

			return "oryx_" + res.join('');
		}

	},

	/******************************************************************************
	 PROPERTIES
	 ******************************************************************************/
	properties: {
    // overridden
    focusable :
    {
      refine : true,
      init : true
    }
	},

	/******************************************************************************
	 MEMBERS
	 ******************************************************************************/
	members: {
		DOMEventListeners: null,
		selection: [],
		zoomLevel: 1.0,

		__init: function (config) {

			this._eventsQueue = [];
			this.loadedPlugins = [];
			this.pluginsData = [];


			if (this.context.resourceId) {
				this.id = this.context.resourceId;
			} else {
				this.id = ms123.oryx.Editor.provideId();
			}

			this._initEventListener();

			ms123.oryx.core.StencilSet.clearStencilSet(this.context.editorType.substring(3)); //@@@MS load Stencils every time
			var stencilset = ms123.oryx.core.StencilSet.loadStencilSet(this.context.editorType.substring(3), this.id);


			this._createCanvas(null);

			this._generateGUI();

			var loadPluginFinished = false;
			var loadContentFinished = false;
			var initFinished = this.bindTo(function () {
				if (!loadPluginFinished || !loadContentFinished) {
					return
				}
				this._finishedLoading();
			}, this)


			window.setTimeout(this.bindTo(function () {
				this.loadPlugins();
				loadPluginFinished = true;
				initFinished();
			}, this), 100);

		},

		_finishedLoading: function () {
			this.layout.doLayout();
			if (ms123.oryx.Config.PANEL_RIGHT_COLLAPSED === true) {
				this.layout_regions.east.collapse();
			}
			if (ms123.oryx.Config.PANEL_LEFT_COLLAPSED === true) {
				this.layout_regions.west.collapse();
			}

			this.handleEvents({
				type: ms123.oryx.Config.EVENT_LOADED
			})

		},
		_removeEventListener: function () {
			// DeRegister Events
			document.documentElement.removeEventListener(ms123.oryx.Config.EVENT_KEYDOWN, this._bindKeyDownEventListener, false);
			document.documentElement.removeEventListener(ms123.oryx.Config.EVENT_KEYUP, this._bindKeyUpEventListener, false);
		},

		_initEventListener: function () {
			// Register on Events
			this._bindKeyDownEventListener = this.catchKeyDownEvents.bind(this);
			this._bindKeyUpEventListener = this.catchKeyUpEvents.bind(this);
			document.documentElement.addEventListener(ms123.oryx.Config.EVENT_KEYDOWN, this._bindKeyDownEventListener, false);
			document.documentElement.addEventListener(ms123.oryx.Config.EVENT_KEYUP, this._bindKeyUpEventListener, false);

			// Enable Key up and down Event
			this._keydownEnabled = true;
			this._keyupEnabled = true;

			this.DOMEventListeners[ms123.oryx.Config.EVENT_MOUSEDOWN] = [];
			this.DOMEventListeners[ms123.oryx.Config.EVENT_MOUSEUP] = [];
			this.DOMEventListeners[ms123.oryx.Config.EVENT_MOUSEOVER] = [];
			this.DOMEventListeners[ms123.oryx.Config.EVENT_MOUSEOUT] = [];
			this.DOMEventListeners[ms123.oryx.Config.EVENT_SELECTION_CHANGED] = [];
			this.DOMEventListeners[ms123.oryx.Config.EVENT_MOUSEMOVE] = [];

		},

		_generateGUI: function () {

			var grow = new qx.ui.layout.Grow();
			var canvasParent = this.getCanvas().rootNode.parentNode;

			var html = new qx.ui.core.Widget().set({
				minWidth: ms123.oryx.Config.CANVAS_WIDTH,
				minHeight: ms123.oryx.Config.CANVAS_HEIGHT,
				opacity: 0.95,
				backgroundColor: "white"
			});
			var cel = new qx.html.Element("div");
			cel.useElement(canvasParent);
			html.getContentElement().add(cel);
			this.add(html);

			this._htmlWidget = html;
			html.getContentElement().__flush();

			canvasParent.parentNode.setAttributeNS(null, 'align', 'center');
			canvasParent.setAttributeNS(null, 'align', 'left');
			this.getCanvas().setSize({
				width: ms123.oryx.Config.CANVAS_WIDTH,
				height: ms123.oryx.Config.CANVAS_HEIGHT
			});

		},

		/**
		 * adds a component to the specified region
		 */
		addToRegion: function (region, component, title) {

			if (region.toLowerCase && this.layout_regions[region.toLowerCase()]) {
				var current_region = this.layout_regions[region.toLowerCase()];

				current_region.add(component);

				// update dimensions of region if required.
				if (!current_region.width && component.initialConfig && component.initialConfig.width) {
					//console.debug("resizing width of region %0: %1", current_region.region, component.initialConfig.width)
					current_region.setWidth(component.initialConfig.width)
				}
				if (component.initialConfig && component.initialConfig.height) {
					//console.debug("resizing height of region %0: %1", current_region.region, component.initialConfig.height)
					var current_height = current_region.height || 0;
					current_region.height = component.initialConfig.height + current_height;
					current_region.setHeight(component.initialConfig.height + current_height)
				}

				if (typeof title == "string") {
					current_region.setTitle(title);
				}

				current_region.ownerCt.doLayout();
				current_region.show();

				return current_region;
			}

			return null;
		},
		getAvailablePlugins: function () {},

		activatePluginByName: function (name, callback, loadTry) {},

		loadPlugins: function () {},

		/**
		 * Creates the Canvas
		 */
		_createCanvas: function (stencilType) {
			stencilType = this.getStencilSets().values()[0].findRootStencilName();

			var canvasStencil = ms123.oryx.core.StencilSet.stencil(stencilType);

			if (!canvasStencil) console.fatal("Initialisation failed, because the stencil with the type %0 is not part of one of the loaded stencil sets.", stencilType);

			var div = ms123.oryx.Editor.graft("http://www.w3.org/1999/xhtml", null, ['div']);
			div.addClassName("ms123.oryx.Editor");

			this._canvas = new ms123.oryx.core.Canvas({
				width: ms123.oryx.Config.CANVAS_WIDTH,
				height: ms123.oryx.Config.CANVAS_HEIGHT,
				'eventHandlerCallback': this.bindTo(this.handleEvents, this),
				id: this.id,
				parentNode: div
			}, canvasStencil);

		},

		/**
		 * Returns a per-editor singleton plugin facade.
		 */
		_getPluginFacade: function () {

			if (!(this._pluginFacade))

			this._pluginFacade = {
				activatePluginByName: this.activatePluginByName.bind(this),
				//deactivatePluginByName:		this.deactivatePluginByName.bind(this),
				getAvailablePlugins: this.getAvailablePlugins.bind(this),
				offer: this.offer.bind(this),
				getStencilSets: this.getStencilSets.bind(this),
				getStencilSetExtensionDefinition: this.bindTo(function () {
					return Object.clone(this.ss_extensions_def || {})
				}, this),
				getRules: this.getRules.bind(this),
				loadStencilSet: this.loadStencilSet.bind(this),
				createShape: this.createShape.bind(this),
				deleteShape: this.deleteShape.bind(this),
				getSelection: this.getSelection.bind(this),
				setSelection: this.setSelection.bind(this),
				updateSelection: this.updateSelection.bind(this),
				getCanvas: this.getCanvas.bind(this),
				getWidget: this.getWidget.bind(this),
				getScroll: this.getScroll.bind(this),

				registerPluginsOnKeyEvents: this.registerPluginsOnKeyEvents.bind(this),
				importJSON: this.importJSON.bind(this),
				getJSON: this.getJSON.bind(this),
				getSerializedJSON: this.getSerializedJSON.bind(this),

				executeCommands: this.executeCommands.bind(this),
				isExecutingCommands: this.isExecutingCommands.bind(this),

				registerOnEvent: this.registerOnEvent.bind(this),
				unregisterOnEvent: this.unregisterOnEvent.bind(this),
				raiseEvent: this.handleEvents.bind(this),
				enableEvent: this.enableEvent.bind(this),
				disableEvent: this.disableEvent.bind(this),

				eventCoordinates: this.eventCoordinates.bind(this),
				addToRegion: this.addToRegion.bind(this)

				//getModelMetaData: this.getModelMetaData.bind(this)
			};

			// return it.
			return this._pluginFacade;
		},

		isExecutingCommands: function () {
			return !!this.commandExecuting;
		},

		/**
		 * Implementes the command pattern
		 * (The real usage of the command pattern
		 * is implemented and shown in the Plugins/undo.js)
		 */
		executeCommands: function (commands) {

			if (!this.commandStack) {
				this.commandStack = [];
			}
			if (!this.commandStackExecuted) {
				this.commandStackExecuted = [];
			}


			this.commandStack = [].concat(this.commandStack).concat(commands);

			if (this.commandExecuting) {
				return;
			}

			this.commandExecuting = true;

			while (this.commandStack.length > 0) {
				var command = this.commandStack.shift();
				command.execute();
				this.commandStackExecuted.push(command);
			}

			this.handleEvents({
				type: ms123.oryx.Config.EVENT_EXECUTE_COMMANDS,
				commands: this.commandStackExecuted
			});

			// Remove temporary vars
			delete this.commandStack;
			delete this.commandStackExecuted;
			delete this.commandExecuting;

			this.updateSelection();
		},

		/**
		 * Returns JSON of underlying canvas.
		 */
		getJSON: function () {
			var canvas = this.getCanvas().toJSON();
			canvas.ssextensions = this.getStencilSets().values()[0].extensions().keys().findAll(function (sse) {
				return !sse.endsWith('/meta#')
			});
			return canvas;
		},

		/**
		 * Serializes a call to toJSON().
		 */
		getSerializedJSON: function () {
			return qx.lang.Json.stringify(this.getJSON());
		},

		/**
		 * Imports shapes in JSON as expected
		 */
		importJSON: function (jsonObject, noSelectionAfterImport, forceRenew) {
			if (!jsonObject || jsonObject == "") return;
			try {
				jsonObject = this.renewResourceIds(jsonObject, forceRenew);
			} catch (error) {
				throw error;
			}
			if (jsonObject.stencilset.namespace && jsonObject.stencilset.namespace !== this.getCanvas().getStencil().stencilSet().namespace()) {
				ms123.form.Alert(ms123.oryx.Translation.JSONImport.title, String.format(ms123.oryx.Translation.JSONImport.wrongSS, jsonObject.stencilset.namespace, this.getCanvas().getStencil().stencilSet().namespace()));
				return null;
			} else {
				var command = new ms123.oryx.core.CommandClass(jsonObject, this.loadSerialized.bind(this), noSelectionAfterImport, this._getPluginFacade());
				this.executeCommands([command]);

				return command.shapes.clone();
			}
		},

		renewResourceIds: function (jsonObject, forceRenew) {
			if (typeof jsonObject == "string") {
				try {
					var serJsonObject = jsonObject;
					jsonObject = eval("(" + jsonObject + ')');
				} catch (error) {
					throw new SyntaxError(error.message);
				}
			} else {
				var serJsonObject = qx.util.Serializer.toJson(jsonObject);
			}
			if (!this.context.resourceId || forceRenew === true) {
				// collect all resourceIds recursively
				var collectResourceIds = function (shapes) {
					if (!shapes) return [];

					return shapes.map(function (shape) {
						return collectResourceIds(shape.childShapes).concat(shape.resourceId);
					}).flatten();
				}
				var resourceIds = collectResourceIds(jsonObject.childShapes);

				// Replace each resource id by a new one
				resourceIds.each(function (oldResourceId) {
					var newResourceId = ms123.oryx.Editor.provideId();
					serJsonObject = serJsonObject.gsub('"' + oldResourceId + '"', '"' + newResourceId + '"')
				});
			}

			return eval("(" + serJsonObject + ')');
			//			return qx.lang.Json.parse(serJsonObject);
		},

		/**
		 * Loads serialized model to the oryx.
		 * @example
		 * editor.loadSerialized({
		 *    resourceId: "mymodel1",
		 *    childShapes: [
		 *       {
		 *          stencil:{ id:"Subprocess" },
		 *          outgoing:[{resourceId: 'aShape'}],
		 *          target: {resourceId: 'aShape'},
		 *          bounds:{ lowerRight:{ y:510, x:633 }, upperLeft:{ y:146, x:210 } },
		 *          resourceId: "myshape1",
		 *          childShapes:[],
		 *          properties:{},
		 *       }
		 *    ],
		 *    properties:{
		 *       language: "English"
		 *    },
		 *    stencilset:{
		 *       url:"http://localhost:8080/oryx/stencilsets/bpmn1.1/bpmn1.1.json"
		 *    },
		 *    stencil:{
		 *       id:"BPMNDiagram"
		 *    }
		 * });
		 * param {Object} model Description of the model to load.
		 * param {Array} [model.ssextensions] List of stenctil set extensions.
		 * param {String} model.stencilset.url
		 * param {String} model.stencil.id 
		 * param {Array} model.childShapes
		 * param {Array} [model.properties]
		 * param {String} model.resourceId
		 * @return {oryx.core.Shape[]} List of created shapes
		 */
		loadSerialized: function (model, requestMeta) {
			var canvas = this.getCanvas();

			this.loadSSExtensions(model.ssextensions);

			if (requestMeta === true) {
				var metaDataExtension = this.getExtensionForMetaData();
				if (metaDataExtension) {
					this.loadSSExtension(metaDataExtension);
				}
			}

			var shapes = this.getCanvas().addShapeObjects(model.childShapes, this.handleEvents.bind(this));

			if (model.properties) {
				for (var key in model.properties) {
					var value = model.properties[key];
					var prop = this.getCanvas().getStencil().property("oryx-" + key);
					if (!(typeof value === "string") && !(typeof value === "boolean") && !(typeof value === "number") && (!prop || !prop.isList())) {
						if (value != null) {
							value = qx.util.Serializer.toJson(value);
						}
					}
					this.getCanvas().setProperty("oryx-" + key, value);
				}
			}


			this.getCanvas().updateSize();

			this.selection = [null];
			this.setSelection([]);

			return shapes;
		},

		/**
		 * Return the namespace of the extension which
		 * provided all the self defined meta data
		 *
		 */
		getExtensionForMetaData: function () {
			if (!this.ss_extensions_def || !(this.ss_extensions_def.extensions instanceof Array)) {
				return null;
			}

			var stencilsets = this.getStencilSets();
			var extension = this.ss_extensions_def.extensions.find(function (ex) {
				return !!stencilsets[ex["extends"]] && ex.namespace.endsWith("/meta#");
			});

			return extension ? extension.namespace || null : null;
		},

		/**
		 * Calls ms123.oryx.Editor.prototype.ss_extension_namespace for each element
		 * param {Array} ss_extension_namespaces An array of stencil set extension namespaces.
		 */
		loadSSExtensions: function (ss_extension_namespaces) {
			if (!ss_extension_namespaces) return;

			ss_extension_namespaces.each(this.bindTo(function (ss_extension_namespace) {
				this.loadSSExtension(ss_extension_namespace);
			}, this));
		},

		/**
		 * Loads a stencil set extension.
		 * The stencil set extensions definiton file must already
		 * be loaded when the editor is initialized.
		 */
		loadSSExtension: function (ss_extension_namespace) {

			if (this.ss_extensions_def) {
				var extension = this.ss_extensions_def.extensions.find(function (ex) {
					return (ex.namespace == ss_extension_namespace);
				});

				if (!extension) {
					return;
				}

				var stencilset = this.getStencilSets()[extension["extends"]];

				if (!stencilset) {
					return;
				}

				// Check if absolute or relative url
				if ((extension["definition"] || "").startsWith("/")) {
					stencilset.addExtension(extension["definition"])
				} else {
					stencilset.addExtension(ms123.oryx.Config.SS_EXTENSIONS_FOLDER + extension["definition"])
				}

				//stencilset.addExtension("/oryx/build/stencilsets/extensions/" + extension["definition"])
				this.getRules().initializeRules(stencilset);

				this._getPluginFacade().raiseEvent({
					type: ms123.oryx.Config.EVENT_STENCIL_SET_LOADED
				});
			}

		},

		disableEvent: function (eventType) {
			if (eventType == ms123.oryx.Config.EVENT_KEYDOWN) {
				this._keydownEnabled = false;
			}
			if (eventType == ms123.oryx.Config.EVENT_KEYUP) {
				this._keyupEnabled = false;
			}
			if (this.DOMEventListeners.keys().member(eventType)) {
				var value = this.DOMEventListeners.remove(eventType);
				this.DOMEventListeners['disable_' + eventType] = value;
			}
		},

		enableEvent: function (eventType) {
			if (eventType == ms123.oryx.Config.EVENT_KEYDOWN) {
				this._keydownEnabled = true;
			}

			if (eventType == ms123.oryx.Config.EVENT_KEYUP) {
				this._keyupEnabled = true;
			}

			if (this.DOMEventListeners.keys().member("disable_" + eventType)) {
				var value = this.DOMEventListeners.remove("disable_" + eventType);
				this.DOMEventListeners[eventType] = value;
			}
		},

		/**
		 *  Methods for the PluginFacade
		 */
		registerOnEvent: function (eventType, callback) {
			if (!(this.DOMEventListeners.keys().member(eventType))) {
				this.DOMEventListeners[eventType] = [];
			}

			this.DOMEventListeners[eventType].push(callback);
		},

		unregisterOnEvent: function (eventType, callback) {
			if (this.DOMEventListeners.keys().member(eventType)) {
				this.DOMEventListeners[eventType] = this.DOMEventListeners[eventType].without(callback);
			} else {
				// Event is not supported
			}
		},

		getSelection: function () {
			return this.selection || [];
		},

		getStencilSets: function () {
			return ms123.oryx.core.StencilSet.stencilSets(this.id);
		},

		getRules: function () {
			return ms123.oryx.core.StencilSet.rules(this.id);
		},

		loadStencilSet: function (source) {
			try {
				ms123.oryx.core.StencilSet.loadStencilSet(source, this.id);
				this.handleEvents({
					type: ms123.oryx.Config.EVENT_STENCIL_SET_LOADED
				});
			} catch (e) {
				console.warn("Requesting stencil set file failed. (" + e + ")");
			}
		},

		offer: function (pluginData) {
			if (!this.pluginsData.member(pluginData)) {
				this.pluginsData.push(pluginData);
			}
		},
		getPluginsData: function () {
			return this.pluginsData;
		},

		/**
		 * It creates an new event or adds the callback, if already existing,
		 * for the key combination that the plugin passes in keyCodes attribute
		 * of the offer method.
		 * 
		 * The new key down event fits the schema:
		 * 		key.event[.metactrl][.alt][.shift].'thekeyCode'
		 */
		registerPluginsOnKeyEvents: function () {
			this.pluginsData.each(this.bindTo(function (pluginData) {

				if (pluginData.keyCodes) {

					pluginData.keyCodes.each(this.bindTo(function (keyComb) {
						var eventName = "key.event";

						/* Include key action */
						eventName += '.' + keyComb.keyAction;

						if (keyComb.metaKeys) { /* Register on ctrl or apple meta key as meta key */
							if (keyComb.metaKeys.
							indexOf(ms123.oryx.Config.META_KEY_META_CTRL) > -1) {
								eventName += "." + ms123.oryx.Config.META_KEY_META_CTRL;
							}

							/* Register on alt key as meta key */
							if (keyComb.metaKeys.
							indexOf(ms123.oryx.Config.META_KEY_ALT) > -1) {
								eventName += '.' + ms123.oryx.Config.META_KEY_ALT;
							}

							/* Register on shift key as meta key */
							if (keyComb.metaKeys.
							indexOf(ms123.oryx.Config.META_KEY_SHIFT) > -1) {
								eventName += '.' + ms123.oryx.Config.META_KEY_SHIFT;
							}
						}

						/* Register on the actual key */
						if (keyComb.keyCode) {
							eventName += '.' + keyComb.keyCode;
						}

						/* Register the event */
						//console.warn("Register Plugin on Key Event: " + eventName);
						if (pluginData.toggle === true && pluginData.buttonInstance) {
							this.registerOnEvent(eventName, function () {
								pluginData.buttonInstance.toggle(!pluginData.buttonInstance.pressed); // Toggle 
								pluginData.functionality.call(pluginData, pluginData.buttonInstance, pluginData.buttonInstance.pressed); // Call function
							});
						} else {
							this.registerOnEvent(eventName, pluginData.functionality)
						}

					}, this));
				}
			}, this));
		},

		isEqual: function (a, b) {
			return a === b || (a.length === b.length && a.all(function (r) {
				return b.include(r)
			}))
		},

		isDirty: function (a) {
			return a.any(function (shape) {
				return shape.isPropertyChanged()
			})
		},

		setSelection: function (elements, subSelectionElement, force) {

			if (!elements) {
				elements = [];
			}
			if (!(elements instanceof Array)) {
				elements = [elements];
			}

			elements = elements.findAll(function (n) {
				return n && n instanceof ms123.oryx.core.Shape
			});

			if (elements[0] instanceof ms123.oryx.core.Canvas) {
				elements = [];
			}

			if (!force && this.isEqual(this.selection, elements) && !this.isDirty(elements)) {
				return;
			}

			this.selection = elements;
			this._subSelection = subSelectionElement;

			//console.error("setSelection:" + elements + "/" + force);
			this.handleEvents({
				type: ms123.oryx.Config.EVENT_SELECTION_CHANGED,
				elements: elements,
				subSelection: subSelectionElement,
				force: !! force
			})
		},

		updateSelection: function () {
			this.setSelection(this.selection, this._subSelection, true);
		},

		getCanvas: function () {
			return this._canvas;
		},
		getWidget: function () {
			return this._htmlWidget;
		},

		getScroll: function () {
			return this;
		},

		/**
		 *	option = {
		 *		type: string,
		 *		position: {x:int, y:int},
		 *		connectingType:	uiObj-Class
		 *		connectedShape: uiObj
		 *		draggin: bool
		 *		namespace: url
		 *       parent: ORYX.Core.AbstractShape
		 *		template: a template shape that the newly created inherits properties from.
		 *		}
		 */
		createShape: function (option) {

			if (option && option.serialize && option.serialize instanceof Array) {

				var type = option.serialize.find(function (obj) {
					return (obj.prefix + "-" + obj.name) == "oryx-type"
				});
				var stencil = ms123.oryx.core.StencilSet.stencil(type.value);

				if (stencil.type() == 'node') {
					var newShapeObject = new ms123.oryx.core.Node({
						'eventHandlerCallback': this.handleEvents.bind(this)
					}, stencil);
				} else {
					var newShapeObject = new ms123.oryx.core.Edge({
						'eventHandlerCallback': this.handleEvents.bind(this)
					}, stencil);
				}

				this.getCanvas().add(newShapeObject);
				newShapeObject.deserialize(option.serialize);

				return newShapeObject;
			}

			// If there is no argument, throw an exception
			if (!option || !option.type || !option.namespace) {
				throw "To create a new shape you have to give an argument with type and namespace";
			}

			var canvas = this.getCanvas();
			var newShapeObject;

			var shapetype = option.type;

			var sset = ms123.oryx.core.StencilSet.stencilSet(option.namespace);

			if (sset.stencil(shapetype).type() == "node") {
				newShapeObject = new ms123.oryx.core.Node({
					'eventHandlerCallback': this.handleEvents.bind(this)
				}, sset.stencil(shapetype))
			} else {
				newShapeObject = new ms123.oryx.core.Edge({
					'eventHandlerCallback': this.handleEvents.bind(this)
				}, sset.stencil(shapetype))
			}

			// when there is a template, inherit the properties.
			if (option.template) {

				newShapeObject._jsonStencil.properties = option.template._jsonStencil.properties;
				newShapeObject.postProcessProperties();
			}

			// Add to the canvas
			if (option.parent && newShapeObject instanceof ms123.oryx.core.Node) {
				option.parent.add(newShapeObject);
			} else {
				canvas.add(newShapeObject);
			}


			// Set the position
			var point = option.position ? option.position : {
				x: 100,
				y: 200
			};


			var con;
			if (option.connectingType && option.connectedShape && !(newShapeObject instanceof ms123.oryx.core.Edge)) {

				con = new ms123.oryx.core.Edge({
					'eventHandlerCallback': this.handleEvents.bind(this)
				}, sset.stencil(option.connectingType));

				// And both endings dockers will be referenced to the both shapes
				con.dockers.first().setDockedShape(option.connectedShape);

				var magnet = option.connectedShape.getDefaultMagnet()
				var cPoint = magnet ? magnet.bounds.center() : option.connectedShape.bounds.midPoint();
				con.dockers.first().setReferencePoint(cPoint);
				con.dockers.last().setDockedShape(newShapeObject);
				con.dockers.last().setReferencePoint(newShapeObject.getDefaultMagnet().bounds.center());

				canvas.add(con);
			}

			// Move the new Shape to the position
			if (newShapeObject instanceof ms123.oryx.core.Edge && option.connectedShape) {

				newShapeObject.dockers.first().setDockedShape(option.connectedShape);

				if (option.connectedShape instanceof ms123.oryx.core.Node) {
					newShapeObject.dockers.first().setReferencePoint(option.connectedShape.getDefaultMagnet().bounds.center());
					newShapeObject.dockers.last().bounds.centerMoveTo(point);
				} else {
					newShapeObject.dockers.first().setReferencePoint(option.connectedShape.bounds.midPoint());
				}

			} else {

				var b = newShapeObject.bounds
				if (newShapeObject instanceof ms123.oryx.core.Node && newShapeObject.dockers.length == 1) {
					b = newShapeObject.dockers.first().bounds
				}

				b.centerMoveTo(point);

				var upL = b.upperLeft();
				b.moveBy(-Math.min(upL.x, 0), -Math.min(upL.y, 0))

				var lwR = b.lowerRight();
				b.moveBy(-Math.max(lwR.x - canvas.bounds.width(), 0), -Math.max(lwR.y - canvas.bounds.height(), 0))

			}

			// Update the shape
			if (newShapeObject instanceof ms123.oryx.core.Edge) {
				newShapeObject._update(false);
			}

			// And refresh the selection
			if (!(newShapeObject instanceof ms123.oryx.core.Edge) && !(option.dontUpdateSelection)) {
				this.setSelection([newShapeObject]);
			}

			if (con && con.alignDockers) {
				con.alignDockers();
			}
			if (newShapeObject.alignDockers) {
				newShapeObject.alignDockers();
			}

			return newShapeObject;
		},

		deleteShape: function (shape) {

			if (!shape || !shape.parent) {
				return
			}

			//remove shape from parent
			// this also removes it from DOM
			shape.parent.remove(shape);

			//delete references to outgoing edges
			shape.getOutgoingShapes().each(function (os) {
				var docker = os.getDockers().first();
				if (docker && docker.getDockedShape() == shape) {
					docker.setDockedShape(undefined);
				}
			});

			//delete references to incoming edges
			shape.getIncomingShapes().each(function (is) {
				var docker = is.getDockers().last();
				if (docker && docker.getDockedShape() == shape) {
					docker.setDockedShape(undefined);
				}
			});

			//delete references of the shape's dockers
			shape.getDockers().each(function (docker) {
				docker.setDockedShape(undefined);
			});
		},

		_executeEventImmediately: function (eventObj) {
			if (this.DOMEventListeners.keys().member(eventObj.event.type)) {
				this.DOMEventListeners[eventObj.event.type].each(this.bindTo(function (value) {
					value(eventObj.event, eventObj.arg);
				}, this));
			}
		},

		_executeEvents: function () {
			this._queueRunning = true;
			try {
				while (this._eventsQueue.length > 0) {
					var val = this._eventsQueue.shift();
					this._executeEventImmediately(val);
				}
			} catch (e) {
				console.error("_executeEvents:" + e);
				console.log(e.stack);
			} finally {
				this._queueRunning = false;
			}
		},

		/**
		 * Leitet die Events an die Editor-Spezifischen Event-Methoden weiter
		 */
		handleEvents: function (event, uiObj) {

			switch (event.type) {
			case ms123.oryx.Config.EVENT_MOUSEDOWN:
				this._handleMouseDown(event, uiObj);
				break;
			case ms123.oryx.Config.EVENT_MOUSEMOVE:
				this._handleMouseMove(event, uiObj);
				break;
			case ms123.oryx.Config.EVENT_MOUSEUP:
				this._handleMouseUp(event, uiObj);
				break;
			case ms123.oryx.Config.EVENT_MOUSEOVER:
				this._handleMouseHover(event, uiObj);
				break;
			case ms123.oryx.Config.EVENT_MOUSEOUT:
				this._handleMouseOut(event, uiObj);
				break;
			}
			if (event.forceExecution) {
				this._executeEventImmediately({
					event: event,
					arg: uiObj
				});
			} else {
				this._eventsQueue.push({
					event: event,
					arg: uiObj
				});
			}

			if (!this._queueRunning) {
				this._executeEvents();
			}

			return false;
		},

		_isSeeable: function () {
			var element = this.getContentElement().getDomElement();
			if (element) {
				return element.offsetWidth > 0;
			}
			return false;
		},

		_isFocused:function(){
			var fh = qx.ui.core.FocusHandler.getInstance()
			var isFocused = fh.isFocused(this);
			console.log("catchKeyDownEvents:"+isFocused+"/"+fh.getFocusedWidget());
			return isFocused;
		},

		catchKeyUpEvents: function (event) {
			if (!this._isFocused()) return;
			if (!this._isSeeable()) return;
			if (!this._keyupEnabled) {
				return;
			}
			if (!event) event = window.event;

			var keyUpEvent = this.createKeyCombEvent(event, ms123.oryx.Config.KEY_ACTION_UP);

			this.handleEvents({
				type: keyUpEvent,
				event: event
			});
		},

		catchKeyDownEvents: function (event) {
	
			if (!this._isFocused()) return;
			if (!this._isSeeable()) return;
			if (!this._keydownEnabled) {
				return;
			}
			if (!event) event = window.event;

			var keyDownEvent = this.createKeyCombEvent(event, ms123.oryx.Config.KEY_ACTION_DOWN);
			this.handleEvents({
				type: keyDownEvent,
				event: event
			});
		},

		createKeyCombEvent: function (keyEvent, keyAction) {
			var pressedKey = keyEvent.which || keyEvent.keyCode;
			var eventName = "key.event";

			if (keyAction) {
				eventName += "." + keyAction;
			}

			if (keyEvent.ctrlKey || keyEvent.metaKey) {
				eventName += "." + ms123.oryx.Config.META_KEY_META_CTRL;
			}

			if (keyEvent.altKey) {
				eventName += "." + ms123.oryx.Config.META_KEY_ALT;
			}

			if (keyEvent.shiftKey) {
				eventName += "." + ms123.oryx.Config.META_KEY_SHIFT;
			}

			return eventName + "." + pressedKey;
		},

		_handleMouseDown: function (event, uiObj) {
			var canvas = this.getCanvas();
			canvas.focus()

			// find the shape that is responsible for this element's id.
			var element = event.currentTarget;
			var elementController = uiObj;

			// gather information on selection.
			var currentIsSelectable = (elementController !== null) && (elementController !== undefined) && (elementController.isSelectable);
			var currentIsMovable = (elementController !== null) && (elementController !== undefined) && (elementController.isMovable);
			var modifierKeyPressed = event.shiftKey || event.ctrlKey;
			var noObjectsSelected = this.selection.length === 0;
			var currentIsSelected = this.selection.member(elementController);


			// Rule #1: When there is nothing selected, select the clicked object.
			if (currentIsSelectable && noObjectsSelected) {

				this.setSelection([elementController]);

				//console.log("Rule #1 applied for mouse down on " + element.id);
				// Rule #3: When at least one element is selected, and there is no
				// control key pressed, and the clicked object is not selected, select
				// the clicked object.
			} else if (currentIsSelectable && !noObjectsSelected && !modifierKeyPressed && !currentIsSelected) {

				this.setSelection([elementController]);

				//var objectType = elementController.readAttributes();
				//alert(objectType[0] + ": " + objectType[1]);
				//console.log("Rule #3 applied for mouse down on " + element.id);
				// Rule #4: When the control key is pressed, and the current object is
				// not selected, add it to the selection.
			} else if (currentIsSelectable && modifierKeyPressed && !currentIsSelected) {

				var newSelection = this.selection.clone();
				newSelection.push(elementController)
				this.setSelection(newSelection)

				//console.log("Rule #4 applied for mouse down on " + element.id);
				// Rule #6
			} else if (currentIsSelectable && currentIsSelected && modifierKeyPressed) {

				var newSelection = this.selection.clone();
				this.setSelection(newSelection.without(elementController))

				//console.log("Rule #6 applied for mouse down on " + elementController.id);
				// Rule #5: When there is at least one object selected and no control key pressed, we're dragging.
				// Rule #2: When clicked on something that is neither
				// selectable nor movable, clear the selection, and return.
			} else if (!currentIsSelectable && !currentIsMovable) {

				this.setSelection([]);

				//console.log("Rule #2 applied for mouse down on " + element.id);
				return;

				// Rule #7: When the current object is not selectable but movable,
				// it is probably a control. Leave the selection unchanged but set
				// the movedObject to the current one and enable Drag. Dockers will
				// be processed in the dragDocker plugin.
			} else if (!currentIsSelectable && currentIsMovable && !(elementController instanceof ms123.oryx.core.controls.Docker)) {
				// Rule #8: When the element is selectable and is currently selected and no 
				// modifier key is pressed
			} else if (currentIsSelectable && currentIsSelected && !modifierKeyPressed) {

				this._subSelection = this._subSelection != elementController ? elementController : undefined;

				this.setSelection(this.selection, this._subSelection);

				//console.log("Rule #8 applied for mouse down on " + element.id);
			}


			// prevent event from bubbling, return.
			//Event.stop(event);
			return;
		},

		_handleMouseMove: function (event, uiObj) {
			return;
		},

		_handleMouseUp: function (event, uiObj) {
			// get canvas.
			var canvas = this.getCanvas();

			// find the shape that is responsible for this elemement's id.
			var elementController = uiObj;

			//get event position
			var evPos = this.eventCoordinates(event);

			//Event.stop(event);
		},

		_handleMouseHover: function (event, uiObj) {
			return;
		},

		_handleMouseOut: function (event, uiObj) {
			return;
		},

		/**
		 * Calculates the event coordinates to SVG document coordinates.
		 * param {Event} event
		 * @return {SVGPoint} The event coordinates in the SVG document
		 */
		eventCoordinates: function (event) {
			var canvas = this.getCanvas();

			var svgPoint = canvas.node.ownerSVGElement.createSVGPoint();
			svgPoint.x = event.clientX;
			svgPoint.y = event.clientY;
			var matrix = canvas.node.getScreenCTM();
			return svgPoint.matrixTransform(matrix.inverse());
		}
	},
	/******************************************************************************
	 DESTRUCTOR
	 ******************************************************************************/
	destruct: function () {
		this._disposeObjects("_canvas");
		this._disposeObjects("_htmlWidget");
		this._disposeArray('_eventsQueue');
		this._disposeArray('loadedPlugins');
		this._disposeArray('loadedPlugins');
	}

});
