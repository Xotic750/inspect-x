(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.returnExports = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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
 * @version 1.0.12
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

  var isFunction = _dereq_('is-function-x');
  var isRegExp = _dereq_('is-regex');
  var define = _dereq_('define-properties-x');
  var isDate = _dereq_('is-date-object');
  var isArrayBuffer = _dereq_('is-array-buffer-x');
  var isSet = _dereq_('is-set-x');
  var isMap = _dereq_('is-map-x');
  var isTypedArray = _dereq_('is-typed-array');
  var isDataView = _dereq_('is-data-view-x');
  var isPrimitive = _dereq_('is-primitive');
  var isUndefined = _dereq_('validate.io-undefined');
  var isNil = _dereq_('is-nil-x');
  var isNull = _dereq_('lodash.isnull');
  var isError = _dereq_('is-error-x');
  var isObjectLike = _dereq_('is-object-like-x');
  var isPromise = _dereq_('is-promise');
  var isString = _dereq_('is-string');
  var isNumber = _dereq_('is-number-object');
  var isBoolean = _dereq_('is-boolean-object');
  var getFunctionName = _dereq_('get-function-name-x');
  var hasSymbolSupport = _dereq_('has-symbol-support-x');
  var reSingle = new RegExp(
    '\\{[' + _dereq_('white-space-x')(false, true) + ']+\\}'
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

},{"define-properties-x":2,"get-function-name-x":4,"has-symbol-support-x":5,"is-array-buffer-x":7,"is-boolean-object":8,"is-data-view-x":9,"is-date-object":10,"is-error-x":11,"is-function-x":12,"is-map-x":13,"is-nil-x":14,"is-number-object":15,"is-object-like-x":16,"is-primitive":18,"is-promise":19,"is-regex":20,"is-set-x":21,"is-string":22,"is-typed-array":23,"lodash.isnull":24,"validate.io-undefined":28,"white-space-x":29}],2:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/define-properties-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/define-properties-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/define-properties-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/define-properties-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/define-properties-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/define-properties-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/define-properties-x" title="npm version">
 * <img src="https://badge.fury.io/js/define-properties-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * Based on the original work by Jordan Harband
 * {@link https://www.npmjs.com/package/define-properties `define-properties`}.
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
 * @version 1.0.2
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module define-properties-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:4, maxdepth:2,
  maxstatements:12, maxcomplexity:3 */

/*global module */

;(function () {
  'use strict';

  var hasSymbols = _dereq_('has-symbol-support-x');
  var isFunction = _dereq_('is-function-x');
  var isUndefined = _dereq_('validate.io-undefined');
  var pConcat = Array.prototype.concat;
  var pForEach = Array.prototype.forEach;
  var $keys = Object.keys;
  var $getOwnPropertySymbols = isFunction(Object.getOwnPropertySymbols) &&
    Object.getOwnPropertySymbols;
  var $defineProperty = isFunction(Object.defineProperty) &&
    Object.defineProperty;
  var supportsDescriptors = Boolean($defineProperty) && (function (unused) {
    var obj = {};
    try {
      $defineProperty(obj, 'x', {
        enumerable: false,
        value: obj
      });
      for (unused in obj) {
        /*jshint forin:false */
        return false;
      }
      return obj.x === obj;
    } catch (e) { /* this is IE 8. */
      return false;
    }
  })();

  /**
   * Method `defineProperty`.
   *
   * @private
   * @param {Object} object The object on which to define the property.
   * @param {string|Symbol} property The property name.
   * @param {*} value The value of the property.
   * @param {boolean} [force=false] If `true` then set property regardless.
   */
  function defineProperty(object, property, value, force) {
    if (property in object && !force) {
      return;
    }
    if (supportsDescriptors) {
      $defineProperty(object, property, {
        configurable: true,
        enumerable: false,
        value: value,
        writable: true
      });
    } else {
      object[property] = value;
    }
  }

  /**
   * Method `defineProperties`.
   *
   * @private
   * @param {Object} object The object on which to define the property.
   * @param {Object} map The object of properties.
   * @param {Object} [predicates] The object of property predicates.
   */
  function defineProperties(object, map, predicates) {
    var preds = isUndefined(predicates) ? {} : predicates;
    var props = $keys(map);
    if (hasSymbols && $getOwnPropertySymbols) {
      props = pConcat.call(props, $getOwnPropertySymbols(map));
    }
    pForEach.call(props, function (name) {
      var predicate = preds[name];
      defineProperty(
        object,
        name,
        map[name],
        isFunction(predicate) && predicate()
      );
    });
  }

  defineProperties(module.exports, {
    /**
     * Just like `defineProperties` but for defining a single non-enumerable
     * property. Useful in environments that do not
     * support `Computed property names`. This can be done
     * with `defineProperties`, but this method can read a little cleaner.
     *
     * @function
     * @param {Object} object The object on which to define the property.
     * @param {string|Symbol} property The property name.
     * @param {*} value The value of the property.
     * @param {boolean} [force=false] If `true` then set property regardless.
     * @example
     * var lib = require('define-properties-x');
     * var myString = 'something';
     * lib.defineProperty(obj, Symbol.iterator, function () {}, true);
     * lib.defineProperty(obj, myString, function () {}, true);
     */
    defineProperty: defineProperty,
    /**
     * Define multiple non-enumerable properties at once.
     * Uses `Object.defineProperty` when available; falls back to standard
     * assignment in older engines. Existing properties are not overridden.
     * Accepts a map of property names to a predicate that, when true,
     * force-overrides.
     *
     * @function
     * @param {Object} object The object on which to define the property.
     * @param {Object} map The object of properties.
     * @param {Object} [predicates] The object of property predicates.
     * @example
     * var lib = require('define-properties-x');
     * lib.defineProperties({
     *   a: 1,
     *   b: 2
     * }, {
     *   a: function () { return false; },
     *   b: function () { return true; }
     * });
     */
    defineProperties: defineProperties,
    /**
     * Boolean indicator as to whether the environments supports descriptors
     * or not.
     *
     * @type boolean
     * @example
     * var lib = require('define-properties-x');
     * lib.supportsDescriptors; // true or false
     */
    supportsDescriptors: supportsDescriptors
  });
}());

},{"has-symbol-support-x":5,"is-function-x":12,"validate.io-undefined":28}],3:[function(_dereq_,module,exports){

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


},{}],4:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/get-function-name-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/get-function-name-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/get-function-name-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/get-function-name-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/get-function-name-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/get-function-name-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/get-function-name-x" title="npm version">
 * <img src="https://badge.fury.io/js/get-function-name-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * getFunctionName module. Returns the name of the function.
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
 * @version 1.0.7
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module get-function-name-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:2,
  maxstatements:13, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var isFunction = _dereq_('is-function-x');
  var getFnName;

  if ((function test() {}).name !== 'test') {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var fToString = Function.prototype.toString;
    var pMatch = String.prototype.match;
    var pReplace = String.prototype.replace;
    var s = _dereq_('white-space-x')(false, true);
    var reName = new RegExp(
      '^[' + s + ']*(?:function|class)[' + s + ']*\\*?[' + s +
        ']+([\\w\\$]+)[' + s + ']*',
      'i'
    );
    getFnName = function getName(fn) {
      var name = pMatch.call(
        pReplace.call(fToString.call(fn), STRIP_COMMENTS, ' '),
        reName
      );
      return name && name[1] !== 'anonymous' ? name[1] : '';
    };
  } else {
    /*jshint evil:true */
    if ((new Function()).name === 'anonymous') {
      getFnName = function getName(fn) {
        return fn.name && fn.name !== 'anonymous' ? fn.name : '';
      };
    }
  }
  /**
   * This method returns the name of the function, or `undefined` if not
   * a function.
   *
   * @param {Function} fn The function to get the name of.
   * @return {undefined|string} The name of the function,  or `undefined` if
   *  not a function.
   * @example
   * var getFunctionName = require('get-function-name-x');
   *
   * getFunctionName(); // undefined
   * getFunctionName(Number.MIN_VALUE); // undefined
   * getFunctionName('abc'); // undefined
   * getFunctionName(true); // undefined
   * getFunctionName({ name: 'abc' }); // undefined
   * getFunctionName(function () {}); // ''
   * getFunctionName(new Function ()); // ''
   * getFunctionName(function test1() {}); // 'test1'
   * getFunctionName(function* test2() {}); // 'test2'
   * getFunctionName(class Test {}); // 'Test'
   */
  module.exports = function getFunctionName(fn) {
    if (!isFunction(fn)) {
      return;
    }
    return getFnName ? getFnName(fn) : fn.name;
  };
}());

},{"is-function-x":12,"white-space-x":29}],5:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/has-symbol-support-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/has-symbol-support-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/has-symbol-support-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/has-symbol-support-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/has-symbol-support-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/has-symbol-support-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/has-symbol-support-x" title="npm version">
 * <img src="https://badge.fury.io/js/has-symbol-support-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * hasSymbolSupport module. Tests if `Symbol` exists and creates the correct
 * type.
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
 * @version 1.0.7
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module has-symbol-support-x
 */

