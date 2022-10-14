/*
 * Copyright © 2016-2018 dujoy.cn
 */
import ExtensionTableDirective from './extension-table.directive';
import ExtensionFormHttpDirective from './extensions-forms/extension-form-http.directive';
import ExtensionFormMqttDirective from './extensions-forms/extension-form-mqtt.directive'
import ExtensionFormOpcDirective from './extensions-forms/extension-form-opc.directive';
import ExtensionFormModbusDirective from './extensions-forms/extension-form-modbus.directive';

import {ParseToNull} from './extension-dialog.controller';

export default angular.module('thingsboard.extension', [])
    .directive('tbExtensionTable', ExtensionTableDirective)
    .directive('tbExtensionFormHttp', ExtensionFormHttpDirective)
    .directive('tbExtensionFormMqtt', ExtensionFormMqttDirective)
    .directive('tbExtensionFormOpc', ExtensionFormOpcDirective)
    .directive('tbExtensionFormModbus', ExtensionFormModbusDirective)
    .directive('parseToNull', ParseToNull)
    .name;