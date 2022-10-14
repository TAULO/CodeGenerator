const _ = require('lodash');

/**
 * @ngdoc module
 * @name fl.object_system
 * @module fl
 * @description
 *  The Fl object system manages class definitions and object instantiation.
 */

/**
 * @ngdoc service
 * @name FlExtensions
 * @module fl.object_system
 * @description
 * A service to provide class extension functionality.
 * A class extension is an object that contains information about how to extend the functionality of
 * another object (typically, a class).
 * 
 * An extension has up to four components:
 * - *instance_methods* are functions to be installed in the object's prototype, if one is present.
 * - *class_methods* are functions to be installed in the object itself.
 * - *methods* acts as an alias for *instance_methods*, and also is used to provide dynamic method
 *   definitions, as described in {@sref FlExtensions#register}.
 * - the *initializer* is a function called during object construction, and used to initialize
 *   properties related to the extension.
 *
 * All properties are optional, although an extension that defines none is obviously not very useful.
 * 
 * The *methods* component can be implemented as either an object (hash), or as a function; the extension
 * utilities install it differently, depending on its type; see {@sref FlExtensions#register}.
 * The *class_methods* and *instance_methods* components are always objects.
 *
 * For example, this extension defines a method `_append` that appends two values to a common prefix,
 * and an initializer that load the value of the prefix in the `_$scope` property.
 * (It assumes that `this` has defined a `_$cope` property.)
 * ```
 *    let MyExtension = FlExtensions.named('MyExtension', {
 *      methods: {
 *        _append: function(one, two) {
 *          returns this._$scope._prefix + one + ':' + two;
 *        }
 *      },
 *      initializer: function(pass) {
 *        if (pass == 'post')
 *        {
 *          this._$scope._prefix = 'my prefix: ';
 *        }
 *      }
 *    });
 * ```
 */

let FlExtensions = { };

FlExtensions._named_registry = { };
FlExtensions.AlreadyRegistered = function AlreadyRegistered(message) {
    this.message = message;
    this.name = 'AlreadyRegistered';
};
FlExtensions.AlreadyRegistered.prototype.constructor = FlExtensions.AlreadyRegistered;

FlExtensions.NotRegistered = function NotRegistered(message) {
    this.message = message;
    this.name = 'NotRegistered';
};
FlExtensions.NotRegistered.prototype.constructor = FlExtensions.NotRegistered;

/**
 * @ngdoc method
 * @name FlExtensions#named
 * @classmethod
 * @module fl.object_system
 * @description
 * Create a named extension, which clients can then find by name.
 * 
 * @param {string} name The extension name.
 * @param {object} ext The extension.
 * @param {boolean} overwrite If `true` and an extension by this name is already registered, overwrite
 *  the current value. Otherwise, throw an exception.
 * 
 * @return {object} Returns _ext_.
 * 
 * @throws Throws an exception if _name_ is already registered.
 */

FlExtensions.named = function(name, ext, overwrite) {
    let xo = FlExtensions._named_registry[name];
    if (_.isObject(xo))
    {
	if (overwrite === true)
	{
	    xo.extension = ext;
	}
	else
	{
	    throw new FlExtensions.AlreadyRegistered('extension :' + name + ' is already registered');
	}
    }
    else
    {
	FlExtensions._named_registry[name] = { name: name, extension: ext };
    }

    return ext;
};

/**
 * @ngdoc method
 * @name FlExtensions#list
 * @classmethod
 * @module fl.object_system
 * @description
 * List the registered extensions.
 * 
 * @param {boolean} full If `true`, the element in the returned array are objects containing two
 *  property: *name* is the extension name, and *extension* the extension object. Otherwise,
 *  the returned array contains just the registered names for the extensions.
 *
 * @return {array} Returns an array containing all registered extensions.
 */

FlExtensions.list = function(full) {
    let xf = (full === true) ? true : false;
    
    return _.reduce(FlExtensions._named_registry, function(acc, ev, ek) {
	acc.push((xf) ? ev : ek);
	return acc;
    }, [ ]);
};

