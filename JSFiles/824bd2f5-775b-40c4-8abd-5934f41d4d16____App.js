/* eslint-disable */
import React from 'react';
import logo from './logo.svg';
import './App.css';
import OSC from 'osc-js';

const osc = new OSC()

// Run 'forever start OSCServer.js' to run the server on port 9914

// Essentials:
osc.on('open', () => {
  console.log('osc open')
  const message = new OSC.Message('/test', 'hello from client')
  osc.send(new OSC.Message('/test', 'hello'))
  const inttest = new OSC.Message('/test', 12345)
  osc.send(inttest)
})
osc.on('error', (err) => {
  console.log('osc error', err)
})

osc.on('/status', message => {
  console.log(message)
})
osc.on('/timestamp', message => {
  console.log('Timestamp:', message)
})
osc.on('/dump', message => {
  console.log('Dumping keyframes:', message)
})

// GEN KEYFRAMES
document.write(`<button id="keyframes">Generate Keyframes</button>`)
document.getElementById('keyframes').addEventListener('click', () => {
  for (let i = 0; i < 100; i++) {
    const key = Math.round((Math.random() * 100000000))
    console.log(key)
    osc.send(new OSC.Message('/insert_keyframe', key, 'keyframe_' + i, Math.random() * i))
  }
});

// GET RANDOM TIMESTAMP
document.write(`<button id="timestamp">Get Random Timestamp</button>`)
document.getElementById('timestamp').addEventListener('click', () => {
  const randomTest = Math.round((Math.random() * 100000000))
  console.log(randomTest)
  osc.send(new OSC.Message('/get_timestamp', randomTest))
});

// DUMP KEYFRAMES
document.write(`<button id="dump">Dump All</button>`)
document.getElementById('dump').addEventListener('click', () => {
  osc.send(new OSC.Message('/dump'))
});

// PLAY
document.write(`<button id="play">PLAY</button>`)
document.getElementById('play').addEventListener('click', () => {
  osc.send(new OSC.Message('/play'))
});

// PAUSE
document.write(`<button id="pause">PAUSE</button>`)
document.getElementById('pause').addEventListener('click', () => {
  osc.send(new OSC.Message('/pause'))
});

osc.open({ port: 9914 })




// EXAMPLE ================================================================
var appData = {
  _type:      'div',
  _class:     'App',
  _template:  ['header', 'body', 'footer'],
  header: {
    _type:      'header',
    _class:     'App-header',
    _template:  ['logo', 'instructions', 'link'],
    logo: {
      _type:      'img',
      _class:     'App-logo',
      src:        "logo.png",
      alt:        'logo'
    },
    instructions: {
      _type:      'p',
      _template:  (e) => ['Edit ', value(e, 'filename'), ' and save to reload'],
        // TODO not sure I like this
      filename: {
        _type:      'code',
        _value:     'src/App.js'
      },
    },
    link: {
      _type:      'a',
      _class:     'App-link',
      href:       'https://reactjs.org',
      target:     '_blank',
      rel:        'noopener noreferrer',
      _value:     'Learn React'
    }
  },
  'test': 'TESTING',
  'body': {
    _template: ['hello', 'world', 'more'],
    
    hello: {
      _template: (e) => 
        <div>
        <p> Hello World of {value(e, '_parent2/test')}</p>
        </div>
    },
    world: {
      _template: (e) => 'Something something ' + value(e, '_parent2/test')
    },
    more: {
      _template: ['_parent2/test', '_parent3/_key']
    }
  },
  footer: {
    _extends: '../body',
    _class:     null,
  }
};

// ROOT ================================================================
let root = {
  _parent: undefined,
  _key: '',

  // APP ================================================================
  app: {
    ...appData,
    _parent: '/',
    _key: 'app'
  },
  test_data: {
    types: {
      'undefined': undefined,
      null: null,
      true: true,
      false: false,
      boolean: true,
      empty: {
        _value: {}
      },
      zero: 0,
      one: 1,
      bit: '1',
      integer: 123,
      positive: 456,
      negative: -789,
      nonNegative: 789,
      nonPositive: 0,
      decimal: 123.456,
      number: 12345.6,
      infinity: 1/0,
      notANumber: NaN,
      error: NaN,
      string: 'string1',
      emptyString: '',
      binary: '101',
      bigint: BigInt(9007199254740991),
      char: 'c',
      // single-item object?
      // set?
      object: {
        _value: { a: 1, b: 2 }
      },
      regexp: /[0-9]/i,
      array: [1,2,3],
      emptyArray: [],
      // enumerate arrays of each type
      function: {
        _value: (a,b) => a + b
      },
      symbol: Symbol('foo'),
      default: 123,
    } 
  }
}

// MATCHES ==================================================================
const matches = (e, value = undefined) => {
  const v = value === undefined ? e._value : value; // TODO value(e)
  return JSON.stringify(e._matches) === JSON.stringify(v)
}
root.matches = {
  _description: 'Checks _matches conditions in an element, againt some value',
  _scaffolding: ['_matches', '_value'],
  _dependencies: ['value'],
  _TODO: 'awkward.  should this just be a value1, value2 comparator?  Should use value and extends too... currently just a hack',
  _tests: {
    'matches(1, 1)': {
      _function: () => matches({ _matches: 1}, 1),
      _matches: true
    },
  }
}

// ELEMENT ==================================================================
const element = (value) => {
  switch(typeof value) {
    case 'undefined':
      return {}
    case 'object':
      if (value instanceof Array || value === null)
        return {
          _value: value
        }
      return value
    case 'function':
      return {
        _function: value
      }
    default:
      return {
        _value: value
      }
  }
}
root.element = {
  _description: 'Formats some value into an element object',
  _scaffolding: ['_value', '_function'],
  _function: element,
  _tests: {
    'element(undefined)': {
      _matches: {},
      _function: () => element(undefined)
    },
    'element(empty_object)': { 
      _matches: {},
      _function: () => element({})
    },
    'element(object)': {
      _matches: { a: 1 },
      _function: () => element({ a: 1 })
    },
    'element(array)': {
      _matches: {
        _value: [1,2,3]
      },
      _function: () => element([1,2,3])
    },
    'element(function)': {
      _matches: {
        _function: () => 'test'
      },
      _function: () => element(() => 'test')
    },
    'element(string)': {
      _matches: {
        _value: 'test'
      },
      _function: () => element('test')
    },
    'element(number)': {
      _matches: {
        _value: 123
      },
      _function: () => element(123)
    },
    'element(boolean)': {
      _matches: {
        _value: true
      },
      _function: () => element(true)
    },
    'element(null)': {
      _matches: {
        _value: null
      },
      _function: () => element(null)
    }
  }
}

// TEST =====================================================================
const crude_test = (e, name) => { // TODOs in comments:
  const tests = e._tests // get(e, '_tests')
  if (!tests) {
    console.log('crude_test: ', name, true)
    return true
  }
  const results = Object.keys(tests).map((key) => { // keys(tests)
    const _value = tests[key]._function() // // get args, tests[key].call(args)
    if (tests[key].disabled)
      return {
        disabled: true,
        _valid: true
      }
    return {
      _value: _value,
      _valid: matches(tests[key], _value)
    }
  })
  const result = Object.values(results).every((e) => e._valid)
  console.log('crude_test: ', name, e._key, result, results)
  return result
}
root.test = {
  _description: 'Runs tests on an element',
  _scaffolding: ['_tests', '_value', '_function', '_valid', '_key'],
  _function: crude_test
}

