/*
################################################################################
# Copyright 2019 IBM Corp. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
################################################################################
*/

import { connect } from 'react-redux'
import { translate } from "react-i18next";

import cookie from 'react-cookies'
import Config from '../components/Config'
import React from 'react'
import { httpRequest, httpGet, httpPost, httpPut, getResponseBody, errorAlert } from '../utils/httpUtils'
import { updateModal } from '../actions/modal';

import * as Actions from '../actions/actionTypes'
import {
    uploadConfig,
    receiveConfigSuccess,
    receiveConfigFailure,
    fetchConfiguration,
    fetchConfigurationSuccess,
    fetchConfigurationFailure,
    fetchConfigurationConfigName,
    fetchConfigurationConfigNameSuccess,
    fetchConfigurationConfigNameFailure,
    validateConfig,
    validateConfigSuccess,
    validateConfigFailure,
    generateConfig,
    generateConfigSuccess,
    generateConfigFailure,
    deploymentAuthorized,
    deploymentStart,
    deploymentSuccess,
    deploymentFailure,
    deploymentIsRunning,
    deploymentRunning,
    deploymentRunningSuccess,
    deploymentRunningFailure,
    updateConfiguration,
} from '../actions/config'


import {
    fetchStatesExtensions,
    fetchStatesExtensionsSuccess,
    fetchStatesExtensionsFailure,
} from '../actions/states'

import {
    fetchUIMetadataAllConfigsNames,
    fetchUIMetadataAllConfigsNamesSuccess,
    fetchUIMetadataAllConfigsNamesFailure,
    fetchUIMetadata,
    fetchUIMetadataSuccess,
    fetchUIMetadataFailure,
    fetchUIMetadataPrevious,
    fetchUIMetadataPreviousSuccess,
    fetchUIMetadataPreviousFailure,
} from '../actions/uimetadata'

import { getSettings } from '../utils/configUtils'

require('../scss/table.scss')

const settings = getSettings()
class UploadConfig extends React.Component {
    // constructor(props) {
    //     super(props)
    // }

    state = {
        token: cookie.load('commands-runner-token'),
        port: cookie.load('commands-runner-port'),
        uimetadataSelectedConfig: {},
        uimetadataFileSelectedConfig: {},
    }

    componentDidMount() {
        this.fetchUIMetadataAllConfigsNames()
        this.fetchStatesExtensions()
        this.checkDeploymentAuthorized()
        // console.log("defaultExtensionName:"+settings.default_extension_name)
    }

    alert = (msg) => {
        this.alert(this.props.t(msg))
    }

    fetchUIMetadataAllConfigsNames() {
        // console.log(this.state.dataReady)
        httpRequest('/uimetadatas?names-only=true', httpGet, {}, undefined, this.props.fetchUIMetadataAllConfigsNames, this.props.fetchUIMetadataAllConfigsNamesSuccess, this.fetchConfigurationConfigName.bind(this, undefined), this.props.fetchUIMetadataAllConfigsNamesFailure, this.fetchUIMetadataAllConfigsNamesFailed)
        // console.log("uimetadataSelectedConfig:" + JSON.stringify(this.state.uimetadataSelectedConfig))
    }

    fetchUIMetadataAllConfigsNamesFailed = () => {
        errorAlert("Failed to fetch uimetadata configuration names: ", this.props.uimetadataError)
    }

    fetchStatesExtensions = () => {
        var url = "/states?extension-name=" + settings.default_extension_name + "&extensions-only=true&recursive=true"
        // console.log(url)
        httpRequest(url, httpGet, {}, undefined, this.props.fetchStatesExtensions, this.props.fetchStatesExtensionsSuccess, this.fetchExtensionsConfigurationConfigName, this.props.fetchStatesExtensionsFailure, this.fetchStatesExtensionsFailed)
    }

    fetchStatesExtensionsFailed = () => {
        errorAlert("Failed to fetch extensions: ", this.props.error)
    }

