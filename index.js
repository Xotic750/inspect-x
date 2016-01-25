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
 * An implementation of node's ES6 inspect module.
 * Return a string representation of object, which is useful for debugging.
 * An optional options object may be passed that alters certain aspects of the
 * fmtted string:
 * - showHidden - if true then the object's non-enumerable and symbol properties
 * will be shown too. Defaults to false.
 * - depth - tells inspect how many times to recurse while fmtting the
 * object. This is useful for inspecting large complicated objects.
 * Defaults to 2. To make it recurse indefinitely pass null.
 * - colors - if true, then the out will be styled with ANSI color codes.
 * Defaults to false. Colors are customizable, see below.
 * - customInspect - if false, then custom inspect(depth, opts) functions
 * defined on the objects being inspected won't be called. Defaults to true.
 *
 * <h2>Customizing inspect colors</h2>
 * Color out (if enabled) of inspect is customizable globally
 * via `inspect.styles` and `inspect.colors` objects.
 *
 * The `inspect.styles` is a map assigning each style a color
 * from `inspect.colors`. Highlighted styles and their default values are:
 * - number (yellow)
 * - boolean (yellow)
 * - string (green)
 * - date (magenta)
 * - regexp (red)
 * - null (bold)
 * - undefined (grey)
 * - special - only function at this time (cyan)
 * - name (intentionally no styling)
 *
 * Predefined color codes are:
 * - white
 * - grey
 * - black
 * - blue
 * - cyan
 * - green
 * - magenta
 * - red
 * - yellow.
 *
 * There are also:
 *  - bold
 *  - italic
 *  - underline
 *  - inverse
 *
 * <h2>Custom inspect() function on Objects</h2>
 * Objects also may define their own `inspect(depth)` function which `inspect`
 * will invoke and use the result of when inspecting the object.
 *
 * You may also return another Object entirely, and the returned String will
 * be fmtted according to the returned Object. This is similar to
 * how JSON.stringify() works.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
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
 * @version 1.0.11
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @see https://nodejs.org/api/util.html#util_util_inspect_object_options
 * @module inspect-x
 */

/*jslint maxlen:80, es6:true, this:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:false, esnext:true, plusplus:true, maxparams:false, maxdepth:false,
  maxstatements:false, maxcomplexity:false */

/*global require, module */