crude_test(root.element, 'ELEMENT');
crude_test(root.test, 'TEST');
crude_test(root.matches, 'MATCHES')

// TYPES ====================================================================
const getTypes = (target) => {
  let types = [];
  switch (target) {
    // these should be ordered by frequency they're encountered
    case undefined:
      types = ['undefined']; break;
    case null:
      types = ['null']; break;
    case true:
    // case 'true': ?
      types = ['true', 'boolean']; break;
    case false:
    // case 'false': ?
      types = ['false', 'boolean']; break;
    case '':
      types = ['emptyString', 'string']; break;
    case 0:
      types = ['zero', 'bit', 'integer', 'nonNegative', 'number']; break;
    case 1:
      types = ['one', 'bit', 'integer', 'positive', 'nonNegative', 'number']; break;
    case '0':
      types = ['zero', 'bit', 'binary', 'integer', 'nonNegative', 'number', 'string']; break;
    case '1':
      types = ['one', 'bit', 'binary', 'integer', 'positive', 'nonNegative', 'number', 'string']; break;
    case Infinity:
      types = ['infinity', 'error', 'number']; break;
    default:
      switch(typeof target) {
        case 'bigint':
        case 'number':
          types = [
            ...types,
            Number.isNaN(target) ? 'notANumber' : null,
            Number.isNaN(target) ? 'error' : null,
            typeof target === 'bigint' ? 'bigint' : null,
            target < 0 ? 'nonPositive' : 'positive',
            target > 0 ? 'nonNegative' : 'negative',
            typeof target === 'bigint' || target % 1 === 0 ? 'integer' : 'decimal',
            'number'
          ];
        // TODO add positiveInt, negativeInt, positiveDecimal, negativeDecimal if we ever need/want them
          break;
        case 'string':
          types = [
            ...types,
            target.length === 1 ? 'char' : null,
            // binary (string of '0' or '1's):
            target[0] in ['0','1'] && /(0|1)+/i.test(target) ? 'binary' : null,
            'string'
          ];
          // date
          // timestamp
          // year
            // TODO
          break;
        case 'object':
          types = [
            ...types,
            Array.isArray(target) && target.length === 0 ? 'emptyArray' : null,
            Array.isArray(target) ? 'array' : null,
            Object.prototype.toString.call(target) === '[object RegExp]' ? 'regexp' : null,
            Object.keys(target).length === 0 ? 'empty' : null,
            JSON.stringify(target) === JSON.stringify(element(target)) ? 'element' : null,
            'object'
          ];
          break;
        case 'function':
          types = [...types, 'function'];
          break;
        case 'symbol':
          types = [...types, 'symbol'];
          break;
        // case 'undefined': // handled above. keeping for reference
        //  types = [...types, 'undefined'];
        //  break;
      }
  }
  types = [...types, 'default'];
  return types;
}
root.types = {
  _description: 'Returns an array of all the types of a value',
  _function: getTypes,
  _TODO: 'Will need to generalize this so you can call element._types() and get the list based on its value.  But meh',
  _tests: {
    'undefined': {
      _function: () => getTypes(undefined),
      _matches: ['undefined']
    }
    // ...TODO
  }
}
crude_test(root.types, 'TYPES');

// KEY =====================================================================
const key = (e) => {
  console.log("_KEY", e, e._key === '')
  return  typeof e._key === 'string' ? e._key : undefined
}
root.key = {
  _description: 'Returns the key of an element',
  _scaffolding: ['_key'],
  _tests: {
    'key(root)': {
      _matches: '',
      _function: () => key(root)
    },
    'key(app)': {
      _matches: 'app',
      _function: () => key(root.app)
    },
  }
}
crude_test(root.key, 'KEY')

// PATH =====================================================================
const path = (e) => {
  if (e._path !== undefined)
    return e._path
  if (e._parent === undefined)
    return '/'
  if (e._parent === '/')
    return '/' + key(e)
  return e._parent + '/' + key(e)
  // return value(e, '_path') || value(e, '_parent') + '/' + value(e, '_key')
}
root.path = {
  _description: 'Returns the path of an element',
  _scaffolding: ['_path', '_parent', '_key'],
  _tests: {
    'path(root)': {
      _matches: '/',
      _function: () => path(root)
    },
    'path(app)': {
      _matches: '/app',
      _function: () => path(root.app)
    },
  }
}
crude_test(root.path, 'PATH')

// INITIALIZE ==============================================================:
const initialize = (e, key) => {
  if (key === '_value' || key === '_matches')
    return e[key];
  if (key === '_function' && typeof e[key] === 'function')
    // help _function terminate to a _value instead of an endless depth
    return {
      _parent: path(e),
      _key: key,
      _value: e[key]
    }
  return {
    _parent: path(e),
    _key: key,
    ...element(e[key])
  }
}
root.initialize = {
  _description: 'Initializes the given element key, converting it to an element object or _value.  Returns the element.',
  _dependencies: ['element'],
  _scaffolding: ['_parent', '_key', '_value', '_function', '_matches'],
  _function: initialize,
  _TODO: 'support paths. (get + initialize loop problem)',
  _tests: {
    'initialize(root.app, "test")': {
      _function: (e) => initialize(root.app, 'test'),
      _matches: {
        _parent: '/app',
        _key: 'test',
        _value: 'TESTING'
      }
    },
    'initialize(root.app, "test/newkey")': {
      _function: (e) => initialize(initialize(root.app, 'test'), 'newkey'),
      _matches: {
        _parent: '/app/test',
        _key: 'newkey'
      }
    }
  }
}
crude_test(root.initialize, 'INITIALIZE')


