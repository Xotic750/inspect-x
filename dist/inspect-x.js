/*!
{
  "author": "Graham Fairweather",
  "copywrite": "Copyright (c) 2015-2017",
  "date": "2019-07-31T20:34:38.091Z",
  "describe": "",
  "description": "An implementation of node's ES6 inspect module.",
  "file": "inspect-x.js",
  "hash": "e35fad970aba116761d0",
  "license": "MIT",
  "version": "3.0.11"
}
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["inspectX"] = factory();
	else
		root["inspectX"] = factory();
})((function () {
  'use strict';

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  return Function('return this')();
}()), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * is-primitive <https://github.com/jonschlinkert/is-primitive>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */



module.exports = function isPrimitive(val) {
  if (typeof val === 'object') {
    return val === null;
  }
  return typeof val !== 'function';
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var strValue = String.prototype.valueOf;
var tryStringObject = function tryStringObject(value) {
	try {
		strValue.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var strClass = '[object String]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isString(value) {
	if (typeof value === 'string') { return true; }
	if (typeof value !== 'object') { return false; }
	return hasToStringTag ? tryStringObject(value) : toStr.call(value) === strClass;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;
var hasSymbols = __webpack_require__(20)();

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isRealSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') {
			return false;
		}
		return symStringRegex.test(symToStr.call(value));
	};

	module.exports = function isSymbol(value) {
		if (typeof value === 'symbol') {
			return true;
		}
		if (toStr.call(value) !== '[object Symbol]') {
			return false;
		}
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {

	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return  false && false;
	};
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateObject(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isDateObject(value) {
	if (typeof value !== 'object' || value === null) { return false; }
	return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var boolToStr = Boolean.prototype.toString;

var tryBooleanObject = function tryBooleanObject(value) {
	try {
		boolToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var boolClass = '[object Boolean]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isBoolean(value) {
	if (typeof value === 'boolean') { return true; }
	if (typeof value !== 'object') { return false; }
	return hasToStringTag ? tryBooleanObject(value) : toStr.call(value) === boolClass;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
var toStr = Object.prototype.toString;

var isStandardArguments = function isArguments(value) {
	if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
		return false;
	}
	return toStr.call(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		toStr.call(value) !== '[object Array]' &&
		toStr.call(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = __webpack_require__(22);
var regexExec = RegExp.prototype.exec;
var gOPD = Object.getOwnPropertyDescriptor;

var tryRegexExecCall = function tryRegexExec(value) {
	try {
		var lastIndex = value.lastIndex;
		value.lastIndex = 0;

		regexExec.call(value);
		return true;
	} catch (e) {
		return false;
	} finally {
		value.lastIndex = lastIndex;
	}
};
var toStr = Object.prototype.toString;
var regexClass = '[object RegExp]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isRegex(value) {
	if (!value || typeof value !== 'object') {
		return false;
	}
	if (!hasToStringTag) {
		return toStr.call(value) === regexClass;
	}

	var descriptor = gOPD(value, 'lastIndex');
	var hasLastIndexDataProperty = descriptor && has(descriptor, 'value');
	if (!hasLastIndexDataProperty) {
		return false;
	}

	return tryRegexExecCall(value);
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var slice = Array.prototype.slice;
var isArgs = __webpack_require__(13);

var origKeys = Object.keys;
var keysShim = origKeys ? function keys(o) { return origKeys(o); } : __webpack_require__(25);

var originalKeys = Object.keys;

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			var args = Object.keys(arguments);
			return args && args.length === arguments.length;
		}(1, 2));
		if (!keysWorksWithArguments) {
			Object.keys = function keys(object) { // eslint-disable-line func-name-matching
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				}
				return originalKeys(object);
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var forEach = __webpack_require__(26);

var toStr = Object.prototype.toString;
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

var typedArrays = [
	'Float32Array',
	'Float64Array',
	'Int8Array',
	'Int16Array',
	'Int32Array',
	'Uint8Array',
	'Uint8ClampedArray',
	'Uint16Array',
	'Uint32Array',
	'BigInt64Array',
	'BigUint64Array'
];

var slice = String.prototype.slice;
var toStrTags = {};
var gOPD = Object.getOwnPropertyDescriptor;
if (hasToStringTag && gOPD && Object.getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		if (typeof global[typedArray] === 'function') {
			var arr = new global[typedArray]();
			if (!(Symbol.toStringTag in arr)) {
				throw new EvalError('this engine has support for Symbol.toStringTag, but ' + typedArray + ' does not have the property! Please report this.');
			}
			var proto = Object.getPrototypeOf(arr);
			var descriptor = gOPD(proto, Symbol.toStringTag);
			if (!descriptor) {
				var superProto = Object.getPrototypeOf(proto);
				descriptor = gOPD(superProto, Symbol.toStringTag);
			}
			toStrTags[typedArray] = descriptor.get;
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var anyTrue = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!anyTrue) {
			try {
				anyTrue = getter.call(value) === typedArray;
			} catch (e) { /**/ }
		}
	});
	return anyTrue;
};

module.exports = function isTypedArray(value) {
	if (!value || typeof value !== 'object') { return false; }
	if (!hasToStringTag) { return typedArrays.indexOf(slice.call(toStr.call(value), 8, -1)) > -1; }
	if (!gOPD) { return false; }
	return tryTypedArrays(value);
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(7)))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = isPromise;

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var numToStr = Number.prototype.toString;
var tryNumberObject = function tryNumberObject(value) {
	try {
		numToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var numClass = '[object Number]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isNumberObject(value) {
	if (typeof value === 'number') { return true; }
	if (typeof value !== 'object') { return false; }
	return hasToStringTag ? tryNumberObject(value) : toStr.call(value) === numClass;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! JSON v3.3.2 | https://bestiejs.github.io/json3 | Copyright 2012-2015, Kit Cambridge, Benjamin Tan | http://kit.mit-license.org */
;(function () {
  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader =  true && __webpack_require__(29);

  // A set of types used to distinguish objects from primitives.
  var objectTypes = {
    "function": true,
    "object": true
  };

  // Detect the `exports` object exposed by CommonJS implementations.
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  // Use the `global` object exposed by Node (including Browserify via
  // `insert-module-globals`), Narwhal, and Ringo as the default context,
  // and the `window` object in browsers. Rhino exports a `global` function
  // instead.
  var root = objectTypes[typeof window] && window || this,
      freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  // Public: Initializes JSON 3 using the given `context` object, attaching the
  // `stringify` and `parse` functions to the specified `exports` object.
  function runInContext(context, exports) {
    context || (context = root.Object());
    exports || (exports = root.Object());

    // Native constructor aliases.
    var Number = context.Number || root.Number,
        String = context.String || root.String,
        Object = context.Object || root.Object,
        Date = context.Date || root.Date,
        SyntaxError = context.SyntaxError || root.SyntaxError,
        TypeError = context.TypeError || root.TypeError,
        Math = context.Math || root.Math,
        nativeJSON = context.JSON || root.JSON;

    // Delegate to the native `stringify` and `parse` implementations.
    if (typeof nativeJSON == "object" && nativeJSON) {
      exports.stringify = nativeJSON.stringify;
      exports.parse = nativeJSON.parse;
    }

    // Convenience aliases.
    var objectProto = Object.prototype,
        getClass = objectProto.toString,
        isProperty = objectProto.hasOwnProperty,
        undefined;

    // Internal: Contains `try...catch` logic used by other functions.
    // This prevents other functions from being deoptimized.
    function attempt(func, errorFunc) {
      try {
        func();
      } catch (exception) {
        if (errorFunc) {
          errorFunc();
        }
      }
    }

    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
    var isExtended = new Date(-3509827334573292);
    attempt(function () {
      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
      // results for certain dates in Opera >= 10.53.
      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
    });

    // Internal: Determines whether the native `JSON.stringify` and `parse`
    // implementations are spec-compliant. Based on work by Ken Snyder.
    function has(name) {
      if (has[name] != null) {
        // Return cached feature test result.
        return has[name];
      }
      var isSupported;
      if (name == "bug-string-char-index") {
        // IE <= 7 doesn't support accessing string characters using square
        // bracket notation. IE 8 only supports this for primitives.
        isSupported = "a"[0] != "a";
      } else if (name == "json") {
        // Indicates whether both `JSON.stringify` and `JSON.parse` are
        // supported.
        isSupported = has("json-stringify") && has("date-serialization") && has("json-parse");
      } else if (name == "date-serialization") {
        // Indicates whether `Date`s can be serialized accurately by `JSON.stringify`.
        isSupported = has("json-stringify") && isExtended;
        if (isSupported) {
          var stringify = exports.stringify;
          attempt(function () {
            isSupported =
              // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
              // serialize extended years.
              stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
              // The milliseconds are optional in ES 5, but required in 5.1.
              stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
              // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
              // four-digit years instead of six-digit years. Credits: @Yaffle.
              stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
              // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
              // values less than 1000. Credits: @Yaffle.
              stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
          });
        }
      } else {
        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
        // Test `JSON.stringify`.
        if (name == "json-stringify") {
          var stringify = exports.stringify, stringifySupported = typeof stringify == "function";
          if (stringifySupported) {
            // A test function object with a custom `toJSON` method.
            (value = function () {
              return 1;
            }).toJSON = value;
            attempt(function () {
              stringifySupported =
                // Firefox 3.1b1 and b2 serialize string, number, and boolean
                // primitives as object literals.
                stringify(0) === "0" &&
                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                // literals.
                stringify(new Number()) === "0" &&
                stringify(new String()) == '""' &&
                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                // does not define a canonical JSON representation (this applies to
                // objects with `toJSON` properties as well, *unless* they are nested
                // within an object or array).
                stringify(getClass) === undefined &&
                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                // FF 3.1b3 pass this test.
                stringify(undefined) === undefined &&
                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                // respectively, if the value is omitted entirely.
                stringify() === undefined &&
                // FF 3.1b1, 2 throw an error if the given value is not a number,
                // string, array, object, Boolean, or `null` literal. This applies to
                // objects with custom `toJSON` methods as well, unless they are nested
                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                // methods entirely.
                stringify(value) === "1" &&
                stringify([value]) == "[1]" &&
                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                // `"[null]"`.
                stringify([undefined]) == "[null]" &&
                // YUI 3.0.0b1 fails to serialize `null` literals.
                stringify(null) == "null" &&
                // FF 3.1b1, 2 halts serialization if an array contains a function:
                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                // elides non-JSON values from objects and arrays, unless they
                // define custom `toJSON` methods.
                stringify([undefined, getClass, null]) == "[null,null,null]" &&
                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                stringify(null, value) === "1" &&
                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]";
            }, function () {
              stringifySupported = false;
            });
          }
          isSupported = stringifySupported;
        }
        // Test `JSON.parse`.
        if (name == "json-parse") {
          var parse = exports.parse, parseSupported;
          if (typeof parse == "function") {
            attempt(function () {
              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
              // Conforming implementations should also coerce the initial argument to
              // a string prior to parsing.
              if (parse("0") === 0 && !parse(false)) {
                // Simple parsing test.
                value = parse(serialized);
                parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                if (parseSupported) {
                  attempt(function () {
                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                    parseSupported = !parse('"\t"');
                  });
                  if (parseSupported) {
                    attempt(function () {
                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                      // certain octal literals.
                      parseSupported = parse("01") !== 1;
                    });
                  }
                  if (parseSupported) {
                    attempt(function () {
                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                      // points. These environments, along with FF 3.1b1 and 2,
                      // also allow trailing commas in JSON objects and arrays.
                      parseSupported = parse("1.") !== 1;
                    });
                  }
                }
              }
            }, function () {
              parseSupported = false;
            });
          }
          isSupported = parseSupported;
        }
      }
      return has[name] = !!isSupported;
    }
    has["bug-string-char-index"] = has["date-serialization"] = has["json"] = has["json-stringify"] = has["json-parse"] = null;

    if (!has("json")) {
      // Common `[[Class]]` name aliases.
      var functionClass = "[object Function]",
          dateClass = "[object Date]",
          numberClass = "[object Number]",
          stringClass = "[object String]",
          arrayClass = "[object Array]",
          booleanClass = "[object Boolean]";

      // Detect incomplete support for accessing string characters by index.
      var charIndexBuggy = has("bug-string-char-index");

      // Internal: Normalizes the `for...in` iteration algorithm across
      // environments. Each enumerated key is yielded to a `callback` function.
      var forOwn = function (object, callback) {
        var size = 0, Properties, dontEnums, property;

        // Tests for bugs in the current environment's `for...in` algorithm. The
        // `valueOf` property inherits the non-enumerable flag from
        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
        (Properties = function () {
          this.valueOf = 0;
        }).prototype.valueOf = 0;

        // Iterate over a new instance of the `Properties` class.
        dontEnums = new Properties();
        for (property in dontEnums) {
          // Ignore all properties inherited from `Object.prototype`.
          if (isProperty.call(dontEnums, property)) {
            size++;
          }
        }
        Properties = dontEnums = null;

        // Normalize the iteration algorithm.
        if (!size) {
          // A list of non-enumerable properties inherited from `Object.prototype`.
          dontEnums = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
          // properties.
          forOwn = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, length;
            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
            for (property in object) {
              // Gecko <= 1.0 enumerates the `prototype` property of functions under
              // certain conditions; IE does not.
              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                callback(property);
              }
            }
            // Manually invoke the callback for each non-enumerable property.
            for (length = dontEnums.length; property = dontEnums[--length];) {
              if (hasProperty.call(object, property)) {
                callback(property);
              }
            }
          };
        } else {
          // No bugs detected; use the standard `for...in` algorithm.
          forOwn = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
            for (property in object) {
              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                callback(property);
              }
            }
            // Manually invoke the callback for the `constructor` property due to
            // cross-environment inconsistencies.
            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
              callback(property);
            }
          };
        }
        return forOwn(object, callback);
      };

      // Public: Serializes a JavaScript `value` as a JSON string. The optional
      // `filter` argument may specify either a function that alters how object and
      // array members are serialized, or an array of strings and numbers that
      // indicates which properties should be serialized. The optional `width`
      // argument may be either a string or number that specifies the indentation
      // level of the output.
      if (!has("json-stringify") && !has("date-serialization")) {
        // Internal: A map of control characters and their escaped equivalents.
        var Escapes = {
          92: "\\\\",
          34: '\\"',
          8: "\\b",
          12: "\\f",
          10: "\\n",
          13: "\\r",
          9: "\\t"
        };

        // Internal: Converts `value` into a zero-padded string such that its
        // length is at least equal to `width`. The `width` must be <= 6.
        var leadingZeroes = "000000";
        var toPaddedString = function (width, value) {
          // The `|| 0` expression is necessary to work around a bug in
          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
          return (leadingZeroes + (value || 0)).slice(-width);
        };

        // Internal: Serializes a date object.
        var serializeDate = function (value) {
          var getData, year, month, date, time, hours, minutes, seconds, milliseconds;
          // Define additional utility methods if the `Date` methods are buggy.
          if (!isExtended) {
            var floor = Math.floor;
            // A mapping between the months of the year and the number of days between
            // January 1st and the first of the respective month.
            var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
            // Internal: Calculates the number of days between the Unix epoch and the
            // first day of the given month.
            var getDay = function (year, month) {
              return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
            };
            getData = function (value) {
              // Manually compute the year, month, date, hours, minutes,
              // seconds, and milliseconds if the `getUTC*` methods are
              // buggy. Adapted from @Yaffle's `date-shim` project.
              date = floor(value / 864e5);
              for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
              for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
              date = 1 + date - getDay(year, month);
              // The `time` value specifies the time within the day (see ES
              // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
              // to compute `A modulo B`, as the `%` operator does not
              // correspond to the `modulo` operation for negative numbers.
              time = (value % 864e5 + 864e5) % 864e5;
              // The hours, minutes, seconds, and milliseconds are obtained by
              // decomposing the time within the day. See section 15.9.1.10.
              hours = floor(time / 36e5) % 24;
              minutes = floor(time / 6e4) % 60;
              seconds = floor(time / 1e3) % 60;
              milliseconds = time % 1e3;
            };
          } else {
            getData = function (value) {
              year = value.getUTCFullYear();
              month = value.getUTCMonth();
              date = value.getUTCDate();
              hours = value.getUTCHours();
              minutes = value.getUTCMinutes();
              seconds = value.getUTCSeconds();
              milliseconds = value.getUTCMilliseconds();
            };
          }
          serializeDate = function (value) {
            if (value > -1 / 0 && value < 1 / 0) {
              // Dates are serialized according to the `Date#toJSON` method
              // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
              // for the ISO 8601 date time string format.
              getData(value);
              // Serialize extended years correctly.
              value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
              "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
              // Months, dates, hours, minutes, and seconds should have two
              // digits; milliseconds should have three.
              "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
              // Milliseconds are optional in ES 5.0, but required in 5.1.
              "." + toPaddedString(3, milliseconds) + "Z";
              year = month = date = hours = minutes = seconds = milliseconds = null;
            } else {
              value = null;
            }
            return value;
          };
          return serializeDate(value);
        };

        // For environments with `JSON.stringify` but buggy date serialization,
        // we override the native `Date#toJSON` implementation with a
        // spec-compliant one.
        if (has("json-stringify") && !has("date-serialization")) {
          // Internal: the `Date#toJSON` implementation used to override the native one.
          function dateToJSON (key) {
            return serializeDate(this);
          }

          // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
          var nativeStringify = exports.stringify;
          exports.stringify = function (source, filter, width) {
            var nativeToJSON = Date.prototype.toJSON;
            Date.prototype.toJSON = dateToJSON;
            var result = nativeStringify(source, filter, width);
            Date.prototype.toJSON = nativeToJSON;
            return result;
          }
        } else {
          // Internal: Double-quotes a string `value`, replacing all ASCII control
          // characters (characters with code unit values between 0 and 31) with
          // their escaped equivalents. This is an implementation of the
          // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
          var unicodePrefix = "\\u00";
          var escapeChar = function (character) {
            var charCode = character.charCodeAt(0), escaped = Escapes[charCode];
            if (escaped) {
              return escaped;
            }
            return unicodePrefix + toPaddedString(2, charCode.toString(16));
          };
          var reEscape = /[\x00-\x1f\x22\x5c]/g;
          var quote = function (value) {
            reEscape.lastIndex = 0;
            return '"' +
              (
                reEscape.test(value)
                  ? value.replace(reEscape, escapeChar)
                  : value
              ) +
              '"';
          };

          // Internal: Recursively serializes an object. Implements the
          // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
          var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
            var value, type, className, results, element, index, length, prefix, result;
            attempt(function () {
              // Necessary for host object support.
              value = object[property];
            });
            if (typeof value == "object" && value) {
              if (value.getUTCFullYear && getClass.call(value) == dateClass && value.toJSON === Date.prototype.toJSON) {
                value = serializeDate(value);
              } else if (typeof value.toJSON == "function") {
                value = value.toJSON(property);
              }
            }
            if (callback) {
              // If a replacement function was provided, call it to obtain the value
              // for serialization.
              value = callback.call(object, property, value);
            }
            // Exit early if value is `undefined` or `null`.
            if (value == undefined) {
              return value === undefined ? value : "null";
            }
            type = typeof value;
            // Only call `getClass` if the value is an object.
            if (type == "object") {
              className = getClass.call(value);
            }
            switch (className || type) {
              case "boolean":
              case booleanClass:
                // Booleans are represented literally.
                return "" + value;
              case "number":
              case numberClass:
                // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
                // `"null"`.
                return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
              case "string":
              case stringClass:
                // Strings are double-quoted and escaped.
                return quote("" + value);
            }
            // Recursively serialize objects and arrays.
            if (typeof value == "object") {
              // Check for cyclic structures. This is a linear search; performance
              // is inversely proportional to the number of unique nested objects.
              for (length = stack.length; length--;) {
                if (stack[length] === value) {
                  // Cyclic structures cannot be serialized by `JSON.stringify`.
                  throw TypeError();
                }
              }
              // Add the object to the stack of traversed objects.
              stack.push(value);
              results = [];
              // Save the current indentation level and indent one additional level.
              prefix = indentation;
              indentation += whitespace;
              if (className == arrayClass) {
                // Recursively serialize array elements.
                for (index = 0, length = value.length; index < length; index++) {
                  element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                  results.push(element === undefined ? "null" : element);
                }
                result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
              } else {
                // Recursively serialize object members. Members are selected from
                // either a user-specified list of property names, or the object
                // itself.
                forOwn(properties || value, function (property) {
                  var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                  if (element !== undefined) {
                    // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                    // is not the empty string, let `member` {quote(property) + ":"}
                    // be the concatenation of `member` and the `space` character."
                    // The "`space` character" refers to the literal space
                    // character, not the `space` {width} argument provided to
                    // `JSON.stringify`.
                    results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                  }
                });
                result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
              }
              // Remove the object from the traversed object stack.
              stack.pop();
              return result;
            }
          };

          // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
          exports.stringify = function (source, filter, width) {
            var whitespace, callback, properties, className;
            if (objectTypes[typeof filter] && filter) {
              className = getClass.call(filter);
              if (className == functionClass) {
                callback = filter;
              } else if (className == arrayClass) {
                // Convert the property names array into a makeshift set.
                properties = {};
                for (var index = 0, length = filter.length, value; index < length;) {
                  value = filter[index++];
                  className = getClass.call(value);
                  if (className == "[object String]" || className == "[object Number]") {
                    properties[value] = 1;
                  }
                }
              }
            }
            if (width) {
              className = getClass.call(width);
              if (className == numberClass) {
                // Convert the `width` to an integer and create a string containing
                // `width` number of space characters.
                if ((width -= width % 1) > 0) {
                  if (width > 10) {
                    width = 10;
                  }
                  for (whitespace = ""; whitespace.length < width;) {
                    whitespace += " ";
                  }
                }
              } else if (className == stringClass) {
                whitespace = width.length <= 10 ? width : width.slice(0, 10);
              }
            }
            // Opera <= 7.54u2 discards the values associated with empty string keys
            // (`""`) only if they are used directly within an object member list
            // (e.g., `!("" in { "": 1})`).
            return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
          };
        }
      }

      // Public: Parses a JSON source string.
      if (!has("json-parse")) {
        var fromCharCode = String.fromCharCode;

        // Internal: A map of escaped control characters and their unescaped
        // equivalents.
        var Unescapes = {
          92: "\\",
          34: '"',
          47: "/",
          98: "\b",
          116: "\t",
          110: "\n",
          102: "\f",
          114: "\r"
        };

        // Internal: Stores the parser state.
        var Index, Source;

        // Internal: Resets the parser state and throws a `SyntaxError`.
        var abort = function () {
          Index = Source = null;
          throw SyntaxError();
        };

        // Internal: Returns the next token, or `"$"` if the parser has reached
        // the end of the source string. A token may be a string, number, `null`
        // literal, or Boolean literal.
        var lex = function () {
          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
          while (Index < length) {
            charCode = source.charCodeAt(Index);
            switch (charCode) {
              case 9: case 10: case 13: case 32:
                // Skip whitespace tokens, including tabs, carriage returns, line
                // feeds, and space characters.
                Index++;
                break;
              case 123: case 125: case 91: case 93: case 58: case 44:
                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                // the current position.
                value = charIndexBuggy ? source.charAt(Index) : source[Index];
                Index++;
                return value;
              case 34:
                // `"` delimits a JSON string; advance to the next character and
                // begin parsing the string. String tokens are prefixed with the
                // sentinel `@` character to distinguish them from punctuators and
                // end-of-string tokens.
                for (value = "@", Index++; Index < length;) {
                  charCode = source.charCodeAt(Index);
                  if (charCode < 32) {
                    // Unescaped ASCII control characters (those with a code unit
                    // less than the space character) are not permitted.
                    abort();
                  } else if (charCode == 92) {
                    // A reverse solidus (`\`) marks the beginning of an escaped
                    // control character (including `"`, `\`, and `/`) or Unicode
                    // escape sequence.
                    charCode = source.charCodeAt(++Index);
                    switch (charCode) {
                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                        // Revive escaped control characters.
                        value += Unescapes[charCode];
                        Index++;
                        break;
                      case 117:
                        // `\u` marks the beginning of a Unicode escape sequence.
                        // Advance to the first character and validate the
                        // four-digit code point.
                        begin = ++Index;
                        for (position = Index + 4; Index < position; Index++) {
                          charCode = source.charCodeAt(Index);
                          // A valid sequence comprises four hexdigits (case-
                          // insensitive) that form a single hexadecimal value.
                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                            // Invalid Unicode escape sequence.
                            abort();
                          }
                        }
                        // Revive the escaped character.
                        value += fromCharCode("0x" + source.slice(begin, Index));
                        break;
                      default:
                        // Invalid escape sequence.
                        abort();
                    }
                  } else {
                    if (charCode == 34) {
                      // An unescaped double-quote character marks the end of the
                      // string.
                      break;
                    }
                    charCode = source.charCodeAt(Index);
                    begin = Index;
                    // Optimize for the common case where a string is valid.
                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
                      charCode = source.charCodeAt(++Index);
                    }
                    // Append the string as-is.
                    value += source.slice(begin, Index);
                  }
                }
                if (source.charCodeAt(Index) == 34) {
                  // Advance to the next character and return the revived string.
                  Index++;
                  return value;
                }
                // Unterminated string.
                abort();
              default:
                // Parse numbers and literals.
                begin = Index;
                // Advance past the negative sign, if one is specified.
                if (charCode == 45) {
                  isSigned = true;
                  charCode = source.charCodeAt(++Index);
                }
                // Parse an integer or floating-point value.
                if (charCode >= 48 && charCode <= 57) {
                  // Leading zeroes are interpreted as octal literals.
                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                    // Illegal octal literal.
                    abort();
                  }
                  isSigned = false;
                  // Parse the integer component.
                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                  // Floats cannot contain a leading decimal point; however, this
                  // case is already accounted for by the parser.
                  if (source.charCodeAt(Index) == 46) {
                    position = ++Index;
                    // Parse the decimal component.
                    for (; position < length; position++) {
                      charCode = source.charCodeAt(position);
                      if (charCode < 48 || charCode > 57) {
                        break;
                      }
                    }
                    if (position == Index) {
                      // Illegal trailing decimal.
                      abort();
                    }
                    Index = position;
                  }
                  // Parse exponents. The `e` denoting the exponent is
                  // case-insensitive.
                  charCode = source.charCodeAt(Index);
                  if (charCode == 101 || charCode == 69) {
                    charCode = source.charCodeAt(++Index);
                    // Skip past the sign following the exponent, if one is
                    // specified.
                    if (charCode == 43 || charCode == 45) {
                      Index++;
                    }
                    // Parse the exponential component.
                    for (position = Index; position < length; position++) {
                      charCode = source.charCodeAt(position);
                      if (charCode < 48 || charCode > 57) {
                        break;
                      }
                    }
                    if (position == Index) {
                      // Illegal empty exponent.
                      abort();
                    }
                    Index = position;
                  }
                  // Coerce the parsed value to a JavaScript number.
                  return +source.slice(begin, Index);
                }
                // A negative sign may only precede numbers.
                if (isSigned) {
                  abort();
                }
                // `true`, `false`, and `null` literals.
                var temp = source.slice(Index, Index + 4);
                if (temp == "true") {
                  Index += 4;
                  return true;
                } else if (temp == "fals" && source.charCodeAt(Index + 4 ) == 101) {
                  Index += 5;
                  return false;
                } else if (temp == "null") {
                  Index += 4;
                  return null;
                }
                // Unrecognized token.
                abort();
            }
          }
          // Return the sentinel `$` character if the parser has reached the end
          // of the source string.
          return "$";
        };

        // Internal: Parses a JSON `value` token.
        var get = function (value) {
          var results, hasMembers;
          if (value == "$") {
            // Unexpected end of input.
            abort();
          }
          if (typeof value == "string") {
            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
              // Remove the sentinel `@` character.
              return value.slice(1);
            }
            // Parse object and array literals.
            if (value == "[") {
              // Parses a JSON array, returning a new JavaScript array.
              results = [];
              for (;;) {
                value = lex();
                // A closing square bracket marks the end of the array literal.
                if (value == "]") {
                  break;
                }
                // If the array literal contains elements, the current token
                // should be a comma separating the previous element from the
                // next.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "]") {
                      // Unexpected trailing `,` in array literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each array element.
                    abort();
                  }
                } else {
                  hasMembers = true;
                }
                // Elisions and leading commas are not permitted.
                if (value == ",") {
                  abort();
                }
                results.push(get(value));
              }
              return results;
            } else if (value == "{") {
              // Parses a JSON object, returning a new JavaScript object.
              results = {};
              for (;;) {
                value = lex();
                // A closing curly brace marks the end of the object literal.
                if (value == "}") {
                  break;
                }
                // If the object literal contains members, the current token
                // should be a comma separator.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "}") {
                      // Unexpected trailing `,` in object literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each object member.
                    abort();
                  }
                } else {
                  hasMembers = true;
                }
                // Leading commas are not permitted, object property names must be
                // double-quoted strings, and a `:` must separate each property
                // name and value.
                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                  abort();
                }
                results[value.slice(1)] = get(lex());
              }
              return results;
            }
            // Unexpected token encountered.
            abort();
          }
          return value;
        };

        // Internal: Updates a traversed object member.
        var update = function (source, property, callback) {
          var element = walk(source, property, callback);
          if (element === undefined) {
            delete source[property];
          } else {
            source[property] = element;
          }
        };

        // Internal: Recursively traverses a parsed JSON object, invoking the
        // `callback` function for each value. This is an implementation of the
        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
        var walk = function (source, property, callback) {
          var value = source[property], length;
          if (typeof value == "object" && value) {
            // `forOwn` can't be used to traverse an array in Opera <= 8.54
            // because its `Object#hasOwnProperty` implementation returns `false`
            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
            if (getClass.call(value) == arrayClass) {
              for (length = value.length; length--;) {
                update(getClass, forOwn, value, length, callback);
              }
            } else {
              forOwn(value, function (property) {
                update(value, property, callback);
              });
            }
          }
          return callback.call(source, property, value);
        };

        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
        exports.parse = function (source, callback) {
          var result, value;
          Index = 0;
          Source = "" + source;
          result = get(lex());
          // If a JSON string contains multiple tokens, it is invalid.
          if (lex() != "$") {
            abort();
          }
          // Reset the parser state.
          Index = Source = null;
          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
        };
      }
    }

    exports.runInContext = runInContext;
    return exports;
  }

  if (freeExports && !isLoader) {
    // Export for CommonJS environments.
    runInContext(root, freeExports);
  } else {
    // Export for web browsers and JavaScript engines.
    var nativeJSON = root.JSON,
        previousJSON = root.JSON3,
        isRestored = false;

    var JSON3 = runInContext(root, (root.JSON3 = {
      // Public: Restores the original value of the global `JSON` object and
      // returns a reference to the `JSON3` object.
      "noConflict": function () {
        if (!isRestored) {
          isRestored = true;
          root.JSON = nativeJSON;
          root.JSON3 = previousJSON;
          nativeJSON = previousJSON = null;
        }
        return JSON3;
      }
    }));

    root.JSON = {
      "parse": JSON3.parse,
      "stringify": JSON3.stringify
    };
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return JSON3;
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}).call(this);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(28)(module), __webpack_require__(7)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var keys = __webpack_require__(8);
var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

var toStr = Object.prototype.toString;
var concat = Array.prototype.concat;
var origDefineProperty = Object.defineProperty;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		origDefineProperty(obj, 'x', { enumerable: false, value: obj });
		// eslint-disable-next-line no-unused-vars, no-restricted-syntax
		for (var _ in obj) { // jscs:ignore disallowUnusedVariables
			return false;
		}
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		origDefineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = concat.call(props, Object.getOwnPropertySymbols(map));
	}
	for (var i = 0; i < props.length; i += 1) {
		defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
	}
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */

module.exports = function isNaN(value) {
	return value !== value;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var implementation = __webpack_require__(15);

module.exports = function getPolyfill() {
	if (Number.isNaN && Number.isNaN(NaN) && !Number.isNaN('a')) {
		return Number.isNaN;
	}
	return implementation;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
var getProto = Object.getPrototypeOf;
var getGeneratorFunc = function () { // eslint-disable-line consistent-return
	if (!hasToStringTag) {
		return false;
	}
	try {
		return Function('return function*() {}')();
	} catch (e) {
	}
};
var generatorFunc = getGeneratorFunc();
var GeneratorFunction = generatorFunc ? getProto(generatorFunc) : {};

module.exports = function isGeneratorFunction(fn) {
	if (typeof fn !== 'function') {
		return false;
	}
	if (isFnRegex.test(fnToStr.call(fn))) {
		return true;
	}
	if (!hasToStringTag) {
		var str = toStr.call(fn);
		return str === '[object GeneratorFunction]';
	}
	return getProto(fn) === GeneratorFunction;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.is */

var NumberIsNaN = function (value) {
	return value !== value;
};

module.exports = function is(a, b) {
	if (a === 0 && b === 0) {
		return 1 / a === 1 / b;
	} else if (a === b) {
		return true;
	} else if (NumberIsNaN(a) && NumberIsNaN(b)) {
		return true;
	}
	return false;
};



/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var define = __webpack_require__(14);

var implementation = __webpack_require__(15);
var getPolyfill = __webpack_require__(16);
var shim = __webpack_require__(27);

/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */

define(implementation, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = implementation;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var origSymbol = global.Symbol;
var hasSymbolSham = __webpack_require__(21);

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(7)))

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint complexity: [2, 17], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(23);

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var implementation = __webpack_require__(24);

module.exports = Function.prototype.bind || implementation;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var keysShim;
if (!Object.keys) {
	// modified from https://github.com/es-shims/es5-shim
	var has = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var isArgs = __webpack_require__(13); // eslint-disable-line global-require
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$applicationCache: true,
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$onmozfullscreenchange: true,
		$onmozfullscreenerror: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};

	keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr.call(object) === '[object String]';
		var theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}

		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}

		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}

		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};
}
module.exports = keysShim;