    fetchExtensionsConfigurationConfigName = () => {
        this.setState({ extensionsConfigurationConfigNameDone: false })
        var extensions = this.props.extensionsStates
        // console.log("fetchExtensionsConfigurationConfigName:" + extensions)
        extensions.forEach(extension => {
            this.fetchConfigurationConfigName(extension.name)
        })
        this.setState({ extensionsConfigurationConfigNameDone: true })
    }

    fetchConfigurationConfigName = (extensionName) => {
        // console.log("fetchConfigurationConfigName")
        // console.log("extensionName:" + extensionName)
        // console.log("defaultExtensionName:" + settings.default_extension_name)
        if (extensionName == undefined) {
            // console.log("hello")
            extensionName = settings.default_extension_name
        }
        // console.log("extensionName:" + extensionName)
        httpRequest('/config/configuration_name?extension-name=' + extensionName, httpGet, {}, undefined, this.props.fetchConfigurationConfigName, this.props.fetchConfigurationConfigNameSuccess, this.setUIMetadataConfigDropdown.bind(this, extensionName), this.props.fetchConfigurationConfigNameFailure, this.setUIMetadataConfigDropdownFailure.bind(this, extensionName))
    }

    setUIMetadataConfigDropdown = (extensionName) => {
        // console.log("setUIMetadataConfigDropdown.extensionName:" + extensionName)
        if (extensionName == undefined) {
            extensionName = settings.default_extension_name
        }
        // console.log(this.props.configurationConfigName)
        var configName = this.props.configurationConfigName.value
        // console.log("setUIMetadataConfigDropdown.configName" + configName)
        var selected = { selectedItem: this.props.uimetadataAllConfigsNames[extensionName].find(item => item.id === configName) }
        // console.log("setUIMetadataConfigDropdown.selected:" + JSON.stringify(selected))
        this.updateUImetadataConfigDropdown(extensionName, selected)
    }

    setUIMetadataConfigDropdownFailure = (extensionName) => {
        // console.log("setUIMetadataConfigDropdownFailure")
        // console.log("setUIMetadataConfigDropdown:" + extensionName)
        if (extensionName == undefined) {
            extensionName = settings.default_extension_name
        }
        if (this.state.uimetadataSelectedConfig &&
            this.state.uimetadataSelectedConfig[extensionName]) {
            this.setState(prevState => ({
                uimetadataSelectedConfig: {
                    ...prevState.uimetadataSelectedConfig,
                    [extensionName]: null
                }
            }))
            // console.log("setUIMetadataConfigDropdownFailure.uimetadataSelectedConfig:" + JSON.stringify(this.state.uimetadataSelectedConfig))
        }
        if (this.state.uimetadataFileSelectedConfig &&
            this.state.uimetadataFileSelectedConfig[extensionName]) {
            // console.log("setUIMetadataConfigDropdownFailure.uimetadataFileSelectedConfig:" + JSON.stringify(this.state.uimetadataFileSelectedConfig))
            this.setState(prevState => ({
                uimetadataFileSelectedConfig: {
                    ...prevState.uimetadataFileSelectedConfig,
                    [extensionName]: null
                }
            }))
        }
        // console.log("setUIMetadataConfigDropdownFailure.uimetadataSelectedConfig:" + JSON.stringify(this.state.uimetadataSelectedConfig))
        // console.log("setUIMetadataConfigDropdownFailure.uimetadataFileSelectedConfig:" + JSON.stringify(this.state.uimetadataFileSelectedConfig))
    }

