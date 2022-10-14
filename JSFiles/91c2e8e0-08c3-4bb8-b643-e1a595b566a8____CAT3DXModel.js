/**
 * @exports DS/CAT3DExpModel/CAT3DXModel
*/
define('DS/CAT3DExpModel/CAT3DXModel',
[
	'UWA/Core',
	'UWA/Promise',
	'DS/WebExtensionServers/WebExtensionServer'
],

// Declaration
function (
	UWA,
	Promise,
	WebExtensionServer
	) {
	'use strict';

	/**
	* @name DS/CAT3DExpModel/CAT3DXModel
	*
	* @description
	* <p>Singleton to Manage extensions of the model.</p>
	* <p>It is also a factory proxy to create actors/Experience. </p>
	* <p> A web application should init this singleton with the right model extensions (addExtension) and a factory (setFactory).</p>
	* @constructor
	* @augments UWA/Class/singleton
	**/
	var CAT3DXModel = UWA.Class.singleton(
	/** @lends DS/CAT3DExpModel/CAT3DXModel.prototype **/
	{
		/**
		* @public
		*/
		init: function () {
		    this._extensions = [];
		    this._interfaceSymbols = {};
		    this._extensionSymbols = {};
		    this._managerSymbols = {};
			this._factory = null;
		},

		/**
		* Clean extensions and factory reference
		* @public
        * @return {Object} promise
		**/
		clean: function () {
		    this._extensions = [];
		    this._interfaceSymbols = {};
		    this._extensionSymbols = {};
		    this._managerSymbols = {};
		    var self = this;
		    return this._cleanFactory().done(function(){
		        self._experienceBase = null;
		    });		
		},

		_cleanFactory: function () {
		    if (this._factory) {
		        var self = this;
		        return this._factory.clean().done(function () {
		            self._factory = null;
		        });
		    } else {
		        return UWA.Promise.resolve();
		    }
		},

		/** 
		* Add a Class extension to be loaded.
        * Override rules : 
        *   -If multiple extensions describe the same component : if it's possible description will be merge, if not the latest added extension class will override the others
		*   -If multiple extensions require different files for the same interfaces/managers/extensions by spec : the latest added extension class will override the others
        * @public
		* @param {Object} iExtension - a {@link DS/CAT3DExpModel/CAT3DXModelExtensionImpl} class.
		**/
		addExtension: function (iExtension) {
			if (UWA.is(iExtension)) {
			    this._extensions.push(iExtension);
			}
		},

		/** 
		* set the web application base 
		* @public
		* @param {WebAplicationBase} iExperienceBase - the web application base. See 'DS/WebApplicationBase/WebApplicationBase' for more details
		**/
		setExperienceBase: function(iExperienceBase) {
		    this._experienceBase = iExperienceBase;
		},

		/** 
		* Set the Factory
		* @public
		* @param {Object} iFactory - a {@link DS/CAT3DExpModel/CAT3DXModelFactory CAT3DXModelFactory} factory.
		**/
		setFactory: function (iFactory) {
			this._factory = iFactory;
		},

		/** 
		* Get the current Factory
		* @public
		* @return {Object} the current Factory of type {@link DS/CAT3DExpModel/CAT3DXModelFactory CAT3DXModelFactory}.
		**/
		getFactory: function () {
			return this._factory;
		},

		/** 
		* Get the component according to path of Ids
		* @public
        * @param {String} iPathOfIds path of ID
        * @return {Promise} promise with component
		**/
		GetComponentByPathOfIds: function (iPathOfIds) {
			return this._factory.GetComponentByPathOfIds(iPathOfIds);
		},

		start: function () {
		    var self = this;
		    return this._loadExtensions().done(function () {
		        return self._factory.start();
		    });
		},

		/** 
		* Load added extensions
        * Compute model
        * Load interfaces
        * Load Extensions
        * Load Managers
        * Load factory dependencies
        * Load CAT3DXModel in the web experience base dictionaries
		* @public
        * @return {Promise} promise
		**/
		_loadExtensions: function () {
		    var self = this;

		    var componentsData = [];
		    var interfacesData = [];
		    var extensionsData = [];
		    var managersData = [];

		    for (var i = 0; i < this._extensions.length; i++) {
		        if (this._extensions[i].GetComponents().length > 0) { componentsData.push(this._extensions[i].GetComponents()); }

		        if (this._extensions[i].GetInterfaces().length > 0) { interfacesData.push(this._extensions[i].GetInterfaces()); }
		        if (this._extensions[i].GetExtensions().length > 0) { extensionsData.push(this._extensions[i].GetExtensions()); }
		        if (this._extensions[i].GetManagers().length > 0) { managersData.push(this._extensions[i].GetManagers()); }
		    }

		    var promises = [];
		    promises.push(this._factory.ComputeComponents(componentsData));
		    promises.push(this._factory.LoadDependencies());

		    promises.push(this._computeAndLoadInterfaces(interfacesData));
		    promises.push(this._computeAndLoadExtensions(extensionsData));
		    promises.push(this._computeAndLoadManagers(managersData));


			return Promise.all(promises).done(function () {
			    self._experienceBase.AddDictionaryApp(self);
			    self._buildManagers();
			    return UWA.Promise.resolve();
			});
		},

	    /** 
		* Compute and require interfaces dependencies
		* @private
        * @param {Object} iInterfacesData - interfaces data computed from extensions class
        * @return {Promise} promise
		**/
		_computeAndLoadInterfaces: function (iInterfacesData) {
		    var self = this;
		    iInterfacesData.forEach(function (interfacesExtension) {
		        interfacesExtension.forEach(function (iInterfaces) {
		            for (var iInterfaceName in iInterfaces) {
		                self._interfaceSymbols[iInterfaceName] = {
		                    origin: iInterfaces[iInterfaceName]
		                };
		            }
		        });
		    });

		    var dependencies = [];
		    for (var iInterfaceName in this._interfaceSymbols) {
		        dependencies.push(this._interfaceSymbols[iInterfaceName].origin);
		    }

		    return this._loadDependencies(dependencies).done(function (iSymbols) {
		        var idep = 0;
		        for (var iInterfaceName in self._interfaceSymbols) {
		            self._interfaceSymbols[iInterfaceName].symbol = iSymbols[idep++];
		        }
		    });
		},

	    /** 
		* Compute and require extensions dependencies
		* @private
        * @param {Object} iExtensionsData - extensions data computed from extensions class
        * @return {Promise} promise
		**/
		_computeAndLoadExtensions: function (iExtensionsData) {
		    var self = this;
		    iExtensionsData.forEach(function (extensionsExtension) {
		        extensionsExtension.forEach(function (iExtensions) {
		            for (var iSpecName in iExtensions) {
		                self._extensionSymbols[iSpecName] = self._extensionSymbols[iSpecName] ? self._extensionSymbols[iSpecName] : {};
		                for (var iExtensionName in iExtensions[iSpecName]){
		                    self._extensionSymbols[iSpecName][iExtensionName] = {
		                        origin: iExtensions[iSpecName][iExtensionName]
		                    };
		                }
		            }
		        });
		    });

		    var dependencies = [];
		    for (var iSpecName in this._extensionSymbols) {
		        for (var iExtensionName in this._extensionSymbols[iSpecName]) {
		            dependencies.push(this._extensionSymbols[iSpecName][iExtensionName].origin);
		        }
		    };

		    return this._loadDependencies(dependencies).done(function (iSymbols) {
		        var idep = 0;
		        Object.keys(self._extensionSymbols).forEach(function (iSpecName) {
		            Object.keys(self._extensionSymbols[iSpecName]).forEach(function (iExtensionName) {
		            	var symbol = iSymbols[idep++];
		            	if (!UWA.is(symbol)) {
		            		console.error('CAT3DXModel._computeAndLoadExtensions() : unable to load extension ' + iExtensionName + ' of spec ' + iSpecName);
		            		return;
		            	}
		                symbol.GetOrigin = function () {
		                    return self._extensionSymbols[iSpecName][iExtensionName].origin;
		                };
		                self._extensionSymbols[iSpecName][iExtensionName].symbol = symbol;
		            });
		        });
		    });
		},

	    /** 
		* Compute and require managers dependencies
		* @private
        * @param {Object} iManagersData - manager data computed from extensions class
        * @return {Promise} promise
		**/
		_computeAndLoadManagers: function (iManagersData) {
		    var self = this;
		    iManagersData.forEach(function (managersExtension) {
		        managersExtension.forEach(function (iManagers) {
		            for (var iManagerName in iManagers) {
		                self._managerSymbols[iManagerName] = {
		                    origin: iManagers[iManagerName]
		                };
		            }
		        });
		    });

		    var dependencies = [];
		    for (var iManagerName in this._managerSymbols) {
		        dependencies.push(this._managerSymbols[iManagerName].origin);
		    }

		    return this._loadDependencies(dependencies).done(function (iSymbols) {
		        var idep = 0;
		        for (var iManagerName in self._managerSymbols) {
		            self._managerSymbols[iManagerName].symbol = iSymbols[idep++];
		        }
		    });
		},

	    /** 
		* require helper
		* @private
        * @param {Array} iDependencies - array of dependencies to require
        * @return {Promise} promise
		**/
		_loadDependencies: function (iDependencies) {
		    var dfd = UWA.Promise.deferred();
		    require(iDependencies, function () {
		        dfd.resolve(arguments);
		    });
		    return dfd.promise;
		},

		/** 
		* Fill experience base server according to loaded class extensions
		* @public
        * @return {Object} extension server
		**/
		fillServer: function () {
		    var self = this;
		    var extensionServer = new WebExtensionServer();
		    //Add component to WebExtensionServer with factory
			var buildComponents = this._factory.BuildComponentTable(extensionServer);

            //Add interfaces on WebExtensionServer
			for (var iInterfaceName in this._interfaceSymbols) {
			    extensionServer.AddInterface(iInterfaceName, this._interfaceSymbols[iInterfaceName].symbol);
			}


		    //Add Extensions on WebExtensionServer
		    //Compute extensions for all components according to their hierarchy
			for (var iComponent = 0; iComponent < buildComponents.length; iComponent++) {
			    var parentedExtensions = {};
			    var prototypalChain = [];
			    var parent = buildComponents[iComponent];
			    do {
			        if (parent.prototype.GetType) {
			            prototypalChain.push(parent.prototype.GetType());
			        }
			        parent = parent.parent;
			    } while (UWA.is(parent));

			    for (var i = prototypalChain.length - 1; i >= 0; --i) {
			        if (this._extensionSymbols.hasOwnProperty(prototypalChain[i])) {
			            for (var iExtensionName in this._extensionSymbols[prototypalChain[i]]) {
			                parentedExtensions[iExtensionName] = this._extensionSymbols[prototypalChain[i]][iExtensionName];
			            }
			        }
			    }

			    for (var iExtensionName in parentedExtensions) {
			        extensionServer.AddExtension(prototypalChain[0], iExtensionName, parentedExtensions[iExtensionName].symbol);
			    }
			}

		    //Add Managers on WebExtensionServer
			Object.keys(this._managerSymbols).forEach(function (iManagerName) {
			    var origin = self._managerSymbols[iManagerName].origin;
			    var symbol = self._managerSymbols[iManagerName].symbol;
			    symbol.GetOrigin = function () {
			        return origin;
			    };
			    extensionServer.AddExtension(iManagerName, 'W3AIManager', symbol);
			    extensionServer.AddComponent(iManagerName, symbol);
			});

			return extensionServer;
		},

		_buildManagers: function () {
		    for (var iManagerName in this._managerSymbols) {
		        var buildManager = this._experienceBase.Factory.BuildComponent(iManagerName);
		        buildManager.SetID(iManagerName);
		        buildManager.SetPersistency(1);
		        buildManager.initialize();
		        buildManager.postInitialize();
		        this._experienceBase._ManagerSet.addManager(iManagerName, buildManager);
		    }
		},

	    /** 
		* Create an experience
		* @public
		* @param {string}	ExperienceName - name of the experience to create
        * @param [{Object}] ScenarioTypes - scenarioTypes of the experience
		* @return {object}	created experience object
		**/
		CreateExperience: function (iExperienceName, iScenarioTypes) {
			var self = this;

			if (this._factory) {
			    var promisedNotification = this._experienceBase.getManager('CAT3DXNotificationsManager').addPromisedNotification({
			        title: 'Create Experience',
			        subtitle: 'Start creating experience'
			    });

			    return this._factory.CreateExperience(iExperienceName, iScenarioTypes).then(function (iExperience) {
			        self._factory.SetExperience(iExperience);
			        promisedNotification.resolve({
			            title: 'Create Experience',
			            subtitle: 'Experience has been created'
			        });
			        return iExperience;
			    })['catch'](function (e) {
			        promisedNotification.reject({
			            title: 'Create Experience',
			            subtitle: 'Fail to create experience',
			            message: e
			        });
			        return Promise.reject(e);
			    });
			}
			else {
				return Promise.reject(new Error('No Factory instantiated'));
			}
		},

		/**
		* Load a Creative Experience from its source
		* @public
        * @param {string} iLinkContext Link context
        * @param {Object} iLink current link
        * @param {Object} iScenarioTypes scenario types
		* @return {object}	loaded experience object
		**/
		LoadExperience: function (iLinkContext, iLink, iScenarioTypes) {
			var self = this;
			if (this._factory) {
			    var promisedNotification = this._experienceBase.getManager('CAT3DXNotificationsManager').addPromisedNotification({
			        title: 'Load Experience',
			        subtitle: 'Start loading experience'
			    });

			    return this._factory.LoadExperience(iLinkContext, iLink, iScenarioTypes).then(function (iExperience) {
			        self._factory.SetExperience(iExperience);
			        promisedNotification.resolve({
			            title: 'Load Experience',
			            subtitle: 'Experience has been loaded'
			        });
				    return iExperience;
			    })['catch'](function (e) {
			        promisedNotification.reject({
			            title: 'Load Experience',
			            subtitle: 'Fail to load experience',
			            message: e
			        });
			        return Promise.reject(e);
			    });
			}
			else {
			    return Promise.reject(new Error('No Factory instantiated'));
			}
		},

	    /**
        * Check if an experience is started on server (when re-connect to the server with a new web session)
        * @public
        * @return {Promise} promise
        */
		IsExperienceStarted: function () {
		    if (this._factory) {
		        return this._factory.IsExperienceStarted();
		    } else {
		        return Promise.reject(new Error('No Factory instantiated'));
		    }
		},

	    /**
		* Close experience on server (when re-connect to the server with a new web session)
        * @public
        * @return {Promise} promise
		*/
		CloseExperienceServer: function () {
		    if (this._factory) {
		        return this._factory.CloseExperienceServer();
		    } else {
		        return Promise.reject(new Error('No Factory instantiated'));
		    }
		},

	    /**
		* Load experience from server (when re-connect to the server with a new web session)
        * @public
        * @return {Promise} promise
		*/
		RetrieveExperienceServer: function () {
		    var self = this;
		    if (this._factory) {
		        var promisedNotification = this._experienceBase.getManager('CAT3DXNotificationsManager').addPromisedNotification({
		            title: 'Load Experience',
		            subtitle: 'Start loading experience'
		        });
	        
		        return this._factory.RetrieveExperienceServer().then(function (iExperience) {
		            self._factory.SetExperience(iExperience);
		            promisedNotification.resolve({
		                title: 'Load Experience',
		                subtitle: 'Experience has been loaded'
		            });
		            return iExperience;
		        })['catch'](function (e) {
		            promisedNotification.reject({
		                title: 'Load Experience',
		                subtitle: 'Fail to load experience',
		                message: e
		            });
		            return Promise.reject(e);
		        });
		    }
		    else {
		        return Promise.reject(new Error('No Factory instantiated'));
		    }
		},

		/**
		* Save the current experience in the database
		* @public
        * @return {Promise} promise
		**/
		SaveExperience: function () {
		    if (this._factory) {
		        var promisedNotification = this._experienceBase.getManager('CAT3DXNotificationsManager').addPromisedNotification({
		            title: 'Save Experience',
		            subtitle: 'Start saving experience'
		        });

		        return this._factory.SaveExperience().then(function () {
		            promisedNotification.resolve( {
		                title: 'Save Experience',
		                subtitle: 'Experience has been saved'
		            });
		            return Promise.resolve();
		        })['catch'](function (e) {
		            promisedNotification.reject({
		                title: 'Save Experience',
		                subtitle: 'Fail to save experience',
		                message: e
		            });
		            return Promise.reject(e);
		        });
			}
		    return Promise.reject(new Error('No Factory instantiated'));
		},

		/**
		* Destroy the Current creative Experience object
		* @public
        * @return {Promise} promise
		**/
		CloseExperience: function () {
			var self = this;
			if (this._factory) {
			    var promisedNotification = this._experienceBase.getManager('CAT3DXNotificationsManager').addPromisedNotification({
			        title: 'Close Experience',
			        subtitle: 'Start closing experience'
			    });

			    return this._factory.CloseExperience().then(function () {
			        self._factory.SetExperience(null);
			        promisedNotification.resolve({
			            title: 'Close Experience',
			            subtitle: 'Experience has been closed'
			        });
					return Promise.resolve();
			    })['catch'](function (e) {
			        promisedNotification.reject({
			            title: 'Close Experience',
			            subtitle: 'Fail to close experience',
			            message: e
			        });
			        return Promise.reject(e);
			    });
			}
			else {
			    return Promise.reject(new Error('No Factory instantiated'));
			}
		},

	    /**
		* return the current experience
		* @public
        * @return {Promise} promise with experience
		**/
		GetExperience: function () {
		    return this._factory.GetExperience();
		},

		SetVariableValues: function (iComponent, iVariableName, iValues) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.SetVariableValues(iComponent, iVariableName, iValues)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

		/**
		* Create an actor under the giver father
		* @public
		* @param {string}	iTypeName - type of actor to create
		* @param {string}	iActorName - name of the actor to create
		* @param {string}	iFather - father ID
		* @return {Promise}	promise with created actor object
		**/
		CreateActor: function (iTypeName, iActorName, iFather) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateActor(iTypeName, iActorName, iFather)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

		CreateState: function (neutrals, sequenceId, stateName, stateDescription) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateState(neutrals, sequenceId, stateName, stateDescription)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(new Error('Unable to CreateState'));
		        });
		    }
		    return Promise.reject(new Error("No Factory instantiated"));
		},

		CreateStateCollection: function (stateCollectionName, stateCollectionId) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateStateCollection(stateCollectionName, stateCollectionId)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(new Error("Unable to CreateStateCollection"));
		        });
		    }
		    return Promise.reject(new Error("No Factory instantiated"));
		},

		DeleteState: function (stateId, stateCollectionId) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.DeleteState(stateId, stateCollectionId)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(new Error("Unable to DeleteState"));
		        });
		    }
		    return Promise.reject(new Error("No Factory instantiated"));
		},

		DeleteStateCollection: function (stateCollectionId) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.DeleteStateCollection(stateCollectionId)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(new Error("Unable to DeleteStateCollection"));
		        });
		    }
		    return Promise.reject(new Error("No Factory instantiated"));
		},

		UpdateState: function (stateId, stateCollectionId, neutrals, stateDescription) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.UpdateState(stateId, stateCollectionId, neutrals, stateDescription)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(new Error("Unable to UpdateState"));
		        });
		    }
		    return Promise.reject(new Error("No Factory instantiated"));
		},

		UpdateStateCollection: function (stateCollectionId, stateCollectionNewName, stateCollectionNewOrder) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.UpdateStateCollection(stateCollectionId, stateCollectionNewName, stateCollectionNewOrder)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(new Error("Unable to UpdateStateCollection"));
		        });
		    }
		    return Promise.reject(new Error("No Factory instantiated"));
		},

		CreateCityActorExternal: function (actorName, fatherPath, assetPhysicalId, assetName) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateCityActorExternal(actorName, fatherPath, assetPhysicalId, assetName)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(new Error("Unable to CreateCityActorExternal"));
		        });
		    }
		    return Promise.reject(new Error("No Factory instantiated"));
		},

		CreateCityActorInternal: function (typeName, actorName, fatherPath, link) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateCityActorInternal(typeName, actorName, fatherPath, link)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(new Error("Unable to CreateCityActorInternal"));
		        });
		    }
		    return Promise.reject(new Error("No Factory instantiated"));
		},

		DeleteActor:function(iActor){
		    if (this._factory) {
		        var self = this;
		        return this._factory.DeleteActor(iActor)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

		InsertProduct: function (iActorName, iFather, iLinkContext, iLinkDescription) {
		    if (this._factory) {
		        var promisedNotification = this._experienceBase.getManager('CAT3DXNotificationsManager').addPromisedNotification({
		            title: 'Add Product',
		            subtitle: 'Start adding product'
		        });

		        return this._factory.InsertProduct(iActorName, iFather, iLinkContext, iLinkDescription).then(function (iProduct) {
		            promisedNotification.resolve({
		                title: 'Add Product',
		                subtitle: 'Product has been added'
		            });
		            return iProduct;
		        })['catch'](function (e) {
		            promisedNotification.reject({
		                title: 'Add Product',
		                subtitle: 'Fail to add product',
		                message: e
		            });
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

		CreateActorFromAsset: function (iTypeName, iActorName, iFather, iLinkContext, iLinkDescription) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateActorFromAsset(iTypeName, iActorName, iFather, iLinkContext, iLinkDescription)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

		CreateOverrideProduct: function (iPathOfInst, iOverrideName, iFather) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateOverrideProduct(iPathOfInst, iOverrideName, iFather)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

		DeleteOverride: function (iOverride) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.DeleteOverride(iOverride)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
		* Create a behavior under the given father
		* @public
		* @param {string}	iTypeName - type of the behavior to create
		* @param {string}	iBehaviorName - name of the behavior to create
		* @param {string}	iFather -father
		* @return {Promise}	promise with created behavior object
		**/
		CreateBehavior: function (iTypeName, iBehaviorName, iFather) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateBehavior(iTypeName, iBehaviorName, iFather)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

		DeleteBehavior: function (iBehavior) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.DeleteBehavior(iBehavior)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
		* Create a scenario under the current experience
		* @public
		* @param {string}	iScenarioName - name of the scenario to create
		* @return {Promise}	promise with created scenario object
		**/
		CreateScenario: function (iScenarioName) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateScenario(iScenarioName)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Get scenario types of the current experience
        * @public
		* @param {string} iExperienceID - experience ID
		* @return {Promise}	promise
        **/
		GetScenarioTypes: function (iExperienceID) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.GetScenarioTypes(iExperienceID)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Set scenario types of the current experience
        * @protected
        * @param {Object} iScenarioTypes - scenario types to set
		* @return {Promise}	promise
        **/
		SetScenarioTypes: function (iScenarioTypes) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.SetScenarioTypes(iScenarioTypes)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
		* Create an act under the given father
		* @public
		* @param {string}	iActName - name of the act to create
		* @param {string}	iFather - father
	    * @return {Promise}	promise
		**/
		CreateAct: function (iActName, iFather) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateAct(iActName, iFather)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Create a paragraph under the given father
        * @public
        * @param {string}	iParagraphName - name of the paragraph to create
        * @param {string}	iFather - father
        * @return {object}	created paragraph object
        **/
		CreateParagraph: function (iParagraphName, iFather) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateParagraph(iParagraphName, iFather)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Create a sentence under the given father
        * @public
        * @param {string}	iSentenceName - name of the sentence to create
        * @param {string}	iFather - father
        * @return {object}	created sentence object
        **/
		CreateSentence: function (iSentenceName, iFather) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateSentence(iSentenceName, iFather)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Create a block under the given father
        * @public
        * @param {string}	iBlockName - name of the block to create
        * @param {string}	iFather - father 
        * @param {boolean}	iIsSensorBlocks  - true for sensorBlock, false for driver block
        * @return {object}	created block object
        **/
		CreateBlock: function (iBlockName, iFather, iIsSensorBlocks) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateBlock(iBlockName, iFather, iIsSensorBlocks)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
		* Create a resource under the current experience
		* @public
		* @param {string}	iTypeName - type of the resource to create
		* @param {string}	iResourceName - name of the resource to create
		* @return {object}	created resource object
		**/
		CreateResource: function (iTypeName, iResourceName) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateResource(iTypeName, iResourceName)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

		CreateResourceFromAsset: function (iTypeName, iResourceName, iLinkContext, iLinkDescription) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateResourceFromAsset(iTypeName, iResourceName, iLinkContext, iLinkDescription)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
		* Create an environment under the current experience
		* @public
		* @param {string}	iTypeName - type of the environment to create
		* @param {string}	iEnvironmentName - name of the environment to create
		* @return {object}	created environment object
		*/
		CreateEnvironment: function (iTypeName, iEnvironmentName) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateEnvironment(iTypeName, iEnvironmentName)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Create an UIButton under the current experience
        * @public
        * @param {string}	iUIName - name of the UIButton to create
        * @return {object}	created UIButton object
        */
		CreateUIButton: function (iUIName) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateUIButton(iUIName)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Create an UIText under the current experience
        * @public
        * @param {string}	iUIName - name of the UIText to create
        * @return {object}	created UIText object
        */
		CreateUIText: function (iUIName) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateUIText(iUIName)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Create an UIImage under the current experience
        * @public
        * @param {string}	iUIName - name of the UIImage to create
        * @return {object}	created UIImage object
        */
		CreateUIImage: function (iUIName) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateUIImage(iUIName)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Create an UITextField under the current experience
        * @public
        * @param {string}	iUIName - name of the UITextField to create
        * @return {object}	created UITextField object
        */
		CreateUITextField: function (iUIName) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateUITextField(iUIName)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Create an UIColorPicke under the current experience
        * @public
        * @param {string}	iUIName - name of the UIColorPicke to create
        * @return {object}	created UIColorPicke object
        */
		CreateUIColorPicker: function (iUIName) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateUIColorPicker(iUIName)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Create an UISlider under the current experience
        * @public
        * @param {string}	iUIName - name of the UISlider to create
        * @return {object}	created UISlider object
        */
		CreateUISlider: function (iUIName) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateUISlider(iUIName)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Create an UICameraViewer under the current experience
        * @public
        * @param {string}	iUIName - name of the UICameraViewer to create
        * @return {object}	created UICameraViewer object
        */
		CreateUICameraViewer: function (iUIName) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateUICameraViewer(iUIName)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Create an UIWebViewer under the current experience
        * @public
        * @param {string}	iUIName - name of the UIWebViewer to create
        * @return {object}	created UIWebViewer object
        */
		CreateUIWebViewer: function (iUIName) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateUIWebViewer(iUIName)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Create an UIGalleryMenu under the current experience
        * @public
        * @param {string}	iUIName - name of the UIGalleryMenu to create
        * @return {object}	created UIGalleryMenu object
        */
		CreateUIGalleryMenu: function (iUIName) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateUIGalleryMenu(iUIName)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Create an UIGalleryImage under the current experience
        * @public
        * @param {string}	iUIName - name of the UIGalleryImage to create
        * @return {object}	created UIGalleryImage object
        */
		CreateUIGalleryImage: function (iUIName) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateUIGalleryImage(iUIName)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Create an UIGalleryProduct under the current experience
        * @public
        * @param {string}	iUIName - name of the UIGalleryProduct to create
        * @return {object}	created UIGalleryProduct object
        */
		CreateUIGalleryProduct: function (iUIName) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateUIGalleryProduct(iUIName)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
        * Create an UIGalleryViewpoint under the current experience
        * @public
        * @param {string}	iUIName - name of the UIGalleryViewpoint to create
        * @return {object}	created UIGalleryViewpoint object
        */
		CreateUIGalleryViewpoint: function (iUIName) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateUIGalleryViewpoint(iUIName)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

		CreateGalleryItem: function (iItemName, iFather) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CreateGalleryItem(iItemName, iFather)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

	    /**
       * copy an actor under the given father
       * @public
       * @param {object}	iActor - actor to copy
       * @param {object}	iFather - father
       * @return {object}	actor copy
       */
		CopyActor: function (iActor, iFather) {
		    if (this._factory) {
		        var self = this;
		        return this._factory.CopyActor(iActor, iFather)['catch'](function (e) {
		            self._experienceBase.getManager('CAT3DXNotificationsManager').addNotification({
		                level: 'error',
		                message: e.toString()
		            }, 2000);
		            return Promise.reject(e);
		        });
		    }
		    return Promise.reject(new Error('No Factory instantiated'));
		},

		/**
		* Build a component using the web object modeler. Use this method to create session only components.
		* @public
		* @param {string}	iType - type of component to create
		* @param {string}	iID - Id of the component to assign in the TOS
		* @return {object}	created component
		*/
		BuildComponent: function (iType, iID) {	//deprecated
			if (this._factory) {
				console.warn('3DXModel.BuildComponent() deprecated, use CreateActor() instead !');
				var compo = this._factory.BuildComponent(iType, iID);
				return Promise.resolve(compo);
			}
			else {
				return UWA.Promise.reject(new Error('No Factory instantiated'));
			}
		},

		RemoveComponentFromComponentMap: function (iComponent) {
		    if (this._factory) {
		        this._factory.RemoveComponentFromComponentMap(iComponent);
		    } else {
		        console.error('No Factory instantiated');
		    }
		},

		/** 
		* Get an UI from a property
		* @public
		* @param {string}	iSpecName - type of component 
		* @param {string}	iPropName - name of the property
		* @return {Object} the UI object
		**/
		GetObjectUI: function (iSpecName, iPropName) {
			return this._factory.GetObjectUI(iSpecName, iPropName);
		},

		/** 
		* Get prototypal chain of a type
		* @public
		* @param {string}	iSpecName - type of component 
		* @return {string[]} the prototypal chain
		**/
		GetPrototypalChain: function (iSpecName) {
			return this._factory.GetPrototypalChain(iSpecName);
		},

		/** 
		* Get variables of a type
		* @public
		* @param {string}	iSpecName - type of component 
		* @return {Object[]} the variables of the component
		**/
		GetVariables: function (iSpecName) {
			return this._factory.GetVariables(iSpecName);
		}
	});
	return CAT3DXModel;
});

