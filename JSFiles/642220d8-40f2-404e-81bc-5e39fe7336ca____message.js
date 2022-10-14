/**
 * @fileoverview Definition of jspb.Message.
 */

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.json');
goog.require('goog.object');

goog.provide('jspb.ExtensionFieldInfo');
goog.provide('jspb.Message');


/**
 * Stores information for a single extension field.
 *
 * For example, an extension field defined like so:
 *
 *     extend BaseMessage {
 *       optional MyMessage my_field = 123;
 *     }
 *
 * will result in an ExtensionFieldInfo object with these properties:
 *
 *     {
 *       fieldIndex: 123,
 *       fieldName: {my_field_renamed: 0},
 *       ctor: proto.example.MyMessage,
 *       toObjectFn: proto.example.MyMessage.toObject,
 *       isRepeated: 1
 *     }
 *
 * We include `toObjectFn` to allow the JSCompiler to perform dead-code removal
 * on unused toObject() methods.
 *
 * If an extension field is primitive, ctor and toObjectFn will be null.
 * isRepeated should be 0 or 1.
 *
 * @param {number} fieldNumber
 * @param {Object} fieldName This has the extension field name as a property.
 * @param {?function(new: jspb.Message, Array=)} ctor
 * @param {?function((boolean|undefined),!jspb.Message):!Object} toObjectFn
 * @param {number} isRepeated
 * @constructor
 * @struct
 * @template T
 */
jspb.ExtensionFieldInfo = function(fieldNumber, fieldName, ctor, toObjectFn,
    isRepeated) {
  /** @const */
  this.fieldIndex = fieldNumber;
  /** @const */
  this.fieldName = fieldName;
  /** @const */
  this.ctor = ctor;
  /** @const */
  this.toObjectFn = toObjectFn;
  /** @const */
  this.isRepeated = isRepeated;
};


/**
 * Base class for all JsPb messages.
 * @constructor
 * @struct
 */
jspb.Message = function() {
};


/**
 * The internal data array.
 * @type {!Array}
 * @protected
 */
jspb.Message.prototype.array;


/**
 * Wrappers are the constructed instances of message-type fields. They are built
 * on demand from the raw array data. Includes message fields, repeated message
 * fields and extension message fields. Indexed by field number.
 * @type {!Object}
 * @private
 */
jspb.Message.prototype.wrappers_;


/**
 * The object that contains extension fields, if any. This is an object that
 * maps from a proto field number to the field's value.
 * @type {Object}
 * @private
 */
jspb.Message.prototype.extensionObject_;


/**
 * Non-extension fields with a field number at or above the pivot are
 * stored in the extension object (in addition to all extension fields).
 * @type {number}
 * @private
 */
jspb.Message.prototype.pivot_;


/**
 * The JsPb message_id of this proto.
 * @type {string|undefined} the message id or undefined if this message
 *     has no id.
 * @private
 */
jspb.Message.prototype.messageId_;


/**
 * Returns the JsPb message_id of this proto.
 * @return {string|undefined} the message id or undefined if this message
 *     has no id.
 */
jspb.Message.prototype.getJsPbMessageId = function() {
  return this.messageId_;
};


/**
 * An offset applied to lookups into this.array to account for the presence or
 * absence of a messageId at position 0. For response messages, this will be 0.
 * Otherwise, it will be -1 so that the first array position is not wasted.
 * @type {number}
 * @private
 */
jspb.Message.prototype.arrayIndexOffset_;


/**
 * Returns the index into msg.array at which the proto field with tag number
 * fieldNumber will be located.
 * @param {!jspb.Message} msg Message for which we're calculating an index.
 * @param {number} fieldNumber The field number.
 * @return {number} The index.
 * @private
 */
jspb.Message.getIndex_ = function(msg, fieldNumber) {
  return fieldNumber + msg.arrayIndexOffset_;
};