/***/ }),
/* 26 */
/***/ (function(module, exports) {


var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};



/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var define = __webpack_require__(14);
var getPolyfill = __webpack_require__(16);

/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */

module.exports = function shimNumberIsNaN() {
	var polyfill = getPolyfill();
	define(Number, { isNaN: polyfill }, { isNaN: function () { return Number.isNaN !== polyfill; } });
	return polyfill;
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/attempt-x/dist/attempt-x.esm.js
/**
 * This method attempts to invoke the function, returning either the result or
 * the caught error object. Any additional arguments are provided to the
 * function when it's invoked.
 *
 * @param {Function} [fn] - The function to attempt.
 * @param {...*} [args] - The arguments to invoke the function with.
 * @returns {object} Returns an object of the result.
 */
var attempt = function attempt(fn) {
  try {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return {
      threw: false,

      /* eslint-disable-next-line babel/no-invalid-this */
      value: fn.apply(this, args)
    };
  } catch (e) {
    return {
      threw: true,
      value: e
    };
  }
};

/* harmony default export */ var attempt_x_esm = (attempt);


// CONCATENATED MODULE: ./node_modules/to-boolean-x/dist/to-boolean-x.esm.js
/**
 * The abstract operation ToBoolean converts argument to a value of type Boolean.
 *
 * @param {*} [value] - The value to be converted.
 * @returns {boolean} 'true' if value is truthy; otherwise 'false'.
 */
var toBoolean = function toBoolean(value) {
  return !!value;
};

/* harmony default export */ var to_boolean_x_esm = (toBoolean);


// CONCATENATED MODULE: ./node_modules/to-string-tag-x/dist/to-string-tag-x.esm.js
var nativeObjectToString = {}.toString;
/**
 * The `toStringTag` method returns "[object type]", where type is the
 * object type.
 *
 * @param {*} [value] - The object of which to get the object type string.
 * @returns {string} The object type string.
 */

var toStringTag = function toStringTag(value) {
  if (value === null) {
    return '[object Null]';
  }

  if (typeof value === 'undefined') {
    return '[object Undefined]';
  }

  return nativeObjectToString.call(value);
};

/* harmony default export */ var to_string_tag_x_esm = (toStringTag);


// EXTERNAL MODULE: ./node_modules/is-symbol/index.js
var is_symbol = __webpack_require__(2);
var is_symbol_default = /*#__PURE__*/__webpack_require__.n(is_symbol);

// CONCATENATED MODULE: ./node_modules/has-symbol-support-x/dist/has-symbol-support-x.esm.js
var has_symbol_support_x_esm_this = undefined;

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }



var hasSymbolSupport = attempt_x_esm(function () {
  _newArrowCheck(this, has_symbol_support_x_esm_this);

  /* eslint-disable-next-line compat/compat */
  return typeof Symbol === 'function' && is_symbol_default()(Symbol(''));
}.bind(undefined));
/**
 * Indicates if `Symbol`exists and creates the correct type.
 * `true`, if it exists and creates the correct type, otherwise `false`.
 *
 * @type boolean
 */

/* harmony default export */ var has_symbol_support_x_esm = (hasSymbolSupport.threw === false && hasSymbolSupport.value === true);


// CONCATENATED MODULE: ./node_modules/has-to-string-tag-x/dist/has-to-string-tag-x.esm.js


/**
 * Indicates if `Symbol.toStringTag`exists and is the correct type.
 * `true`, if it exists and is the correct type, otherwise `false`.
 *
 * @type boolean
 */

/* harmony default export */ var has_to_string_tag_x_esm = (has_symbol_support_x_esm &&
/* eslint-disable-next-line compat/compat */
is_symbol_default()(Symbol.toStringTag));


// EXTERNAL MODULE: ./node_modules/is-primitive/index.js
var is_primitive = __webpack_require__(0);
var is_primitive_default = /*#__PURE__*/__webpack_require__.n(is_primitive);

// CONCATENATED MODULE: ./node_modules/is-nil-x/dist/is-nil-x.esm.js
/**
 * Checks if `value` is `null` or `undefined`.
 *
 * @param {*} [value] - The value to check.
 * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
 */
var isNil = function isNil(value) {
  /* eslint-disable-next-line lodash/prefer-is-nil */
  return value === null || typeof value === 'undefined';
};

/* harmony default export */ var is_nil_x_esm = (isNil);


// CONCATENATED MODULE: ./node_modules/require-object-coercible-x/dist/require-object-coercible-x.esm.js

/**
 * The abstract operation RequireObjectCoercible throws an error if argument
 * is a value that cannot be converted to an Object using ToObject.
 *
 * @param {*} [value] - The `value` to check.
 * @throws {TypeError} If `value` is a `null` or `undefined`.
 * @returns {string} The `value`.
 */

var require_object_coercible_x_esm_requireObjectCoercible = function requireObjectCoercible(value) {
  if (is_nil_x_esm(value)) {
    throw new TypeError("Cannot call method on ".concat(value));
  }

  return value;
};

/* harmony default export */ var require_object_coercible_x_esm = (require_object_coercible_x_esm_requireObjectCoercible);


// CONCATENATED MODULE: ./node_modules/to-string-x/dist/to-string-x.esm.js

var ERROR_MESSAGE = 'Cannot convert a Symbol value to a string';
var castString = ERROR_MESSAGE.constructor;
/**
 * The abstract operation ToString converts argument to a value of type String.
 *
 * @param {*} [value] - The value to convert to a string.
 * @throws {TypeError} If `value` is a Symbol.
 * @returns {string} The converted value.
 */

var to_string_x_esm_ToString = function ToString(value) {
  if (is_symbol_default()(value)) {
    throw new TypeError(ERROR_MESSAGE);
  }

  return castString(value);
};

/* harmony default export */ var to_string_x_esm = (to_string_x_esm_ToString);


// CONCATENATED MODULE: ./node_modules/require-coercible-to-string-x/dist/require-coercible-to-string-x.esm.js


/**
 * This method requires an argument is corecible then converts using ToString.
 *
 * @param {*} [value] - The value to converted to a string.
 * @throws {TypeError} If value is null or undefined.
 * @returns {string} The value as a string.
 */

var require_coercible_to_string_x_esm_requireCoercibleToString = function requireCoercibleToString(value) {
  return to_string_x_esm(require_object_coercible_x_esm(value));
};

/* harmony default export */ var require_coercible_to_string_x_esm = (require_coercible_to_string_x_esm_requireCoercibleToString);


// CONCATENATED MODULE: ./node_modules/white-space-x/dist/white-space-x.esm.js
/**
 * A record of a white space character.
 *
 * @typedef {object} CharRecord
 * @property {number} code - The character code.
 * @property {string} description - A description of the character.
 * @property {boolean} es5 - Whether the spec lists this as a white space.
 * @property {boolean} es2015 - Whether the spec lists this as a white space.
 * @property {boolean} es2016 - Whether the spec lists this as a white space.
 * @property {boolean} es2017 - Whether the spec lists this as a white space.
 * @property {boolean} es2018 - Whether the spec lists this as a white space.
 * @property {string} string - The character string.
 */

/**
 * An array of the whitespace char codes, string, descriptions and language
 * presence in the specifications.
 *
 * @type Array.<CharRecord>
 */
var list = [{
  code: 0x0009,
  description: 'Tab',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\t"
}, {
  code: 0x000a,
  description: 'Line Feed',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\n"
}, {
  code: 0x000b,
  description: 'Vertical Tab',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\x0B"
}, {
  code: 0x000c,
  description: 'Form Feed',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\f"
}, {
  code: 0x000d,
  description: 'Carriage Return',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\r"
}, {
  code: 0x0020,
  description: 'Space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: " "
},
/*
{
  code: 0x0085,
  description: 'Next line',
  es5: false,
  es2015: false,
  es2016: false,
  es2017: false,
  es2018: false,
  string: '\u0085'
}
*/
{
  code: 0x00a0,
  description: 'No-break space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\xA0"
}, {
  code: 0x1680,
  description: 'Ogham space mark',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u1680"
}, {
  code: 0x180e,
  description: 'Mongolian vowel separator',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: false,
  es2018: false,
  string: "\u180E"
}, {
  code: 0x2000,
  description: 'En quad',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2000"
}, {
  code: 0x2001,
  description: 'Em quad',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2001"
}, {
  code: 0x2002,
  description: 'En space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2002"
}, {
  code: 0x2003,
  description: 'Em space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2003"
}, {
  code: 0x2004,
  description: 'Three-per-em space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2004"
}, {
  code: 0x2005,
  description: 'Four-per-em space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2005"
}, {
  code: 0x2006,
  description: 'Six-per-em space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2006"
}, {
  code: 0x2007,
  description: 'Figure space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2007"
}, {
  code: 0x2008,
  description: 'Punctuation space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2008"
}, {
  code: 0x2009,
  description: 'Thin space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2009"
}, {
  code: 0x200a,
  description: 'Hair space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u200A"
},
/*
{
  code: 0x200b,
  description: 'Zero width space',
  es5: false,
  es2015: false,
  es2016: false,
  es2017: false,
  es2018: false,
  string: '\u200b'
},
*/
{
  code: 0x2028,
  description: 'Line separator',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2028"
}, {
  code: 0x2029,
  description: 'Paragraph separator',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2029"
}, {
  code: 0x202f,
  description: 'Narrow no-break space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u202F"
}, {
  code: 0x205f,
  description: 'Medium mathematical space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u205F"
}, {
  code: 0x3000,
  description: 'Ideographic space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u3000"
}, {
  code: 0xfeff,
  description: 'Byte Order Mark',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\uFEFF"
}];
/**
 * A string of the ES5 to ES2016 whitespace characters.
 *
 * @type string
 */

var stringES2016 = '';
/**
 * A string of the ES2017 to ES2018 whitespace characters.
 *
 * @type string
 */

var stringES2018 = '';
var white_space_x_esm_length = list.length;

for (var white_space_x_esm_i = 0; white_space_x_esm_i < white_space_x_esm_length; white_space_x_esm_i += 1) {
  if (list[white_space_x_esm_i].es2016) {
    stringES2016 += list[white_space_x_esm_i].string;
  }

  if (list[white_space_x_esm_i].es2018) {
    stringES2018 += list[white_space_x_esm_i].string;
  }
}

var string2018 = stringES2018;
/* harmony default export */ var white_space_x_esm = (string2018);
var string2016 = stringES2016;


// CONCATENATED MODULE: ./node_modules/trim-left-x/dist/trim-left-x.esm.js


var EMPTY_STRING = '';
var RegExpCtr = /none/.constructor;
var reLeft = new RegExpCtr("^[".concat(white_space_x_esm, "]+"));
var replace = EMPTY_STRING.replace;
/**
 * This method removes whitespace from the start of a string. (ES2019).
 *
 * @param {string} [string] - The string to trim the left end whitespace from.
 * @throws {TypeError} If string is null or undefined or not coercible.
 * @returns {string} The left trimmed string.
 */

var trim_left_x_esm_trimStart = function trimStart(string) {
  return replace.call(require_coercible_to_string_x_esm(string), reLeft, EMPTY_STRING);
};

/* harmony default export */ var trim_left_x_esm = (trim_left_x_esm_trimStart);


// CONCATENATED MODULE: ./node_modules/trim-right-x/dist/trim-right-x.esm.js


var trim_right_x_esm_EMPTY_STRING = '';
var trim_right_x_esm_RegExpCtr = /none/.constructor;
var reRight2018 = new trim_right_x_esm_RegExpCtr("[".concat(white_space_x_esm, "]+$"));
var trim_right_x_esm_replace = trim_right_x_esm_EMPTY_STRING.replace;
/**
 * This method removes whitespace from the end of a string. (ES2019).
 *
 * @param {string} [string] - The string to trim the right end whitespace from.
 * @throws {TypeError} If string is null or undefined or not coercible.
 * @returns {string} The right trimmed string.
 */

var trim_right_x_esm_trimEnd = function trimEnd(string) {
  return trim_right_x_esm_replace.call(require_coercible_to_string_x_esm(string), reRight2018, trim_right_x_esm_EMPTY_STRING);
};

/* harmony default export */ var trim_right_x_esm = (trim_right_x_esm_trimEnd);


// CONCATENATED MODULE: ./node_modules/trim-x/dist/trim-x.esm.js


/**
 * This method removes whitespace from the start and end of a string.
 * (ES2019).
 *
 * @param {string} [string] - The string to trim the whitespace from.
 * @throws {TypeError} If string is null or undefined or not coercible.
 * @returns {string} The trimmed string.
 */

var trim_x_esm_trim = function trim(string) {
  return trim_left_x_esm(trim_right_x_esm(string));
};

/* harmony default export */ var trim_x_esm = (trim_x_esm_trim);


// CONCATENATED MODULE: ./node_modules/normalize-space-x/dist/normalize-space-x.esm.js


var SPACE = ' ';
var normalize_space_x_esm_RegExpCtr = /none/.constructor;
var reNormalize2018 = new normalize_space_x_esm_RegExpCtr("[".concat(white_space_x_esm, "]+"), 'g');
var normalize_space_x_esm_replace = SPACE.replace;
/**
 * This method strips leading and trailing white-space from a string,
 * replaces sequences of whitespace characters by a single space,
 * and returns the resulting string. (ES2019).
 *
 * @param {string} [string] - The string to be normalized.
 * @throws {TypeError} If string is null or undefined or not coercible.
 */

var normalize_space_x_esm_normalizeSpace = function normalizeSpace(string) {
  return normalize_space_x_esm_replace.call(trim_x_esm(string), reNormalize2018, SPACE);
};

/* harmony default export */ var normalize_space_x_esm = (normalize_space_x_esm_normalizeSpace);


// CONCATENATED MODULE: ./node_modules/replace-comments-x/dist/replace-comments-x.esm.js


var replace_comments_x_esm_EMPTY_STRING = '';
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
var replace_comments_x_esm_replace = replace_comments_x_esm_EMPTY_STRING.replace;
/**
 * This method replaces comments in a string.
 *
 * @param {string} [string] - The string to be stripped.
 * @param {string} [replacement=''] - The string to be used as a replacement.
 * @throws {TypeError} If string is null or undefined or not coercible.
 * @throws {TypeError} If replacement is not coercible.
 * @returns {string} The new string with the comments replaced.
 */

var replace_comments_x_esm_replaceComments = function replaceComments(string, replacement) {
  return replace_comments_x_esm_replace.call(require_coercible_to_string_x_esm(string), STRIP_COMMENTS, arguments.length > 1 ? to_string_x_esm(replacement) : replace_comments_x_esm_EMPTY_STRING);
};

/* harmony default export */ var replace_comments_x_esm = (replace_comments_x_esm_replaceComments);


// CONCATENATED MODULE: ./node_modules/is-function-x/dist/is-function-x.esm.js
var is_function_x_esm_this = undefined;

function is_function_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }








var FunctionCtr = attempt_x_esm.constructor;
var castBoolean = true.constructor;
var is_function_x_esm_SPACE = ' ';
var fToString = attempt_x_esm.toString;
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var asyncTag = '[object AsyncFunction]';
var ctrRx = /^class /;
var test = ctrRx.test;
var hasNativeClass = attempt_x_esm(function () {
  is_function_x_esm_newArrowCheck(this, is_function_x_esm_this);

  /* eslint-disable-next-line babel/new-cap */
  return FunctionCtr('"use strict"; return class My {};')();
}.bind(undefined)).threw === false;

var testClassstring = function _testClassstring(value) {
  return test.call(ctrRx, normalize_space_x_esm(replace_comments_x_esm(fToString.call(value), is_function_x_esm_SPACE)));
};

var isES6ClassFn = function isES6ClassFunc(value) {
  var result = attempt_x_esm(testClassstring, value);
  return result.threw === false && result.value;
};
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @private
 * @param {*} value - The value to check.
 * @param {boolean} allowClass - Whether to filter ES6 classes.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 * else `false`.
 */


var tryFuncToString = function funcToString(value, allowClass) {
  if (hasNativeClass && allowClass === false && isES6ClassFn(value)) {
    return false;
  }

  return attempt_x_esm.call(value, fToString).threw === false;
};
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @param {*} value - The value to check.
 * @param {boolean} [allowClass=false] - Whether to filter ES6 classes.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 * else `false`.
 */


var is_function_x_esm_isFunction = function isFunction(value, allowClass) {
  if (is_primitive_default()(value)) {
    return false;
  }

  if (has_to_string_tag_x_esm) {
    return tryFuncToString(value, to_boolean_x_esm(allowClass));
  }

  if (hasNativeClass && castBoolean(allowClass) === false && isES6ClassFn(value)) {
    return false;
  }

  var strTag = to_string_tag_x_esm(value);
  return strTag === funcTag || strTag === genTag || strTag === asyncTag;
};

/* harmony default export */ var is_function_x_esm = (is_function_x_esm_isFunction);


// CONCATENATED MODULE: ./node_modules/to-string-symbols-supported-x/dist/to-string-symbols-supported-x.esm.js


/* eslint-disable-next-line compat/compat */

var pToString = has_symbol_support_x_esm && Symbol.prototype.toString;
var isSymbolFn = typeof pToString === 'function' && is_symbol_default.a;
/** @type {Function} */

var to_string_symbols_supported_x_esm_castString = ''.constructor;
/**
 * The abstract operation ToString converts argument to a value of type String,
 * however the specification states that if the argument is a Symbol then a
 * 'TypeError' is thrown. This version also allows Symbols be converted to
 * a string. Other uncoercible exotics will still throw though.
 *
 * @param {*} [value] - The value to convert to a string.
 * @returns {string} The converted value.
 */

var toStringSymbolsSupported = function toStringSymbolsSupported(value) {
  return isSymbolFn && isSymbolFn(value) ? pToString.call(value) : to_string_symbols_supported_x_esm_castString(value);
};

/* harmony default export */ var to_string_symbols_supported_x_esm = (toStringSymbolsSupported);


// CONCATENATED MODULE: ./node_modules/assert-is-function-x/dist/assert-is-function-x.esm.js



/**
 * Tests `callback` to see if it is a function, throws a `TypeError` if it is
 * not. Otherwise returns the `callback`.
 *
 * @param {*} callback - The argument to be tested.
 * @throws {TypeError} Throws if `callback` is not a function.
 * @returns {*} Returns `callback` if it is function.
 */

var assert_is_function_x_esm_assertIsFunction = function assertIsFunction(callback) {
  if (is_function_x_esm(callback) === false) {
    var msg = is_primitive_default()(callback) ? to_string_symbols_supported_x_esm(callback) : '#<Object>';
    throw new TypeError("".concat(msg, " is not a function"));
  }

  return callback;
};

/* harmony default export */ var assert_is_function_x_esm = (assert_is_function_x_esm_assertIsFunction);


// CONCATENATED MODULE: ./node_modules/to-object-x/dist/to-object-x.esm.js

var castObject = {}.constructor;
/**
 * The abstract operation ToObject converts argument to a value of
 * type Object.
 *
 * @param {*} value - The `value` to convert.
 * @throws {TypeError} If `value` is a `null` or `undefined`.
 * @returns {!object} The `value` converted to an object.
 */

var to_object_x_esm_toObject = function toObject(value) {
  return castObject(require_object_coercible_x_esm(value));
};

/* harmony default export */ var to_object_x_esm = (to_object_x_esm_toObject);


// EXTERNAL MODULE: ./node_modules/is-arguments/index.js
var is_arguments = __webpack_require__(5);
var is_arguments_default = /*#__PURE__*/__webpack_require__.n(is_arguments);

// CONCATENATED MODULE: ./node_modules/is-array-x/dist/is-array-x.esm.js
var is_array_x_esm_this = undefined;

function is_array_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }



var nativeIsArray = [].isArray;
var isArrayNative = typeof nativeIsArray === 'function' && nativeIsArray;
var testRes = isArrayNative && attempt_x_esm(function () {
  is_array_x_esm_newArrowCheck(this, is_array_x_esm_this);

  return isArrayNative([]) === true && isArrayNative({
    length: 0
  }) === false;
}.bind(undefined));

var isArrayFn = function iife() {
  if (testRes && testRes.threw === false && testRes.value === true) {
    return isArrayNative;
  }
  /**
   * The isArray() function determines whether the passed value is an Array.
   *
   * @function isArray
   * @param {*} [value] - The object to be checked..
   * @returns {boolean} `true` if the object is an Array; otherwise, `false`.
   */


  return function isArray(value) {
    return to_string_tag_x_esm(value) === '[object Array]';
  };
}();

/* harmony default export */ var is_array_x_esm = (isArrayFn);


// EXTERNAL MODULE: ./node_modules/is-date-object/index.js
var is_date_object = __webpack_require__(3);
var is_date_object_default = /*#__PURE__*/__webpack_require__.n(is_date_object);

// CONCATENATED MODULE: ./node_modules/to-primitive-x/dist/to-primitive-x.esm.js







var ZERO = 0;
var ONE = 1;
/* eslint-disable-next-line no-void */

var UNDEFINED = void ZERO;
var NUMBER = 'number';
var STRING = 'string';
var DEFAULT = 'default';
/** @type {StringConstructor} */

var StringCtr = STRING.constructor;
/** @type {NumberConstructor} */

var NumberCtr = ZERO.constructor;
/* eslint-disable-next-line compat/compat */

var symToPrimitive = has_symbol_support_x_esm && Symbol.toPrimitive;
/* eslint-disable-next-line compat/compat */

var symValueOf = has_symbol_support_x_esm && Symbol.prototype.valueOf;
var toStringOrder = ['toString', 'valueOf'];
var toNumberOrder = ['valueOf', 'toString'];
var orderLength = 2;
/**
 * @param {*} ordinary - The ordinary to convert.
 * @param {*} hint - The hint.
 * @returns {*} - The primitive.
 */

var ordinaryToPrimitive = function _ordinaryToPrimitive(ordinary, hint) {
  require_object_coercible_x_esm(ordinary);

  if (typeof hint !== 'string' || hint !== NUMBER && hint !== STRING) {
    throw new TypeError('hint must be "string" or "number"');
  }

  var methodNames = hint === STRING ? toStringOrder : toNumberOrder;
  var method;
  var result;

  for (var i = ZERO; i < orderLength; i += ONE) {
    method = ordinary[methodNames[i]];

    if (is_function_x_esm(method)) {
      result = method.call(ordinary);

      if (is_primitive_default()(result)) {
        return result;
      }
    }
  }

  throw new TypeError('No default value');
};
/**
 * @param {*} object - The object.
 * @param {*} property - The property.
 * @returns {undefined|Function} - The method.
 */


var getMethod = function _getMethod(object, property) {
  var func = object[property];

  if (is_nil_x_esm(func) === false) {
    if (is_function_x_esm(func) === false) {
      throw new TypeError("".concat(func, " returned for property ").concat(property, " of object ").concat(object, " is not a function"));
    }

    return func;
  }

  return UNDEFINED;
};
/**
 * Get the hint.
 *
 * @param {*} value - The value to compare.
 * @param {boolean} supplied - Was a value supplied.
 * @returns {string} - The hint string.
 */


var getHint = function getHint(value, supplied) {
  if (supplied) {
    if (value === StringCtr) {
      return STRING;
    }

    if (value === NumberCtr) {
      return NUMBER;
    }
  }

  return DEFAULT;
};
/**
 * Get the primitive from the exotic.
 *
 * @param {*} value - The exotic.
 * @returns {*} - The primitive.
 */


var to_primitive_x_esm_getExoticToPrim = function getExoticToPrim(value) {
  if (has_symbol_support_x_esm) {
    if (symToPrimitive) {
      return getMethod(value, symToPrimitive);
    }

    if (is_symbol_default()(value)) {
      return symValueOf;
    }
  }

  return UNDEFINED;
};
/**
 * This method converts a JavaScript object to a primitive value.
 * Note: When toPrimitive is called with no hint, then it generally behaves as
 * if the hint were Number. However, objects may over-ride this behaviour by
 * defining a @@toPrimitive method. Of the objects defined in this specification
 * only Date objects (see 20.3.4.45) and Symbol objects (see 19.4.3.4) over-ride
 * the default ToPrimitive behaviour. Date objects treat no hint as if the hint
 * were String.
 *
 * @param {*} input - The input to convert.
 * @param {NumberConstructor|StringConstructor} [preferredType] - The preferred type (String or Number).
 * @throws {TypeError} If unable to convert input to a primitive.
 * @returns {string|number} The converted input as a primitive.
 * @see {http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive}
 */


var to_primitive_x_esm_toPrimitive = function toPrimitive(input, preferredType) {
  if (is_primitive_default()(input)) {
    return input;
  }

  var hint = getHint(preferredType, arguments.length > ONE);
  var exoticToPrim = to_primitive_x_esm_getExoticToPrim(input);

  if (typeof exoticToPrim !== 'undefined') {
    var result = exoticToPrim.call(input, hint);

    if (is_primitive_default()(result)) {
      return result;
    }

    throw new TypeError('unable to convert exotic object to primitive');
  }

  var newHint = hint === DEFAULT && (is_date_object_default()(input) || is_symbol_default()(input)) ? STRING : hint;
  return ordinaryToPrimitive(input, newHint === DEFAULT ? NUMBER : newHint);
};

/* harmony default export */ var to_primitive_x_esm = (to_primitive_x_esm_toPrimitive);


// CONCATENATED MODULE: ./node_modules/nan-x/dist/nan-x.esm.js
/**
 * The constant NaN derived mathematically by 0 / 0.
 *
 * @type number
 */
/* harmony default export */ var nan_x_esm = (0 / 0);


// CONCATENATED MODULE: ./node_modules/parse-int-x/dist/parse-int-x.esm.js



var nativeParseInt = parseInt;
/**  @type {Function} */

var castNumber = 0 .constructor; // noinspection JSPotentiallyInvalidConstructorUsage

var _ref = '',
    charAt = _ref.charAt;
var hexRegex = /^[-+]?0[xX]/;
var parse_int_x_esm_test = hexRegex.test;
/**
 * This method parses a string argument and returns an integer of the specified
 * radix (the base in mathematical numeral systems). (ES2019).
 *
 * @param {string} [string] - The value to parse. If the string argument is not a
 *  string, then it is converted to a string (using the ToString abstract
 *  operation). Leading whitespace in the string argument is ignored.
 * @param {number} [radix] - An integer between 2 and 36 that represents the radix
 *  (the base in mathematical numeral systems) of the above mentioned string.
 *  Specify 10 for the decimal numeral system commonly used by humans. Always
 *  specify this parameter to eliminate reader confusion and to guarantee
 *  predictable behavior. Different implementations produce different results
 *  when a radix is not specified, usually defaulting the value to 10.
 * @throws {TypeError} If target is a Symbol or is not coercible.
 * @returns {number} An integer number parsed from the given string. If the first
 *  character cannot be converted to a number, NaN is returned.
 */

var parse_int_x_esm_$parseInt = function $parseInt(string, radix) {
  var str = trim_left_x_esm(to_string_x_esm(string));

  if (charAt.call(str, 0) === "\u180E") {
    return nan_x_esm;
  }

  return nativeParseInt(str, castNumber(radix) || (parse_int_x_esm_test.call(hexRegex, str) ? 16 : 10));
};

/* harmony default export */ var parse_int_x_esm = (parse_int_x_esm_$parseInt);


// CONCATENATED MODULE: ./node_modules/to-number-x/dist/to-number-x.esm.js





var binaryRadix = 2;
var octalRadix = 8;
var testCharsCount = 2;
var to_number_x_esm_ERROR_MESSAGE = 'Cannot convert a Symbol value to a number';
var to_number_x_esm_castNumber = testCharsCount.constructor;
var pStrSlice = to_number_x_esm_ERROR_MESSAGE.slice;
var binaryRegex = /^0b[01]+$/i;
var RegExpConstructor = binaryRegex.constructor; // Note that in IE 8, RegExp.prototype.test doesn't seem to exist: ie, "test" is
// an own property of regexes. wtf.

var to_number_x_esm_test = binaryRegex.test;

var isBinary = function _isBinary(value) {
  return to_number_x_esm_test.call(binaryRegex, value);
};

var octalRegex = /^0o[0-7]+$/i;

var isOctal = function _isOctal(value) {
  return to_number_x_esm_test.call(octalRegex, value);
};

var nonWSregex2018 = new RegExpConstructor("[\x85\u180E\u200B\uFFFE]", 'g');

var hasNonWS2018 = function _hasNonWS(value) {
  return to_number_x_esm_test.call(nonWSregex2018, value);
};

var invalidHexLiteral = /^[-+]0x[0-9a-f]+$/i;

var isInvalidHexLiteral = function _isInvalidHexLiteral(value) {
  return to_number_x_esm_test.call(invalidHexLiteral, value);
};
/**
 * This method converts argument to a value of type Number. (ES2018).
 *
 * @param {*} [argument] - The argument to convert to a number.
 * @throws {TypeError} - If argument is a Symbol or not coercible.
 * @returns {*} The argument converted to a number.
 */


var to_number_x_esm_toNumber = function toNumber(argument) {
  var value = to_primitive_x_esm(argument, to_number_x_esm_castNumber);

  if (is_symbol_default()(value)) {
    throw new TypeError(to_number_x_esm_ERROR_MESSAGE);
  }

  if (typeof value === 'string') {
    if (isBinary(value)) {
      return toNumber(parse_int_x_esm(pStrSlice.call(value, testCharsCount), binaryRadix));
    }

    if (isOctal(value)) {
      return toNumber(parse_int_x_esm(pStrSlice.call(value, testCharsCount), octalRadix));
    }

    if (hasNonWS2018(value) || isInvalidHexLiteral(value)) {
      return nan_x_esm;
    }

    var trimmed = trim_x_esm(value);

    if (trimmed !== value) {
      return toNumber(trimmed);
    }
  }

  return to_number_x_esm_castNumber(value);
};

/* harmony default export */ var to_number_x_esm = (to_number_x_esm_toNumber);


// CONCATENATED MODULE: ./node_modules/is-nan-x/dist/is-nan-x.esm.js
/**
 * This method determines whether the passed value is NaN and its type is
 * `Number`. It is a more robust version of the original, global isNaN().
 *
 * @param {*} [value] - The value to be tested for NaN.
 * @returns {boolean} `true` if the given value is NaN and its type is Number;
 *  otherwise, `false`.
 */
var is_nan_x_esm_isNaN = function isNaN(value) {
  /* eslint-disable-next-line no-self-compare */
  return value !== value;
};

/* harmony default export */ var is_nan_x_esm = (is_nan_x_esm_isNaN);


// CONCATENATED MODULE: ./node_modules/infinity-x/dist/infinity-x.esm.js
/**
 * The constant value Infinity derived mathematically by 1 / 0.
 *
 * @type number
 */
/* harmony default export */ var infinity_x_esm = (1 / 0);


// CONCATENATED MODULE: ./node_modules/is-finite-x/dist/is-finite-x.esm.js


/**
 * This method determines whether the passed value is a finite number.
 *
 * @param {*} [number] - The value to be tested for finiteness.
 * @returns {boolean} A Boolean indicating whether or not the given value is a finite number.
 */

var is_finite_x_esm_isFinite = function isFinite(number) {
  return typeof number === 'number' && is_nan_x_esm(number) === false && number !== infinity_x_esm && number !== -infinity_x_esm;
};

/* harmony default export */ var is_finite_x_esm = (is_finite_x_esm_isFinite);


// CONCATENATED MODULE: ./node_modules/math-sign-x/dist/math-sign-x.esm.js


/**
 * This method returns the sign of a number, indicating whether the number is positive,
 * negative or zero. (ES2019).
 *
 * @param {*} x - A number.
 * @returns {number} A number representing the sign of the given argument. If the argument
 * is a positive number, negative number, positive zero or negative zero, the function will
 * return 1, -1, 0 or -0 respectively. Otherwise, NaN is returned.
 */

var math_sign_x_esm_sign = function sign(x) {
  var n = to_number_x_esm(x);

  if (n === 0 || is_nan_x_esm(n)) {
    return n;
  }

  return n > 0 ? 1 : -1;
};

/* harmony default export */ var math_sign_x_esm = (math_sign_x_esm_sign);


// CONCATENATED MODULE: ./node_modules/to-integer-x/dist/to-integer-x.esm.js




var abs = Math.abs,
    floor = Math.floor;
/**
 * Converts `value` to an integer. (ES2019).
 *
 * @param {*} value - The value to convert.
 * @returns {number} Returns the converted integer.
 */

var to_integer_x_esm_toInteger = function toInteger(value) {
  var number = to_number_x_esm(value);

  if (is_nan_x_esm(number)) {
    return 0;
  }

  if (number === 0 || is_finite_x_esm(number) === false) {
    return number;
  }

  return math_sign_x_esm(number) * floor(abs(number));
};

/* harmony default export */ var to_integer_x_esm = (to_integer_x_esm_toInteger);


// CONCATENATED MODULE: ./node_modules/to-length-x/dist/to-length-x.esm.js

var MAX_SAFE_INTEGER = 9007199254740991;
/**
 * Converts `value` to an integer suitable for use as the length of an
 * array-like object. (ES2019).
 *
 * @param {*} value - The value to convert.
 * @returns {number} Returns the converted integer.
 */

var to_length_x_esm_toLength = function toLength(value) {
  var len = to_integer_x_esm(value); // includes converting -0 to +0

  if (len <= 0) {
    return 0;
  }

  if (len > MAX_SAFE_INTEGER) {
    return MAX_SAFE_INTEGER;
  }

  return len;
};

/* harmony default export */ var to_length_x_esm = (to_length_x_esm_toLength);


// CONCATENATED MODULE: ./node_modules/has-boxed-string-x/dist/has-boxed-string-x.esm.js
var has_boxed_string_x_esm_string = 'a';
var boxedString = {}.constructor(has_boxed_string_x_esm_string);
/**
 * Check failure of by-index access of string characters (IE < 9)
 * and failure of `0 in boxedString` (Rhino).
 *
 * `true` if no failure; otherwise `false`.
 *
 * @type boolean
 */

var hasBoxed = boxedString[0] === has_boxed_string_x_esm_string && 0 in boxedString;
/* harmony default export */ var has_boxed_string_x_esm = (hasBoxed);


// EXTERNAL MODULE: ./node_modules/is-string/index.js
var is_string = __webpack_require__(1);
var is_string_default = /*#__PURE__*/__webpack_require__.n(is_string);

// CONCATENATED MODULE: ./node_modules/split-if-boxed-bug-x/dist/split-if-boxed-bug-x.esm.js


var split_if_boxed_bug_x_esm_EMPTY_STRING = '';
var strSplit = split_if_boxed_bug_x_esm_EMPTY_STRING.split;
var isStringFn = has_boxed_string_x_esm === false && typeof strSplit === 'function' && is_string_default.a;
/**
 * This method tests if a value is a string with the boxed bug; splits to an
 * array for iteration; otherwise returns the original value.
 *
 * @param {*} [value] - The value to be tested.
 * @returns {*} An array or characters if value was a string with the boxed bug;
 *  otherwise the value.
 */

var splitIfBoxedBug = function splitIfBoxedBug(value) {
  return isStringFn && isStringFn(value) ? strSplit.call(value, split_if_boxed_bug_x_esm_EMPTY_STRING) : value;
};

/* harmony default export */ var split_if_boxed_bug_x_esm = (splitIfBoxedBug);


// CONCATENATED MODULE: ./node_modules/array-like-slice-x/dist/array-like-slice-x.esm.js





var getMax = function _getMax(a, b) {
  return a >= b ? a : b;
};

var getMin = function _getMin(a, b) {
  return a <= b ? a : b;
};

var setRelative = function _setRelative(value, length) {
  return value < 0 ? getMax(length + value, 0) : getMin(value, length);
};
/**
 * The slice() method returns a shallow copy of a portion of an array into a new
 * array object selected from begin to end (end not included). The original
 * array will not be modified.
 *
 * @param {!object} arrayLike - The array like object to slice.
 * @param {number} [start] - Zero-based index at which to begin extraction.
 *  A negative index can be used, indicating an offset from the end of the
 *  sequence. Running slice(-2) extracts the last two elements in the sequence.
 *  If begin is undefined, slice begins from index 0.
 * @param {number} [end] - Zero-based index before which to end extraction.
 *  Slice extracts up to but not including end. For example, slice([0,1,2,3,4],1,4)
 *  extracts the second element through the fourth element (elements indexed
 *  1, 2, and 3).
 *  A negative index can be used, indicating an offset from the end of the
 *  sequence. Running slice(2,-1) extracts the third element through the second-to-last
 *  element in the sequence.
 *  If end is omitted, slice extracts through the end of the sequence (arr.length).
 *  If end is greater than the length of the sequence, slice extracts through
 *  the end of the sequence (arr.length).
 * @returns {Array} A new array containing the extracted elements.
 */


var array_like_slice_x_esm_slice = function slice(arrayLike, start, end) {
  var iterable = split_if_boxed_bug_x_esm(to_object_x_esm(arrayLike));
  var length = to_length_x_esm(iterable.length);
  var k = setRelative(to_integer_x_esm(start), length);
  var relativeEnd = typeof end === 'undefined' ? length : to_integer_x_esm(end);
  var finalEnd = setRelative(relativeEnd, length);
  var val = [];
  val.length = getMax(finalEnd - k, 0);
  var next = 0;

  while (k < finalEnd) {
    if (k in iterable) {
      val[next] = iterable[k];
    }

    next += 1;
    k += 1;
  }

  return val;
};

/* harmony default export */ var array_like_slice_x_esm = (array_like_slice_x_esm_slice);


// CONCATENATED MODULE: ./node_modules/array-slice-x/dist/array-slice-x.esm.js