// GET ========================================================================
const get = (e, path = undefined, initUndefined = true, ignoreExtensions = false) => {
  // always returns an object representation of the element
  console.log(555, e, path, initUndefined, ignoreExtensions)
  if (e === undefined)
    return undefined;
  if (path === undefined || path === '')
    return e;

  if (Array.isArray(e)) {
    // Note: this may return array of arrays and elements
    const elements = e.map((source) => get(source, path, initUndefined, ignoreExtensions)).filter((e) => e !== undefined);
    return elements ? elements : undefined; 
  }
  if (Array.isArray(path)) {
    // Note: this may return array of arrays and elements
    const elements = path.map((path) => get(e, path, initUndefined, ignoreExtensions)).filter((e) => e !== undefined);
    return elements ? elements : undefined; 
  }

  if (typeof path !== 'string')
    throw 'Path is not a string: ' + path;
  let remainder = path.split('/');
  const key  = remainder.shift();
  remainder = remainder.join('/');

  switch (key) {
    case '':
      if (remainder)
        throw 'Path has double slash //';
      // fallthrough (trailing slashes are fine)
    case '.':
      return get(e, remainder, initUndefined, ignoreExtensions);
    case '..':
    case '_parent':
      if ('_parent' in e)
        return get(e._parent, remainder, initUndefined, ignoreExtensions);
      else {
        console.error('_parent not found', key, e, path, remainder);
        throw 'Top level reached or _parent not defined';
      }
    case '_value':
      console.log(remainder, e, path)
      if (remainder.length)
        throw '"_value/..." paths not allowed. "_value" must terminate the path';
      return value(e);
    default:
      if (key.startsWith('_parent')) {
        const parentLevels = parseInt(key.substring(7));
        let pos = e;
        for (var i = 0; i < parentLevels; i++)
          pos = get(pos, '_parent', initUndefined, ignoreExtensions);
        return get(pos, remainder, initUndefined, ignoreExtensions);
      }
      console.log(555, e, key, initUndefined, typeof(e[key]), e[key])
      if (initUndefined || typeof e[key] !== 'undefined')
        return get(initialize(e, key), remainder, initUndefined, ignoreExtensions);   
      // console.error('Key not found', String(key), key.length, e, path, remainder);
      return undefined;
  }
}
root.get = {
  _description: 'Returns the element at the given path.  Creates an empty element at the path if it does not exist.',
  _dependencies: ['initialize'],
  _scaffolding: ['_parent', '_value'],
  _function: get,
  _tests: {
    'get(root.app, "test")': {
      _function: (e) => get(root.app, 'test'),
      _matches: {
        _parent: '/app',
        _key: 'test',
        _value: 'TESTING'
      }
    },
    'get(root.app, "test/newkey")': {
      _function: (e) => get(root.app, 'test/newkey'),
      _matches: {
        _parent: '/app/test',
        _key: 'newkey'
      }
    },
    'get(root.app, "test/newkey/newkey2")': {
      _function: (e) => get(root.app, 'test/newkey/newkey2'),
      _matches: {
        _parent: '/app/test/newkey',
        _key: 'newkey2'
      }
    },
    'get(root.app, "test/newkey", !initUndefined)': {
      _function: (e) => get(root.app, 'test/newkey3', false),
      _matches: undefined
    },
    'get("/root/app/test")': {
      _function: (e) => get('root/app/test'),
      disabled: true, // TODO not implemented yet
      _matches: {
        _parent: '/app',
        _key: 'test',
        _value: 'TESTING'
      }
    },
  }
}
crude_test(root.get, 'GET')

// VALUE =====================================================================
const value = (e, key = '_value') => {
  // TODO support paths
  if (e === undefined)
    return undefined;
  if (key === '_value') {
    if (e._value !== undefined)
      return e._value;
    if (e._extends === undefined)
      return undefined;
  }
  return get(e, key + '/_value');
}
const value_type_tests = Object.keys(root.test_data.types).map((key) => {
  const data = root.test_data.types;
  return {
    _function: (e) => value(data, data[key]),
    _matches: 'element' in getTypes(data[key])
      ? data[key]._value
      : data[key]
  }
})
root.value = {
  _description: 'Gets the _value of a component',
  _type: 'any',
  _dependencies: ['get'],
  _scaffolding: ['_value', '_extends'],
  _function: value,
  _tests: {
    'value(root.app, "test")': {
      _function: (e) => value(root.app, 'test'),
      _matches: 'TESTING'
    },
    'value(root.app, "test/newkey")': {
      _function: (e) => value(root.app, 'test/newkey'),
      _matches: undefined
    },
    'value(root.app.test, "newkey")': {
      _function: (e) => value(get(root.app, 'test'), 'newkey'),
      _matches: undefined
    },
    // TODO  automatically test all the test_data.types
    ...value_type_tests
  }
}
crude_test(root.value, 'VALUE')

// PARENT ==================================================================
const parent = (e) => typeMap(e, {
  _description: 'Parent can be a path or a custom object "virtual parent"',
  string:   (e) => value(e, '_parent'),
  object:   (e) => value(e, '_parent'), // just return the object itself
  default:  (e) => undefined
})
root.parent = {
  _description: {
    _value: 'Gets the parent of the given element',
    example: 'parent(e) returns the parent element of e'
  },
  _examples: {
    default: '/path/to/parent',
    object: {
      _value: '/object/defining/parent',
      other: 'properties'
    },
    invalid: undefined
  },
  _dependencies: ['typeMap', 'value', 'path'],
  _scaffolding: ['_parent'],
  _function: parent
}

// ARGS =====================================================================
const function_args = (func) => {
  return (func + '')
    .replace(/[/][/].*$/mg,'') // strip single-line comments
    .replace(/\s+/g, '') // strip white space
    .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  
    .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
    .replace(/\) *\=\>.*/, '') // strip trailing ES6 arrow
    //.replace(/=[^,]+/g, '') // strip any ES6 defaults  
    .split(',').filter(Boolean) // split & filter [""]
    .map((prop) => { // extract param and default
      const [key, value = undefined] = prop.split('=');
      return {
        key: key,
        value: value
      }
    });
}
const args = (e) => {
  if (has(e, '_args'))
    return value(e, '_args');
  if (has(e, '_function')) {
    const f = value(e, '_function');
    return function_args(f);
  }
  return [] // Decision: could be undefined
}
root.args = {
  _description: 'Gets the arguments of the given element (if any), based on its _function',
  _function: args,
  _type: 'array',
}

// FUNCTION ==================================================================
const _function = (e) => {
  const f = value(e, '_function')
  if (f === undefined)
    return undefined
  // bind e to this
  return f.bind(e)
}
// rewriting to use shorthand syntax:
const _function_alt = () => {
  if (!'_function' in e)
    return undefined
  return value(this, '_function').bind(this)
}
root.function = {
  _description: 'Gets the function (if any) of an element, binding it to the the element (by default)',
  _function: _function,
  _type: 'function',
  _dependencies: ['value'],
  _scaffolding: ['_function'],
}


// CALL =====================================================================
const call = (...args) => {
  const value = value(this) // TODO cached?
  if (value !== undefined)
    return value
  const f = _function(this)
  if (f === undefined)
    return undefined
  // map args from the function to values in e
  const mapped_args = args(this).map((arg, i) => {
    // WARNING TODO: defaults on the original function are ignored currently
    // WARNING TODO: I would like to be able to screen using standard SET rules of this._set here on the called args
    return typeof args[i] !== undefined ? args[i] : this[arg.key]
  })
  const result = f(...mapped_args).bind(this) // WARNING TODO: double binding on function and call...
  // TODO result handling (caching, side effects, setting parent, etc)
  // probably:  merge(this, element(result))
  return result
}
root.call = {
  _description: 'Calls the given elements function, if any',
  _function: call,
  //_type: 'element', //?
  _dependencies: ['value', 'function', 'args'],
  _scaffolding: [],
}

/*
WHAT WE WANT:
call(e, '_parent') or e._parent() returns parent object
get(e, '_parent') or e._parent returns object defining the parent
e._parent = '/path/to/parent' or {object defining parent}
e._parent._value contains string to parent, or object defining parent
e._parent._function defines how to operate call
call(e, '_parent/_function') should be about the same as call(e, '_parent')
- might need to recurse further even!

typeMap(value, map) 
e._typeMap = {map}
e._typeMap(value) returns the mapped value
get(e, _typemap) returns the map
*/