/**
 * Initializes a JsPb Message.
 * @param {!jspb.Message} msg The JsPb proto to modify.
 * @param {Array|undefined} data An initial data array.
 * @param {string|number} messageId For response messages, the message id or ''
 *     if no message id is specified. For non-response messages, 0.
 * @param {number} suggestedPivot The field number at which to start putting
 *     fields into the extension object. This is only used if data does not
 *     contain an extension object already. -1 if no extension object is
 *     required for this message type.
 * @param {Array.<number>} repeatedFields The message's repeated fields.
 * @protected
 */
jspb.Message.initialize =
    function(msg, data, messageId, suggestedPivot, repeatedFields) {
  msg.wrappers_ = {};
  if (!data) {
    data = messageId ? [messageId] : [];
  }
  msg.messageId_ = messageId ? String(messageId) : undefined;
  // If the messageId is 0, this message is not a response message, so we shift
  // array indices down by 1 so as not to waste the first position in the array,
  // which would otherwise go unused.
  msg.arrayIndexOffset_ = messageId === 0 ? -1 : 0;
  msg.array = data;
  jspb.Message.materializeExtensionObject_(msg, suggestedPivot);
  if (repeatedFields) {
    for (var i = 0; i < repeatedFields.length; i++) {
      var fieldNumber = repeatedFields[i];
      if (fieldNumber < msg.pivot_) {
        var index = jspb.Message.getIndex_(msg, fieldNumber);
        msg.array[index] = msg.array[index] || [];
      } else {
        msg.extensionObject_[fieldNumber] =
            msg.extensionObject_[fieldNumber] || [];
      }
    }
  }
};


/**
 * Ensures that the array contains an extension object if necessary.
 * If the array contains an extension object in its last position, then the
 * object is kept in place and its position is used as the pivot.  If not, then
 * create an extension object using suggestedPivot.  If suggestedPivot is -1,
 * we don't have an extension object at all, in which case all fields are stored
 * in the array.
 * @param {!jspb.Message} msg The JsPb proto to modify.
 * @param {number} suggestedPivot See description for initialize().
 * @private
 */
jspb.Message.materializeExtensionObject_ = function(msg, suggestedPivot) {
  if (msg.array.length) {
    var foundIndex = msg.array.length - 1;
    var obj = msg.array[foundIndex];
    // Normal fields are never objects, so we can be sure that if we find an
    // object here, then it's the extension object. However, we must ensure that
    // the object is not an array, since arrays are valid field values.
    if (obj && typeof obj == 'object' && typeof obj.length != 'number') {
      msg.pivot_ = foundIndex - msg.arrayIndexOffset_;
      msg.extensionObject_ = obj;
      return;
    }
  }
  // This complexity exists because we keep all extension fields in the
  // extensionObject_ regardless of proto field number. Changing this would
  // simplify the code here, but it would require changing the serialization
  // format from the server, which is not backwards compatible.
  //  Should we just treat extension fields the same as
  // non-extension fields, and select whether they appear in the object or in
  // the array purely based on tag number? This would allow simplifying all the
  // get/setExtension logic, but it would require the breaking change described
  // above.
  if (suggestedPivot > -1) {
    msg.pivot_ = suggestedPivot;
    var pivotIndex = jspb.Message.getIndex_(msg, suggestedPivot);
    msg.extensionObject_ = msg.array[pivotIndex] = {};
  } else {
    msg.pivot_ = Number.MAX_VALUE;
  }
};


/**
 * Converts a JsPb repeated message field into an object list.
 * @param {!Array.<T>} field The repeated message field to be
 *     converted.
 * @param {?function(boolean=): Object|
 *     function((boolean|undefined),T): Object} toObjectFn The toObject
 *     function for this field.  We need to pass this for effective dead code
 *     removal.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Array.<Object>} An array of converted message objects.
 * @template T
 */
jspb.Message.toObjectList = function(field, toObjectFn, opt_includeInstance) {
  // Not using goog.array.map in the generated code to keep it small.
  // And not using it here to avoid a function call.
  var result = [];
  for (var i = 0; i < field.length; i++) {
    result[i] = toObjectFn.call(field[i], opt_includeInstance,
      /** @type {!jspb.Message} */ (field[i]));
  }
  return result;
};