/**
 * @ngdoc method
 * @name FlExtensions#lookup
 * @classmethod
 * @module fl.object_system
 * @description
 * Look up a named extension.
 * 
 * @param {string|object} name The extension name or descriptor.
 *  If the value is an object, it must contain one of the properties **methods** or **initializer**,
 *  or both, and **methods** must be an object or a function and **initializer** a function.
 *  In this case, the method returns _name_.
 * @param {boolean} raise Controls the behavior on a lookup failure.
 * 
 * @return {object} Returns the extension. If _name_ is not the name of a registered extension, it
 *  returns `undefined` if _raise_ is `false`, and throws an exception if _raise_ is any other value
 *  (hence by default the function raises an exception).
 * 
 * @throws Throws an exception if _name_ is not registered.
 */

FlExtensions.lookup = function(name, raise) {
    if (_.isObject(name))
    {
	if (!(_.isObject(name.methods) || _.isFunction(name.methods)) && !_.isFunction(name.initializer))
	{
	    throw new FlExtensions.NotRegistered('lookup of extension by object must include either :methods or :initializer');
	}
	
	return name;
    }
    else
    {
	if (FlExtensions._named_registry[name]) return FlExtensions._named_registry[name].extension;
    }
    
    if (raise === false) return undefined;

    throw new FlExtensions.NotRegistered('extension :' + name + ' is not registered');
};

/**
 * @ngdoc method
 * @name FlExtensions#register
 * @classmethod
 * @module fl.object_system
 * @description
 * Register the method components of an extension with an object.
 * 
 * If _ex_**.class_methods** is present, the function iterates over all properties defined in
 * _ex_**.class_methods**, and assigns their value to a property by the same name in _obj_.
 * 
 * If _ex_**.instance_methods** is present, the function iterates over all properties defined in
 * _ex_**.instance_methods**, and assigns their value to a property by the same name in _obj_'s prototpye
 * (if one is defined).
 * 
 * If _ex_**.methods** is an object, it behaves as for the _ex_.**instance_methods** property; in other
 * words, it acts as an alias for _ex_.**instance_methods**.
 * 
 * If _ex_**.methods** is a function, it calls it using _obj_ as the **this** for the call; the assumption is
 * that the extension function then proceeds to define properties in _obj_ as needed. This makes it possible
 * to set methods in _obj_ dynamically.
 * 
 * @param {Object|String} ex The extension to add to _obj_; if passed as a string, the value is looked up
 *  in the extensions registry.
 * @param {Object} obj The object to extend with the contents of _ex_**.methods**.
 *
 * @return {Object} Returns _obj_.
 */

FlExtensions.register = function(ex, obj) {
    ex = FlExtensions.lookup(ex, false);

    if (!_.isNil(obj) && !_.isNil(ex))
    {
	let proto = obj.prototype;

	if (_.isObject(ex.class_methods))
	{
	    _.forEach(ex.class_methods, function(mv, mk) {
		obj[mk] = mv;
	    });
	}

	if (_.isObject(ex.instance_methods) && !_.isUndefined(proto))
	{
	    _.forEach(ex.instance_methods, function(mv, mk) {
		proto[mk] = mv;
	    });
	}
	
	if (_.isFunction(ex.methods))
	{
	    ex.methods.call(obj);
	}
	else if (_.isObject(ex.methods) && !_.isUndefined(proto))
	{
	    _.forEach(ex.methods, function(mv, mk) {
		proto[mk] = mv;
	    });
	}
    }

    return obj;
};

/**
 * @ngdoc method
 * @name FlExtensions#initialize
 * @classmethod
 * @module fl.object_system
 * @description
 * Call the extension initializer on an object.
 * 
 * If _ex_**.initializer** is a function, it calls it using _obj_ as the **this** for the call; the assumption
 * is that the extension function then proceeds to modify the state of _obj_ as needed.
 * 
 * @param {Object} ex The extension to initialize in _obj_; if passed as a string, the value is looked up
 *  in the extension registry.
 * @param {Object} obj The object to extend by _ex_**.initializer**; this is typically an object or a function.
 * @param {String} pass The initialization pass:
 *  - **pre** The initializer is being called before the object state is constructed: this is used to set up
 *    state that the object's initializer may need.
 *  - **post** The initializer is being called after the object state is constructed.
 *  The value of _pass_ is passed to the initializer.
 *
 * @return {Object} Returns _obj_.
 */

FlExtensions.initialize = function(ex, obj, pass) {
    ex = FlExtensions.lookup(ex, false);
    if (!_.isNil(obj) && !_.isNil(ex) && _.isFunction(ex.initializer))
    {
	ex.initializer.call(obj, pass);
    }

    return obj;
};