// TODO NOT FINISHED:
// call(e._parent, e)
/*
const call = (e, ...params) => {
  if (!has(e, '_function'))
    return get(e, '_value');
  const f = get(e, '_function');
  return call(f, ...params);
}
*/


const really_functional_component = {
  _title: "Really Functional Component",
  _description: "test component: this object computes a complicated function.  Lets say... it gets a random number between params min and max",
  it_also: "has other properties",
  min: 3,
  max: {
    _value: 4,
    _description: "this is a property which happens to be used by the function of RFC, and overrides its defaults when not undefined"
  },
  alter_ego: (e) => {
    const min = _value(e.min) || _value(e._function.min);
    const max = _value(e.max) || _value(e._function.max);
    return Math.random() * (max - min) + min;
  },
  _function: {
    _description: "this is the function of Really Functional Component, defining the RFC's behavior when it's called functionally.  It has args min and max with defaults min = 0 and max = 1.  Its behavior is defined via _function as well for extra confusion!",
    min: 0,
    max: {
      _value: 1,
      _description: "this is the argument max which this functon uses, with default value 1"
    },
    _args: ['min', 'max'], // this is meta information about the function's arguments
    _function: function(min, max) {
      // idealized function behavior.  I want it to automatically calculate values for min and max when called
      // I also want "this" to be bound to the calling component e in case we want to use it in here
      return Math.random() * (max - min) + min;
    },
    if_we_nested_further: {
      _description: "Just to really confuse you, we can of course nest this infinitely",
      _value: undefined, // this will be a function
      _cache: true,
      _function: function() {
        return (min, max) => Math.random() * (max - min) + min;
      }
    }
  }
};

let _service = {
  get: (e, key = undefined) => {
    let config = {};
    let value = key === '_' ? e._value : e[key];
    let getAll;

    if (key === undefined)
      // TODO call empty _get?
      return e;

    if ('_get' in e) {
      // defer to custom _get function if present
      switch (typeof e._get) {

        case 'object':
          e._get = {
            _parent: e,
            _key: key,
            ...e._get
          }
          //const _get_value = _service.get(e._get, '_value');
          const _get_function = _service.get(e._get, '_function');
          getAll = {
            ...e,
            ..._get_function(e)
          };
          for (const k in Object.keys(getAll)) // TODO _merge
            e[k] = getAll[k];
          value = _get_function(e, key);
          break;

        case 'function':
          // compute e._get() if it's a function
          getAll = {
            ...e,
            ...(e._get)(e)
          };
          for (const k in Object.keys(getAll))
            e[k] = getAll[k];
          value = (e._get)(e, key);
          break;

        default:
          throw "_get must be a function or object defining a function"
      }
    }

    // _value special keyword, returns hard value:
    if (key === '_value' || key === '_')
      return value;
    // _config is identity keyword, returns object always, non-Proxied
    if (key === '_config') {
      return config;
      // TODO allow e._config to augment further?
    }

    // convert value to its config form (_config(value) ?)
    switch (typeof value) {
      case 'object':
        config = value;
        break;
      case 'function':
        config = {
          _function: value
        };
        break;
      case 'undefined':
        config = {}
        break;
      default:
        config = {
          _value: value
        };
    }
    e[key] = {
      _parent: e,
      _key: key,
      ...config
    };

    return new Proxy(e[key], _service);
  },
  has: (e, key) => {
    switch (typeof e[key]) {
      case 'object':
        if (e[key]._value !== undefined || e[key]._function !== undefined)
          return true;
        console.log(e[key], Object.keys(e[key]));
        return _service.ownKeys(e[key]).length > 0;
          // TODO function should be auto-called maybe?
          // TODO parent objects are returning false
      case 'function':
        return true;
      case 'undefined':
        return false;
      default:
        return e[key] !== undefined
    }
    return false;
  },

  ownKeys: (e) => {
    // gets list of keys as if it were a normal object, removing _services
    const allKeys = Reflect.ownKeys(e);
    const someKeys = allKeys.filter((key) => key[0] !== '_');
    // TODO cache in _keys?  TODO _keys defines overrides or db fetches?  when do we use _get?
    return someKeys;
  }

  // TODOS?:
  // config preserves original specs?  
  // set: (e, key, value) => {}
  // [Symbol.toPrimitive] ? (cast to int etc)
  // extend e.g. String prototype
  // could make a certain key signal a call e.g. "__sum" makes it a function
  // can auto-import root configs now
  // can auto-call functions now (lazy load = less lazy now?)
  // can auto compute extends
}


const root2 = {
  users: {
    _get: (e, key = undefined) => {
      if (key === undefined) {
        console.log("Slow db call for all keys")
        // pre-fetch ALL keys
        const dbFetchAll = {
          // simulate db fetch
          alice: 345,
          cynthia: 678
        }
        return dbFetchAll
      }

      if (!_service.has(e, key)) {
        console.log("Slow db call for specific key: ", key)
        // fetch specific key
        const dbFetchOne = {
          // simulate db fetch
          alice: 345,
          cynthia: 678
        }
        return dbFetchOne[key]
      }

      return e[key]
    },
    bob: 123
  }
};

let p = new Proxy(root2, _service)
p.a = 1
p.a.b = 3
console.log(p.a, p.b, p.a.b, p.a.b._value, p.a.b._)
console.log('a' in p, 'b' in p, 'b' in p.a)
console.log(p, p._config, 'users' in p, p.users, p.users.bob, p.users.bob._, p.users.alice, p.users.alice._)