/**
 * Adds a proto's extension data to a Soy rendering object.
 * @param {!jspb.Message} proto The proto whose extensions to convert.
 * @param {!Object} obj The Soy object to add converted extension data to.
 * @param {!Object} extensions The proto class' registered extensions.
 * @param {function(jspb.ExtensionFieldInfo) : *} getExtensionFn The proto
 *     class' getExtension function. Passed for effective dead code removal.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 */
jspb.Message.toObjectExtension = function(proto, obj, extensions,
    getExtensionFn, opt_includeInstance) {
  for (var fieldNumber in extensions) {
    var fieldInfo = extensions[fieldNumber];
    var value = getExtensionFn.call(proto, fieldInfo);
    if (value) {
      for (var name in fieldInfo.fieldName) {
        if (fieldInfo.fieldName.hasOwnProperty(name)) {
          break; // the compiled field name
        }
      }
      if (!fieldInfo.toObjectFn) {
        obj[name] = value;
      } else {
        if (fieldInfo.isRepeated) {
          obj[name] = jspb.Message.toObjectList(
              /** @type {!Array.<jspb.Message>} */ (value),
              fieldInfo.toObjectFn, opt_includeInstance);
        } else {
          obj[name] = fieldInfo.toObjectFn(opt_includeInstance, value);
        }
      }
    }
  }
};


/**
 * Gets the value of a non-extension field.
 * @param {!jspb.Message} msg A jspb proto.
 * @param {number} fieldNumber The field number.
 * @return {string|number|boolean|Array|undefined} The field's value.
 * @protected
 */
jspb.Message.getField = function(msg, fieldNumber) {
  if (fieldNumber < msg.pivot_) {
    return msg.array[jspb.Message.getIndex_(msg, fieldNumber)];
  } else {
    return msg.extensionObject_[fieldNumber];
  }
};


/**
 */
jspb.Message.prototype.cloneMessage = function() {
  return jspb.Message.clone(this);
};


/**
 * Sets the value of a non-extension field.
 * @param {!jspb.Message} msg A jspb proto.
 * @param {number} fieldNumber The field number.
 * @param {string|number|boolean|Array|undefined} value The value to set.
 * @protected
 */
jspb.Message.setField = function(msg, fieldNumber, value) {
  if (fieldNumber < msg.pivot_) {
    msg.array[jspb.Message.getIndex_(msg, fieldNumber)] = value;
  } else {
    msg.extensionObject_[fieldNumber] = value;
  }
};


/**
 * Gets and wraps a proto field on access.
 * @param {!jspb.Message} msg A jspb proto.
 * @param {function(new:jspb.Message, Array)} ctor Constructor for the field.
 * @param {number} fieldNumber The field number.
 * @param {number=} opt_required True (1) if this is a required field.
 * @return {jspb.Message} The field as a jspb proto.
 * @protected
 */
jspb.Message.getWrapperField = function(msg, ctor, fieldNumber, opt_required) {
  //  Consider copying data and/or arrays.
  if (!msg.wrappers_[fieldNumber]) {
    var data = /** @type {Array} */ (jspb.Message.getField(msg, fieldNumber));
    if (opt_required || data) {
      //  Remove existence test for always valid default protos.
      msg.wrappers_[fieldNumber] = new ctor(data);
    }
  }
  return /** @type {jspb.Message} */ (msg.wrappers_[fieldNumber]);
};


/**
 * Gets and wraps a repeated proto field on access.
 * @param {!jspb.Message} msg A jspb proto.
 * @param {function(new:jspb.Message, Array)} ctor Constructor for the field.
 * @param {number} fieldNumber The field number.
 * @return {Array.<!jspb.Message>} The repeated field as an array of protos.
 * @protected
 */
