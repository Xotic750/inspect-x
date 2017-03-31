/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/inspect-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/inspect-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/inspect-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/inspect-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/inspect-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/inspect-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/inspect-x" title="npm version">
 * <img src="https://badge.fury.io/js/inspect-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * An implementation of node's inspect module..
 *
 * @example
 * var util = require('inspect-x');
 *
 * var obj = { name: 'nate' };
 * obj.inspect = function(depth) {
 *   return '{' + this.name + '}';
 * };
 *
 * inspect(obj);
 *   // "{nate}"
 *
 * var obj = { foo: 'this will not show up in the inspect() out' };
 * obj.inspect = function(depth) {
 *   return { bar: 'baz' };
 * };
 *
 * inspect(obj);
 *   // "{ bar: 'baz' }"
 * @version 1.2.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @see https://nodejs.org/api/util.html#util_util_inspect_object_options
 * @module inspect-x
 */

/* eslint strict: 1, max-statements: 1, max-lines: 1, id-length: 1,
   complexity: 1, sort-keys: 1, no-multi-assign: 1, max-depth: 1 */

/* global require, module */

;(function () { // eslint-disable-line no-extra-semi

  'use strict';

  var isFunction = require('is-function-x');
  var isGeneratorFunction = require('is-generator-function');
  var isAsyncFunction = require('is-async-function-x');
  var isRegExp = require('is-regex');
  var define = require('define-properties-x');
  var isDate = require('is-date-object');
  var isArrayBuffer = require('is-array-buffer-x');
  var isSet = require('is-set-x');
  var isMap = require('is-map-x');
  var isTypedArray = require('is-typed-array');
  var isDataView = require('is-data-view-x');
  var isUndefined = require('validate.io-undefined');
  var isNil = require('is-nil-x');
  var isNull = require('lodash.isnull');
  var isError = require('is-error-x');
  var isObjectLike = require('is-object-like-x');
  var isPromise = require('is-promise');
  var isString = require('is-string');
  var isNumber = require('is-number-object');
  var isBoolean = require('is-boolean-object');
  var isNegZero = require('is-negative-zero');
  var isSymbol = require('is-symbol');
  var isPrimitive = require('is-primitive');
  var getFunctionName = require('get-function-name-x');
  var hasSymbolSupport = require('has-symbol-support-x');
  var hasOwnProperty = require('has-own-property-x');
  var toStringTag = require('to-string-tag-x');
  var reSingle = new RegExp('\\{[' + require('white-space-x').ws + ']+\\}');
  var hasSet = typeof Set === 'function' && isSet(new Set());
  var testSet = hasSet && new Set(['SetSentinel']);
  var sForEach = hasSet && Set.prototype.forEach;
  var sValues = hasSet && Set.prototype.values;
  var hasMap = typeof Map === 'function' && isMap(new Map());
  var testMap = hasMap && new Map([[1, 'MapSentinel']]);
  var mForEach = hasMap && Map.prototype.forEach;
  var mValues = hasMap && Map.prototype.values;
  var pSymToStr = hasSymbolSupport && Symbol.prototype.toString;
  var pSymValOf = hasSymbolSupport && Symbol.prototype.valueOf;
  var indexOf = require('index-of-x');
  var reduce = require('reduce');
  var forEach = require('foreach');
  var filter = require('lodash._arrayfilter');
  var $stringify = require('json3').stringify;
  var $keys = Object.keys || require('object-keys');
  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var $getPrototypeOf = Object.getPrototypeOf || function getPrototypeOf(object) {
    var proto = object.__proto__; // eslint-disable-line no-proto
    if (proto || isNull(proto)) {
      return proto;
    } else if (toStringTag(object.constructor) === '[object Function]') {
      return object.constructor.prototype;
    } else if (object instanceof Object) {
      return Object.prototype;
    } else {
      return null;
    }
  };
  var $getOwnPropertyNames = Object.getOwnPropertyNames;
  var $getOwnPropertySymbols = hasSymbolSupport && Object.getOwnPropertySymbols;
  var $propertyIsEnumerable = Object.prototype.propertyIsEnumerable;
  var $isArray = require('validate.io-array');
  var $includes = require('array-includes');
  var $create = Object.create || function create(prototype, properties) {
    var object;
    var T = function Type() {}; // An empty constructor.

    if (isNull(prototype)) {
      object = {};
    } else {
      if (!isNull(prototype) && isPrimitive(prototype)) {
        // In the native implementation `parent` can be `null`
        // OR *any* `instanceof Object`  (Object|Function|Array|RegExp|etc)
        // Use `typeof` tho, b/c in old IE, DOM elements are not `instanceof Object`
        // like they are in modern browsers. Using `Object.create` on DOM elements
        // is...err...probably inappropriate, but the native version allows for it.
        throw new TypeError('Object prototype may only be an Object or null'); // same msg as Chrome
      }
      T.prototype = prototype;
      object = new T();
      // IE has no built-in implementation of `Object.getPrototypeOf`
      // neither `__proto__`, but this manually setting `__proto__` will
      // guarantee that `Object.getPrototypeOf` will work as expected with
      // objects created using `Object.create`
      object.__proto__ = prototype; // eslint-disable-line no-proto
    }

    if (!isUndefined(properties)) {
      define.properties(object, properties);
    }

    return object;
  };
  var $assign = require('object.assign');
  var $isNaN = require('is-nan');
  var pRegExpToString = RegExp.prototype.toString;
  var pErrorToString = Error.prototype.toString;
  var pNumberToString = Number.prototype.toString;
  var pBooleanToString = Boolean.prototype.toString;
  var pToISOString = Date.prototype.toISOString;
  var toISOString;
  if (pToISOString) {
    toISOString = function (date) {
      return pToISOString.call(date);
    };
  } else {
    toISOString = function (date) {
      if (!isFinite(date) || !isFinite(date.getTime())) {
        // Adope Photoshop requires the second check.
        throw new RangeError('Date.prototype.toISOString called on non-finite value.');
      }

      var year = date.getUTCFullYear();
      var month = date.getUTCMonth();
      // see https://github.com/es-shims/es5-shim/issues/111
      year += Math.floor(month / 12);
      month = ((month % 12) + 12) % 12;

      // the date time string format is specified in 15.9.1.15.
      var result = [
        month + 1,
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      ];

      year = (year < 0 ? '-' : year > 9999 ? '+' : '') + ('00000' + Math.abs(year)).slice(year >= 0 && year <= 9999 ? -4 : -6);

      for (var i = 0; i < result.length; i += 1) {
        // pad months, days, hours, minutes, and seconds to have two digits.
        result[i] = ('00' + result[i]).slice(-2);
      }

      // pad milliseconds to have three digits.
      return year + '-' + result.slice(0, 2).join('-') + 'T' + result.slice(2).join(':') + '.' + ('000' + date.getUTCMilliseconds()).slice(-3) + 'Z';
    };
  }
  var $defineProperty = Object.defineProperty;
  var bpe = 'BYTES_PER_ELEMENT';
  var inspect;
  var fmtValue;

  var customInspectSymbol = hasSymbolSupport ? Symbol('inspect.custom') : '_inspect.custom_';

  var supportsGetSet;
  if ($defineProperty) {
    try {
      var testVar;
      var testObject = $defineProperty($create(null), 'defaultOptions', {
        get: function () {
          return testVar;
        },
        set: function (val) {
          testVar = val;
          return testVar;
        }
      });
      testObject.defaultOptions = 'test';
      supportsGetSet = testVar === 'test';
    } catch (ignore) {}
  }

  var $seal = Object.seal || function seal(obj) {
    return obj;
  };

  var inspectDefaultOptions = $seal($assign($create(null), {
    showHidden: false,
    depth: 2,
    colors: false,
    customInspect: true,
    showProxy: false,
    maxArrayLength: 100,
    breakLength: 60
  }));

  var isBooleanType = function (arg) {
    return typeof arg === 'boolean';
  };

  var isNumberType = function (arg) {
    return typeof arg === 'number';
  };

  var isStringType = function (arg) {
    return typeof arg === 'string';
  };

  var isSymbolType = function (arg) {
    return typeof arg === 'symbol';
  };

  var isMapIterator = function (value) {
    if (!hasMap || !isObjectLike(value)) {
      return false;
    }
    try {
      return value.next.call(mValues.call(testMap)).value === 'MapSentinel';
    } catch (ignore) {}
    return false;
  };

  var isSetIterator = function (value) {
    if (!hasSet || !isObjectLike(value)) {
      return false;
    }
    try {
      return value.next.call(sValues.call(testSet)).value === 'SetSentinel';
    } catch (ignore) {}
    return false;
  };

  var filterIndexes = function (keys, length) {
    var i = keys.length - 1;
    while (i > -1) {
      var key = keys[i];
      if (key > -1 && key % 1 === 0 && key < length && !isSymbolType(key)) {
        keys.splice(i, 1);
      }
      i -= 1;
    }
  };

  var pushUniq = function (arr, value) {
    if (!$includes(arr, value)) {
      arr.push(value);
    }
  };

  var unshiftUniq = function (arr, value) {
    var index = indexOf(arr, value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    arr.unshift(value);
  };

  var stylizeWithColor = function (str, styleType) {
    var style = inspect.styles[styleType];
    if (style) {
      var colors = inspect.colors[style];
      return '\u001b[' + colors[0] + 'm' + str + '\u001b[' + colors[1] + 'm';
    }
    return str;
  };

  var stylizeNoColor = function (str) {
    return str;
  };

  var getNameSep = function (obj) {
    var name = getFunctionName(obj);
    return name ? ': ' + name : name;
  };

  var collectionEach = function (collection, callback) {
    if (isMap(collection)) {
      mForEach.call(collection, callback);
    } else if (isSet(collection)) {
      sForEach.call(collection, callback);
    }
  };

  var getConstructorOf = function (obj) {
    var o = obj;
    var maxLoop = 100;
    while (!isNil(o) && maxLoop > -1) {
      o = Object(o);
      var descriptor = $getOwnPropertyDescriptor(o, 'constructor');
      if (descriptor && descriptor.value) {
        return descriptor.value;
      }
      o = $getPrototypeOf(o);
      maxLoop -= 1;
    }
    return null;
  };

  var fmtNumber = function (ctx, value) {
    // Format -0 as '-0'.
    return ctx.stylize(isNegZero(value) ? '-0' : pNumberToString.call(value), 'number');
  };

  var fmtPrimitive = function (ctx, value) {
    if (isNil(value)) {
      var str = String(value);
      return ctx.stylize(str, str);
    }
    if (isStringType(value)) {
      var simple = $stringify(value).replace(/^"|"$/g, '').replace(/'/g, '\\\'').replace(/\\"/g, '"');
      return ctx.stylize('\'' + simple + '\'', 'string');
    }
    if (isNumberType(value)) {
      return fmtNumber(ctx, value);
    }
    if (isBooleanType(value)) {
      return ctx.stylize(pBooleanToString.call(value), 'boolean');
    }
    // es6 symbol primitive
    if (isSymbolType(value)) {
      return ctx.stylize(pSymToStr.call(value), 'symbol');
    }
    return void 0;
  };

  var fmtPrimNoColor = function (ctx, value) {
    var stylize = ctx.stylize;
    ctx.stylize = stylizeNoColor;
    var str = fmtPrimitive(ctx, value);
    ctx.stylize = stylize;
    return str;
  };

  var recurse = function (depth) {
    return isNull(depth) ? null : depth - 1;
  };

  /*
  var isCollection = function (value) {
    return isSet(value) || isMap(value);
  };
  */

  var isDigits = function (key) {
    return (/^\d+$/).test(key);
  };

  var fmtProp = function (ctx, value, depth, visibleKeys, key, arr) {
    var desc = $getOwnPropertyDescriptor(value, key) || { value: value[key] };

    /*
    // this is a fix for broken FireFox, should not be needed with es6-shim
    if (key === 'size' && isCollection(value) && isFunction(value.size)) {
      desc.value = value.size();
    }
    */

    var name;
    if (!$includes(visibleKeys, key)) {
      if (key === bpe && !value[bpe] && isTypedArray(value)) {
        var constructor = getConstructorOf(value);
        if (constructor) {
          desc.value = constructor[bpe];
        }
      } else if (isSymbolType(key)) {
        name = '[' + ctx.stylize(pSymToStr.call(key), 'symbol') + ']';
      } else {
        name = '[' + key + ']';
      }
    }

    var str;
    if (desc.get) {
      str = ctx.stylize(desc.set ? '[Getter/Setter]' : '[Getter]', 'special');
    } else if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    } else if ($includes(ctx.seen, desc.value)) {
      str = ctx.stylize('[Circular]', 'special');
    } else {
      str = fmtValue(ctx, desc.value, recurse(depth));
      if (str.indexOf('\n') > -1) {
        var rx = arr ? /\n/g : /(^|\n)/g;
        var rStr = arr ? '\n  ' : '\n   ';
        str = str.replace(rx, rStr);
      }
    }

    if (isUndefined(name)) {
      if (arr && isDigits(key)) {
        return str;
      }
      name = $stringify(key);
      if (/^"[\w$]+"$/.test(name)) {
        name = ctx.stylize(name.slice(1, -1), 'name');
      } else {
        name = name.replace(/'/g, '\\\'').replace(/\\"/g, '"').replace(/(^"|"$)/g, '\'').replace(/\\\\/g, '\\');
        name = ctx.stylize(name, 'string');
      }
    }
    return name + ': ' + str;
  };

  var fmtObject = function (ctx, value, depth, visibleKeys, keys) {
    var out = [];
    forEach(keys, function (key) {
      out.push(fmtProp(ctx, value, depth, visibleKeys, key, false));
    });
    return out;
  };

  var fmtArray = function (ctx, value, depth, visibleKeys, keys) {
    var output = [];
    var visibleLength = 0;
    var index = 0;
    while (index < value.length && visibleLength < ctx.maxArrayLength) {
      var emptyItems = 0;
      while (index < value.length && !hasOwnProperty(value, pNumberToString.call(index))) {
        emptyItems += 1;
        index += 1;
      }
      if (emptyItems > 0) {
        var ending = emptyItems > 1 ? 's' : '';
        var message = '<' + emptyItems + ' empty item' + ending + '>';
        output.push(ctx.stylize(message, 'undefined'));
      } else {
        output.push(fmtProp(ctx, value, depth, visibleKeys, pNumberToString.call(index), true));
        index += 1;
      }
      visibleLength += 1;
    }
    var remaining = value.length - index;
    if (remaining > 0) {
      output.push('... ' + remaining + ' more item' + (remaining > 1 ? 's' : ''));
    }
    forEach(keys, function (key) {
      if (isSymbolType(key) || !isDigits(key)) {
        output.push(fmtProp(ctx, value, depth, visibleKeys, key, true));
      }
    });
    return output;
  };

  var fmtTypedArray = function (ctx, value, depth, visibleKeys, keys) {
    var maxLength = Math.min(Math.max(0, ctx.maxArrayLength), value.length);
    var remaining = value.length - maxLength;
    var output = new Array(maxLength);
    for (var i = 0; i < maxLength; i += 1) {
      output[i] = fmtNumber(ctx, value[i]);
    }
    if (remaining > 0) {
      output.push('... ' + remaining + ' more item' + (remaining > 1 ? 's' : ''));
    }
    forEach(keys, function (key) {
      if (isSymbolType(key) || !isDigits(key)) {
        output.push(fmtProp(ctx, value, depth, visibleKeys, key, true));
      }
    });
    return output;
  };

  var fmtSet = function (ctx, value, depth, visibleKeys, keys) {
    var out = [];
    collectionEach(value, function (v) {
      out.push(fmtValue(ctx, v, recurse(depth)));
    });
    forEach(keys, function (key) {
      out.push(fmtProp(ctx, value, depth, visibleKeys, key, false));
    });
    return out;
  };

  var fmtMap = function (ctx, value, depth, visibleKeys, keys) {
    var out = [];
    collectionEach(value, function (v, k) {
      var r = recurse(depth);
      out.push(fmtValue(ctx, k, r) + ' => ' + fmtValue(ctx, v, r));
    });
    forEach(keys, function (key) {
      out.push(fmtProp(ctx, value, depth, visibleKeys, key, false));
    });
    return out;
  };

  var reduceToSingleString = function (out, base, braces) {
    var length = reduce(out, function (prev, cur) {
      return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
    }, 0);
    var result;
    if (length > 60) {
      // If the opening "brace" is too large, like in the case of "Set {",
      // we need to force the first item to be on the next line or the
      // items will not line up correctly.
      var layoutBase = base === '' && braces[0].length === 1 ? '' : base + '\n ';
      result = braces[0] + layoutBase + ' ' + out.join(',\n  ') + ' ' + braces[1];
    } else {
      result = braces[0] + base + ' ' + out.join(', ') + ' ' + braces[1];
    }
    return result.replace(reSingle, '{}');
  };

  var fmtDate = function (value) {
    return $isNaN(value.getTime()) ? 'Invalid Date' : toISOString(value);
  };

  var fmtError = function (value) {
    return value.stack || '[' + pErrorToString.call(value) + ']';
  };

  fmtValue = function (ctx, value, depth) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (ctx.customInspect && value) {
      var maybeCustomInspect = value[customInspectSymbol] || value.inspect;
      if (isFunction(maybeCustomInspect)) {
        // Filter out the util module, its inspect function is special
        if (maybeCustomInspect !== inspect) {
          // Also filter out any prototype objects using the circular check.
          if (!(value.constructor && value.constructor.prototype === value)) {
            var ret = maybeCustomInspect.call(value, depth, ctx);
            // If the custom inspection method returned `this`, don't go into
            // infinite recursion.
            if (ret !== value) {
              return isStringType(ret) ? ret : fmtValue(ctx, ret, depth);
            }
          }
        }
      }
    }

    // Primitive types cannot have properties
    var primitive = fmtPrimitive(ctx, value);
    if (primitive) {
      return primitive;
    }

    // Look up the keys of the object.
    var keys = $keys(value);
    var visibleKeys = keys;
    var symbolKeys = $getOwnPropertySymbols ? $getOwnPropertySymbols(value) : [];
    var enumSymbolKeys = filter(symbolKeys, function (key) {
      return $propertyIsEnumerable.call(value, key);
    });
    keys = keys.concat(enumSymbolKeys);

    if (ctx.showHidden) {
      keys = $getOwnPropertyNames(value).concat(symbolKeys);
      if (isError(value)) {
        if (!$includes(visibleKeys, 'message') && !$includes(keys, 'message')) {
          unshiftUniq(keys, 'message');
        }
        /*
        if (!includes(visibleKeys, 'name') && !includes(keys, 'name')) {
          unshiftUniq(keys, 'name');
        }
        */
      }
    }

    if (isString(value)) {
      // for boxed Strings, we have to remove the 0-n indexed entries,
      // since they just noisey up the out and are redundant
      filterIndexes(keys, value.length);
      filterIndexes(visibleKeys, value.length);
    } else if (isArrayBuffer(value)) {
      filterIndexes(keys, value.byteLength);
      filterIndexes(visibleKeys, value.byteLength);
    }

    // Some type of object without properties can be shortcutted.
    if (keys.length === 0) {
      // This could be a boxed primitive (new String(), etc.)
      if (isString(value)) {
        return ctx.stylize(
          '[String: ' + fmtPrimNoColor(ctx, value.valueOf()) + ']',
          'string'
        );
      }
      if (isNumber(value)) {
        return ctx.stylize(
          '[Number: ' + fmtPrimNoColor(ctx, value.valueOf()) + ']',
          'number'
        );
      }
      if (isBoolean(value)) {
        return ctx.stylize(
          '[Boolean: ' + fmtPrimNoColor(ctx, value.valueOf()) + ']',
          'boolean'
        );
      }
      if (isSymbol(value)) {
        return ctx.stylize(
          '[Symbol: ' + fmtPrimNoColor(ctx, pSymValOf.call(value)) + ']',
           'symbol'
        );
      }
      if (isAsyncFunction(value)) {
        return ctx.stylize('[AsyncFunction' + getNameSep(value) + ']', 'special');
      }
      if (isGeneratorFunction(value)) {
        return ctx.stylize('[GeneratorFunction' + getNameSep(value) + ']', 'special');
      }
      if (isFunction(value)) {
        return ctx.stylize('[Function' + getNameSep(value) + ']', 'special');
      }
      if (isRegExp(value)) {
        return ctx.stylize(pRegExpToString.call(value), 'regexp');
      }
      if (isDate(value)) {
        return ctx.stylize(fmtDate(value), 'date');
      }
      if (isError(value)) {
        return fmtError(value);
      }
      // Fast path for ArrayBuffer. Can't do the same for DataView because it
      // has a non-primitive buffer property that we need to recurse for.
      if (isArrayBuffer(value)) {
        return 'ArrayBuffer { byteLength: ' + fmtNumber(ctx, value.byteLength) + ' }';
      }
      if (isMapIterator(value)) {
        return 'MapIterator {}';
      }
      if (isSetIterator(value)) {
        return 'SetIterator {}';
      }
      if (isPromise(value)) {
        return 'Promise {}';
      }
    }
    var name = getFunctionName(getConstructorOf(value));
    var base = '';
    var empty = false;
    var braces = ['{', '}'];
    var fmtter = fmtObject;
    // We can't compare constructors for various objects using a comparison
    // like `constructor === Array` because the object could have come from a
    // different context and thus the constructor won't match. Instead we check
    // the constructor names (including those up the prototype chain where
    // needed) to determine object types.
    if (isString(value)) {
      // Make boxed primitive Strings look like such
      base = '[String: ' + fmtPrimNoColor(ctx, value.valueOf()) + ']';
    } else if (isNumber(value)) {
      // Make boxed primitive Numbers look like such
      base = '[Number: ' + fmtPrimNoColor(ctx, value.valueOf()) + ']';
    } else if (isBoolean(value)) {
      // Make boxed primitive Booleans look like such
      base = '[Boolean: ' + fmtPrimNoColor(ctx, value.valueOf()) + ']';
    } else if (isFunction(value)) {
      // Make functions say that they are functions
      base = '[Function' + getNameSep(value) + ']';
    } else if (isRegExp(value)) {
      // Make RegExps say that they are RegExps
      name = 'RegExp';
      base = pRegExpToString.call(value);
    } else if (isDate(value)) {
      // Make dates with properties first say the date
      name = 'Date';
      base = fmtDate(value);
    } else if (isError(value)) {
      // Make error with message first say the error
      base = fmtError(value);
    } else if ($isArray(value)) {
      // Unset the constructor to prevent "Array [...]" for ordinary arrays.
      name = name === 'Array' ? '' : name;
      braces = ['[', ']'];
      if (ctx.showHidden) {
        unshiftUniq(keys, 'length');
      }
      empty = value.length === 0;
      fmtter = fmtArray;
    } else if (isSet(value)) {
      name = 'Set';
      fmtter = fmtSet;
      // With `showHidden`, `length` will display as a hidden property for
      // arrays. For consistency's sake, do the same for `size`, even though
      // this property isn't selected by Object.getOwnPropertyNames().
      if (ctx.showHidden) {
        unshiftUniq(keys, 'size');
      }
      empty = value.size === 0;
    } else if (isMap(value)) {
      name = 'Map';
      fmtter = fmtMap;
      // With `showHidden`, `length` will display as a hidden property for
      // arrays. For consistency's sake, do the same for `size`, even though
      // this property isn't selected by Object.getOwnPropertyNames().
      if (ctx.showHidden) {
        unshiftUniq(keys, 'size');
      }
      empty = value.size === 0;
    } else if (isArrayBuffer(value)) {
      name = 'ArrayBuffer';
      unshiftUniq(keys, 'byteLength');
      pushUniq(visibleKeys, 'byteLength');
    } else if (isDataView(value)) {
      name = 'DataView';
      unshiftUniq(keys, 'buffer');
      unshiftUniq(keys, 'byteOffset');
      unshiftUniq(keys, 'byteLength');
      pushUniq(visibleKeys, 'byteLength');
      pushUniq(visibleKeys, 'byteOffset');
      pushUniq(visibleKeys, 'buffer');
    } else if (isTypedArray(value)) {
      braces = ['[', ']'];
      fmtter = fmtTypedArray;
      if (ctx.showHidden) {
        unshiftUniq(keys, 'buffer');
        unshiftUniq(keys, 'byteOffset');
        unshiftUniq(keys, 'byteLength');
        unshiftUniq(keys, 'length');
        unshiftUniq(keys, bpe);
      }
    } else if (isPromise(value)) {
      name = 'Promise';
    } else if (isMapIterator(value)) {
      name = 'MapIterator';
      empty = true;
    } else if (isSetIterator(value)) {
      name = 'SetIterator';
      empty = true;
    } else {
      // Unset the constructor to prevent "Object {...}" for ordinary objects.
      name = name === 'Object' ? '' : name;
      empty = true; // No other data than keys.
    }
    empty = empty === true && keys.length === 0;
    if (base) {
      base = ' ' + base;
    } else if (name) {
      // Add constructor name if available
      braces[0] = name + ' ' + braces[0];
    }
    if (empty) {
      return braces[0] + base + braces[1];
    }
    if (depth < 0) {
      if (isRegExp(value)) {
        return ctx.stylize(pRegExpToString.call(value), 'regexp');
      } else if ($isArray(value)) {
        return ctx.stylize('[Array]', 'special');
      } else {
        return ctx.stylize('[Object]', 'special');
      }
    }
    ctx.seen.push(value);
    var out = fmtter(ctx, value, depth, visibleKeys, keys);
    ctx.seen.pop();
    return reduceToSingleString(out, base, braces);
  };

  /**
   * Echos the value of a value. Trys to print the value out
   * in the best way possible given the different types.
   * Values may supply their own custom `inspect(depth, opts)` functions,
   * when called they receive the current depth in the recursive inspection,
   * as well as the options object passed to `inspect`.
   *
   * @param {Object} obj The object to print out.
   * @param {Object} [opts] Options object that alters the out.
   * @return {string} The string representation.
   * @example
   * var inspect = require('inspect-x');
   *
   * console.log(inspect(inspect, { showHidden: true, depth: null }));
   * //{ [Function: inspect]
   * //  [length]: 2,
   * //  [name]: 'inspect',
   * //  [prototype]: inspect { [constructor]: [Circular] },
   * //  [colors]:
   * //   { [bold]: [ 1, 22, [length]: 2 ],
   * //     [italic]: [ 3, 23, [length]: 2 ],
   * //     [underline]: [ 4, 24, [length]: 2 ],
   * //     [inverse]: [ 7, 27, [length]: 2 ],
   * //     [white]: [ 37, 39, [length]: 2 ],
   * //     [grey]: [ 90, 39, [length]: 2 ],
   * //     [black]: [ 30, 39, [length]: 2 ],
   * //     [blue]: [ 34, 39, [length]: 2 ],
   * //     [cyan]: [ 36, 39, [length]: 2 ],
   * //     [green]: [ 32, 39, [length]: 2 ],
   * //     [magenta]: [ 35, 39, [length]: 2 ],
   * //     [red]: [ 31, 39, [length]: 2 ],
   * //     [yellow]: [ 33, 39, [length]: 2 ] },
   * //  [styles]:
   * //   { [special]: 'cyan',
   * //     [number]: 'yellow',
   * //     [boolean]: 'yellow',
   * //     [undefined]: 'grey',
   * //     [null]: 'bold',
   * //     [string]: 'green',
   * //     [symbol]: 'green',
   * //     [date]: 'magenta',
   * //     [regexp]: 'red' } }
   */
  module.exports = inspect = function (obj, opts) {
    // default options
    var ctx = {
      seen: [],
      stylize: stylizeNoColor
    };
    // legacy...
    if (arguments.length >= 3 && !isUndefined(arguments[2])) {
      ctx.depth = arguments[2];
    }
    if (arguments.length >= 4 && !isUndefined(arguments[3])) {
      ctx.colors = arguments[3];
    }
    if (isBoolean(opts)) {
      // legacy...
      ctx.showHidden = opts;
    }
    // Set default and user-specified options
    if (supportsGetSet) {
      ctx = $assign($create(null), inspect.defaultOptions, ctx, opts);
    } else {
      ctx = $assign($create(null), inspectDefaultOptions, inspect.defaultOptions, ctx, opts);
    }
    if (ctx.colors) {
      ctx.stylize = stylizeWithColor;
    }
    if (isNull(ctx.maxArrayLength)) {
      ctx.maxArrayLength = Infinity;
    }
    return fmtValue(ctx, obj, ctx.depth);
  };

  if (supportsGetSet) {
    $defineProperty(inspect, 'defaultOptions', {
      get: function () {
        return inspectDefaultOptions;
      },
      set: function (options) {
        if (!isObjectLike(options)) {
          throw new TypeError('"options" must be an object');
        }
        return $assign(inspectDefaultOptions, options);
      }
    });
  } else {
    define.property(inspect, 'defaultOptions', $assign($create(null), inspectDefaultOptions));
  }

  define.property(inspect, 'custom', customInspectSymbol);

  // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
  define.property(inspect, 'colors', $assign($create(null), {
    bold: [1, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    white: [37, 39],
    grey: [90, 39],
    black: [30, 39],
    blue: [34, 39],
    cyan: [36, 39],
    green: [32, 39],
    magenta: [35, 39],
    red: [31, 39],
    yellow: [33, 39]
  }));

  // Don't use 'blue' not visible on cmd.exe
  define.property(inspect, 'styles', $assign($create(null), {
    special: 'cyan',
    number: 'yellow',
    'boolean': 'yellow',
    undefined: 'grey',
    'null': 'bold',
    string: 'green',
    symbol: 'green',
    date: 'magenta',
    // "name": intentionally not styling
    regexp: 'red'
  }));
}());