/*
let cookbook = new Proxy({}, _service)
cookbook.perogy = {
  _description: "tasty things like potato dumplings"
  _quantity: 1
}
cookbook.sausage = {
  _description: "intestine filled with FLESH"
  _quantity: 1,
  _length: 5,
  _weight: 1
}
cookbook.perogies = {
  _type: "perogy",
  _description: "package of perogies"
  _quantity: 50
}
cookbook.sausages = {
  _type: "sausage"
  _description: "package of sausages",
  _quantity: 8
}
const julienne = (ingredient, pieces = 10, lengthwise = true) => {
  ingredient = makeSureUnitsArentDumb(ingredient);
  return {
    ...ingredient,
    _length: lengthwise ? ingredient._length / pieces : ingredient._length,
    _width: !lengthwise ? ingredient._width / pieces : ingredient._width,
    _weight: ingredient._weight / pieces,
    _quantity: ingredient._quantity * pieces
  }
}
const carrot = {
  _name: "carrot",
  _length: 5,
  _weight: 1,
  _quantity: 1,
  _hardness: 10
  _fry: (carrot) => ({
    ...carrot,
    _hardness: 5
  })

}
let things_fried_so_far = {
  count: 0
};
const cut_carrot = julienne(julienne(carrot, 5), 5);
const fry_single = (ingredient) => {
  things_fried_so_far.count = things_fried_so_far.count + 1;
  if (ingredient._fry) {
    return ingredient._fry(ingredient);
  } else {
    return {
      ...ingredient,
      browned: true,
      burned: ingredient.browned ? true : false
    }
  }
}
const fry = (ingredients) => {
  return ingredients.map(fry_single)
}
cookbook.cut_onions = {
  _recipe: (ingredients) => {
    let cut_onions = ingredients.cut_onions || {
      _quantity: 0
    };
    if (ingredients.onion._quantity > 0) {
      const cut_up_whole_onion = julienne(julienne(ingredients.onion), false)
      cut_onions = {
        ...cut_up_whole_onion,
        _quantity: cut_onions._quantity + cut_up_whole_onion._quantity
      }
    }
    return julienne(julienne(ingredients.onion), false)
  },
  ingredients: {
    onion: 1
  }
}
cookbook.carmelized_onions = {
  _recipe: (ingredients) => {
    const cut_onions = cookbook.cut_onions._recipe(ingredients)
    return fry(cut_onions)
  },
  ingredients: {
    onion: 1,
    cut_onions: 0,
    oil: 11
  }
}

cookbook.perogies_a_la_sausage = {
  _recipe: (ingredients) => {
    const cut_sausages = julienne(ingredients.sausage)
    const cut_onions = julienne(julienne(ingredients.onion), false)
    const fried_things = fry([cut_onions, cut_sausages, perogies])
    return fried_things;
  },
  ingredients: {
    sausage: 4,
    perogy: 20,
    carmelized_onions: {
      ingredients: {
        onion: 1
      }
    }
  }
}

const cook_recipe = (cookbook, recipe_name) => {
  if (cookbook[recipe_name]?._recipe) {
    const prep_ingredient = (ingredient_name) => {
      const ingredient_value = cookbook.ingredients[ingredient_name]
      switch (typeof ingredient_value) {
        case "string": 

        case "number":
          return {
            ...cookbook[ingredient_name],
            _quantity: ingredient_value
          }
        case "object":

        case "function":

        default:

      }
    }
    const prepped_ingredients = Object.keys(cookbook[recipe_name].ingredients).map(

    )
    cookbook[recipe_name]._recipe(cookbook[recipe_name].ingredients)

  }
}
*/

const sum = (a, b) => a+b;
let sumproxy = new Proxy(sum, _service)

console.log(sumproxy(3,4))

const _call = (e) => {
  const cache = true;
  if (cache && e._value !== undefined)
    return e._value;
  const f = _function(e);
  if (f === undefined)
    return undefined;
  if (cache)
    return e._value = f();
  return f();
}

/*
const _function = (e) => {
  switch (typeof e._function) {
    case 'function':
      return e._function.bind(e);
    case 'object':
      return _function(e._function).bind(e);
    default:
      console.log("Warning, not a function: ", e);
      return () => e._function;
  }
}
*/

really_functional_component.a = 123;

console.log(_call(really_functional_component), _call(really_functional_component), really_functional_component);

/*
// TODO not sure what to do with this:
const getExtension = (e, key) => {
  const extension = e._extends;
  switch(typeof extension) {
    case 'undefined':
      return undefined;  
    case 'object':
      if (Array.isArray(extension))
        let finds = extension.reduce(
          (extends, ext) => {
            // TODO modify this.  pop each ext from array and look to see if key is there.  if not, remove from array.  return element with all the values in array + key in path,
            if (get(e, ext + '/' + key); // TODO array get here
          }, extension);
        if (finds.length > 0)
          return { // initialize?
            _extends: finds,
            // TODO how should this interact with get and initialize?
          };
      return get(extension, key);
    case 'function':
      return get(extension(e), key);
    default:
    case 'string':
      return get(e, extension + '/' + key);
  }
}
*/

/*
get(e, 'a')
a exists (get succeeds): recurse to a. (check e._extends for a? (extends function?)) add e._extends to a._extends array (initialize?  extend propagate?)  only need to add them if they have 'a' too
a doesnt exist (get fails): check e._extends for a (extends function?).  if found add new empty object in e[a] with e._extends in a._extends
a doesnt exist (get fails), not found in e._extends (extends fails): return undefined
*/

/*
const extends4 = (e, key) => {
  const extension = e._extends;
  let search;
  switch(typeof extension) {
    case 'undefined':
      return undefined;
    case 'object':
      if (Array.isArray(extension))
        // TODO search each extension for key.  if found, return it.  reduce list to just matches
        if (search.length > 0)
          return { // initialize?
            _extends: search,
            _parent: e,
            _key: key // TODO keys logic
            // TODO how should this interact with get and initialize?
          };
      search = get(extension, key);
        // TODO recursive _extends?
      break;
    case 'function':
      search = get(extension(e), key);
    default:
    case 'string':
      return get(e, extension + '/' + key);
  }
  if (!search)
    return undefined;
  return {
    _extends: search,
    _parent: e,
    _key: key
  };

  // TOO TIRED BLAGH
};
*/

/*
const testServices = {
  'someService': {
    something: 'nice'
  },
  'someOtherService': {
    also: 'this'
  },
  'someService1': {
    _extends: 'someService'
  },
  'someService2': {
    _extends: ['someService', 'someOtherService']
  },
  'someService3': {
    _extends: ['someService1', 'someOtherService2']
  },
  'someService3': {
    _extends: (e) => {'some' + 'Service'}
  },
  'someService4': {
    _extends: {
      _value: {
        custom: 'merging',
        data: 'for some reason',
        _extends: 'someService' // with recursion
      }
    }
  }
}

const extend2 = {
  _typeMap: {
    target: '_extend',
    object: (e) => extend({
      // if e._extends._value is an object (for some reason)
      ...e._extends._value,
      ...e,
      _extends: {
        ...e._extends,
        _value: undefined
      }
    }),
    array: (e) => extend({
      // slice off each extension in array and recurse
      ...get(e, e._extends._value.first()),
      ...e,
      _extends: {
        ...e._extends,
        _value: e._extends._value.length > 0 
          ? e._extends._value.slice(1) 
          : undefined
      }
    }),
    function: (e) => extend({
      // run the function and recurse
      ...e,
      _extends: {
        ...e._extends,
        _value: e._extends._value(e)
      }
    }),
    default: (e) => extend({
      ...get(e, e._extends._value),
      ...e,
      _extends: {
        ...e._extends,
        _value: undefined
      }
    }),
    undefined: (e) => e
    
    e._value.reduce(
      (topLayers, ext) => ({
        ...get(e, ext),
        ...topLayers
      }),
      e
    ),
    
  }
};
*/

const extendValue = (e, _extends) => {
  switch(typeof _extends) {
    case 'undefined':
      return undefined;
    case 'string':
      return value(e, _extends);
    case 'object':
      if (Array.isArray(_extends)) {
        // NOTE: rightmost element has highest preference
        return _extends.reverse().reduce(
          (foundValue, ext) => {
            if (foundValue !== undefined)
              return foundValue;
            return extendValue(e, ext);
          },
          undefined
        );
      }
      // object:
      return value(_extends);
    default:
      throw 'What to do here...'
  }
};



// helper function to assist with mapping parent _extend value to a child key
const mapParentExtend = (parentExt, key) => {
  switch(typeof parentExt) {
    case 'string':
      return ['../' + parentExt + '/' + key]
      break;
    case 'object':
      if (Array.isArray(parentExt)) { 
        // [ '../a/b', ['../x', 'y'] ] =>  ['../../a/b/key', ['../x/key', 'y/key']]
        return parentExt.map((x) => mapParentExtend(x));
      }
      // TODO this probably doesn't work:
      if (key === '_value')
        throw 'WHAT DO??';
      return get(parentExt, key);
    default: 
      return undefined;
  }
}