jspb.Message.getRepeatedWrapperField = function(msg, ctor, fieldNumber) {
  if (!msg.wrappers_[fieldNumber]) {
    var data = jspb.Message.getField(msg, fieldNumber);
    for (var wrappers = [], i = 0; i < data.length; i++) {
      wrappers[i] = new ctor(data[i]);
    }
    msg.wrappers_[fieldNumber] = wrappers;
  }
  return /** @type {Array.<!jspb.Message>} */ (msg.wrappers_[fieldNumber]);
};


/**
 * Sets a proto field and syncs it to the backing array.
 * @param {!jspb.Message} msg A jspb proto.
 * @param {number} fieldNumber The field number.
 * @param {jspb.Message|undefined} value A new value for this proto field.
 * @protected
 */
jspb.Message.setWrapperField = function(msg, fieldNumber, value) {
  var data = value ? value.toArray() : value;
  msg.wrappers_[fieldNumber] = value;
  jspb.Message.setField(msg, fieldNumber, data);
};


/**
 * Sets a repeated proto field and syncs it to the backing array.
 * @param {!jspb.Message} msg A jspb proto.
 * @param {number} fieldNumber The field number.
 * @param {Array.<!jspb.Message>|undefined} value An array of protos.
 * @protected
 */
jspb.Message.setRepeatedWrapperField = function(msg, fieldNumber, value) {
  value = value || [];
  for (var data = [], i = 0; i < value.length; i++) {
    data[i] = value[i].toArray();
  }
  msg.wrappers_[fieldNumber] = value;
  jspb.Message.setField(msg, fieldNumber, data);
};


/**
 * Converts a JsPb repeated message field into a map. The map will contain
 * protos unless an optional toObject function is given, in which case it will
 * contain objects suitable for Soy rendering.
 * @param {!Array.<T>} field The repeated message field to be
 *     converted.
 * @param {function() : string?} mapKeyGetterFn The function to get the key of
 *     the map.
 * @param {?function(boolean=): Object|
 *     function((boolean|undefined),T): Object} opt_toObjectFn The
 *     toObject function for this field. We need to pass this for effective
 *     dead code removal.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object.<string, Object>} A map of proto or Soy objects.
 * @template T
 */
jspb.Message.toMap = function(
    field, mapKeyGetterFn, opt_toObjectFn, opt_includeInstance) {
  var result = {};
  for (var i = 0; i < field.length; i++) {
    result[mapKeyGetterFn.call(field[i])] = opt_toObjectFn ?
        opt_toObjectFn.call(field[i], opt_includeInstance,
            /** @type {!jspb.Message} */ (field[i])) : field[i];
  }
  return result;
};


/**
 * Returns the internal array of this proto.
 * <p>Note: If you use this array to construct a second proto, the content
 * would then be partially shared between the two protos.
 * @return {!Array} The proto represented as an array.
 */
jspb.Message.prototype.toArray = function() {
  return this.array;
};


/**
 * Serializes a JsPb proto for use in server requests.
 * @return {string} The serialized proto.
 */
jspb.Message.prototype.serialize = function() {
  if (goog.global.JSON && goog.global.JSON.stringify) {
    return goog.global.JSON.stringify(this.toArray());
  } else {
    return goog.json.serialize(this.toArray());
  }
};


/**
 * Creates a string representation of the internal data array of this proto.
 * <p>NOTE: This string is *not* suitable for use in server requests.
 * @return {string} A string representation of this proto.
 * @override
 */
jspb.Message.prototype.toString = function() {
  return this.array.toString();
};


/**
 * Gets the value of the extension field from the extended object.
 * @param {jspb.ExtensionFieldInfo.<T>} fieldInfo Specifies the field to get.
 * @return {T} The value of the field.
 * @template T
 */