/**
 * @ngdoc type
 * @name FlRoot
 * @module fl.object_system
 * @description
 * The root class for all Fl classes.
 *
 * This is the root of the Fl class hierarchy; {@sref FlClassManager#make_class} uses it as the
 * superclass if one is not defined in the options.
 *
 * Note that FlRoot is a ECMAScript 2015 (and later) class.
 * 
 * @class FlRoot
 */

const FlRoot = class FlRoot {
    constructor() {
	this.__extensions = [ ];
    }
};

FlRoot.__name = 'FlRoot';
FlRoot.__superclass = null;
FlRoot.__extensions = [ ];
FlRoot.prototype.initialize = function() { };

/**
 * @ngdoc method
 * @name FlRoot#__init_extensions
 * @module fl.object_system
 * @description
 * Load the **initializer** component of a set of extensions.
 *
 * If _ext_ is an object, it iterates over all its elements and registers each
 * extension's **initializer** component with **this**, using {@sref FlExtensions#initialize}.
 * This initializes all the listed extension properties in the object.
 * 
 * The class builder {@sref FlClassManager#make_class} automatically generates a call to this method
 * in each class initializer, passing the extensions in the class options' **extensions** property.
 * 
 * @param {Array} ext An array containing the extension descriptors.
 * @param {String} pass The initialization pass; see {@sref FlExtensions#initialize}.
 */

FlRoot.prototype.__init_extensions = function(ext, pass) {
    let self = this;
    _.forEach(ext, function(ev, eidx) {
	FlExtensions.initialize(ev, self, pass);
    });
};

FlRoot.UndefinedSuper = function UndefinedSuper(message) {
    this.message = message;
    this.name = 'UndefinedSuper';
};
FlRoot.UndefinedSuper.prototype.constructor = FlRoot.UndefinedSuper;

/**
 * @ngdoc method
 * @name FlRoot#__super_init
 * @module fl.object_system
 * @description
 * Calls the initializer for the superclass.
 *
 * This method looks up the class in *name*, which should be the superclass, and then calls its
 * **initialize** method, passing all the remaining arguments. The **initialize** method is bound
 * to the **this** value.
 * 
 * @param {String|Function} name The name of the superclass, or the superclass constructor.
 *  If not provided, use {@sref FlRoot}.
 */

FlRoot.prototype.__super_init = function(name) {
    let args = Array.from(arguments);
    args.shift();
    args.unshift('initialize');
    args.unshift(name);
    return this.__super.apply(this, args);
};

/**
 * @ngdoc method
 * @name FlRoot#__super
 * @module fl.object_system
 * @description
 * Calls the superclass implementation of a method.
 *
 * This method looks up the class in *sc*, which should be the superclass, then looks up the method
 * *name* in its prototype, which it then calls, passing all the remaining arguments.
 * The called method is bound to the **this** value.
 *
 * @param {String|Function} sc The name of the superclass, or the superclass constructor.
 *  If `null` or `undefined`, use {@sref FlRoot}.
 * @param {String} name The name of the method to call.
 */

FlRoot.prototype.__super = function(sc, name) {
    if (_.isNil(sc)) sc = FlRoot;
    let cl = FlClassManager.get_class(sc);
    if (!_.isFunction(cl)) throw new FlClassManager.MissingClass(`superclass '${sc}' is not registered`);
    if (!_.isFunction(cl.prototype[name])) throw new FlRoot.UndefinedSuper(`superclass ${cl.__name} does not implement method '${name}'`);
    
    let args = Array.from(arguments);
    return cl.prototype[name].apply(this, args.slice(2));
};

/**
 * @ngdoc service
 * @name FlClassManager
 * @module fl.object_system
 * @description
 * A service to manage class hierarchies and create class instances.
 */

const FlClassManager = {
    _class_registry: {
	'FlRoot': FlRoot
    }
};

FlClassManager.MissingClass = function MissingClass(message) {
    this.message = message;
    this.name = 'MissingClass';
};
FlClassManager.MissingClass.prototype.constructor = FlClassManager.MissingClass;

FlClassManager.AlreadyDefinedClass = function AlreadyDefinedClass(message) {
    this.message = message;
    this.name = 'AlreadyDefinedClass';
};
FlClassManager.AlreadyDefinedClass.prototype.constructor = FlClassManager.AlreadyDefinedClass;