/*jslint maxlen:80, es6:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:false, esnext:true, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:1, maxcomplexity:1 */

/*global module */

;(function () {
  'use strict';

  /**
   * Indicates if `Symbol`exists and creates the correct type.
   * `true`, if it exists and creates the correct type, otherwise `false`.
   *
   * @type boolean
   */
  module.exports = typeof Symbol === 'function' && typeof Symbol() === 'symbol';
}());

},{}],6:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/has-to-string-tag-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/has-to-string-tag-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/has-to-string-tag-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/has-to-string-tag-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/has-to-string-tag-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/has-to-string-tag-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/has-to-string-tag-x" title="npm version">
 * <img src="https://badge.fury.io/js/has-to-string-tag-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * hasToStringTag tests if @@toStringTag is supported. `true` if supported.
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
 * @version 1.0.6
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module has-to-string-tag-x
 */

/*jslint maxlen:80, es6:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:false, esnext:true, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:1, maxcomplexity:1 */

/*global module */

;(function () {
  'use strict';

  /**
   * Indicates if `Symbol.toStringTag`exists and is the correct type.
   * `true`, if it exists and is the correct type, otherwise `false`.
   *
   * @type boolean
   */
  module.exports = _dereq_('has-symbol-support-x') &&
    typeof Symbol.toStringTag === 'symbol';
}());

},{"has-symbol-support-x":5}],7:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-array-buffer-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-array-buffer-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-array-buffer-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-array-buffer-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/is-array-buffer-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-array-buffer-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-array-buffer-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-array-buffer-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isArrayBuffer module. Detect whether or not an object is an Arraybuffer.
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
 * @version 1.0.9
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-array-buffer-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:2, maxdepth:3,
  maxstatements:14, maxcomplexity:6 */