var nativeSlice = [].slice;
var resultArray = nativeSlice ? attempt_x_esm.call([1, 2, 3], nativeSlice, 1, 2) : null;
var failArray = resultArray ? resultArray.threw || is_array_x_esm(resultArray.value) === false || resultArray.value.length !== 1 || resultArray.value[0] !== 2 : false;
var resultString = nativeSlice ? attempt_x_esm.call('abc', nativeSlice, 1, 2) : null;
var failString = resultString ? resultString.threw || is_array_x_esm(resultString.value) === false || resultString.value.length !== 1 || resultString.value[0] !== 'b' : false;
var array_slice_x_esm_doc = typeof document !== 'undefined' && document;
var resultDocElement = nativeSlice && array_slice_x_esm_doc ? attempt_x_esm.call(array_slice_x_esm_doc.documentElement, nativeSlice).threw : null;
var failDOM = resultDocElement ? resultDocElement.threw : false;
/**
 * The slice() method returns a shallow copy of a portion of an array into a new
 * array object selected from begin to end (end not included). The original
 * array will not be modified.
 *
 * @param {Array|object} array - The array to slice.
 * @param {number} [start] - Zero-based index at which to begin extraction.
 *  A negative index can be used, indicating an offset from the end of the
 *  sequence. Running slice(-2) extracts the last two elements in the sequence.
 *  If begin is undefined, slice begins from index 0.
 * @param {number} [end] - Zero-based index before which to end extraction.
 *  Slice extracts up to but not including end. For example, slice(1,4)
 *  extracts the second element through the fourth element (elements indexed
 *  1, 2, and 3).
 *  A negative index can be used, indicating an offset from the end of the
 *  sequence. Running slice(2,-1) extracts the third element through the second-to-last
 *  element in the sequence.
 *  If end is omitted, slice extracts through the end of the
 *  sequence (arr.length).
 *  If end is greater than the length of the sequence, slice extracts through
 *  the end of the sequence (arr.length).
 * @returns {Array} A new array containing the extracted elements.
 */

var array_slice_x_esm_slice = function slice(array, start, end) {
  var object = to_object_x_esm(array);

  if (failArray || failDOM && is_array_x_esm(object) === false || failString && is_string_default()(object) || is_arguments_default()(object)) {
    return array_like_slice_x_esm(object, start, end);
  }
  /* eslint-disable-next-line prefer-rest-params */


  return nativeSlice.apply(object, array_like_slice_x_esm(arguments, 1));
};

/* harmony default export */ var array_slice_x_esm = (array_slice_x_esm_slice);


// CONCATENATED MODULE: ./node_modules/bind-x/dist/bind-x.esm.js
var bind_x_esm_this = undefined;

function bind_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }





var nb = assert_is_function_x_esm.bind;
var nativeBind = typeof nb === 'function' && nb;
var isWorking;

if (nativeBind) {
  /* eslint-disable-next-line no-void */
  var gra = void 0;
  /* eslint-disable-next-line no-void */

  var bind_x_esm_context = void 0;
  /* eslint-disable-next-line no-unused-vars */

  var bind_x_esm_fn = function fn(arg1, arg2) {
    /* eslint-disable-next-line babel/no-invalid-this */
    bind_x_esm_context = this;
    gra = arg1;
    /* eslint-disable-next-line prefer-rest-params */

    return arguments;
  };

  var testThis = [];
  var bind_x_esm_res = attempt_x_esm.call(bind_x_esm_fn, nativeBind, testThis, 1);
  isWorking = bind_x_esm_res.threw === false && typeof bind_x_esm_res.value === 'function';

  if (isWorking) {
    bind_x_esm_res = attempt_x_esm(bind_x_esm_res.value, 2, 3);
    isWorking = bind_x_esm_res.threw === false && gra === 1 && bind_x_esm_context === testThis && bind_x_esm_res.value.length === 3;
  }

  if (isWorking) {
    var oracle = [1, 2, 3];

    var Ctr = function Ctr() {
      isWorking = this !== oracle;
      return oracle;
    };

    bind_x_esm_res = attempt_x_esm.call(Ctr, nativeBind, null);
    isWorking = bind_x_esm_res.threw === false && typeof bind_x_esm_res.value === 'function';

    if (isWorking) {
      bind_x_esm_res = attempt_x_esm(function () {
        bind_x_esm_newArrowCheck(this, bind_x_esm_this);

        /* eslint-disable-next-line babel/new-cap,new-cap */
        return new bind_x_esm_res.value();
      }.bind(undefined));

      if (isWorking) {
        isWorking = bind_x_esm_res.threw === false && bind_x_esm_res.value === oracle;
      }
    }
  }
}
/**
 * The bind() method creates a new function that, when called, has its this
 * keyword set to the provided value, with a given sequence of arguments
 * preceding any provided when the new function is called.
 *
 * @param {Function} target - The target function.
 * @param {*} thisArg - The value to be passed as the this parameter to the target
 *  function when the bound function is called. The value is ignored if the
 *  bound function is constructed using the new operator.
 * @param {*} [args] - Arguments to prepend to arguments provided to the bouund
 *  function when invoking the target function.
 * @throws {TypeError} If target is not a function.
 * @returns {Function} The bound function.
 */


var $bind;

if (isWorking) {
  /* eslint-disable-next-line no-unused-vars */
  $bind = function bind(target, thisArg) {
    /* eslint-disable-next-line prefer-rest-params */
    return nativeBind.apply(assert_is_function_x_esm(target), array_slice_x_esm(arguments, 1));
  };
} else {
  var bind_x_esm_concat = function concat(a, b) {
    var aLength = a.length;
    var bLength = b.length;
    var result = array_slice_x_esm(a);
    result.length += bLength;

    for (var index = 0; index < bLength; index += 1) {
      result[aLength + index] = b[index];
    }

    return result;
  };
  /* eslint-disable-next-line lodash/prefer-noop */


  var Empty = function Empty() {};

  $bind = function bind(target, thisArg) {
    assert_is_function_x_esm(target);
    /* eslint-disable-next-line prefer-rest-params */

    var args = array_slice_x_esm(arguments, 2);
    var bound;

    var binder = function _binder() {
      /* eslint-disable-next-line babel/no-invalid-this */
      if (this instanceof bound) {
        /* eslint-disable-next-line babel/no-invalid-this,prefer-rest-params */
        var result = target.apply(this, bind_x_esm_concat(args, arguments));
        /* eslint-disable-next-line babel/no-invalid-this */

        return is_primitive_default()(result) ? this : result;
      }
      /* eslint-disable-next-line prefer-rest-params */


      return target.apply(thisArg, bind_x_esm_concat(args, arguments));
    };

    var boundLength = target.length - args.length;

    if (boundLength < 0) {
      boundLength = 0;
    }

    var lastIndex = boundLength - 1;
    var boundArgs = '';

    for (var index = 0; index < boundLength; index += 1) {
      boundArgs += "$_".concat(index, "_$").concat(index < lastIndex ? ',' : '');
    }
    /* eslint-disable-next-line no-new-func */


    bound = Function('binder', 'slice', "return function (".concat(boundArgs, "){ return binder.apply(this,slice(arguments)); }"))(binder, array_slice_x_esm);

    if (target.prototype) {
      Empty.prototype = target.prototype;
      bound.prototype = new Empty();
      Empty.prototype = null;
    }

    return bound;
  };
}

var libBind = $bind;
/* harmony default export */ var bind_x_esm = (libBind);


// EXTERNAL MODULE: ./node_modules/is-generator-function/index.js
var is_generator_function = __webpack_require__(17);
var is_generator_function_default = /*#__PURE__*/__webpack_require__.n(is_generator_function);

// CONCATENATED MODULE: ./node_modules/get-prototype-of-x/dist/get-prototype-of-x.esm.js


/**
 * This method returns the prototype (i.e. The value of the internal [[Prototype]] property)
 * of the specified object.
 *
 * @function getPrototypeOf
 * @param {*} obj - The object whose prototype is to be returned.
 * @returns {object} The prototype of the given object. If there are no inherited properties, null is returned.
 */

var gpo;
gpo = {}.getPrototypeOf;

if (gpo) {
  try {
    gpo = gpo(Object) === {}.prototype && gpo;
  } catch (ignore) {
    gpo = null;
  }
}

if (gpo) {
  try {
    gpo(1);
  } catch (ignore) {
    /** @type {Function} */
    var $getPrototypeOf = gpo;

    gpo = function getPrototypeOf(obj) {
      return $getPrototypeOf(to_object_x_esm(obj));
    };
  }
} else {
  gpo = function getPrototypeOf(obj) {
    var object = to_object_x_esm(obj);
    /* eslint-disable-next-line no-proto */

    var proto = object.__proto__;

    if (proto || proto === null) {
      return proto;
    }

    if (is_function_x_esm(object.constructor)) {
      return object.constructor.prototype;
    }

    if (object instanceof Object) {
      return Object.prototype;
    }

    return null;
  };
}

var getPO = gpo;
/* harmony default export */ var get_prototype_of_x_esm = (getPO);


// CONCATENATED MODULE: ./node_modules/is-async-function-x/dist/is-async-function-x.esm.js
var is_async_function_x_esm_this = undefined;

function is_async_function_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }







var isFnRegex = /^async function/;
var is_async_function_x_esm_test = isFnRegex.test;
var functionCtr = attempt_x_esm.constructor;
var is_async_function_x_esm_fToString = functionCtr.prototype.toString;
var is_async_function_x_esm_testRes = attempt_x_esm(function () {
  is_async_function_x_esm_newArrowCheck(this, is_async_function_x_esm_this);

  return get_prototype_of_x_esm(functionCtr('return async function() {}')());
}.bind(undefined));
var supportsAsync = is_async_function_x_esm_testRes.threw === false;
var asyncProto = is_async_function_x_esm_testRes.value;
/**
 * Checks if `value` is classified as an `Async Function` object.
 *
 * @param {*} fn - The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 * else `false`.
 */

var is_async_function_x_esm_isAsyncFunction = function isAsyncFunction(fn) {
  if (supportsAsync === false || typeof fn !== 'function') {
    return false;
  }

  var str;

  try {
    str = normalize_space_x_esm(replace_comments_x_esm(is_async_function_x_esm_fToString.call(fn), ' '));
  } catch (ignore) {
    return false;
  }

  if (is_async_function_x_esm_test.call(isFnRegex, str)) {
    return true;
  }

  if (has_to_string_tag_x_esm === false) {
    return to_string_tag_x_esm(fn) === '[object AsyncFunction]';
  }

  return get_prototype_of_x_esm(fn) === asyncProto;
};

/* harmony default export */ var is_async_function_x_esm = (is_async_function_x_esm_isAsyncFunction);


// EXTERNAL MODULE: ./node_modules/is-regex/index.js
var is_regex = __webpack_require__(6);
var is_regex_default = /*#__PURE__*/__webpack_require__.n(is_regex);

// CONCATENATED MODULE: ./node_modules/array-for-each-x/dist/array-for-each-x.esm.js
function array_for_each_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }







var nfe = [].forEach;
var nativeForEach = typeof nfe === 'function' && nfe;

var array_for_each_x_esm_test1 = function test1() {
  var _this = this;

  var spy = 0;
  var res = attempt_x_esm.call([1, 2], nativeForEach, function (item) {
    array_for_each_x_esm_newArrowCheck(this, _this);

    spy += item;
  }.bind(this));
  return res.threw === false && typeof res.value === 'undefined' && spy === 3;
};

var array_for_each_x_esm_test2 = function test2() {
  var _this2 = this;

  var spy = '';
  var res = attempt_x_esm.call({}.constructor('abc'), nativeForEach, function (item) {
    array_for_each_x_esm_newArrowCheck(this, _this2);

    spy += item;
  }.bind(this));
  return res.threw === false && typeof res.value === 'undefined' && spy === 'abc';
};

var array_for_each_x_esm_test3 = function test3() {
  var spy = 0;
  var res = attempt_x_esm.call(function getArgs() {
    /* eslint-disable-next-line prefer-rest-params */
    return arguments;
  }(1, 2, 3), nativeForEach, function spyAdd1(item) {
    spy += item;
  });
  return res.threw === false && typeof res.value === 'undefined' && spy === 6;
};

var array_for_each_x_esm_test4 = function test4() {
  var spy = 0;
  var res = attempt_x_esm.call({
    0: 1,
    1: 2,
    3: 3,
    4: 4,
    length: 4
  }, nativeForEach, function spyAdd2(item) {
    spy += item;
  });
  return res.threw === false && typeof res.value === 'undefined' && spy === 6;
};

var array_for_each_x_esm_test5 = function test5() {
  var doc = typeof document !== 'undefined' && document;

  if (doc) {
    var spy = null;
    var fragment = doc.createDocumentFragment();
    var div = doc.createElement('div');
    fragment.appendChild(div);
    var res = attempt_x_esm.call(fragment.childNodes, nativeForEach, function spyAssign(item) {
      spy = item;
    });
    return res.threw === false && typeof res.value === 'undefined' && spy === div;
  }

  return true;
};

var array_for_each_x_esm_test6 = function test6() {
  var isStrict = function returnIsStrict() {
    /* eslint-disable-next-line babel/no-invalid-this */
    return true.constructor(this) === false;
  }();

  if (isStrict) {
    var spy = null;
    var res = attempt_x_esm.call([1], nativeForEach, function thisTest() {
      /* eslint-disable-next-line babel/no-invalid-this */
      spy = typeof this === 'string';
    }, 'x');
    return res.threw === false && typeof res.value === 'undefined' && spy === true;
  }

  return true;
};

var array_for_each_x_esm_test7 = function test7() {
  var spy = {};
  var fn = 'return nativeForEach.call("foo", function (_, __, context) {' + 'if (castBoolean(context) === false || typeof context !== "object") {' + 'spy.value = true;}});';
  /* eslint-disable-next-line no-new-func */

  var res = attempt_x_esm(Function('nativeForEach', 'spy', 'castBoolean', fn), nativeForEach, spy, true.constructor);
  return res.threw === false && typeof res.value === 'undefined' && spy.value !== true;
};

var array_for_each_x_esm_isWorking = true.constructor(nativeForEach) && array_for_each_x_esm_test1() && array_for_each_x_esm_test2() && array_for_each_x_esm_test3() && array_for_each_x_esm_test4() && array_for_each_x_esm_test5() && array_for_each_x_esm_test6() && array_for_each_x_esm_test7();

var array_for_each_x_esm_patchedNative = function patchedNative() {
  return function forEach(array, callBack
  /* , thisArg */
  ) {
    require_object_coercible_x_esm(array);
    var args = [assert_is_function_x_esm(callBack)];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return nativeForEach.apply(array, args);
  };
};

var array_for_each_x_esm_implementation = function implementation() {
  return function forEach(array, callBack
  /* , thisArg */
  ) {
    var object = to_object_x_esm(array); // If no callback function or if callback is not a callable function

    assert_is_function_x_esm(callBack);
    var iterable = split_if_boxed_bug_x_esm(object);
    var length = to_length_x_esm(iterable.length);
    /* eslint-disable-next-line no-void,prefer-rest-params */

    var thisArg = arguments.length > 2 ? arguments[2] : void 0;
    var noThis = typeof thisArg === 'undefined';

    for (var i = 0; i < length; i += 1) {
      if (i in iterable) {
        if (noThis) {
          callBack(iterable[i], i, object);
        } else {
          callBack.call(thisArg, iterable[i], i, object);
        }
      }
    }
  };
};
/**
 * This method executes a provided function once for each array element.
 *
 * @param {Array} array - The array to iterate over.
 * @param {Function} callBack - Function to execute for each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 */


var $forEach = array_for_each_x_esm_isWorking ? array_for_each_x_esm_patchedNative() : array_for_each_x_esm_implementation();
/* harmony default export */ var array_for_each_x_esm = ($forEach);


// CONCATENATED MODULE: ./node_modules/to-property-key-x/dist/to-property-key-x.esm.js
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }




/**
 * This method Converts argument to a value that can be used as a property key.
 *
 * @param {*} argument - The argument to convert to a property key.
 * @throws {TypeError} If argument is not a symbol and is not coercible to a string.
 * @returns {string|Symbol} The converted argument.
 */

var to_property_key_x_esm_toPropertyKey = function toPropertyKey(argument) {
  var key = to_primitive_x_esm(argument, String);
  return has_symbol_support_x_esm && _typeof(key) === 'symbol' ? key : to_string_x_esm(key);
};

/* harmony default export */ var to_property_key_x_esm = (to_property_key_x_esm_toPropertyKey);


// CONCATENATED MODULE: ./node_modules/has-own-property-x/dist/has-own-property-x.esm.js


var hop = {}.hasOwnProperty;
/**
 * The `hasOwnProperty` method returns a boolean indicating whether
 * the `object` has the specified `property`. Does not attempt to fix known
 * issues in older browsers, but does ES6ify the method.
 *
 * @param {!object} object - The object to test.
 * @throws {TypeError} If object is null or undefined.
 * @param {string|number|Symbol} property - The name or Symbol of the property to test.
 * @returns {boolean} `true` if the property is set on `object`, else `false`.
 */

var has_own_property_x_esm_hasOwnProperty = function hasOwnProperty(object, property) {
  return hop.call(to_object_x_esm(object), to_property_key_x_esm(property));
};

/* harmony default export */ var has_own_property_x_esm = (has_own_property_x_esm_hasOwnProperty);


// CONCATENATED MODULE: ./node_modules/assert-is-object-x/dist/assert-is-object-x.esm.js


/**
 * Tests `value` to see if it is an object, throws a `TypeError` if it is
 * not. Otherwise returns the `value`.
 *
 * @param {*} value - The argument to be tested.
 * @throws {TypeError} Throws if `value` is not an object.
 * @returns {*} Returns `value` if it is an object.
 */

var assert_is_object_x_esm_assertIsObject = function assertIsObject(value) {
  if (is_primitive_default()(value)) {
    throw new TypeError("".concat(to_string_symbols_supported_x_esm(value), " is not an object"));
  }

  return value;
};

/* harmony default export */ var assert_is_object_x_esm = (assert_is_object_x_esm_assertIsObject);


// CONCATENATED MODULE: ./node_modules/object-define-property-x/dist/object-define-property-x.esm.js






var ObjectCtr = {}.constructor;
var object_define_property_x_esm_castBoolean = true.constructor;
var nd = ObjectCtr.defineProperty;
var nativeDefProp = typeof nd === 'function' && nd;
var definePropertyFallback;

var toPropertyDescriptor = function _toPropertyDescriptor(desc) {
  var object = to_object_x_esm(desc);
  var descriptor = {};

  if (has_own_property_x_esm(object, 'enumerable')) {
    descriptor.enumerable = object_define_property_x_esm_castBoolean(object.enumerable);
  }

  if (has_own_property_x_esm(object, 'configurable')) {
    descriptor.configurable = object_define_property_x_esm_castBoolean(object.configurable);
  }

  if (has_own_property_x_esm(object, 'value')) {
    descriptor.value = object.value;
  }

  if (has_own_property_x_esm(object, 'writable')) {
    descriptor.writable = object_define_property_x_esm_castBoolean(object.writable);
  }

  if (has_own_property_x_esm(object, 'get')) {
    var getter = object.get;

    if (typeof getter !== 'undefined' && is_function_x_esm(getter) === false) {
      throw new TypeError('getter must be a function');
    }

    descriptor.get = getter;
  }

  if (has_own_property_x_esm(object, 'set')) {
    var setter = object.set;

    if (typeof setter !== 'undefined' && is_function_x_esm(setter) === false) {
      throw new TypeError('setter must be a function');
    }

    descriptor.set = setter;
  }

  if ((has_own_property_x_esm(descriptor, 'get') || has_own_property_x_esm(descriptor, 'set')) && (has_own_property_x_esm(descriptor, 'value') || has_own_property_x_esm(descriptor, 'writable'))) {
    throw new TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
  }

  return descriptor;
}; // ES5 15.2.3.6
// http://es5.github.com/#x15.2.3.6
// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/es-shims/es5-shim/issues#issue/5
// IE8 Reference:
//     http://msdn.microsoft.com/en-us/library/dd282900.aspx
//     http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//     https://bugs.webkit.org/show_bug.cgi?id=36423

/**
 * This method defines a new property directly on an object, or modifies an
 * existing property on an object, and returns the object.
 *
 * @param {object} object - The object on which to define the property.
 * @param {string} property - The name of the property to be defined or modified.
 * @param {object} descriptor - The descriptor for the property being defined or modified.
 * @returns {object} The object that was passed to the function.
 * });.
 */


var $defineProperty; // check whether defineProperty works if it's given. Otherwise, shim partially.

if (nativeDefProp) {
  var testWorksWith = function _testWorksWith(object) {
    var testResult = attempt_x_esm(nativeDefProp, object, 'sentinel', {});
    return testResult.threw === false && testResult.value === object && 'sentinel' in object;
  };

  var object_define_property_x_esm_doc = typeof document !== 'undefined' && document;

  if (testWorksWith({}) && (object_define_property_x_esm_castBoolean(object_define_property_x_esm_doc) === false || testWorksWith(object_define_property_x_esm_doc.createElement('div')))) {
    $defineProperty = function defineProperty(object, property, descriptor) {
      return nativeDefProp(assert_is_object_x_esm(object), to_property_key_x_esm(property), toPropertyDescriptor(descriptor));
    };
  } else {
    definePropertyFallback = nativeDefProp;
  }
}

if (object_define_property_x_esm_castBoolean(nativeDefProp) === false || definePropertyFallback) {
  var prototypeOfObject = ObjectCtr.prototype; // If JS engine supports accessors creating shortcuts.

  var supportsAccessors = has_own_property_x_esm(prototypeOfObject, '__defineGetter__');
  /* eslint-disable-next-line no-underscore-dangle */

  var defineGetter = supportsAccessors && prototypeOfObject.__defineGetter_;
  /* eslint-disable-next-line no-underscore-dangle,no-restricted-properties */

  var defineSetter = supportsAccessors && prototypeOfObject.__defineSetter__;
  /* eslint-disable-next-line no-underscore-dangle */

  var lookupGetter = supportsAccessors && prototypeOfObject.__lookupGetter__;
  /* eslint-disable-next-line no-underscore-dangle */

  var lookupSetter = supportsAccessors && prototypeOfObject.__lookupSetter__;

  $defineProperty = function defineProperty(object, property, descriptor) {
    assert_is_object_x_esm(object);
    var propKey = to_property_key_x_esm(property);
    var propDesc = toPropertyDescriptor(descriptor); // make a valiant attempt to use the real defineProperty for IE8's DOM elements.

    if (definePropertyFallback) {
      var result = attempt_x_esm.call(ObjectCtr, definePropertyFallback, object, propKey, propDesc);

      if (result.threw === false) {
        return result.value;
      } // try the shim if the real one doesn't work

    } // If it's a data property.


    if (has_own_property_x_esm(propDesc, 'value')) {
      // fail silently if 'writable', 'enumerable', or 'configurable' are requested but not supported
      if (supportsAccessors && (lookupGetter.call(object, propKey) || lookupSetter.call(object, propKey))) {
        // As accessors are supported only on engines implementing
        // `__proto__` we can safely override `__proto__` while defining
        // a property to make sure that we don't hit an inherited accessor.

        /* eslint-disable-next-line no-proto */
        var prototype = object.__proto__;
        /* eslint-disable-next-line no-proto */

        object.__proto__ = prototypeOfObject; // Deleting a property anyway since getter / setter may be defined on object itself.

        delete object[propKey];
        object[propKey] = propDesc.value; // Setting original `__proto__` back now.

        /* eslint-disable-next-line no-proto */

        object.__proto__ = prototype;
      } else {
        object[propKey] = propDesc.value;
      }
    } else {
      if (supportsAccessors === false && (propDesc.get || propDesc.set)) {
        throw new TypeError('getters & setters can not be defined on this javascript engine');
      } // If we got that far then getters and setters can be defined !!


      if (propDesc.get) {
        defineGetter.call(object, propKey, propDesc.get);
      }

      if (propDesc.set) {
        defineSetter.call(object, propKey, propDesc.set);
      }
    }

    return object;
  };
}

var defProp = $defineProperty;
/* harmony default export */ var object_define_property_x_esm = (defProp);


// CONCATENATED MODULE: ./node_modules/is-object-like-x/dist/is-object-like-x.esm.js


/**
 * Checks if `value` is object-like. A value is object-like if it's not a
 * primitive and not a function.
 *
 * @param {*} [value] - The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */

var is_object_like_x_esm_isObjectLike = function isObjectLike(value) {
  return is_primitive_default()(value) === false && is_function_x_esm(value, true) === false;
};

/* harmony default export */ var is_object_like_x_esm = (is_object_like_x_esm_isObjectLike);


// CONCATENATED MODULE: ./node_modules/math-clamp-x/dist/math-clamp-x.esm.js
 // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * This method clamp a number to min and max limits inclusive.
 *
 * @param {number} value - The number to be clamped.
 * @param {number} [min=0] - The minimum number.
 * @param {number} max - The maximum number.
 * @throws {RangeError} If min > max.
 * @returns {number} The clamped number.
 */
// eslint-enable jsdoc/check-param-names

var math_clamp_x_esm_clamp = function clamp(value) {
  var number = to_number_x_esm(value);
  var argsLength = arguments.length;

  if (argsLength < 2) {
    return number;
  }
  /* eslint-disable-next-line prefer-rest-params */


  var min = to_number_x_esm(arguments[1]);
  var max;

  if (argsLength < 3) {
    max = min;
    min = 0;
  } else {
    /* eslint-disable-next-line prefer-rest-params */
    max = to_number_x_esm(arguments[2]);
  }

  if (min > max) {
    throw new RangeError('"min" must be less than "max"');
  }

  if (number < min) {
    return min;
  }

  if (number > max) {
    return max;
  }

  return number;
};

/* harmony default export */ var math_clamp_x_esm = (math_clamp_x_esm_clamp);


// CONCATENATED MODULE: ./node_modules/is-index-x/dist/is-index-x.esm.js




var is_index_x_esm_MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
var rxTest = reIsUint.test;
/**
 * This method determines whether the passed value is a zero based index.
 * JavaScript arrays are zero-indexed: the first element of an array is at
 * index 0, and the last element is at the index equal to the value of the
 * array's length property minus 1.
 *
 * @param {number|string} value - The value to be tested for being a zero based index.
 * @param {number} [length=MAX_SAFE_INTEGER] - The length that sets the upper bound.
 * @returns {boolean} A Boolean indicating whether or not the given value is a
 * zero based index within bounds.
 */

var is_index_x_esm_isIndex = function isIndex(value, length) {
  var string = to_string_symbols_supported_x_esm(value);

  if (rxTest.call(reIsUint, string) === false) {
    return false;
  }

  var number = to_number_x_esm(string);

  if (arguments.length > 1) {
    return number < math_clamp_x_esm(to_integer_x_esm(length), is_index_x_esm_MAX_SAFE_INTEGER);
  }

  return number < is_index_x_esm_MAX_SAFE_INTEGER;
};

/* harmony default export */ var is_index_x_esm = (is_index_x_esm_isIndex);


// CONCATENATED MODULE: ./node_modules/property-is-enumerable-x/dist/property-is-enumerable-x.esm.js


var propIsEnumerable = {}.propertyIsEnumerable;
/**
 * This method returns a Boolean indicating whether the specified property is
 * enumerable. Does not attempt to fix bugs in IE<9 or old Opera, otherwise it
 * does ES6ify the method.
 *
 * @param {!object} object - The object on which to test the property.
 * @param {string|Symbol} property - The name of the property to test.
 * @throws {TypeError} If target is null or undefined.
 * @returns {boolean} A Boolean indicating whether the specified property is
 *  enumerable.
 */

var property_is_enumerable_x_esm_propertyIsEnumerable = function propertyIsEnumerable(object, property) {
  return propIsEnumerable.call(to_object_x_esm(object), to_property_key_x_esm(property));
};

/* harmony default export */ var property_is_enumerable_x_esm = (property_is_enumerable_x_esm_propertyIsEnumerable);


// CONCATENATED MODULE: ./node_modules/object-get-own-property-descriptor-x/dist/object-get-own-property-descriptor-x.esm.js









/** @type {ObjectConstructor} */

var object_get_own_property_descriptor_x_esm_castObject = {}.constructor;
/** @type {BooleanConstructor} */

var object_get_own_property_descriptor_x_esm_castBoolean = true.constructor;
var nativeGOPD = typeof object_get_own_property_descriptor_x_esm_castObject.getOwnPropertyDescriptor === 'function' && object_get_own_property_descriptor_x_esm_castObject.getOwnPropertyDescriptor;
var getOPDFallback1;
var getOPDFallback2; // ES5 15.2.3.3
// http://es5.github.com/#x15.2.3.3

var object_get_own_property_descriptor_x_esm_doesGOPDWork = function doesGOPDWork(object, prop) {
  object[to_property_key_x_esm(prop)] = 0;
  var testResult = attempt_x_esm(nativeGOPD, object, prop);
  return testResult.threw === false && testResult.value.value === 0;
}; // check whether getOwnPropertyDescriptor works if it's given. Otherwise, shim partially.

/**
 * This method returns a property descriptor for an own property (that is,
 * one directly present on an object and not in the object's prototype chain)
 * of a given object.
 *
 * @param {*} object - The object in which to look for the property.
 * @param {*} property - The name of the property whose description is to be retrieved.
 * @returns {object} A property descriptor of the given property if it exists on the object, undefined otherwise.
 */


var $getOwnPropertyDescriptor;

if (nativeGOPD) {
  var object_get_own_property_descriptor_x_esm_doc = typeof document !== 'undefined' && document;
  var getOPDWorksOnDom = object_get_own_property_descriptor_x_esm_doc ? object_get_own_property_descriptor_x_esm_doesGOPDWork(object_get_own_property_descriptor_x_esm_doc.createElement('div'), 'sentinel') : true;

  if (getOPDWorksOnDom) {
    var object_get_own_property_descriptor_x_esm_res = attempt_x_esm(nativeGOPD, object_get_own_property_descriptor_x_esm_castObject('abc'), 1);
    var worksWithStr = object_get_own_property_descriptor_x_esm_res.threw === false && object_get_own_property_descriptor_x_esm_res.value && object_get_own_property_descriptor_x_esm_res.value.value === 'b';

    if (worksWithStr) {
      var getOPDWorksOnObject = object_get_own_property_descriptor_x_esm_doesGOPDWork({}, 'sentinel');

      if (getOPDWorksOnObject) {
        var worksWithPrim = attempt_x_esm(nativeGOPD, 42, 'name').threw === false;
        /* eslint-disable-next-line compat/compat */

        var worksWithObjSym = has_symbol_support_x_esm && object_get_own_property_descriptor_x_esm_doesGOPDWork({}, object_get_own_property_descriptor_x_esm_castObject(Symbol('')));

        if (worksWithObjSym) {
          if (worksWithPrim) {
            $getOwnPropertyDescriptor = nativeGOPD;
          } else {
            $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
              return nativeGOPD(to_object_x_esm(object), property);
            };
          }
        } else if (worksWithPrim) {
          $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
            return nativeGOPD(object, to_property_key_x_esm(property));
          };
        } else {
          $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
            return nativeGOPD(to_object_x_esm(object), to_property_key_x_esm(property));
          };
        }
      } else {
        getOPDFallback1 = nativeGOPD;
      }
    } else {
      getOPDFallback2 = nativeGOPD;
    }
  }
}

if (object_get_own_property_descriptor_x_esm_castBoolean($getOwnPropertyDescriptor) === false || getOPDFallback1 || getOPDFallback2) {
  var object_get_own_property_descriptor_x_esm_prototypeOfObject = object_get_own_property_descriptor_x_esm_castObject.prototype; // If JS engine supports accessors creating shortcuts.

  var object_get_own_property_descriptor_x_esm_lookupGetter;
  var object_get_own_property_descriptor_x_esm_lookupSetter;
  var object_get_own_property_descriptor_x_esm_supportsAccessors = has_own_property_x_esm(object_get_own_property_descriptor_x_esm_prototypeOfObject, '__defineGetter__');

  if (object_get_own_property_descriptor_x_esm_supportsAccessors) {
    /* eslint-disable-next-line no-underscore-dangle */
    var lg = object_get_own_property_descriptor_x_esm_prototypeOfObject.__lookupGetter__;
    /* eslint-disable-next-line no-underscore-dangle */

    var ls = object_get_own_property_descriptor_x_esm_prototypeOfObject.__lookupSetter__;

    object_get_own_property_descriptor_x_esm_lookupGetter = function $lookupGetter(object, property) {
      return lg.call(object, property);
    };

    object_get_own_property_descriptor_x_esm_lookupSetter = function $lookupSetter(object, property) {
      return ls.call(object, property);
    };
  }

  $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
    var obj = to_object_x_esm(object);
    var propKey = to_property_key_x_esm(property);
    var result; // make a valiant attempt to use the real getOwnPropertyDescriptor for I8's DOM elements.

    if (getOPDFallback1) {
      result = attempt_x_esm.call(object_get_own_property_descriptor_x_esm_castObject, getOPDFallback1, obj, propKey);

      if (result.threw === false) {
        return result.value;
      } // try the shim if the real one doesn't work

    }

    var isStringIndex = is_string_default()(obj) && is_index_x_esm(propKey, obj.length);

    if (getOPDFallback2 && isStringIndex === false) {
      result = attempt_x_esm.call(object_get_own_property_descriptor_x_esm_castObject, getOPDFallback2, obj, propKey);

      if (result.threw === false) {
        return result.value;
      } // try the shim if the real one doesn't work

    }
    /* eslint-disable-next-line no-void */


    var descriptor = void 0; // If object does not owns property return undefined immediately.

    if (isStringIndex === false && has_own_property_x_esm(obj, propKey) === false) {
      return descriptor;
    } // If object has a property then it's for sure `configurable`, and
    // probably `enumerable`. Detect enumerability though.


    descriptor = {
      configurable: is_primitive_default()(object) === false && isStringIndex === false,
      enumerable: property_is_enumerable_x_esm(obj, propKey)
    }; // If JS engine supports accessor properties then property may be a
    // getter or setter.

    if (object_get_own_property_descriptor_x_esm_supportsAccessors) {
      // Unfortunately `__lookupGetter__` will return a getter even
      // if object has own non getter property along with a same named
      // inherited getter. To avoid misbehavior we temporary remove
      // `__proto__` so that `__lookupGetter__` will return getter only
      // if it's owned by an object.

      /* eslint-disable-next-line no-proto */
      var prototype = obj.__proto__;
      var notPrototypeOfObject = obj !== object_get_own_property_descriptor_x_esm_prototypeOfObject; // avoid recursion problem, breaking in Opera Mini when
      // Object.getOwnPropertyDescriptor(Object.prototype, 'toString')
      // or any other Object.prototype accessor

      if (notPrototypeOfObject) {
        /* eslint-disable-next-line no-proto */
        obj.__proto__ = object_get_own_property_descriptor_x_esm_prototypeOfObject;
      }

      var getter = object_get_own_property_descriptor_x_esm_lookupGetter(obj, propKey);
      var setter = object_get_own_property_descriptor_x_esm_lookupSetter(obj, propKey);

      if (notPrototypeOfObject) {
        // Once we have getter and setter we can put values back.

        /* eslint-disable-next-line no-proto */
        obj.__proto__ = prototype;
      }

      if (getter || setter) {
        if (getter) {
          descriptor.get = getter;
        }

        if (setter) {
          descriptor.set = setter;
        } // If it was accessor property we're done and return here
        // in order to avoid adding `value` to the descriptor.


        return descriptor;
      }
    } // If we got this far we know that object has an own property that is
    // not an accessor so we set it as a value and return descriptor.


    if (isStringIndex) {
      descriptor.value = obj.charAt(propKey);
      descriptor.writable = false;
    } else {
      descriptor.value = obj[propKey];
      descriptor.writable = true;
    }

    return descriptor;
  };
}

var gOPS = $getOwnPropertyDescriptor;
/* harmony default export */ var object_get_own_property_descriptor_x_esm = (gOPS);


// CONCATENATED MODULE: ./node_modules/is-regexp-x/dist/is-regexp-x.esm.js






var regexExec = /none/.exec;
var regexClass = '[object RegExp]';

var tryRegexExecCall = function tryRegexExec(value, descriptor) {
  try {
    value.lastIndex = 0;
    regexExec.call(value);
    return true;
  } catch (e) {
    return false;
  } finally {
    object_define_property_x_esm(value, 'lastIndex', descriptor);
  }
};
/**
 * This method tests if a value is a regex.
 *
 * @param {*} value - The value to test.
 * @returns {boolean} `true` if value is a regex; otherwise `false`.
 */


var is_regexp_x_esm_isRegex = function isRegex(value) {
  if (is_object_like_x_esm(value) === false) {
    return false;
  }

  if (has_to_string_tag_x_esm === false) {
    return to_string_tag_x_esm(value) === regexClass;
  }

  var descriptor = object_get_own_property_descriptor_x_esm(value, 'lastIndex');
  var hasLastIndexDataProperty = descriptor && has_own_property_x_esm(descriptor, 'value');

  if (hasLastIndexDataProperty !== true) {
    return false;
  }

  return tryRegexExecCall(value, descriptor);
};