// adds extension to e
const extend = (e, extension = undefined) => {
  let prevValue = value(e, '_extends');

  switch(typeof extension) {
    case 'undefined':
      break;
    case 'string':
    case 'object':
      if (!Array.isArray(extension))
        extension = [extension];

      switch(typeof prevValue) {
        case 'undefined':
          e._extends = {
            _value: extension
          };
          break;
        case 'string':
        case 'object':
          prevValue = [prevValue];
          // continue:
        case 'array':
          e._extends._value = [
            ...extension,
            ...prevValue
          ];
        break;
        default:
          throw 'Not supported extend' + prevValue
      }
      break;
    default:
      throw 'Not supported extend' + extension
  }

  return e;
}

// unpacks _extends into element or array of elements
const getExtends = (e) => {
  let _extends = value(e, '_extends');
  switch(typeof _extends) {
    case 'undefined':
      return undefined;
    case 'string':
      return get(e, _extends);
    case 'object':
      return !Array.isArray(extension) 
        ? _extends 
        : _extends.map((_extend) => get(e, _extend))
      ;
    default:
      throw 'Not supported extend' + extension
  }
}

// wraps in an array if not already
const toArray = (v) => {
  if (Array.isArray(v))
    return v;
  return [v];
}

const inheritExtension = (e, key) => {
  // assumes e[key] has already otherwise been initialized and is an object

  // let _extends = value(e[key], '_extends');
  if (key !== '_extends') {
    // get the parent _extends
    const parent_extends = value(e, '_extends');
    // map parent extends to one key down, and add them to local extends
    extend(e[key], mapParentExtend(parent_extends, key));

    /*
    // merge with this element's _extends
    if (_extends !== undefined) {
      if (parent_extends !== undefined) {
        _extends = Array.isArray(_extends) ? _extends : [_extends],
        _extends = [
          ...parent_extends,
          ..._extends
        ];
      }
    } else
      _extends = parent_extends;
    */
  }

/*
  e[key] = {
    ...e[key],
    _extends: {
      ...e[key]._extends,
      _value: _extends
    }
  };
*/

  return e;
};

/*
const initialize = (e, key) => {
  if (key === '_parent')
    throw 'Attempting to initialize _parent';
  switch (typeof e[key]) {
    case 'undefined':
      e[key] = {
        _key: key,
        _parent: e
      }
      break;
    case 'object':
      if (!Array.isArray(e[key]) && Object.isExtensible(e[key])) {
        if ('_key' in e[key] && e[key]._key !== key) {
          console.error(key, e[key]._key);
          throw 'Key mismatch';
        }
        e[key]._key = key; // TODO nonstring keys
        if ('_parent' in e[key] && e[key]._parent !== e) {
          console.error('Parent mismatch', e[key]);
          // throw 'Parent mismatch'
        }
        e[key]._parent = e;
        break;
      } else {
        // is object:
        e[key] = {
          _value: e[key],
          _key: key,
          _parent: e
        }
      }
      break;
    case 'function':
      e[key] = {
        _function: e[key],
        _key: key,
        _parent: e
      }
      
      // auto-run the function:
      // TODO use call()
      e[key] = {
        ...e[key],
        _value: e[key]._function(e)
      };
      break;
    default:
      switch (key) {
        case '_value':
          return value(e);
        default:
          // everything else is an object shorthand
          e[key] = {
            _value: e[key],
            _key: key,
            _parent: e
          }
      }
      break;
  }

  e = inheritExtension(e, key);
  return e[key];
}
*/

const set = (e, path, value) => {
  const pos = get(e, path, true);
  console.log(e, path, pos);
  switch (typeof value) {
    default:
      pos._value = value;
      return pos;
    case 'undefined':
      return pos;
    case 'object':
      return pos = {
        ...pos,
        ...value
      }; // TODO deep merge
  }
}




// GET SOURCES function
// takes a reference element e and array of paths  (or just a single path) (or a mixed array of arrays and paths)
// and returns an array of sources relative to that e
// this is just MULTI-GET!!
/*
const hasAny(e, sources = undefined, path = undefined, ) => {
  switch(typeof source) {
    case 'object':
      if (!Array.isArray(sources))
        return has(sources, path);
      sources.reduce((found, source) => {
        if (found) return found;
        return hasAny(e, path, source);
      }, false);
    case 'string':
      get(
  }
  if (typeof sources === 'object' && !Array.isArray(sources))
    return has(sources, path);
  if (typeof sources === 'string')
    return has(sources, path);
  sources.reduce((found, source) => {
    if (found) return found;
    return hasAny(source, path);
  }, false);
}
*/

const extendHas = (e, path = undefined) => {
  if (has(e, path))
    return true;

  const _extends = value(e, '_extends');
  if (_extends === undefined)
    return has(e, path);
  let sources = get(e, _extends);
  if (!Array.isArray(sources))
    sources = [sources];
  sources = sources.flat(10);

  return sources.reduce(
    (found, source) => found === true ? found : has(source, path),
    false
  );
}

// returns the raw _value of a path, WITHOUT calling functions or _extends
// (at least on the final step. No promises on getting to there with a path)
const _value = (e, path = undefined) => {
  if (path === undefined) {
    switch (typeof e) {
      case 'function':
        throw "Calling _value(() => {somefunction}) where it cant track parent context.  Should this just return the function itself?";
      case 'object':
        if (!Array.isArray(e))
          return e._value;
        return e;
      default:
        return e; // calling _value(some_terminal), return itself
    }
  }
  if (typeof path !== 'string')
    throw '_value(e, path) must have a string path';
  let keys = path.split('/');
  let key = keys.unshift();
  if (keys.length > 0)
    return _value(get(e, key), keys.implode('/'));
  switch (typeof e[key]) {
    case 'undefined':
      return undefined;
    case 'object':
      return _value(get(e, key));
    default:
      return e[key];
  }
}

/*
BEHAVIOR I WANT:
  _value(e, 'key') ==~ e.key || e.key._value   returns raw _value.  does NOT extend
  value(e, 'key') === e.key._value   returns _value if not undefined, else checks _extends. does NOT (??) call any functions present?
  invoke(e, ...params) === e(...params)  calls the function of e or returns value (default behavior)
  call(e, 'key', ...params) === e.key(...params) === key(e, ...params) builds the keyed element and calls any functions, then returns the intended result value
  array(e, 'key') pretty undefined.  returns the element value in its array form? returns the _value as an array?
  get(e, 'key') === e.key   returns object defining e.key behavior
  initialize(e, 'key')   sub-function of get.  returns same as get but (re)-initializes the element
  has(e, 'key')   returns true if _value not undefined, else checks _extends. calls functions??

  I think value and call are the same. _value() can still be handy though

  */