/*global module */

;(function () {
  'use strict';

  var isObjectLike = _dereq_('is-object-like-x');
  var hasABuf = typeof ArrayBuffer === 'function';
  var toStringTag, aBufTag, bLength;

  if (hasABuf) {
    if (_dereq_('has-to-string-tag-x')) {
      try {
        bLength = Object.getOwnPropertyDescriptor(
          ArrayBuffer.prototype,
          'byteLength'
        ).get;
        bLength =
          typeof bLength.call(new ArrayBuffer(4)) === 'number' && bLength;
      } catch (ignore) {
        bLength = null;
      }
    }
    if (!bLength) {
      toStringTag = _dereq_('to-string-tag-x');
      aBufTag = '[object ArrayBuffer]';
    }
  }

  /**
   * Determine if an `object` is an `ArrayBuffer`.
   *
   * @param {*} object The object to test.
   * @return {boolean} `true` if the `object` is an `ArrayBuffer`,
   *  else false`.
   * @example
   * var isArrayBuffer = require('is-array-buffer-x');
   *
   * isArrayBuffer(new ArrayBuffer(4)); // true
   * isArrayBuffer(null); // false
   * isArrayBuffer([]); // false
   */
  module.exports = function isArrayBuffer(object) {
    if (!hasABuf || !isObjectLike(object)) {
      return false;
    }
    if (!bLength) {
      return toStringTag(object) === aBufTag;
    }
    try {
      return typeof bLength.call(object) === 'number';
    } catch (ignore) {}
    return false;
  };
}());

},{"has-to-string-tag-x":6,"is-object-like-x":16,"to-string-tag-x":26}],8:[function(_dereq_,module,exports){
'use strict';

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

},{}],9:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-data-view-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-data-view-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-data-view-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-data-view-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/is-data-view-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-data-view-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-data-view-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-data-view-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isDataView module. Detect whether or not an object is a DataView.
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
 * @version 1.0.10
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-data-view-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:3,
  maxstatements:17, maxcomplexity:6 */

/*global module */