/* harmony default export */ var is_regexp_x_esm = (is_regexp_x_esm_isRegex);


// EXTERNAL MODULE: ./node_modules/object-keys/index.js
var object_keys = __webpack_require__(8);
var object_keys_default = /*#__PURE__*/__webpack_require__.n(object_keys);

// CONCATENATED MODULE: ./node_modules/object-keys-x/dist/object-keys-x.esm.js










var object_keys_x_esm_ObjectCtr = {}.constructor;
var nativeKeys = typeof object_keys_x_esm_ObjectCtr.keys === 'function' && object_keys_x_esm_ObjectCtr.keys;
var object_keys_x_esm_isWorking;
var throwsWithNull;
var object_keys_x_esm_worksWithPrim;
var worksWithRegex;
var worksWithArgs;
var object_keys_x_esm_worksWithStr;

if (nativeKeys) {
  var object_keys_x_esm_isCorrectRes = function _isCorrectRes(r, length) {
    return r.threw === false && is_array_x_esm(r.value) && r.value.length === length;
  };

  var either = function _either(r, a, b) {
    var x = r.value[0];
    var y = r.value[1];
    return x === a && y === b || x === b && y === a;
  };

  var testObj = {
    a: 1,
    b: 2
  };
  var object_keys_x_esm_res = attempt_x_esm(nativeKeys, testObj);
  object_keys_x_esm_isWorking = object_keys_x_esm_isCorrectRes(object_keys_x_esm_res, 2) && either(object_keys_x_esm_res, 'a', 'b');

  if (object_keys_x_esm_isWorking) {
    testObj = Object('a');
    testObj.y = 1;
    object_keys_x_esm_res = attempt_x_esm(nativeKeys, testObj);
    object_keys_x_esm_isWorking = object_keys_x_esm_isCorrectRes(object_keys_x_esm_res, 2) && either(object_keys_x_esm_res, '0', 'y');
  }

  if (object_keys_x_esm_isWorking) {
    throwsWithNull = attempt_x_esm(nativeKeys, null).threw;
    object_keys_x_esm_worksWithPrim = object_keys_x_esm_isCorrectRes(attempt_x_esm(nativeKeys, 42), 0);
    worksWithRegex = attempt_x_esm(nativeKeys, /a/g).threw === false;
    object_keys_x_esm_res = attempt_x_esm(nativeKeys, function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    }(1, 2));
    worksWithArgs = object_keys_x_esm_isCorrectRes(object_keys_x_esm_res, 2) && either(object_keys_x_esm_res, '0', '1');
    object_keys_x_esm_res = attempt_x_esm(nativeKeys, Object('ab'));
    object_keys_x_esm_worksWithStr = object_keys_x_esm_isCorrectRes(object_keys_x_esm_res, 2) && either(object_keys_x_esm_res, '0', '1');
  }
}
/**
 * This method returns an array of a given object's own enumerable properties,
 * in the same order as that provided by a for...in loop (the difference being
 * that a for-in loop enumerates properties in the prototype chain as well).
 *
 * @param {*} obj - The object of which the enumerable own properties are to be returned.
 * @returns {Array} An array of strings that represent all the enumerable properties of the given object.
 */


var objectKeys;

if (object_keys_x_esm_isWorking) {
  if (throwsWithNull && object_keys_x_esm_worksWithPrim && worksWithRegex && worksWithArgs && object_keys_x_esm_worksWithStr) {
    objectKeys = nativeKeys;
  } else {
    objectKeys = function keys(object) {
      var obj = to_object_x_esm ? to_object_x_esm(object) : object;

      if (worksWithArgs !== true && is_arguments_default()(obj)) {
        obj = array_like_slice_x_esm(obj);
      } else if (object_keys_x_esm_worksWithStr !== true && is_string_default()(obj)) {
        obj = split_if_boxed_bug_x_esm(obj);
      } else if (worksWithRegex !== true && is_regexp_x_esm(obj)) {
        var regexKeys = [];
        /* eslint-disable-next-line no-restricted-syntax */

        for (var key in obj) {
          // noinspection JSUnfilteredForInLoop
          if (has_own_property_x_esm(obj, key)) {
            regexKeys[regexKeys.length] = key;
          }
        }

        return regexKeys;
      }

      return nativeKeys(obj);
    };
  }
} else {
  objectKeys = function keys(object) {
    return object_keys_default()(to_object_x_esm(object));
  };
}

var ok = objectKeys;
/* harmony default export */ var object_keys_x_esm = (ok);


// CONCATENATED MODULE: ./node_modules/array-filter-x/dist/array-filter-x.esm.js






var nf = [].filter;
var nativeFilter = typeof nf === 'function' && nf;

var array_filter_x_esm_test1 = function test1() {
  var spy = 0;
  var res = attempt_x_esm.call([1, 2], nativeFilter, function spyAdd1(item) {
    spy += item;
    return false;
  });
  return res.threw === false && res.value && res.value.length === 0 && spy === 3;
};

var array_filter_x_esm_test2 = function test2() {
  var spy = '';
  var res = attempt_x_esm.call({}.constructor('abc'), nativeFilter, function spyAdd2(item, index) {
    spy += item;
    return index === 1;
  });
  return res.threw === false && res.value && res.value.length === 1 && res.value[0] === 'b' && spy === 'abc';
};

var array_filter_x_esm_test3 = function test3() {
  var spy = 0;
  var res = attempt_x_esm.call(function getArgs() {
    /* eslint-disable-next-line prefer-rest-params */
    return arguments;
  }(1, 2, 3), nativeFilter, function spyAdd3(item, index) {
    spy += item;
    return index === 2;
  });
  return res.threw === false && res.value && res.value.length === 1 && res.value[0] === 3 && spy === 6;
};

var array_filter_x_esm_test4 = function test4() {
  var spy = 0;
  var res = attempt_x_esm.call({
    0: 1,
    1: 2,
    3: 3,
    4: 4,
    length: 4
  }, nativeFilter, function spyAdd4(item) {
    spy += item;
    return false;
  });
  return res.threw === false && res.value && res.value.length === 0 && spy === 6;
};

var array_filter_x_esm_test5 = function test5() {
  var doc = typeof document !== 'undefined' && document;

  if (doc) {
    var spy = null;
    var fragment = doc.createDocumentFragment();
    var div = doc.createElement('div');
    fragment.appendChild(div);
    var res = attempt_x_esm.call(fragment.childNodes, nativeFilter, function spyAssign(item) {
      spy = item;
      return item;
    });
    return res.threw === false && res.value && res.value.length === 1 && res.value[0] === div && spy === div;
  }

  return true;
};

var array_filter_x_esm_test6 = function test6() {
  var isStrict = function returnIsStrict() {
    /* eslint-disable-next-line babel/no-invalid-this */
    return true.constructor(this) === false;
  }();

  if (isStrict) {
    var spy = null;
    var res = attempt_x_esm.call([1], nativeFilter, function testThis() {
      /* eslint-disable-next-line babel/no-invalid-this */
      spy = typeof this === 'string';
    }, 'x');
    return res.threw === false && res.value && res.value.length === 0 && spy === true;
  }

  return true;
};

var array_filter_x_esm_test7 = function test7() {
  var spy = {};
  var fn = 'return nativeFilter.call("foo", function (_, __, context) {' + 'if (castBoolean(context) === false || typeof context !== "object") {' + 'spy.value = true;}});';
  /* eslint-disable-next-line no-new-func */

  var res = attempt_x_esm(Function('nativeFilter', 'spy', 'castBoolean', fn), nativeFilter, spy, true.constructor);
  return res.threw === false && res.value && res.value.length === 0 && spy.value !== true;
};

var array_filter_x_esm_isWorking = true.constructor(nativeFilter) && array_filter_x_esm_test1() && array_filter_x_esm_test2() && array_filter_x_esm_test3() && array_filter_x_esm_test4() && array_filter_x_esm_test5() && array_filter_x_esm_test6() && array_filter_x_esm_test7();

var array_filter_x_esm_patchedFilter = function patchedFilter() {
  return function filter(array, callBack
  /* , thisArg */
  ) {
    require_object_coercible_x_esm(array);
    var args = [assert_is_function_x_esm(callBack)];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return nativeFilter.apply(array, args);
  };
};

var array_filter_x_esm_implementation = function implementation() {
  return function filter(array, callBack
  /* , thisArg */
  ) {
    var object = to_object_x_esm(array); // If no callback function or if callback is not a callable function

    assert_is_function_x_esm(callBack);
    var iterable = split_if_boxed_bug_x_esm(object);
    var length = to_length_x_esm(iterable.length);
    /* eslint-disable-next-line prefer-rest-params,no-void */

    var thisArg = arguments.length > 2 ? arguments[2] : void 0;
    var noThis = typeof thisArg === 'undefined';
    var result = [];

    for (var i = 0; i < length; i += 1) {
      if (i in iterable) {
        var item = iterable[i];

        if (noThis ? callBack(item, i, object) : callBack.call(thisArg, item, i, object)) {
          result[result.length] = item;
        }
      }
    }

    return result;
  };
};
/**
 * This method creates a new array with all elements that pass the test
 * implemented by the provided function.
 *
 * @param {Array} array - The array to iterate over.
 * @param {Function} callBack - Function is a predicate, to test each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @returns {Array} A new array with the elements that pass the test.
 */


var $filter = array_filter_x_esm_isWorking ? array_filter_x_esm_patchedFilter() : array_filter_x_esm_implementation();
/* harmony default export */ var array_filter_x_esm = ($filter);


// CONCATENATED MODULE: ./node_modules/get-own-property-symbols-x/dist/get-own-property-symbols-x.esm.js



var nativeGOPS = {}.constructor.getOwnPropertySymbols;
var get_own_property_symbols_x_esm_isWorking;

if (has_symbol_support_x_esm && nativeGOPS && typeof nativeGOPS === 'function') {
  /* eslint-disable-next-line compat/compat */
  var get_own_property_symbols_x_esm_symbol = Symbol('');
  var get_own_property_symbols_x_esm_testObj = {
    a: 1
  };
  get_own_property_symbols_x_esm_testObj[get_own_property_symbols_x_esm_symbol] = 2;
  var get_own_property_symbols_x_esm_r = attempt_x_esm(nativeGOPS, get_own_property_symbols_x_esm_testObj);
  get_own_property_symbols_x_esm_isWorking = get_own_property_symbols_x_esm_r.threw === false && get_own_property_symbols_x_esm_r.value && get_own_property_symbols_x_esm_r.value.length === 1 && get_own_property_symbols_x_esm_r.value[0] === get_own_property_symbols_x_esm_symbol;
}
/**
 * This method creates an array of all symbol properties found directly upon a
 * given object.
 *
 * @param {object} obj - The object whose symbol properties are to be returned.
 * @throws {TypeError} If target is null or undefined.
 * @returns {Array} An array of all symbol properties found directly upon the
 *  given object.
 */


var get_own_property_symbols_x_esm_getOwnPropertySymbols = function getOwnPropertySymbols(obj) {
  var object = to_object_x_esm(obj);
  return get_own_property_symbols_x_esm_isWorking ? nativeGOPS(object) : [];
};

/* harmony default export */ var get_own_property_symbols_x_esm = (get_own_property_symbols_x_esm_getOwnPropertySymbols);


// CONCATENATED MODULE: ./node_modules/get-own-enumerable-property-symbols-x/dist/get-own-enumerable-property-symbols-x.esm.js
function get_own_enumerable_property_symbols_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }





/**
 * This method returns only the enumerable own property symbols of an object.
 *
 * @param {object} target - The target.
 * @throws {TypeError} - If target is null or undefined.
 * @returns {Array} The enumerable own property symbols.
 */

var get_own_enumerable_property_symbols_x_esm_getOwnEnumerablePropertySymbols = function getOwnEnumerablePropertySymbols(target) {
  var _this = this;

  var object = to_object_x_esm(target);
  return array_filter_x_esm(get_own_property_symbols_x_esm(object), function (symbol) {
    get_own_enumerable_property_symbols_x_esm_newArrowCheck(this, _this);

    return property_is_enumerable_x_esm(object, symbol);
  }.bind(this));
};

/* harmony default export */ var get_own_enumerable_property_symbols_x_esm = (get_own_enumerable_property_symbols_x_esm_getOwnEnumerablePropertySymbols);


// CONCATENATED MODULE: ./node_modules/get-own-enumerable-keys-x/dist/get-own-enumerable-keys-x.esm.js



var get_own_enumerable_keys_x_esm_concat = [].concat;
/**
 * This method returns only the enumerable own keys of an object.
 *
 * @param {object} target - The target.
 * @throws {TypeError} - If target is null or undefined.
 * @returns {Array} The enumerable own keys.
 */

var get_own_enumerable_keys_x_esm_getOwnNonEnumerableKeys = function getOwnNonEnumerableKeys(target) {
  var object = to_object_x_esm(target);
  return get_own_enumerable_keys_x_esm_concat.call(object_keys_x_esm(object), get_own_enumerable_property_symbols_x_esm(object));
};

/* harmony default export */ var get_own_enumerable_keys_x_esm = (get_own_enumerable_keys_x_esm_getOwnNonEnumerableKeys);


// CONCATENATED MODULE: ./node_modules/object-define-properties-x/dist/object-define-properties-x.esm.js





var object_define_properties_x_esm_defineProperty = object_define_property_x_esm;
/**
 * This method defines new or modifies existing properties directly on an
 * object, returning the object.
 *
 * @param {object} object - The object on which to define or modify properties.
 * @param {object} properties - An object whose own enumerable properties
 *  constitute descriptors for the
 * properties to be defined or modified.
 * @returns {object} The object that was passed to the function.
 */

var object_define_properties_x_esm_defineProperties = function defineProperties(object, properties) {
  assert_is_object_x_esm(object);
  var props = to_object_x_esm(properties);
  array_for_each_x_esm(get_own_enumerable_keys_x_esm(props), function defineProp(property) {
    if (property !== '__proto__') {
      object_define_property_x_esm(object, property, props[property]);
    }
  });
  return object;
};

/* harmony default export */ var object_define_properties_x_esm = (object_define_properties_x_esm_defineProperties);


// CONCATENATED MODULE: ./node_modules/is-array-buffer-x/dist/is-array-buffer-x.esm.js
var is_array_buffer_x_esm_this = undefined;

function is_array_buffer_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }






var hasABuf = typeof ArrayBuffer === 'function';
var aBufTag = '[object ArrayBuffer]';
var is_array_buffer_x_esm_bLength = false;

if (hasABuf) {
  if (has_to_string_tag_x_esm) {
    /* eslint-disable-next-line compat/compat */
    var is_array_buffer_x_esm_descriptor = object_get_own_property_descriptor_x_esm(ArrayBuffer.prototype, 'byteLength');

    if (is_array_buffer_x_esm_descriptor && typeof is_array_buffer_x_esm_descriptor.get === 'function') {
      var is_array_buffer_x_esm_res = attempt_x_esm(function () {
        is_array_buffer_x_esm_newArrowCheck(this, is_array_buffer_x_esm_this);

        /* eslint-disable-next-line compat/compat */
        return new ArrayBuffer(4);
      }.bind(undefined));

      if (is_array_buffer_x_esm_res.threw === false && is_object_like_x_esm(is_array_buffer_x_esm_res.value)) {
        is_array_buffer_x_esm_res = attempt_x_esm.call(is_array_buffer_x_esm_res.value, is_array_buffer_x_esm_descriptor.get);
        is_array_buffer_x_esm_bLength = is_array_buffer_x_esm_res.threw === false && typeof is_array_buffer_x_esm_res.value === 'number' && is_array_buffer_x_esm_descriptor.get;
      }
    }
  }
}
/**
 * Determine if an `object` is an `ArrayBuffer`.
 *
 * @param {*} object - The object to test.
 * @returns {boolean} `true` if the `object` is an `ArrayBuffer`,
 *  else false`.
 */


var is_array_buffer_x_esm_isArrayBuffer = function isArrayBuffer(object) {
  if (hasABuf === false || is_object_like_x_esm(object) === false) {
    return false;
  }

  if (is_array_buffer_x_esm_bLength === false) {
    return to_string_tag_x_esm(object) === aBufTag;
  }

  var result = attempt_x_esm.call(object, is_array_buffer_x_esm_bLength);
  return result.threw === false && typeof result.value === 'number';
};

/* harmony default export */ var is_array_buffer_x_esm = (is_array_buffer_x_esm_isArrayBuffer);


// CONCATENATED MODULE: ./node_modules/is-integer-x/dist/is-integer-x.esm.js


/**
 * This method determines whether the passed value is an integer.
 *
 * @param {*} value - The value to be tested for being an integer.
 * @returns {boolean} A Boolean indicating whether or not the given value is an integer.
 */

var is_integer_x_esm_isInteger = function isInteger(value) {
  return is_finite_x_esm(value) && to_integer_x_esm(value) === value;
};

/* harmony default export */ var is_integer_x_esm = (is_integer_x_esm_isInteger);


// CONCATENATED MODULE: ./node_modules/is-safe-integer-x/dist/is-safe-integer-x.esm.js

var is_safe_integer_x_esm_MAX_SAFE_INTEGER = 9007199254740991;
var MIN_SAFE_INTEGER = -is_safe_integer_x_esm_MAX_SAFE_INTEGER;
/**
 * This method determines whether the passed value is a safe integer.
 *
 * Can be exactly represented as an IEEE-754 double precision number, and
 * whose IEEE-754 representation cannot be the result of rounding any other
 * integer to fit the IEEE-754 representation.
 *
 * @param {*} value - The value to be tested for being a safe integer.
 * @returns {boolean} A Boolean indicating whether or not the given value is a
 *  safe integer.
 */

var is_safe_integer_x_esm_isSafeInteger = function isSafeInteger(value) {
  return is_integer_x_esm(value) && value >= MIN_SAFE_INTEGER && value <= is_safe_integer_x_esm_MAX_SAFE_INTEGER;
};

/* harmony default export */ var is_safe_integer_x_esm = (is_safe_integer_x_esm_isSafeInteger);


// CONCATENATED MODULE: ./node_modules/is-length-x/dist/is-length-x.esm.js

/**
 * This method checks if `value` is a valid array-like length.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */

var is_length_x_esm_isLength = function isLength(value) {
  return is_safe_integer_x_esm(value) && value >= 0;
};

/* harmony default export */ var is_length_x_esm = (is_length_x_esm_isLength);


// CONCATENATED MODULE: ./node_modules/is-set-x/dist/is-set-x.esm.js





var is_set_x_esm_test1 = function test1() {
  return attempt_x_esm(function createSet() {
    /* eslint-disable-next-line compat/compat */
    return new Set();
  });
};

var is_set_x_esm_getGetter = function getGetter() {
  if (typeof Set === 'function') {
    /* eslint-disable-next-line compat/compat */
    var descriptor = object_get_own_property_descriptor_x_esm(Set.prototype, 'size');

    if (descriptor && typeof descriptor.get === 'function') {
      var resTest1 = is_set_x_esm_test1();

      if (resTest1.threw === false && is_object_like_x_esm(resTest1.value)) {
        var res = attempt_x_esm.call(resTest1.value, descriptor.get);

        if (res.threw === false && is_length_x_esm(res.value)) {
          return descriptor.get;
        }
      }
    }
  }
  /* eslint-disable-next-line no-void */


  return void 0;
};

var getSize = is_set_x_esm_getGetter();
/**
 * Determine if an `object` is a `Set`.
 *
 * @param {*} object - The object to test.
 * @returns {boolean} `true` if the `object` is a `Set`,
 *  else `false`.
 */

var is_set_x_esm_isSet = function isSet(object) {
  if (!getSize || is_object_like_x_esm(object) === false) {
    return false;
  }

  var result = attempt_x_esm.call(object, getSize);
  return result.threw === false && is_length_x_esm(result.value);
};

/* harmony default export */ var is_set_x_esm = (is_set_x_esm_isSet);


// CONCATENATED MODULE: ./node_modules/is-map-x/dist/is-map-x.esm.js





var is_map_x_esm_test1 = function test1() {
  return attempt_x_esm(function createMap() {
    /* eslint-disable-next-line compat/compat */
    return new Map();
  });
};

var is_map_x_esm_getGetter = function getGetter() {
  if (typeof Map === 'function') {
    /* eslint-disable-next-line compat/compat */
    var descriptor = object_get_own_property_descriptor_x_esm(Map.prototype, 'size');

    if (descriptor && typeof descriptor.get === 'function') {
      var resTest1 = is_map_x_esm_test1();

      if (resTest1.threw === false && is_object_like_x_esm(resTest1.value)) {
        var res = attempt_x_esm.call(resTest1.value, descriptor.get);

        if (res.threw === false && is_length_x_esm(res.value)) {
          return descriptor.get;
        }
      }
    }
  }
  /* eslint-disable-next-line no-void */


  return void 0;
};

var is_map_x_esm_getSize = is_map_x_esm_getGetter();
/**
 * Determine if an `object` is a `Map`.
 *
 * @param {*} object - The object to test.
 * @returns {boolean} `true` if the `object` is a `Map`,
 *  else `false`.
 */

var is_map_x_esm_isMap = function isMap(object) {
  if (!is_map_x_esm_getSize || is_object_like_x_esm(object) === false) {
    return false;
  }

  var result = attempt_x_esm.call(object, is_map_x_esm_getSize);
  return result.threw === false && is_length_x_esm(result.value);
};

/* harmony default export */ var is_map_x_esm = (is_map_x_esm_isMap);


// EXTERNAL MODULE: ./node_modules/is-typed-array/index.js
var is_typed_array = __webpack_require__(9);
var is_typed_array_default = /*#__PURE__*/__webpack_require__.n(is_typed_array);

// CONCATENATED MODULE: ./node_modules/is-data-view-x/dist/is-data-view-x.esm.js
var is_data_view_x_esm_this = undefined;

function is_data_view_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }







var hasDView = typeof DataView === 'function';
var getByteLength = false;
var legacyCheck;

if (hasDView) {
  var is_data_view_x_esm_res = attempt_x_esm(function () {
    is_data_view_x_esm_newArrowCheck(this, is_data_view_x_esm_this);

    /* eslint-disable-next-line compat/compat */
    return new DataView(new ArrayBuffer(4));
  }.bind(undefined));
  var dataView = is_data_view_x_esm_res.threw === false && is_object_like_x_esm(is_data_view_x_esm_res.value) && is_data_view_x_esm_res.value;

  if (dataView && has_to_string_tag_x_esm) {
    /* eslint-disable-next-line compat/compat */
    var is_data_view_x_esm_descriptor = object_get_own_property_descriptor_x_esm(DataView.prototype, 'byteLength');

    if (is_data_view_x_esm_descriptor && typeof is_data_view_x_esm_descriptor.get === 'function') {
      is_data_view_x_esm_res = attempt_x_esm.call(dataView, is_data_view_x_esm_descriptor.get);
      getByteLength = is_data_view_x_esm_res.threw === false && typeof is_data_view_x_esm_res.value === 'number' && is_data_view_x_esm_descriptor.get;
    }
  }

  if (getByteLength === false) {
    var dViewTag = '[object DataView]';

    if (to_string_tag_x_esm(dataView) === dViewTag) {
      legacyCheck = function _legacyCheck(object) {
        return to_string_tag_x_esm(object) === dViewTag;
      };
    } else {
      legacyCheck = function _legacyCheck(object) {
        var isByteLength = typeof object.byteLength === 'number';
        var isByteOffset = typeof object.byteOffset === 'number';
        var isGetFloat32 = typeof object.getFloat32 === 'function';
        var isSetFloat64 = typeof object.setFloat64 === 'function';
        return isByteLength && isByteOffset && isGetFloat32 && isSetFloat64 && is_array_buffer_x_esm(object.buffer);
      };
    }
  }
}
/**
 * Determine if an `object` is an `DataView`.
 *
 * @param {*} object - The object to test.
 * @returns {boolean} `true` if the `object` is a `DataView`, else `false`.
 */


var is_data_view_x_esm_isDataView = function isDataView(object) {
  if (hasDView === false || is_object_like_x_esm(object) === false) {
    return false;
  }

  if (legacyCheck) {
    return legacyCheck(object);
  }

  var result = attempt_x_esm.call(object, getByteLength);
  return result.threw === false && typeof result.value === 'number';
};

/* harmony default export */ var is_data_view_x_esm = (is_data_view_x_esm_isDataView);


// CONCATENATED MODULE: ./node_modules/is-error-x/dist/is-error-x.esm.js




var errorCheck = function checkIfError(value) {
  return to_string_tag_x_esm(value) === '[object Error]';
};

if (errorCheck(Error.prototype) === false) {
  var errorProto = Error.prototype;
  var testStringTag = errorCheck;

  errorCheck = function checkIfError(value) {
    return value === errorProto || testStringTag(value);
  };
}
/**
 * Determine whether or not a given `value` is an `Error` type.
 *
 * @param {*} value - The object to be tested.
 * @returns {boolean} Returns `true` if `value` is an `Error` type,
 *  else `false`.
 */


var is_error_x_esm_isError = function isError(value) {
  if (is_object_like_x_esm(value) === false) {
    return false;
  }

  var object = value;
  var maxLoop = 100;

  while (object && maxLoop > -1) {
    if (errorCheck(object)) {
      return true;
    }

    object = get_prototype_of_x_esm(object);
    maxLoop -= 1;
  }

  return false;
};

/* harmony default export */ var is_error_x_esm = (is_error_x_esm_isError);


// EXTERNAL MODULE: ./node_modules/is-promise/index.js
var is_promise = __webpack_require__(10);
var is_promise_default = /*#__PURE__*/__webpack_require__.n(is_promise);

// EXTERNAL MODULE: ./node_modules/is-number-object/index.js
var is_number_object = __webpack_require__(11);
var is_number_object_default = /*#__PURE__*/__webpack_require__.n(is_number_object);

// EXTERNAL MODULE: ./node_modules/is-boolean-object/index.js
var is_boolean_object = __webpack_require__(4);
var is_boolean_object_default = /*#__PURE__*/__webpack_require__.n(is_boolean_object);

// EXTERNAL MODULE: ./node_modules/object-is/index.js
var object_is = __webpack_require__(18);
var object_is_default = /*#__PURE__*/__webpack_require__.n(object_is);

// EXTERNAL MODULE: ./node_modules/is-nan/index.js
var is_nan = __webpack_require__(19);
var is_nan_default = /*#__PURE__*/__webpack_require__.n(is_nan);

// CONCATENATED MODULE: ./node_modules/get-function-name-x/dist/get-function-name-x.esm.js



var get_function_name_x_esm_functionCtr = is_function_x_esm.constructor;
var $getName;
/* eslint-disable-next-line lodash/prefer-noop */

var t = function test1() {};

if (t.name === 'test1') {
  var createsAnonymous = get_function_name_x_esm_functionCtr().name === 'anonymous';

  $getName = function getName(fn) {
    return createsAnonymous && fn.name === 'anonymous' ? '' : fn.name;
  };
} else {
  var get_function_name_x_esm_fToString = get_function_name_x_esm_functionCtr.toString;
  var reName = /^(?:async )?(?:function|class) ?(?:\* )?([\w$]+)/i;
  var stringMatch = ''.match;

  $getName = function getName(fn) {
    var match;

    try {
      match = stringMatch.call(normalize_space_x_esm(replace_comments_x_esm(get_function_name_x_esm_fToString.call(fn), ' ')), reName);

      if (match) {
        var name = match[1];
        return name === 'anonymous' ? '' : name;
      }
    } catch (ignore) {// empty
    }

    return '';
  };
}
/**
 * This method returns the name of the function, or `undefined` if not
 * a function.
 *
 * @param {Function} fn - The function to get the name of.
 * @returns {undefined|string} The name of the function,  or `undefined` if
 *  not a function.
 */


var get_function_name_x_esm_getFunctionName = function getFunctionName(fn) {
  /* eslint-disable-next-line no-void */
  return is_function_x_esm(fn, true) ? $getName(fn) : void 0;
};

/* harmony default export */ var get_function_name_x_esm = (get_function_name_x_esm_getFunctionName);


// CONCATENATED MODULE: ./node_modules/array-reduce-x/dist/array-reduce-x.esm.js
var array_reduce_x_esm_this = undefined;

function array_reduce_x_esm_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { array_reduce_x_esm_typeof = function _typeof(obj) { return typeof obj; }; } else { array_reduce_x_esm_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return array_reduce_x_esm_typeof(obj); }

function array_reduce_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }






var natRed = [].reduce;
var array_reduce_x_esm_castObject = {}.constructor;
var nativeReduce = typeof natRed === 'function' && natRed; // ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce

var array_reduce_x_esm_isWorking;

if (nativeReduce) {
  array_reduce_x_esm_isWorking = attempt_x_esm.call([], nativeReduce, function (acc) {
    array_reduce_x_esm_newArrowCheck(this, array_reduce_x_esm_this);

    return acc;
  }.bind(undefined)).threw;
  var array_reduce_x_esm_res;

  if (array_reduce_x_esm_isWorking) {
    array_reduce_x_esm_res = attempt_x_esm.call(array_reduce_x_esm_castObject('abc'), nativeReduce, function (acc, c) {
      array_reduce_x_esm_newArrowCheck(this, array_reduce_x_esm_this);

      return acc + c;
    }.bind(undefined), 'x');
    array_reduce_x_esm_isWorking = array_reduce_x_esm_res.threw === false && array_reduce_x_esm_res.value === 'xabc';
  }

  if (array_reduce_x_esm_isWorking) {
    array_reduce_x_esm_res = attempt_x_esm.call(function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    }(1, 2, 3), nativeReduce, function (acc, arg) {
      array_reduce_x_esm_newArrowCheck(this, array_reduce_x_esm_this);

      return acc + arg;
    }.bind(undefined), 1);
    array_reduce_x_esm_isWorking = array_reduce_x_esm_res.threw === false && array_reduce_x_esm_res.value === 7;
  }

  if (array_reduce_x_esm_isWorking) {
    array_reduce_x_esm_res = attempt_x_esm.call({
      0: 1,
      1: 2,
      3: 3,
      4: 4,
      length: 4
    }, nativeReduce, function (acc, arg) {
      array_reduce_x_esm_newArrowCheck(this, array_reduce_x_esm_this);

      return acc + arg;
    }.bind(undefined), 2);
    array_reduce_x_esm_isWorking = array_reduce_x_esm_res.threw === false && array_reduce_x_esm_res.value === 8;
  }

  if (array_reduce_x_esm_isWorking) {
    var array_reduce_x_esm_doc = typeof document !== 'undefined' && document;

    if (array_reduce_x_esm_doc) {
      var array_reduce_x_esm_fragment = array_reduce_x_esm_doc.createDocumentFragment();
      var array_reduce_x_esm_div = array_reduce_x_esm_doc.createElement('div');
      array_reduce_x_esm_fragment.appendChild(array_reduce_x_esm_div);
      array_reduce_x_esm_res = attempt_x_esm.call(array_reduce_x_esm_fragment.childNodes, nativeReduce, function (acc, node) {
        array_reduce_x_esm_newArrowCheck(this, array_reduce_x_esm_this);

        acc[acc.length] = node;
        return acc;
      }.bind(undefined), []);
      array_reduce_x_esm_isWorking = array_reduce_x_esm_res.threw === false && array_reduce_x_esm_res.value.length === 1 && array_reduce_x_esm_res.value[0] === array_reduce_x_esm_div;
    }
  }

  if (array_reduce_x_esm_isWorking) {
    array_reduce_x_esm_res = attempt_x_esm.call('ab', nativeReduce, function (_, __, ___, list) {
      array_reduce_x_esm_newArrowCheck(this, array_reduce_x_esm_this);

      return list;
    }.bind(undefined));
    array_reduce_x_esm_isWorking = array_reduce_x_esm_res.threw === false && array_reduce_x_esm_typeof(array_reduce_x_esm_res.value) === 'object';
  }
}
/**
 * This method applies a function against an accumulator and each element in the
 * array (from left to right) to reduce it to a single value.
 *
 * @param {Array} array - The array to iterate over.
 * @param {Function} callBack - Function to execute for each element.
 * @param {*} [initialValue] - Value to use as the first argument to the first
 *  call of the callback. If no initial value is supplied, the first element in
 *  the array will be used. Calling reduce on an empty array without an initial
 *  value is an error.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @throws {TypeError} If called on an empty array without an initial value.
 * @returns {*} The value that results from the reduction.
 */


var $reduce;

if (nativeReduce && array_reduce_x_esm_isWorking) {
  $reduce = function reduce(array, callBack
  /* , initialValue */
  ) {
    var args = [callBack];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return nativeReduce.apply(array, args);
  };
} else {
  $reduce = function reduce(array, callBack
  /* , initialValue */
  ) {
    var object = to_object_x_esm(array); // If no callback function or if callback is not a callable function

    assert_is_function_x_esm(callBack);
    var iterable = split_if_boxed_bug_x_esm(object);
    var length = to_length_x_esm(iterable.length);
    var argsLength = arguments.length; // no value to return if no initial value and an empty array

    if (length === 0 && argsLength < 3) {
      throw new TypeError('reduce of empty array with no initial value');
    }

    var i = 0;
    var result;

    if (argsLength > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      result = arguments[2];
    } else {
      do {
        if (i in iterable) {
          result = iterable[i];
          i += 1;
          break;
        } // if array contains no values, no initial value to return


        i += 1;

        if (i >= length) {
          throw new TypeError('reduce of empty array with no initial value');
        }
      } while (true);
      /* eslint-disable-line no-constant-condition */

    }

    while (i < length) {
      if (i in iterable) {
        result = callBack(result, iterable[i], i, object);
      }

      i += 1;
    }

    return result;
  };
}

var red = $reduce;
/* harmony default export */ var array_reduce_x_esm = (red);


// CONCATENATED MODULE: ./node_modules/array-some-x/dist/array-some-x.esm.js






var ns = [].some;
var nativeSome = typeof ns === 'function' && ns;

var array_some_x_esm_test1 = function test1() {
  var spy = 0;
  var res = attempt_x_esm.call([1, 2], nativeSome, function spyAdd1(item) {
    spy += item;
    return false;
  });
  return res.threw === false && res.value === false && spy === 3;
};

var array_some_x_esm_test2 = function test2() {
  var spy = '';
  var res = attempt_x_esm.call({}.constructor('abc'), nativeSome, function spyAdd2(item, index) {
    spy += item;
    return index === 1;
  });
  return res.threw === false && res.value === true && spy === 'ab';
};

var array_some_x_esm_test3 = function test3() {
  var spy = 0;
  var res = attempt_x_esm.call(function getArgs() {
    /* eslint-disable-next-line prefer-rest-params */
    return arguments;
  }(1, 2, 3), nativeSome, function spyAdd3(item, index) {
    spy += item;
    return index === 2;
  });
  return res.threw === false && res.value === true && spy === 6;
};

var array_some_x_esm_test4 = function test4() {
  var spy = 0;
  var res = attempt_x_esm.call({
    0: 1,
    1: 2,
    3: 3,
    4: 4,
    length: 4
  }, nativeSome, function spyAdd4(item) {
    spy += item;
    return false;
  });
  return res.threw === false && res.value === false && spy === 6;
};

var array_some_x_esm_test5 = function test5() {
  var doc = typeof document !== 'undefined' && document;

  if (doc) {
    var spy = null;
    var fragment = doc.createDocumentFragment();
    var div = doc.createElement('div');
    fragment.appendChild(div);
    var res = attempt_x_esm.call(fragment.childNodes, nativeSome, function spyAssign(item) {
      spy = item;
      return item;
    });
    return res.threw === false && res.value === true && spy === div;
  }

  return true;
};

var array_some_x_esm_test6 = function test6() {
  var isStrict = function getIsStrict() {
    /* eslint-disable-next-line babel/no-invalid-this */
    return true.constructor(this) === false;
  }();

  if (isStrict) {
    var spy = null;
    var res = attempt_x_esm.call([1], nativeSome, function thisTest() {
      /* eslint-disable-next-line babel/no-invalid-this */
      spy = typeof this === 'string';
    }, 'x');
    return res.threw === false && res.value === false && spy === true;
  }

  return true;
};

