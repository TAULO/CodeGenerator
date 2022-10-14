const formatters = require('./formatters');
const utils = require('./../utils/utils');
const Method = require('./method');
const Property = require('./property');

var extend = function (ygg) {
    var ex = function (extension) {

        var extendedObject;
        if (extension.property) {
            if (!ygg[extension.property]) {
                ygg[extension.property] = {};
            }
            extendedObject = ygg[extension.property];
        } else {
            extendedObject = ygg;
        }

        if (extension.methods) {
            extension.methods.forEach(function (method) {
                method.attachToObject(extendedObject);
                method.setRequestManager(ygg._requestManager);
            });
        }

        if (extension.properties) {
            extension.properties.forEach(function (property) {
                property.attachToObject(extendedObject);
                property.setRequestManager(ygg._requestManager);
            });
        }
    };

    ex.formatters = formatters; 
    ex.utils = utils;
    ex.Method = Method;
    ex.Property = Property;

    return ex;
};



module.exports = extend;