    render() {
        return <Config
            inceptionSetupCompleted={this.props.inceptionSetupCompleted}
            statusUploadConfig={this.props.statusUploadConfig}
            statusValidateConfig={this.props.statusValidateConfig}
            statusGenerateConfig={this.props.statusValidateConfig}
            statusDeploymentStart={this.props.statusDeploymentStart}
            statusDeploymentRunning={this.props.statusDeploymentRunning}
            uploadConfigAndValidate={this.uploadConfigAndValidate}
            fetchExtensions={this.getExtensions}
            fetchErrors={this.getErrors}
            isAuthorized={this.props.isAuthorized}
            isRunning={this.props.isRunning}
            startDeployment={this.generateConfigAndStartDeployment}
            extensionsRequestStatus={this.props.extensionsRequestStatus}
            fetchConfiguration={this.fetchConfigurationModal}
            uimetadataConfigs={this.props.uimetadataConfigs}
            uimetadataAllConfigsNames={this.props.uimetadataAllConfigsNames}
            uimetadataSelectedConfig={this.state.uimetadataSelectedConfig}
            uimetadataFileSelectedConfig={this.state.uimetadataFileSelectedConfig}
            onChangeUImetadataConfigDropdown={this.onChangeUImetadataConfigDropdown}
            editConfiguration={this.editConfiguration}
            defaultExtensionName={settings.default_extension_name}
            extensionsConfigurationConfigNameDone={this.state.extensionsConfigurationConfigNameDone}
            extensionsItems={this.props.uimetadataAllConfigsNames}
            uploadConfigExtensions={this.uploadConfigExtensions}
            extensionsConfigurationConfigNameDone={this.state.extensionsConfigurationConfigNameDone}
        />
    }

    uploadConfigAndValidate = evt => {
        var form = new FormData()
        form.append('config', evt.target.files[0])
        httpRequest('/config?extension-name=' + settings.default_extension_name, httpPost, {}, form, this.props.uploadConfig, this.props.receiveConfigSuccess, this.checkDeploymentAuthorized, this.props.receiveConfigFailure, undefined)
    }

    fetchConfigurationModal = (extensionName) => {
        // console.log("fetchConfiguration:" + extensionName)
        var url = "/config?extension-name=" + extensionName
        this.setState({ extensionName: extensionName })
        httpRequest(url, httpGet, {}, undefined, this.props.fetchConfiguration, this.props.fetchConfigurationSuccess, this.openConfigurationModal, this.props.fetchConfigurationFailure, this.alert.bind(this, "config.alert.no_configuration_available"))
    }

    openConfigurationModal = () => {
        this.props.updateModal({
            type: 'scroll-box',
            contentTitle: this.state.extensionName,
            contentText: this.props.responseFetchConfig,
            open: true
        })
    }

    editConfiguration = (extensionName) => {
        // console.log("editConfiguraiton:" + extensionName)
        const { t } = this.props
        if (this.state.uimetadataSelectedConfig != undefined) {
            if (this.state.uimetadataSelectedConfig[extensionName] == undefined) {
                alert(t("config.alert.configuration_not_selected"))
            } else {
                var url = "/config?extension-name=" + extensionName
                // console.log("url:" + url)
                httpRequest(url, httpGet, {}, undefined, this.props.fetchConfiguration, this.props.fetchConfigurationSuccess, this.setConfigurationName.bind(this, extensionName), this.props.fetchConfigurationFailure, this.setConfigurationName.bind(this, extensionName))
            }
        } else {
            alert("this.state.uimetadataSelectedConfig:" + this.state.uimetadataSelectedConfig)
        }
    }

    setConfigurationName = (extensionName) => {
        // console.log("setConfigurationName.configuration_name:" + this.props.config[settings.config_root_key]["configuration_name"])
        // console.log("setConfigurationName.uiConfigName:" + this.state.uiConfigName)
        if (this.props.config[settings.config_root_key]["configuration_name"] !== undefined &&
            this.props.config[settings.config_root_key]["configuration_name"] !== this.state.uimetadataSelectedConfig[extensionName].id) {
            this.openConfirmModal(extensionName)
        } else {
            this.props.config[settings.config_root_key]["configuration_name"] = this.state.uimetadataSelectedConfig[extensionName].id
            this.props.updateConfiguration(this.props.config[settings.config_root_key])
            this.saveConfiguration(extensionName)
        }
        // console.log("loadUIMetadataPropertiesPath.config:" + JSON.stringify(this.props.config))
    }

    openConfirmModal(extensionName) {
        const { t } = this.props
        var fromConfig = this.props.uimetadataAllConfigsNames[extensionName].find(item => item.id === this.props.config[settings.config_root_key]["configuration_name"]).label
        var toConfig = this.state.uimetadataSelectedConfig[extensionName].label
        this.props.updateModal({
            type: 'confirm',
            open: true,
            modalHeading: t("modal.confirm.header"),
            onRequestCancel: this.configurationTypeChangeClosed,
            onRequestConfirm: this.configurationTypeChangeConfirmed.bind(this, extensionName),
            onRequestClose: this.configurationTypeChangeClosed,
            primaryButtonText: t("button.confirm"),
            secondaryButtonText: t("button.cancel"),
            contentText: t("modal.confirm.content")
        })
    }

