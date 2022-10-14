/*!---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *----------------------------------------------------------*/
define(["require", "exports", "es6-promise", "underscore", "URIjs/URITemplate", "Providers/Azure/Loaders/AttributeLoaderHelper", "Providers/Azure/Actions/AzureVirtualMachineV2Actions", "Providers/Common/AzureConstants", "base64"], function (require, exports, rsvp, underscore, URITemplate, AttributeLoaderHelper, AzureVirtualMachineV2Actions, AzureConstants) {
    "use strict";
    var Promise = rsvp.Promise;
    /**
     * Contains the query actions that return Azure Resource entities.
     */
    var AzureVirtualMachineV2AttributeLoader = (function () {
        function AzureVirtualMachineV2AttributeLoader(azureConnection, host) {
            var _this = this;
            /**
             * Registers querybindings on the given queryBindingManager
             */
            this.registerBindings = function (loaderBindingManager) {
                loaderBindingManager.addAttributeLoaderBinding(AzureVirtualMachineV2AttributeLoader.getAllAttributesNamespace, _this.getAttributes);
                loaderBindingManager.addAttributeLoaderBinding(AzureVirtualMachineV2AttributeLoader.getApplicationInsightsAttributesNamespace, _this.getApplicationInsightsAttributes);
                loaderBindingManager.addAttributeLoaderBinding(AzureVirtualMachineV2AttributeLoader.getIpAddressAttribute, _this.getIpAddressAttribute);
                loaderBindingManager.addAttributeLoaderBinding(AzureVirtualMachineV2AttributeLoader.getStateAttributesNamespace, _this.getStateAttributes);
                loaderBindingManager.addAttributeLoaderBinding(AzureVirtualMachineV2AttributeLoader.getNetworkInterfaceAttributeNamespace, _this.getNetworkInterfaceAttribute);
                loaderBindingManager.addAttributeLoaderBinding(AzureVirtualMachineV2AttributeLoader.getLoadBalancerAttributeNamespace, _this.getLoadBalancerAttribute);
                loaderBindingManager.addAttributeLoaderBinding(AzureVirtualMachineV2AttributeLoader.getNetworkSecurityGroupAttributeNamespace, _this.getNetworkSecurityGroupAttribute);
                loaderBindingManager.addAttributeLoaderBinding(AzureVirtualMachineV2AttributeLoader.getIsEtwFeatureOnAttributeNamespace, _this.getIsEtwFeatureOnAttribute);
                loaderBindingManager.addAttributeLoaderBinding(AzureVirtualMachineV2AttributeLoader.getEtwListenerPortAttributeNamespace, _this.getEtwListenerPortAttribute);
            };
            /**
             * Gets properties for Azure VM Node
             */
            this.getAttributes = function (args) {
                if (args === void 0) { args = null; }
                return _this._attributeLoaderHelper.getRequest(AzureVirtualMachineV2AttributeLoader._resourceUriTemplate, args)
                    .then(function (resource) {
                    var diagnosticsId = null;
                    var diagnosticsSettings = null;
                    var diagnosticsStorageAccount = null;
                    var diagnosticsName = null;
                    var debuggingId = null;
                    var debuggingName = null;
                    var debuggingExtensionState = "NotInstalled";
                    var debuggingExtensionVersion = null;
                    var debuggingSettings = null;
                    var etwListenerExtensionState = "NotInstalled";
                    var etwListenerExtensionVersion = null;
                    var etwListenerExtensionId = null;
                    var etwListenerExtensionName = null;
                    var etwEncryptionKey = null;
                    var etwEncryptionIV = null;
                    var isWindows = resource.properties.storageProfile.osDisk.osType.toLowerCase() === "windows";
                    if (resource.resources) {
                        resource.resources.forEach(function (vmResource) {
                            if (vmResource.properties.publisher === "Microsoft.Azure.Diagnostics" &&
                                vmResource.properties.type === "IaaSDiagnostics") {
                                diagnosticsId = vmResource.id;
                                diagnosticsSettings = JSON.stringify(vmResource.properties.settings);
                                diagnosticsName = vmResource.name;
                                for (var prop in vmResource.properties.settings) {
                                    // They don't have an enforced/consistent naming convention for property settings.
                                    if (prop.toLowerCase() === "storageaccount") {
                                        diagnosticsStorageAccount = vmResource.properties.settings[prop];
                                        break;
                                    }
                                }
                            }
                            else if (vmResource.properties.publisher === AzureConstants.RemoteDebugging.RemoteDebuggingExtensionPublisher &&
                                vmResource.properties.type === AzureConstants.RemoteDebugging.RemoteDebuggingExtensionType) {
                                debuggingId = vmResource.id;
                                debuggingName = vmResource.name;
                                debuggingExtensionState = vmResource.properties.provisioningState;
                                debuggingExtensionVersion = vmResource.properties.typeHandlerVersion;
                                debuggingSettings = JSON.stringify(vmResource.properties.settings);
                            }
                            else if (vmResource.properties.publisher === AzureConstants.ServiceFabric.EtwListenerExtensionPublisher &&
                                vmResource.properties.type === AzureConstants.ServiceFabric.EtwListenerExtensionType) {
                                etwListenerExtensionId = vmResource.id;
                                etwListenerExtensionName = vmResource.name;
                                etwListenerExtensionState = vmResource.properties.provisioningState;
                                etwListenerExtensionVersion = vmResource.properties.typeHandlerVersion;
                                var encryptionInfo = vmResource.properties.settings.EtwEncryptionKey;
                                if (encryptionInfo !== undefined) {
                                    etwEncryptionKey = encryptionInfo.Key;
                                    etwEncryptionIV = encryptionInfo.IV;
                                }
                            }
                        });
                    }
                    var networkInterfaceId = null;
                    if (resource.properties.networkProfile.networkInterfaces.length === 1) {
                        // If there is only one then it doesn't have the primary value set like below.
                        networkInterfaceId = resource.properties.networkProfile.networkInterfaces[0].id;
                    }
                    else {
                        resource.properties.networkProfile.networkInterfaces.some(function (networkInterface) {
                            if (networkInterface.properties.primary) {
                                networkInterfaceId = networkInterface.id;
                                return true;
                            }
                            return false;
                        });
                    }
                    var expiration = Date.now() + 10000;
                    var attributes = [
                        {
                            name: "networkInterfaceId",
                            value: networkInterfaceId,
                            expiration: expiration
                        },
                        {
                            name: "diagnosticsExtensionSettings",
                            value: diagnosticsSettings,
                            expiration: expiration
                        },
                        {
                            name: "diagnosticsStorageAccountName",
                            value: diagnosticsStorageAccount,
                            expiration: expiration
                        },
                        {
                            name: "diagnosticsExtensionId",
                            value: diagnosticsId,
                            expiration: expiration
                        },
                        {
                            name: "diagnosticsExtensionName",
                            value: diagnosticsName,
                            expiration: expiration
                        },
                        {
                            name: "remoteDebuggingExtensionId",
                            value: debuggingId,
                            expiration: expiration
                        },
                        {
                            name: "remoteDebuggingExtensionName",
                            value: debuggingName,
                            expiration: expiration
                        },
                        {
                            name: "remoteDebuggingExtensionState",
                            value: debuggingExtensionState,
                            expiration: expiration
                        },
                        {
                            name: "remoteDebuggingExtensionVersion",
                            value: debuggingExtensionVersion,
                            expiration: expiration
                        },
                        {
                            name: "remoteDebuggingExtensionSettings",
                            value: debuggingSettings,
                            expiration: expiration
                        },
                        {
                            name: "hasWindowsOS",
                            value: isWindows,
                            expiration: expiration
                        },
                        {
                            name: "etwListenerExtensionId",
                            value: etwListenerExtensionId,
                            expiration: expiration
                        },
                        {
                            name: "etwListenerExtensionName",
                            value: etwListenerExtensionName,
                            expiration: expiration
                        },
                        {
                            name: "etwListenerExtensionState",
                            value: etwListenerExtensionState,
                            expiration: expiration
                        },
                        {
                            name: "etwListenerExtensionVersion",
                            value: etwListenerExtensionVersion,
                            expiration: expiration
                        },
                        {
                            name: "etwEncryptionKey",
                            value: etwEncryptionKey,
                            expiration: expiration
                        },
                        {
                            name: "etwEncryptionIV",
                            value: etwEncryptionIV,
                            expiration: expiration
                        }
                    ];
                    return _this._host.executeOperation(AzureVirtualMachineV2Actions.getEtwListenerVMExtVersionNamespace)
                        .then(function (targetVersion) {
                        // set hasEtwListenerExtension attribute
                        attributes.push({
                            name: "hasEtwListenerExtension",
                            value: targetVersion === etwListenerExtensionVersion,
                            expiration: expiration
                        });
                        return { results: attributes };
                    });
                });
            };
            this.getApplicationInsightsAttributes = function (args) {
                if (args === void 0) { args = null; }
                var subscription = JSON.parse(args.subscription);
                var url = AzureVirtualMachineV2AttributeLoader._findApplicationInsightsUriTemplate.expand({
                    apiVersion: args.apiVersion,
                    managementEndpoint: subscription.managementEndpoint,
                    subscriptionId: subscription.id
                });
                return _this._azureConnection.webRequest(url.toString(), subscription, "GET")
                    .then(function (response) {
                    var appInsightsArray = JSON.parse(response).value;
                    var publicConfig = JSON.parse(args.diagnosticsExtensionSettings);
                    var diagnosticsAppInsightsId = null;
                    var instrumentationKey = null;
                    // Find the instrumentation key
                    if (publicConfig.WadCfg && publicConfig.WadCfg.SinksConfig && publicConfig.WadCfg.SinksConfig.Sink) {
                        var appInsightSink = underscore.find(publicConfig.WadCfg.SinksConfig.Sink, function (sink) {
                            return sink.ApplicationInsights;
                        });
                        instrumentationKey = appInsightSink ? appInsightSink.ApplicationInsights : null;
                    }
                    else if (publicConfig.xmlCfg) {
                        var xmlConfig = atob(publicConfig.xmlCfg);
                        var parsedXmlConfig = new DOMParser().parseFromString(xmlConfig, "text/xml");
                        var appInsightElement = parsedXmlConfig.getElementsByTagName("ApplicationInsights")[0];
                        instrumentationKey = appInsightElement ? appInsightElement.textContent : null;
                    }
                    // Find the application insights that matches the instrumentation key
                    if (instrumentationKey) {
                        var appInsights = underscore.find(appInsightsArray, function (appInsights) {
                            return appInsights.properties.InstrumentationKey === instrumentationKey;
                        });
                        diagnosticsAppInsightsId = appInsights ? appInsights.id : null;
                    }
                    var attributes = [
                        {
                            name: "diagnosticsAppInsightsId",
                            value: diagnosticsAppInsightsId,
                            expiration: Date.now() + 10000
                        }
                    ];
                    return { results: attributes };
                });
            };
            this.getNetworkInterfaceAttribute = function (args) {
                if (args === void 0) { args = null; }
                return _this._attributeLoaderHelper.getRequest(AzureVirtualMachineV2AttributeLoader._networkInterfaceUriTemplate, args)
                    .then(function (resource) {
                    return {
                        results: [
                            {
                                name: "networkInterface",
                                value: resource,
                                expiration: Date.now() + 10000
                            }
                        ]
                    };
                });
            };
            this.getLoadBalancerAttribute = function (args) {
                if (args === void 0) { args = null; }
                var ipConfigurations = args.networkInterface.properties.ipConfigurations;
                // If the network interface already have an public IP address, then we don't care whether it's associated with a load balancer.
                if (ipConfigurations.some(function (ipConfiguration) { return ipConfiguration.properties.publicIPAddress; })) {
                    return Promise.resolve({
                        results: [
                            {
                                name: "loadBalancer",
                                value: null,
                                expiration: Date.now() + 10000
                            }
                        ]
                    });
                }
                var subscription = JSON.parse(args.subscription);
                var url = AzureVirtualMachineV2AttributeLoader._findLoadBalancerUriTemplate.expand({
                    apiVersion: args.apiVersion,
                    managementEndpoint: subscription.managementEndpoint,
                    subscriptionId: subscription.id
                });
                return _this._azureConnection.webRequest(url.toString(), subscription, "GET")
                    .then(function (response) {
                    // Get all backend address pools configured for the network interface
                    var networkInterfaceBackendAddressPools = [];
                    ipConfigurations.forEach(function (ipConfiguration) {
                        if (ipConfiguration.properties.loadBalancerBackendAddressPools) {
                            ipConfiguration.properties.loadBalancerBackendAddressPools.forEach(function (loadBalancerBackendAddressPool) {
                                networkInterfaceBackendAddressPools.push(loadBalancerBackendAddressPool.id);
                            });
                        }
                    });
                    // Find the associated load balancer, which has the backend address pool configured for the network interface
                    var loadBalancers = JSON.parse(response).value;
                    var associatedLoadBalancer = underscore.find(loadBalancers, function (loadBalancer) {
                        var backendAddressPools = loadBalancer.properties.backendAddressPools;
                        return backendAddressPools && backendAddressPools.some(function (backendAddressPool) {
                            return networkInterfaceBackendAddressPools.indexOf(backendAddressPool.id) >= 0;
                        });
                    });
                    if (associatedLoadBalancer) {
                        return {
                            results: [
                                {
                                    name: "loadBalancer",
                                    value: associatedLoadBalancer,
                                    expiration: Date.now() + 10000
                                }
                            ]
                        };
                    }
                    else {
                        return {
                            results: [],
                            error: new Error("Could not find Load Balancer associated with the Network Interface.")
                        };
                    }
                });
            };
            this.getNetworkSecurityGroupAttribute = function (args) {
                if (args === void 0) { args = null; }
                var networkInterface = args.networkInterface;
                var subscription = JSON.parse(args.subscription);
                var url = AzureVirtualMachineV2AttributeLoader._findNetworkSecurityGroupUriTemplate.expand({
                    apiVersion: args.apiVersion,
                    managementEndpoint: subscription.managementEndpoint,
                    subscriptionId: subscription.id
                });
                return _this._azureConnection.webRequest(url.toString(), subscription, "GET").then(function (response) {
                    // TODO: Network security group can be applied to either VM or subnet, and in some cases both.
                    // For simplicity, we just handle the VM case for now. Since if user create VM from portal,
                    // network security group is created for VM by default, which will block remote debugging.
                    var networkSecurityGroups = JSON.parse(response).value;
                    var associatedNetworkSecurityGroup = underscore.find(networkSecurityGroups, function (networkSecurityGroup) {
                        return networkSecurityGroup.properties &&
                            networkSecurityGroup.properties.networkInterfaces &&
                            networkSecurityGroup.properties.networkInterfaces.some(function (ni) {
                                return ni.id === networkInterface.id;
                            });
                    });
                    return {
                        results: [
                            {
                                name: "networkSecurityGroup",
                                value: associatedNetworkSecurityGroup,
                                expiration: Date.now() + 10000
                            }
                        ]
                    };
                });
            };
            this.getIpAddressAttribute = function (args) {
                if (args === void 0) { args = null; }
                var loadBalancer = args.loadBalancer;
                var networkInterfaceIPConfigurations = args.networkInterface.properties.ipConfigurations;
                // Try to find an ip configuration with public IP address from network interface
                var ipConfigurationWithPublicIpAddress = underscore.find(networkInterfaceIPConfigurations, function (ipConfiguration) {
                    return ipConfiguration.properties.publicIPAddress;
                });
                // If can't find one in network interface, then try to find one in load balancer
                if (!ipConfigurationWithPublicIpAddress && loadBalancer && loadBalancer.properties.frontendIPConfigurations) {
                    var loadBalancerIPConfigurations = loadBalancer.properties.frontendIPConfigurations;
                    // TODO: For simplicity, we just pick the first available IP address here.
                    // While a load balancer can have multiple frontend IPs. It's possible some IP address can't route to certain VMs.
                    ipConfigurationWithPublicIpAddress = underscore.find(loadBalancerIPConfigurations, function (ipConfiguration) {
                        return ipConfiguration.properties.publicIPAddress;
                    });
                }
                var publicIpAddressId = ipConfigurationWithPublicIpAddress
                    ? ipConfigurationWithPublicIpAddress.properties.publicIPAddress.id
                    : null;
                if (publicIpAddressId) {
                    var subscription = JSON.parse(args.subscription);
                    var url = AzureVirtualMachineV2AttributeLoader._resourceUriTemplate.expand({
                        apiVersion: args.apiVersion,
                        managementEndpoint: subscription.managementEndpoint,
                        resourceId: publicIpAddressId
                    });
                    return _this._azureConnection.webRequest(url.toString(), subscription, "GET")
                        .then(function (response) {
                        var parsedResponse = JSON.parse(response);
                        var publicIpAddress = parsedResponse ? parsedResponse.properties.ipAddress : null;
                        if (publicIpAddress) {
                            return {
                                results: [
                                    {
                                        name: "publicIpAddress",
                                        value: publicIpAddress,
                                        expiration: Date.now() + 10000
                                    }
                                ]
                            };
                        }
                        else {
                            return {
                                results: [],
                                error: new Error("Could not find Public IP Address.")
                            };
                        }
                    });
                }
                else {
                    return Promise.resolve({
                        results: [],
                        error: new Error("Could not find Public IP Address Id.")
                    });
                }
            };
            this.getStateAttributes = function (args) {
                if (args === void 0) { args = null; }
                return _this._attributeLoaderHelper.getRequest(AzureVirtualMachineV2AttributeLoader._virtualMachineInstanceViewUriTemplate, args)
                    .then(function (resource) {
                    var powerState = "unknown";
                    var stopped;
                    var running;
                    var starting;
                    var stopping;
                    var hasDiagnosticsExtension;
                    var hasCompatibleDebuggingExtension;
                    if (resource.extensions) {
                        resource.extensions.forEach(function (extension) {
                            var splitVersion = extension.typeHandlerVersion ? extension.typeHandlerVersion.split(".") : [];
                            if (extension.type === "Microsoft.Azure.Diagnostics.IaaSDiagnostics") {
                                hasDiagnosticsExtension = true;
                            }
                            else if (extension.type === "Microsoft.VisualStudio.Azure.RemoteDebug.VSRemoteDebugger"
                                && splitVersion[0] === "1") {
                                hasCompatibleDebuggingExtension = true;
                            }
                        });
                    }
                    var isUpdating = false;
                    resource.statuses.forEach(function (status) {
                        var splitCode = status.code.split("/");
                        if (splitCode.length > 1) {
                            var state = splitCode[1].toLowerCase();
                            if (splitCode[0] === "PowerState") {
                                powerState = state;
                            }
                            else if (splitCode[0] === "ProvisioningState" && state !== "succeeded" && state !== "failed") {
                                isUpdating = true;
                            }
                        }
                    });
                    var isLoadBalancerBusy = false;
                    if (args.loadBalancer) {
                        isLoadBalancerBusy = AzureVirtualMachineV2Actions.isLoadBalancerBusy(args.loadBalancer.id);
                    }
                    var expirationDelay = 1000;
                    switch (powerState) {
                        case "stopped":
                            stopped = true;
                            break;
                        case "starting":
                            starting = true;
                            expirationDelay = 500;
                            break;
                        case "running":
                            running = true;
                            break;
                        case "stopping":
                            stopping = true;
                            expirationDelay = 500;
                            break;
                    }
                    var expiration = Date.now() + expirationDelay;
                    var attributes = [
                        {
                            name: "state",
                            value: powerState,
                            expiration: expiration
                        },
                        {
                            name: "running",
                            value: running,
                            expiration: expiration
                        },
                        {
                            name: "starting",
                            value: starting,
                            expiration: expiration
                        },
                        {
                            name: "stopping",
                            value: stopping,
                            expiration: expiration
                        },
                        {
                            name: "stopped",
                            value: stopped,
                            expiration: expiration
                        },
                        {
                            name: "updating",
                            value: isUpdating,
                            expiration: expiration
                        },
                        {
                            name: "isEnablingRemoteDebug",
                            value: AzureVirtualMachineV2Actions.isVMEnablingRemoteDebug(args.id),
                            expiration: expiration
                        },
                        {
                            name: "isDisablingRemoteDebug",
                            value: AzureVirtualMachineV2Actions.isVMDisablingRemoteDebug(args.id),
                            expiration: expiration
                        },
                        {
                            name: "isConfiguringEtwListener",
                            value: AzureVirtualMachineV2Actions.isVMConfiguringEtwListener(args.id),
                            expiration: expiration
                        },
                        {
                            name: "isLoadBalancerBusy",
                            value: isLoadBalancerBusy,
                            expiration: expiration
                        },
                        {
                            name: "hasCompatibleDebuggingExtension",
                            value: hasCompatibleDebuggingExtension,
                            expiration: expiration
                        },
                        {
                            name: "hasDiagnosticsExtension",
                            value: hasDiagnosticsExtension,
                            expiration: expiration
                        }
                    ];
                    return { results: attributes };
                });
            };
            this.getIsEtwFeatureOnAttribute = function (args) {
                if (args === void 0) { args = null; }
                return _this._host.executeOperation(AzureVirtualMachineV2AttributeLoader._getFeatureSwitchHostNamespace, ["ServiceFabric.Etw"])
                    .then(function (result) {
                    return { results: [{ name: "isEtwFeatureOn", value: result }] }; // Disable etw feature for VM and VMSS, until we finish migrate client UI from fabric tools to common component.
                });
            };
            this.getEtwListenerPortAttribute = function (args) {
                var networkInterface = args.networkInterface;
                var loadBalancer = args.loadBalancer;
                // identify the outgoing nat rule that is tied to the given network interface (VM) and the target port is 810 (etw listenerport)
                // example: networkInterface.id = /subscriptions/ebf670f2-712b-460a-9fec-bbbbbbbbbbbb/resourceGroups/LBtest2/providers
                //                                      /Microsoft.Network/networkInterfaces/NIC-testvm2-0-0
                //    backendIPConfiguration.id = /subscriptions/ebf670f2-712b-460a-9fec-bbbbbbbbbbbb/resourceGroups/LBtest2/providers
                //                                      /Microsoft.Network/networkInterfaces/NIC-testvm2-0-0/ipConfigurations/IPConfig
                var etwListenerPort = null;
                if (loadBalancer == null) {
                    etwListenerPort = AzureVirtualMachineV2Actions.defaultEtwListenerPorts.etwListenerPort;
                }
                else {
                    var prefix = networkInterface.id + "/ipConfigurations";
                    var inboundNatRule = loadBalancer.properties.inboundNatRules;
                    var thisVMRule = underscore.find(inboundNatRule, function (natRule) {
                        return natRule.properties.backendPort === AzureVirtualMachineV2Actions.defaultEtwListenerPorts.etwListenerPort &&
                            natRule.properties.backendIPConfiguration !== undefined &&
                            natRule.properties.backendIPConfiguration.id.substring(0, prefix.length) === prefix;
                    });
                    if (thisVMRule) {
                        etwListenerPort = thisVMRule.properties.frontendPort;
                    }
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
            this._azureConnection = azureConnection;
            this._attributeLoaderHelper = new AttributeLoaderHelper(azureConnection);
            this._host = host;
        }
        return AzureVirtualMachineV2AttributeLoader;
    }());
    AzureVirtualMachineV2AttributeLoader.getAllAttributesNamespace = "Azure.Attributes.VirtualMachineV2.GetAttributes";
    AzureVirtualMachineV2AttributeLoader.getApplicationInsightsAttributesNamespace = "Azure.Attributes.VirtualMachineV2.GetApplicationInsightsAttributes";
    AzureVirtualMachineV2AttributeLoader.getIpAddressAttribute = "Azure.Attributes.VirtualMachineV2.GetIpAddressAttribute";
    AzureVirtualMachineV2AttributeLoader.getStateAttributesNamespace = "Azure.Attributes.VirtualMachineV2.GetStateAttributes";
    AzureVirtualMachineV2AttributeLoader.getNetworkInterfaceAttributeNamespace = "Azure.Attributes.VirtualMachineV2.GetNetworkInterfaceAttribute";
    AzureVirtualMachineV2AttributeLoader.getLoadBalancerAttributeNamespace = "Azure.Attributes.VirtualMachineV2.GetLoadBalancerAttribute";
    AzureVirtualMachineV2AttributeLoader.getNetworkSecurityGroupAttributeNamespace = "Azure.Attributes.VirtualMachineV2.GetNetworkSecurityGroupAttribute";
    AzureVirtualMachineV2AttributeLoader.getIsEtwFeatureOnAttributeNamespace = "Azure.Attributes.VirtualMachineV2.GetIsEtwFeatureOnAttribute";
    AzureVirtualMachineV2AttributeLoader.getEtwListenerPortAttributeNamespace = "Azure.Attributes.VirtualMachineV2.GetEtwListenerPort";
    AzureVirtualMachineV2AttributeLoader._getFeatureSwitchHostNamespace = "AzureFabric.getFeatureSwitch";
    AzureVirtualMachineV2AttributeLoader._resourceUriTemplateString = "{+managementEndpoint}/{+resourceId}/?api-version={+apiVersion}";
    AzureVirtualMachineV2AttributeLoader._resourceUriTemplate = URITemplate(AzureVirtualMachineV2AttributeLoader._resourceUriTemplateString);
    AzureVirtualMachineV2AttributeLoader._networkInterfaceUriTemplate = URITemplate(AzureVirtualMachineV2AttributeLoader._resourceUriTemplateString);
    AzureVirtualMachineV2AttributeLoader._virtualMachineInstanceViewUriTemplate = URITemplate("{+managementEndpoint}/{+resourceId}/InstanceView/?api-version={+apiVersion}");
    AzureVirtualMachineV2AttributeLoader._findApplicationInsightsUriTemplate = URITemplate("{+managementEndpoint}/subscriptions/{+subscriptionId}/providers/microsoft.insights/components?api-version={+apiVersion}");
    AzureVirtualMachineV2AttributeLoader._findLoadBalancerUriTemplate = URITemplate("{+managementEndpoint}/subscriptions/{+subscriptionId}/providers/Microsoft.Network/loadBalancers?api-version={+apiVersion}");
    AzureVirtualMachineV2AttributeLoader._findNetworkSecurityGroupUriTemplate = URITemplate("{+managementEndpoint}/" +
        "subscriptions/{+subscriptionId}/providers/Microsoft.Network/networkSecurityGroups?api-version={+apiVersion}");
    return AzureVirtualMachineV2AttributeLoader;
});
