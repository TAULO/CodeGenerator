/*global define:true */
define([
	'underscore',
	'backbone',
	'DataLayer/ModelSyncExtension',
	'DataLayer/ServerInteractionSerializersHash',
	'Models/Constants',
	'text!Templates/TestCustomFieldsRow.html',
	'text!Templates/TestCustomFieldsText.html',
	'text!Templates/TestCustomFieldsList.html'
], function (_, Backbone, ModelSyncExtension, ServerInteractionSerializersHash, Constants, TestCustomFieldsRowHtml, TestCustomFieldsText, TestCustomFieldsList) {
	'use strict';

	var textTpl = _.template(TestCustomFieldsText),
		listTpl = _.template(TestCustomFieldsList),
		gridTpl = _.template(TestCustomFieldsRowHtml);

	var Extension = Backbone.Model.extend({

		'defaults': {
			id: null,
			entity: null,
			name: null,
			type: null,
			properties: [],
			filters: [],
			list: []
		},

		getHtml: function (gridView) {

			gridView = gridView || false;

			var isRequiredField = (this.get('properties') || []).indexOf(Constants.CustomFields.Required) !== -1,
				id = this.get('id'),
				name = this.get('name'),
				list = this.get('list'),
				type = this.get('type'),
				isNumericField = type === Constants.CustomFields.Numeric,
				o = {
					"id": id,
					"name": name,
					"list": list,
					required: isRequiredField,
					numeric: isNumericField,
					type: type,
					delimiter: '; ',
					Constants: Constants
				};

			if (gridView) {
				return gridTpl(o);
			}
			else {
				return type === Constants.CustomFields.List ? listTpl(o) : textTpl(o);
			}
		}

	});

	ModelSyncExtension.extend(Extension.prototype, {
		"changeList": ServerInteractionSerializersHash.ExtensionManager.changeList,
		"changeProperties": ServerInteractionSerializersHash.ExtensionManager.changeProperties,
		"createListExtension": ServerInteractionSerializersHash.ExtensionManager.createListExtension,
		"createSimpleExtension": ServerInteractionSerializersHash.ExtensionManager.createSimpleExtension,
		"delete": ServerInteractionSerializersHash.ExtensionManager.deleteExtension,
		"modifyExtensionName": ServerInteractionSerializersHash.ExtensionManager.modifyExtensionName
	});

	return Extension;
});