    configurationTypeChangeConfirmed = (extensionName) => {
        // console.log("PreviousUIConfigName" + this.props.config[settings.config_root_key]["configuration_name"])
        httpRequest('/config?extension-name=' + extensionName, httpPost, {}, this.props.config, this.props.uploadConfig, this.props.receiveConfigSuccess, this.fetchUIMetadata.bind(this, extensionName), this.props.receiveConfigFailure, undefined)
    }

    configurationTypeChangeClosed = () => {
        this.props.handleClose()
    }

    fetchUIMetadata = (extensionName) => {
        httpRequest('/uimetadata?extension-name=' + extensionName + '&ui-metadata-name=' + this.state.uimetadataSelectedConfig[extensionName].id, httpGet, {}, undefined, this.props.fetchUIMetadata, this.props.fetchUIMetadataSuccess, this.fetchConfiguration.bind(this, extensionName), this.props.fetchUIMetadataFailure, undefined)
    }

    fetchConfiguration = (extensionName) => {
        var url = "/config?extension-name=" + extensionName
        // console.log("url:" + url)
        httpRequest(url, httpGet, {}, undefined, this.props.fetchConfiguration, this.props.fetchConfigurationSuccess, this.loadPreviousUIMetadata.bind(this, extensionName), this.props.fetchConfigurationFailure, this.loadPreviousUIMetadata.bind(this, extensionName))
    }

    loadPreviousUIMetadata = (extensionName) => {
        // console.log("loadUIMetadataPropertiesPath.loadPreviousUIMetadata")
        httpRequest('/uimetadata?extension-name=' + extensionName + '&ui-metadata-name=' + this.props.config[settings.config_root_key]["configuration_name"], httpGet, {}, undefined, this.props.fetchUIMetadataPrevious, this.props.fetchUIMetadataPreviousSuccess, this.deletePreviousAttributes.bind(this, extensionName), this.props.fetchUIMetadataPreviousFailure, undefined)
    }

    //Not used, it was a try to delete all config element not in the config after loading the PreviousUIMetadata
    //it doesn't rerender.
    deletePreviousAttributes = (extensionName) => {
        // console.log(JSON.stringify(this.props.config))
        this.cleanConfig(this.props.config)
        this.saveConfiguration(extensionName)
    }

    saveConfiguration = (extensionName) => {
        // console.log(JSON.stringify(this.props.config))
        this.props.config[settings.config_root_key]["configuration_name"] = this.state.uimetadataSelectedConfig[extensionName].id
        this.props.updateConfiguration(this.props.config[settings.config_root_key])
        httpRequest('/config?extension-name=' + extensionName, httpPost, {}, this.props.config, this.props.uploadConfig, this.props.receiveConfigSuccess, this.navigateToEditConfigurationPage.bind(this, extensionName), this.props.receiveConfigFailure, undefined)
    }

    cleanConfig(config) {
        //        var uimetadataPropertiesPath = this.loadUIMetadataPropertiesPath(this.props.uimetadata, true)
        var uimetadataPreviousPropertiesPath = this.loadUIMetadataPropertiesPath(this.props.uimetadataPrevious, true)
        // uimetadataPropertiesPath.push("configuration_name")
        this.cleanConfigRecursive(config[settings.config_root_key], uimetadataPreviousPropertiesPath, "")
    }

    cleanConfigRecursive(config, uimetadataPreviousPropertiesPath, currentPath) {
        for (var key in config) {
            // console.log(JSON.stringify(config[key]))
            key = (isNaN(key) ? key : parseInt(key))
            if (config[key] !== undefined) {
                var propertyPath = (currentPath === "" ? key : (currentPath + "." + key))
                var propertyPathNonArray = (currentPath === "" ? key : (currentPath + "." + key).replace(".0", ""))
                if ((uimetadataPreviousPropertiesPath.includes(propertyPath) ||
                    uimetadataPreviousPropertiesPath.includes(propertyPathNonArray))) {
                    delete config[key]
                }
            }
        };
    }