;(function () {
  'use strict';

  var isObjectLike = _dereq_('is-object-like-x');
  var hasDView = typeof DataView === 'function';
  var getByteLength, legacyCheck;

  if (hasDView) {
    if (_dereq_('has-to-string-tag-x')) {
      try {
        getByteLength = Object.getOwnPropertyDescriptor(
          DataView.prototype,
          'byteLength'
        ).get;
        getByteLength = typeof getByteLength.call(
          new DataView(new ArrayBuffer(4))
        ) !== 'number' && getByteLength;
      } catch (ignore) {
        getByteLength = null;
      }
    }
    if (!getByteLength) {
      var toStringTag = _dereq_('to-string-tag-x');
      var dViewTag = '[object DataView]';
      if (toStringTag(new DataView(new ArrayBuffer(4))) === dViewTag) {
        legacyCheck = function byStringTag(object) {
          return toStringTag(object) === dViewTag;
        };
      } else {
        var isArrayBuffer = _dereq_('is-array-buffer-x');
        legacyCheck = function byDuckType(object) {
          return typeof object.byteLength === 'number' &&
            typeof object.byteOffset === 'number' &&
            typeof object.getFloat32 === 'function' &&
            typeof object.setFloat64 === 'function' &&
            isArrayBuffer(object.buffer);
        };
      }
    }
  }

  /**
   * Determine if an `object` is an `DataView`.
   *
   * @param {*} object The object to test.
   * @return {boolean} `true` if the `object` is a `DataView`, else `false`.
   * @example
   * var isDataView = require('is-data-view-x');
   * var ab = new ArrayBuffer(4);
   * var dv = new DataView(ab);
   *
   * isDataView(ab); // false
   * isDataView(true); // false
   * isDataView(dv); // true
   */
  module.exports = function isDataView(object) {
    if (!hasDView || !isObjectLike(object)) {
      return false;
    }
    if (legacyCheck) {
      return legacyCheck(object);
    }
    try {
      return typeof getByteLength.call(object) === 'number';
    } catch (ignore) {}
    return false;
  };
}());

},{"has-to-string-tag-x":6,"is-array-buffer-x":7,"is-object-like-x":16,"to-string-tag-x":26}],10:[function(_dereq_,module,exports){
'use strict';

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

},{}],11:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-error-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-error-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-error-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-error-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-error-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-error-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-error-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-error-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isError module. Detect whether a value is an error.
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
 * @version 1.0.9
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-error-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:2,
  maxstatements:10, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var toStringTag = _dereq_('to-string-tag-x');
  var isObjectLike = _dereq_('is-object-like');
  var $getPrototypeOf = Object.getPrototypeOf;
  var errorCheck = function checkIfError(value) {
    return toStringTag(value) === '[object Error]';
  };

  if (!errorCheck(Error.prototype)) {
    var errorProto = Error.prototype;
    var testStringTag = errorCheck;
    errorCheck = function checkIfError(value) {
      return value === errorProto || testStringTag(value);
    };
  }

  /**
   * Determine whether or not a given `value` is an `Error` type.
   *
   * @param {*} value The object to be tested.
   * @return {boolean} Returns `true` if `value` is an `Error` type,
   *  else `false`.
   * @example
   * var isError = require('is-error-x');
   *
   * isError(); // false
   * isError(Number.MIN_VALUE); // false
   * isError('abc'); // false
   * isError(new Error()); //true
   */
  module.exports = function isError(value) {
    if (!isObjectLike(value)) {
      return false;
    }
    var object = value;
    var maxLoop = 100;
    while (object && maxLoop > -1) {
      if (errorCheck(object)) {
        return true;
      }
      object = $getPrototypeOf(object);
      maxLoop -= 1;
    }
    return false;
  };
}());

},{"is-object-like":17,"to-string-tag-x":26}],12:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-function-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/is-function-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-function-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-function-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/is-function-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-function-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-function-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-function-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isFunction module. Determine whether a given value is a function object.
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
 * @version 1.0.2
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-function-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:8, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var fToString = Function.prototype.toString;
  var toStringTag = _dereq_('to-string-tag-x');
  var hasToStringTag = _dereq_('has-to-string-tag-x');
  var isPrimitive = _dereq_('is-primitive');
  var funcTag = '[object Function]';
  var genTag = '[object GeneratorFunction]';

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @private
   * @param {*} value The value to check.
   * @return {boolean} Returns `true` if `value` is correctly classified,
   * else `false`.
   */
  function tryFunctionObject(value) {
    try {
      fToString.call(value);
      return true;
    } catch (ignore) {}
    return false;
  }

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @param {*} value The value to check.
   * @return {boolean} Returns `true` if `value` is correctly classified,
   * else `false`.
   * @example
   * var isFunction = require('is-function-x');
   *
   * isFunction(); // false
   * isFunction(Number.MIN_VALUE); // false
   * isFunction('abc'); // false
   * isFunction(true); // false
   * isFunction({ name: 'abc' }); // false
   * isFunction(function () {}); // true
   * isFunction(new Function ()); // true
   * isFunction(function* test1() {}); // true
   * isFunction(function test2(a, b) {}); // true
   * isFunction(class Test {}); // true
   * isFunction((x, y) => {return this;}); // true
   */
  module.exports = function isFunction(value) {
    if (isPrimitive(value)) {
      return false;
    }
    if (hasToStringTag) {
      return tryFunctionObject(value);
    }
    var strTag = toStringTag(value);
    return strTag === funcTag || strTag === genTag;
  };
}());

},{"has-to-string-tag-x":6,"is-primitive":18,"to-string-tag-x":26}],13:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-map-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-map-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-map-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-map-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/is-map-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-map-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-map-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-map-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isMap module. Detect whether or not an object is an ES6 Map.
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
 * @version 1.0.9
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-map-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:2,
  maxstatements:8, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var isObjectLike, getSize;

  if (typeof Map === 'function') {
    try {
      getSize = Object.getOwnPropertyDescriptor(Map.prototype, 'size').get;
      getSize = typeof getSize.call(new Map()) === 'number' && getSize;
      isObjectLike = _dereq_('is-object-like-x');
    } catch (ignore) {
      getSize = null;
    }
  }

  /**
   * Determine if an `object` is a `Map`.
   *
   * @param {*} object The object to test.
   * @return {boolean} `true` if the `object` is a `Map`,
   *  else false`
   * @example
   * var isMap = require('is-map-x');
   * var m = new Map();
   *
   * isMap([]); // false
   * isMap(true); // false
   * isMap(m); // true
   */
  module.exports = function isMap(object) {
    if (!getSize || !isObjectLike(object)) {
      return false;
    }
    try {
      return typeof getSize.call(object) === 'number';
    } catch (ignore) {}
    return false;
  };
}());

},{"is-object-like-x":16}],14:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-nil-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-nil-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-nil-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-nil-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-nil-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-nil-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-nil-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-nil-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isNil module.
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
 * @version 1.0.6
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-nil-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:3, maxcomplexity:2 */