var array_some_x_esm_test7 = function test7() {
  var spy = {};
  var fn = 'return nativeSome.call("foo", function (_, __, context) {' + 'if (castBoolean(context) === false || typeof context !== "object") {' + 'spy.value = true;}});';
  /* eslint-disable-next-line no-new-func */

  var res = attempt_x_esm(Function('nativeSome', 'spy', 'castBoolean', fn), nativeSome, spy, true.constructor);
  return res.threw === false && res.value === false && spy.value !== true;
};

var array_some_x_esm_isWorking = true.constructor(nativeSome) && array_some_x_esm_test1() && array_some_x_esm_test2() && array_some_x_esm_test3() && array_some_x_esm_test4() && array_some_x_esm_test5() && array_some_x_esm_test6() && array_some_x_esm_test7();

var array_some_x_esm_patchedSome = function patchedSome() {
  return function some(array, callBack
  /* , thisArg */
  ) {
    require_object_coercible_x_esm(array);
    var args = [assert_is_function_x_esm(callBack)];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return nativeSome.apply(array, args);
  };
}; // ES5 15.4.4.17
// http://es5.github.com/#x15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some


var array_some_x_esm_implementation = function implementation() {
  return function some(array, callBack
  /* , thisArg */
  ) {
    var object = to_object_x_esm(array); // If no callback function or if callback is not a callable function

    assert_is_function_x_esm(callBack);
    var iterable = split_if_boxed_bug_x_esm(object);
    var length = to_length_x_esm(iterable.length);
    /* eslint-disable-next-line prefer-rest-params,no-void */

    var thisArg = arguments.length > 2 ? arguments[2] : void 0;
    var noThis = typeof thisArg === 'undefined';

    for (var i = 0; i < length; i += 1) {
      if (i in iterable) {
        var item = iterable[i];

        if (noThis ? callBack(item, i, object) : callBack.call(thisArg, item, i, object)) {
          return true;
        }
      }
    }

    return false;
  };
};
/**
 * This method tests whether some element in the array passes the test
 * implemented by the provided function.
 *
 * @param {Array} array - The array to iterate over.
 * @param {Function} callBack - Function to test for each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @returns {boolean} `true` if the callback function returns a truthy value for
 *  any array element; otherwise, `false`.
 */


var $some = array_some_x_esm_isWorking ? array_some_x_esm_patchedSome() : array_some_x_esm_implementation();
/* harmony default export */ var array_some_x_esm = ($some);


// CONCATENATED MODULE: ./node_modules/array-every-x/dist/array-every-x.esm.js






var ne = [].every;
var nativeEvery = typeof ne === 'function' && ne;

var array_every_x_esm_test1 = function test1() {
  var spy = 0;
  var res = attempt_x_esm.call([1, 2], nativeEvery, function spyAdd1(item) {
    spy += item;
    return true;
  });
  return res.threw === false && res.value === true && spy === 3;
};

var array_every_x_esm_test2 = function test2() {
  var spy = '';
  var res = attempt_x_esm.call({}.constructor('abc'), nativeEvery, function spyAdd2(item, index) {
    spy += item;
    return index !== 2;
  });
  return res.threw === false && res.value === false && spy === 'abc';
};

var array_every_x_esm_test3 = function test3() {
  var spy = 0;
  var res = attempt_x_esm.call(function getArgs() {
    /* eslint-disable-next-line prefer-rest-params */
    return arguments;
  }(1, 2, 3), nativeEvery, function spyAdd3(item, index) {
    spy += item;
    return index !== 1;
  });
  return res.threw === false && res.value === false && spy === 3;
};

var array_every_x_esm_test4 = function test4() {
  var spy = 0;
  var res = attempt_x_esm.call({
    0: 1,
    1: 2,
    3: 3,
    4: 4,
    length: 4
  }, nativeEvery, function spyAdd4(item) {
    spy += item;
    return true;
  });
  return res.threw === false && res.value === true && spy === 6;
};

var array_every_x_esm_test5 = function test5() {
  var doc = typeof document !== 'undefined' && document;

  if (doc) {
    var spy = null;
    var fragment = doc.createDocumentFragment();
    var div = doc.createElement('div');
    fragment.appendChild(div);
    var res = attempt_x_esm.call(fragment.childNodes, nativeEvery, function spyAssign(item) {
      spy = item;
    });
    return res.threw === false && res.value === false && spy === div;
  }

  return true;
};

var array_every_x_esm_test6 = function test6() {
  var isStrict = function returnIsStrict() {
    /* eslint-disable-next-line babel/no-invalid-this */
    return true.constructor(this) === false;
  }();

  if (isStrict) {
    var spy = null;
    var res = attempt_x_esm.call([1], nativeEvery, function testThis() {
      /* eslint-disable-next-line babel/no-invalid-this */
      spy = typeof this === 'string';
    }, 'x');
    return res.threw === false && res.value === false && spy === true;
  }

  return true;
};

var array_every_x_esm_test7 = function test7() {
  var spy = {};
  var fn = 'return nativeEvery.call("foo", function (_, __, context) {' + 'if (castBoolean(context) === false || typeof context !== "object") {' + 'spy.value = true;}});';
  /* eslint-disable-next-line no-new-func */

  var res = attempt_x_esm(Function('nativeEvery', 'spy', 'castBoolean', fn), nativeEvery, spy, true.constructor);
  return res.threw === false && res.value === false && spy.value !== true;
};

var array_every_x_esm_isWorking = true.constructor(nativeEvery) && array_every_x_esm_test1() && array_every_x_esm_test2() && array_every_x_esm_test3() && array_every_x_esm_test4() && array_every_x_esm_test5() && array_every_x_esm_test6() && array_every_x_esm_test7();

var array_every_x_esm_patchedEvery = function patchedEvery() {
  return function every(array, callBack
  /* , thisArg */
  ) {
    require_object_coercible_x_esm(array);
    var args = [assert_is_function_x_esm(callBack)];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return nativeEvery.apply(array, args);
  };
};

var array_every_x_esm_implementation = function implementation() {
  return function every(array, callBack
  /* , thisArg */
  ) {
    var object = to_object_x_esm(array); // If no callback function or if callback is not a callable function

    assert_is_function_x_esm(callBack);
    var iterable = split_if_boxed_bug_x_esm(object);
    var length = to_length_x_esm(iterable.length);
    /* eslint-disable-next-line prefer-rest-params,no-void */

    var thisArg = arguments.length > 2 ? arguments[2] : void 0;
    var noThis = typeof thisArg === 'undefined';

    for (var i = 0; i < length; i += 1) {
      if (i in iterable) {
        var item = iterable[i];

        if ((noThis ? callBack(item, i, object) : callBack.call(thisArg, item, i, object)) === false) {
          return false;
        }
      }
    }

    return true;
  };
};
/**
 * This method tests whether all elements in the array pass the test implemented
 * by the provided function.
 *
 * @param {Array} array - The array to iterate over.
 * @param {Function} callBack - Function to test for each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @returns {boolean} `true` if the callback function returns a truthy value for
 *  every array element; otherwise, `false`.
 */


var $every = array_every_x_esm_isWorking ? array_every_x_esm_patchedEvery() : array_every_x_esm_implementation();
/* harmony default export */ var array_every_x_esm = ($every);


// CONCATENATED MODULE: ./node_modules/array-map-x/dist/array-map-x.esm.js






var nm = [].map;
var nativeMap = typeof nm === 'function' && nm;

var identity = function identity(item) {
  return item;
};

var array_map_x_esm_test1 = function test1() {
  var res = attempt_x_esm.call([1, 2], nativeMap, identity);
  return res.threw === false && res.value && res.value.length === 2 && res.value[0] === 1 && res.value[1] === 2;
};

var array_map_x_esm_test2 = function test2() {
  var res = attempt_x_esm.call({}.constructor('ab'), nativeMap, identity);
  return res.threw === false && res.value && res.value.length === 2 && res.value[0] === 'a' && res.value[1] === 'b';
};

var array_map_x_esm_test3 = function test3() {
  var res = attempt_x_esm.call(function returnArgs() {
    /* eslint-disable-next-line prefer-rest-params */
    return arguments;
  }(1, 2), nativeMap, identity);
  return res.threw === false && res.value && res.value.length === 2 && res.value[0] === 1 && res.value[1] === 2;
};

var array_map_x_esm_test4 = function test4() {
  var res = attempt_x_esm.call({
    0: 1,
    2: 2,
    length: 3
  }, nativeMap, identity);
  return res.threw === false && res.value && res.value.length === 3 && !(1 in res.value);
};

var array_map_x_esm_test5 = function test5() {
  var doc = typeof document !== 'undefined' && document;

  if (doc) {
    var fragment = doc.createDocumentFragment();
    var div = doc.createElement('div');
    fragment.appendChild(div);
    var res = attempt_x_esm.call(fragment.childNodes, nativeMap, identity);
    return res.threw === false && res.value && res.value.length === 1 && res.value[0] === div;
  }

  return true;
};

var array_map_x_esm_test6 = function test6() {
  var isStrict = function returnIsStrict() {
    /* eslint-disable-next-line babel/no-invalid-this */
    return true.constructor(this) === false;
  }();

  if (isStrict) {
    var spy = null;
    var res = attempt_x_esm.call([1], nativeMap, function testThis() {
      /* eslint-disable-next-line babel/no-invalid-this */
      spy = typeof this === 'string';
    }, 'x');
    return res.threw === false && res.value && res.value.length === 1 && spy === true;
  }

  return true;
};

var array_map_x_esm_test7 = function test7() {
  var spy = {};
  var fn = 'return nativeMap.call("foo", function (_, __, context) {' + 'if (castBoolean(context) === false || typeof context !== "object") {' + 'spy.value = true;}});';
  /* eslint-disable-next-line no-new-func */

  var res = attempt_x_esm(Function('nativeMap', 'spy', 'castBoolean', fn), nativeMap, spy, true.constructor);
  return res.threw === false && res.value && res.value.length === 3 && spy.value !== true;
};

var array_map_x_esm_isWorking = true.constructor(nativeMap) && array_map_x_esm_test1() && array_map_x_esm_test2() && array_map_x_esm_test3() && array_map_x_esm_test4() && array_map_x_esm_test5() && array_map_x_esm_test6() && array_map_x_esm_test7();

var array_map_x_esm_patchedMap = function patchedMap() {
  return function map(array, callBack
  /* , thisArg */
  ) {
    require_object_coercible_x_esm(array);
    var args = [assert_is_function_x_esm(callBack)];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return nativeMap.apply(array, args);
  };
};

var array_map_x_esm_implementation = function implementation() {
  return function map(array, callBack
  /* , thisArg */
  ) {
    var object = to_object_x_esm(array); // If no callback function or if callback is not a callable function

    assert_is_function_x_esm(callBack);
    var iterable = split_if_boxed_bug_x_esm(object);
    var length = to_length_x_esm(iterable.length);
    /* eslint-disable-next-line prefer-rest-params,no-void */

    var thisArg = arguments.length > 2 ? arguments[2] : void 0;
    var noThis = typeof thisArg === 'undefined';
    var result = [];
    result.length = length;

    for (var i = 0; i < length; i += 1) {
      if (i in iterable) {
        var item = iterable[i];
        result[i] = noThis ? callBack(item, i, object) : callBack.call(thisArg, item, i, object);
      }
    }

    return result;
  };
};
/**
 * This method creates a new array with the results of calling a provided
 * function on every element in the calling array.
 *
 * @param {Array} array - The array to iterate over.
 * @param {Function} callBack - Function that produces an element of the Array.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @returns {Array} A new array with each element being the result of the
 * callback function.
 */


var $map = array_map_x_esm_isWorking ? array_map_x_esm_patchedMap() : array_map_x_esm_implementation();
/* harmony default export */ var array_map_x_esm = ($map);


// CONCATENATED MODULE: ./node_modules/has-reflect-support-x/dist/has-reflect-support-x.esm.js
function has_reflect_support_x_esm_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { has_reflect_support_x_esm_typeof = function _typeof(obj) { return typeof obj; }; } else { has_reflect_support_x_esm_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return has_reflect_support_x_esm_typeof(obj); }

/**
 * Indicates if `Reflect`exists.
 * `true`, if it exists and creates the correct type, otherwise `false`.
 *
 * @type boolean
 */
/* harmony default export */ var has_reflect_support_x_esm = ((typeof Reflect === "undefined" ? "undefined" : has_reflect_support_x_esm_typeof(Reflect)) === 'object' && Reflect !== null);


// CONCATENATED MODULE: ./node_modules/get-own-property-names-x/dist/get-own-property-names-x.esm.js
function get_own_property_names_x_esm_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { get_own_property_names_x_esm_typeof = function _typeof(obj) { return typeof obj; }; } else { get_own_property_names_x_esm_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return get_own_property_names_x_esm_typeof(obj); }







var get_own_property_names_x_esm_ObjectCtr = {}.constructor;
var nGOPN = get_own_property_names_x_esm_ObjectCtr.getOwnPropertyNames;
var nativeGOPN = typeof nGOPN === 'function' && nGOPN;
/**
 * This method creates an array of all properties (enumerable or not) found
 * directly upon a given object.
 *
 * @param {object} obj - The object whose enumerable and non-enumerable own
 *  properties are to be returned.
 * @throws {TypeError} If target is null or undefined.
 * @returns {Array} An array of strings that correspond to the properties found
 *  directly upon the given object.
 */

var getOPN;

if (nativeGOPN) {
  var get_own_property_names_x_esm_isCorrectRes = function isCorrectRes(r, length) {
    return r.threw === false && is_array_x_esm(r.value) && r.value.length === length;
  };

  var get_own_property_names_x_esm_either = function either(r, a, b) {
    var x = r.value[0];
    var y = r.value[1];
    return x === a && y === b || x === b && y === a;
  };

  var get_own_property_names_x_esm_res = attempt_x_esm(nativeGOPN, 'fo');

  if (get_own_property_names_x_esm_isCorrectRes(get_own_property_names_x_esm_res, 3) && get_own_property_names_x_esm_either(get_own_property_names_x_esm_res, '0', '1') && get_own_property_names_x_esm_res.value[2] === 'length') {
    getOPN = nativeGOPN;
  } else {
    get_own_property_names_x_esm_res = attempt_x_esm(nativeGOPN, {
      a: 1,
      b: 2
    });

    if (get_own_property_names_x_esm_isCorrectRes(get_own_property_names_x_esm_res, 2) && get_own_property_names_x_esm_either(get_own_property_names_x_esm_res, 'a', 'b')) {
      var win = (typeof window === "undefined" ? "undefined" : get_own_property_names_x_esm_typeof(window)) === 'object' && window;
      var cachedWindowNames = win ? nativeGOPN(win) : [];

      getOPN = function getOwnPropertyNames(obj) {
        var val = to_object_x_esm(obj); // IE bug where layout engine calls userland gOPN for cross-domain `window` objects

        if (win && win !== window && to_string_tag_x_esm(val) === '[object Window]') {
          var result = attempt_x_esm(nativeGOPN, val);
          return result.threw ? array_slice_x_esm(cachedWindowNames) : result.value;
        }

        return nativeGOPN(val);
      };
    }
  }
}

if (typeof getOPN !== 'function') {
  getOPN = function getOwnPropertyNames(obj) {
    return object_keys_x_esm(obj);
  };
}

var gopn = getOPN;
/* harmony default export */ var get_own_property_names_x_esm = (gopn);


// CONCATENATED MODULE: ./node_modules/reflect-own-keys-x/dist/reflect-own-keys-x.esm.js







/* eslint-disable-next-line compat/compat */

var nativeOwnKeys = has_symbol_support_x_esm && typeof Reflect.ownKeys === 'function' && Reflect.ownKeys;
var reflect_own_keys_x_esm_isWorking;

if (nativeOwnKeys) {
  var reflect_own_keys_x_esm_isCorrectRes = function isCorrectRes(r, length) {
    return r.threw === false && is_array_x_esm(r.value) && r.value.length === length;
  };

  var reflect_own_keys_x_esm_either = function either(r, a, b) {
    var x = r.value[0];
    var y = r.value[1];
    return x === a && y === b || x === b && y === a;
  };

  var reflect_own_keys_x_esm_res = attempt_x_esm(nativeOwnKeys, 1);
  reflect_own_keys_x_esm_isWorking = reflect_own_keys_x_esm_res.threw;

  if (reflect_own_keys_x_esm_isWorking) {
    reflect_own_keys_x_esm_res = attempt_x_esm(nativeOwnKeys, {
      a: 1,
      b: 2
    });
    reflect_own_keys_x_esm_isWorking = reflect_own_keys_x_esm_isCorrectRes(reflect_own_keys_x_esm_res, 2) && reflect_own_keys_x_esm_either(reflect_own_keys_x_esm_res, 'a', 'b');
  }

  if (reflect_own_keys_x_esm_isWorking && has_reflect_support_x_esm) {
    /* eslint-disable-next-line compat/compat */
    var reflect_own_keys_x_esm_symbol = Symbol('');
    var reflect_own_keys_x_esm_testObj = {
      a: 1
    };
    reflect_own_keys_x_esm_testObj[reflect_own_keys_x_esm_symbol] = 2;
    reflect_own_keys_x_esm_res = attempt_x_esm(nativeOwnKeys, reflect_own_keys_x_esm_testObj);
    reflect_own_keys_x_esm_isWorking = reflect_own_keys_x_esm_isCorrectRes(reflect_own_keys_x_esm_res, 2) && reflect_own_keys_x_esm_either(reflect_own_keys_x_esm_res, 'a', reflect_own_keys_x_esm_symbol);
  }
}
/**
 * This method returns an array of the target object's own property keys.
 * Its return value is equivalent to Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target)).
 *
 * @param {*} target - The target object from which to get the own keys.
 * @throws {TypeError} If target is not an Object.
 * @returns {object} An Array of the target object's own property keys.
 */


var reflectOwnKeys;

if (reflect_own_keys_x_esm_isWorking) {
  reflectOwnKeys = nativeOwnKeys;
} else {
  var reflect_own_keys_x_esm_concat = [].concat;

  reflectOwnKeys = function ownKeys(target) {
    assert_is_object_x_esm(target);
    return reflect_own_keys_x_esm_concat.call(get_own_property_names_x_esm(target), get_own_property_symbols_x_esm(target));
  };
}

var rok = reflectOwnKeys;
/* harmony default export */ var reflect_own_keys_x_esm = (rok);


// EXTERNAL MODULE: ./node_modules/json3/lib/json3.js
var json3 = __webpack_require__(12);

// CONCATENATED MODULE: ./node_modules/same-value-x/dist/same-value-x.esm.js

/**
 * This method is the comparison abstract operation SameValue(x, y), where x
 * and y are ECMAScript language values, produces true or false.
 *
 * @param {*} [value1] - The first value to compare.
 * @param {*} [value2] - The second value to compare.
 * @returns {boolean} A Boolean indicating whether or not the two arguments are
 *  the same value.
 */

var same_value_x_esm_sameValue = function sameValue(value1, value2) {
  if (value1 === 0 && value2 === 0) {
    return 1 / value1 === 1 / value2;
  }

  if (value1 === value2) {
    return true;
  }

  return is_nan_x_esm(value1) && is_nan_x_esm(value2);
};

/* harmony default export */ var same_value_x_esm = (same_value_x_esm_sameValue);


// CONCATENATED MODULE: ./node_modules/same-value-zero-x/dist/same-value-zero-x.esm.js

/**
 * This method determines whether two values are the same value.
 * SameValueZero differs from SameValue (`Object.is`) only in its treatment
 * of +0 and -0.
 *
 * @param {*} [x] - The first value to compare.
 * @param {*} [y] - The second value to compare.
 * @returns {boolean} A Boolean indicating whether or not the two arguments
 * are the same value.
 */

var same_value_zero_x_esm_sameValueZero = function sameValueZero(x, y) {
  return x === y || same_value_x_esm(x, y);
};

/* harmony default export */ var same_value_zero_x_esm = (same_value_zero_x_esm_sameValueZero);


// CONCATENATED MODULE: ./node_modules/find-index-x/dist/find-index-x.esm.js
var find_index_x_esm_this = undefined;

function find_index_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }






var pFindIndex = typeof Array.prototype.findIndex === 'function' && Array.prototype.findIndex;
var find_index_x_esm_isWorking;

if (pFindIndex) {
  var testArr = [];
  testArr.length = 2;
  testArr[1] = 1;
  var find_index_x_esm_res = attempt_x_esm.call(testArr, pFindIndex, function (item, idx) {
    find_index_x_esm_newArrowCheck(this, find_index_x_esm_this);

    return idx === 0;
  }.bind(undefined));
  find_index_x_esm_isWorking = find_index_x_esm_res.threw === false && find_index_x_esm_res.value === 0;

  if (find_index_x_esm_isWorking) {
    find_index_x_esm_res = attempt_x_esm.call(1, pFindIndex, function (item, idx) {
      find_index_x_esm_newArrowCheck(this, find_index_x_esm_this);

      return idx === 0;
    }.bind(undefined));
    find_index_x_esm_isWorking = find_index_x_esm_res.threw === false && find_index_x_esm_res.value === -1;
  }

  if (find_index_x_esm_isWorking) {
    find_index_x_esm_isWorking = attempt_x_esm.call([], pFindIndex).threw;
  }

  if (find_index_x_esm_isWorking) {
    find_index_x_esm_res = attempt_x_esm.call('abc', pFindIndex, function (item) {
      find_index_x_esm_newArrowCheck(this, find_index_x_esm_this);

      return item === 'c';
    }.bind(undefined));
    find_index_x_esm_isWorking = find_index_x_esm_res.threw === false && find_index_x_esm_res.value === 2;
  }

  if (find_index_x_esm_isWorking) {
    find_index_x_esm_res = attempt_x_esm.call(function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    }('a', 'b', 'c'), pFindIndex, function (item) {
      find_index_x_esm_newArrowCheck(this, find_index_x_esm_this);

      return item === 'c';
    }.bind(undefined));
    find_index_x_esm_isWorking = find_index_x_esm_res.threw === false && find_index_x_esm_res.value === 2;
  }
}
/**
 * Like `findIndex`, this method returns an index in the array, if an element
 * in the array satisfies the provided testing function. Otherwise -1 is returned.
 *
 * @param {Array} array - The array to search.
 * @throws {TypeError} If array is `null` or `undefined`-.
 * @param {Function} callback - Function to execute on each value in the array,
 *  taking three arguments: `element`, `index` and `array`.
 * @throws {TypeError} If `callback` is not a function.
 * @param {*} [thisArg] - Object to use as `this` when executing `callback`.
 * @returns {number} Returns index of positively tested element, otherwise -1.
 */


var findIdx;

if (find_index_x_esm_isWorking) {
  findIdx = function findIndex(array, callback) {
    var args = [callback];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return pFindIndex.apply(array, args);
  };
} else {
  findIdx = function findIndex(array, callback) {
    var object = to_object_x_esm(array);
    assert_is_function_x_esm(callback);
    var iterable = split_if_boxed_bug_x_esm(object);
    var length = to_length_x_esm(iterable.length);

    if (length < 1) {
      return -1;
    }

    var thisArg;

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      thisArg = arguments[2];
    }

    var index = 0;

    while (index < length) {
      if (callback.call(thisArg, iterable[index], index, object)) {
        return index;
      }

      index += 1;
    }

    return -1;
  };
}

var fi = findIdx;
/* harmony default export */ var find_index_x_esm = (fi);


// CONCATENATED MODULE: ./node_modules/is-array-like-x/dist/is-array-like-x.esm.js



/**
 * Checks if value is array-like. A value is considered array-like if it's
 * not a function and has a `length` that's an integer greater than or
 * equal to 0 and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @param {*} value - The object to be tested.
 */

var is_array_like_x_esm_isArrayLike = function isArrayLike(value) {
  return is_nil_x_esm(value) === false && is_function_x_esm(value, true) === false && is_length_x_esm(value.length);
};

/* harmony default export */ var is_array_like_x_esm = (is_array_like_x_esm_isArrayLike);


// CONCATENATED MODULE: ./node_modules/calculate-from-index-x/dist/calculate-from-index-x.esm.js





var calculate_from_index_x_esm_getMax = function getMax(a, b) {
  return a >= b ? a : b;
};
/**
 * This method calculates a fromIndex of a given value for an array.
 *
 * @param {Array} array - * The array on which to calculate the starting index.
 * @throws {TypeError} If array is null or undefined.
 * @param {number} fromIndex - * The position in this array at which to begin. A
 *  negative value gives the index of array.length + fromIndex by asc.
 * @returns {number} The calculated fromIndex. Default is 0.
 */


var calculate_from_index_x_esm_calcFromIndex = function calcFromIndex(array, fromIndex) {
  var object = to_object_x_esm(array);

  if (is_array_like_x_esm(object) === false) {
    return 0;
  }

  var index = to_integer_x_esm(fromIndex);
  return index >= 0 ? index : calculate_from_index_x_esm_getMax(0, to_length_x_esm(object.length) + index);
};

/* harmony default export */ var calculate_from_index_x_esm = (calculate_from_index_x_esm_calcFromIndex);


// CONCATENATED MODULE: ./node_modules/index-of-x/dist/index-of-x.esm.js
function index_of_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }











/** @type {BooleanConstructor} */

var index_of_x_esm_castBoolean = true.constructor;
var pIndexOf = typeof Array.prototype.indexOf === 'function' && Array.prototype.indexOf;
var index_of_x_esm_isWorking;

if (pIndexOf) {
  var index_of_x_esm_res = attempt_x_esm.call([0, 1], pIndexOf, 1, 2);
  index_of_x_esm_isWorking = index_of_x_esm_res.threw === false && index_of_x_esm_res.value === -1;

  if (index_of_x_esm_isWorking) {
    index_of_x_esm_res = attempt_x_esm.call([0, 1], pIndexOf, 1);
    index_of_x_esm_isWorking = index_of_x_esm_res.threw === false && index_of_x_esm_res.value === 1;
  }

  if (index_of_x_esm_isWorking) {
    index_of_x_esm_res = attempt_x_esm.call([0, -0], pIndexOf, -0);
    index_of_x_esm_isWorking = index_of_x_esm_res.threw === false && index_of_x_esm_res.value === 0;
  }

  if (index_of_x_esm_isWorking) {
    var index_of_x_esm_testArr = [];
    index_of_x_esm_testArr.length = 2;
    /* eslint-disable-next-line no-void */

    index_of_x_esm_testArr[1] = void 0;
    /* eslint-disable-next-line no-void */

    index_of_x_esm_res = attempt_x_esm.call(index_of_x_esm_testArr, pIndexOf, void 0);
    index_of_x_esm_isWorking = index_of_x_esm_res.threw === false && index_of_x_esm_res.value === 1;
  }

  if (index_of_x_esm_isWorking) {
    index_of_x_esm_res = attempt_x_esm.call('abc', pIndexOf, 'c');
    index_of_x_esm_isWorking = index_of_x_esm_res.threw === false && index_of_x_esm_res.value === 2;
  }

  if (index_of_x_esm_isWorking) {
    index_of_x_esm_res = attempt_x_esm.call(function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    }('a', 'b', 'c'), pIndexOf, 'c');
    index_of_x_esm_isWorking = index_of_x_esm_res.threw === false && index_of_x_esm_res.value === 2;
  }
}

if (index_of_x_esm_isWorking !== true) {
  pIndexOf = function $pIndexOf(searchElement) {
    /* eslint-disable-next-line babel/no-invalid-this */
    var length = to_length_x_esm(this.length);

    if (length < 1) {
      return -1;
    }
    /* eslint-disable-next-line prefer-rest-params */


    var i = arguments[1];

    while (i < length) {
      /* eslint-disable-next-line babel/no-invalid-this */
      if (i in this && this[i] === searchElement) {
        return i;
      }

      i += 1;
    }

    return -1;
  };
}
/**
 * This method returns an index in the array, if an element in the array
 * satisfies the provided testing function. Otherwise -1 is returned.
 *
 * @private
 * @param {Array} array - The array to search.
 * @param {*} searchElement - Element to locate in the array.
 * @param {number} fromIndex - The index to start the search at.
 * @param {Function} extendFn - The comparison function to use.
 * @returns {number} Returns index of found element, otherwise -1.
 */


var findIdxFrom = function findIndexFrom(array, searchElement, fromIndex, extendFn) {
  var fIdx = fromIndex;
  var length = to_length_x_esm(array.length);

  while (fIdx < length) {
    if (fIdx in array && extendFn(array[fIdx], searchElement)) {
      return fIdx;
    }

    fIdx += 1;
  }

  return -1;
}; // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * This method returns the first index at which a given element can be found
 * in the array, or -1 if it is not present.
 *
 * @param {Array} array - The array to search.
 * @throws {TypeError} If `array` is `null` or `undefined`.
 * @param {*} searchElement - Element to locate in the `array`.
 * @param {number} [fromIndex] - The index to start the search at. If the
 *  index is greater than or equal to the array's length, -1 is returned,
 *  which means the array will not be searched. If the provided index value is
 *  a negative number, it is taken as the offset from the end of the array.
 *  Note: if the provided index is negative, the array is still searched from
 *  front to back. If the calculated index is less than 0, then the whole
 *  array will be searched. Default: 0 (entire array is searched).
 * @param {string} [extend] - Extension type: `SameValue` or `SameValueZero`.
 * @returns {number} Returns index of found element, otherwise -1.
 */
// eslint-enable jsdoc/check-param-names


var index_of_x_esm_indexOf = function indexOf(array, searchElement) {
  var _this = this;

  var object = to_object_x_esm(array);
  var iterable = split_if_boxed_bug_x_esm(object);
  var length = to_length_x_esm(iterable.length);

  if (length < 1) {
    return -1;
  }

  var argLength = arguments.length;
  /* eslint-disable-next-line prefer-rest-params */

  var extend = argLength > 2 && argLength > 3 ? arguments[3] : arguments[2];
  var extendFn;

  if (is_string_default()(extend)) {
    extend = extend.toLowerCase();

    if (extend === 'samevalue') {
      extendFn = same_value_x_esm;
    } else if (extend === 'samevaluezero') {
      extendFn = same_value_zero_x_esm;
    }
  }

  var fromIndex = 0;

  if (extendFn && (searchElement === 0 || is_nan_x_esm(searchElement))) {
    if (argLength > 3) {
      /* eslint-disable-next-line prefer-rest-params */
      fromIndex = calculate_from_index_x_esm(iterable, arguments[2]);

      if (fromIndex >= length) {
        return -1;
      }

      if (fromIndex < 0) {
        fromIndex = 0;
      }
    }

    if (fromIndex > 0) {
      return findIdxFrom(iterable, searchElement, fromIndex, extendFn);
    }

    return find_index_x_esm(iterable, function (element, index) {
      index_of_x_esm_newArrowCheck(this, _this);

      return index in iterable && extendFn(searchElement, element);
    }.bind(this));
  }

  if (argLength > 3 || argLength > 2 && index_of_x_esm_castBoolean(extendFn) === false) {
    /* eslint-disable-next-line prefer-rest-params */
    fromIndex = calculate_from_index_x_esm(iterable, arguments[2]);

    if (fromIndex >= length) {
      return -1;
    }

    if (fromIndex < 0) {
      fromIndex = 0;
    }
  }

  return pIndexOf.call(iterable, searchElement, fromIndex);
};

/* harmony default export */ var index_of_x_esm = (index_of_x_esm_indexOf);


// CONCATENATED MODULE: ./node_modules/array-includes-x/dist/array-includes-x.esm.js
function array_includes_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }









var nativeIncludes = typeof Array.prototype.includes === 'function' && Array.prototype.includes;
var array_includes_x_esm_isWorking;

if (nativeIncludes) {
  var array_includes_x_esm_arr;
  var array_includes_x_esm_res = attempt_x_esm.call(null, nativeIncludes, 'a');
  array_includes_x_esm_isWorking = array_includes_x_esm_res.threw;

  if (array_includes_x_esm_isWorking) {
    array_includes_x_esm_arr = {
      1: 'a',
      2: NaN,
      3: -0,
      length: 5
    };
    /* eslint-disable-next-line no-void */

    array_includes_x_esm_res = attempt_x_esm.call(array_includes_x_esm_arr, nativeIncludes, void 0, -1);
    array_includes_x_esm_isWorking = array_includes_x_esm_res.threw === false && array_includes_x_esm_res.value === true;
  }

  if (array_includes_x_esm_isWorking) {
    array_includes_x_esm_res = attempt_x_esm.call(array_includes_x_esm_arr, nativeIncludes, NaN);
    array_includes_x_esm_isWorking = array_includes_x_esm_res.threw === false && array_includes_x_esm_res.value === true;
  }

  if (array_includes_x_esm_isWorking) {
    array_includes_x_esm_res = attempt_x_esm.call(array_includes_x_esm_arr, nativeIncludes, 0);
    array_includes_x_esm_isWorking = array_includes_x_esm_res.threw === false && array_includes_x_esm_res.value === true;
  }

  if (array_includes_x_esm_isWorking) {
    var array_includes_x_esm_testArr = [];
    array_includes_x_esm_testArr.length = 2;
    array_includes_x_esm_testArr[1] = null;
    /* eslint-disable-next-line no-void */

    array_includes_x_esm_res = attempt_x_esm.call(array_includes_x_esm_testArr, nativeIncludes, void 0);
    array_includes_x_esm_isWorking = array_includes_x_esm_res.threw === false && array_includes_x_esm_res.value === true;
  }

  if (array_includes_x_esm_isWorking) {
    array_includes_x_esm_res = attempt_x_esm.call('abc', nativeIncludes, 'c');
    array_includes_x_esm_isWorking = array_includes_x_esm_res.threw === false && array_includes_x_esm_res.value === true;
  }

  if (array_includes_x_esm_isWorking) {
    array_includes_x_esm_res = attempt_x_esm.call(function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    }('a', 'b', 'c'), nativeIncludes, 'c');
    array_includes_x_esm_isWorking = array_includes_x_esm_res.threw === false && array_includes_x_esm_res.value === true;
  }
}
/**
 * This method determines whether an array includes a certain element,
 * returning true or false as appropriate.
 *
 * @param {Array} array - The array to search.
 * @throws {TypeError} If `array` is `null` or `undefined`.
 * @param {*} searchElement - Element to locate in the `array`.
 * @param {number} [fromIndex] - The position in this array at which to begin
 *  searching for searchElement. A negative value searches from the index of
 *  array.length + fromIndex by asc. Defaults to 0.
 * @returns {boolean} `true` if searched element is included; otherwise `false`.
 */


var $includes;

if (array_includes_x_esm_isWorking) {
  $includes = function includes(array, searchElement) {
    var args = [searchElement];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return nativeIncludes.apply(array, args);
  };
} else {
  /*
   * This method returns an index in the array, if an element in the array
   * satisfies the provided testing function. Otherwise -1 is returned.
   *
   * @private
   * @param {Array} object - The array to search.
   * @param {*} searchElement - Element to locate in the array.
   * @param {number} fromIndex - The index to start the search at.
   * @returns {number} Returns index of found element, otherwise -1.
   */
  var array_includes_x_esm_findIdxFrom = function findIndexFrom(object, searchElement, fromIndex) {
    var fIdx = fromIndex;
    var length = to_length_x_esm(object.length);

    while (fIdx < length) {
      if (same_value_zero_x_esm(object[fIdx], searchElement)) {
        return fIdx;
      }

      fIdx += 1;
    }

    return -1;
  };

  $includes = function includes(array, searchElement) {
    var _this = this;

    var object = to_object_x_esm(array);
    var iterable = split_if_boxed_bug_x_esm(object);
    var length = to_length_x_esm(iterable.length);

    if (length < 1) {
      return -1;
    }

    if (typeof searchElement === 'undefined') {
      /* eslint-disable-next-line prefer-rest-params */
      var fromIndex = calculate_from_index_x_esm(iterable, arguments[2]);

      if (fromIndex >= length) {
        return -1;
      }

      if (fromIndex < 0) {
        fromIndex = 0;
      }

      if (fromIndex > 0) {
        return array_includes_x_esm_findIdxFrom(iterable, searchElement, fromIndex) > -1;
      }

      return find_index_x_esm(iterable, function (element) {
        array_includes_x_esm_newArrowCheck(this, _this);

        return same_value_zero_x_esm(searchElement, element);
      }.bind(this)) > -1;
    }
    /* eslint-disable-next-line prefer-rest-params */


    return index_of_x_esm(iterable, searchElement, arguments[2], 'samevaluezero') > -1;
  };
}