    //Navigate through each group to list all attibutes path. 
    //if includeSubpath is true then intermediate path are inserted.
    loadUIMetadataPropertiesPath = (uimetadata, includeSubpath) => {
        var propertiesPath = []
        if (uimetadata !== undefined) {
            var groups = uimetadata.groups
            // console.log("loadUIMetadataPropertiesPath.groups:" + JSON.stringify(groups))
            for (var i in groups) {
                // console.log("loadUIMetadataPropertiesPath.groupName:" + JSON.stringify(groups[i].name))
                propertiesPath = propertiesPath.concat(this.getUIMetadataPropertiesPath(groups[i].properties, "", includeSubpath))
            }
        }
        // console.log("loadUIMetadataPropertiesPath.properties_path_uimetadata:" + JSON.stringify(propertiesPath))
        return propertiesPath
    }

    //Recursively search the path of each properties in the uimetadata
    getUIMetadataPropertiesPath = (properties, path, includeSubpath) => {
        var propertiesPath = []
        // console.log("loadUIMetadataPropertiesPath.properties:" + JSON.stringify(properties))
        for (var i in properties) {
            // console.log("loadUIMetadataPropertiesPath.properties[i]:" + JSON.stringify(properties[i]))
            var currentPath = path === "" ? properties[i].name : path + "." + properties[i].name
            // console.log("loadUIMetadataPropertiesPath.currentPath:" + JSON.stringify(currentPath))
            if (properties[i].properties) {
                // console.log("loadUIMetadataPropertiesPath.properties[i].properties:" + JSON.stringify(properties[i].properties))
                if (includeSubpath) {
                    var p = this.getUIMetadataPropertiesPath(properties[i].properties, currentPath, includeSubpath)
                    p.push(currentPath)
                    propertiesPath = propertiesPath.concat(p)
                }
                var p = this.getUIMetadataPropertiesPath(properties[i].properties, currentPath, includeSubpath)
                propertiesPath = propertiesPath.concat(p)
            } else {
                propertiesPath.push(currentPath)
            }
        }
        return propertiesPath
    }


    loadConfigPropertiesPath() {
        var config = this.props.config
        // console.log(JSON.stringify(config))
        // console.log(JSON.stringify(config[settings.config_root_key]))
        var propertiesPath = this.getConfigPropertiesPath(config[settings.config_root_key], "")
        // var l = propertiesPath.length
        // for (var i = 0; i < l; i++) {
        //     if (isArrayFirstElemPath(propertiesPath[i])) {
        //         propertiesPath.push(propertiesPath[i].replace(".0", ""))
        //     }
        // }
        // console.log("loadUIMetadataPropertiesPath.properties_path_config:" + JSON.stringify(propertiesPath))
        return propertiesPath
    }

    getConfigPropertiesPath(config, path) {
        var stringConstructor = "test".constructor;
        var numberConstructor = new Number(1).constructor;
        var arrayConstructor = [].constructor;
        var objectConstructor = {}.constructor;
        var booleanConstructor = true.constructor;
        var propertiesPath = []
        for (var key in config) {
            // console.log(JSON.stringify(config[key]))
            var currentPath = path === "" ? key : path + "." + key
            if (config[key] === undefined || config[key] === null) {
                propertiesPath.push(currentPath)
                continue
            }
            switch (config[key].constructor) {
                case stringConstructor:
                    // console.log("stringConstructor")
                    propertiesPath.push(currentPath)
                    break
                case numberConstructor:
                    // console.log("numberConstructor")
                    propertiesPath.push(currentPath)
                    break
                case booleanConstructor:
                    // console.log("booleanConstructor")
                    propertiesPath.push(currentPath)
                    break
                case arrayConstructor:
                    // console.log("arrayConstructor")
                    propertiesPath = propertiesPath.concat(this.getConfigPropertiesPath(config[key], currentPath))
                    break
                case objectConstructor:
                    propertiesPath = propertiesPath.concat(this.getConfigPropertiesPath(config[key], currentPath))
                    // console.log("objectConstructor")
                    break
                default:
                // console.log("Unknown")
            }
        };
        return propertiesPath
    }