jspb.Message.prototype.getExtension = function(fieldInfo) {
  var fieldNumber = fieldInfo.fieldIndex;
  if (fieldInfo.isRepeated) {
    if (fieldInfo.ctor) {
      if (!this.wrappers_[fieldNumber]) {
        this.wrappers_[fieldNumber] =
            goog.array.map(this.extensionObject_[fieldNumber] || [],
                function(arr) {
                  return new fieldInfo.ctor(arr);
                });
      }
      return this.wrappers_[fieldNumber];
    } else {
      return this.extensionObject_[fieldNumber];
    }
  } else {
    if (fieldInfo.ctor) {
      if (!this.wrappers_[fieldNumber] && this.extensionObject_[fieldNumber]) {
        this.wrappers_[fieldNumber] = new fieldInfo.ctor(
            /** @type {Array|undefined} */ (
                this.extensionObject_[fieldNumber]));
      }
      return this.wrappers_[fieldNumber];
    } else {
      return this.extensionObject_[fieldNumber];
    }
  }
};


/**
 * Sets the value of the extension field in the extended object.
 * @param {jspb.ExtensionFieldInfo} fieldInfo Specifies the field to set.
 * @param {jspb.Message|string|number|boolean|Array} value The value to set.
 */
jspb.Message.prototype.setExtension = function(fieldInfo, value) {
  var fieldNumber = fieldInfo.fieldIndex;
  if (fieldInfo.isRepeated) {
    value = value || [];
    if (fieldInfo.ctor) {
      this.wrappers_[fieldNumber] = value;
      this.extensionObject_[fieldNumber] = goog.array.map(
          /** @type {Array.<jspb.Message>} */ (value), function(msg) {
        return msg.toArray();
      });
    } else {
      this.extensionObject_[fieldNumber] = value;
    }
  } else {
    if (fieldInfo.ctor) {
      this.wrappers_[fieldNumber] = value;
      this.extensionObject_[fieldNumber] = value ? value.toArray() : value;
    } else {
      this.extensionObject_[fieldNumber] = value;
    }
  }
};


/**
 * Creates a difference object between two messages.
 *
 * The result will contain the top-level fields of m2 that differ from those of
 * m1 at any level of nesting. No data is cloned, the result object will
 * share its top-level elements with m2 (but not with m1).
 *
 * Note that repeated fields should not have null/undefined elements, but if
 * they do, this operation will treat repeated fields of different length as
 * the same if the only difference between them is due to trailing
 * null/undefined values.
 *
 * @param {!jspb.Message} m1 The first message object.
 * @param {!jspb.Message} m2 The second message object.
 * @return {!jspb.Message} The difference returned as a proto message.
 *     Note that the returned message may be missing required fields. This is
 *     currently tolerated in Js, but would cause an error if you tried to
 *     send such a proto to the server. You can access the raw difference
 *     array with result.toArray().
 * @throws {Error} If the messages are responses with different types.
 */
jspb.Message.difference = function(m1, m2) {
  if (!(m1 instanceof m2.constructor)) {
    throw new Error('Messages have different types.');
  }
  var arr1 = m1.toArray();
  var arr2 = m2.toArray();
  var res = [];
  var start = 0;
  var length = arr1.length > arr2.length ? arr1.length : arr2.length;
  if (m1.getJsPbMessageId()) {
    res[0] = m1.getJsPbMessageId();
    start = 1;
  }
  for (var i = start; i < length; i++) {
    if (!jspb.Message.compareFields(arr1[i], arr2[i])) {
      res[i] = arr2[i];
    }
  }
  return new m1.constructor(res);
};


/**
 * Tests whether two messages are equal.
 * @param {jspb.Message|undefined} m1 The first message object.
 * @param {jspb.Message|undefined} m2 The second message object.
 * @return {boolean} true if both messages are null/undefined, or if both are
 *     of the same type and have the same field values.
 */
jspb.Message.equals = function(m1, m2) {
  return m1 == m2 || (!!(m1 && m2) && (m1 instanceof m2.constructor) &&
      jspb.Message.compareFields(m1.toArray(), m2.toArray()));
};


/**
 * Compares two message fields recursively.
 * @param {*} field1 The first field.
 * @param {*} field2 The second field.
 * @return {boolean} true if the fields are null/undefined, or otherwise equal.
 */