var inc = $includes;
/* harmony default export */ var array_includes_x_esm = (inc);


// CONCATENATED MODULE: ./node_modules/object-assign-x/dist/object-assign-x.esm.js
function object_assign_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }











var object_assign_x_esm_EMPTY_STRING = '';
var object_assign_x_esm_StringCtr = object_assign_x_esm_EMPTY_STRING.constructor;
var fromCharCode = object_assign_x_esm_StringCtr.fromCharCode;
var object_assign_x_esm_castObject = {}.constructor;
var nAssign = object_assign_x_esm_castObject.assign;
var nativeAssign = is_function_x_esm(nAssign) && nAssign;

var workingNativeAssign = function nativeWorks() {
  var obj = {};
  var res = attempt_x_esm(nativeAssign, obj, {
    0: 1
  }, {
    1: 2
  });
  return res.threw === false && res.value === obj && object_keys_x_esm(obj).length === 2 && obj[0] === 1 && obj[1] === 2;
};

var lacksProperEnumerationOrder = function enumOrder() {
  var _this = this;

  // https://bugs.chromium.org/p/v8/issues/detail?id=4118
  var test1 = object_assign_x_esm_castObject('abc');
  test1[5] = 'de';

  if (get_own_property_names_x_esm(test1)[0] === '5') {
    return true;
  }

  var strNums = '0123456789'; // https://bugs.chromium.org/p/v8/issues/detail?id=3056

  var test2 = array_reduce_x_esm(strNums.split(object_assign_x_esm_EMPTY_STRING), function (acc, ignore, index) {
    object_assign_x_esm_newArrowCheck(this, _this);

    acc["_".concat(fromCharCode(index))] = index;
    return acc;
  }.bind(this), {});
  var order = array_reduce_x_esm(get_own_property_names_x_esm(test2), function (acc, name) {
    object_assign_x_esm_newArrowCheck(this, _this);

    return acc + test2[name];
  }.bind(this), object_assign_x_esm_EMPTY_STRING);

  if (order !== strNums) {
    return true;
  } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


  var letters = 'abcdefghijklmnopqrst';
  var test3 = array_reduce_x_esm(letters.split(object_assign_x_esm_EMPTY_STRING), function (acc, letter) {
    object_assign_x_esm_newArrowCheck(this, _this);

    acc[letter] = letter;
    return acc;
  }.bind(this), {});
  var result = attempt_x_esm(nativeAssign, {}, test3);
  return result.threw === false && object_keys_x_esm(result.value).join(object_assign_x_esm_EMPTY_STRING) !== letters;
};

var assignHasPendingExceptions = function exceptions() {
  if (is_function_x_esm(object_assign_x_esm_castObject.preventExtensions) === false) {
    return false;
  } // Firefox 37 still has "pending exception" logic in its Object.assign implementation,
  // which is 72% slower than our shim, and Firefox 40's native implementation.


  var result = attempt_x_esm(object_assign_x_esm_castObject.preventExtensions, {
    1: 2
  });

  if (result.threw || is_object_like_x_esm(result.value) === false) {
    return false;
  }

  var thrower = result.value;
  result = attempt_x_esm(nativeAssign, thrower, 'xy');
  return result.threw ? thrower[1] === 'y' : false;
};

var shouldImplement = function getShouldImplement() {
  if (nativeAssign === false) {
    return true;
  }

  if (workingNativeAssign() === false) {
    return true;
  }

  if (lacksProperEnumerationOrder()) {
    return true;
  }

  return assignHasPendingExceptions();
}();
/**
 * This method is used to copy the values of all enumerable own properties from
 * one or more source objects to a target object. It will return the target object.
 *
 * @param {*} target - The target object.
 * @param {*} [...source] - The source object(s).
 * @throws {TypeError} If target is null or undefined.
 * @returns {object} The target object.
 */


var $assign;

if (shouldImplement) {
  var object_assign_x_esm_concat = [].concat; // 19.1.3.1

  $assign = function assign(target) {
    var _this2 = this;

    return array_reduce_x_esm(
    /* eslint-disable-next-line prefer-rest-params */
    array_slice_x_esm(arguments, 1), function (tgt, source) {
      var _this3 = this;

      object_assign_x_esm_newArrowCheck(this, _this2);

      if (is_nil_x_esm(source)) {
        return tgt;
      }

      var object = object_assign_x_esm_castObject(source);
      return array_reduce_x_esm(object_assign_x_esm_concat.call(object_keys_x_esm(object), get_own_enumerable_property_symbols_x_esm(object)), function (tar, key) {
        object_assign_x_esm_newArrowCheck(this, _this3);

        tar[key] = object[key];
        return tar;
      }.bind(this), tgt);
    }.bind(this), to_object_x_esm(target));
  };
} else {
  $assign = nativeAssign;
}

var object_assign_x_esm_assign = $assign;
/* harmony default export */ var object_assign_x_esm = (object_assign_x_esm_assign);


// CONCATENATED MODULE: ./node_modules/string-pad-start-x/dist/string-pad-start-x.esm.js



var string_pad_start_x_esm_EMPTY_STRING = '';
var string_pad_start_x_esm_slice = string_pad_start_x_esm_EMPTY_STRING.slice;
var string_pad_start_x_esm_SPACE = ' '; // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * This method pads the current string with another string (repeated, if needed)
 * so that the resulting string reaches the given length. The padding is applied
 * from the start (left) of the current string.
 *
 * @param {string} string - The string to pad.
 * @throws {TypeError} If target is null or undefined.
 * @param {number} targetLength - The length of the resulting string once the
 *  current string has been padded. If the value is lower than the current
 *  string's length, the current string will be returned as is.
 * @param {string} [padString] - The string to pad the current string with. If
 *  this string is too long to stay within the target length, it will be
 *  truncated and the left-most part will be applied. The default value for this
 *  parameter is " " (U+0020).
 * @returns {string} A String of the specified length with the pad string
 *  applied from the start.
 */
// eslint-enable jsdoc/check-param-names

var string_pad_start_x_esm_padStart = function padStart(string, targetLength) {
  var str = to_string_x_esm(require_object_coercible_x_esm(string));
  var stringLength = to_length_x_esm(str.length);
  /* eslint-disable-next-line prefer-rest-params,no-void */

  var fillString = arguments.length > 2 ? arguments[2] : void 0;
  var filler = typeof fillString === 'undefined' ? string_pad_start_x_esm_EMPTY_STRING : to_string_x_esm(fillString);

  if (filler === string_pad_start_x_esm_EMPTY_STRING) {
    filler = string_pad_start_x_esm_SPACE;
  }

  var intMaxLength = to_length_x_esm(targetLength);

  if (intMaxLength <= stringLength) {
    return str;
  }

  var fillLen = intMaxLength - stringLength;

  while (filler.length < fillLen) {
    var fLen = filler.length;
    var remainingCodeUnits = fillLen - fLen;
    filler += fLen > remainingCodeUnits ? string_pad_start_x_esm_slice.call(filler, 0, remainingCodeUnits) : filler;
  }

  var truncatedStringFiller = filler.length > fillLen ? string_pad_start_x_esm_slice.call(filler, 0, fillLen) : filler;
  return truncatedStringFiller + str;
};

/* harmony default export */ var string_pad_start_x_esm = (string_pad_start_x_esm_padStart);


// CONCATENATED MODULE: ./node_modules/to-iso-string-x/dist/to-iso-string-x.esm.js






var nativeToISOString = typeof Date.prototype.toISOString === 'function' && Date.prototype.toISOString;
var to_iso_string_x_esm_isWorking;

if (nativeToISOString) {
  var to_iso_string_x_esm_res = attempt_x_esm.call(new Date(0), nativeToISOString);
  to_iso_string_x_esm_isWorking = to_iso_string_x_esm_res.threw === false && to_iso_string_x_esm_res.value === '1970-01-01T00:00:00.000Z';

  if (to_iso_string_x_esm_isWorking) {
    to_iso_string_x_esm_res = attempt_x_esm.call(new Date(-62198755200000), nativeToISOString);
    to_iso_string_x_esm_isWorking = to_iso_string_x_esm_res.threw === false && to_iso_string_x_esm_res.value.indexOf('-000001') > -1;
  }

  if (to_iso_string_x_esm_isWorking) {
    to_iso_string_x_esm_res = attempt_x_esm.call(new Date(-1), nativeToISOString);
    to_iso_string_x_esm_isWorking = to_iso_string_x_esm_res.threw === false && to_iso_string_x_esm_res.value === '1969-12-31T23:59:59.999Z';
  }
}
/**
 * This method returns a string in simplified extended ISO format (ISO 8601),
 * which is always 24 or 27 characters long (YYYY-MM-DDTHH:mm:ss.sssZ or
 * ±YYYYYY-MM-DDTHH:mm:ss.sssZ, respectively). The timezone is always zero UTC
 * offset, as denoted by the suffix "Z".
 *
 * @param {object} date - A Date object.
 * @throws {TypeError} If date is not a Date object.
 * @throws {RangeError} If date is invalid.
 * @returns {string} Given date in the ISO 8601 format according to universal time.
 */


var $toISOString;

if (to_iso_string_x_esm_isWorking) {
  $toISOString = function toISOString(date) {
    return nativeToISOString.call(date);
  };
} else {
  var join = Array.prototype.join;

  $toISOString = function toISOString(date) {
    if (is_date_object_default()(date) === false) {
      throw new TypeError('toISOString called on incompatible receiver.');
    }

    if (is_finite_x_esm(date) === false || is_finite_x_esm(date.getTime()) === false) {
      // Adope Photoshop requires the second check.
      throw new RangeError('toISOString called on non-finite value.');
    }

    var year = date.getUTCFullYear();
    var month = date.getUTCMonth(); // see https://github.com/es-shims/es5-shim/issues/111

    /* eslint-disable-next-line no-bitwise */

    year += month / 12 >> 0; // floor

    month = (month % 12 + 12) % 12; // the date time string format is specified in 15.9.1.15.

    var parts = [month + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()];
    var sign;

    if (year < 0) {
      sign = '-';
    } else if (year > 9999) {
      sign = '+';
    } else {
      sign = '';
    }

    year = sign + string_pad_start_x_esm(Math.abs(year), sign ? 6 : 4, '0');
    var result = array_map_x_esm(parts, function _mapper(item) {
      // pad months, days, hours, minutes, and seconds to have two digits.
      return string_pad_start_x_esm(item, 2, '0');
    });
    var dateStr = "".concat(year, "-").concat(join.call(array_slice_x_esm(result, 0, 2), '-')); // pad milliseconds to have three digits.

    var msStr = string_pad_start_x_esm(date.getUTCMilliseconds(), 3, '0');
    var timeStr = "".concat(join.call(array_slice_x_esm(result, 2), ':'), ".").concat(msStr);
    return "".concat(dateStr, "T").concat(timeStr, "Z");
  };
}

var tis = $toISOString;
/* harmony default export */ var to_iso_string_x_esm = (tis);


// CONCATENATED MODULE: ./node_modules/is-surrogate-pair-x/dist/is-surrogate-pair-x.esm.js

var is_surrogate_pair_x_esm_ref = '',
    charCodeAt = is_surrogate_pair_x_esm_ref.charCodeAt;
/**
 * Tests if the two character arguments combined are a valid UTF-16
 * surrogate pair.
 *
 * @param {*} char1 - The character combination, or if `char2` is supplied then
 *  the first character of a suspected surrogate pair.
 * @param {*} [char2] - The second character of a suspected surrogate pair.
 * @returns {boolean} Returns true if the two characters create a valid
 *  'UTF-16' surrogate pair; otherwise false.
 */

var is_surrogate_pair_x_esm_isSurrogatePair = function isSurrogatePair(char1, char2) {
  var argsLength = arguments.length;

  if (argsLength < 1) {
    return false;
  }

  var first;
  var second;

  if (argsLength === 1) {
    if (is_string_default()(char1) && char1.length === 2) {
      first = charCodeAt.call(char1, 0);
      second = charCodeAt.call(char1, 1);
    } else {
      return false;
    }
  } else if (argsLength > 1) {
    if (is_string_default()(char1) === false || char1.length !== 1 || is_string_default()(char2) === false || char2.length !== 1) {
      return false;
    }

    first = charCodeAt.call(char1, 0);
    second = charCodeAt.call(char2, 0);
  }

  return first >= 0xd800 && first <= 0xdbff && second >= 0xdc00 && second <= 0xdfff;
};

/* harmony default export */ var is_surrogate_pair_x_esm = (is_surrogate_pair_x_esm_isSurrogatePair);


// CONCATENATED MODULE: ./node_modules/array-reduce-right-x/dist/array-reduce-right-x.esm.js
var array_reduce_right_x_esm_this = undefined;

function array_reduce_right_x_esm_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { array_reduce_right_x_esm_typeof = function _typeof(obj) { return typeof obj; }; } else { array_reduce_right_x_esm_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return array_reduce_right_x_esm_typeof(obj); }

function array_reduce_right_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }






var ArrayCtr = [].constructor;
var array_reduce_right_x_esm_castObject = {}.constructor;
var nativeReduceR = typeof ArrayCtr.prototype.reduceRight === 'function' && ArrayCtr.prototype.reduceRight; // ES5 15.4.4.22
// http://es5.github.com/#x15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight

var array_reduce_right_x_esm_isWorking;

if (nativeReduceR) {
  array_reduce_right_x_esm_isWorking = attempt_x_esm.call([], nativeReduceR, function (acc) {
    array_reduce_right_x_esm_newArrowCheck(this, array_reduce_right_x_esm_this);

    return acc;
  }.bind(undefined)).threw;
  var array_reduce_right_x_esm_res;

  if (array_reduce_right_x_esm_isWorking) {
    array_reduce_right_x_esm_res = attempt_x_esm.call(array_reduce_right_x_esm_castObject('abc'), nativeReduceR, function (acc, c) {
      array_reduce_right_x_esm_newArrowCheck(this, array_reduce_right_x_esm_this);

      return acc + c;
    }.bind(undefined), 'x');
    array_reduce_right_x_esm_isWorking = array_reduce_right_x_esm_res.threw === false && array_reduce_right_x_esm_res.value === 'xcba';
  }

  if (array_reduce_right_x_esm_isWorking) {
    array_reduce_right_x_esm_res = attempt_x_esm.call(function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    }(1, 2, 3), nativeReduceR, function (acc, arg) {
      array_reduce_right_x_esm_newArrowCheck(this, array_reduce_right_x_esm_this);

      return acc + arg;
    }.bind(undefined), 1);
    array_reduce_right_x_esm_isWorking = array_reduce_right_x_esm_res.threw === false && array_reduce_right_x_esm_res.value === 7;
  }

  if (array_reduce_right_x_esm_isWorking) {
    array_reduce_right_x_esm_res = attempt_x_esm.call({
      0: 1,
      1: 2,
      3: 3,
      4: 4,
      length: 4
    }, nativeReduceR, function (acc, arg) {
      array_reduce_right_x_esm_newArrowCheck(this, array_reduce_right_x_esm_this);

      return acc + arg;
    }.bind(undefined), 2);
    array_reduce_right_x_esm_isWorking = array_reduce_right_x_esm_res.threw === false && array_reduce_right_x_esm_res.value === 8;
  }

  if (array_reduce_right_x_esm_isWorking) {
    var array_reduce_right_x_esm_doc = typeof document !== 'undefined' && document;

    if (array_reduce_right_x_esm_doc) {
      var array_reduce_right_x_esm_fragment = array_reduce_right_x_esm_doc.createDocumentFragment();
      var array_reduce_right_x_esm_div = array_reduce_right_x_esm_doc.createElement('div');
      array_reduce_right_x_esm_fragment.appendChild(array_reduce_right_x_esm_div);
      array_reduce_right_x_esm_res = attempt_x_esm.call(array_reduce_right_x_esm_fragment.childNodes, nativeReduceR, function (acc, node) {
        array_reduce_right_x_esm_newArrowCheck(this, array_reduce_right_x_esm_this);

        acc[acc.length] = node;
        return acc;
      }.bind(undefined), []);
      array_reduce_right_x_esm_isWorking = array_reduce_right_x_esm_res.threw === false && array_reduce_right_x_esm_res.value.length === 1 && array_reduce_right_x_esm_res.value[0] === array_reduce_right_x_esm_div;
    }
  }

  if (array_reduce_right_x_esm_isWorking) {
    array_reduce_right_x_esm_res = attempt_x_esm.call('ab', nativeReduceR, function (_, __, ___, list) {
      array_reduce_right_x_esm_newArrowCheck(this, array_reduce_right_x_esm_this);

      return list;
    }.bind(undefined));
    array_reduce_right_x_esm_isWorking = array_reduce_right_x_esm_res.threw === false && array_reduce_right_x_esm_typeof(array_reduce_right_x_esm_res.value) === 'object';
  }
}
/**
 * This method applies a function against an accumulator and each value of the
 * array (from right-to-left) to reduce it to a single value..
 *
 * @param {Array} array - The array to iterate over.
 * @param {Function} callBack - Function to execute for each element.
 * @param {*} [initialValue] - Value to use as the first argument to the first
 *  call of the callback. If no initial value is supplied, the first element in
 *  the array will be used. Calling reduceRight on an empty array without an initial
 *  value is an error.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @throws {TypeError} If called on an empty array without an initial value.
 * @returns {*} The value that results from the reduction.
 */


var $reduceRight;

if (nativeReduceR && array_reduce_right_x_esm_isWorking) {
  $reduceRight = function reduceRight(array, callBack
  /* , initialValue */
  ) {
    var args = [callBack];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return nativeReduceR.apply(array, args);
  };
} else {
  $reduceRight = function reduceRight(array, callBack
  /* , initialValue */
  ) {
    var object = to_object_x_esm(array); // If no callback function or if callback is not a callable function

    assert_is_function_x_esm(callBack);
    var iterable = split_if_boxed_bug_x_esm(object);
    var length = to_length_x_esm(iterable.length);
    var argsLength = arguments.length; // no value to return if no initial value, empty array

    if (length === 0 && argsLength < 3) {
      throw new TypeError('reduceRight of empty array with no initial value');
    }

    var result;
    var i = length - 1;

    if (argsLength > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      result = arguments[2];
    } else {
      do {
        if (i in iterable) {
          result = iterable[i];
          i -= 1;
          break;
        } // if array contains no values, no initial value to return


        i -= 1;

        if (i < 0) {
          throw new TypeError('reduceRight of empty array with no initial value');
        }
      } while (true);
      /* eslint-disable-line no-constant-condition */

    }

    while (i >= 0) {
      if (i in iterable) {
        result = callBack(result, iterable[i], i, object);
      }

      i -= 1;
    }

    return result;
  };
}

var rr = $reduceRight;
/* harmony default export */ var array_reduce_right_x_esm = (rr);


// CONCATENATED MODULE: ./node_modules/big-counter-x/dist/big-counter-x.esm.js



/** @type {BooleanConstructor} */

var big_counter_x_esm_castBoolean = true.constructor;

var reducer = function _reducer(acc, digit) {
  return acc + digit;
};
/**
 * Serialise the counter´s current value.
 *
 * @private
 * @this BigCounter
 * @returns {string} A string representation of an integer.
 */


var counterToString = function ToString() {
  return array_reduce_right_x_esm(this.count, reducer, '');
};
/**
 * Incremental integer counter. Counts from `0` to very big integers.
 * Javascript´s number type allows you to count in integer steps
 * from `0` to `9007199254740991`. As of ES5, Strings can contain
 * approximately 65000 characters and ES6 is supposed to handle
 * the `MAX_SAFE_INTEGER` (though I don´t believe any environments supports
 * this). This counter represents integer values as strings and can therefore
 * count in integer steps from `0` to the maximum string length (that´s some
 * 65000 digits). In the lower range, upto `9007199254740991`, the strings can
 * be converted to safe Javascript integers `Number(value)` or `+value`. This
 * counter is great for any applications that need a really big count
 * represented as a string, (an ID string).
 *
 * @class
 * @property {Array<number>} count - A representation of a big number.
 */


var big_counter_x_esm_BigCounter = function BigCounter() {
  if (big_counter_x_esm_castBoolean(this) === false || this instanceof BigCounter === false) {
    throw new TypeError('Constructor BigCounter requires "new"');
  }

  object_define_properties_x_esm(this, {
    count: {
      value: [0]
    }
  });
};

object_define_properties_x_esm(big_counter_x_esm_BigCounter.prototype, {
  /**
   * Gets the counter´s current value.
   *
   * @function
   * @returns {string} A string representation of an integer.
   */
  get: {
    value: counterToString
  },

  /**
   * Increments the counter´s value by `1`.
   *
   * @function
   * @returns {object} The counter object.
   */
  next: {
    value: function next() {
      var clone = array_slice_x_esm(this.count);
      this.count.length = 0;
      var length = clone.length;
      var howMany = length > 0 ? length : 1;
      var carry = 0;
      var index = 0;

      while (index < howMany || carry) {
        var zi = carry + (clone[index] || 0) + (index === 0);
        this.count[this.count.length] = zi % 10;
        /* eslint-disable-next-line no-bitwise */

        carry = zi / 10 >> 0; // floor

        index += 1;
      }

      return this;
    }
  },

  /**
   * Resets the counter back to `0`.
   *
   * @function
   * @returns {object} The counter object.
   */
  reset: {
    value: function reset() {
      this.count.length = 1;
      this.count[0] = 0;
      return this;
    }
  },

  /**
   * Gets the counter´s current value.
   *
   * @function
   * @returns {string} A string representation of an integer.
   */
  toJSON: {
    value: counterToString
  },

  /**
   * Gets the counter´s current value.
   *
   * @function
   * @returns {string} A string representation of an integer.
   */
  toString: {
    value: counterToString
  },

  /**
   * Gets the counter´s current value.
   *
   * @function
   * @returns {string} A string representation of an integer.
   */
  valueOf: {
    value: counterToString
  }
});
/* harmony default export */ var big_counter_x_esm = (big_counter_x_esm_BigCounter);


// CONCATENATED MODULE: ./node_modules/object-create-x/dist/object-create-x.esm.js
function object_create_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

function object_create_x_esm_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { object_create_x_esm_typeof = function _typeof(obj) { return typeof obj; }; } else { object_create_x_esm_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return object_create_x_esm_typeof(obj); }




/** @type {BooleanConstructor} */

var object_create_x_esm_castBoolean = true.constructor;
var nativeCreate = typeof Object.create === 'function' && Object.create;
var object_create_x_esm_isWorking;

if (nativeCreate) {
  var object_create_x_esm_res = attempt_x_esm(nativeCreate, null);
  object_create_x_esm_isWorking = object_create_x_esm_res.threw === false && object_create_x_esm_res.value && object_create_x_esm_typeof(object_create_x_esm_res.value) === 'object';

  if (object_create_x_esm_isWorking) {
    /* eslint-disable-next-line guard-for-in,no-restricted-syntax,no-unused-vars */
    // noinspection LoopStatementThatDoesntLoopJS
    for (var _ in object_create_x_esm_res.value) {
      object_create_x_esm_isWorking = false;
      break;
    }
  }

  if (object_create_x_esm_isWorking) {
    object_create_x_esm_res = attempt_x_esm(nativeCreate, null, {
      test: {
        value: true
      }
    });
    object_create_x_esm_isWorking = object_create_x_esm_res.threw === false && object_create_x_esm_res.value && object_create_x_esm_typeof(object_create_x_esm_res.value) === 'object' && object_create_x_esm_res.value.test === true;
  }

  if (object_create_x_esm_isWorking) {
    // Shape - superclass
    var Shape = function Shape() {
      // noinspection JSUnusedGlobalSymbols
      this.x = 0; // noinspection JSUnusedGlobalSymbols

      this.y = 0;
    }; // superclass method


    Shape.prototype.move = function move(x, y) {
      // noinspection JSUnusedGlobalSymbols
      this.x += x; // noinspection JSUnusedGlobalSymbols

      this.y += y;
      return 'Shape moved.';
    }; // Rectangle - subclass


    var Rectangle = function Rectangle() {
      Shape.call(this); // call super constructor.
    };

    object_create_x_esm_res = attempt_x_esm(nativeCreate, Shape.prototype);
    object_create_x_esm_isWorking = object_create_x_esm_res.threw === false && object_create_x_esm_res.value && object_create_x_esm_typeof(object_create_x_esm_res.value) === 'object';

    if (object_create_x_esm_isWorking) {
      // subclass extends superclass
      Rectangle.prototype = object_create_x_esm_res.value;
      Rectangle.prototype.constructor = Rectangle;
      var rect = new Rectangle();
      object_create_x_esm_isWorking = rect instanceof Rectangle;

      if (object_create_x_esm_isWorking) {
        object_create_x_esm_isWorking = rect instanceof Shape;
      }

      if (object_create_x_esm_isWorking) {
        object_create_x_esm_isWorking = rect.move(1, 1) === 'Shape moved.';
      }
    }
  }
}
/**
 * This method method creates a new object with the specified prototype object and properties.
 *
 * @param {*} prototype - The object which should be the prototype of the newly-created object.
 * @param {*} [properties] - If specified and not undefined, an object whose enumerable own properties
 * (that is, those properties defined upon itself and not enumerable properties along its prototype chain)
 * specify property descriptors to be added to the newly-created object, with the corresponding property names.
 * @throws {TypeError} If the properties parameter isn't null or an object.
 * @returns {boolean} A new object with the specified prototype object and properties.
 */


var $create;

if (object_create_x_esm_isWorking) {
  $create = nativeCreate;
} else {
  var object_create_x_esm_doc = typeof document !== 'undefined' && document; // Contributed by Brandon Benvie, October, 2012

  var createEmpty;
  var supportsProto = {
    __proto__: null
  } instanceof Object === false; // the following produces false positives
  // in Opera Mini => not a reliable check
  // Object.prototype.__proto__ === null

  if (supportsProto || object_create_x_esm_castBoolean(object_create_x_esm_doc) === false) {
    createEmpty = function $createEmpty() {
      return {
        __proto__: null
      };
    };
  } else {
    // Check for document.domain and active x support
    // No need to use active x approach when document.domain is not set
    // see https://github.com/es-shims/es5-shim/issues/150
    // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
    var shouldUseActiveX = function _shouldUseActiveX() {
      var _this = this;

      // return early if document.domain not set
      if (object_create_x_esm_castBoolean(object_create_x_esm_doc.domain) === false) {
        return false;
      }

      var result = attempt_x_esm(function () {
        object_create_x_esm_newArrowCheck(this, _this);

        /* eslint-disable-next-line no-undef */
        return new ActiveXObject('htmlfile');
      }.bind(this));
      return result.threw === false && Boolean(result.value);
    }; // This supports IE8 when document.domain is used
    // see https://github.com/es-shims/es5-shim/issues/150
    // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346


    var getEmptyViaActiveX = function _getEmptyViaActiveX() {
      /* eslint-disable-next-line no-undef */
      var xDoc = new ActiveXObject('htmlfile');
      /* eslint-disable-next-line no-useless-escape,prettier/prettier */

      xDoc.write('<script><\/script>');
      xDoc.close(); // noinspection JSUnresolvedVariable

      var empty = xDoc.parentWindow.Object.prototype;
      xDoc = null;
      return empty;
    }; // The original implementation using an iframe
    // before the activex approach was added
    // see https://github.com/es-shims/es5-shim/issues/150


    var getEmptyViaIFrame = function _getEmptyViaIFrame() {
      var iframe = object_create_x_esm_doc.createElement('iframe');
      iframe.style.display = 'none';
      /* eslint-disable-next-line no-script-url */

      iframe.src = 'javascript:';
      var parent = object_create_x_esm_doc.body || object_create_x_esm_doc.documentElement;
      parent.appendChild(iframe);
      var empty = iframe.contentWindow.Object.prototype;
      parent.removeChild(iframe);
      iframe = null;
      return empty;
    }; // In old IE __proto__ can't be used to manually set `null`, nor does
    // any other method exist to make an object that inherits from nothing,
    // aside from Object.prototype itself. Instead, create a new global
    // object and *steal* its Object.prototype and strip it bare. This is
    // used as the prototype to create nullary objects.


    createEmpty = function $createEmpty() {
      // Determine which approach to use
      // see https://github.com/es-shims/es5-shim/issues/150
      var empty = shouldUseActiveX() ? getEmptyViaActiveX() : getEmptyViaIFrame();
      delete empty.constructor;
      delete empty.hasOwnProperty;
      delete empty.propertyIsEnumerable;
      delete empty.isPrototypeOf;
      delete empty.toLocaleString;
      delete empty.toString;
      delete empty.valueOf;
      /* eslint-disable-next-line lodash/prefer-noop */

      var E = function Empty() {};

      E.prototype = empty; // short-circuit future calls

      createEmpty = function $$createEmpty() {
        return new E();
      };

      return new E();
    };
  }

  $create = function create(prototype, properties) {
    var object;
    /* eslint-disable-next-line lodash/prefer-noop */

    var T = function Type() {}; // An empty constructor.


    if (prototype === null) {
      object = createEmpty();
    } else {
      if (is_primitive_default()(prototype)) {
        // In the native implementation `parent` can be `null`
        // OR *any* `instanceof Object`  (Object|Function|Array|RegExp|etc)
        // Use `typeof` tho, b/c in old IE, DOM elements are not `instanceof Object`
        // like they are in modern browsers. Using `Object.create` on DOM elements
        // is...err...probably inappropriate, but the native version allows for it.
        throw new TypeError('Object prototype may only be an Object or null'); // same msg as Chrome
      }

      T.prototype = prototype;
      object = new T(); // IE has no built-in implementation of `Object.getPrototypeOf`
      // neither `__proto__`, but this manually setting `__proto__` will
      // guarantee that `Object.getPrototypeOf` will work as expected with
      // objects created using `Object.create`

      /* eslint-disable-next-line no-proto */

      object.__proto__ = prototype;
    }

    if (typeof properties !== 'undefined') {
      object_define_properties_x_esm(object, properties);
    }

    return object;
  };
}

var object_create_x_esm_create = $create;
/* harmony default export */ var object_create_x_esm = (object_create_x_esm_create);


// CONCATENATED MODULE: ./node_modules/collections-x/dist/collections-x.esm.js
var collections_x_esm_this = undefined;

function collections_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

function collections_x_esm_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { collections_x_esm_typeof = function _typeof(obj) { return typeof obj; }; } else { collections_x_esm_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return collections_x_esm_typeof(obj); }























/** @type {BooleanConstructor} */

var collections_x_esm_castBoolean = true.constructor;
/** @type {Function} */

var setPrototypeOf = {}.constructor.setPrototypeOf;
/* eslint-disable-next-line compat/compat */

var hasRealSymbolIterator = has_symbol_support_x_esm && collections_x_esm_typeof(Symbol.iterator) === 'symbol';
/* eslint-disable-next-line compat/compat */

var hasFakeSymbolIterator = (typeof Symbol === "undefined" ? "undefined" : collections_x_esm_typeof(Symbol)) === 'object' && typeof Symbol.iterator === 'string';
/**
 * The iterator identifier that is in use.
 *
 * Type {Symbol|string}.
 */

var $symIt;

if (hasRealSymbolIterator || hasFakeSymbolIterator) {
  /* eslint-disable-next-line compat/compat */
  $symIt = Symbol.iterator;
  /* eslint-disable-next-line no-use-extend-native/no-use-extend-native */
} else if (is_function_x_esm([]['_es6-shim iterator_'])) {
  $symIt = '_es6-shim iterator_';
} else {
  $symIt = '@@iterator';
}

var symIt = $symIt;

var isNumberType = function isNumberType(value) {
  return typeof value === 'number';
};
/**
 * Detect an iterator function.
 *
 * @private
 * @param {*} iterable - Value to detect iterator function.
 * @returns {Symbol|string|undefined} The iterator property identifier.
 */


var collections_x_esm_getSymbolIterator = function getSymbolIterator(iterable) {
  if (is_nil_x_esm(iterable) === false) {
    if ((hasRealSymbolIterator || hasFakeSymbolIterator) && iterable[$symIt]) {
      return $symIt;
    }

    if (iterable['_es6-shim iterator_']) {
      return '_es6-shim iterator_';
    }

    if (iterable['@@iterator']) {
      return '@@iterator';
    }
  }
  /* eslint-disable-next-line no-void */


  return void 0;
};
/**
 * If an iterable object is passed, all of its elements will be added to the
 * new Map/Set, null is treated as undefined.
 *
 * @private
 * @param {string} kind - Either 'map' or 'set'.
 * @param {object} context - The Map/Set object.
 * @param {*} iterable - Value to parsed.
 */


var collections_x_esm_parseIterable = function parseIterable(kind, context, iterable) {
  var symbolIterator = collections_x_esm_getSymbolIterator(iterable);

  if (kind === 'map') {
    object_define_property_x_esm(context, '[[value]]', {
      value: []
    });
  }

  object_define_properties_x_esm(context, {
    '[[changed]]': {
      value: false
    },
    '[[id]]': {
      value: new big_counter_x_esm()
    },
    '[[key]]': {
      value: []
    },
    '[[order]]': {
      value: []
    }
  });
  var next;
  var key;
  var indexof;

  if (iterable && is_function_x_esm(iterable[symbolIterator])) {
    var iterator = iterable[symbolIterator]();
    next = iterator.next();

    if (kind === 'map') {
      if (is_array_like_x_esm(next.value) === false || next.value.length < 2) {
        throw new TypeError("Iterator value ".concat(is_array_like_x_esm(next.value), " is not an entry object"));
      }
    }

    while (next.done === false) {
      key = kind === 'map' ? next.value[0] : next.value;
      indexof = index_of_x_esm(assert_is_object_x_esm(context)['[[key]]'], key, 'SameValueZero');

      if (indexof < 0) {
        if (kind === 'map') {
          context['[[value]]'].push(next.value[1]);
        }

        context['[[key]]'].push(key);
        context['[[order]]'].push(context['[[id]]'].get());
        context['[[id]]'].next();
      } else if (kind === 'map') {
        /* eslint-disable-next-line prefer-destructuring */
        context['[[value]]'][indexof] = next.value[1];
      }

      next = iterator.next();
    }
  }

  if (is_string_default()(iterable)) {
    if (kind === 'map') {
      throw new TypeError("Iterator value ".concat(iterable.charAt(0), " is not an entry object"));
    }

    next = 0;

    while (next < iterable.length) {
      var char1 = iterable.charAt(next);
      var char2 = iterable.charAt(next + 1);

      if (is_surrogate_pair_x_esm(char1, char2)) {
        key = char1 + char2;
        next += 1;
      } else {
        key = char1;
      }

      indexof = index_of_x_esm(assert_is_object_x_esm(context)['[[key]]'], key, 'SameValueZero');

      if (indexof < 0) {
        context['[[key]]'].push(key);
        context['[[order]]'].push(context['[[id]]'].get());
        context['[[id]]'].next();
      }

      next += 1;
    }
  } else if (is_array_like_x_esm(iterable)) {
    next = 0;

    while (next < iterable.length) {
      if (kind === 'map') {
        if (is_primitive_default()(iterable[next])) {
          throw new TypeError("Iterator value ".concat(is_array_like_x_esm(next.value), " is not an entry object"));
        }
        /* eslint-disable-next-line prefer-destructuring */


        key = iterable[next][0];
      } else {
        key = iterable[next];
      }

      key = kind === 'map' ? iterable[next][0] : iterable[next];
      indexof = index_of_x_esm(assert_is_object_x_esm(context)['[[key]]'], key, 'SameValueZero');

      if (indexof < 0) {
        if (kind === 'map') {
          context['[[value]]'].push(iterable[next][1]);
        }

        context['[[key]]'].push(key);
        context['[[order]]'].push(context['[[id]]'].get());
        context['[[id]]'].next();
      } else if (kind === 'map') {
        /* eslint-disable-next-line prefer-destructuring */
        context['[[value]]'][indexof] = iterable[next][1];
      }

      next += 1;
    }
  }

  object_define_property_x_esm(context, 'size', {
    value: context['[[key]]'].length,
    writable: true
  });
};
/**
 * The base forEach method executes a provided function once per each value
 * in the Map/Set object, in insertion order.
 *
 * @private
 * @param {string} kind - Either 'map' or 'set'.
 * @param {object} context - The Map/Set object.
 * @param {Function} callback - Function to execute for each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @returns {object} The Map/Set object.
 */