/*global module */

;(function () {
  'use strict';

  var isUndefined = _dereq_('validate.io-undefined');
  var isNull = _dereq_('lodash.isnull');

  /**
   * Checks if `value` is `null` or `undefined`.
   *
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
   * @example
   *
   * _.isNil(null);
   * // => true
   *
   * _.isNil(void 0);
   * // => true
   *
   * _.isNil(NaN);
   * // => false
   */
  module.exports = function isNil(value) {
    return isNull(value) || isUndefined(value);
  };
}());

},{"lodash.isnull":24,"validate.io-undefined":28}],15:[function(_dereq_,module,exports){
'use strict';

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

},{}],16:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-object-like-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-object-like-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-object-like-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-object-like-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-object-like-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-object-like-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-object-like-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-object-like-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * ES6 isObjectLike module.
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
 * @version 1.0.7
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-object-like-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:3, maxcomplexity:1 */

/*global module */

;(function () {
  'use strict';

  var isFunction = _dereq_('is-function-x');
  var isPrimitive = _dereq_('is-primitive');

  /**
   * Checks if `value` is object-like. A value is object-like if it's not a
   * primitive and not a function.
   *
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   * var isObjectLike = require('is-object-like-x');
   *
   * isObjectLike({});
   * // => true
   *
   * isObjectLike([1, 2, 3]);
   * // => true
   *
   * isObjectLike(_.noop);
   * // => false
   *
   * isObjectLike(null);
   * // => false
   */
  module.exports = function isObjectLike(value) {
    return !isPrimitive(value) && !isFunction(value);
  };
}());

},{"is-function-x":12,"is-primitive":18}],17:[function(_dereq_,module,exports){
'use strict'

module.exports = function isObjectLike (value) {
  return (typeof value === 'object' || typeof value === 'function') && value !== null
}

},{}],18:[function(_dereq_,module,exports){
/*!
 * is-primitive <https://github.com/jonschlinkert/is-primitive>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

// see http://jsperf.com/testing-value-is-primitive/7
module.exports = function isPrimitive(value) {
  return value == null || (typeof value !== 'function' && typeof value !== 'object');
};

},{}],19:[function(_dereq_,module,exports){
module.exports = isPromise;

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

},{}],20:[function(_dereq_,module,exports){
'use strict';

var regexExec = RegExp.prototype.exec;
var tryRegexExec = function tryRegexExec(value) {
	try {
		regexExec.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var regexClass = '[object RegExp]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isRegex(value) {
	if (typeof value !== 'object') { return false; }
	return hasToStringTag ? tryRegexExec(value) : toStr.call(value) === regexClass;
};

},{}],21:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-set-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-set-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-set-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-set-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/is-set-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-set-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-set-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-set-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isSet module. Detect whether or not an object is an ES6 SET.
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
 * @version 1.0.7
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-set-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:2,
  maxstatements:8, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var isObjectLike, getSize;

  if (typeof Set === 'function') {
    try {
      getSize = Object.getOwnPropertyDescriptor(Set.prototype, 'size').get;
      getSize = typeof getSize.call(new Set()) === 'number' && getSize;
      isObjectLike = _dereq_('is-object-like-x');
    } catch (ignore) {
      getSize = null;
    }
  }

  /**
   * Determine if an `object` is a `Set`.
   *
   * @param {*} object The object to test.
   * @return {boolean} `true` if the `object` is a `Set`,
   *  else false`
   * @example
   * var isSet = require('is-set-x');
   * var s = new Set();
   *
   * isSet([]); // false
   * isSet(true); // false
   * isSet(s); // true
   */
  module.exports = function isSet(object) {
    if (!getSize || !isObjectLike(object)) {
      return false;
    }
    try {
      return typeof getSize.call(object) === 'number';
    } catch (ignore) {}

    return false;
  };
}());

},{"is-object-like-x":16}],22:[function(_dereq_,module,exports){
'use strict';

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

},{}],23:[function(_dereq_,module,exports){
(function (global){
'use strict';

var forEach = _dereq_('foreach');

var toStr = Object.prototype.toString;
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

var typedArrays = {
	Float32Array: true,
	Float64Array: true,
	Int8Array: true,
	Int16Array: true,
	Int32Array: true,
	Uint8Array: true,
	Uint8ClampedArray: true,
	Uint16Array: true,
	Uint32Array: true
};

var slice = String.prototype.slice;
var toStrTags = {};
var gOPD = Object.getOwnPropertyDescriptor;
if (hasToStringTag && gOPD && Object.getPrototypeOf) {
	forEach(typedArrays, function (_, typedArray) {
		var arr = new global[typedArray]();
		var proto = Object.getPrototypeOf(arr);
		toStrTags[typedArray] = gOPD(proto, Symbol.toStringTag).get;
	});
}

var tryTypedArrays = function tryTypedArrays(value) {
	var anyTrue = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!anyTrue) {
			try {
				anyTrue = getter.call(value) === typedArray;
			} catch (e) {/**/}
		}
	});
	return anyTrue;
};

module.exports = function isTypedArray(value) {
	if (!value || typeof value !== 'object') { return false; }
	if (!hasToStringTag) { return !!typedArrays[slice.call(toStr.call(value), 8, -1)]; }
	if (!gOPD) { return false; }
	return tryTypedArrays(value);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"foreach":3}],24:[function(_dereq_,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is `null`.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
 * @example
 *
 * _.isNull(null);
 * // => true
 *
 * _.isNull(void 0);
 * // => false
 */
function isNull(value) {
  return value === null;
}

module.exports = isNull;

},{}],25:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/regexp-escape-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/regexp-escape-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/regexp-escape-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/regexp-escape-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/regexp-escape-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/regexp-escape-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/regexp-escape-x" title="npm version">
 * <img src="https://badge.fury.io/js/regexp-escape-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * regexpEscape module.
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
 * @version 1.0.1
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module regexp-escape-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:4, maxcomplexity:1 */