;(function () {
  'use strict';

  var isFunction = require('is-function-x');
  var isRegExp = require('is-regex');
  var define = require('define-properties-x');
  var isDate = require('is-date-object');
  var isArrayBuffer = require('is-array-buffer-x');
  var isSet = require('is-set-x');
  var isMap = require('is-map-x');
  var isTypedArray = require('is-typed-array');
  var isDataView = require('is-data-view-x');
  var isPrimitive = require('is-primitive');
  var isUndefined = require('validate.io-undefined');
  var isNil = require('is-nil-x');
  var isNull = require('lodash.isnull');
  var isError = require('is-error-x');
  var isObjectLike = require('is-object-like-x');
  var isPromise = require('is-promise');
  var isString = require('is-string');
  var isNumber = require('is-number-object');
  var isBoolean = require('is-boolean-object');
  var getFunctionName = require('get-function-name-x');
  var hasSymbolSupport = require('has-symbol-support-x');
  var reSingle = new RegExp(
    '\\{[' + require('white-space-x')(false, true) + ']+\\}'
  );
  var hasSet = typeof Set === 'function' && isSet(new Set());
  var testSet = hasSet && new Set(['SetSentinel']);
  var sForEach = hasSet && Set.prototype.forEach;
  var sValues = hasSet && Set.prototype.values;
  var hasMap = typeof Map === 'function' && isMap(new Map());
  var testMap = hasMap && new Map([
    [1, 'MapSentinel']
  ]);
  var mForEach = hasMap && Map.prototype.forEach;
  var mValues = hasMap && Map.prototype.values;
  var pSymToStr = hasSymbolSupport && Symbol.prototype.toString;
  var eToStr = Error.prototype.toString;
  var bToStr = Boolean.prototype.toString;
  var nToStr = Number.prototype.toString;
  var rToStr = RegExp.prototype.toString;
  var dToISOStr = Date.prototype.toISOString;
  var sValueOf = String.prototype.valueOf;
  var bValueOf = Boolean.prototype.valueOf;
  var nValueOf = Number.prototype.valueOf;
  var pUnshift = Array.prototype.unshift;
  var pPush = Array.prototype.push;
  var pPop = Array.prototype.pop;
  var pIndexOf = Array.prototype.indexOf;
  var pReduce = Array.prototype.reduce;
  var pJoin = Array.prototype.join;
  var pForEach = Array.prototype.forEach;
  var pSplice = Array.prototype.splice;
  var aSlice = Array.prototype.slice;
  var pReplace = String.prototype.replace;
  var pTest = RegExp.prototype.test;
  var sSlice = String.prototype.slice;
  var sIncludes = String.prototype.includes;
  var $stringify = JSON.stringify;
  var $keys = Object.keys;
  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var $getPrototypeOf = Object.getPrototypeOf;
  var $ownKeys = Reflect.ownKeys;
  var $is = Object.is;
  var $assign = Object.assign;
  var $isArray = Array.isArray;
  var $String = String;
  var $Object = Object;
  var bpe = 'BYTES_PER_ELEMENT';
  var inspectIt, fmtValueIt;

  function isBooleanType(arg) {
    return typeof arg === 'boolean';
  }

  function isNumberType(arg) {
    return typeof arg === 'number';
  }

  function isStringType(arg) {
    return typeof arg === 'string';
  }

  function isSymbolType(arg) {
    return typeof arg === 'symbol';
  }

  function isMapIterator(value) {
    if (!hasMap || !isObjectLike(value)) {
      return false;
    }
    try {
      return value.next.call(mValues.call(testMap)).value === 'MapSentinel';
    } catch (ignore) {}
    return false;
  }

  function isSetIterator(value) {
    if (!hasSet || !isObjectLike(value)) {
      return false;
    }
    try {
      return value.next.call(sValues.call(testSet)).value === 'SetSentinel';
    } catch (ignore) {}
    return false;
  }

  function includes(arr, value) {
    return pIndexOf.call(arr, value) > -1;
  }

  function filterIndexes(keys, length) {
    var i = keys.length - 1;
    while (i > -1) {
      var key = keys[i];
      if (key > -1 && key % 1 === 0 && key < length) {
        pSplice.call(keys, i, 1);
      }
      i -= 1;
    }
  }

  function pushUniq(arr, value) {
    if (!includes(arr, value)) {
      pPush.call(arr, value);
    }
  }

  function unshiftUniq(arr, value) {
    var index = pIndexOf.call(arr, value);
    if (index > -1) {
      pSplice.call(arr, index, 1);
    }
    pUnshift.call(arr, value);
  }

  function stylizeWithColor(str, styleType) {
    var style = inspectIt.styles[styleType];
    if (style) {
      var colors = inspectIt.colors[style];
      return '\u001b[' + colors[0] + 'm' + str + '\u001b[' + colors[1] + 'm';
    }
    return str;
  }

  function stylizeNoColor(str) {
    return str;
  }

  function getNameSep(obj) {
    var name = getFunctionName(obj);
    return name ? ': ' + name : name;
  }

  function each(arrayLike, callback) {
    var l = arrayLike.length;
    var i = 0;
    while (i < l) {
      callback(arrayLike[i], i);
      i += 1;
    }
  }

  function collectionEach(collection, callback) {
    if (isMap(collection)) {
      mForEach.call(collection, callback);
    } else if (isSet(collection)) {
      sForEach.call(collection, callback);
    }
  }

  function getConstructorOf(obj) {
    var maxLoop = 100;
    while (!isNil(obj) && maxLoop > -1) {
      obj = $Object(obj);
      var descriptor = $getOwnPropertyDescriptor(obj, 'constructor');
      if (descriptor && descriptor.value) {
        return descriptor.value;
      }
      obj = $getPrototypeOf(obj);
      maxLoop -= 1;
    }
    return null;
  }

  function fmtNumber(ctx, value) {
    // Format -0 as '-0'.
    return ctx.stylize($is(value, -0) ? '-0' : nToStr.call(value), 'number');
  }

  function fmtPrimitive(ctx, value) {
    if (isNil(value)) {
      var str = $String(value);
      return ctx.stylize(str, str);
    }
    if (isStringType(value)) {
      var simple = pReplace.call($stringify(value), /^"|"$/g, '');
      simple = pReplace.call(simple, /'/g, '\\\'');
      simple = pReplace.call(simple, /\\"/g, '"');
      return ctx.stylize('\'' + simple + '\'', 'string');
    }
    if (isNumberType(value)) {
      return fmtNumber(ctx, value);
    }
    if (isBooleanType(value)) {
      return ctx.stylize(bToStr.call(value), 'boolean');
    }
    // es6 symbol primitive
    if (isSymbolType(value)) {
      return ctx.stylize(pSymToStr.call(value), 'symbol');
    }
  }

  function fmtPrimNoColor(ctx, value) {
    var stylize = ctx.stylize;
    ctx.stylize = stylizeNoColor;
    var str = fmtPrimitive(ctx, value);
    ctx.stylize = stylize;
    return str;
  }

  function recurse(depth) {
    return isNull(depth) ? null : depth - 1;
  }

  /*
  function isCollection(value) {
    return isSet(value) || isMap(value);
  }
  */

  function isDigits(key) {
    return pTest.call(/^\d+$/, key);
  }

  function fmtProp(ctx, value, depth, visibleKeys, key, arr) {
    var desc = $getOwnPropertyDescriptor(value, key) || {
      value: value[key]
    };

    /*
    // this is a fix for broken FireFox, should not be needed with es6-shim
    if (key === 'size' && isCollection(value) && isFunction(value.size)) {
      desc.value = value.size();
    }
    */

    var name;
    if (!includes(visibleKeys, key)) {
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
    } else if (!includes(ctx.seen, desc.value)) {
      str = fmtValueIt(ctx, desc.value, recurse(depth));
      if (sIncludes.call(str, '\n')) {
        str = pReplace.apply(str, arr ? [/\n/g, '\n  '] : [/(^|\n)/g, '\n   ']);
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }

    if (isUndefined(name)) {
      if (arr && isDigits(key)) {
        return str;
      }
      name = $stringify(key);
      if (pTest.call(/^"[\w$]+"$/, name)) {
        name = ctx.stylize(sSlice.call(name, 1, -1), 'name');
      } else {
        name = pReplace.call(name, /'/g, '\\\'');
        name = pReplace.call(name, /\\"/g, '"');
        name = pReplace.call(name, /(^"|"$)/g, '\'');
        name = pReplace.call(name, /\\\\/g, '\\');
        name = ctx.stylize(name, 'string');
      }
    }
    return name + ': ' + str;
  }

  function fmtObject(ctx, value, depth, visibleKeys, keys) {
    var out = [];
    pForEach.call(keys, function (key) {
      pPush.call(out, fmtProp(ctx, value, depth, visibleKeys, key, false));
    });
    return out;
  }

  function fmtArray(ctx, value, depth, visibleKeys, keys) {
    var out = [];
    each(value, function (unused, index) {
      pPush.call(
        out,
        index in value ?
          fmtProp(ctx, value, depth, visibleKeys, nToStr.call(index), true) :
          ''
      );
    });
    pForEach.call(keys, function (key) {
      if (isSymbolType(key) || !isDigits(key)) {
        pPush.call(out, fmtProp(ctx, value, depth, visibleKeys, key, true));
      }
    });
    return out;
  }

  function fmtTypedArray(ctx, value, depth, visibleKeys, keys) {
    var out = [];
    each(value, function (item) {
      pPush.call(out, fmtNumber(ctx, item));
    });
    pForEach.call(keys, function (key) {
      if (isSymbolType(key) || !isDigits(key)) {
        pPush.call(out, fmtProp(ctx, value, depth, visibleKeys, key, true));
      }
    });
    return out;
  }

  function fmtSet(ctx, value, depth, visibleKeys, keys) {
    var out = [];
    collectionEach(value, function (v) {
      pPush.call(out, fmtValueIt(ctx, v, recurse(depth)));
    });
    pForEach.call(keys, function (key) {
      pPush.call(out, fmtProp(ctx, value, depth, visibleKeys, key, false));
    });
    return out;
  }

  function fmtMap(ctx, value, depth, visibleKeys, keys) {
    var out = [];
    collectionEach(value, function (v, k) {
      var r = recurse(depth);
      pPush.call(out, fmtValueIt(ctx, k, r) + ' => ' + fmtValueIt(ctx, v, r));
    });
    pForEach.call(keys, function (key) {
      pPush.call(out, fmtProp(ctx, value, depth, visibleKeys, key, false));
    });
    return out;
  }

  function reduceToSingleString(out, base, braces) {
    var length = pReduce.call(out, function (prev, cur) {
      return prev + pReplace.call(cur, /\u001b\[\d\d?m/g, '').length + 1;
    }, 0);
    var result;
    if (length > 60) {
      result = braces[0] +
        // If the opening "brace" is too large, like in the case of "Set {",
        // we need to force the first item to be on the next line or the
        // items will not line up correctly.
        (base === '' && braces[0].length === 1 ? '' : base + '\n ') + ' ' +
        pJoin.call(out, ',\n  ') + ' ' + braces[1];
    } else {
      result = braces[0] + base + ' ' + pJoin.call(out, ', ') + ' ' + braces[1];
    }
    return pReplace.call(result, reSingle, '{}');
  }

  fmtValueIt = function fmtValue(ctx, value, depth) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (ctx.customInspect && !isPrimitive(value) &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== inspectIt &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {

      var ret = value.inspect(depth, ctx);
      if (!isStringType(ret)) {
        return fmtValue(ctx, ret, depth);
      }
      return ret;
    }
    // Primitive types cannot have properties
    var primitive = fmtPrimitive(ctx, value);
    if (primitive) {
      return primitive;
    }
    // Look up the keys of the object.
    var visibleKeys = $keys(value);
    var keys;
    if (ctx.showHidden) {
      keys = $ownKeys(value);
      if (isError(value)) {
        if (!includes(visibleKeys, 'message') && !includes(keys, 'message')) {
          unshiftUniq(keys, 'message');
        }
        /*
        if (!includes(visibleKeys, 'name') && !includes(keys, 'name')) {
          unshiftUniq(keys, 'name');
        }
        */
      }
    } else {
      keys = aSlice.call(visibleKeys);
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
          '[String: ' + fmtPrimNoColor(ctx, sValueOf.call(value)) + ']',
          'string'
        );
      }
      if (isNumber(value)) {
        return ctx.stylize(
          '[Number: ' + fmtPrimNoColor(ctx, nValueOf.call(value)) + ']',
          'number'
        );
      }
      if (isBoolean(value)) {
        return ctx.stylize(
          '[Boolean: ' + fmtPrimNoColor(ctx, bValueOf.call(value)) + ']',
          'boolean'
        );
      }
      if (isFunction(value)) {
        return ctx.stylize('[Function' + getNameSep(value) + ']', 'special');
      }
      if (isRegExp(value)) {
        return ctx.stylize(rToStr.call(value), 'regexp');
      }
      if (isDate(value)) {
        return ctx.stylize(dToISOStr.call(value), 'date');
      }
      if (isError(value)) {
        return '[' + eToStr.call(value) + ']';
      }
      // Fast path for ArrayBuffer. Can't do the same for DataView because it
      // has a non-primitive buffer property that we need to recurse for.
      if (isArrayBuffer(value)) {
        return 'ArrayBuffer { byteLength: ' +
          fmtNumber(ctx, value.byteLength) + ' }';
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
      base = '[String: ' + fmtPrimNoColor(ctx, sValueOf.call(value)) + ']';
    } else if (isNumber(value)) {
      // Make boxed primitive Numbers look like such
      base = '[Number: ' + fmtPrimNoColor(ctx, nValueOf.call(value)) + ']';
    } else if (isBoolean(value)) {
      // Make boxed primitive Booleans look like such
      base = '[Boolean: ' + fmtPrimNoColor(ctx, bValueOf.call(value)) + ']';
    } else if (isFunction(value)) {
      // Make functions say that they are functions
      base = '[Function' + getNameSep(value) + ']';
    } else if (isRegExp(value)) {
      // Make RegExps say that they are RegExps
      name = 'RegExp';
      base = rToStr.call(value);
    } else if (isDate(value)) {
      // Make dates with properties first say the date
      name = 'Date';
      base = dToISOStr.call(value);
    } else if (isError(value)) {
      // Make error with message first say the error
      base = '[' + eToStr.call(value) + ']';
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
      return isRegExp(value) ?
        ctx.stylize(rToStr.call(value), 'regexp') :
        ctx.stylize('[Object]', 'special');
    }
    pPush.call(ctx.seen, value);
    var out = fmtter(ctx, value, depth, visibleKeys, keys);
    pPop.call(ctx.seen);
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
  module.exports = inspectIt = function inspect(obj, opts) {
    // default options
    var ctx = {
      seen: [],
      stylize: stylizeNoColor
    };
    // legacy...
    if (arguments.length >= 3) {
      ctx.depth = arguments[2];
      if (arguments.length >= 4) {
        ctx.colors = arguments[3];
      }
    }
    if (isBooleanType(opts)) {
      // legacy...
      ctx.showHidden = opts;
    } else if (isObjectLike(opts)) {
      // got an "options" object
      $assign(ctx, opts);
    }
    // set default options
    if (isUndefined(ctx.showHidden)) {
      ctx.showHidden = false;
    }
    if (isUndefined(ctx.depth)) {
      ctx.depth = 2;
    }
    if (isUndefined(ctx.colors)) {
      ctx.colors = false;
    }
    if (isUndefined(ctx.customInspect)) {
      ctx.customInspect = true;
    }
    if (ctx.colors) {
      ctx.stylize = stylizeWithColor;
    }
    return fmtValueIt(ctx, obj, ctx.depth);
  };

  // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
  define.defineProperties(inspectIt, {
    colors: {},
    styles: {}
  });

  define.defineProperties(inspectIt.colors, {
    'bold': [1, 22],
    'italic': [3, 23],
    'underline': [4, 24],
    'inverse': [7, 27],
    'white': [37, 39],
    'grey': [90, 39],
    'black': [30, 39],
    'blue': [34, 39],
    'cyan': [36, 39],
    'green': [32, 39],
    'magenta': [35, 39],
    'red': [31, 39],
    'yellow': [33, 39]
  });

  // Don't use 'blue' not visible on cmd.exe
  define.defineProperties(inspectIt.styles, {
    'special': 'cyan',
    'number': 'yellow',
    'boolean': 'yellow',
    'undefined': 'grey',
    'null': 'bold',
    'string': 'green',
    'symbol': 'green',
    'date': 'magenta',
    // "name": intentionally not styling
    'regexp': 'red'
  });
}());