var collections_x_esm_baseForEach = function baseForEach(kind, context, callback, thisArg) {
  assert_is_object_x_esm(context);
  assert_is_function_x_esm(callback);
  var pointers = {
    index: 0,
    order: context['[[order]]'][0]
  };
  context['[[change]]'] = false;
  var length = context['[[key]]'].length;

  while (pointers.index < length) {
    if (has_own_property_x_esm(context['[[key]]'], pointers.index)) {
      var key = context['[[key]]'][pointers.index];
      var value = kind === 'map' ? context['[[value]]'][pointers.index] : key;
      callback.call(thisArg, value, key, context);
    }

    if (context['[[change]]']) {
      /* eslint-disable-next-line prefer-destructuring */
      length = context['[[key]]'].length;
      array_some_x_esm(context['[[order]]'], function _some1(id, count) {
        pointers.index = count;
        return id > pointers.order;
      });
      context['[[change]]'] = false;
    } else {
      pointers.index += 1;
    }

    pointers.order = context['[[order]]'][pointers.index];
  }

  return context;
};
/**
 * The base has method returns a boolean indicating whether an element with
 * the specified key/value exists in a Map/Set object or not.
 *
 * @private
 * @param {*} key - The key/value to test for presence in the Map/Set object.
 * @returns {boolean} Returns true if an element with the specified key/value
 *  exists in the Map/Set object; otherwise false.
 */


var baseHas = function has(key) {
  /* eslint-disable-next-line babel/no-invalid-this */
  return index_of_x_esm(assert_is_object_x_esm(this)['[[key]]'], key, 'SameValueZero') > -1;
};
/**
 * The base clear method removes all elements from a Map/Set object.
 *
 * @private
 * @param {string} kind - Either 'map' or 'set'.
 * @param {object} context - The Map/Set object.
 * @returns {object} The Map/Set object.
 */


var collections_x_esm_baseClear = function baseClear(kind, context) {
  assert_is_object_x_esm(context);
  context['[[id]]'].reset();
  context['[[change]]'] = true;
  context.size = 0;
  context['[[order]]'].length = 0;
  context['[[key]]'].length = 0;

  if (kind === 'map') {
    context['[[value]]'].length = 0;
  }

  return context;
};
/**
 * The base delete method removes the specified element from a Map/Set object.
 *
 * @private
 * @param {string} kind - Either 'map' or 'set'.
 * @param {object} context - The Map/Set object.
 * @param {*} key - The key/value of the element to remove from Map/Set object.
 * @returns {object} The Map/Set object.
 */


var collections_x_esm_baseDelete = function baseDelete(kind, context, key) {
  var indexof = index_of_x_esm(assert_is_object_x_esm(context)['[[key]]'], key, 'SameValueZero');
  var result = false;

  if (indexof > -1) {
    if (kind === 'map') {
      context['[[value]]'].splice(indexof, 1);
    }

    context['[[key]]'].splice(indexof, 1);
    context['[[order]]'].splice(indexof, 1);
    context['[[change]]'] = true;
    context.size = context['[[key]]'].length;
    result = true;
  }

  return result;
};
/**
 * The base set and add method.
 *
 * @private
 * @param {string} kind - Either 'map' or 'set'.
 * @param {object} context - The Map/Set object.
 * @param {*} key - The key or value of the element to add/set on the object.
 * @param {*} [value] - The value of the element to add to the Map object.
 * @returns {object} The Map/Set object.
 */


var baseAddSet = function _baseAddSet(kind, context, key, value) {
  var index = index_of_x_esm(assert_is_object_x_esm(context)['[[key]]'], key, 'SameValueZero');

  if (index > -1) {
    if (kind === 'map') {
      context['[[value]]'][index] = value;
    }
  } else {
    if (kind === 'map') {
      context['[[value]]'].push(value);
    }

    context['[[key]]'].push(key);
    context['[[order]]'].push(context['[[id]]'].get());
    context['[[id]]'].next();
    context['[[change]]'] = true;
    context.size = context['[[key]]'].length;
  }

  return context;
};
/**
 * An object is an iterator when it knows how to access items from a
 * collection one at a time, while keeping track of its current position
 * within that sequence. In JavaScript an iterator is an object that provides
 * a next() method which returns the next item in the sequence. This method
 * returns an object with two properties: done and value. Once created,
 * an iterator object can be used explicitly by repeatedly calling next().
 *
 * @private
 * @class
 * @param {object} context - The Set object.
 * @param {string} [iteratorKind] - Values are `value`, `key` or `key+value`.
 */


var SetIt = function SetIterator(context, iteratorKind) {
  object_define_properties_x_esm(this, {
    '[[IteratorHasMore]]': {
      value: true,
      writable: true
    },
    '[[Set]]': {
      value: assert_is_object_x_esm(context)
    },
    '[[SetIterationKind]]': {
      value: iteratorKind || 'value'
    },
    '[[SetNextIndex]]': {
      value: 0,
      writable: true
    }
  });
};
/**
 * Once initialized, the next() method can be called to access key-value
 * pairs from the object in turn.
 *
 * @private
 * @function next
 * @returns {object} Returns an object with two properties: done and value.
 */


object_define_property_x_esm(SetIt.prototype, 'next', {
  value: function next() {
    var context = assert_is_object_x_esm(this['[[Set]]']);
    var index = this['[[SetNextIndex]]'];
    var iteratorKind = this['[[SetIterationKind]]'];
    var more = this['[[IteratorHasMore]]'];
    var object;

    if (index < context['[[key]]'].length && more) {
      object = {
        done: false
      };

      if (iteratorKind === 'key+value') {
        object.value = [context['[[key]]'][index], context['[[key]]'][index]];
      } else {
        object.value = context['[[key]]'][index];
      }

      this['[[SetNextIndex]]'] += 1;
    } else {
      this['[[IteratorHasMore]]'] = false;
      object = {
        done: true,

        /* eslint-disable-next-line no-void */
        value: void 0
      };
    }

    return object;
  }
});
/**
 * The @@iterator property is the same Iterator object.
 *
 * @private
 * @function symIt
 * @memberof SetIterator.prototype
 * @returns {object} This Iterator object.
 */

object_define_property_x_esm(SetIt.prototype, $symIt, {
  value: function iterator() {
    return this;
  }
});
/**
 * This method returns a new Iterator object that contains the
 * values for each element in the Set object in insertion order.
 *
 * @private
 * @this Set
 * @returns {object} A new Iterator object.
 */

var setValuesIterator = function values() {
  return new SetIt(this);
}; // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * The Set object lets you store unique values of any type, whether primitive
 * values or object references.
 *
 * @class Set
 * @private
 * @param {*} [iterable] - If an iterable object is passed, all of its elements
 * will be added to the new Set. A null is treated as undefined.
 */
// eslint-enable jsdoc/check-param-names


var $SetObject = function Set() {
  if (collections_x_esm_castBoolean(this) === false || this instanceof $SetObject === false) {
    throw new TypeError("Constructor Set requires 'new'");
  }
  /* eslint-disable-next-line prefer-rest-params,no-void */


  collections_x_esm_parseIterable('set', this, arguments.length ? arguments[0] : void 0);
}; // noinspection JSValidateTypes


object_define_properties_x_esm($SetObject.prototype,
/** @lends $SetObject.prototype */
{
  /**
   * The add() method appends a new element with a specified value to the end
   * of a Set object.
   *
   * @param {*} value - Required. The value of the element to add to the Set
   *  object.
   * @returns {object} The Set object.
   */
  add: {
    value: function add(value) {
      return baseAddSet('set', this, value);
    }
  },

  /**
   * The clear() method removes all elements from a Set object.
   *
   * @returns {object} The Set object.
   */
  clear: {
    value: function clear() {
      return collections_x_esm_baseClear('set', this);
    }
  },

  /**
   * The delete() method removes the specified element from a Set object.
   *
   * @param {*} value - The value of the element to remove from the Set object.
   * @returns {boolean} Returns true if an element in the Set object has been
   *  removed successfully; otherwise false.
   */
  delete: {
    value: function de1ete(value) {
      return collections_x_esm_baseDelete('set', this, value);
    }
  },

  /**
   * The entries() method returns a new Iterator object that contains an
   * array of [value, value] for each element in the Set object, in
   * insertion order. For Set objects there is no key like in Map objects.
   * However, to keep the API similar to the Map object, each entry has the
   * same value for its key and value here, so that an array [value, value]
   * is returned.
   *
   * @function
   * @returns {object} A new Iterator object.
   */
  entries: {
    value: function entries() {
      return new SetIt(this, 'key+value');
    }
  },

  /**
   * The forEach() method executes a provided function once per each value
   * in the Set object, in insertion order.
   *
   * @param {Function} callback - Function to execute for each element.
   * @param {*} [thisArg] - Value to use as this when executing callback.
   * @returns {object} The Set object.
   */
  forEach: {
    value: function forEach(callback, thisArg) {
      return collections_x_esm_baseForEach('set', this, callback, thisArg);
    }
  },

  /**
   * The has() method returns a boolean indicating whether an element with the
   * specified value exists in a Set object or not.
   *
   * @function
   * @param {*} value - The value to test for presence in the Set object.
   * @returns {boolean} Returns true if an element with the specified value
   *  exists in the Set object; otherwise false.
   */
  has: {
    value: baseHas
  },

  /**
   * The keys() method is an alias for the `values` method (for similarity
   * with Map objects); it behaves exactly the same and returns values of Set elements.
   *
   * @function
   * @returns {object} A new Iterator object.
   */
  keys: {
    value: setValuesIterator
  },

  /**
   * The value of size is an integer representing how many entries the Set
   * object has.
   *
   * @name size
   * @memberof $SetObject
   * @instance
   * @type {number}
   */
  size: {
    value: 0,
    writable: true
  },

  /**
   * The values() method returns a new Iterator object that contains the
   * values for each element in the Set object in insertion order.
   *
   * @function
   * @returns {object} A new Iterator object.
   */
  values: {
    value: setValuesIterator
  }
});
/**
 * The initial value of the @@iterator property is the same function object
 * as the initial value of the values property.
 *
 * @function symIt
 * @memberof $SetObject.prototype
 * @returns {object} A new Iterator object.
 */

object_define_property_x_esm($SetObject.prototype, $symIt, {
  value: setValuesIterator
});
/**
 * An object is an iterator when it knows how to access items from a
 * collection one at a time, while keeping track of its current position
 * within that sequence. In JavaScript an iterator is an object that provides
 * a next() method which returns the next item in the sequence. This method
 * returns an object with two properties: done and value. Once created,
 * an iterator object can be used explicitly by repeatedly calling next().
 *
 * @private
 * @class
 * @param {object} context - The Map object.
 * @param {string} iteratorKind - Values are `value`, `key` or `key+value`.
 */

var MapIt = function MapIterator(context, iteratorKind) {
  object_define_properties_x_esm(this, {
    '[[IteratorHasMore]]': {
      value: true,
      writable: true
    },
    '[[Map]]': {
      value: assert_is_object_x_esm(context)
    },
    '[[MapIterationKind]]': {
      value: iteratorKind
    },
    '[[MapNextIndex]]': {
      value: 0,
      writable: true
    }
  });
};
/**
 * Once initialized, the next() method can be called to access key-value
 * pairs from the object in turn.
 *
 * @private
 * @function next
 * @returns {object} Returns an object with two properties: done and value.
 */


object_define_property_x_esm(MapIt.prototype, 'next', {
  value: function next() {
    var context = assert_is_object_x_esm(this['[[Map]]']);
    var index = this['[[MapNextIndex]]'];
    var iteratorKind = this['[[MapIterationKind]]'];
    var more = this['[[IteratorHasMore]]'];
    var object;
    assert_is_object_x_esm(context);

    if (index < context['[[key]]'].length && more) {
      object = {
        done: false
      };

      if (iteratorKind === 'key+value') {
        object.value = [context['[[key]]'][index], context['[[value]]'][index]];
      } else {
        object.value = context["[[".concat(iteratorKind, "]]")][index];
      }

      this['[[MapNextIndex]]'] += 1;
    } else {
      this['[[IteratorHasMore]]'] = false;
      object = {
        done: true,

        /* eslint-disable-next-line no-void */
        value: void 0
      };
    }

    return object;
  }
});
/**
 * The @@iterator property is the same Iterator object.
 *
 * @private
 * @function symIt
 * @memberof MapIterator.prototype
 * @returns {object} This Iterator object.
 */

object_define_property_x_esm(MapIt.prototype, $symIt, {
  value: function iterator() {
    return this;
  }
}); // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * The Map object is a simple key/value map. Any value (both objects and
 * primitive values) may be used as either a key or a value.
 *
 * @class Map
 * @private
 * @param {*} [iterable] - Iterable is an Array or other iterable object whose
 *  elements are key-value pairs (2-element Arrays). Each key-value pair is
 *  added to the new Map. A null is treated as undefined.
 */
// eslint-enable jsdoc/check-param-names

var $MapObject = function Map() {
  if (collections_x_esm_castBoolean(this) === false || this instanceof $MapObject === false) {
    throw new TypeError("Constructor Map requires 'new'");
  }
  /* eslint-disable-next-line prefer-rest-params,no-void */


  collections_x_esm_parseIterable('map', this, arguments.length ? arguments[0] : void 0);
}; // noinspection JSValidateTypes


object_define_properties_x_esm($MapObject.prototype,
/** @lends $MapObject.prototype */
{
  /**
   * The clear() method removes all elements from a Map object.
   *
   * @returns {object} The Map object.
   */
  clear: {
    value: function clear() {
      return collections_x_esm_baseClear('map', this);
    }
  },

  /**
   * The delete() method removes the specified element from a Map object.
   *
   * @param {*} key - The key of the element to remove from the Map object.
   * @returns {boolean} Returns true if an element in the Map object has been
   *  removed successfully.
   */
  delete: {
    value: function de1ete(key) {
      return collections_x_esm_baseDelete('map', this, key);
    }
  },

  /**
   * The entries() method returns a new Iterator object that contains the
   * [key, value] pairs for each element in the Map object in insertion order.
   *
   * @returns {object} A new Iterator object.
   */
  entries: {
    value: function entries() {
      return new MapIt(this, 'key+value');
    }
  },

  /**
   * The forEach() method executes a provided function once per each
   * key/value pair in the Map object, in insertion order.
   *
   * @param {Function} callback - Function to execute for each element..
   * @param {*} [thisArg] - Value to use as this when executing callback.
   * @returns {object} The Map object.
   */
  forEach: {
    value: function forEach(callback, thisArg) {
      return collections_x_esm_baseForEach('map', this, callback, thisArg);
    }
  },

  /**
   * The get() method returns a specified element from a Map object.
   *
   * @param {*} key - The key of the element to return from the Map object.
   * @returns {*} Returns the element associated with the specified key or
   *  undefined if the key can't be found in the Map object.
   */
  get: {
    value: function get(key) {
      var index = index_of_x_esm(assert_is_object_x_esm(this)['[[key]]'], key, 'SameValueZero');
      /* eslint-disable-next-line no-void */

      return index > -1 ? this['[[value]]'][index] : void 0;
    }
  },

  /**
   * The has() method returns a boolean indicating whether an element with
   * the specified key exists or not.
   *
   * @function
   * @param {*} key - The key of the element to test for presence in the Map object.
   * @returns {boolean} Returns true if an element with the specified key
   *  exists in the Map object; otherwise false.
   */
  has: {
    value: baseHas
  },

  /**
   * The keys() method returns a new Iterator object that contains the keys
   * for each element in the Map object in insertion order.
   *
   * @returns {object} A new Iterator object.
   */
  keys: {
    value: function keys() {
      return new MapIt(this, 'key');
    }
  },

  /**
   * The set() method adds a new element with a specified key and value to
   * a Map object.
   *
   * @param {*} key - The key of the element to add to the Map object.
   * @param {*} value - The value of the element to add to the Map object.
   * @returns {object} The Map object.
   */
  set: {
    value: function set(key, value) {
      return baseAddSet('map', this, key, value);
    }
  },

  /**
   * The value of size is an integer representing how many entries the Map
   * object has.
   *
   * @name size
   * @memberof $MapObject
   * @instance
   * @type {number}
   */
  size: {
    value: 0,
    writable: true
  },

  /**
   * The values() method returns a new Iterator object that contains the
   * values for each element in the Map object in insertion order.
   *
   * @returns {object} A new Iterator object.
   */
  values: {
    value: function values() {
      return new MapIt(this, 'value');
    }
  }
});
/**
 * The initial value of the @@iterator property is the same function object
 * as the initial value of the entries property.
 *
 * @function symIt
 * @memberof module:collections-x.Map.prototype
 * @returns {object} A new Iterator object.
 */

object_define_property_x_esm($MapObject.prototype, $symIt, {
  value: $MapObject.prototype.entries
});
/*
 * Determine whether to use shim or native.
 */

var ExportMap = $MapObject;

try {
  /* eslint-disable-next-line compat/compat */
  ExportMap = new Map() ? Map : $MapObject;
} catch (ignore) {// empty
}

var MapConstructor = ExportMap;
var ExportSet = $SetObject;

try {
  /* eslint-disable-next-line compat/compat */
  ExportSet = new Set() ? Set : $SetObject;
} catch (ignore) {// empty
}

var SetConstructor = ExportSet;
var testMap;

if (ExportMap !== $MapObject) {
  testMap = new ExportMap();

  if (isNumberType(testMap.size) === false || testMap.size !== 0) {
    ExportMap = $MapObject;
  } else {
    var propsMap = ['has', 'set', 'clear', 'delete', 'forEach', 'values', 'entries', 'keys', $symIt];
    var failedMap = array_some_x_esm(propsMap, function (method) {
      collections_x_esm_newArrowCheck(this, collections_x_esm_this);

      return is_function_x_esm(testMap[method]) === false;
    }.bind(undefined));

    if (failedMap) {
      ExportMap = $MapObject;
    }
  }
}

if (ExportMap !== $MapObject) {
  // Safari 8, for example, doesn't accept an iterable.
  var mapAcceptsArguments = false;

  try {
    mapAcceptsArguments = new ExportMap([[1, 2]]).get(1) === 2;
  } catch (ignore) {// empty
  }

  if (mapAcceptsArguments === false) {
    ExportMap = $MapObject;
  }
}

if (ExportMap !== $MapObject) {
  testMap = new ExportMap();
  var mapSupportsChaining = testMap.set(1, 2) === testMap;

  if (mapSupportsChaining === false) {
    ExportMap = $MapObject;
  }
}

if (ExportMap !== $MapObject) {
  // Chrome 38-42, node 0.11/0.12, iojs 1/2 also have a bug when the Map has a size > 4
  testMap = new ExportMap([[1, 0], [2, 0], [3, 0], [4, 0]]);
  testMap.set(-0, testMap);
  var gets = testMap.get(0) === testMap && testMap.get(-0) === testMap;
  var mapUsesSameValueZero = gets && testMap.has(0) && testMap.has(-0);

  if (mapUsesSameValueZero === false) {
    ExportMap = $MapObject;
  }
}

if (ExportMap !== $MapObject) {
  if (setPrototypeOf) {
    var MyMap = function MyMap(arg) {
      testMap = new ExportMap(arg);
      setPrototypeOf(testMap, MyMap.prototype);
      return testMap;
    };

    setPrototypeOf(MyMap, ExportMap);
    MyMap.prototype = object_create_x_esm(ExportMap.prototype, {
      constructor: {
        value: MyMap
      }
    });
    var mapSupportsSubclassing = false;

    try {
      testMap = new MyMap([]); // Firefox 32 is ok with the instantiating the subclass but will
      // throw when the map is used.

      testMap.set(42, 42);
      mapSupportsSubclassing = testMap instanceof MyMap;
    } catch (ignore) {// empty
    }

    if (mapSupportsSubclassing === false) {
      ExportMap = $MapObject;
    }
  }
}

if (ExportMap !== $MapObject) {
  var mapRequiresNew;

  try {
    /* eslint-disable-next-line babel/new-cap */
    mapRequiresNew = ExportMap() instanceof ExportMap === false;
  } catch (e) {
    mapRequiresNew = e instanceof TypeError;
  }

  if (mapRequiresNew === false) {
    ExportMap = $MapObject;
  }
}

if (ExportMap !== $MapObject) {
  testMap = new ExportMap();
  var mapIterationThrowsStopIterator;

  try {
    mapIterationThrowsStopIterator = testMap.keys().next().done === false;
  } catch (ignore) {
    mapIterationThrowsStopIterator = true;
  }

  if (mapIterationThrowsStopIterator) {
    ExportMap = $MapObject;
  }
} // Safari 8


if (ExportMap !== $MapObject && is_function_x_esm(new ExportMap().keys().next) === false) {
  ExportMap = $MapObject;
}

if (hasRealSymbolIterator && ExportMap !== $MapObject) {
  var testMapProto = get_prototype_of_x_esm(new ExportMap().keys());
  var hasBuggyMapIterator = true;

  if (testMapProto) {
    hasBuggyMapIterator = is_function_x_esm(testMapProto[$symIt]) === false;
  }

  if (hasBuggyMapIterator) {
    ExportMap = $MapObject;
  }
}

var testSet;

if (ExportSet !== $SetObject) {
  testSet = new ExportSet();

  if (isNumberType(testSet.size) === false || testSet.size !== 0) {
    ExportMap = $MapObject;
  } else {
    var propsSet = ['has', 'add', 'clear', 'delete', 'forEach', 'values', 'entries', 'keys', $symIt];
    var failedSet = array_some_x_esm(propsSet, function (method) {
      collections_x_esm_newArrowCheck(this, collections_x_esm_this);

      return is_function_x_esm(testSet[method]) === false;
    }.bind(undefined));

    if (failedSet) {
      ExportSet = $SetObject;
    }
  }
}

if (ExportSet !== $SetObject) {
  testSet = new ExportSet();
  testSet.delete(0);
  testSet.add(-0);
  var setUsesSameValueZero = testSet.has(0) && testSet.has(-0);

  if (setUsesSameValueZero === false) {
    ExportSet = $SetObject;
  }
}

if (ExportSet !== $SetObject) {
  testSet = new ExportSet();
  var setSupportsChaining = testSet.add(1) === testSet;

  if (setSupportsChaining === false) {
    ExportSet = $SetObject;
  }
}

if (ExportSet !== $SetObject) {
  if (setPrototypeOf) {
    var MySet = function MySet(arg) {
      testSet = new ExportSet(arg);
      setPrototypeOf(testSet, MySet.prototype);
      return testSet;
    };

    setPrototypeOf(MySet, ExportSet);
    MySet.prototype = object_create_x_esm(ExportSet.prototype, {
      constructor: {
        value: MySet
      }
    });
    var setSupportsSubclassing = false;

    try {
      testSet = new MySet([]);
      testSet.add(42, 42);
      setSupportsSubclassing = testSet instanceof MySet;
    } catch (ignore) {// empty
    }

    if (setSupportsSubclassing === false) {
      ExportSet = $SetObject;
    }
  }
}

if (ExportSet !== $SetObject) {
  var setRequiresNew;

  try {
    /* eslint-disable-next-line babel/new-cap */
    setRequiresNew = ExportSet() instanceof ExportSet === false;
  } catch (e) {
    setRequiresNew = e instanceof TypeError;
  }

  if (setRequiresNew === false) {
    ExportSet = $SetObject;
  }
}

if (ExportSet !== $SetObject) {
  testSet = new ExportSet();
  var setIterationThrowsStopIterator;

  try {
    setIterationThrowsStopIterator = testSet.keys().next().done === false;
  } catch (ignore) {
    setIterationThrowsStopIterator = true;
  }

  if (setIterationThrowsStopIterator) {
    ExportSet = $SetObject;
  }
} // Safari 8


if (ExportSet !== $SetObject && is_function_x_esm(new ExportSet().keys().next) === false) {
  ExportSet = $SetObject;
}

if (hasRealSymbolIterator && ExportSet !== $SetObject) {
  var testSetProto = get_prototype_of_x_esm(new ExportSet().keys());
  var hasBuggySetIterator = true;

  if (testSetProto) {
    hasBuggySetIterator = is_function_x_esm(testSetProto[$symIt]) === false;
  }

  if (hasBuggySetIterator) {
    ExportSet = $SetObject;
  }
}

var collections_x_esm_hasCommon = function hasCommon(object) {
  return is_object_like_x_esm(object) && is_function_x_esm(object[$symIt]) && is_boolean_object_default()(object['[[changed]]']) && is_object_like_x_esm(object['[[id]]']) && is_array_x_esm(object['[[key]]']) && is_array_x_esm(object['[[order]]']) && isNumberType(object.size);
};
/**
 * Determine if an `object` is a `Map`.
 *
 * @param {*} object - The object to test.
 * @returns {boolean} `true` if the `object` is a `Map`,
 *  else `false`.
 */


var $$isMap;

if (ExportMap === $MapObject) {
  $$isMap = function isMap(object) {
    if (is_map_x_esm(object)) {
      return true;
    }

    return collections_x_esm_hasCommon(object) && is_array_x_esm(object['[[value]]']);
  };
} else {
  $$isMap = is_map_x_esm;
}

var collections_x_esm_isMap = $$isMap;
/**
 * Determine if an `object` is a `Set`.
 *
 * @param {*} object - The object to test.
 * @returns {boolean} `true` if the `object` is a `Set`,
 *  else `false`.
 */

var $$isSet;

if (ExportSet === $SetObject) {
  $$isSet = function isSet(object) {
    if (isSet(object)) {
      return true;
    }

    return collections_x_esm_hasCommon(object) && typeof object['[[value]]'] === 'undefined';
  };
} else {
  $$isSet = is_set_x_esm;
}

var collections_x_esm_isSet = $$isSet;


// CONCATENATED MODULE: ./node_modules/string-starts-with-x/dist/string-starts-with-x.esm.js





var ERR_MSG = 'Cannot call method "startsWith" with a regex';
var sw = ERR_MSG.startsWith;
var nativeStartsWith = typeof sw === 'function' && sw;
var string_starts_with_x_esm_isWorking;

if (nativeStartsWith) {
  var string_starts_with_x_esm_res = attempt_x_esm.call('/a/', nativeStartsWith, /a/);
  string_starts_with_x_esm_isWorking = string_starts_with_x_esm_res.threw;

  if (string_starts_with_x_esm_isWorking) {
    string_starts_with_x_esm_res = attempt_x_esm.call('abc', nativeStartsWith, 'a', 1 / 0);
    string_starts_with_x_esm_isWorking = string_starts_with_x_esm_res.threw === false && string_starts_with_x_esm_res.value === false;
  }

  if (string_starts_with_x_esm_isWorking) {
    string_starts_with_x_esm_res = attempt_x_esm.call(123, nativeStartsWith, '1');
    string_starts_with_x_esm_isWorking = string_starts_with_x_esm_res.threw === false && string_starts_with_x_esm_res.value === true;
  }

  if (string_starts_with_x_esm_isWorking) {
    string_starts_with_x_esm_res = attempt_x_esm.call(null, nativeStartsWith, 'n');
    string_starts_with_x_esm_isWorking = string_starts_with_x_esm_res.threw;
  }
}
/**
 * This method determines whether a string begins with the characters of a
 * specified string, returning true or false as appropriate.
 *
 * @param {string} string - The string to be search.
 * @throws {TypeError} If string is null or undefined.
 * @param {string} searchString - The characters to be searched for at the start of this string.
 * @throws {TypeError} If searchString is a RegExp.
 * @param {number} [position] -The position in this string at which to begin searching for searchString; defaults to 0.
 * @returns {boolean} `true` if the given characters are found at the beginning of the string; otherwise, `false`.
 */


var $startsWith;

if (string_starts_with_x_esm_isWorking) {
  $startsWith = function startsWith(string, searchString) {
    var str = require_object_coercible_x_esm(string);

    if (is_regexp_x_esm(searchString)) {
      throw new TypeError(ERR_MSG);
    }

    var args = [searchString];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return nativeStartsWith.apply(str, args);
  };
} else {
  // Firefox (< 37?) and IE 11 TP have a noncompliant startsWith implementation
  $startsWith = function startsWith(string, searchString) {
    var str = to_string_x_esm(require_object_coercible_x_esm(string));

    if (is_regexp_x_esm(searchString)) {
      throw new TypeError(ERR_MSG);
    }

    var searchStr = to_string_x_esm(searchString);
    /* eslint-disable-next-line prefer-rest-params */

    var position = arguments.length > 2 ? to_integer_x_esm(arguments[2]) : 0;
    var start = position > 0 ? position : 0;
    return str.slice(start, start + searchStr.length) === searchStr;
  };
}

var ssw = $startsWith;
/* harmony default export */ var string_starts_with_x_esm = (ssw);


// CONCATENATED MODULE: ./node_modules/string-includes-x/dist/string-includes-x.esm.js




var ni = ''.includes;
var string_includes_x_esm_nativeIncludes = typeof ni === 'function' && ni;
var string_includes_x_esm_isWorking;

if (string_includes_x_esm_nativeIncludes) {
  var string_includes_x_esm_res = attempt_x_esm.call('/a/', string_includes_x_esm_nativeIncludes, /a/);
  string_includes_x_esm_isWorking = string_includes_x_esm_res.threw;

  if (string_includes_x_esm_isWorking) {
    string_includes_x_esm_res = attempt_x_esm.call('abc', string_includes_x_esm_nativeIncludes, 'a', Infinity);
    string_includes_x_esm_isWorking = string_includes_x_esm_res.threw === false && string_includes_x_esm_res.value === false;
  }

  if (string_includes_x_esm_isWorking) {
    string_includes_x_esm_res = attempt_x_esm.call(123, string_includes_x_esm_nativeIncludes, '2');
    string_includes_x_esm_isWorking = string_includes_x_esm_res.threw === false && string_includes_x_esm_res.value === true;
  }

  if (string_includes_x_esm_isWorking) {
    string_includes_x_esm_res = attempt_x_esm.call(null, string_includes_x_esm_nativeIncludes, 'u');
    string_includes_x_esm_isWorking = string_includes_x_esm_res.threw;
  }
}
/**
 * This method determines whether one string may be found within another string,
 * returning true or false as appropriate.
 *
 * @param {string} string - The target string.
 * @throws {TypeError} If target is null or undefined.
 * @param {string} searchString - A string to be searched for within the
 *  target string.
 * @throws {TypeError} If searchString is a RegExp.
 * @param {number} [position] -The position within the string at which to begin
 *  searching for searchString.(defaults to 0).
 * @returns {boolean} `true` if the given string is found anywhere within the
 *  search string; otherwise, `false` if not.
 */


var string_includes_x_esm_$includes;

if (string_includes_x_esm_isWorking) {
  string_includes_x_esm_$includes = function includes(string, searchString) {
    var args = [searchString];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return string_includes_x_esm_nativeIncludes.apply(string, args);
  };
} else {
  var string_includes_x_esm_indexOf = String.prototype.indexOf;

  string_includes_x_esm_$includes = function includes(string, searchString) {
    var str = to_string_x_esm(require_object_coercible_x_esm(string));

    if (is_regexp_x_esm(searchString)) {
      throw new TypeError('"includes" does not accept a RegExp');
    }

    var args = [to_string_x_esm(searchString)];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    } // Somehow this trick makes method 100% compat with the spec.


    return string_includes_x_esm_indexOf.apply(str, args) !== -1;
  };
}

var string_includes_x_esm_inc = string_includes_x_esm_$includes;
/* harmony default export */ var string_includes_x_esm = (string_includes_x_esm_inc);


// CONCATENATED MODULE: ./node_modules/array-difference-x/dist/array-difference-x.esm.js
function array_difference_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }





 // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * This method creates an array of array values not included in the other given
 * arrays using SameValueZero for equality comparisons. The order and references
 * of result values are determined by the first array.
 *
 * @param {Array} array - The array to inspect.
 * @throws {TypeError} If array is null or undefined.
 * @param {...Array} [exclude] - The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 */
// eslint-enable jsdoc/check-param-names

var array_difference_x_esm_difference = function difference(array) {
  var _this = this;

  if (is_nil_x_esm(array)) {
    return [];
  }
  /* eslint-disable-next-line prefer-rest-params */


  var excludes = array_like_slice_x_esm(arguments, 1);
  return array_filter_x_esm(array, function (value) {
    var _this2 = this;

    array_difference_x_esm_newArrowCheck(this, _this);

    return array_some_x_esm(excludes, function (exclude) {
      array_difference_x_esm_newArrowCheck(this, _this2);

      return is_nil_x_esm(exclude) === false && array_includes_x_esm(exclude, value);
    }.bind(this)) === false;
  }.bind(this));
};

/* harmony default export */ var array_difference_x_esm = (array_difference_x_esm_difference);


// CONCATENATED MODULE: ./node_modules/array-intersection-x/dist/array-intersection-x.esm.js
function array_intersection_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }






var shift = Array.prototype.shift;

var notNill = function notNil(value) {
  return is_nil_x_esm(value) === false;
}; // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * This method creates an array of unique values that are included in all given
 * arrays using SameValueZero for equality comparisons. The order and references
 * of result values are determined by the first array.
 *
 * @param {...Array} [array] - The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 */
// eslint-enable jsdoc/check-param-names


var array_intersection_x_esm_intersection = function intersection() {
  var _this = this;

  /* eslint-disable-next-line prefer-rest-params */
  var arrays = array_filter_x_esm(arguments, notNill);

  if (arrays.length < 1) {
    return [];
  }

  return array_reduce_x_esm(shift.call(arrays), function (acc, value) {
    var _this2 = this;

    array_intersection_x_esm_newArrowCheck(this, _this);

    var isExcluded = array_some_x_esm(arrays, function (array) {
      array_intersection_x_esm_newArrowCheck(this, _this2);

      return array_includes_x_esm(array, value) === false;
    }.bind(this)) === false;

    if (isExcluded && array_includes_x_esm(acc, value) === false) {
      acc[acc.length] = value;
    }

    return acc;
  }.bind(this), []);
};

/* harmony default export */ var array_intersection_x_esm = (array_intersection_x_esm_intersection);


// CONCATENATED MODULE: ./node_modules/array-union-x/dist/array-union-x.esm.js




var array_union_x_esm_addNotIncluded = function addNotIncluded(acc, value) {
  if (array_includes_x_esm(acc, value) === false) {
    acc[acc.length] = value;
  }

  return acc;
};

var array_union_x_esm_reduceArgs = function reduceArgs(acc, arg) {
  return is_nil_x_esm(arg) ? acc : array_reduce_x_esm(arg, array_union_x_esm_addNotIncluded, acc);
};
/**
 * This method creates an array of unique values, in order, from all given
 * arrays using SameValueZero for equality comparisons.
 *
 * @param {...Array} [args] - The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 */


var array_union_x_esm_union = function union() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return array_reduce_x_esm(args, array_union_x_esm_reduceArgs, []);
};

/* harmony default export */ var array_union_x_esm = (array_union_x_esm_union);


// CONCATENATED MODULE: ./dist/inspect-x.esm.js
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function inspect_x_esm_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { inspect_x_esm_typeof = function _typeof(obj) { return typeof obj; }; } else { inspect_x_esm_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return inspect_x_esm_typeof(obj); }






















































var EMPTY_ARRAY = [];
var inspect_x_esm_RegExpCtr = /none/.constructor;
var inspect_x_esm_EMPTY_STRING = '';
var EMPTY_OBJECT = {};
var call = is_function_x_esm.call;
/* eslint-disable-next-line compat/compat */

var hasSet = typeof Set === 'function' && is_set_x_esm(new Set());
/* eslint-disable-next-line compat/compat */

var inspect_x_esm_testSet = hasSet && new Set(['SetSentinel']);
var setForEach = hasSet && bind_x_esm(call, inspect_x_esm_testSet.forEach);
var setValues = hasSet && bind_x_esm(call, inspect_x_esm_testSet.values);
/* eslint-disable-next-line compat/compat */

var hasMap = typeof Map === 'function' && is_map_x_esm(new Map());
/* eslint-disable-next-line compat/compat */