/*global module */

;(function () {
  'use strict';

  var $toString = _dereq_('to-string-x');
  var pReplace = String.prototype.replace;
  var syntaxChars = /[\^\$\\\.\*\+\?\(\)\[\]\{\}\|]/g;

  /**
   * Method to safely escape `RegExp` special tokens for use in `new RegExp`.
   *
   * @param {string} string The string to be escaped.
   * @return {string} The escaped string.
   * @example
   * var regexpEscape = require('regexp-escape-x');
   * var str = 'hello. how are you?';
   * var regex = new RegExp(regexpEscape(str), 'g');
   * String(regex); // '/hello\. how are you\?/g'
   */
  module.exports = function regexpEscape(string) {
    return pReplace.call($toString(string), syntaxChars, '\\$&');
  };
}());

},{"to-string-x":27}],26:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/to-string-tag-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/to-string-tag-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/to-string-tag-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/to-string-tag-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/to-string-tag-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/to-string-tag-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/to-string-tag-x" title="npm version">
 * <img src="https://badge.fury.io/js/to-string-tag-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * Get an object's @@toStringTag. Includes fixes to correct ES3 differences
 * for the following.
 * - undefined => '[object Undefined]'
 * - null => '[object Null]'
 *
 * No other fixes are included, so legacy `arguments` will
 * give `[object Object]`, and many older native objects
 * give `[object Object]`. There are also other environmental bugs
 * for example `RegExp` gives `[object Function]` and `Uint8Array`
 * gives `[object Object]` on certain engines. While these and more could
 * be fixed, it was decided that this should be a very raw version and it
 * is left to the coder to use other `is` implimentations for detection.
 * It is also worth noting that as of ES6 `Symbol.toStringTag` can be set on
 * an object and therefore can report any string that it wishes.
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
 * @version 1.0.7
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module to-string-tag-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:6, maxcomplexity:3 */