    navigateToEditConfigurationPage(extensionName) {
        var link = "/editConfig?extension-name=" + extensionName + "&ui-metadata-name=" + this.state.uimetadataSelectedConfig[extensionName].id + "&ui-metadata-label=" + this.state.uimetadataSelectedConfig[extensionName].label
        // console.log("link:" + link)
        window.location.href = link
    }

    getExtensions = () => {
        // console.log("==================== getExtensions =======================")
        var results = []
        var extensions = this.props.extensionsStates
        if (extensions !== undefined) {
            extensions.forEach(extension => {
                var name = extension['name']
                extension['id'] = name
            });
            return extensions
        }
        return results
    }

    onChangeUImetadataConfigDropdown = (extensionName, selected) => {
        // console.log("onChangeUImetadataConfigDropdown.selected.selectedItem:" + JSON.stringify(selected.selectedItem))
        if (extensionName == undefined) {
            extensionName = settings.default_extension_name
        }
        this.setState(prevState => ({
            uimetadataSelectedConfig: {
                ...prevState.uimetadataSelectedConfig,
                [extensionName]: selected.selectedItem
            }
        }))
        // console.log("onChangeUImetadataConfigDropdown.uimetadataSelectedConfig:" + JSON.stringify(this.state.uimetadataSelectedConfig))
    }

    updateUImetadataConfigDropdown = (extensionName, selected) => {
        if (extensionName == undefined) {
            extensionName = settings.default_extension_name
        }
        // console.log("updateUImetadataConfigDropdown.extensionName:" + extensionName)
        // console.log("updateUImetadataConfigDropdown.selected:" + JSON.stringify(selected))
        this.setState(prevState => ({
            uimetadataFileSelectedConfig: {
                ...prevState.uimetadataFileSelectedConfig,
                [extensionName]: selected.selectedItem
            }
        }))
        this.onChangeUImetadataConfigDropdown(extensionName, selected)
        // console.log("updateUImetadataConfigDropdown.uimetadataSelectedConfig:" + JSON.stringify(this.state.uimetadataSelectedConfig))
        // console.log("updateUImetadataConfigDropdown.uimetadataFileSelectedConfig:" + JSON.stringify(this.state.uimetadataFileSelectedConfig))
    }

    uploadConfigExtensions = name => evt => {
        var form = new FormData()
        form.append('config', evt.target.files[0])
        httpRequest('/config?extension-name=' + name, httpPost, {}, form, this.props.uploadConfig, this.props.receiveConfigSuccess, this.fetchConfigurationConfigName.bind(this, name), this.props.receiveConfigFailure, undefined)
    }

    getErrors = () => {
        var error = {}
        var results = []
        var deploymentEnable = true
        if ((this.props.statusValidateConfig === Actions.VALIDATE_REQUEST_STATUS.ERROR ||
            this.props.statusValidateConfig === Actions.VALIDATE_REQUEST_STATUS.DONE_WITH_WARNING) &&
            this.props.errorValidateConfig !== undefined) {
            // console.log(this.props.statusValidateConfig)
            // console.log(this.props.errorValidateConfig)
            var errorJson = ''
            var errorText = ''
            try {
                errorJson = JSON.parse(getResponseBody(this.props.errorValidateConfig.response))
            } catch (e) {
                if (this.props.errorValidateConfig.response.text !== undefined) {
                    errorText = getResponseBody(this.props.errorValidateConfig.response)
                } else {
                    errorText = ''
                }
            }
            if (errorJson[settings.config_root_key]) {
                const errors = errorJson[settings.config_root_key]
                const keys = Object.keys(errors)
                keys.forEach(key => {
                    if (errors[key].message_type) {
                        errors[key]["id"] = key
                        results.push(errors[key])
                        if (errors[key].message_type === 'error') {
                            deploymentEnable = false
                        }
                    };
                })

            } else {
                error["id"] = "Upload configuration"
                error["message_type"] = "error"
                error["message"] = errorText
                results.push(error)
                deploymentEnable = false
            }
        } else {
            error["id"] = "Unknown"
            error["message_type"] = "error"
            if (this.props.errorUploadConfig) {
                error["id"] = "Upload configuration"
                error["message"] = this.props.errorUploadConfig
            }
            if (this.props.errorValidateConfig) {
                error["id"] = "Validation"
                error["message"] = this.props.errorValidateConfig
            }
            if (this.props.errorGenerateConfig) {
                error["id"] = "Generate configuration"
                error["message"] = this.props.errorGenerateConfig
            }
            if (this.props.errorDeploymentStart) {
                error["id"] = "Deployment"
                error["message"] = this.props.errorDeploymentStart.message
            }
            // switch (this.props.statusUploadConfig) {
            //     case Actions.UPLOAD_REQUEST_STATUS.ERROR:
            //         error["id"] = "Upload configuration"
            //         break
            //     default:
            //         error["id"] = "Unknown"
            // }
            // error["message_type"] = "error"
            // error["message"] = this.props.errorValidateConfig
            results.push(error)
            deploymentEnable = false
        }
        this.props.deploymentAuthorized(deploymentEnable)
        return results
    }