var inspect_x_esm_testMap = hasMap && new Map([[1, 'MapSentinel']]);
var mapForEach = hasMap && bind_x_esm(call, inspect_x_esm_testMap.forEach);
var mapValues = hasMap && bind_x_esm(call, inspect_x_esm_testMap.values);
/* eslint-disable-next-line compat/compat */

var symbolToString = has_symbol_support_x_esm && bind_x_esm(call, Symbol.prototype.toString);
/* eslint-disable-next-line compat/compat */

var symbolValueOf = has_symbol_support_x_esm && bind_x_esm(call, Symbol.prototype.valueOf);
var oSeal = EMPTY_OBJECT.constructor.seal;
var objectSeal = is_function_x_esm(oSeal) ? oSeal : function seal(value) {
  return value;
};
var regexpToString = bind_x_esm(call, inspect_x_esm_RegExpCtr.prototype.toString);
var regexpTest = bind_x_esm(call, inspect_x_esm_RegExpCtr.prototype.test);
var errorToString = bind_x_esm(call, Error.prototype.toString);
var numberToString = bind_x_esm(call, 0 .toString);
var booleanToString = bind_x_esm(call, true.toString);
var inspect_x_esm_concat = bind_x_esm(call, EMPTY_ARRAY.concat, EMPTY_ARRAY);
var inspect_x_esm_join = bind_x_esm(call, EMPTY_ARRAY.join);
var push = bind_x_esm(call, EMPTY_ARRAY.push);
var getTime = bind_x_esm(call, Date.prototype.getTime);
var inspect_x_esm_replace = bind_x_esm(call, inspect_x_esm_EMPTY_STRING.replace);
var strSlice = bind_x_esm(call, inspect_x_esm_EMPTY_STRING.slice);
var inspect_x_esm_propertyIsEnumerable = bind_x_esm(call, EMPTY_OBJECT.propertyIsEnumerable);
/* eslint-disable-next-line compat/compat */

var customInspectSymbol = has_symbol_support_x_esm ? Symbol('inspect.custom') : '_inspect.custom_';
/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 * Values may supply their own custom `inspect(depth, opts)` functions,
 * when called they receive the current depth in the recursive inspection,
 * as well as the options object passed to `inspect`.
 *
 * @param {object} obj - The object to print out.
 * @param {object} [opts] - Options object that alters the out.
 * @returns {string} The string representation.
 */

var $inspect;
var $fmtValue;

var inspect_x_esm_isFalsey = function isFalsey(value) {
  return to_boolean_x_esm(value) === false;
};

var supportsClasses;

try {
  /* eslint-disable-next-line no-new-func */
  Function('return class My {}')();
  supportsClasses = true;
} catch (ignore) {// empty
}

var inspect_x_esm_isClass = function isClass(value) {
  return supportsClasses ? is_function_x_esm(value, true) && is_function_x_esm(value) === false : false;
};

var supportsGetSet;

try {
  /* eslint-disable-next-line no-void */
  var testVar = void 0;
  var testObject = object_define_property_x_esm({}, 'defaultOptions', {
    get: function get() {
      return testVar;
    },
    set: function set(val) {
      testVar = val;
      return testVar;
    }
  });
  testObject.defaultOptions = 'test';
  supportsGetSet = testVar === 'test' && testObject.defaultOptions === 'test';
} catch (ignore) {// empty
}

var pluralEnding = function pluralEnding(number) {
  return number > 1 ? 's' : inspect_x_esm_EMPTY_STRING;
};

var isDigits = function isDigits(key) {
  return regexpTest(/^\d+$/, key);
};

var inspect_x_esm_appendMissing = function appendMissing(array, values) {
  return inspect_x_esm_concat(array, array_difference_x_esm(values, array));
};

var inspect_x_esm_promote = function promote(array, values) {
  return inspect_x_esm_concat(values, array_difference_x_esm(array, values));
};

var missingError;
var errProps;

try {
  // noinspection ExceptionCaughtLocallyJS
  throw new Error('test');
} catch (e) {
  errProps = array_union_x_esm(object_keys_x_esm(new Error()), object_keys_x_esm(e));
  var errorString = errorToString(e);
  var errorStack = e.stack;

  if (errorStack) {
    var errorRx = new inspect_x_esm_RegExpCtr("^".concat(errorString));

    if (regexpTest(errorRx, errorStack) === false) {
      missingError = true;
    }
  }
}

if (is_date_object_default()(Date.prototype)) {
  isDate = function $isDate(value) {
    try {
      getTime(value);
      return true;
    } catch (ignore) {
      return false;
    }
  };
}

var shimmedDate;
var dateProps = object_keys_x_esm(Date);

if (dateProps.length > 0) {
  var datePropsCheck = ['now', 'UTC', 'parse'];
  shimmedDate = array_every_x_esm(datePropsCheck, function predicate(prop) {
    return array_includes_x_esm(dateProps, prop);
  }) && array_includes_x_esm(object_keys_x_esm(new Date()), 'constructor');
}
/* eslint-disable-next-line lodash/prefer-noop */


var testFunc1 = function test1() {};

var fnSupportsName = testFunc1.name === 'test1';
var hiddenFuncCtr = array_includes_x_esm(reflect_own_keys_x_esm(testFunc1.prototype), 'constructor') === false;
var wantedFnProps = ['length', 'name', 'prototype'];
var fnPropsCheck = fnSupportsName ? array_slice_x_esm(wantedFnProps) : array_filter_x_esm(wantedFnProps, function predicate(prop) {
  return prop !== 'name';
});
var funcKeys = reflect_own_keys_x_esm(testFunc1);
var unwantedFnProps = array_intersection_x_esm(['arguments', 'caller'], funcKeys);
var mustFilterFnProps = array_difference_x_esm(fnPropsCheck, funcKeys).length > 0;

if (mustFilterFnProps === false) {
  mustFilterFnProps = array_some_x_esm(array_intersection_x_esm(funcKeys, wantedFnProps), function predicate(key, index) {
    return wantedFnProps[index] !== key;
  });
}

var inspectDefaultOptions = objectSeal({
  breakLength: 60,
  colors: false,
  customInspect: true,
  depth: 2,
  maxArrayLength: 100,
  showHidden: false,
  showProxy: false
});

var isBooleanType = function isBooleanType(arg) {
  return typeof arg === 'boolean';
};

var inspect_x_esm_isNumberType = function isNumberType(arg) {
  return typeof arg === 'number';
};

var isStringType = function isStringType(arg) {
  return typeof arg === 'string';
};

var isSymbolType = function isSymbolType(arg) {
  return inspect_x_esm_typeof(arg) === 'symbol';
};

var inspect_x_esm_isMapIterator = function isMapIterator(value) {
  if (hasMap === false || is_object_like_x_esm(value) === false) {
    return false;
  }

  try {
    return value.next.call(mapValues(inspect_x_esm_testMap)).value === 'MapSentinel';
  } catch (ignore) {// empty
  }

  return false;
};

var inspect_x_esm_isSetIterator = function isSetIterator(value) {
  if (hasSet === false || is_object_like_x_esm(value) === false) {
    return false;
  }

  try {
    return value.next.call(setValues(inspect_x_esm_testSet)).value === 'SetSentinel';
  } catch (ignore) {// empty
  }

  return false;
};

var inspect_x_esm_filterIndexes = function filterIndexes(keys, length) {
  return array_filter_x_esm(keys, function predicate(key) {
    return isSymbolType(key) || key < 0 || key > length || key % 1 !== 0;
  });
};

var stylizeWithColor = function stylizeWithColor(str, styleType) {
  var style = $inspect.styles[styleType];

  if (style) {
    var colors = $inspect.colors[style];
    return "\x1B[".concat(colors[0], "m").concat(str, "\x1B[").concat(colors[1], "m");
  }

  return str;
};

var stylizeNoColor = function stylizeNoColor(str) {
  return str;
};

var inspect_x_esm_getNameSep = function getNameSep(obj) {
  var name = get_function_name_x_esm(obj);
  return name ? ": ".concat(name) : name;
};

var inspect_x_esm_getConstructorOf = function getConstructorOf(obj) {
  var o = obj;
  var maxLoop = 100;

  while (is_nil_x_esm(o) === false && maxLoop >= 0) {
    o = to_object_x_esm(o);
    var descriptor = object_get_own_property_descriptor_x_esm(o, 'constructor');

    if (descriptor && descriptor.value) {
      return descriptor.value;
    }

    o = get_prototype_of_x_esm(o);
    maxLoop -= 1;
  }

  return null;
};

var inspect_x_esm_isSub = function isSub(value) {
  if (supportsClasses !== true || is_primitive_default()(value)) {
    return false;
  }

  var constructor = inspect_x_esm_getConstructorOf(value);
  return is_function_x_esm(constructor) === false && is_function_x_esm(constructor, true);
};

var inspect_x_esm_getSubName = function getSubName(value, name) {
  if (inspect_x_esm_isSub(value)) {
    var subName = get_function_name_x_esm(inspect_x_esm_getConstructorOf(value));

    if (subName && subName !== name) {
      return subName;
    }
  }

  return name || get_function_name_x_esm(inspect_x_esm_getConstructorOf(value));
};

var inspect_x_esm_fmtNumber = function fmtNumber(ctx, value) {
  // Format -0 as '-0'.
  return ctx.stylize(object_is_default()(value, -0) ? '-0' : numberToString(value), 'number');
};

var fmtPrimitiveReplacers = [[/^"|"$/g, inspect_x_esm_EMPTY_STRING], [/'/g, "\\'"], [/\\"/g, '"']];

var fmtPrimitiveReplace = function _fmtPrimitiveReplace(acc, pair) {
  return inspect_x_esm_replace(acc, pair[0], pair[1]);
};

var inspect_x_esm_fmtPrimitive = function fmtPrimitive(ctx, value) {
  if (is_nil_x_esm(value)) {
    var str = to_string_x_esm(value);
    return ctx.stylize(str, str);
  }

  if (isStringType(value)) {
    return ctx.stylize("'".concat(array_reduce_x_esm(fmtPrimitiveReplacers, fmtPrimitiveReplace, Object(json3["stringify"])(value)), "'"), 'string');
  }

  if (inspect_x_esm_isNumberType(value)) {
    return inspect_x_esm_fmtNumber(ctx, value);
  }

  if (isBooleanType(value)) {
    return ctx.stylize(booleanToString(value), 'boolean');
  } // es6 symbol primitive


  if (isSymbolType(value)) {
    return ctx.stylize(symbolToString(value), 'symbol');
  }
  /* eslint-disable-next-line no-void */


  return void 0;
};

var fmtPrimNoColor = function fmtPrimNoColor(ctx, value) {
  var stylize = ctx.stylize;
  ctx.stylize = stylizeNoColor;
  var str = inspect_x_esm_fmtPrimitive(ctx, value);
  ctx.stylize = stylize;
  return str;
};

var recurse = function recurse(depth) {
  return depth === null ? null : depth - 1;
};

var fmtPropReplacers = [[/'/g, "\\'"], [/\\"/g, '"'], [/(^"|"$)/g, "'"], [/\\\\/g, '\\']];

var fmtPropReplace = function _fmtPropReplace(acc, pair) {
  return inspect_x_esm_replace(acc, pair[0], pair[1]);
};

var fmtPropReplacer1 = [/\n/g, '\n  '];
var fmtPropReplacer2 = [/(^|\n)/g, '\n   '];
var fmtPropTestRx = /^"[\w$]+"$/;

var inspect_x_esm_fmtProp = function fmtProp(args) {
  var _args = _slicedToArray(args, 6),
      ctx = _args[0],
      value = _args[1],
      depth = _args[2],
      visibleKeys = _args[3],
      key = _args[4],
      arr = _args[5];

  var desc = object_get_own_property_descriptor_x_esm(value, key) || {
    value: value[key]
  };
  /*
  // this is a fix for broken FireFox, should not be needed with es6-shim
  if (key === 'size' && (isSet(value) || isMap(value) && isFunction(value.size)) {
    desc.value = value.size();
  }
  */

  var name;

  if (array_includes_x_esm(visibleKeys, key) === false) {
    if (key === 'BYTES_PER_ELEMENT' && inspect_x_esm_isFalsey(value.BYTES_PER_ELEMENT) && is_typed_array_default()(value)) {
      var _constructor = inspect_x_esm_getConstructorOf(value);

      if (_constructor) {
        desc.value = _constructor.BYTES_PER_ELEMENT;
      }
    } else if (isSymbolType(key)) {
      name = "[".concat(ctx.stylize(symbolToString(key), 'symbol'), "]");
    } else {
      name = "[".concat(key, "]");
    }
  }

  var str;

  if (desc.get) {
    str = ctx.stylize(desc.set ? '[Getter/Setter]' : '[Getter]', 'special');
  } else if (desc.set) {
    str = ctx.stylize('[Setter]', 'special');
  } else {
    var formattedStr = $fmtValue([ctx, desc.value, recurse(depth), key === 'prototype']);

    if (string_includes_x_esm(formattedStr, '\n')) {
      var replacer = arr ? fmtPropReplacer1 : fmtPropReplacer2;
      str = inspect_x_esm_replace(formattedStr, replacer[0], replacer[1]);
    } else {
      str = formattedStr;
    }
  }

  if (typeof name === 'undefined') {
    if (arr && isDigits(key)) {
      return str;
    }

    var serialisedKey = Object(json3["stringify"])(key);

    if (regexpTest(fmtPropTestRx, serialisedKey)) {
      name = ctx.stylize(strSlice(serialisedKey, 1, -1), 'name');
    } else {
      name = ctx.stylize(array_reduce_x_esm(fmtPropReplacers, fmtPropReplace, serialisedKey), 'string');
    }
  }

  return "".concat(name, ": ").concat(str);
};

var inspect_x_esm_fmtObject = function fmtObject(args) {
  var _args2 = _slicedToArray(args, 5),
      ctx = _args2[0],
      value = _args2[1],
      depth = _args2[2],
      visibleKeys = _args2[3],
      keys = _args2[4];

  return array_map_x_esm(keys, function mapFmObject(key) {
    return inspect_x_esm_fmtProp([ctx, value, depth, visibleKeys, key, false]);
  });
};

var getMoreItemText = function getMoreItemText(remaining) {
  return "... ".concat(remaining, " more item").concat(pluralEnding(remaining));
};

var getEmptyItemText = function getEmptyItemText(emptyItems) {
  return "<".concat(emptyItems, " empty item").concat(pluralEnding(emptyItems), ">");
};

var inspect_x_esm_filterOutIndexes = function filterOutIndexes(keys) {
  return array_filter_x_esm(keys, function predicate(key) {
    return isSymbolType(key) || isDigits(key) === false;
  });
};

var inspect_x_esm_fmtArray = function fmtArray(args) {
  var _args3 = _slicedToArray(args, 5),
      ctx = _args3[0],
      value = _args3[1],
      depth = _args3[2],
      visibleKeys = _args3[3],
      keys = _args3[4];

  var length = value.length;
  var maxLength = math_clamp_x_esm(length, 0, ctx.maxArrayLength);
  var lastIndex = 0;
  var nextIndex = 0;
  var output = [];
  var moreItems = array_some_x_esm(value, function predicate(item, index) {
    if (index !== nextIndex) {
      push(output, ctx.stylize(getEmptyItemText(index - lastIndex - 1), 'undefined'));
    }

    push(output, inspect_x_esm_fmtProp([ctx, value, depth, visibleKeys, numberToString(index), true]));
    lastIndex = index;
    nextIndex = index + 1;
    return nextIndex >= maxLength;
  });
  var remaining = length - nextIndex;

  if (remaining > 0) {
    if (moreItems) {
      push(output, getMoreItemText(remaining));
    } else {
      push(output, ctx.stylize(getEmptyItemText(remaining), 'undefined'));
    }
  }

  var fmtdProps = array_map_x_esm(inspect_x_esm_filterOutIndexes(keys), function iteratee(key) {
    return inspect_x_esm_fmtProp([ctx, value, depth, visibleKeys, key, true]);
  });
  return inspect_x_esm_concat(output, fmtdProps);
};

var inspect_x_esm_fmtTypedArray = function fmtTypedArray(args) {
  var _args4 = _slicedToArray(args, 5),
      ctx = _args4[0],
      value = _args4[1],
      depth = _args4[2],
      visibleKeys = _args4[3],
      keys = _args4[4];

  var length = value.length;
  var maxLength = math_clamp_x_esm(length, 0, ctx.maxArrayLength);
  var output = [];
  output.length = maxLength;
  var moreItems = array_some_x_esm(value, function predicate(item, index) {
    if (index >= maxLength) {
      return true;
    }

    output[index] = inspect_x_esm_fmtNumber(ctx, value[index]);
    return false;
  });

  if (moreItems) {
    push(output, getMoreItemText(length - maxLength));
  }

  var fmtdProps = array_map_x_esm(inspect_x_esm_filterOutIndexes(keys), function iteratee(key) {
    return inspect_x_esm_fmtProp([ctx, value, depth, visibleKeys, key, true]);
  });
  return inspect_x_esm_concat(output, fmtdProps);
};

var inspect_x_esm_fmtSet = function fmtSet(args) {
  var _args5 = _slicedToArray(args, 5),
      ctx = _args5[0],
      value = _args5[1],
      depth = _args5[2],
      visibleKeys = _args5[3],
      keys = _args5[4];

  var output = [];
  setForEach(value, function iteratee(v) {
    push(output, $fmtValue([ctx, v, recurse(depth)]));
  });
  var fmtdProps = array_map_x_esm(keys, function iteratee(key) {
    return inspect_x_esm_fmtProp([ctx, value, depth, visibleKeys, key, false]);
  });
  return inspect_x_esm_concat(output, fmtdProps);
};

var inspect_x_esm_fmtMap = function fmtMap(args) {
  var _args6 = _slicedToArray(args, 5),
      ctx = _args6[0],
      value = _args6[1],
      depth = _args6[2],
      visibleKeys = _args6[3],
      keys = _args6[4];

  var r = recurse(depth);
  var output = [];
  mapForEach(value, function iteratee(v, k) {
    push(output, "".concat($fmtValue([ctx, k, r]), " => ").concat($fmtValue([ctx, v, r])));
  });
  var fmtdProps = array_map_x_esm(keys, function iteratee(key) {
    return inspect_x_esm_fmtProp([ctx, value, depth, visibleKeys, key, false]);
  });
  return inspect_x_esm_concat(output, fmtdProps);
};

var reSingle = new inspect_x_esm_RegExpCtr("\\{[".concat(white_space_x_esm, "]+\\}"));
/* eslint-disable-next-line no-control-regex */

var lengthReduceRx = /\u001b\[\d\d?m/g;

var lengthReduce = function lengthReduce(prev, cur) {
  return prev + inspect_x_esm_replace(cur, lengthReduceRx, inspect_x_esm_EMPTY_STRING).length + 1;
};

var inspect_x_esm_reduceToSingleString = function reduceToSingleString(args) {
  var _args7 = _slicedToArray(args, 4),
      out = _args7[0],
      base = _args7[1],
      braces = _args7[2],
      breakLength = _args7[3];

  var result;

  if (array_reduce_x_esm(out, lengthReduce, 0) > breakLength) {
    // If the opening "brace" is too large, like in the case of "Set {",
    // we need to force the first item to be on the next line or the
    // items will not line up correctly.
    var layoutBase = base === inspect_x_esm_EMPTY_STRING && braces[0].length === 1 ? inspect_x_esm_EMPTY_STRING : "".concat(base, "\n ");
    result = "".concat(braces[0] + layoutBase, " ").concat(inspect_x_esm_join(out, ',\n  '), " ").concat(braces[1]);
  } else {
    result = "".concat(braces[0] + base, " ").concat(inspect_x_esm_join(out, ', '), " ").concat(braces[1]);
  }

  return inspect_x_esm_replace(result, reSingle, '{}');
};

var inspect_x_esm_fmtDate = function fmtDate(value) {
  return is_nan_default()(getTime(value)) ? 'Invalid Date' : to_iso_string_x_esm(value);
};

var inspect_x_esm_fmtError = function fmtError(value) {
  var stack = value.stack;

  if (stack) {
    if (supportsClasses) {
      var subName = inspect_x_esm_getSubName(value);

      if (subName && string_starts_with_x_esm(stack, subName) === false) {
        var msg = value.message;
        return inspect_x_esm_replace(stack, errorToString(value), subName + (msg ? ": ".concat(msg) : inspect_x_esm_EMPTY_STRING));
      }
    } else if (missingError) {
      return "".concat(errorToString(value), "\n").concat(stack);
    }
  }

  return stack || "[".concat(errorToString(value), "]");
};

var typedArrayKeys = ['BYTES_PER_ELEMENT', 'length', 'byteLength', 'byteOffset', 'buffer'];
var dataViewKeys = ['byteLength', 'byteOffset', 'buffer'];
var arrayBufferKeys = ['byteLength'];
var collectionKeys = ['size'];
var arrayKeys = ['length'];
var errorKeys = ['message'];

$fmtValue = function fmtValue(args) {
  var _args8 = _slicedToArray(args, 4),
      ctx = _args8[0],
      value = _args8[1],
      depth = _args8[2],
      isProto = _args8[3]; // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it


  if (ctx.customInspect && value) {
    var maybeCustomInspect = value[customInspectSymbol] || value.inspect;

    if (is_function_x_esm(maybeCustomInspect)) {
      // Filter out the util module, its inspect function is special
      if (maybeCustomInspect !== $inspect) {
        var _constructor2 = inspect_x_esm_getConstructorOf(value); // Also filter out any prototype objects using the circular check.


        var isCircular = _constructor2 && _constructor2.prototype === value;

        if (isCircular === false) {
          var ret = maybeCustomInspect.call(value, depth, ctx); // If the custom inspection method returned `this`, don't go into
          // infinite recursion.

          if (ret !== value) {
            return isStringType(ret) ? ret : $fmtValue([ctx, ret, depth]);
          }
        }
      }
    }
  } // Primitive types cannot have properties


  var primitive = inspect_x_esm_fmtPrimitive(ctx, value);

  if (primitive) {
    return primitive;
  } // Look up the keys of the object.


  var visibleKeys = object_keys_x_esm(value);

  if (visibleKeys.length > 0) {
    if (shimmedDate && is_date_object_default()(value)) {
      visibleKeys = array_filter_x_esm(visibleKeys, function predicate(key) {
        return key !== 'constructor';
      });
    } else if (errProps.length > 0 && is_error_x_esm(value)) {
      visibleKeys = array_filter_x_esm(visibleKeys, function predicate(key) {
        return array_includes_x_esm(errProps, key) === false;
      });
    }
  }

  var keys;

  if (ctx.showHidden) {
    keys = reflect_own_keys_x_esm(value);

    if (is_error_x_esm(value)) {
      if (array_includes_x_esm(keys, 'message') === false) {
        keys = inspect_x_esm_promote(keys, errorKeys);
      }
    } else if ((unwantedFnProps.length > 0 || mustFilterFnProps) && is_function_x_esm(value)) {
      if (unwantedFnProps.length > 0) {
        keys = array_difference_x_esm(keys, unwantedFnProps);
      }

      if (mustFilterFnProps) {
        var keysDiff = array_difference_x_esm(keys, fnPropsCheck);
        var missingFnProps = array_difference_x_esm(fnPropsCheck, visibleKeys, keysDiff);
        keys = inspect_x_esm_concat(missingFnProps, keysDiff);
      }
    } else if (hiddenFuncCtr && isProto && is_function_x_esm(inspect_x_esm_getConstructorOf(value))) {
      if (array_includes_x_esm(visibleKeys, 'constructor') === false && array_includes_x_esm(keys, 'constructor') === false) {
        keys = inspect_x_esm_promote(keys, 'constructor');
      }
    }
  } else {
    var enumSymbols = array_filter_x_esm(get_own_property_symbols_x_esm(value), function predicate(key) {
      return inspect_x_esm_propertyIsEnumerable(value, key);
    });
    keys = inspect_x_esm_concat(visibleKeys, enumSymbols);
  }

  if (is_string_default()(value)) {
    // for boxed Strings, we have to remove the 0-n indexed entries,
    // since they just noisy up the out and are redundant
    keys = inspect_x_esm_filterIndexes(keys, value.length);
    visibleKeys = inspect_x_esm_filterIndexes(visibleKeys, value.length);
  } else if (is_array_buffer_x_esm(value)) {
    keys = inspect_x_esm_filterIndexes(keys, value.byteLength);
    visibleKeys = inspect_x_esm_filterIndexes(visibleKeys, value.byteLength);
  }

  var name;
  var formatted; // Some type of object without properties can be shortcutted.

  if (keys.length < 1) {
    // This could be a boxed primitive (new String(), etc.)
    if (is_string_default()(value)) {
      return ctx.stylize("[".concat(inspect_x_esm_getSubName(value, 'String'), ": ").concat(fmtPrimNoColor(ctx, value.valueOf()), "]"), 'string');
    }

    if (is_number_object_default()(value)) {
      return ctx.stylize("[".concat(inspect_x_esm_getSubName(value, 'Number'), ": ").concat(fmtPrimNoColor(ctx, value.valueOf()), "]"), 'number');
    }

    if (is_boolean_object_default()(value)) {
      return ctx.stylize("[".concat(inspect_x_esm_getSubName(value, 'Boolean'), ": ").concat(fmtPrimNoColor(ctx, value.valueOf()), "]"), 'boolean');
    }

    if (is_symbol_default()(value)) {
      return ctx.stylize("[Symbol: ".concat(fmtPrimNoColor(ctx, symbolValueOf(value)), "]"), 'symbol');
    }

    if (is_async_function_x_esm(value)) {
      return ctx.stylize("[AsyncFunction".concat(inspect_x_esm_getNameSep(value), "]"), 'special');
    }

    if (is_generator_function_default()(value)) {
      return ctx.stylize("[GeneratorFunction".concat(inspect_x_esm_getNameSep(value), "]"), 'special');
    }

    if (is_function_x_esm(value)) {
      return ctx.stylize("[".concat(inspect_x_esm_getSubName(value, 'Function')).concat(inspect_x_esm_getNameSep(value), "]"), 'special');
    }

    if (inspect_x_esm_isClass(value)) {
      return ctx.stylize("[Class".concat(inspect_x_esm_getNameSep(value), "]"), 'special');
    }

    if (is_regex_default()(value)) {
      return ctx.stylize(regexpToString(value), 'regexp');
    }

    if (is_date_object_default()(value)) {
      name = inspect_x_esm_getSubName(value);
      formatted = ctx.stylize(inspect_x_esm_fmtDate(value), 'date');

      if (name === 'Date') {
        return formatted;
      }

      return ctx.stylize("[".concat(name, ": ").concat(formatted, "]"), 'date');
    }

    if (is_error_x_esm(value)) {
      return inspect_x_esm_fmtError(value);
    } // Fast path for ArrayBuffer. Can't do the same for DataView because it
    // has a non-primitive buffer property that we need to recurse for.


    if (is_array_buffer_x_esm(value)) {
      return "".concat(inspect_x_esm_getSubName(value, 'ArrayBuffer'), " { byteLength: ").concat(inspect_x_esm_fmtNumber(ctx, value.byteLength), " }");
    }

    if (inspect_x_esm_isMapIterator(value)) {
      return "".concat(inspect_x_esm_getSubName(value, 'MapIterator'), " {}");
    }

    if (inspect_x_esm_isSetIterator(value)) {
      return "".concat(inspect_x_esm_getSubName(value, 'SetIterator'), " {}");
    }

    if (is_promise_default()(value)) {
      return "".concat(inspect_x_esm_getSubName(value, 'Promise'), " {}");
    }
  }

  var base = inspect_x_esm_EMPTY_STRING;
  var empty = false;
  var braces = ['{', '}'];
  var fmtter = inspect_x_esm_fmtObject; // We can't compare constructors for various objects using a comparison
  // like `constructor === Array` because the object could have come from a
  // different context and thus the constructor won't match. Instead we check
  // the constructor names (including those up the prototype chain where
  // needed) to determine object types.

  if (is_string_default()(value)) {
    // Make boxed primitive Strings look like such
    base = "[".concat(inspect_x_esm_getSubName(value, 'String'), ": ").concat(fmtPrimNoColor(ctx, value.valueOf()), "]");
  } else if (is_number_object_default()(value)) {
    // Make boxed primitive Numbers look like such
    base = "[".concat(inspect_x_esm_getSubName(value, 'Number'), ": ").concat(fmtPrimNoColor(ctx, value.valueOf()), "]");
  } else if (is_boolean_object_default()(value)) {
    // Make boxed primitive Booleans look like such
    base = "[".concat(inspect_x_esm_getSubName(value, 'Boolean'), ": ").concat(fmtPrimNoColor(ctx, value.valueOf()), "]");
  } else if (is_function_x_esm(value)) {
    // Make functions say that they are functions
    base = "[".concat(inspect_x_esm_getSubName(value, 'Function')).concat(inspect_x_esm_getNameSep(value), "]");
  } else if (inspect_x_esm_isClass(value)) {
    // Make functions say that they are functions
    base = "[Class".concat(inspect_x_esm_getNameSep(value), "]");
  } else if (is_regex_default()(value)) {
    // Make RegExps say that they are RegExps
    // name = getSubName(value, 'RegExp');
    base = regexpToString(value);
  } else if (is_date_object_default()(value)) {
    // Make dates with properties first say the date
    name = inspect_x_esm_getSubName(value);
    formatted = inspect_x_esm_fmtDate(value);

    if (name === 'Date') {
      base = formatted;
    } else {
      base = "[".concat(name, ": ").concat(formatted, "]");
    }
  } else if (is_error_x_esm(value)) {
    name = inspect_x_esm_getSubName(value); // Make error with message first say the error

    base = inspect_x_esm_fmtError(value);
  } else if (is_array_x_esm(value)) {
    name = inspect_x_esm_getSubName(value); // Unset the constructor to prevent "Array [...]" for ordinary arrays.

    name = name === 'Array' ? inspect_x_esm_EMPTY_STRING : name;
    braces = ['[', ']'];

    if (ctx.showHidden) {
      keys = inspect_x_esm_promote(keys, arrayKeys);
    }

    empty = value.length < 1;
    fmtter = inspect_x_esm_fmtArray;
  } else if (is_set_x_esm(value)) {
    name = inspect_x_esm_getSubName(value, 'Set');
    fmtter = inspect_x_esm_fmtSet; // With `showHidden`, `length` will display as a hidden property for
    // arrays. For consistency's sake, do the same for `size`, even though
    // this property isn't selected by Object.getOwnPropertyNames().

    if (ctx.showHidden) {
      keys = inspect_x_esm_promote(keys, collectionKeys);
    }

    empty = value.size < 1;
  } else if (is_map_x_esm(value)) {
    name = inspect_x_esm_getSubName(value, 'Map');
    fmtter = inspect_x_esm_fmtMap; // With `showHidden`, `length` will display as a hidden property for
    // arrays. For consistency's sake, do the same for `size`, even though
    // this property isn't selected by Object.getOwnPropertyNames().

    if (ctx.showHidden) {
      keys = inspect_x_esm_promote(keys, collectionKeys);
    }

    empty = value.size < 1;
  } else if (is_array_buffer_x_esm(value)) {
    name = inspect_x_esm_getSubName(value, 'ArrayBuffer');
    keys = inspect_x_esm_promote(keys, arrayBufferKeys);
    visibleKeys = inspect_x_esm_appendMissing(visibleKeys, arrayBufferKeys);
  } else if (is_data_view_x_esm(value)) {
    name = inspect_x_esm_getSubName(value, 'DataView');
    keys = inspect_x_esm_promote(keys, dataViewKeys);
    visibleKeys = inspect_x_esm_appendMissing(visibleKeys, dataViewKeys);
  } else if (is_typed_array_default()(value)) {
    name = inspect_x_esm_getSubName(value);
    braces = ['[', ']'];
    fmtter = inspect_x_esm_fmtTypedArray;

    if (ctx.showHidden) {
      keys = inspect_x_esm_promote(keys, typedArrayKeys);
    }
  } else if (is_promise_default()(value)) {
    name = inspect_x_esm_getSubName(value, 'Promise');
  } else if (inspect_x_esm_isMapIterator(value)) {
    name = inspect_x_esm_getSubName(value, 'MapIterator');
    empty = true;
  } else if (inspect_x_esm_isSetIterator(value)) {
    name = inspect_x_esm_getSubName(value, 'SetIterator');
    empty = true;
  } else {
    name = inspect_x_esm_getSubName(value); // Unset the constructor to prevent "Object {...}" for ordinary objects.

    name = name === 'Object' ? inspect_x_esm_EMPTY_STRING : name;
    empty = true; // No other data than keys.
  }

  if (base) {
    base = " ".concat(base);
  } else if (name) {
    // Add constructor name if available
    braces[0] = "".concat(name, " ").concat(braces[0]);
  }

  empty = empty === true && keys.length < 1;

  if (empty) {
    return braces[0] + base + braces[1];
  }

  if (depth < 0) {
    if (is_regex_default()(value)) {
      return ctx.stylize(regexpToString(value), 'regexp');
    }

    if (is_array_x_esm(value)) {
      return ctx.stylize('[Array]', 'special');
    }

    return ctx.stylize('[Object]', 'special');
  }

  if (ctx.seen.has(value)) {
    return ctx.stylize('[Circular]', 'special');
  }

  ctx.seen.add(value);
  var out = fmtter([ctx, value, depth, visibleKeys, keys]);
  ctx.seen.delete(value);
  return inspect_x_esm_reduceToSingleString([out, base, braces, ctx.breakLength]);
};

$inspect = function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: new SetConstructor(),
    stylize: stylizeNoColor
  }; // legacy...

  /* eslint-disable-next-line prefer-rest-params */

  if (arguments.length >= 3 && typeof arguments[2] !== 'undefined') {
    /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
    ctx.depth = arguments[2];
  }
  /* eslint-disable-next-line prefer-rest-params */


  if (arguments.length >= 4 && typeof arguments[3] !== 'undefined') {
    /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
    ctx.colors = arguments[3];
  }

  if (is_boolean_object_default()(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } // Set default and user-specified options


  if (supportsGetSet) {
    ctx = object_assign_x_esm({}, $inspect.defaultOptions, ctx, opts);
  } else {
    ctx = object_assign_x_esm({}, inspectDefaultOptions, $inspect.defaultOptions, ctx, opts);
  }

  if (ctx.colors) {
    ctx.stylize = stylizeWithColor;
  }

  if (ctx.maxArrayLength === null) {
    ctx.maxArrayLength = Infinity;
  }

  return $fmtValue([ctx, obj, ctx.depth]);
};

if (supportsGetSet) {
  object_define_property_x_esm($inspect, 'defaultOptions', {
    get: function _get() {
      return inspectDefaultOptions;
    },
    set: function _set(options) {
      if (is_object_like_x_esm(options) === false) {
        throw new TypeError('"options" must be an object');
      }

      return object_assign_x_esm(inspectDefaultOptions, options);
    }
  });
} else {
  object_define_properties_x_esm($inspect, {
    defaultOptions: {
      value: object_assign_x_esm({}, inspectDefaultOptions),
      writable: true
    }
  });
}

object_define_properties_x_esm($inspect, {
  // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
  colors: {
    value: {
      black: [30, 39],
      blue: [34, 39],
      bold: [1, 22],
      cyan: [36, 39],
      green: [32, 39],
      grey: [90, 39],
      inverse: [7, 27],
      italic: [3, 23],
      magenta: [35, 39],
      red: [31, 39],
      underline: [4, 24],
      white: [37, 39],
      yellow: [33, 39]
    }
  },
  custom: {
    value: customInspectSymbol
  },
  // Don't use 'blue' not visible on cmd.exe
  styles: {
    value: {
      boolean: 'yellow',
      date: 'magenta',
      // name: intentionally not styling
      null: 'bold',
      number: 'yellow',
      regexp: 'red',
      special: 'cyan',
      string: 'green',
      symbol: 'green',
      undefined: 'grey'
    }
  }
});
var ins = $inspect;
/* harmony default export */ var inspect_x_esm = __webpack_exports__["default"] = (ins);



/***/ })
/******/ ]);
});
//# sourceMappingURL=inspect-x.js.map