/*global module */

;(function () {
  'use strict';

  var pToString = Object.prototype.toString;
  var isNull = _dereq_('lodash.isnull');
  var isUndefined = _dereq_('validate.io-undefined');
  var nullTag = '[object Null]';
  var undefTag = '[object Undefined]';

  /**
   * The `toStringTag` method returns "[object type]", where type is the
   * object type.
   *
   * @param {*} value The object of which to get the object type string.
   * @return {string} The object type string.
   * @example
   * var o = new Object();
   *
   * toStringTag(o); // returns '[object Object]'
   */
  module.exports = function toStringTag(value) {
    if (isNull(value)) {
      return nullTag;
    }
    if (isUndefined(value)) {
      return undefTag;
    }
    return pToString.call(value);
  };
}());

},{"lodash.isnull":24,"validate.io-undefined":28}],27:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/to-string-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/to-string-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/to-string-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/to-string-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/to-string-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/to-string-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/to-string-x" title="npm version">
 * <img src="https://badge.fury.io/js/to-string-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * ToString module.
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
 * @version 1.0.1
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module to-string-x
 */

/*jslint maxlen:80, es6:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:false, esnext:true, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:3, maxcomplexity:2 */

/*global module */

;(function () {
  'use strict';

  var $String = String;

  /**
   * The abstract operation ToString converts argument to a value of type
   * String.
   *
   * @param {*} value The value to convert to a string.
   * @throws {TypeError} If `value` is a Symbol.
   * @return {string} The converted value.
   * @example
   * var $toString = require('to-string-x');
   *
   * $toString(); // 'undefined'
   * $toString(null); // 'null'
   * $toString('abc'); // 'abc'
   * $toString(true); // 'true'
   * $toString(Symbol('foo')); // TypeError
   * $toString(Symbol.iterator); // TypeError
   * $toString(Object(Symbol.iterator)); // TypeError
   */
  module.exports = function ToString(value) {
    if (typeof value === 'symbol') {
      throw new TypeError('Cannot convert a Symbol value to a string');
    }
    return $String(value);
  };
}());

},{}],28:[function(_dereq_,module,exports){
/**
*
*	VALIDATE: undefined
*
*
*	DESCRIPTION:
*		- Validates if a value is undefined.
*
*
*	NOTES:
*		[1]
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2014.
*
*/

'use strict';

/**
* FUNCTION: isUndefined( value )
*	Validates if a value is undefined.
*
* @param {*} value - value to be validated
* @returns {Boolean} boolean indicating whether value is undefined
*/
function isUndefined( value ) {
	return value === void 0;
} // end FUNCTION isUndefined()


// EXPORTS //

module.exports = isUndefined;

},{}],29:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/white-space-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/white-space-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/white-space-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/white-space-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/white-space-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/white-space-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/white-space-x" title="npm version">
 * <img src="https://badge.fury.io/js/white-space-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * whitespace module.
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
 * @version 1.0.6
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module white-space-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:2, maxdepth:2,
  maxstatements:9, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var defProp = _dereq_('define-properties-x').defineProperty;
  var escapeRx = _dereq_('regexp-escape-x');
  var whiteSpaces = [
      0x0009, // Tab
      0x000a, // Line Feed
      0x000b, // Vertical Tab
      0x000c, // Form Feed
      0x000d, // Carriage Return
      0x0020, // Space
      //0x0085, // Next line - Not ES5 whitespace
      0x00a0, // No-break space
      0x1680, // Ogham space mark
      0x180e, // Mongolian vowel separator
      0x2000, // En quad
      0x2001, // Em quad
      0x2002, // En space
      0x2003, // Em space
      0x2004, // Three-per-em space
      0x2005, // Four-per-em space
      0x2006, // Six-per-em space
      0x2007, // Figure space
      0x2008, // Punctuation space
      0x2009, // Thin space
      0x200a, // Hair space
      //0x200b, // Zero width space - Not ES5 whitespace
      0x2028, // Line separator
      0x2029, // Paragraph separator
      0x202f, // Narrow no-break space
      0x205f, // Medium mathematical space
      0x3000, // Ideographic space
      0xfeff // Byte Order Mark
    ];
  var c = {
      s: whiteSpaces.reduce(function (acc, item) {
          return acc + String.fromCharCode(item);
        }, ''),

      w: (function () {
        var count = 65536,
          str = '';
        do {
          count -= 1;
          if (whiteSpaces.indexOf(count) < 0) {
            str = String.fromCharCode(count) + str;
          }
        } while (count);
        return str;
      }())
    };

  c.se = (c.s + c.w).replace(/\s/g, '') !== c.w ? escapeRx(c.s) : '\\s';
  c.we = (c.s + c.w).replace(/\w/g, '') !== c.s ? escapeRx(c.w) : '\\w';

  /**
   * Generate a string of ES5 (non-)whitespaces, optionally escaped for use
   * with `new RegExp`.
   *
   * @param {boolean} [nonWhiteSpace=false] Generate a string of
   * non-whitespaces.
   * @param {boolean} [escaped=false] Generate an escaped string.
   * @return {string} The generated string.
   * @example
   * var generateString = require('white-space-x');
   * var ws = generateString();
   * var nonWs = generateString(true);
   *
   * var re1 = new RegExp('^[' + generateString(false, true) + ']+$)');
   * re1.test(ws); // true
   *
   * var re2 = new RegExp('[' + generateString(false, true) + ']$)');
   * re2.test(nonWs); // false
   */
  module.exports = function generateString(nonWhiteSpace, escaped) {
    if (nonWhiteSpace === true) {
      return escaped === true ? c.we : c.w;
    }
    return escaped === true ? c.se : c.s;
  };

  /**
   * An array of the whitespace char codes.
   *
   * @name whiteSpaces
   * @type Array.<number>
   * @property {number} 0 0x0009 // Tab
   * @property {number} 1 0x000a // Line Feed
   * @property {number} 2 0x000b // Vertical Tab
   * @property {number} 3 0x000c // Form Feed
   * @property {number} 4 0x000d // Carriage Return
   * @property {number} 5 0x0020 // Space
   * @property {number} 6 0x00a0 // No-break space
   * @property {number} 7 0x1680 // Ogham space mark
   * @property {number} 8 0x180e // Mongolian vowel separator
   * @property {number} 9 0x2000 // En quad
   * @property {number} 10 0x2001 // Em quad
   * @property {number} 11 0x2002 // En space
   * @property {number} 12 0x2003 // Em space
   * @property {number} 13 0x2004 // Three-per-em space
   * @property {number} 14 0x2005 // Four-per-em space
   * @property {number} 15 0x2006 // Six-per-em space
   * @property {number} 16 0x2007 // Figure space
   * @property {number} 17 0x2008 // Punctuation space
   * @property {number} 18 0x2009 // Thin space
   * @property {number} 19 0x200a // Hair space
   * @property {number} 20 0x2028 // Line separator
   * @property {number} 21 0x2029 // Paragraph separator
   * @property {number} 22 0x202f // Narrow no-break space
   * @property {number} 23 0x205f // Medium mathematical space
   * @property {number} 24 0x3000 // Ideographic space
   * @property {number} 25 0xfeff // Byte Order Mark
   */
  defProp(module.exports, 'whiteSpaces', whiteSpaces);

  /**
   * This method takes a string and puts a backslash in front of every
   * character that is part of the regular expression syntax. This is useful
   * if you have a run-time string that you need to match in some text and the
   * string may contain special regex characters.
   *
   * @function escape
   * @param {string} string The string to be escaped.
   * @return {string} The escaped string.
   */
  defProp(module.exports, 'escape', escapeRx);
}());

},{"define-properties-x":2,"regexp-escape-x":25}]},{},[1])(1)
});