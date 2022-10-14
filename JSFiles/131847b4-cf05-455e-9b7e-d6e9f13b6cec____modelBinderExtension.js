


function modelBinderExtension(deprecate, modelBinder) {

	var modelBinderExtension, extension;

	extension = {
		bindModelToView: function (model, el) {
			deprecate.log("modelBinderExtension.extension.bindModelToView");

			var binder,
			    listeners = this._listeners || (this._listeners = {});

			el = el || this.$el;
			model = model || this.model || this.collection;
			binder = modelBinder.create(model, el);
			listeners[_.uniqueId("ModelBinder")] = binder;
		},

		bindTemplate: function (template, el, model) {
			deprecate.log("modelBinderExtension.extension.bindTemplate");

			el = el || this.$el;
			model = model || this.model;
			this.template(template, el)(model ? model.toJSON() : {});
			this.bindModelToView(model, el);
		}
	};

	modelBinderExtension = {
		extend: function (view) {
			/// <summary>
			/// Provide an extension that unbinds the model binder during
			/// the .remove/stopListening view method call.
			/// If an element is not passed, the views $el will be used.
			/// If a model is not passed, this.model or this.collection will be used.
			/// </summary>
			deprecate.log("modelBinderExtension.extend");

			_.extend(view, extension);
		}
	};

	return modelBinderExtension;
}


context.module("bbext").service("modelBinderExtension", ["deprecate", "modelBinder", bbext.modelBinderExtension = modelBinderExtension]);