FlClassManager.NotAClass = function NotAClass(message) {
    this.message = message;
    this.name = 'NotAClass';
};
FlClassManager.NotAClass.prototype.constructor = FlClassManager.NotAClass;

FlClassManager.AlreadyDefinedClass = function AlreadyDefinedClass(message) {
    this.message = message;
    this.name = 'AlreadyDefinedClass';
};
FlClassManager.AlreadyDefinedClass.prototype.constructor = FlClassManager.AlreadyDefinedClass;

/**
 * @ngdoc method
 * @name FlClassManager#make_class
 * @classmethod
 * @module fl.object_system
 * @description
 * Build an ECMAScript 2015 class.
 *
 * The class is built as follows:
 *  1. If **opts.superclass** is not present, or if it does not resolve to a function, set the superclass
 *     to {@sref FlRoot}.
 *  2. Define a ECMASCRIPT 2015 class with a constructor and the `__super` method.
 *  3. The constructor first calls `super` with no arguments, and then calls an initializer
 *     wrapper generated as follows:
 *     - If **opts.initializer** is not defined, an initializer is generated that calls the superclass
 *       initializer. Note that, if an initializer is provided,
 *       it should make a call to `__super_init` in order to initialize the superclass; in this case,
 *       the argument list for the `__super_init` method is defined by the initializer code.
 *     - The initializer is wrapped by a function that performs the following steps:
 *       1. Initializes the registered extensions from **opts.extensions**, setting the pass name to `pre`.
 *       2. Calls the initializer from the previous step.
 *       3. Initializes the registered extensions from **opts.extensions**, setting the pass name to `post`.
 *  4. A number of properties are set in the class:
 *     - **__name** contains the class name.
 *     - **__extensions** is an array of all registered extensions, including those that were registered
 *       in the superclasses.
 *     - **__superclass** is the superclass constructor.
 *     - **initialize** is the value of **opts.initializer** (or the generated function if
 *       **opts.initializer** was not defined).
 *  5. A number of properties are set in the class prototype, and are therefore inherited by class instances:
 *     - **__class** is the class constructor.
 *     - **__superclass** is the superclass constructor; note that this could also be obtained from
 *       **__class**.
 *  6. A default **factory** class method is defined that creates an instance object. This method takes the
 *     same parameters as the constructor, and is defined early enough that it can be overridden by a
 *     **factory** method defined in **class_methods**.
 *  8. Iterate over all elements of **opts.extensions** register each extension with the class,
 *     using {@sref FlExtensions#register}. 
 *  9. If **opts.instance_methods** is an object, copy all its key/value pairs to the prototype;
 *     this registers additional instance methods.
 * 10. If **opts.class_methods** is an object, copy all its key/value pairs to the constructor;
 *     this registers additional class (static) methods.
 * 11. If **opts.class_properties** is an object, register all its key/value pairs as properties in the
 *     constructor.
 * 12. If **opts.instance_properties** is an object, register all its key/value pairs as properties in the
 *     prototype.
 * 13. Register the class under the given class name; {@sref FlClassManager#get_class} can be used
 *     to fetch class constructors by name, and {@sref FlClassManager#instance_factory} to create
 *     instances of a given class.
 * 
 * Note that the order in which actions are performed implies that instance methods by the same name as those
 * loaded in the extensions will override the extension implementations.
 *
 * ##### The **__super** and **__super_init** methods
 *
 * JavaScript classes use the `super` keyword to instruct the code to look up a method in the class
 * inheritance chain. For example:
 * ```
 * class Sub extends Base {
 *   constructor() { super(); }
 *   my_method(arg) {
 *     super.my_method(arg);
 *     do_my_work(arg);
 *   }
 * };
 * ```
 * Unfortunately, `super` is available only in methods defined in the class body, so that instance methods
 * in **opts.instance_methods** won't be able to call the superclass implementation.
 * {@sref FlRoot} defines the {@sref FlRoot#__super} method that provides equivalent functionality,
 * at the cost of some ugliness.
 * The arguments for {@sref FlRoot#__super} are the superclass name and the method name, followed by
 * arguments to the method itself; therefore, the equivalent usage of {@sref FlRoot#__super} is as follows:
 * ```
 * let Sub = FlClassManager.make_class({
 *   name: 'Sub',
 *   superclass: 'Base',
 *   instance_methods: {
 *     my_method: function(arg) {
 *       this.__super('Base', 'my_method', arg);
 *       do_my_work(arg);
 *     }
 *   }
 * });
 * ```
 * Not the prettiest, but it works.
 * Note that there is no requirement to make the `__super` call.
 * If you don't call the `__super` method, you completely override the superclass implementation;
 * if you do call it, you extend it instead.
 *
 * Initializers have a similar problem, since they need to call the superclass initializer.
 * {@sref FlRoot} defines the instance method {@sref FlRoot#__super_init} that calls
 * the superclass initializer bound to `this`. For example:
 * ```
 * let Base = FlClassManager.make_class({
 *   name: 'Base',
 *   initializer: function(a1) {
 *     this.__super_init();
 *     this._a1 = a1;
 *   }
 * });
 *
 * let Sub = FlClassMagaer.make_class({
 *   name: 'Sub',
 *   superclass: Base,
 *   initializer: function(a1, a2) {
 *     this.__super_init('Base', a1);
 *     this._a2 = a2;
 *   }
 * });
 *
 * let s = new Sub('A1', 'A2');
 * console.log(s);
 * ```
 * It this code is executed, the console will show:
 * ```
 * Sub { __extensions: [], _a1: 'A1', _a2: 'A2' }
 * ```
 * If subclasses don't define an initializer, {@sref FlClassManager#make_class} generates one that
 * makes a call to {@sref FlRoot#__super_init} using all the arguments passed to the constructor; this way,
 * class definitions in the chain can leave the initializer undefined, and the objects will still
 * be initialized properly. The test case contain an example of this behavior.
 *
 * ##### Sample usage
 *
 * Given the following class defintions:
 * ```
 * let SuperTestBase = FlClassManager.make_class({
 *   name: 'SuperTestBase',
 *   initializer: function(m) {
 *     console.log("SuperTestBase init IN");
 *     this.__super_init();
 *     this._m = m;
 *     console.log("SuperTestBase init OUT");
 *   },
 *   instance_methods: {
 *     my_method: function(msg) {
 *       console.log("---------- SuperTestBase.my_method IN");
 *     	 console.log("SuperTestBase : " + msg + ' - ' + this._m);
 *     	 console.log("---------- SuperTestBase.my_method OUT");
 *     }
 *   }
 * });
 *     
 * let SuperTestBase2 = FlClassManager.make_class({
 *   name: 'SuperTestBase2',
 *   instance_methods: {
 *     my_method: function(msg) {
 *       console.log("---------- SuperTestBase2.my_method IN");
 *       console.log("SuperTestBase2 : " + msg);
 *       console.log("---------- SuperTestBase2.my_method OUT");
 *     }
 *   }
 * });
 * 
 * let SuperTestSub = FlClassManager.make_class({
 *   name: 'SuperTestSub',
 *   superclass: SuperTestBase,
 *   initializer: function(m) {
 *     console.log("SuperTestSub init IN");
 *     this.__super_init('SuperTestBase', m);
 *     console.log("SuperTestSub init OUT");
 *   },
 *   instance_methods: {
 *     my_method: function(msg) {
 *       console.log("---------- SuperTestSub.my_method IN");
 *       console.log("SuperTestSub: " + msg + ' - ' + this._m);
 *       this.__super('SuperTestBase', 'my_method', msg);
 *       console.log("---------- SuperTestSub.my_method OUT");
 *     }
 *   }
 * });
 * 
 * let SuperTestSub2 = FlClassManager.make_class({
 *   name: 'SuperTestSub',
 *   superclass: SuperTestBase2,
 *   instance_methods: {
 *     my_method: function(msg) {
 *       console.log("---------- SuperTestSub2.my_method IN");
 *       console.log("SuperTestSub2: " + msg);
 *       this.__super('SuperTestBase2', 'my_method', msg);
 *       console.log("---------- SuperTestSub2.my_method OUT");
 *     }
 *   }
 * });
 * 
 * let SuperTestSubSub = FlClassManager.make_class({
 *   name: 'SuperTestSubSub',
 *   superclass: SuperTestSub,
 *   initializer: function(m) {
 *     console.log("SuperTestSubSub init IN");
 *     this.__super_init('SuperTestSub', m*2);
 *     console.log("SuperTestSubSub init OUT");
 *   },
 *   instance_methods: {
 *     my_method: function(msg) {
 *       console.log("---------- SuperTestSubSub.my_method IN");
 *       console.log("SuperTestSubSub: " + msg  + ' - ' + this._m);
 *       this.__super('SuperTestSub', 'my_method', '(' + msg + ')');
 *       console.log("---------- SuperTestSubSub.my_method OUT");
 *     }
 *   }
 * });
 * ```
 * Here is a log from a Node console session:
 * ```
 * > sub = new SuperTestSub(10);
 * SuperTestSub init IN
 * SuperTestBase init IN
 * SuperTestBase init OUT
 * SuperTestSub init OUT
 * SuperTestSub init IN
 * SuperTestBase init IN
 * SuperTestBase init OUT
 * SuperTestSub init OUT
 * SuperTestSub { __extensions: [], _m: 10 }
 * > sub.my_method('sub');
 * ---------- SuperTestSub.my_method IN
 * SuperTestSub: sub - 10
 * ---------- SuperTestBase.my_method IN
 * SuperTestBase : sub - 10
 * ---------- SuperTestBase.my_method OUT
 * ---------- SuperTestSub.my_method OUT
 * undefined
 * >
 * ```
 * ```
 * > subsub = new SuperTestSubSub(15);
 * SuperTestSubSub init IN
 * SuperTestSub init IN
 * SuperTestBase init IN
 * SuperTestBase init OUT
 * SuperTestSub init OUT
 * SuperTestSubSub init OUT
 * SuperTestSubSub init IN
 * SuperTestSub init IN
 * SuperTestBase init IN
 * SuperTestBase init OUT
 * SuperTestSub init OUT
 * SuperTestSubSub init OUT
 * SuperTestSubSub init IN
 * SuperTestSub init IN
 * SuperTestBase init IN
 * SuperTestBase init OUT
 * SuperTestSub init OUT
 * SuperTestSubSub init OUT
 * SuperTestSubSub { __extensions: [], _m: 30 }
 * > subsub.my_method('subsub');
 * ---------- SuperTestSubSub.my_method IN
 * SuperTestSubSub: subsub - 30
 * ---------- SuperTestSub.my_method IN
 * SuperTestSub: (subsub) - 30
 * ---------- SuperTestBase.my_method IN
 * SuperTestBase : (subsub) - 30
 * ---------- SuperTestBase.my_method OUT
 * ---------- SuperTestSub.my_method OUT
 * ---------- SuperTestSubSub.my_method OUT
 * undefined
 * > 
 * ```
 * ```
 * > sub2 = new SuperTestSub2(20);
 * SuperTestSub2 { __extensions: [] }
 * > sub2.my_method('sub2');
 * ---------- SuperTestSub2.my_method IN
 * SuperTestSub2: sub2
 * ---------- SuperTestBase2.my_method IN
 * SuperTestBase2 : sub2
 * ---------- SuperTestBase2.my_method OUT
 * ---------- SuperTestSub2.my_method OUT
 * undefined
 * > 
 * ```
 *
 * @param {Object} opts A hash containing the class description.
 * @property {String} opts.name The class name; this is the also the name under which the class constructor
 *  is registered.
 * @property {Function|String} opts.superclass If the class inherits form a superclass, this is the superclass
 *  constructor, or a the name of the superclass.
 *  If this property is not given, the class will inherit from {@sref FlRoot}.
 * @property {Function} opts.initializer The function called by the constructor to initialize the object.
 *  It should include a call to **__super_init**.
 *  If the option is not present, an initializer is generated as described above..
 * @property {Object} opts.instance_methods A hash containing the instance methods for the class.
 *  The values for the object's properties are functions; the contents of the hash are placed in the
 *  constructor's prototype.
 * @property {Object} opts.class_methods A hash containing the class methods for the class.
 *  The values for the object's properties are functions; the contents of the hash are placed in the
 *  constructor.
 * @property {Object} opts.class_properties A hash containing the class properties for the class.
 *  Each key/value pair is registered as a property in the constructor.
 *  The keys are property names, and the values are objects containing the property descriptor.
 * @property {Object} opts.instance_properties A hash containing the instance properties for the class.
 *  Each key/value pair is registered as a property in the prototype.
 *  The keys are property names, and the values are objects containing the property descriptor.
 * @property {Array} opts.extensions An array containing the list of extensions for the class. The elements
 *  are the names of registered extensions. See {@sref FlExtensions}.
 * 
 * @return {Function} Returns the value of the constructor that was created.
 *
 * @throws Throws an exception if _name_ is already registered.
 */

