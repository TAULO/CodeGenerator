/*!---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*----------------------------------------------------------*/
define(["require", "exports", "Providers/Azure/Loaders/AttributeLoaderHelper", "Providers/Azure/Resources/AzureResources", "Providers/Common/AzureConstants", "Providers/Azure/Producers/AzureResourceProducer", "Providers/Azure/Actions/AzureFabricActions", "Providers/Azure/Loaders/AzureVirtualMachineV2AttributeLoader", "Providers/Azure/Loaders/AzureVirtualMachineScaleSetAttributeLoader", "Providers/Azure/Actions/AzureVirtualMachineV2Actions", "Common/PromisesUtils", "es6-promise", "underscore", "Common/UIActions", "URIjs/URITemplate"], function (require, exports, AttributeLoaderHelper, AzureResources, AzureConstants, AzureResourceProducer, AzureFabricActions, AzureVirtualMachineV2AttributeLoader, AzureVirtualMachineScaleSetAttributeLoader, AzureVirtualMachineV2Actions, PromisesUtils, rsvp, underscore, UIActions, URITemplate) {
    "use strict";
    var Promise = rsvp.Promise;
    var ScaleSetVM = (function () {
        function ScaleSetVM(name, publicIPAddress, etwListernerPort, debuggerPorts) {
            this.name = name;
            this.publicIPAddress = publicIPAddress;
            this.etwListernerPort = etwListernerPort;
            this.debuggerPorts = debuggerPorts;
        }
        return ScaleSetVM;
    }());
    var AzureFabricAttributeLoader = (function () {
        function AzureFabricAttributeLoader(azureConnection, host) {
            var _this = this;
            /**
             * Registers querybindings on the given queryBindingManager
             */
            this.registerBindings = function (loaderBindingManger) {
                loaderBindingManger.addAttributeLoaderBinding(AzureFabricAttributeLoader.getLocalClusterAttributes, _this.getLocalClusterAttributes);
                loaderBindingManger.addAttributeLoaderBinding(AzureFabricAttributeLoader.getRemoteClusterAttributes, _this.getRemoteClusterAttributes);
                loaderBindingManger.addAttributeLoaderBinding(AzureFabricAttributeLoader.getNodeAttributes, _this.getNodeAttributes);
                loaderBindingManger.addAttributeLoaderBinding(AzureFabricAttributeLoader.getApplicationAttributes, _this.getApplicationAttributes);
                loaderBindingManger.addAttributeLoaderBinding(AzureFabricAttributeLoader.getServiceAttributes, _this.getServiceAttributes);
                loaderBindingManger.addAttributeLoaderBinding(AzureFabricAttributeLoader.getPartitionAttributes, _this.getPartitionAttributes);
                loaderBindingManger.addAttributeLoaderBinding(AzureFabricAttributeLoader.getReplicaAttributes, _this.getReplicaAttributes);
                loaderBindingManger.addAttributeLoaderBinding(AzureFabricAttributeLoader.getVMsAttribute, _this.getVMsAttribute);
                loaderBindingManger.addAttributeLoaderBinding(AzureFabricAttributeLoader.getEtwExtensionStateAttribute, _this.getEtwExtensionStateAttribute);
                loaderBindingManger.addAttributeLoaderBinding(AzureFabricAttributeLoader.getDebuggerVMExtensionStateAttribute, _this.getDebuggerVMExtensionStateAttribute);
                loaderBindingManger.addAttributeLoaderBinding(AzureFabricAttributeLoader.getVMScaleSetsAttribute, _this.getVMScaleSetsAttribute);
                loaderBindingManger.addAttributeLoaderBinding(AzureFabricAttributeLoader.getIsRemoteActionInProgressAttribute, _this.getIsRemoteActionInProgressAttribute);
                loaderBindingManger.addAttributeLoaderBinding(AzureFabricAttributeLoader.getFeatureSwitchAttribute, _this.getFeatureSwitchAttribute);
            };
            /**
             * Gets the remote cluster properties
             */
            this.getRemoteClusterAttributes = function (args) {
                if (args === void 0) { args = null; }
                return _this._attributeLoaderHelper.getRequest(AttributeLoaderHelper.ResourceUriTemplate, args).then(function (resource) {
                    var subscription = JSON.parse(args.subscription);
                    return _this._getClusterAttributes(args.id, args.isInitialized, args.name, resource, subscription.accountId).then(function (result) {
                        result.results = result.results.concat({ name: "clusterId", value: resource.properties.clusterId });
                        return result;
                    });
                });
            };
            /**
             * Gets the local cluster properties
             */
            this.getLocalClusterAttributes = function (args) {
                if (args === void 0) { args = null; }
                return _this._getClusterAttributes(args.id, args.isInitialized, args.name);
            };
            /**
             * Gets the cluster attributes
             */
            this._getClusterAttributes = function (nodeId, isInitialized, clusterName, resource, accountId) {
                if (resource === void 0) { resource = null; }
                if (accountId === void 0) { accountId = null; }
                return _this._host.executeOperation(AzureFabricAttributeLoader._getClusterPropertiesHostNamespace, [clusterName, resource, accountId])
                    .then(function (properties) {
                    if (!isInitialized) {
                        var nodeQuery = [{ name: "id", value: nodeId }];
                        _this._uiActions.setAttribute(nodeQuery, { name: "isInitialized", value: true });
                    }
                    return _this._host.executeOperation(AzureFabricAttributeLoader._getClusterHealthHostNamespace, [properties.ApiServiceId, /* suppressAuthenticationPrompt: */ !isInitialized])
                        .then(function (healthResponse) {
                        return _this._host.executeOperation(AzureFabricAttributeLoader._getNodesHostNamespace, [properties.ApiServiceId, /* suppressAuthenticationPrompt: */ !isInitialized])
                            .then(function (nodes) {
                            var seedNodes = nodes.filter(function (node) { return node.IsSeedNode; });
                            var healthySeedNodes = seedNodes.filter(function (node) { return node.HealthState === 1; });
                            var upgradeDomains = nodes.map(function (node) { return node.UpgradeDomain; });
                            upgradeDomains = underscore.uniq(upgradeDomains);
                            var faultDomains = nodes.map(function (node) { return node.FaultDomain; });
                            faultDomains = underscore.uniq(faultDomains);
                            var attributes = [
                                { name: "apiServiceId", value: properties.ApiServiceId },
                                {
                                    name: "statusLabel",
                                    value: _this._getStatusLabel(healthResponse.AggregatedHealthState, AzureFabricAttributeLoader._healthState, 1)
                                },
                                { name: "managementEndpoint", value: properties.ManagementEndpoint },
                                {
                                    name: "healthState",
                                    value: _this._getEnumString(healthResponse.AggregatedHealthState, AzureFabricAttributeLoader._healthState)
                                },
                                { name: "healthySeedNodes", value: healthySeedNodes.length },
                                { name: "upgradeDomains", value: upgradeDomains.length },
                                { name: "faultDomains", value: faultDomains.length },
                                { name: "isClusterDown", value: false }
                            ];
                            return { results: attributes };
                        });
                    }, function () {
                        // Note: Fill in all the properties with default values because Cloud Explorer refreshes
                        // until all properties are defined.  This way we don't show the same error message or ask the user to
                        // authenticate over and over again.
                        var attributes = [
                            { name: "apiServiceId", value: properties.ApiServiceId },
                            { name: "statusLabel", value: "Unknown" },
                            { name: "managementEndpoint", value: properties.ManagementEndpoint },
                            { name: "healthState", value: "Unknown" },
                            { name: "healthySeedNodes", value: "" },
                            { name: "upgradeDomains", value: "" },
                            { name: "faultDomains", value: "" },
                            { name: "isClusterDown", value: true }
                        ];
                        return { results: attributes };
                    });
                });
            };
            /**
             * Gets node attributes
             */
            this.getNodeAttributes = function (args) {
                if (args === void 0) { args = null; }
                return _this._host.executeOperation(AzureFabricAttributeLoader._getNodeHostNamespace, [args.name, args.apiServiceId])
                    .then(function (node) {
                    return {
                        results: [
                            {
                                name: "statusLabel",
                                value: _this._getStatusLabel(node.NodeStatus, AzureFabricAttributeLoader._nodeStatus, 1)
                            },
                            {
                                name: "statusProperty",
                                value: _this._getEnumString(node.NodeStatus, AzureFabricAttributeLoader._nodeStatus)
                            },
                            {
                                name: "healthState",
                                value: _this._getEnumString(node.HealthState, AzureFabricAttributeLoader._healthState)
                            },
                            { name: "type", value: node.Type },
                            { name: "upgradeDomain", value: node.UpgradeDomain },
                            { name: "faultDomain", value: node.FaultDomain },
                            { name: "ipAddressOrFQDN", value: node.IpAddressOrFQDN },
                            { name: "isSeedNode", value: node.IsSeedNode }
                        ]
                    };
                });
            };
            /**
             * Gets application attributes
             */
            this.getApplicationAttributes = function (args) {
                if (args === void 0) { args = null; }
                return _this._host.executeOperation(AzureFabricAttributeLoader._getApplicationHostNamespace, [args.applicationId, args.apiServiceId])
                    .then(function (app) {
                    return {
                        results: [
                            {
                                name: "statusLabel",
                                value: _this._getStatusLabel(app.HealthState, AzureFabricAttributeLoader._healthState, 1)
                            },
                            {
                                name: "statusProperty",
                                value: _this._getEnumString(app.Status, AzureFabricAttributeLoader._applicationStatus)
                            },
                            {
                                name: "healthState",
                                value: _this._getEnumString(app.HealthState, AzureFabricAttributeLoader._healthState)
                            },
                            { name: "applicationType", value: app.TypeName },
                            { name: "version", value: app.TypeVersion }
                        ]
                    };
                });
            };
            /**
             * Gets service attributes
             */
            this.getServiceAttributes = function (args) {
                if (args === void 0) { args = null; }
                return _this._host.executeOperation(AzureFabricAttributeLoader._getServiceHostNamespace, [args.applicationId, args.serviceId, args.apiServiceId])
                    .then(function (service) {
                    return _this._host.executeOperation(AzureFabricAttributeLoader._getServiceDescriptionHostNamespace, [args.applicationId, args.serviceId, args.apiServiceId])
                        .then(function (serviceDescription) {
                        return _this._host.resolveResource(AzureResources.commonNamespace, "Properties.ServiceFabric.None")
                            .then(function (nullProperty) {
                            return {
                                results: [
                                    {
                                        name: "statusLabel",
                                        value: _this._getStatusLabel(service.HealthState, AzureFabricAttributeLoader._healthState, 1)
                                    },
                                    {
                                        name: "statusProperty",
                                        value: _this._getEnumString(service.ServiceStatus, AzureFabricAttributeLoader._serviceStatus)
                                    },
                                    {
                                        name: "healthState",
                                        value: _this._getEnumString(service.HealthState, AzureFabricAttributeLoader._healthState)
                                    },
                                    {
                                        name: "serviceKind",
                                        value: _this._getEnumString(service.ServiceKind, AzureFabricAttributeLoader._serviceKind)
                                    },
                                    { name: "serviceType", value: service.TypeName },
                                    { name: "serviceTypeVersion", value: service.ManifestVersion },
                                    {
                                        name: "instanceCount",
                                        value: serviceDescription.InstanceCount ? serviceDescription.InstanceCount : nullProperty
                                    },
                                    {
                                        name: "minReplicaSetSize",
                                        value: serviceDescription.MinReplicaSetSize ? serviceDescription.MinReplicaSetSize : nullProperty
                                    },
                                    {
                                        name: "targetReplicaSetSize",
                                        value: serviceDescription.TargetReplicaSetSize ? serviceDescription.TargetReplicaSetSize : nullProperty
                                    }
                                ]
                            };
                        });
                    });
                });
            };
            /**
             * Gets partition attributes
             */
            this.getPartitionAttributes = function (args) {
                if (args === void 0) { args = null; }
                return _this._host.executeOperation(AzureFabricAttributeLoader._getPartitionHostNamespace, [args.applicationId, args.serviceId, args.partitionId, args.apiServiceId])
                    .then(function (partition) {
                    return _this._host.resolveResource(AzureResources.commonNamespace, "Properties.ServiceFabric.None")
                        .then(function (nullProperty) {
                        return {
                            results: [
                                {
                                    name: "statusLabel",
                                    value: _this._getStatusLabel(partition.HealthState, AzureFabricAttributeLoader._healthState, 1)
                                },
                                {
                                    name: "statusProperty",
                                    value: _this._getEnumString(partition.PartitionStatus, AzureFabricAttributeLoader._partitionStatus)
                                },
                                {
                                    name: "healthState",
                                    value: _this._getEnumString(partition.HealthState, AzureFabricAttributeLoader._healthState)
                                },
                                {
                                    name: "partitionKind",
                                    value: _this._getEnumString(partition.PartitionInformation.ServicePartitionKind, AzureFabricAttributeLoader._servicePartitionKind)
                                },
                                {
                                    name: "instanceCount",
                                    value: partition.InstanceCount ? partition.InstanceCount : nullProperty
                                },
                                {
                                    name: "lowKey",
                                    value: partition.PartitionInformation.LowKey ? partition.PartitionInformation.LowKey : nullProperty
                                },
                                {
                                    name: "highKey",
                                    value: partition.PartitionInformation.HighKey ? partition.PartitionInformation.HighKey : nullProperty
                                },
                                {
                                    name: "minReplicaSetSize",
                                    value: partition.MinReplicaSetSize ? partition.MinReplicaSetSize : nullProperty
                                },
                                {
                                    name: "targetReplicaSetSize",
                                    value: partition.TargetReplicaSetSize ? partition.TargetReplicaSetSize : nullProperty
                                }
                            ]
                        };
                    });
                });
            };
            /**
             * Gets replica attributes
             */
            this.getReplicaAttributes = function (args) {
                if (args === void 0) { args = null; }
                return _this._host.executeOperation(AzureFabricAttributeLoader._getReplicaHostNamespace, [args.applicationId, args.serviceId, args.partitionId, args.replicaId, args.apiServiceId])
                    .then(function (replica) {
                    return _this._host.resolveResource(AzureResources.commonNamespace, "Properties.ServiceFabric.None")
                        .then(function (nullProperty) {
                        var address = replica.Address;
                        if (address.indexOf("{") === 0) {
                            JSON.parse(address, function (key, value) {
                                if (key.toString() === "Value") {
                                    address = value.toString();
                                }
                            });
                        }
                        var role = replica.ReplicaRole ? _this._getEnumString(replica.ReplicaRole, AzureFabricAttributeLoader._replicaRole) : nullProperty;
                        var statusProperty = _this._getEnumString(replica.HealthState, AzureFabricAttributeLoader._healthState);
                        var statusLabel = "";
                        if (role === "Primary") {
                            statusLabel = statusLabel + role;
                        }
                        if (role === "Primary" && statusProperty !== "OK") {
                            statusLabel = statusLabel + " - ";
                        }
                        if (statusProperty !== "OK") {
                            statusLabel = statusLabel + statusProperty;
                        }
                        return {
                            results: [
                                { name: "statusLabel", value: statusLabel },
                                { name: "statusProperty", value: statusProperty },
                                {
                                    name: "healthState",
                                    value: _this._getEnumString(replica.HealthState, AzureFabricAttributeLoader._healthState)
                                },
                                { name: "address", value: address },
                                { name: "role", value: role }
                            ]
                        };
                    });
                });
            };
            this.getEtwExtensionStateAttribute = function (args) {
                return _this._host.executeOperation(AzureVirtualMachineV2Actions.getEtwListenerVMExtVersionNamespace).then(function (targetVersion) {
                    var vms = args.vms;
                    var scaleSets = args.scaleSets;
                    // 'Enable Etw extension' context menu will be enabled when any of the VM is missing the target version of extension or port configuration.
                    var isEtwDisabledOnAnyVM = (vms && vms.some(function (vm) { return !_this._isTargetEtwExtensionInstalledOnVM(vm, targetVersion); }))
                        || (scaleSets && scaleSets.some(function (ss) {
                            return !_this._isTargetEtwExtensionInstalledOnScaleSet(ss, targetVersion) || !_this._isEtwPortConfiguredOnScaleSet(ss);
                        }));
                    // 'Disable Etw extension' context menu will be enabled when any of the VM has the extension (old or new version) or port configured.
                    var isEtwEnabledOnAnyVM = (vms && vms.some(function (vm) { return _this._isEtwExtensionInstalledOnVM(vm); }))
                        || (scaleSets && scaleSets.some(function (ss) {
                            return _this._isEtwExtensionInstalledOnScaleSet(ss) || _this._isEtwPortConfiguredOnScaleSet(ss);
                        }));
                    return {
                        results: [
                            { name: "isEtwDisabledOnAnyVM", value: isEtwDisabledOnAnyVM },
                            { name: "isEtwEnabledOnAnyVM", value: isEtwEnabledOnAnyVM }
                        ]
                    };
                });
            };
            this.getDebuggerVMExtensionStateAttribute = function (args) {
                return new Promise(function (resolve, reject) {
                    var scaleSets = args.scaleSets;
                    // 'Enable Debugger extension' context menu will be enabled when any of the VM is missing the latest version of extension.
                    var isDebuggerDisabledOnAnyVM = scaleSets.some(function (ss) {
                        return !_this._isTargetDebuggerExtensionInstalled(ss) || !_this._isDebuggerPortConfiguredOnScaleSet(ss);
                    });
                    // 'Disable Debugger extension' context menu will be enabled when any of the VM has the extension.
                    var isDebuggerEnabledOnAnyVM = scaleSets.some(function (ss) {
                        return _this._isDebuggerExtensionInstalled(ss) || _this._isDebuggerPortConfiguredOnScaleSet(ss);
                    });
                    resolve({
                        results: [
                            { name: "isDebuggerDisabledOnAnyVM", value: isDebuggerDisabledOnAnyVM },
                            { name: "isDebuggerEnabledOnAnyVM", value: isDebuggerEnabledOnAnyVM }
                        ]
                    });
                });
            };
            this.getIsRemoteActionInProgressAttribute = function (args) {
                var isRemoteActionInProgress = false;
                if (AzureFabricActions.isRemoteActionInProgress(args.id)) {
                    isRemoteActionInProgress = true;
                }
                return Promise.resolve({
                    results: [{ name: "isRemoteActionInProgress", value: isRemoteActionInProgress }]
                });
            };
            this.getFeatureSwitchAttribute = function (args) {
                return _this._host.executeOperation(AzureFabricAttributeLoader._getFeatureSwitchHostNamespace, ["ServiceFabric." + args.featureName])
                    .then(function (result) {
                    return { results: [{ name: "is" + args.featureName + "FeatureOn", value: result }] };
                });
            };
            this.getVMsAttribute = function (args) {
                if (args === void 0) { args = null; }
                // Get all VMs in the resource group, so we can go through them looking for those used by this cluster.
                if (args.isEtwFeatureOn || args.isDebuggerFeatureOn) {
                    var subscription = JSON.parse(args.subscription);
                    return _this.getVMsFromResourceGroup(subscription, args.resourceGroup, args.apiVersion)
                        .then(function (vms) {
                        var promises = [];
                        vms.forEach(function (vm) {
                            // VMs in the cluster will have the cluster extension,
                            // with the cluster GUID embedded in the extension's cluster endpoint property.
                            promises.push(_this._isFabricVM(vm, args.subscription, args.clusterId, args.apiVersion)
                                .then(function (isFabricNode) {
                                if (isFabricNode) {
                                    return _this._getVMArgs(vm, args.subscription, args.apiVersion);
                                }
                                else {
                                    return null;
                                }
                            }));
                        });
                        return Promise.all(promises).then(function (perVMResults) {
                            var value = perVMResults.filter(function (perVMResult) { return !!perVMResult; });
                            return { results: [{ name: "vms", value: value }] };
                        });
                    });
                }
                else {
                    return Promise.resolve({ results: [{ name: "vms", value: [] }] });
                }
            };
            this.getVMScaleSetsAttribute = function (args) {
                if (args === void 0) { args = null; }
                var ScaleSetsAttributeName = "scaleSets";
                if (!args.isEtwFeatureOn && !args.isDebuggerFeatureOn) {
                    return Promise.resolve({ results: [{ name: ScaleSetsAttributeName, value: [] }] });
                }
                var subscription = JSON.parse(args.subscription);
                return _this.getVMScaleSetsFromResourceGroup(subscription, args.resourceGroup, args.apiVersion)
                    .then(function (scaleSets) {
                    var promises = [];
                    scaleSets.forEach(function (scaleSet) {
                        var promise = _this._isFabricScaleSet(scaleSet, args.subscription, args.clusterId, args.apiVersion)
                            .then(function (isFabricScaleSet) { return isFabricScaleSet ? _this.getScaleSetArgs(scaleSet, args.subscription, args.apiVersion) : null; });
                        promises.push(promise);
                    });
                    return Promise.all(promises).then(function (scaleSetResults) {
                        var retval = scaleSetResults.filter(function (scaleSetResult) { return !!scaleSetResult; });
                        return { results: [{ name: ScaleSetsAttributeName, value: retval }] };
                    });
                });
            };
            this.getVMsFromResourceGroup = function (subscription, resourceGroup, apiVersion) {
                var url = AzureFabricAttributeLoader._getVMsFromResourceGroupUrlTemplate.expand({
                    managementEndpoint: subscription.managementEndpoint,
                    subscriptionId: subscription.id,
                    resourceGroupId: resourceGroup,
                    apiVersion: apiVersion
                });
                return _this._azureConnection.webRequest(url.toString(), subscription, "GET")
                    .then(function (response) {
                    return AzureResourceProducer.parseResourceWebResponse(response, subscription).resources;
                });
            };
            this.getVMScaleSetsFromResourceGroup = function (subscription, resourceGroup, apiVersion) {
                var url = AzureFabricAttributeLoader._getVMScaleSetsFromResourceGroupUrlTemplate.expand({
                    managementEndpoint: subscription.managementEndpoint,
                    subscriptionId: subscription.id,
                    resourceGroupId: resourceGroup,
                    apiVersion: apiVersion
                });
                return _this._azureConnection.webRequest(url.toString(), subscription, "GET")
                    .then(function (response) {
                    return AzureResourceProducer.parseResourceWebResponse(response, subscription).resources;
                });
            };
            this._getEnumString = function (code, strings) {
                // For consistency's sake, always use 'Unknown' instead of 'Invalid'
                return code < 1 || code >= strings.length ? "Unknown" : strings[code];
            };
            this._getStatusLabel = function (code, strings, healthyIndex) {
                return healthyIndex === code ? "" : _this._getEnumString(code, strings);
            };
            // Check whether the given VM is part of fabric cluster.
            this._isFabricVM = function (vm, subscription, clusterGuid, apiVersion) {
                return _this._attributeLoaderHelper.getRequest(AzureFabricAttributeLoader._resourceUriTemplate, {
                    subscription: subscription,
                    resourceGroupId: vm.resourceGroup,
                    id: vm.id,
                    apiVersion: apiVersion
                }).then(function (fullVM) {
                    var extensions = null;
                    if (!!fullVM.resources) {
                        extensions = underscore.filter(fullVM.resources, function (resource) {
                            return resource.type === "Microsoft.Compute/virtualMachines/extensions";
                        });
                    }
                    if (!!extensions) {
                        // look through extensions for the servicefabric extension...
                        var clusterExtension = underscore.find(extensions, function (extension) {
                            if (extension.properties &&
                                extension.properties.type === "ServiceFabricNode" &&
                                extension.properties.publisher === "Microsoft.Azure.ServiceFabric") {
                                // this VM is a servicefabric node; is it in the correct cluster?
                                var endpoint = extension.properties &&
                                    extension.properties.settings &&
                                    extension.properties.settings.clusterEndpoint;
                                return !!endpoint && endpoint.indexOf(clusterGuid) >= 0;
                            }
                            else {
                                return false;
                            }
                        });
                        return !!clusterExtension;
                    }
                    else {
                        return false;
                    }
                });
            };
            this._isFabricScaleSet = function (scaleSet, subscription, clusterId, apiVersion) {
                var scaleSetAttributeRequestArgs = {
                    subscription: subscription,
                    resourceGroupId: scaleSet.resourceGroup,
                    id: scaleSet.id,
                    apiVersion: apiVersion
                };
                return _this._attributeLoaderHelper.getRequest(AzureFabricAttributeLoader._resourceUriTemplate, scaleSetAttributeRequestArgs)
                    .then(function (scaleSetDescription) {
                    var extensions = scaleSetDescription.properties.virtualMachineProfile.extensionProfile.extensions;
                    if (!extensions) {
                        return false;
                    }
                    var clusterExtension = underscore.find(extensions, function (e) {
                        return e.properties.type === "ServiceFabricNode" &&
                            e.properties.publisher === "Microsoft.Azure.ServiceFabric" &&
                            e.properties.settings.clusterEndpoint &&
                            e.properties.settings.clusterEndpoint.indexOf(clusterId) >= 0;
                    });
                    return !!clusterExtension;
                });
            };
            /// Get all the information we need about a VM in order to support the debugging & Etw listener features,
            /// starting from just its description as a generic ARM resource.
            this._getVMArgs = function (resource, subscription, apiVersion) {
                var getAttributesArgs = {
                    id: resource.id,
                    subscription: subscription,
                    apiVersion: apiVersion
                };
                return _this._vmAttributeLoader.getAttributes(getAttributesArgs)
                    .then(function (attributesResults) {
                    var networkInterfaceId = underscore.find(attributesResults.results, function (attr) { return attr.name === "networkInterfaceId"; }).value;
                    var debuggingExtensionId = underscore.find(attributesResults.results, function (attr) { return attr.name === "remoteDebuggingExtensionId"; }).value;
                    var debuggingExtensionName = underscore.find(attributesResults.results, function (attr) { return attr.name === "remoteDebuggingExtensionName"; }).value;
                    var remoteDebuggingExtensionState = underscore.find(attributesResults.results, function (attr) { return attr.name === "remoteDebuggingExtensionState"; }).value;
                    var remoteDebuggingExtensionVersion = underscore.find(attributesResults.results, function (attr) { return attr.name === "remoteDebuggingExtensionVersion"; }).value;
                    var debuggingExtensionSettings = underscore.find(attributesResults.results, function (attr) { return attr.name === "remoteDebuggingExtensionSettings"; }).value;
                    var etwListenerExtensionId = underscore.find(attributesResults.results, function (attr) { return attr.name === "etwListenerExtensionId"; }).value;
                    var etwListenerExtensionName = underscore.find(attributesResults.results, function (attr) { return attr.name === "etwListenerExtensionName"; }).value;
                    var etwListenerExtensionState = underscore.find(attributesResults.results, function (attr) { return attr.name === "etwListenerExtensionState"; }).value;
                    var etwListenerExtensionVersion = underscore.find(attributesResults.results, function (attr) { return attr.name === "etwListenerExtensionVersion"; }).value;
                    var etwEncryptionKey = underscore.find(attributesResults.results, function (attr) { return attr.name === "etwEncryptionKey"; }).value;
                    var etwEncryptionIV = underscore.find(attributesResults.results, function (attr) { return attr.name === "etwEncryptionIV"; }).value;
                    var getNetworkInterfaceArgs = {
                        id: networkInterfaceId,
                        subscription: subscription,
                        apiVersion: apiVersion
                    };
                    return _this._vmAttributeLoader.getNetworkInterfaceAttribute(getNetworkInterfaceArgs)
                        .then(function (networkInterfaceResults) {
                        var promises = [];
                        // get loadbalancer and network security group in parallel:
                        var networkInterface = underscore.find(networkInterfaceResults.results, function (attr) { return attr.name === "networkInterface"; }).value;
                        var getLoadBalancerArgs = {
                            networkInterface: networkInterface,
                            subscription: subscription,
                            apiVersion: apiVersion
                        };
                        promises.push(_this._vmAttributeLoader.getLoadBalancerAttribute(getLoadBalancerArgs));
                        var getNetworkSecurityGroupArgs = {
                            networkInterface: networkInterface,
                            subscription: subscription,
                            apiVersion: apiVersion
                        };
                        promises.push(_this._vmAttributeLoader.getNetworkSecurityGroupAttribute(getNetworkSecurityGroupArgs));
                        return PromisesUtils.waitForAll(promises)
                            .then(function (results) {
                            var loadBalancer = underscore.find(results[0].resolvedValue.results, function (attr) { return attr.name === "loadBalancer"; }).value;
                            var networkSecurityGroup = underscore.find(results[1].resolvedValue.results, function (attr) { return attr.name === "networkSecurityGroup"; }).value;
                            var getIpAddressArgs = {
                                networkInterface: networkInterface,
                                loadBalancer: loadBalancer,
                                subscription: subscription,
                                apiVersion: apiVersion
                            };
                            return _this._vmAttributeLoader.getIpAddressAttribute(getIpAddressArgs)
                                .then(function (ipAddressResults) {
                                var ipAddress = underscore.find(ipAddressResults.results, function (attr) { return attr.name === "publicIpAddress"; }).value;
                                return _this._getEtwListnerPortAttribute(loadBalancer, networkInterface)
                                    .then(function (etwListenerPortResult) {
                                    // Build a complete result object, with all the info we'll need to enable
                                    // the debugging and etw listener features.
                                    var vm = {
                                        id: resource.id,
                                        subscription: resource.subscription,
                                        resourceGroup: resource.resourceGroup,
                                        location: resource.location,
                                        name: resource.name,
                                        publicIPAddress: ipAddress,
                                        networkSecurityGroup: networkSecurityGroup,
                                        loadBalancer: loadBalancer,
                                        networkInterface: networkInterface,
                                        debuggingExtension: {
                                            id: debuggingExtensionId,
                                            name: debuggingExtensionName,
                                            properties: {
                                                provisioningState: remoteDebuggingExtensionState,
                                                typeHandlerVersion: remoteDebuggingExtensionVersion,
                                                settings: JSON.parse(debuggingExtensionSettings),
                                                publisher: AzureConstants.RemoteDebugging.RemoteDebuggingExtensionPublisher,
                                                type: AzureConstants.RemoteDebugging.RemoteDebuggingExtensionType,
                                                autoUpgradeMinorVersion: false
                                            }
                                        },
                                        etwListenerExtension: {
                                            id: etwListenerExtensionId,
                                            name: etwListenerExtensionName,
                                            properties: {
                                                provisioningState: etwListenerExtensionState,
                                                typeHandlerVersion: etwListenerExtensionVersion,
                                                publisher: AzureConstants.ServiceFabric.EtwListenerExtensionPublisher,
                                                type: AzureConstants.ServiceFabric.EtwListenerExtensionType,
                                                autoUpgradeMinorVersion: false,
                                                settings: {
                                                    EtwEncryptionKey: {
                                                        Key: etwEncryptionKey,
                                                        IV: etwEncryptionIV
                                                    }
                                                }
                                            },
                                            port: etwListenerPortResult.results[0].value
                                        }
                                    };
                                    return vm;
                                });
                            });
                        });
                    });
                });
            };
            this.getScaleSetArgs = function (scaleSet, subscription, apiVersion) {
                var getAttributesArgs = {
                    id: scaleSet.id,
                    subscription: subscription,
                    apiVersion: apiVersion
                };
                return _this._scaleSetAttributeLoader.getAllAttributes(getAttributesArgs).then(function (attributesResults) {
                    var loadBalancerIds = underscore.find(attributesResults.results, function (a) { return a.name === "loadBalancerIds"; }).value;
                    var subnetIds = underscore.find(attributesResults.results, function (a) { return a.name === "subnetIds"; }).value;
                    var networkProfile = underscore.find(attributesResults.results, function (a) { return a.name === "networkProfile"; }).value;
                    var secrets = underscore.find(attributesResults.results, function (a) { return a.name === "secrets"; }).value;
                    var fabricScaleSet = {
                        id: scaleSet.id,
                        subscription: JSON.parse(subscription),
                        resourceGroup: scaleSet.resourceGroup,
                        location: scaleSet.location,
                        name: scaleSet.name,
                        type: scaleSet.type,
                        sku: scaleSet.sku,
                        vms: [],
                        secrets: secrets,
                        networkProfile: networkProfile,
                        debuggingExtension: {
                            name: underscore.find(attributesResults.results, function (a) { return a.name === "debuggerExtensionName"; }).value,
                            properties: {
                                typeHandlerVersion: underscore.find(attributesResults.results, function (a) { return a.name === "debuggerExtensionVersion"; }).value,
                                publisher: AzureConstants.RemoteDebugging.RemoteDebuggingExtensionPublisher,
                                type: AzureConstants.RemoteDebugging.RemoteDebuggingExtensionType,
                                autoUpgradeMinorVersion: false,
                                settings: {
                                    clientThumbprint: underscore.find(attributesResults.results, function (a) { return a.name === "debuggerClientThumbprint"; }).value,
                                    serverThumbprint: underscore.find(attributesResults.results, function (a) { return a.name === "debuggerServerThumbprint"; }).value,
                                    connectorPort: null,
                                    forwarderPort: null,
                                    forwarderPortx86: null,
                                    fileUploadPort: null
                                }
                            }
                        },
                        etwListenerExtension: {
                            name: underscore.find(attributesResults.results, function (a) { return a.name === "etwListenerExtensionName"; }).value,
                            properties: {
                                typeHandlerVersion: underscore.find(attributesResults.results, function (a) { return a.name === "etwListenerExtensionVersion"; }).value,
                                publisher: AzureConstants.ServiceFabric.EtwListenerExtensionPublisher,
                                type: AzureConstants.ServiceFabric.EtwListenerExtensionType,
                                autoUpgradeMinorVersion: false,
                                settings: {
                                    EtwEncryptionKey: {
                                        Key: underscore.find(attributesResults.results, function (a) { return a.name === "etwEncryptionKey"; }).value,
                                        IV: underscore.find(attributesResults.results, function (a) { return a.name === "etwEncryptionIV"; }).value
                                    }
                                }
                            }
                        },
                        loadBalancerIds: loadBalancerIds,
                        subnetIds: subnetIds,
                        extensions: underscore.find(attributesResults.results, function (a) { return a.name === "extensions"; }).value,
                        provisioningState: underscore.find(attributesResults.results, function (a) { return a.name === "provisioningState"; }).value,
                        upgradeMode: underscore.find(attributesResults.results, function (a) { return a.name === "upgradeMode"; }).value
                    };
                    // In order to connect to remote etw listener service or debugger,
                    // a node needs to have publicIP address, frontend ports in the load balancer.
                    // Scale set contains list of load balancers and the loadbalancer has set of inboung NAT rules that defines the front end port.
                    // Frist, get the list of inbound NAT rules from the load balancers.
                    // Then get virtual machines in a scale set and add the vm specific properties (ip address, port) required by etw listener & debugger
                    var allEtwInboundNatRules = [];
                    var allDebuggerConnectorRules = [];
                    var allDebuggerForwarderRules = [];
                    var allDebuggerForwarderx86Rules = [];
                    var allDebuggerFileUploaderRules = [];
                    var ipConfigurationId2PublicIPAdderssId = {};
                    var ipConfigurationId2PublicIPAdderss = {};
                    return _this._azureFabricActions.getLoadBalancers([fabricScaleSet], apiVersion).then(function (loadbalancers) {
                        loadbalancers.forEach(function (loadBalancer) {
                            var inboundNatRules = loadBalancer.properties.inboundNatRules;
                            if (inboundNatRules) {
                                var etwInboundNatRules = inboundNatRules.filter(function (natRule) {
                                    return natRule.properties.backendPort === AzureFabricActions.defaultEtwListenerPorts.etwListenerPort;
                                });
                                allEtwInboundNatRules = allEtwInboundNatRules.concat(etwInboundNatRules);
                                var debuggerConnectorRules = inboundNatRules.filter(function (natRule) {
                                    return natRule.properties.backendPort === AzureVirtualMachineV2Actions.defaultDebuggingPorts.connectorPort;
                                });
                                allDebuggerConnectorRules = allDebuggerConnectorRules.concat(debuggerConnectorRules);
                                var debuggerForwarderRules = inboundNatRules.filter(function (natRule) {
                                    return natRule.properties.backendPort === AzureVirtualMachineV2Actions.defaultDebuggingPorts.forwarderPort;
                                });
                                allDebuggerForwarderRules = allDebuggerForwarderRules.concat(debuggerForwarderRules);
                                var debuggerForwarderx86Rules = inboundNatRules.filter(function (natRule) {
                                    return natRule.properties.backendPort === AzureVirtualMachineV2Actions.defaultDebuggingPorts.forwarderPortx86;
                                });
                                allDebuggerForwarderx86Rules = allDebuggerForwarderx86Rules.concat(debuggerForwarderx86Rules);
                                var debuggerFileUploaderRules = inboundNatRules.filter(function (natRule) {
                                    return natRule.properties.backendPort === AzureVirtualMachineV2Actions.defaultDebuggingPorts.fileUploadPort;
                                });
                                allDebuggerFileUploaderRules = allDebuggerFileUploaderRules.concat(debuggerFileUploaderRules);
                                var allExtensionRules = [];
                                allExtensionRules = allExtensionRules.concat(etwInboundNatRules).concat(debuggerConnectorRules).concat(debuggerForwarderRules).concat(debuggerForwarderx86Rules).concat(debuggerFileUploaderRules);
                                // Each inbound NAT rule specifies the frontend IPConfiguration Id.
                                // So from NAT rules IPConfigurationId, get the IPConfiguration detail that defines the Public IPAddress id. Then from public IPAddress Id, get the publicIP address.
                                // Save the IPConfigurationId and its corresponsing publicIPAddressId in a map.
                                allExtensionRules.forEach(function (rule) {
                                    var feIPConfigs = loadBalancer.properties.frontendIPConfigurations;
                                    var feIPConfigOnRule = underscore.findWhere(feIPConfigs, { id: rule.properties.frontendIPConfiguration.id });
                                    if (!ipConfigurationId2PublicIPAdderssId[feIPConfigOnRule.id]) {
                                        // Store only the public IP address id and postpone the actual IP Address retrieval
                                        ipConfigurationId2PublicIPAdderssId[feIPConfigOnRule.id] = feIPConfigOnRule.properties.publicIPAddress.id;
                                    }
                                });
                            }
                        });
                        // From public IPAddress id, query the public IP address from Azure
                        var getPublicIPAddress = [];
                        for (var ipConfigurationId in ipConfigurationId2PublicIPAdderssId) {
                            getPublicIPAddress.push(_this._getPublicIPAddress(ipConfigurationId2PublicIPAdderssId[ipConfigurationId], subscription, apiVersion).then(function (ipAddress) {
                                ipConfigurationId2PublicIPAdderss[ipConfigurationId] = ipAddress;
                            }));
                        }
                        return Promise.all(getPublicIPAddress).then(function () {
                            return _this._getScaleSetVMs(fabricScaleSet.id, subscription, apiVersion).then(function (vms) {
                                var scaleSetVMs = [];
                                if (vms) {
                                    // Match the VM against the inboundNatRule and get frontend port number
                                    scaleSetVMs = vms.map(function (vm) {
                                        var etwConnectionInfo = _this._GetVMSepcificConnectionInfo(vm, allEtwInboundNatRules);
                                        var debuggerConnectorConnectionInfo = _this._GetVMSepcificConnectionInfo(vm, allDebuggerConnectorRules);
                                        var debuggerPorts = null;
                                        // all debugger specific ports are configured together.
                                        // So if connector port rules are missing don't bother retrieving the rest of the ports
                                        if (debuggerConnectorConnectionInfo) {
                                            debuggerPorts = {
                                                connectorPort: debuggerConnectorConnectionInfo.frontendPort,
                                                forwarderPort: _this._GetVMSepcificConnectionInfo(vm, allDebuggerForwarderRules).frontendPort,
                                                forwarderPortx86: _this._GetVMSepcificConnectionInfo(vm, allDebuggerForwarderx86Rules).frontendPort,
                                                fileUploadPort: _this._GetVMSepcificConnectionInfo(vm, allDebuggerFileUploaderRules).frontendPort
                                            };
                                        }
                                        var publicIpAddress = null;
                                        if (etwConnectionInfo) {
                                            publicIpAddress = ipConfigurationId2PublicIPAdderss[etwConnectionInfo.ipConfigurationId];
                                        }
                                        else if (debuggerConnectorConnectionInfo) {
                                            publicIpAddress = ipConfigurationId2PublicIPAdderss[debuggerConnectorConnectionInfo.ipConfigurationId];
                                        }
                                        var scaleSetVM = new ScaleSetVM(vm.name, publicIpAddress, etwConnectionInfo ? etwConnectionInfo.frontendPort : null, debuggerPorts);
                                        return scaleSetVM;
                                    });
                                }
                                fabricScaleSet.vms = scaleSetVMs;
                                return fabricScaleSet;
                            });
                        });
                    });
                });
            };
            this._GetVMSepcificConnectionInfo = function (vm, natRules) {
                var natRuleOnVM = underscore.find(natRules, function (rule) {
                    // NAT inbound rule's backend ip configuration id will have NIC id (after removing ipconfiguration/configname) of the vm,
                    // use this to pick the NAT inbound rule for a VM.
                    // backendIPConfigurationId = ../virtualMachineScaleSets/VMScaleSetServiceFabricNode/virtualMachines/2/networkInterfaces/NIC/ipConfigurations/somename
                    // vmNicId = ../virtualMachineScaleSets/VMScaleSetServiceFabricNode/virtualMachines/2/networkInterfaces/NIC
                    var backendIPConfigurationId = rule.properties.backendIPConfiguration.id;
                    var ruleNicId = backendIPConfigurationId.replace(/\/[i|I]p[c|C]onfigurations\/[^\/]+$/, "");
                    var vmNicId = vm.properties.networkProfile.networkInterfaces[0].id;
                    return ruleNicId === vmNicId;
                });
                if (natRuleOnVM) {
                    return {
                        frontendPort: natRuleOnVM.properties.frontendPort,
                        ipConfigurationId: natRuleOnVM.properties.frontendIPConfiguration.id
                    };
                }
                else {
                    return null;
                }
            };
            this._getScaleSetVMs = function (scaleSetId, subscription, apiVersion) {
                var scaleSetVMsArgs = {
                    subscription: subscription,
                    id: scaleSetId + "/virtualMachines",
                    apiVersion: apiVersion
                };
                return _this._attributeLoaderHelper.getRequest(AttributeLoaderHelper.ResourceUriTemplate, scaleSetVMsArgs).then(function (response) {
                    return response.value;
                });
            };
            this._getPublicIPAddress = function (publibIPAddressId, subscription, apiVersion) {
                var publivIPAddressArgs = {
                    subscription: subscription,
                    id: publibIPAddressId,
                    apiVersion: apiVersion
                };
                return _this._attributeLoaderHelper.getRequest(AttributeLoaderHelper.ResourceUriTemplate, publivIPAddressArgs).then(function (response) {
                    return response.properties.ipAddress;
                });
            };
            this._getEtwListnerPortAttribute = function (loadBalancer, networkInterface) {
                if (loadBalancer === void 0) { loadBalancer = null; }
                if (networkInterface === void 0) { networkInterface = null; }
                // identify the outgoing nat rule that is tied to the given network interface (VM) and the target port is 810 (etw listenerport)
                // example: networkInterface.id = /subscriptions/ebf670f2-712b-460a-9fec-bbbbbbbbbbbb/resourceGroups/LBtest2/providers
                //                                      /Microsoft.Network/networkInterfaces/NIC-testvm2-0-0
                //    backendIPConfiguration.id = /subscriptions/ebf670f2-712b-460a-9fec-bbbbbbbbbbbb/resourceGroups/LBtest2/providers
                //                                      /Microsoft.Network/networkInterfaces/NIC-testvm2-0-0/ipConfigurations/IPConfig
                var inboundNatRule = loadBalancer.properties.inboundNatRules;
                var thisVMRule = underscore.find(inboundNatRule, function (natRule) {
                    return natRule.properties.backendPort === AzureFabricActions.defaultEtwListenerPorts.etwListenerPort &&
                        natRule.properties.backendIPConfiguration !== undefined &&
                        natRule.properties.backendIPConfiguration.id === networkInterface.id + "/ipConfigurations/IPConfig";
                });
                var etwListenerPort = null;
                if (thisVMRule) {
                    etwListenerPort = thisVMRule.properties.frontendPort;
                }
                return Promise.resolve({
                    results: [
                        {
                            name: "etwListenerPort",
                            value: etwListenerPort,
                            expiration: Date.now() + 10000
                        }
                    ]
                });
            };
            this._isEtwExtensionInstalledOnVM = function (vm) {
                return AttributeLoaderHelper.isInstalledState(vm.etwListenerExtension.properties.provisioningState) && !!vm.etwListenerExtension.id && !!vm.etwListenerExtension.port;
            };
            this._isTargetEtwExtensionInstalledOnVM = function (vm, targetVersion) {
                return _this._isEtwExtensionInstalledOnVM(vm) && vm.etwListenerExtension.properties.typeHandlerVersion === targetVersion;
            };
            this._isEtwExtensionInstalledOnScaleSet = function (scaleSet) {
                return AttributeLoaderHelper.isInstalledState(scaleSet.provisioningState) && !!scaleSet.etwListenerExtension.name;
            };
            this._isEtwPortConfiguredOnScaleSet = function (scaleSet) {
                // From cloud explorer, creating inbound NAT pool is a single command. So if etw port is defined on any of the VM, it should be defined for all the VMs in the scaleset.
                // If a VM is missing the port, then the scale set might be in the prosess or onboarding a new VM or somethign wrong with this specific VM.
                // So, to check for port configuration, check if it exist in any of the VM
                return underscore.some(scaleSet.vms, function (vm) { return !!vm.etwListernerPort; });
            };
            this._isTargetEtwExtensionInstalledOnScaleSet = function (scaleSet, targetVersion) {
                return _this._isEtwExtensionInstalledOnScaleSet(scaleSet) && scaleSet.etwListenerExtension.properties.typeHandlerVersion === targetVersion;
            };
            this._isDebuggerExtensionInstalled = function (scaleSet) {
                return AttributeLoaderHelper.isInstalledState(scaleSet.provisioningState) && !!scaleSet.debuggingExtension.name;
            };
            this._isTargetDebuggerExtensionInstalled = function (scaleSet) {
                return _this._isDebuggerExtensionInstalled(scaleSet) && scaleSet.debuggingExtension.properties.typeHandlerVersion === AzureVirtualMachineV2Actions.debuggingExtensionVersion;
            };
            this._isDebuggerPortConfiguredOnScaleSet = function (scaleSet) {
                // From cloud explorer, creating inbound NAT pool is a single command. So if Debugger port is defined on any of the VM, it should be defined for all the VMs in the scaleset.
                // If a VM is missing the port, then the scale set might be in the prosess or onboarding a new VM or somethign wrong with this specific VM.
                // So, to check for port configuration, check if it exist in any of the VM
                return underscore.some(scaleSet.vms, function (vm) { return !!vm.debuggerPorts; });
            };
            this._azureConnection = azureConnection;
            this._attributeLoaderHelper = new AttributeLoaderHelper(azureConnection);
            this._vmAttributeLoader = new AzureVirtualMachineV2AttributeLoader(azureConnection, host);
            this._scaleSetAttributeLoader = new AzureVirtualMachineScaleSetAttributeLoader(azureConnection, host);
            this._azureFabricActions = new AzureFabricActions(azureConnection, host);
            this._host = host;
            this._uiActions = new UIActions(this._host);
        }
        return AzureFabricAttributeLoader;
    }());
    AzureFabricAttributeLoader.getLocalClusterAttributes = "Azure.Attributes.Fabric.GetLocalClusterAttributes";
    AzureFabricAttributeLoader.getRemoteClusterAttributes = "Azure.Attributes.Fabric.GetRemoteClusterAttributes";
    AzureFabricAttributeLoader.getNodeAttributes = "Azure.Attributes.Fabric.GetNodeAttributes";
    AzureFabricAttributeLoader.getApplicationAttributes = "Azure.Attributes.Fabric.GetApplicationAttributes";
    AzureFabricAttributeLoader.getServiceAttributes = "Azure.Attributes.Fabric.GetServiceAttributes";
    AzureFabricAttributeLoader.getPartitionAttributes = "Azure.Attributes.Fabric.GetPartitionAttributes";
    AzureFabricAttributeLoader.getReplicaAttributes = "Azure.Attributes.Fabric.GetReplicaAttributes";
    AzureFabricAttributeLoader.getVMsAttribute = "Azure.Attributes.Fabric.VMs";
    AzureFabricAttributeLoader.getVMScaleSetsAttribute = "Azure.Attributes.Fabric.VirtualMachineScaleSets";
    AzureFabricAttributeLoader.getFeatureSwitchAttribute = "Azure.Attributes.Fabric.FeatureSwitch";
    AzureFabricAttributeLoader.getEtwExtensionStateAttribute = "Azure.Attributes.Fabric.EtwExtensionState";
    AzureFabricAttributeLoader.getDebuggerVMExtensionStateAttribute = "Azure.Attributes.Fabric.DebuggerVMExtensionState";
    AzureFabricAttributeLoader.getIsRemoteActionInProgressAttribute = "Azure.Attributes.Fabric.IsRemoteActionInProgress";
    AzureFabricAttributeLoader._getClusterPropertiesHostNamespace = "AzureFabric.getClusterProperties";
    AzureFabricAttributeLoader._getClusterHealthHostNamespace = "AzureFabric.getClusterHealth";
    AzureFabricAttributeLoader._getNodesHostNamespace = "AzureFabric.getNodes";
    AzureFabricAttributeLoader._getNodeHostNamespace = "AzureFabric.getNode";
    AzureFabricAttributeLoader._getApplicationHostNamespace = "AzureFabric.getApplication";
    AzureFabricAttributeLoader._getServiceHostNamespace = "AzureFabric.getService";
    AzureFabricAttributeLoader._getServiceDescriptionHostNamespace = "AzureFabric.getServiceDescription";
    AzureFabricAttributeLoader._getPartitionHostNamespace = "AzureFabric.getPartition";
    AzureFabricAttributeLoader._getReplicaHostNamespace = "AzureFabric.getReplica";
    AzureFabricAttributeLoader._getFeatureSwitchHostNamespace = "AzureFabric.getFeatureSwitch";
    AzureFabricAttributeLoader._nodeStatus = ["Invalid", "Up", "Down", "Enabling", "Disabling", "Disabled"];
    AzureFabricAttributeLoader._applicationStatus = ["Invalid", "Ready", "Upgrading"];
    AzureFabricAttributeLoader._serviceStatus = ["Unknown", "Active", "Upgrading", "Deleting"];
    AzureFabricAttributeLoader._serviceKind = ["Invalid", "Stateless", "Stateful"];
    AzureFabricAttributeLoader._servicePartitionKind = ["Invalid", "Singleton", "Int64Range", "Named"];
    AzureFabricAttributeLoader._partitionStatus = ["Invalid", "Ready", "Not Ready", "In Quorom Loss"];
    AzureFabricAttributeLoader._replicaRole = ["Unknown", "None", "Primary", "Idle Secondary", "Active Secondary"];
    AzureFabricAttributeLoader._healthState = ["Invalid", "OK", "Warning", "Error"];
    AzureFabricAttributeLoader._resourceUriTemplateString = "{+managementEndpoint}/{+resourceId}/?api-version={+apiVersion}";
    AzureFabricAttributeLoader._resourceUriTemplate = URITemplate(AzureFabricAttributeLoader._resourceUriTemplateString);
    AzureFabricAttributeLoader._getVMsFromResourceGroupUrlTemplate = URITemplate("{+managementEndpoint}/subscriptions/{+subscriptionId}/resourceGroups/{+resourceGroupId}" +
        "/resources?$filter=resourceType eq 'Microsoft.Compute/virtualMachines'&api-version=2015-01-01");
    AzureFabricAttributeLoader._getVMScaleSetsFromResourceGroupUrlTemplate = URITemplate("{+managementEndpoint}/subscriptions/{+subscriptionId}/resourceGroups/{+resourceGroupId}" +
        "/resources?$filter=resourceType eq 'Microsoft.Compute/virtualMachineScaleSets'&api-version=2015-01-01");
    return AzureFabricAttributeLoader;
});