    generateConfigAndStartDeployment = () => {
        httpRequest('/config?extension-name=' + settings.default_extension_name, httpPut, {}, undefined, this.props.generateConfig, this.props.generateConfigSuccess, this.startDeployment, this.props.generateConfigFailure, this.generateConfigFailed)
    }

    generateConfigFailed = () => {
        errorAlert("Failed to generate the config: ", this.props.errorGenerateConfig)
    }

    startDeployment = () => {
        httpRequest('/engine?extension-name=' + settings.default_extension_name + '&action=start', httpPut, {}, undefined, this.props.deploymentStart, this.props.deploymentSuccess, this.navigateToStatesPage, this.props.deploymentFailure, undefined)
    }

    startDeploymentFailed = () => {
        errorAlert("Failed to start the deployment: ", this.props.errorDeploymentStart)
    }

    navigateToStatesPage = () => {
        window.location.href = "/states"
    }

    checkDeploymentAuthorized = () => {
        this.props.deploymentIsRunning(true)
        this.fetchConfigurationConfigName(settings.default_extension_name)
        httpRequest('/engine?extension-name=' + settings.default_extension_name, httpGet, {}, undefined, this.props.deploymentRunning, this.props.deploymentRunningSuccess, this.checkIsRunning, this.props.deploymentRunningFailure, this.checkIsRunning)
    }

    checkIsRunning = () => {
        var running = (this.props.responseDeploymentRunning.status !== undefined && this.props.responseDeploymentRunning.status === 201)
        this.props.deploymentIsRunning(running)
        if (!running) {
            this.props.deploymentAuthorized(false)
            httpRequest('/config?action=validate&extension-name=' + settings.default_extension_name, httpGet, {}, undefined, this.props.validateConfig, this.props.validateConfigSuccess, this.authorized, this.props.validateConfigFailure, undefined)
        }
    }

    authorized = () => {
        this.props.deploymentAuthorized(true)
    }

}

const mapStateToProps = state => {
    return {
        config: state.config.config,
        errorUploadConfig: state.config.errorUploadConfig,
        errorValidateConfig: state.config.errorValidateConfig,
        errorGenerateConfig: state.config.errorGenerateConfig,
        errorDeploymentStart: state.config.errorDeploymentStart,
        errorDeploymentRunning: state.config.errorDeploymentRunning,
        statusUploadConfig: state.config.statusUploadConfig,
        statusValidateConfig: state.config.statusValidateConfig,
        statusGenerateConfig: state.config.statusGenerateConfig,
        statusDeploymentStart: state.config.statusDeploymentStart,
        statusDeploymentRunning: state.config.statusDeploymentRunning,
        isAuthorized: state.config.isAuthorized,
        isRunning: state.config.isRunning,
        responseDeploymentRunning: state.config.responseDeploymentRunning,
        inceptionSetupCompleted: state.cr.inceptionSetupCompleted,
        extensionsStates: state.states.extensionsStates,
        extensionsRequestStatus: state.states.status,
        responseFetchConfig: state.config.responseFetchConfig,
        configurationConfigName: state.config.configName,
        uimetadataConfigs: state.uimetadata.uimetadataConfigs,
        uimetadataAllConfigsNames: state.uimetadata.uimetadataAllConfigsNames,
        uimetadata: state.uimetadata.uimetadata,
        uimetadataError: state.uimetadata.error,
        uimetadataPrevious: state.uimetadata.uimetadataPrevious,
    }
}