// Depth first search: searches the main specified path first.  If failure, searches each extension
// if given an array of paths or sources (e) then searches each of those combinations
const has = (e, path = undefined, ignoreExtensions = false) => {
  if (path === undefined)
    return true;

  if (Array.isArray(e)) {
    return e.reduce(
      (found, element) => found || has(element, path), 
      false
    );
  }
  if (Array.isArray(path)) {
    return path.reduce(
      (found, eachPath) => found || has(e, eachPath), 
      false
    );
  }
  if (!ignoreExtensions && has(e, '_extends', true)) {
    if (has(e, path, true)) // search vanilla path first
      return true;
    return toArray(get(e, '_extends', true)).reduce( // then try each extension
      (found, extension) => found || has(get(e, extension), path, true), 
      false
    );
  }

  // otherwise, ONLY search this particular source and path:
  // e is an object
  // path is a string with keys
  // dont care about extensions

  const keys = path.split('/');
  var found = true;
  let key = keys.unshift();
  let remainder = keys.length ? keys.join('/') : undefined;

  switch (key) {
    case '_value':
      if (remainder)
        throw 'Path prematurely terminating at _value still has remaining keys';
      return e['_value'] !== undefined;
    case '': // trailing /
      if (remainder)
        throw 'Path supplied has double slash // in it.  Missing key?';
      // fallthrough:
    case '.':
      return has(e, remainder);
    case '..':
    case '_parent':
      return has(get(e, '_parent'), remainder);
    default:
      if (e[key] === undefined) {
        return false;
      } else {
        if (remainder)
          return has(get(e, key), remainder);
        if (typeof e[key] !== 'object')
          return true;
        return e[key]['_value'] !== undefined;
      }
  }
}

/*

// PROBS GARBAGE BELOW:

      } else {
        const step = get(e, key);
        if (step._value === undefined)
          return false;

        

        const _extends = toArray(call(e, '_extends'));
        extends(
        return has(step, remainder) || _extends.reduce(
          (found, _extend) => has(get(e, _extend), ) 
        );
      }

      _extends = value(pos, '_extends');
      if (_extends === undefined) {
        sources = [pos];
        break;
      }
      let sources = get(pos, _extends);
      if (!Array.isArray(sources))
        sources = [sources];
      sources = [pos, ...sources.flat(100)];

      found = sources.reduce(
        (found, source) => found === true ? found : has(source, steps.shift(step)), // TODO this wont work
        false
      );
  }
  if (!found && pos === undefined)
    return false;
  if (!steps && pos !== undefined)
    return true;
  return has(pos, steps);
}

*/

root.typeMap = {
  _description: "typeMap is a lenient shorthand classifier which automatically applies the closest mapping specified to common JS primitive types. We will need to generalize this to work for ALL system types eventually, but good enough for now.",
  _target: {
    _extends: '..'
  },
  _function:    (e, target = 'someplaceholdervalue123', map = undefined) => {
    // probably need to rethink this for optimizing.  maybe scan through the list of types available THEN map thos
    if (map === undefined)
      map = get(e, '_typeMap');
    if (target === 'someplaceholdervalue123') {
      target = value(map, '_target');
    }
    
    // TODO more rigorous validating of typeMap itself:
    if (typeof map !== 'object' || Object.keys(map).length === 0)
      return e;

    types = getTypes(target)

    let bestMatch = undefined;
    for (let t of types) {
      if (t !== null && t in map && map[t] !== undefined) { // return first
        bestMatch = t;
        break;
      }
    }
    // TODO possibly cache the selected type in e._typeMap._value

    if (bestMatch === undefined)
      // no matching typeMaps hit at all, and no default defined, so do nothing
      return e;

    // return the highest priority mapping which is defined
    // TODO will probably want multiple modes here, e.g. mapFirst vs mapAll (e.g. apply every match)
    return map[bestMatch](e);
  },
  /*
  JSPrimitives: {
    undefined: undefined,
    null: null,
    true: true,
    false: false,
    boolean: true,
    empty: {
      _value: {}
    },
    zero: 0,
    one: 1,
    bit: '1',
    integer: 123,
    positive: 456,
    negative: -789,
    nonNegative: 789,
    nonPositive: 0,
    decimal: 123.456,
    number: 12345.6,
    infinity: 1/0,
    notANumber: NaN,
    error: NaN,
    string: 'string1',
    emptyString: '',
    binary: '101',
    bigint: 2n ** 53n + 1,
    char: 'c',
    // single-item object?
    // set?
    object: {
      _value: { a: 1, b: 2 }
    },
    regexp: /[0-9]/i,
    array: [1,2,3],
    emptyArray: [],
    // enumerate arrays of each type
    function: {
      _value: (a,b) => a + b
    },
    symbol: Symbol('foo'),
    default: 123,
  },
  */
  testMap: {
    _typeMap: {
      _target:       {
        _extends: '..'
      },
      undefined:    (e) => ({...e, _value: 'undefined'}),
      null:         (e) => ({...e, _value: 'null'}),
      true:         (e) => ({...e, _value: 'true'}),
      false:        (e) => ({...e, _value: 'false'}),
      boolean:      (e) => ({...e, _value: 'boolean'}),
      empty:        (e) => ({...e, _value: 'empty'}),
      zero:         (e) => ({...e, _value: 'zero'}),
      one:          (e) => ({...e, _value: 'one'}),
      bit:          (e) => ({...e, _value: 'bit'}),
      integer:      (e) => ({...e, _value: 'integer'}),
      positive:     (e) => ({...e, _value: 'positive'}),
      negative:     (e) => ({...e, _value: 'negative'}),
      nonNegative:  (e) => ({...e, _value: 'nonNegative'}),
      nonPositive:  (e) => ({...e, _value: 'nonPositive'}),
      decimal:      (e) => ({...e, _value: 'decimal'}),
      number:       (e) => ({...e, _value: 'number'}),
      infinity:     (e) => ({...e, _value: 'infinity'}),
      notANumber:   (e) => ({...e, _value: 'notANumber'}),
      error:        (e) => ({...e, _value: 'error'}),
      string:       (e) => ({...e, _value: 'string'}),
      emptyString:  (e) => ({...e, _value: 'emptyString'}),
      binary:       (e) => ({...e, _value: 'binary'}),
      bigint:       (e) => ({...e, _value: 'bigint'}),
      char:         (e) => ({...e, _value: 'char'}),
      object:       (e) => ({...e, _value: 'object'}),
      regexp:       (e) => ({...e, _value: 'regexp'}),
      array:        (e) => ({...e, _value: 'array'}),
      emptyArray:   (e) => ({...e, _value: 'emptyArray'}),
      function:     (e) => ({...e, _value: 'function'}),
      symbol:       (e) => ({...e, _value: 'symbol'}),
      default:      (e) => ({...e, _value: 'default'}),
    }
  },
  _tests: {

    _each: {
      _extends: '../../testMap',
      answer: { // the name of each test should match the answer by default (shorthand trick)
        _extends: './_key'
      },
      eachTest: 1
    },

    undefined:    {
      _value: undefined,
      // _typeMap: .../testMap
    },
    null:         null, // same as undefined above but using shorthand (_value: null)
    true:         true,
    false:        false,
    boolean:      {
      _value:       true,
      _typeMap:     {
        true:         undefined  // turn off the "true" map so it falls back to boolean
      } 
    },
    empty:        {
      _value:       {}, // need to set object values explicitly, can't use shorthand
    },
    zero:         0,
    one:          1,
    bit:          {
      _value:       '0',
      _typeMap:     {
        zero:         undefined // turn off 'zero' map so it falls back to 'bit'
      }
    },
    positive:     -123,
    nonPositive:  123.4,
    negative:     {
      _value:       123,
      _typeMap:     {
        nonPositive:  undefined // turn off 'nonNegative' map so it falls back to 'positive'
      }
    },
    nonNegative:  {
      _value:       -123.4,
      _typeMap:     {
        positive:     undefined // turn off 'negative' map so it falls back to 'positive'
      }
    },
    integer:      {
      _value:       123,
      _typeMap:     {
        positive:     undefined,
        nonNegative:  undefined
      }
    },
    decimal:      {
      _value:       123.4,
      _typeMap:     {
        positive:     undefined,
        nonNegative:  undefined
      }
    },
    number:       {
      _value:       123.4,
      _typeMap:     {
        positive:     undefined,
        nonNegative:  undefined,
        decimal:      undefined
      }
    },
    // bigint:       {},
      // TODO not sure what these are yet. unable to reproduce
    infinity:     1/0,
    notANumber:   NaN,
    error:        {
      _value:       1/0,
      _typeMap:     {
        infinity:     undefined
      }
    },
    emptyString:  '',
    binary:       '101', // TODO consider numeric strings matching number etc
    string:       'test123',
    char:         'x',
    object:       {
      _value:       { key1: 'value1' },
    },
    regexp:       /someregex/i,
    emptyArray:   [],
    array:        [1,2,3],    
    function:     {
      _value:       () => {}, // set manually due to shorthand automatically mapping functions to _function instead of _value
    },
    // symbol:    {},  // TODO
    default:      {
      // catch-all for all possible types with no mapping defined
      _value:       'test123',
      _typeMap:     {
        string:     undefined
      }
    },
    noMappingFound:  {
      _value:       'noMappingFound',
      answer:       'noMappingFound',
      _typeMap:     {  // turn off string and default maps, so this falls through all mappings
        string:     undefined,
        default:    undefined
      }
    }
  },
  _test: {
    _function: (typeMap) => {
      // single dumb test:
      let testElement = {};
      let answer = value(typeMap._function(testElement, 'test123', get(typeMap, 'testMap/_typeMap')));
      let valid = answer === 'string';
      
      if (value(typeMap, '_test/runAllTests') !== true)
        return valid;

      // full test suite:
      Object.keys(typeMap._tests).reduce((result, testKey) => {
        if (testKey === '_each') return true; 
          // TODO make this automatically skipped with typeMap._tests._children or something....
          // or just make _tests function which explicitly skips this for now

        console.log(get(typeMap, '_tests/_each'));
        testElement = get(typeMap, '_tests/' + testKey);
        testElement = extend(testElement, get(typeMap, '_tests/_each'));
        console.log(testElement);

        answer = value(typeMap._function(testElement, value(testElement), get(testElement, '_typeMap')));
        console.log(answer, value(testElement, 'answer'));

        return result && (answer === value(testElement, 'answer'));
      }, valid);
      return valid;
    },
    runAllTests: true
  }
}