FlClassManager.make_class = function(opts) {
    let cname = opts.name;
    if (_.isNil(cname)) throw new FlClassManager.MissingClass('missing :name property');
    if (!_.isNil(FlClassManager.get_class(cname))) throw new FlClassManager.AlreadyDefinedClass(`class already defined: ${cname}`);
    
    // If no superclass is defined, we extend the root class
    // And, we trigger an exception if the superclass is given, but not registered

    let sname = (_.isNil(opts.superclass)) ? 'FlRoot' : opts.superclass;
    let superclass = FlClassManager.get_class(sname);
    if (!_.isFunction(superclass))
    {
	throw new FlClassManager.MissingClass('superclass not found: ' + sname);
    }
    sname = superclass.__name;

    let extensions = [ ];
    if (_.isObject(opts.extensions))
    {
	extensions = _.reduce(opts.extensions, function(acc, ev, eidx) {
	    acc.push(FlExtensions.lookup(ev));
	    return acc;
	}, [ ]);
    }

    // this eval initializes the ctor variable with the class constructor
    // Under some conditions, for mysterious reasons, if the constructor has no declared arguments
    // then no arguments are passed to it, and all hell breaks loose (well actually just the instances
    // are not initialized properly). Declaring a dummy argument fixes it; this 100% unadulterated
    // voodoo programming.
    
    let ctor = null;
    eval(`ctor = (function(_sc) {
      return class ${cname} extends _sc {
        constructor(dummy) {
	  super(dummy);
	  this.__initialize.apply(this, Array.from(arguments));
        }

        // __super() {
	//   let args = Array.from(arguments);
	//   let m = args[0];
	//   return super[m].apply(this, args.slice(1));
        // }
      };
    })(superclass);`);

    ctor.__name = cname;
    ctor.__extensions = _.reduce(extensions, function(acc, ev, eidx) {
	acc.push(ev);
	return acc;
    }, superclass.__extensions);
    ctor.__superclass = superclass;
    ctor.prototype.__class = ctor;
    ctor.prototype.__superclass = superclass;

    let init = opts.initializer;
    if (!_.isFunction(init)) eval(`init = function() {
  let args = Array.from(arguments);
  args.unshift('${sname}');
  this.__super_init.apply(this, args);
 };`);
    ctor.prototype.initialize = init;
    ctor.prototype.__initialize = (function(_extensions, _init) {
	return function() {
	    let args = Array.from(arguments);

	    this.__init_extensions(_extensions, 'pre');
	    _init.apply(this, Array.from(arguments));
	    this.__init_extensions(_extensions, 'post');
	};
    })(ctor.__extensions, init);

    // the factory method is defined before we load the class methods to give clients a chance to
    // override it

    let args = [ ];
    let iarg;
    for (iarg=1 ; iarg <= init.length ; iarg++)
    {
	args.push('arg' + iarg);
    }

    ctor.factory = (function(_opts, _ctor) {
	function __factory(args) {
	    return _ctor.apply(this, args);
	}
	__factory.prototype = Object.create(_ctor.prototype);

	return function() {
	    return new __factory(Array.from(arguments));
	};
    })(opts, ctor);

    _.forEach(extensions, function(ev, ek) { FlExtensions.register(ev, ctor); });

    if (_.isObject(opts.instance_methods))
    {
	_.forEach(opts.instance_methods, function(mv, mk) {
	    ctor.prototype[mk] = mv;
	    ctor.prototype[mk].__superclass = superclass;
	    ctor.prototype[mk].__name = mk;
	});
    }

    if (_.isObject(opts.class_methods))
    {
	_.forEach(opts.class_methods, function(mv, mk) {
	    ctor[mk] = mv;
	});
    }

    if (_.isObject(opts.class_properties))
    {
	_.forEach(opts.class_properties, function(mv, mk) {
	    Object.defineProperty(ctor, mk, mv);
	});
    }

    if (_.isObject(opts.instance_properties))
    {
	_.forEach(opts.instance_properties, function(mv, mk) {
	    Object.defineProperty(ctor.prototype, mk, mv);
	});
    }
    
    FlClassManager._class_registry[cname] = ctor;

    return ctor;
};