const mapDispatchToProps = dispatch => ({
    uploadConfig: () => dispatch(uploadConfig()),
    receiveConfigSuccess: (response) => dispatch(receiveConfigSuccess(response)),
    receiveConfigFailure: (error) => dispatch(receiveConfigFailure(error)),
    fetchConfiguration: () => dispatch(fetchConfiguration()),
    fetchConfigurationSuccess: (response) => dispatch(fetchConfigurationSuccess(response)),
    fetchConfigurationFailure: (error) => dispatch(fetchConfigurationFailure(error)),
    fetchConfigurationConfigName: () => dispatch(fetchConfigurationConfigName()),
    fetchConfigurationConfigNameSuccess: (response) => dispatch(fetchConfigurationConfigNameSuccess(response)),
    fetchConfigurationConfigNameFailure: (error) => dispatch(fetchConfigurationConfigNameFailure(error)),
    fetchUIMetadataAllConfigsNames: () => dispatch(fetchUIMetadataAllConfigsNames()),
    fetchUIMetadataAllConfigsNamesSuccess: (response) => dispatch(fetchUIMetadataAllConfigsNamesSuccess(response)),
    fetchUIMetadataAllConfigsNamesFailure: (error) => dispatch(fetchUIMetadataAllConfigsNamesFailure(error)),
    fetchUIMetadata: () => dispatch(fetchUIMetadata()),
    fetchUIMetadataSuccess: (response) => dispatch(fetchUIMetadataSuccess(response)),
    fetchUIMetadataFailure: (error) => dispatch(fetchUIMetadataFailure(error)),
    fetchUIMetadataPrevious: () => dispatch(fetchUIMetadataPrevious()),
    fetchUIMetadataPreviousSuccess: (response) => dispatch(fetchUIMetadataPreviousSuccess(response)),
    fetchUIMetadataPreviousFailure: (error) => dispatch(fetchUIMetadataPreviousFailure(error)),
    validateConfig: () => dispatch(validateConfig()),
    validateConfigSuccess: (response) => dispatch(validateConfigSuccess(response)),
    validateConfigFailure: (error) => dispatch(validateConfigFailure(error)),
    generateConfig: () => dispatch(generateConfig()),
    generateConfigSuccess: (response) => dispatch(generateConfigSuccess(response)),
    generateConfigFailure: (error) => dispatch(generateConfigFailure(error)),
    deploymentAuthorized: (authorized) => dispatch(deploymentAuthorized(authorized)),
    deploymentStart: () => dispatch(deploymentStart()),
    deploymentSuccess: (response) => dispatch(deploymentSuccess(response)),
    deploymentFailure: (error) => dispatch(deploymentFailure(error)),
    deploymentIsRunning: (running) => dispatch(deploymentIsRunning(running)),
    deploymentRunning: () => dispatch(deploymentRunning()),
    deploymentRunningSuccess: (response) => dispatch(deploymentRunningSuccess(response)),
    deploymentRunningFailure: (error) => dispatch(deploymentRunningFailure(error)),
    fetchStatesExtensions: () => dispatch(fetchStatesExtensions()),
    fetchStatesExtensionsSuccess: (response) => dispatch(fetchStatesExtensionsSuccess(response)),
    fetchStatesExtensionsFailure: (error) => dispatch(fetchStatesExtensionsFailure(error)),
    updateModal: (data) => dispatch(updateModal(data)),
    handleClose: () => dispatch(updateModal({ open: false, type: '' })),
    updateConfiguration: (config) => dispatch(updateConfiguration(config)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(UploadConfig))