// typeMap.testMap._value = 1;
// console.log(typeMap._function(typeMap.testMap));

// TODO make this use call()
const typeMapTest = get(typeMap, '_test');
console.log(typeMapTest._function(typeMap));


const renderValue = (e) => {
  // TODO rethink
  const value = e._value;
  switch(typeof value) {
    case 'undefined':
      return undefined;
    case 'function':
      return value(e);
    case 'string':
    default:
      // TODO array values?
      return value;
  }
}

const renderTemplate = (e) => {
  const t = e._template;
  switch (typeof t) {
    case 'undefined':
      return renderValue(e);
    case 'object': 
      if (Array.isArray(t))
        return t.map(
          // list of keys in e
          (key) => render(get(e,key))
        );
      return render(t);
    case 'string':
      // key in e:
      return render(get(e,t));
    case 'function':
      // template function, which reduces into a template
      e._template = initialize(e, '_template');
      const result = e._template._function(e);
      if (React.isValidElement(result))
        return result;
      else
        return render(result);
    default:
      // TODO
      return t;
  }
}


const render = (e) => {

  if (typeof e !== 'object')
    return e;
  if (Array.isArray(e))
    return e.map(render);
  
  const rendered = renderTemplate(e);

  // render using React engine:
  return React.createElement(
    has(e, '_type') ?  value(e, '_type') : 'div',
    { // props
      className: value(e, '_class'),
      key: value(e, '_key')
    },
    rendered
  );
}


// appData = root(appData);

// console.log(render(appData));


const foobar = {
  _key: 'foo',
  _value: 'FOO',
  bar: {
    _extends: '../x',
    _value: 'BAR'
  },
  x: {
    _value: 'X',
    y: 'Y'
  }
}

console.log(root);


console.log(get(foobar, 'bar'));
console.log(value(foobar, 'bar/bar'));

console.log(get(foobar, 'bar/y'));

console.log(extendValue(foobar.bar, ['../bar', {_value: 'NEWT'}]));

//console.log(extend2);


// set(appData, 'footer/_class', 'App-logo2');

export default () => render(root.app);




/*
function AppOld() {
  return (
    <div
      className="App"
    >
      <header 
        className="App-header"
      >
        <img 
          src       = {logo} 
          className = "App-logo" 
          alt       = "logo" />
        <p>
          {"Edit "}
          <code>src/App.js</code>
          {" and save to reload."}
        </p>
        <a
          className = "App-link"
          href      = "https://reactjs.org"
          target    = "_blank"
          rel       = "noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
 
const originalApp = {
  type: "div",
  key: null,
  ref: null,
  _owner: null,
  _store: {
    validated: false
  },
  _source: {
    fileName: "C:\\CODE\\prioritree-react\\src\\App.js",
    lineNumber: 7
  },
  props: {
    className: 'App',  
    children: {
      type: 'header',
      props: {
        className: 'App-header',
        children: [
          {
            type: 'img',
            props: {
              src: "/static/media/logo.5d5d9eef.svg",
              className: 'App-logo',
              alt: 'logo'
            }
          },
          {
            type: 'p',
            props: {
              children: [
                'Edit ',
                {
                  type: 'code',
                  props: {
                    children: 'src/App.js'
                  }
                },
                ' and save to reload'
              ]
            }
          },
          {
            type: 'a',
            props: {
              className: 'App-link',
              href: 'https://reactjs.org',
              target: '_blank',
              rel: 'noopener noreferrer',
              children: 'Learn React'
            }
          }
        ]
      }
    } 
  }
};


const renderOld = (element) => {
  if (typeof element !== 'object')
    return element;
  
  var children = null;
  if (typeof element.props !== 'undefined' && typeof element.props.children !== 'undefined') {
    if (Array.isArray(element.props.children))
      children = element.props.children.map(renderOld);
    else
      children = renderOld(element.props.children);
  }

  return React.createElement(
    element.type,
    element.props,
    children
  );
}


console.log(AppOld());
*/