/**
 * @ngdoc method
 * @name FlClassManager#register_class
 * @classmethod
 * @module fl.object_system
 * @description
 * Register a class constructor.
 * 
 * @param {Function} ctor The class constructor.
 * @param {String} name The name under which to register the class; if not given, uses the **name**
 *  property of *ctor*.
 *
 * @return {Function} Returns _ctor_.
 * 
 * @throws Throws an exception if:
 *
 *  - _name_ is not defined, and _ctor_ does not have a **name** or **__name** property.
 *  - _ctor_ is not a function.
 *  - a class is already registered by the given name.
 */

FlClassManager.register_class = function(ctor, name) {
    if (!_.isFunction(ctor)) throw new FlClassManager.NotAClass('you must register a function');
    if (!_.isString(name)) name = (_.isString(ctor.__name)) ? ctor.__name : ctor.name;
    if (!_.isString(name) || (name.length < 1)) throw new FlClassManager.NotAClass('missing class name to register');
    if (!_.isNil(FlClassManager.get_class(name))) throw new FlClassManager.AlreadyRegisteredClass(`class already registered: ${name}`);

    FlClassManager._class_registry[name] = ctor;

    return ctor;
};

/**
 * @ngdoc method
 * @name FlClassManager#get_class
 * @classmethod
 * @module fl.object_system
 * @description
 * Get a registered class constructor.
 * 
 * @param {String|Function} name The name of the class to look up; as a convenience, if the value is a
 *  function that looks like a class created by {@sref FlClassManager#make_class}, it is returned as-is.
 * 
 * @return {Function|undefined} Returns the constructor registered under _name_ if one is available;
 *  otherwise, returns **undefined**.
 */