jspb.Message.compareFields = function(field1, field2) {
  if (goog.isObject(field1) && goog.isObject(field2)) {
    var obj1 = /** @type {!Object} */ (field1);
    var obj2 = /** @type {!Object} */ (field2);
    var keys = {}, name, extensionObject1, extensionObject2;
    for (name in obj1) {
      obj1.hasOwnProperty(name) && (keys[name] = 0);
    }
    for (name in obj2) {
      obj2.hasOwnProperty(name) && (keys[name] = 0);
    }
    for (name in keys) {
      var val1 = obj1[name], val2 = obj2[name];
      if (goog.isObject(val1) && !goog.isArray(val1)) {
        if (extensionObject1 !== undefined) {
          throw new Error('invalid jspb state');
        }
        extensionObject1 = goog.object.isEmpty(val1) ? undefined : val1;
        val1 = undefined;
      }
      if (goog.isObject(val2) && !goog.isArray(val2)) {
        if (extensionObject2 !== undefined) {
          throw new Error('invalid jspb state');
        }
        extensionObject2 = goog.object.isEmpty(val2) ? undefined : val2;
        val2 = undefined;
      }
      if (!jspb.Message.compareFields(val1, val2)) {
        return false;
      }
    }
    if (extensionObject1 || extensionObject2) {
      return jspb.Message.compareFields(extensionObject1, extensionObject2);
    }
    return true;
  }
  // Primitive fields, null and undefined compare as equal.
  // This also forces booleans and 0/1 to compare as equal to ensure
  // compatibility with the jspb serializer.
  return field1 == field2;
};


/**
 * Static clone function. NOTE: A type-safe clone function exists on each
 * generated JsPb class. Do not call this function directly.
 * @param {!jspb.Message} msg A message to clone.
 * @return {!jspb.Message} A deep clone of the given message.
 */
jspb.Message.clone = function(msg) {
  // Although we could include the wrappers, we leave them out here.
  return new msg.constructor(jspb.Message.clone_(msg.toArray()));
};


/**
 * Helper for cloning an internal JsPb object.
 * @param {!Object} obj A JsPb object, eg, a field, to be cloned.
 * @return {!Object} A clone of the input object.
 * @private
 */
jspb.Message.clone_ = function(obj) {
  var o, clone = goog.isArray(obj) ? [] : {};
  for (var key in obj) {
    if ((o = obj[key]) != null) {
      clone[key] = typeof o == 'object' ? jspb.Message.clone_(o) : o;
    }
  }
  return clone;
};


/**
 * Builds a JsPb message proto from Js array data. This is intended for code
 * like the Request Queue which might need to build protos without knowing
 * their type in advance. The proto type must have a JsPb message_id option.
 * To construct a proto object when you know the type in advance, you should
 * call its constructor directly.
 * @param {!Array} data The response data array.
 * @return {!jspb.Message} The converted proto message.
 * @throws {Error} If the message type is unknown, or the data fails to convert.
 */
jspb.Message.buildMessageFromArray = function(data) {
  var messageCtor = jspb.Message.registry_[data[0]];
  if (!messageCtor) {
    throw Error('Unknown JsPb message type: ' + data[0]);
  }
  return new messageCtor(data);
};


/**
 * Registers a JsPb message type id with its constructor.
 * @param {string} id The id for this type of message.
 * @param {Function} constructor The message constructor.
 */
jspb.Message.registerMessageType = function(id, constructor) {
  jspb.Message.registry_[id] = constructor;
  // This is needed so we can later access messageId directly on the contructor,
  // otherwise it is not available due to 'property collapsing' by the compiler.
  constructor.messageId = id;
};


/**
 * The registry of message ids to message constructors.
 * @private
 */
jspb.Message.registry_ = {};


/**
 * The extensions registered on MessageSet. This is a map of extension
 * field number to field info object. This should be considered as a
 * private API.
 *
 * This is similar to [jspb class name].extensions object for
 * non-MessageSet. We special case MessageSet so that we do not need
 * to goog.require MessageSet from classes that extends MessageSet.
 *
 * @type {!Object.<number, jspb.ExtensionFieldInfo>}
 */
jspb.Message.messageSetExtensions = {};
