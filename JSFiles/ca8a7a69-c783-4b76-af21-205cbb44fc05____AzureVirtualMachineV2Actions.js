/*!---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *----------------------------------------------------------*/
define(["require", "exports", "es6-promise", "underscore", "Providers/Common/AzureConstants", "Providers/Azure/Loaders/AttributeLoaderHelper", "Providers/Common/PollingWebRequestParameters", "Providers/Azure/Resources/AzureResources", "URIjs/URITemplate", "underscore.string"], function (require, exports, rsvp, underscore, AzureConstants, AttributeLoaderHelper, PollingWebRequestParameters, AzureResources, URITemplate, _string) {
    "use strict";
    var Promise = rsvp.Promise;
    /**
     * Actions exposed by the Azure Cloud Explorer plugin.
     */
    var AzureVirtualMachineV2Actions = (function () {
        function AzureVirtualMachineV2Actions(azureConnection, host) {
            var _this = this;
            /**
             * Registers actionbindings on the given actionBindingManager
             */
            this.registerBindings = function (actionBindingManager) {
                actionBindingManager.addActionBinding(AzureVirtualMachineV2Actions.enableDiagnosticsNamespace, _this.enableDiagnostics);
                actionBindingManager.addActionBinding(AzureVirtualMachineV2Actions.updateDiagnosticsNamespace, _this.updateDiagnostics);
                actionBindingManager.addActionBinding(AzureVirtualMachineV2Actions.attatchDebuggerNamespace, _this.attatchDebugger);
                actionBindingManager.addActionBinding(AzureVirtualMachineV2Actions.viewDiagnosticsNamespace, _this.viewDiagnostics);
                actionBindingManager.addActionBinding(AzureVirtualMachineV2Actions.enableDebuggingNamespace, _this.enableDebugging);
                actionBindingManager.addActionBinding(AzureVirtualMachineV2Actions.disableDebuggingNamespace, _this.disableDebugging);
                actionBindingManager.addActionBinding(AzureVirtualMachineV2Actions.enableEtwListenerNamespace, _this.enableEtwListener);
                actionBindingManager.addActionBinding(AzureVirtualMachineV2Actions.disableEtwListenerNamespace, _this.disableEtwListener);
                actionBindingManager.addActionBinding(AzureVirtualMachineV2Actions.createEtwListenerWindowNamespace, _this.createEtwListenerWindow);
            };
            this.enableDiagnostics = function (args) {
                var location = args.location;
                var subscription = JSON.parse(args.subscription);
                var extensionName = AzureConstants.diagnosticsExtension.defaultName;
                var url = AzureVirtualMachineV2Actions._enableExtensionUriTemplate.expand({
                    apiVersion: args.apiVersion,
                    extensionName: extensionName,
                    managementEndpoint: subscription.managementEndpoint,
                    resourceId: args.id
                });
                return _this._host.executeOperation(AzureVirtualMachineV2Actions._getInitialDiagnosticsConfig, [{ instanceName: args.name }])
                    .then(function (diagnosticsConfig) {
                    if (diagnosticsConfig && diagnosticsConfig.publicConfig) {
                        _this.AutoFillMetricsResourceId(diagnosticsConfig, args.id);
                        var diagnosticsConfiguration = _this.generateDiagnosticsConfig(diagnosticsConfig.publicConfig, diagnosticsConfig.privateConfig, extensionName, location);
                        var parameters = new PollingWebRequestParameters();
                        parameters.url = url.toString();
                        parameters.subscription = subscription;
                        parameters.method = "PUT";
                        parameters.body = JSON.stringify(diagnosticsConfiguration);
                        parameters.statusType = args.polling.statusType;
                        parameters.initialStatusText = args.polling.initialStatusType;
                        parameters.timeOutInSeconds = args.polling.timeOutInSeconds;
                        return _this._azureConnection.pollingWebRequest(parameters);
                    }
                    else {
                        // Configuration dialog was canceled.
                        return Promise.resolve();
                    }
                }).then(null, function () {
                    // TODO bubble up error
                    return Promise.resolve();
                });
            };
            this.enableDebugging = function (args) {
                var resourceGroup = args.resourceGroup;
                var location = args.location;
                var apiVersion = args.apiVersion;
                var subscription = JSON.parse(args.subscription);
                var updatedKeyVault;
                var debugCertInfo;
                // Set VM and load balancer to busy. So user can't enable debugging when they are in busy state.
                if (underscore.contains(AzureVirtualMachineV2Actions._vmsEnablingRemoteDebug, args.id)) {
                    return Promise.reject({ message: "Already started to enable debugging." }); // Localize
                }
                AzureVirtualMachineV2Actions._vmsEnablingRemoteDebug.push(args.id);
                if (args.loadBalancer) {
                    if (underscore.contains(AzureVirtualMachineV2Actions._loadBalancersBusyUpdating, args.loadBalancer.id)) {
                        return Promise.reject({ message: "Can't enable debugging. The load balancer is currently busy updating." }); // Localize
                    }
                    AzureVirtualMachineV2Actions._loadBalancersBusyUpdating.push(args.loadBalancer.id);
                }
                // Start enabling process
                return _this.ensurePortConfigured(args.networkSecurityGroup, args.loadBalancer, args.networkInterface, subscription, args, AzureVirtualMachineV2Actions.defaultDebuggingPorts)
                    .then(function () {
                    return _this.getOrCreateKeyVault(subscription, resourceGroup, location);
                })
                    .then(function (keyVault) {
                    return _this.ensureKeyVaultPermissions(subscription, keyVault);
                })
                    .then(function (keyVault) {
                    updatedKeyVault = keyVault;
                    return _this.getVmDebugCertificateInformation(args.name);
                })
                    .then(function (info) {
                    debugCertInfo = info;
                    return _this.createOrUpdateSecret(subscription, args.name, updatedKeyVault.name, updatedKeyVault.properties.vaultUri, debugCertInfo.serverCertificateForKeyVault);
                })
                    .then(function (secretId) {
                    return _this.ensureCertificateIsInstalled(subscription, args.id, updatedKeyVault.id, secretId, apiVersion);
                })
                    .then(function () {
                    return _this.installDebuggingExtension(subscription, args.id, apiVersion, location, debugCertInfo.clientCertificateThumbprint, debugCertInfo.serverCertificateThumbprint, args.pollingExtension);
                })
                    .then(function () {
                    return Promise.resolve(null);
                }, function (err) {
                    // catch
                    return Promise.resolve(err);
                })
                    .then(function (err) {
                    // Pretend this to be the finally block, so we don't need to duplicate the clean up code
                    AzureVirtualMachineV2Actions._vmsEnablingRemoteDebug = underscore.without(AzureVirtualMachineV2Actions._vmsEnablingRemoteDebug, args.id);
                    if (args.loadBalancer) {
                        AzureVirtualMachineV2Actions._loadBalancersBusyUpdating = underscore.without(AzureVirtualMachineV2Actions._loadBalancersBusyUpdating, args.loadBalancer.id);
                    }
                    if (err) {
                        return Promise.reject(err);
                    }
                });
            };
            this.enableEtwListener = function (args) {
                var subscription = JSON.parse(args.subscription);
                // Set VM and load balancer to busy. So user can't configure etw listener when they are in busy state.
                if (underscore.contains(AzureVirtualMachineV2Actions._vmsConfiguringEtwListener, args.id)) {
                    return Promise.reject({ message: "Already started to configure etw listener." }); // Localize
                }
                if (args.loadBalancer) {
                    if (underscore.contains(AzureVirtualMachineV2Actions._loadBalancersBusyUpdating, args.loadBalancer.id)) {
                        return Promise.reject({ message: "Can't enable etw listener. The load balancer is currently busy updating." }); // Localize
                    }
                    AzureVirtualMachineV2Actions._loadBalancersBusyUpdating.push(args.loadBalancer.id);
                }
                AzureVirtualMachineV2Actions._vmsConfiguringEtwListener.push(args.id);
                return _this.ensurePortConfigured(args.networkSecurityGroup, args.loadBalancer, args.networkInterface, subscription, args, AzureVirtualMachineV2Actions.defaultEtwListenerPorts)
                    .then(function () {
                    return _this._host.executeOperation(AzureVirtualMachineV2Actions.getEtwListenerVMExtVersionNamespace);
                })
                    .then(function (targetVersion) {
                    return _this._host.executeOperation("AzureFabric.generateEncryptionKey").then(function (encryptionKeyInfo) {
                        if (!AttributeLoaderHelper.isInstalledState(args.etwListenerExtensionState)
                            || args.etwListenerExtensionVersion !== targetVersion) {
                            return _this._host.resolveResource(AzureResources.commonNamespace, "Actions.VirtualMachinesV2.CheckEtwListenerVersion.Message")
                                .then(function (message) {
                                return _this.checkEtwListenerVersionPrompt(args.etwListenerExtensionVersion, targetVersion, _string.sprintf(message, args.name))
                                    .then(function (result) {
                                    if (result) {
                                        return _this.installEtwListenerExtension(subscription, args.id, args.apiVersion, args.location, encryptionKeyInfo.Key, encryptionKeyInfo.IV, args.pollingExtension);
                                    }
                                });
                            });
                        }
                        return Promise.resolve();
                    });
                })
                    .then(function () {
                    return Promise.resolve(null);
                }, function (err) {
                    return Promise.resolve(err);
                })
                    .then(function (err) {
                    // Pretend this to be the finally block, so we don't need to duplicate the clean up code
                    AzureVirtualMachineV2Actions._vmsConfiguringEtwListener = underscore.without(AzureVirtualMachineV2Actions._vmsConfiguringEtwListener, args.id);
                    if (args.loadBalancer) {
                        AzureVirtualMachineV2Actions._loadBalancersBusyUpdating = underscore.without(AzureVirtualMachineV2Actions._loadBalancersBusyUpdating, args.loadBalancer.id);
                    }
                    return err ? Promise.reject(err) : Promise.resolve();
                });
            };
            this.disableEtwListener = function (args) {
                var networkSecurityGroup = args.networkSecurityGroup;
                var loadBalancer = args.loadBalancer;
                var networkInterface = args.networkInterface;
                var etwListenerExtensionId = args.etwListenerExtensionId;
                var pollingExtension = args.pollingExtension;
                var pollingNetworkSecurityGroup = args.pollingNetworkSecurityGroup;
                var apiVersion = args.apiVersion;
                var subscriptionString = args.subscription;
                var subscription = JSON.parse(subscriptionString);
                // Set VM and load balancer to busy. So user can't configure etw listener when they are in busy state.
                if (underscore.contains(AzureVirtualMachineV2Actions._vmsConfiguringEtwListener, args.id)) {
                    return Promise.reject({ message: "Already started to configure etw listener." }); // Localize
                }
                if (args.loadBalancer) {
                    if (underscore.contains(AzureVirtualMachineV2Actions._loadBalancersBusyUpdating, args.loadBalancer.id)) {
                        return Promise.reject({ message: "Can't disable etw listener. The load balancer is currently busy updating." }); // Localize
                    }
                    AzureVirtualMachineV2Actions._loadBalancersBusyUpdating.push(args.loadBalancer.id);
                }
                AzureVirtualMachineV2Actions._vmsConfiguringEtwListener.push(args.id);
                // Start disabling process
                return _this.uninstallVMExtension(etwListenerExtensionId, subscription, apiVersion, pollingExtension)
                    .then(function () {
                    _this.removeNetworkSecurityGroupRules(networkSecurityGroup, networkInterface, subscription, apiVersion, pollingNetworkSecurityGroup, AzureVirtualMachineV2Actions.defaultEtwListenerPorts, AzureVirtualMachineV2Actions.etwListenerExtension)
                        .then(function () {
                        return _this.removeLoadBalancerNetworkInterfaceRules(loadBalancer, networkInterface, subscription, apiVersion, AzureVirtualMachineV2Actions.defaultEtwListenerPorts);
                    })
                        .then(function () {
                        return Promise.resolve(null);
                    }, function (err) {
                        // catch
                        return Promise.resolve(err);
                    })
                        .then(function (err) {
                        // Pretend this to be the finally block, so we don't need to duplicate the clean up code
                        AzureVirtualMachineV2Actions._vmsConfiguringEtwListener = underscore.without(AzureVirtualMachineV2Actions._vmsConfiguringEtwListener, args.id);
                        if (args.loadBalancer) {
                            AzureVirtualMachineV2Actions._loadBalancersBusyUpdating = underscore.without(AzureVirtualMachineV2Actions._loadBalancersBusyUpdating, args.loadBalancer.id);
                        }
                        return err ? Promise.reject(err) : Promise.resolve();
                    });
                });
            };
            this.createEtwListenerWindow = function (args) {
                var subscriptionId = null;
                if (args.subscription != null) {
                    var subscriptionString = args.subscription;
                    var subscription = JSON.parse(subscriptionString);
                    subscriptionId = subscription.id;
                }
                var etwListenerInfo = {
                    Title: args.name,
                    IPAddress: args.ipAddress,
                    Port: args.port,
                    EncryptionKey: args.encryptionKey,
                    EncryptionIV: args.encryptionIV,
                    SubscriptionId: subscriptionId,
                    IsLocal: false
                };
                return _this._host.executeOperation(AzureVirtualMachineV2Actions.createEtwListenerWindowHostNamespace, [etwListenerInfo]);
            };
            this.installDebuggingExtension = function (subscription, vmId, apiVersion, location, clientCertificateThumbprint, serverCertificateThumbprint, pollingParameter) {
                var extensionName = "Microsoft.VisualStudio.Azure.RemoteDebug.VSRemoteDebugger";
                var url = AzureVirtualMachineV2Actions._enableExtensionUriTemplate.expand({
                    apiVersion: apiVersion,
                    extensionName: extensionName,
                    managementEndpoint: subscription.managementEndpoint,
                    resourceId: vmId
                });
                var extension = {
                    properties: {
                        publisher: AzureConstants.RemoteDebugging.RemoteDebuggingExtensionPublisher,
                        type: AzureConstants.RemoteDebugging.RemoteDebuggingExtensionType,
                        typeHandlerVersion: AzureVirtualMachineV2Actions.debuggingExtensionVersion,
                        settings: {
                            clientThumbprint: clientCertificateThumbprint,
                            serverThumbprint: serverCertificateThumbprint,
                            connectorPort: AzureVirtualMachineV2Actions.defaultDebuggingPorts.connectorPort,
                            fileUploadPort: AzureVirtualMachineV2Actions.defaultDebuggingPorts.fileUploadPort,
                            forwarderPort: AzureVirtualMachineV2Actions.defaultDebuggingPorts.forwarderPort,
                            forwarderPortx86: AzureVirtualMachineV2Actions.defaultDebuggingPorts.forwarderPortx86
                        }
                    },
                    name: extensionName,
                    type: "Microsoft.Compute/virtualMachines/extensions",
                    location: location,
                    tags: {}
                };
                var parameters = new PollingWebRequestParameters();
                parameters.url = url.toString();
                parameters.subscription = subscription;
                parameters.method = "PUT";
                parameters.body = JSON.stringify(extension);
                parameters.statusType = pollingParameter.statusType;
                parameters.initialStatusText = pollingParameter.initialStatusType;
                parameters.timeOutInSeconds = pollingParameter.timeOutInSeconds;
                return _this._azureConnection.pollingWebRequest(parameters);
            };
            this.installEtwListenerExtension = function (subscription, vmId, apiVersion, location, encryptionKey, encryptionIV, pollingParameter) {
                var extensionName = AzureConstants.ServiceFabric.EtwListenerExtensionType;
                var url = AzureVirtualMachineV2Actions._enableExtensionUriTemplate.expand({
                    managementEndpoint: subscription.managementEndpoint,
                    extensionName: extensionName,
                    resourceId: vmId,
                    apiVersion: apiVersion
                });
                return _this._host.executeOperation(AzureVirtualMachineV2Actions.getEtwListenerVMExtVersionNamespace).then(function (targetVersion) {
                    var extension = {
                        properties: {
                            publisher: AzureConstants.ServiceFabric.EtwListenerExtensionPublisher,
                            type: AzureConstants.ServiceFabric.EtwListenerExtensionType,
                            typeHandlerVersion: targetVersion,
                            settings: {
                                EtwEncryptionKey: {
                                    Key: encryptionKey,
                                    IV: encryptionIV
                                }
                            }
                        },
                        name: extensionName,
                        location: location,
                        tags: {}
                    };
                    var parameters = new PollingWebRequestParameters();
                    parameters.url = url.toString();
                    parameters.subscription = subscription;
                    parameters.method = "PUT";
                    parameters.body = JSON.stringify(extension);
                    parameters.statusType = pollingParameter.statusType;
                    parameters.initialStatusText = pollingParameter.initialStatusType;
                    parameters.timeOutInSeconds = pollingParameter.timeOutInSeconds;
                    return _this._azureConnection.pollingWebRequest(parameters);
                });
            };
            this.ensureCertificateIsInstalled = function (subscription, vmId, vaultId, secretId, apiVersion) {
                // this check could be moved to Attribute Loader that makes the same call.
                var url = AzureVirtualMachineV2Actions._resourceUriTemplate.expand({
                    apiVersion: apiVersion,
                    managementEndpoint: subscription.managementEndpoint,
                    resourceId: vmId
                });
                return _this._azureConnection.webRequest(url.toString(), subscription, "GET").then(function (response) {
                    var resource = JSON.parse(response);
                    // check that it isn't already installed.
                    var secretAlreadyExists = false;
                    var vaultAlreadyExisted = false;
                    var vaultIndex = null;
                    if (resource.properties.osProfile.secrets) {
                        resource.properties.osProfile.secrets.some(function (secret, secretIndex) {
                            if (secret.sourceVault.id === vaultId) {
                                vaultAlreadyExisted = true;
                                vaultIndex = secretIndex;
                                if (secret.vaultCertificates) {
                                    secret.vaultCertificates.some(function (vaultCertificate) {
                                        if (vaultCertificate.certificateUrl === secretId) {
                                            secretAlreadyExists = vaultCertificate.certificateUrl === secretId;
                                        }
                                        return secretAlreadyExists;
                                    });
                                }
                            }
                            return secretAlreadyExists || vaultAlreadyExisted;
                        });
                    }
                    if (!secretAlreadyExists) {
                        var updatedResource = {};
                        updatedResource.properties = resource.properties;
                        updatedResource.name = resource.name;
                        updatedResource.location = resource.location;
                        updatedResource.tags = resource.tags;
                        if (!updatedResource.properties.osProfile.secrets) {
                            updatedResource.properties.osProfile.secrets = [];
                        }
                        if (vaultAlreadyExisted) {
                            updatedResource.properties.osProfile.secrets[vaultIndex].vaultCertificates = [
                                {
                                    certificateUrl: secretId,
                                    certificateStore: "My"
                                }
                            ];
                        }
                        else {
                            updatedResource.properties.osProfile.secrets.push({
                                sourceVault: {
                                    id: vaultId
                                },
                                vaultCertificates: [{
                                        certificateUrl: secretId,
                                        certificateStore: "My"
                                    }]
                            });
                        }
                        return _this._azureConnection.webRequest(url.toString(), subscription, "PUT", null, JSON.stringify(updatedResource));
                    }
                });
            };
            this.createOrUpdateSecret = function (subscription, vmName, vaultName, keyVaultUri, secretValue) {
                var certName = AzureVirtualMachineV2Actions.remoteDebuggerCertPrefix + vmName;
                // example:- keyVaultUri "https://ravipal-clustervault.vault.azure.net/"
                var domainUrl = keyVaultUri.toLowerCase().replace(vaultName.toLowerCase() + ".", "");
                domainUrl = domainUrl.replace(/\/$/, "");
                var url = AzureVirtualMachineV2Actions._uploadCertUriTemplate.expand({
                    certName: certName,
                    keyVaultUri: keyVaultUri
                });
                var body = JSON.stringify({
                    value: secretValue
                });
                return _this._azureConnection.keyVaultRequest(domainUrl, url.toString(), subscription, "PUT", null, body).then(function (response) {
                    var secret = JSON.parse(response);
                    return secret.id;
                });
            };
            this.ensureKeyVaultPermissions = function (subscription, keyVault) {
                var resourceUrl = AzureVirtualMachineV2Actions._resourceUriTemplate.expand({
                    apiVersion: "2015-06-01",
                    managementEndpoint: subscription.managementEndpoint,
                    resourceId: keyVault.id
                });
                return _this._azureConnection.getAccountUniqueId(subscription).then(function (uniqueId) {
                    return _this._azureConnection.webRequest(resourceUrl.toString(), subscription, "GET").then(function (response) {
                        var keyVault = JSON.parse(response);
                        var hasAccessPolicyForUser = false;
                        var accessPolicyIndex = 0;
                        keyVault.properties.accessPolicies.some(function (accessPolicy, index) {
                            if (accessPolicy.objectId === uniqueId) {
                                hasAccessPolicyForUser = true;
                                accessPolicyIndex = index;
                            }
                            return hasAccessPolicyForUser;
                        });
                        if (hasAccessPolicyForUser) {
                            return keyVault;
                        }
                        else {
                            keyVault.properties.accessPolicies.push({
                                objectId: uniqueId,
                                tenantId: keyVault.properties.tenantId,
                                permissions: {
                                    secrets: [
                                        "all"
                                    ],
                                    keys: []
                                }
                            });
                        }
                        return _this._azureConnection.webRequest(resourceUrl.toString(), subscription, "PUT", null, JSON.stringify(keyVault))
                            .then(function (response) {
                            var updatedKeyVault = JSON.parse(response);
                            return updatedKeyVault;
                        });
                    });
                });
            };
            this.getOrCreateKeyVault = function (subscription, resourceGroup, location) {
                var url = AzureVirtualMachineV2Actions._findKeyVaultUriTemplate.expand({
                    keyVaultPrefix: AzureVirtualMachineV2Actions.azureToolsPrefix,
                    location: location,
                    managementEndpoint: subscription.managementEndpoint,
                    subscriptionId: subscription.id
                });
                return _this._azureConnection.webRequest(url.toString(), subscription, "GET").then(function (response) {
                    var keyVaults = JSON.parse(response).value;
                    var matchingKeyVault;
                    if (keyVaults.length >= 1) {
                        keyVaults.some(function (keyVault) {
                            // Ensure it starts with our prefix. Our request just ensures that it exists in the name.
                            // 'startswith' function for filters isn't implemented yet.
                            if (keyVault.name.indexOf(AzureVirtualMachineV2Actions.azureToolsPrefix) === 0) {
                                matchingKeyVault = keyVault;
                                return true;
                            }
                        });
                    }
                    // If there wasn't a keystore we could use ... create one
                    return matchingKeyVault ? matchingKeyVault : _this.createKeyStore(subscription, resourceGroup, location);
                });
            };
            // Check version, if server version is newer than client, prompt confirmation dialog to ask if force down grade.
            this.checkEtwListenerVersionPrompt = function (serverVersion, clientVersion, promptMessage) {
                if (serverVersion == null) {
                    // if no server version, always install.
                    return Promise.resolve(true);
                }
                var serverVer = AzureVirtualMachineV2Actions.parseVersionString(serverVersion);
                var clientVer = AzureVirtualMachineV2Actions.parseVersionString(clientVersion);
                if (serverVer[0] > clientVer[0] ||
                    (serverVer[0] === clientVer[0] && serverVer[1] > clientVer[1])) {
                    return _this._host.executeOperation(AzureVirtualMachineV2Actions._promptConfirmActionNamespace, [{
                            message: promptMessage,
                            iconType: "query"
                        }]);
                }
                return Promise.resolve(true);
            };
            this.generateUniqueId = function (prefix) {
                var postFix = "";
                // Create 10 random characters 0-9 A-Z
                for (var x = 0; x < 10; x++) {
                    postFix += Math.floor(Math.random() * 36).toString(36);
                }
                return prefix + postFix;
            };
            this.createKeyStore = function (subscription, resourceGroup, location, triedRegisteringKeyStoreProvider) {
                if (triedRegisteringKeyStoreProvider === void 0) { triedRegisteringKeyStoreProvider = false; }
                var createUrl = AzureVirtualMachineV2Actions._createKeyVaultUriTemplate.expand({
                    keyVaultName: _this.generateUniqueId(AzureVirtualMachineV2Actions.azureToolsPrefix),
                    managementEndpoint: subscription.managementEndpoint,
                    resourceGroup: resourceGroup,
                    subscriptionId: subscription.id
                });
                return _this._azureConnection.getAccountUniqueId(subscription).then(function (uniqueId) {
                    var createKeyVaultBody = JSON.stringify({
                        properties: {
                            enabledForDeployment: true,
                            tenantId: subscription.tenantId,
                            accessPolicies: [{
                                    objectId: uniqueId,
                                    tenantId: subscription.tenantId,
                                    permissions: {
                                        secrets: [
                                            "all"
                                        ],
                                        keys: []
                                    }
                                }],
                            sku: {
                                name: "standard",
                                family: "A"
                            }
                        },
                        location: location
                    });
                    return _this._azureConnection.webRequest(createUrl.toString(), subscription, "PUT", null, createKeyVaultBody).then(function (response) {
                        var keyVault = JSON.parse(response);
                        return keyVault;
                    }).then(null, function (error) {
                        if (!triedRegisteringKeyStoreProvider) {
                            var registerUrl = AzureVirtualMachineV2Actions._registerProviderUriTemplate.expand({
                                managementEndpoint: subscription.managementEndpoint,
                                resourceProviderNamespace: "Microsoft.KeyVault",
                                subscriptionId: subscription.id
                            });
                            return _this._azureConnection.webRequest(registerUrl.toString(), subscription, "POST", null, createKeyVaultBody)
                                .then(function (response) {
                                // Registration takes a little time... this will likely fail right after calling it.
                                // Change logic to check if registered ... register ... then spin/wait until vault is ready.
                                return _this.createKeyStore(subscription, resourceGroup, location, true);
                            });
                        }
                        else {
                            return Promise.reject(error);
                        }
                    });
                });
            };
            this.ensurePortConfigured = function (networkSecurityGroup, loadBalancer, networkInterface, subscription, actionArguments, portMap) {
                // Configure network security group
                var promise = Promise.resolve();
                if (networkSecurityGroup) {
                    _this.configNetworkSecurityGroupRules(networkSecurityGroup, portMap);
                    promise = _this.updateNetworkSecurityGroup(networkSecurityGroup, subscription, actionArguments.pollingNetworkSecurityGroup, actionArguments.apiVersion);
                }
                // Configure load balancer and network interface
                return promise.then(function () {
                    // If the network interface is not associated with a load balancer, it should have a public IP address.
                    // We don't need to configure load balancer and network interface in this case.
                    if (!loadBalancer) {
                        return Promise.resolve();
                    }
                    _this.configInboundNatRules(loadBalancer, networkInterface, portMap);
                    return _this.updateLoadBalancer(loadBalancer, subscription, actionArguments.apiVersion, actionArguments.pollingLoadBalancer).then(function () {
                        return _this.updateNetworkInterface(networkInterface, subscription, actionArguments.apiVersion, actionArguments.pollingNetworkInterface);
                    });
                });
            };
            this.configNetworkSecurityGroupRules = function (networkSecurityGroup, portsToEnable) {
                var securityRules = networkSecurityGroup.properties.securityRules || [];
                for (var portName in portsToEnable) {
                    var portNumber = portsToEnable[portName];
                    // Add security rule if the debugging port is filtered out by the network security group
                    if (!_this.isPortAllowedBySecurityGroup(portNumber, networkSecurityGroup)) {
                        if (securityRules.some(function (rule) { return rule.name === portName; })) {
                            portName = _this.generateUniqueId(portName);
                        }
                        var securityRuleToAdd = {
                            name: portName,
                            properties: {
                                destinationPortRange: portNumber.toString(),
                                priority: _this.findAvaiableSecurityRulePriority(1000, networkSecurityGroup),
                                protocol: "Tcp",
                                sourcePortRange: "*",
                                sourceAddressPrefix: "*",
                                destinationAddressPrefix: "*",
                                access: "Allow",
                                direction: "Inbound"
                            }
                        };
                        networkSecurityGroup.properties.securityRules.push(securityRuleToAdd);
                    }
                }
                networkSecurityGroup.properties.securityRules = securityRules;
                return networkSecurityGroup;
            };
            this.isPortAllowedBySecurityGroup = function (portNumber, networkSecurityGroup) {
                // destinationPortRange can be a single port, eg. 80, or port range, eg. 1024-65535
                var securityRules = networkSecurityGroup.properties.securityRules;
                return securityRules.some(function (rule) {
                    var isPortInRange = false;
                    var portRange = rule.properties.destinationPortRange.split("-");
                    isPortInRange = portRange.length === 2 && portNumber >= Number(portRange[0]) && portNumber <= Number(portRange[1]);
                    return rule.properties.access === "Allow"
                        && (portNumber === Number(rule.properties.destinationPortRange) || isPortInRange);
                });
            };
            this.findAvaiableSecurityRulePriority = function (initPriority, networkSecurityGroup) {
                // Each rule needs a unique priority, and the recommended priority gap is 100.
                var securityRules = networkSecurityGroup.properties.securityRules;
                while (securityRules.some(function (rule) { return rule.properties.priority === initPriority; })) {
                    initPriority += 100;
                }
                return initPriority;
            };
            this.updateNetworkSecurityGroup = function (networkSecurityGroup, subscription, pollingParameters, apiVersion) {
                var networkSecurityGroupUrl = AzureVirtualMachineV2Actions._resourceUriTemplate.expand({
                    apiVersion: apiVersion,
                    managementEndpoint: subscription.managementEndpoint,
                    resourceId: networkSecurityGroup.id
                });
                var parameters = new PollingWebRequestParameters();
                parameters.url = networkSecurityGroupUrl.toString();
                parameters.subscription = subscription;
                parameters.method = "PUT";
                parameters.body = JSON.stringify(networkSecurityGroup);
                parameters.statusType = pollingParameters.statusType;
                parameters.initialStatusText = pollingParameters.initialStatusType;
                parameters.timeOutInSeconds = pollingParameters.timeOutInSeconds;
                return _this._azureConnection.pollingWebRequest(parameters);
            };
            /**
             * Configures inbound NAT rule on the given load balancer and network interface based on portMap
             * Note that this function changes the in-memory LB and NIC, the caller should issue request to Azure to apply this change thru PUT request.
             * InboundNatRulename = portName + "-" + NIC name
             * The above InboundNatRulName will be created on LB and NIC only if it is not avaialble, otherwise existing rule will be reused.
             */
            this.configInboundNatRules = function (loadBalancer, networkInterface, portMap) {
                var networkInterfaceIPConfiguration = _this.findNetworkInterfaceIpConfigurationGivenLoadBalancer(loadBalancer, networkInterface);
                var loadBalancerInboundNatRules = loadBalancer.properties.inboundNatRules || [];
                var networkInterfacecInboundNatRules = networkInterfaceIPConfiguration.properties.loadBalancerInboundNatRules || [];
                for (var portName in portMap) {
                    // example
                    // rulename = EtwListener-NIC-group1-0-0
                    // nicRuleID = /subscriptions/ebf670f2-712b-460a-9fec-b1bb11bc111b/resourceGroups/group1/providers/Microsoft.Network
                    //             /loadBalancers/LB-group1-0/inboundNatRules/EtwListener-NIC-group1-0-0
                    var ruleName = AzureVirtualMachineV2Actions._natRuleNamePrefix + portName + "-" + networkInterface.name;
                    var nicRuleID = loadBalancer.id + "/inboundNatRules/" + ruleName;
                    var isRuleExistsInLB = loadBalancerInboundNatRules.some(function (rule) { return rule.name === ruleName; });
                    var isRuleExistsInNic = networkInterfacecInboundNatRules.some(function (rule) { return rule.id === nicRuleID; });
                    if (!isRuleExistsInNic) {
                        networkInterfacecInboundNatRules.push({ id: nicRuleID });
                    }
                    if (!isRuleExistsInLB) {
                        var backendPort = portMap[portName];
                        var lbRuleToAdd = {
                            name: ruleName,
                            properties: {
                                frontendPort: _this.findAvailablePort(backendPort, loadBalancerInboundNatRules),
                                backendPort: backendPort,
                                protocol: "Tcp",
                                idleTimeoutInMinutes: 4,
                                enableFloatingIP: false,
                                frontendIPConfiguration: {
                                    // TODO: We use the first frontend IP configuration for simplicity here.
                                    // While a load balancer can have multiple frontend IPs. It's possible some IP address can't route to certain VMs.
                                    id: loadBalancer.properties.frontendIPConfigurations[0].id
                                },
                                backendIPConfiguration: {
                                    id: networkInterfaceIPConfiguration.id
                                }
                            }
                        };
                        loadBalancerInboundNatRules.push(lbRuleToAdd);
                    }
                }
                loadBalancer.properties.inboundNatRules = loadBalancerInboundNatRules;
                networkInterfaceIPConfiguration.properties.loadBalancerInboundNatRules = networkInterfacecInboundNatRules;
            };
            this.findNetworkInterfaceIpConfigurationGivenLoadBalancer = function (loadBalancer, networkInterface) {
                // Find the load balancer ip configuration that is configured for the network interface
                var loadBalancerIPConfiguration = null;
                loadBalancer.properties.backendAddressPools.forEach(function (pool) {
                    if (loadBalancerIPConfiguration) {
                        return;
                    }
                    loadBalancerIPConfiguration = underscore.find(pool.properties.backendIPConfigurations, function (configuration) {
                        return configuration.id.indexOf(networkInterface.id) >= 0;
                    });
                });
                return loadBalancerIPConfiguration
                    ? underscore.findWhere(networkInterface.properties.ipConfigurations, { id: loadBalancerIPConfiguration.id })
                    : null;
            };
            this.findAvailablePort = function (initPort, loadBalancerInboundNatRules) {
                while (loadBalancerInboundNatRules.some(function (rule) { return rule.properties.frontendPort === initPort; })) {
                    initPort++;
                }
                return initPort;
            };
            this.updateLoadBalancer = function (loadBalancer, subscription, apiVersion, pollingLoadBalancer) {
                var loadBalancerUrl = AzureVirtualMachineV2Actions._resourceUriTemplate.expand({
                    apiVersion: apiVersion,
                    managementEndpoint: subscription.managementEndpoint,
                    resourceId: loadBalancer.id
                });
                var parameters = new PollingWebRequestParameters();
                parameters.url = loadBalancerUrl.toString();
                parameters.subscription = subscription;
                parameters.method = "PUT";
                parameters.body = JSON.stringify(loadBalancer);
                parameters.statusType = pollingLoadBalancer.statusType;
                parameters.initialStatusText = pollingLoadBalancer.initialStatusType;
                parameters.timeOutInSeconds = pollingLoadBalancer.timeOutInSeconds;
                return _this._azureConnection.pollingWebRequest(parameters);
            };
            this.updateNetworkInterface = function (networkInterface, subscription, apiVersion, pollingNetworkInterface) {
                var networkInterfaceUrl = AzureVirtualMachineV2Actions._resourceUriTemplate.expand({
                    apiVersion: apiVersion,
                    managementEndpoint: subscription.managementEndpoint,
                    resourceId: networkInterface.id
                });
                var parameters = new PollingWebRequestParameters();
                parameters.url = networkInterfaceUrl.toString();
                parameters.subscription = subscription;
                parameters.method = "PUT";
                parameters.body = JSON.stringify(networkInterface);
                parameters.statusType = pollingNetworkInterface.statusType;
                parameters.initialStatusText = pollingNetworkInterface.initialStatusType;
                parameters.timeOutInSeconds = pollingNetworkInterface.timeOutInSeconds;
                return _this._azureConnection.pollingWebRequest(parameters);
            };
            this.disableDebugging = function (args) {
                var networkSecurityGroup = args.networkSecurityGroup;
                var loadBalancer = args.loadBalancer;
                var networkInterface = args.networkInterface;
                var remoteDebuggingExtensionId = args.remoteDebuggingExtensionId;
                var pollingExtension = args.pollingExtension;
                var pollingNetworkSecurityGroup = args.pollingNetworkSecurityGroup;
                var apiVersion = args.apiVersion;
                var subscriptionString = args.subscription;
                var subscription = JSON.parse(subscriptionString);
                // Set VM and load balancer to busy. So user can't disable debugging when they are in busy state.
                if (underscore.contains(AzureVirtualMachineV2Actions._vmsDisablingRemoteDebug, args.id)) {
                    return Promise.reject({ message: "Already started to disable debugging." }); // Localize
                }
                AzureVirtualMachineV2Actions._vmsDisablingRemoteDebug.push(args.id);
                if (args.loadBalancer) {
                    if (underscore.contains(AzureVirtualMachineV2Actions._loadBalancersBusyUpdating, args.loadBalancer.id)) {
                        return Promise.reject({ message: "Can't disable debugging. The load balancer is currently busy updating." }); // Localize
                    }
                    AzureVirtualMachineV2Actions._loadBalancersBusyUpdating.push(args.loadBalancer.id);
                }
                // Start disabling process
                return _this.removeNetworkSecurityGroupRules(networkSecurityGroup, networkInterface, subscription, apiVersion, pollingNetworkSecurityGroup, AzureVirtualMachineV2Actions.defaultDebuggingPorts, AzureVirtualMachineV2Actions.debuggingExtension)
                    .then(function () {
                    return _this.removeLoadBalancerNetworkInterfaceRules(loadBalancer, networkInterface, subscription, apiVersion, AzureVirtualMachineV2Actions.defaultDebuggingPorts);
                })
                    .then(function () {
                    return _this.uninstallVMExtension(remoteDebuggingExtensionId, subscription, apiVersion, pollingExtension);
                })
                    .then(function () {
                    return Promise.resolve(null);
                }, function (err) {
                    // catch
                    return Promise.resolve(err);
                })
                    .then(function (err) {
                    // Pretend this to be the finally block, so we don't need to duplicate the clean up code
                    AzureVirtualMachineV2Actions._vmsDisablingRemoteDebug = underscore.without(AzureVirtualMachineV2Actions._vmsDisablingRemoteDebug, args.id);
                    if (args.loadBalancer) {
                        AzureVirtualMachineV2Actions._loadBalancersBusyUpdating = underscore.without(AzureVirtualMachineV2Actions._loadBalancersBusyUpdating, args.loadBalancer.id);
                    }
                    if (err) {
                        return Promise.reject(err);
                    }
                });
            };
            this.removeNetworkSecurityGroupRules = function (networkSecurityGroup, networkInterface, subscription, apiVersion, pollingParameter, portMap, extension) {
                return _this.canRemoveNetworkSecurityGroupRules(networkSecurityGroup, networkInterface, subscription, apiVersion, extension)
                    .then(function (canRemove) {
                    if (!canRemove) {
                        return Promise.resolve();
                    }
                    var securityRules = networkSecurityGroup.properties.securityRules || [];
                    for (var portName in portMap) {
                        var debuggingPortNumber = portMap[portName];
                        var securityRuleToDelete = underscore.find(securityRules, function (rule) {
                            // Remove rules only if the port number exactly match.
                            return rule.properties.access === "Allow" && debuggingPortNumber === Number(rule.properties.destinationPortRange);
                        });
                        if (securityRuleToDelete) {
                            securityRules = underscore.without(securityRules, securityRuleToDelete);
                        }
                    }
                    networkSecurityGroup.properties.securityRules = securityRules;
                    var url = AzureVirtualMachineV2Actions._resourceUriTemplate.expand({
                        apiVersion: apiVersion,
                        managementEndpoint: subscription.managementEndpoint,
                        resourceId: networkSecurityGroup.id
                    });
                    var parameters = new PollingWebRequestParameters();
                    parameters.url = url.toString();
                    parameters.subscription = subscription;
                    parameters.method = "PUT";
                    parameters.body = JSON.stringify(networkSecurityGroup);
                    parameters.statusType = pollingParameter.statusType;
                    parameters.initialStatusText = pollingParameter.initialStatusType;
                    parameters.timeOutInSeconds = pollingParameter.timeOutInSeconds;
                    return _this._azureConnection.pollingWebRequest(parameters);
                });
            };
            this.canRemoveNetworkSecurityGroupRules = function (networkSecurityGroup, networkInterface, subscription, apiVersion, extension) {
                if (!networkSecurityGroup || !networkSecurityGroup.properties.networkInterfaces) {
                    return Promise.resolve(false);
                }
                // TODO: We currently don't handle the case if the network security group is configured for subnets.
                // Don't remove the rules in this case so we won't accidently break VMs that already enabled the extension.
                if (networkSecurityGroup.properties.subnets && networkSecurityGroup.properties.subnets.length > 0) {
                    return Promise.resolve(false);
                }
                // Don't remove the rules if other VMs also enabled the extension, as they relies on the same port
                var distinctNicIds = networkSecurityGroup.properties.networkInterfaces.filter(function (ni) {
                    return ni.id !== networkInterface.id;
                }).map(function (ni) { return ni.id; });
                if (extension) {
                    return _this.extensionNotEnabledForAnyOtherVM(distinctNicIds, 0, subscription, apiVersion, extension);
                }
                return Promise.resolve(true);
            };
            this.extensionNotEnabledForAnyOtherVM = function (networkInterfaceIds, currentIndex, subscription, apiVersion, extension) {
                if (currentIndex >= networkInterfaceIds.length) {
                    return Promise.resolve(true);
                }
                var networkInterfaceUrl = AzureVirtualMachineV2Actions._resourceUriTemplate.expand({
                    apiVersion: apiVersion,
                    managementEndpoint: subscription.managementEndpoint,
                    resourceId: networkInterfaceIds[currentIndex]
                });
                return _this._azureConnection.webRequest(networkInterfaceUrl.toString(), subscription, "GET").then(function (response) {
                    var networkInterface = JSON.parse(response);
                    // Skip if the network interface is not associated with any virtual machine
                    if (!networkInterface.properties.virtualMachine || !networkInterface.properties.virtualMachine.id) {
                        return _this.extensionNotEnabledForAnyOtherVM(networkInterfaceIds, currentIndex + 1, subscription, apiVersion, extension);
                    }
                    var virtualMachineUrl = AzureVirtualMachineV2Actions._resourceUriTemplate.expand({
                        apiVersion: apiVersion,
                        managementEndpoint: subscription.managementEndpoint,
                        resourceId: networkInterface.properties.virtualMachine.id
                    });
                    return _this._azureConnection.webRequest(virtualMachineUrl.toString(), subscription, "GET").then(function (response) {
                        var virtualMachine = JSON.parse(response);
                        var debuggingEnabled = virtualMachine.resources &&
                            virtualMachine.resources.some(function (vmResource) {
                                return vmResource.properties.publisher === extension.publisher &&
                                    vmResource.properties.type === extension.type;
                            });
                        return debuggingEnabled
                            ? Promise.resolve(false)
                            : _this.extensionNotEnabledForAnyOtherVM(networkInterfaceIds, currentIndex + 1, subscription, apiVersion, extension);
                    });
                });
            };
            this.removeLoadBalancerNetworkInterfaceRules = function (loadBalancer, networkInterface, subscription, apiVersion, portMap) {
                if (!loadBalancer) {
                    return Promise.resolve();
                }
                _this.deleteInboundNatRules(loadBalancer, networkInterface, portMap);
                var loadBalancerUrl = AzureVirtualMachineV2Actions._resourceUriTemplate.expand({
                    apiVersion: apiVersion,
                    managementEndpoint: subscription.managementEndpoint,
                    resourceId: loadBalancer.id
                });
                var networkInterfaceUrl = AzureVirtualMachineV2Actions._resourceUriTemplate.expand({
                    apiVersion: apiVersion,
                    managementEndpoint: subscription.managementEndpoint,
                    resourceId: networkInterface.id
                });
                return _this._azureConnection.webRequest(loadBalancerUrl.toString(), subscription, "PUT", null, JSON.stringify(loadBalancer)).then(function () {
                    return _this._azureConnection.webRequest(networkInterfaceUrl.toString(), subscription, "PUT", null, JSON.stringify(networkInterface));
                });
            };
            this.deleteInboundNatRules = function (loadBalancer, networkInterface, portMap) {
                var networkInterfaceIPConfiguration = _this.findNetworkInterfaceIpConfigurationGivenLoadBalancer(loadBalancer, networkInterface);
                var loadBalancerInboundNatRules = loadBalancer.properties.inboundNatRules || [];
                var networkInterfaceInboundNatRules = networkInterfaceIPConfiguration.properties.loadBalancerInboundNatRules || [];
                for (var portName in portMap) {
                    var ruleName = AzureVirtualMachineV2Actions._natRuleNamePrefix + portName + "-" + networkInterface.name;
                    var loadBalancerRuleToDelete = underscore.find(loadBalancerInboundNatRules, function (rule) {
                        return rule.name === ruleName;
                    });
                    var networkInterfaceRuleToDelete = underscore.find(networkInterfaceInboundNatRules, function (rule) {
                        return rule.id === loadBalancer.id + "/inboundNatRules/" + ruleName;
                    });
                    if (loadBalancerRuleToDelete) {
                        loadBalancerInboundNatRules = underscore.without(loadBalancerInboundNatRules, loadBalancerRuleToDelete);
                    }
                    if (networkInterfaceRuleToDelete) {
                        networkInterfaceInboundNatRules = underscore.without(networkInterfaceInboundNatRules, networkInterfaceRuleToDelete);
                    }
                    // Additionally check using port nunmbers so rules created using older version of the code will be deleted as well
                    loadBalancerRuleToDelete = underscore.find(loadBalancerInboundNatRules, function (rule) {
                        return rule.properties.backendPort === portMap[portName]
                            && rule.properties.backendIPConfiguration
                            && rule.properties.backendIPConfiguration.id === networkInterfaceIPConfiguration.id;
                    });
                    if (loadBalancerRuleToDelete) {
                        loadBalancerInboundNatRules = underscore.without(loadBalancerInboundNatRules, loadBalancerRuleToDelete);
                        networkInterfaceRuleToDelete = underscore.find(networkInterfaceInboundNatRules, function (rule) {
                            return rule.id === loadBalancerRuleToDelete.id;
                        });
                        if (networkInterfaceRuleToDelete) {
                            networkInterfaceInboundNatRules = underscore.without(networkInterfaceInboundNatRules, networkInterfaceRuleToDelete);
                        }
                    }
                }
                loadBalancer.properties.inboundNatRules = loadBalancerInboundNatRules;
                networkInterfaceIPConfiguration.properties.loadBalancerInboundNatRules = networkInterfaceInboundNatRules;
            };
            this.uninstallVMExtension = function (extensionId, subscription, apiVersion, pollingParameter) {
                var url = AzureVirtualMachineV2Actions._resourceUriTemplate.expand({
                    apiVersion: apiVersion,
                    managementEndpoint: subscription.managementEndpoint,
                    resourceId: extensionId
                });
                var parameters = new PollingWebRequestParameters();
                parameters.url = url.toString();
                parameters.subscription = subscription;
                parameters.method = "DELETE";
                parameters.statusType = pollingParameter.statusType;
                parameters.initialStatusText = pollingParameter.initialStatusType;
                parameters.timeOutInSeconds = pollingParameter.timeOutInSeconds;
                return _this._azureConnection.pollingWebRequest(parameters);
            };
            this.updateDiagnostics = function (args) {
                if (args === void 0) { args = null; }
                var diagnosticsExtensionId = args.diagnosticsExtensionId;
                var subscriptionString = args.subscription;
                var location = args.location;
                var subscription = JSON.parse(subscriptionString);
                var extensionName = args.diagnosticsExtensionName;
                var url = AzureVirtualMachineV2Actions._resourceUriTemplate.expand({
                    apiVersion: args.apiVersion,
                    managementEndpoint: subscription.managementEndpoint,
                    resourceId: diagnosticsExtensionId
                });
                return _this._host.executeOperation(AzureVirtualMachineV2Actions._updateDiagnosticsConfig, [{ instanceName: args.name, initialConfiguration: args.diagnosticsExtensionSettings }])
                    .then(function (diagnosticsConfig) {
                    if (diagnosticsConfig && diagnosticsConfig.publicConfig) {
                        _this.AutoFillMetricsResourceId(diagnosticsConfig, args.id);
                        var diagnosticsConfiguration = _this.generateDiagnosticsConfig(diagnosticsConfig.publicConfig, diagnosticsConfig.privateConfig, extensionName, location);
                        var parameters = new PollingWebRequestParameters();
                        parameters.url = url.toString();
                        parameters.subscription = subscription;
                        parameters.method = "PUT";
                        parameters.body = JSON.stringify(diagnosticsConfiguration);
                        parameters.statusType = args.polling.statusType;
                        parameters.initialStatusText = args.polling.initialStatusType;
                        parameters.timeOutInSeconds = args.polling.timeOutInSeconds;
                        return _this._azureConnection.pollingWebRequest(parameters);
                    }
                    else {
                        // Configuration dialog was canceled.
                        return Promise.resolve();
                    }
                }).then(null, function () {
                    // TODO bubble up error
                    return Promise.resolve();
                });
            };
            this.AutoFillMetricsResourceId = function (diagnosticsConfig, resourceId) {
                if (!diagnosticsConfig || !diagnosticsConfig.publicConfig) {
                    return;
                }
                var publicConfig = JSON.parse(diagnosticsConfig.publicConfig);
                if (publicConfig.WadCfg && publicConfig.WadCfg.DiagnosticMonitorConfiguration) {
                    var metricsProperty = publicConfig.WadCfg.DiagnosticMonitorConfiguration.Metrics;
                    if (!metricsProperty) {
                        publicConfig.WadCfg.DiagnosticMonitorConfiguration.Metrics = {
                            resourceId: resourceId
                        };
                    }
                    else {
                        metricsProperty.resourceId = resourceId;
                    }
                }
                else if (publicConfig.xmlCfg) {
                    var xmlConfig = atob(publicConfig.xmlCfg);
                    var xmlConfigDoc = new DOMParser().parseFromString(xmlConfig, "text/xml");
                    var diagnosticMonitorConfigurationElement = xmlConfigDoc.getElementsByTagName("DiagnosticMonitorConfiguration")[0];
                    if (diagnosticMonitorConfigurationElement) {
                        var metricsElement = diagnosticMonitorConfigurationElement.getElementsByTagName("Metrics")[0];
                        if (!metricsElement) {
                            metricsElement = xmlConfigDoc.createElementNS(diagnosticMonitorConfigurationElement.namespaceURI, "Metrics");
                            diagnosticMonitorConfigurationElement.appendChild(metricsElement);
                        }
                        metricsElement.setAttribute("resourceId", resourceId);
                        var serializedXmlConfig = new XMLSerializer().serializeToString(xmlConfigDoc);
                        publicConfig.xmlCfg = btoa(serializedXmlConfig);
                    }
                }
                diagnosticsConfig.publicConfig = JSON.stringify(publicConfig);
            };
            this.generateDiagnosticsConfig = function (publicConfig, privateConfig, extensionName, location) {
                return {
                    properties: {
                        publisher: AzureConstants.diagnosticsExtension.publisher,
                        type: AzureConstants.diagnosticsExtension.type,
                        typeHandlerVersion: "1.5",
                        autoUpgradeMinorVersion: true,
                        settings: JSON.parse(publicConfig),
                        protectedSettings: JSON.parse(privateConfig)
                    },
                    name: extensionName,
                    type: "Microsoft.Compute/virtualMachines/extensions",
                    location: location,
                    tags: {}
                };
            };
            this.attatchDebugger = function (args) {
                var loadBalancer = args.loadBalancer;
                var networkInterface = args.networkInterface;
                var debuggingExtensionsSettings = JSON.parse(args.remoteDebuggingExtensionSettings);
                var debuggingPorts = {
                    connectorPort: debuggingExtensionsSettings.connectorPort,
                    forwarderPort: debuggingExtensionsSettings.forwarderPort,
                    forwarderPortx86: debuggingExtensionsSettings.forwarderPortx86,
                    fileUploadPort: debuggingExtensionsSettings.fileUploadPort
                };
                if (loadBalancer) {
                    var networkInterfaceIPConfiguration = _this.findNetworkInterfaceIpConfigurationGivenLoadBalancer(loadBalancer, networkInterface);
                    var loadBalancerInboundNatRules = loadBalancer.properties.inboundNatRules || [];
                    var networkInterfaceInboundNatRules = networkInterfaceIPConfiguration.properties.loadBalancerInboundNatRules || [];
                    for (var portName in debuggingPorts) {
                        var networkInterfaceRule = underscore.find(networkInterfaceInboundNatRules, function (rule) {
                            return rule.id.indexOf(portName) >= 0 && rule.id.indexOf(loadBalancer.id) >= 0;
                        });
                        var loadBalancerRule = underscore.find(loadBalancerInboundNatRules, function (rule) {
                            return rule.id === networkInterfaceRule.id;
                        });
                        debuggingPorts[portName] = loadBalancerRule.properties.frontendPort;
                    }
                }
                var actionArgs = {
                    instanceMachineName: args.name,
                    hostName: args.publicIpAddress,
                    clientCertificateThumbprint: debuggingExtensionsSettings.clientThumbprint,
                    serverCertificateThumbprint: debuggingExtensionsSettings.serverThumbprint,
                    connectorPort: debuggingPorts.connectorPort,
                    forwarderPort: debuggingPorts.forwarderPort,
                    forwarderx86Port: debuggingPorts.forwarderPortx86,
                    fileUploaderPort: debuggingPorts.fileUploadPort
                };
                return _this._host.executeOperation(AzureVirtualMachineV2Actions._attachDebuggerHostNamespace, [actionArgs]);
            };
            this.viewDiagnostics = function (args) {
                if (!args.diagnosticStorageAccountConnectionString) {
                    return _this._host.resolveResource(AzureResources.commonNamespace, "Actions.VirtualMachinesV2.InvalidDiagnoticsStorageConnectionString")
                        .then(function (message) {
                        _this._host.executeOperation("Environment.showMessageBox", ["Cloud Explorer", message, "warning"]);
                    });
                }
                // This action simply calls into the provider, which can be set at the config file directly.
                // However, we still leave the wrapper function here so it follows the same style as other actions.
                return _this._host.executeOperation(AzureVirtualMachineV2Actions._viewDiagnosticsHostNamespace, [{
                        connectionString: args.diagnosticStorageAccountConnectionString,
                        instanceName: args.name,
                        publicConfig: args.diagnosticsExtensionSettings
                    }]);
            };
            this.getVmDebugCertificateInformation = function (hostName) {
                return _this._host.executeOperation(AzureVirtualMachineV2Actions._getVmDebugCertificateInformation, [hostName]);
            };
            this._azureConnection = azureConnection;
            this._host = host;
        }
        return AzureVirtualMachineV2Actions;
    }());
    AzureVirtualMachineV2Actions.enableDiagnosticsNamespace = "Azure.Actions.VirtualMachineV2.enableDiagnostics";
    AzureVirtualMachineV2Actions.updateDiagnosticsNamespace = "Azure.Actions.VirtualMachineV2.updateDiagnostics";
    AzureVirtualMachineV2Actions.attatchDebuggerNamespace = "Azure.Actions.VirtualMachineV2.attatchDebugger";
    AzureVirtualMachineV2Actions.viewDiagnosticsNamespace = "Azure.Actions.VirtualMachineV2.viewDiagnostics";
    AzureVirtualMachineV2Actions.enableDebuggingNamespace = "Azure.Actions.VirtualMachineV2.enableDebugging";
    AzureVirtualMachineV2Actions.disableDebuggingNamespace = "Azure.Actions.VirtualMachineV2.disableDebugging";
    AzureVirtualMachineV2Actions.enableEtwListenerNamespace = "Azure.Actions.VirtualMachineV2.enableEtwListener";
    AzureVirtualMachineV2Actions.disableEtwListenerNamespace = "Azure.Actions.VirtualMachineV2.disableEtwListener";
    AzureVirtualMachineV2Actions.createEtwListenerWindowNamespace = "Azure.Actions.VirtualMachineV2.createEtwListenerWindow";
    AzureVirtualMachineV2Actions.getEtwListenerVMExtVersionNamespace = "AzureFabric.getEtwListenerVMExtVersion";
    AzureVirtualMachineV2Actions.debuggingExtensionVersion = "1.1";
    AzureVirtualMachineV2Actions.debuggingExtension = {
        publisher: AzureConstants.RemoteDebugging.RemoteDebuggingExtensionPublisher,
        type: AzureConstants.RemoteDebugging.RemoteDebuggingExtensionType
    };
    AzureVirtualMachineV2Actions.etwListenerExtension = {
        publisher: AzureConstants.ServiceFabric.EtwListenerExtensionPublisher,
        type: AzureConstants.ServiceFabric.EtwListenerExtensionType
    };
    AzureVirtualMachineV2Actions.isVMEnablingRemoteDebug = function (id) {
        return underscore.contains(AzureVirtualMachineV2Actions._vmsEnablingRemoteDebug, id);
    };
    AzureVirtualMachineV2Actions.isVMDisablingRemoteDebug = function (id) {
        return underscore.contains(AzureVirtualMachineV2Actions._vmsDisablingRemoteDebug, id);
    };
    AzureVirtualMachineV2Actions.isVMConfiguringEtwListener = function (id) {
        return underscore.contains(AzureVirtualMachineV2Actions._vmsConfiguringEtwListener, id);
    };
    AzureVirtualMachineV2Actions.isLoadBalancerBusy = function (id) {
        return underscore.contains(AzureVirtualMachineV2Actions._loadBalancersBusyUpdating, id);
    };
    AzureVirtualMachineV2Actions.azureToolsPrefix = "MSVSAZ";
    AzureVirtualMachineV2Actions.remoteDebuggerCertPrefix = "remotedebugcert";
    AzureVirtualMachineV2Actions.createEtwListenerWindowHostNamespace = "AzureFabric.createEtwListenerWindow";
    AzureVirtualMachineV2Actions._viewDiagnosticsHostNamespace = "Azure.Actions.DiagnosticsExtension.viewDiagnostics";
    AzureVirtualMachineV2Actions._getInitialDiagnosticsConfig = "Azure.Actions.DiagnosticsExtension.getInitialDiagnosticsConfig";
    AzureVirtualMachineV2Actions._updateDiagnosticsConfig = "Azure.Actions.DiagnosticsExtension.updateDiagnosticsConfig";
    AzureVirtualMachineV2Actions._getVmDebugCertificateInformation = "Azure.getVmDebugCertificateInformation";
    AzureVirtualMachineV2Actions._attachDebuggerHostNamespace = "Azure.attachToVm";
    AzureVirtualMachineV2Actions._promptConfirmActionNamespace = "CloudExplorer.Actions.Dialog.promptYesNo";
    AzureVirtualMachineV2Actions._natRuleNamePrefix = "MSVSAutoGen-";
    AzureVirtualMachineV2Actions._enableExtensionUriTemplate = URITemplate("{+managementEndpoint}/{+resourceId}/extensions/{+extensionName}/?api-version={+apiVersion}");
    AzureVirtualMachineV2Actions._resourceUriTemplate = URITemplate("{+managementEndpoint}/{+resourceId}/?api-version={+apiVersion}");
    AzureVirtualMachineV2Actions._findKeyVaultUriTemplate = URITemplate("{+managementEndpoint}/" +
        "subscriptions/{+subscriptionId}/resources?api-version=2015-01-01&" +
        "$filter= substringof('{+keyVaultPrefix}',name) and " +
        "(resourceType eq 'Microsoft.KeyVault/vaults') and " +
        "(Location eq '{+location}')");
    AzureVirtualMachineV2Actions._createKeyVaultUriTemplate = URITemplate("{+managementEndpoint}/" +
        "subscriptions/{+subscriptionId}/resourceGroups/{+resourceGroup}/" +
        "providers/Microsoft.KeyVault/vaults/{+keyVaultName}?api-version=2015-06-01");
    AzureVirtualMachineV2Actions._registerProviderUriTemplate = URITemplate("{+managementEndpoint}/" +
        "subscriptions/{+subscriptionId}/" +
        "providers/{+resourceProviderNamespace}/register?api-version=2015-06-01");
    AzureVirtualMachineV2Actions._uploadCertUriTemplate = URITemplate("{+keyVaultUri}" +
        "secrets/{+certName}?api-version=2015-06-01");
    AzureVirtualMachineV2Actions.defaultDebuggingPorts = {
        connectorPort: 30398,
        forwarderPort: 31398,
        forwarderPortx86: 31399,
        fileUploadPort: 32398
    };
    AzureVirtualMachineV2Actions.defaultEtwListenerPorts = {
        etwListenerPort: 810
    };
    AzureVirtualMachineV2Actions._vmsEnablingRemoteDebug = [];
    AzureVirtualMachineV2Actions._vmsDisablingRemoteDebug = [];
    AzureVirtualMachineV2Actions._vmsConfiguringEtwListener = [];
    AzureVirtualMachineV2Actions._loadBalancersBusyUpdating = [];
    AzureVirtualMachineV2Actions.parseVersionString = function (versionString) {
        var entities = versionString.split(".");
        var maj = parseInt(entities[0], 10);
        var min = entities.length > 1 ? parseInt(entities[1], 10) : 0;
        return [maj, min];
    };
    return AzureVirtualMachineV2Actions;
});