FlClassManager.get_class = function(name) {
    if (_.isString(name)) return FlClassManager._class_registry[name];
    if (_.isFunction(name) && _.isString(name.name) && (name.name.length > 0)) return name;

    return undefined;
};

/**
 * @ngdoc method
 * @name FlClassManager#instance_factory
 * @classmethod
 * @module fl.object_system
 * @description
 * Factory function for registered classes.
 *
 * This function calls {@sref FlClassManager#get_class} to obtain a constructor, and if one is found
 * it returns an instance of the class (using the **new** operator). Any arguments following _name_ 
 * are passed to the constructor.
 * 
 * @param {String|Function} name The name of the class to look up; as a convenience, you may pass a
 *  class object as well.
 * 
 * @return Returns an instance of the class registered under _name_ if one is available;
 *  otherwise, returns **null**.
 */

FlClassManager.instance_factory = function(name) {
    let ctor = FlClassManager.get_class(name);
    if (_.isFunction(ctor))
    {
	let args = Array.from(arguments);

	// The first argument is the class name

	args.shift();

	return ctor.factory.apply(ctor, args);
    }

    return null;
};

/**
 * @ngdoc method
 * @name FlClassManager#modelize
 * @classmethod
 * @module fl.object_system
 * @description
 * Modelize a hash.
 *
 * If _data_ is `null` or `undefined`, returns _data_.
 * If _data_ is an array, calls **map** on _data_, passing a function that calls the modelize function for
 * each element of the array (and therefore returns an array of modelized elements).
 * If _data_ is not an array, calls <tt>new ctor(data)</tt> to modelize the hash.
 * 
 * The relevant part of the function consists of two steps:
 *  1. Resolve the constructor:
 * <pre>ctor = FlClassManager.get_class(ctor);</pre>
 *     converts the *ctor* parameter into a constructor function.
 *  2. Instantiate the class:
 *     <pre>return new ctor(data);</pre>
 *     creates a new class instance.
 * 
 * @param {String|Function} ctor The constructor function to use; if passed as a string, the value is
 *  looked up in the class registry (using {@sref FlClassManager#get_class}).
 * @param {Object} data The object containing the hash to convert into a model object.
 */

FlClassManager.modelize = function(ctor, data) {
    if (_.isNil(data)) return data;

    ctor = FlClassManager.get_class(ctor);
    if (_.isArray(data))
    {
	return data.map(function(d) { return FlClassManager.modelize(ctor, d); });
    }
    else
    {
	return new ctor(data);
    }
};

module.exports = { FlExtensions, FlClassManager };
