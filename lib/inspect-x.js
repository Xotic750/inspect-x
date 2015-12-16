(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.returnExports = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
 * formatted string:
 * - showHidden - if true then the object's non-enumerable and symbol properties
 * will be shown too. Defaults to false.
 * - depth - tells inspect how many times to recurse while formatting the
 * object. This is useful for inspecting large complicated objects.
 * Defaults to 2. To make it recurse indefinitely pass null.
 * - colors - if true, then the output will be styled with ANSI color codes.
 * Defaults to false. Colors are customizable, see below.
 * - customInspect - if false, then custom inspect(depth, opts) functions
 * defined on the objects being inspected won't be called. Defaults to true.
 *
 * <h2>Customizing inspect colors</h2>
 * Color output (if enabled) of inspect is customizable globally
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
 * be formatted according to the returned Object. This is similar to
 * how JSON.stringify() works.
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
 * var obj = { foo: 'this will not show up in the inspect() output' };
 * obj.inspect = function(depth) {
 *   return { bar: 'baz' };
 * };
 *
 * inspect(obj);
 *   // "{ bar: 'baz' }"
 * @version 1.0.4
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
  es3:true, esnext:true, plusplus:true, maxparams:false, maxdepth:false,
  maxstatements:false, maxcomplexity:false */

/*global require, module */

;(function () {
  'use strict';

  var ES = require('es-abstract/es6'),
    defProps = require('define-properties'),
    hasOwnProperty = require('has-own-property-x'),
    isDate = require('is-date-object'),
    isArrayBuffer = require('is-array-buffer-x'),
    isSet = require('is-set-x'),
    isMap = require('is-map-x'),
    isTypedArray = require('is-typed-array'),
    isDataView = require('is-data-view-x'),
    isPrimitive = require('is-primitive'),
    isUndefined = require('validate.io-undefined'),
    isNil = require('is-nil-x'),
    isNull = require('lodash.isnull'),
    isError = require('is-error-x'),
    isObjectLike = require('is-object-like-x'),
    isPromise = require('is-promise'),
    getFunctionName = require('get-function-name-x'),
    ERROR = Error,
    SET = typeof Set === 'function' && isSet(new Set()) && Set,
    MAP = typeof Map === 'function' && isMap(new Map()) && Map,
    testMap = MAP && new MAP([[1, true]]),
    testSet = SET && new SET([true]),
    sForEach = SET && SET.prototype.forEach,
    mForEach = MAP && MAP.prototype.forEach,
    pSymbolToString = require('has-symbol-support-x') &&
      Symbol.prototype.toString,
    pErrorToString = ERROR.prototype.toString,
    pBooleanToString = Boolean.prototype.toString,
    pNumberToString = Number.prototype.toString,
    pDateToString = Date.prototype.toString,
    pUTCToString = Date.prototype.toUTCString,
    pUnshift = Array.prototype.unshift,
    pPush = Array.prototype.push,
    pPop = Array.prototype.pop,
    pIndexOf = Array.prototype.indexOf,
    pFilter = Array.prototype.filter,
    pReduce = Array.prototype.reduce,
    pJoin = Array.prototype.join,
    pForEach = Array.prototype.forEach,
    pConcat = Array.prototype.concat,
    pSplice = Array.prototype.splice,
    pReplace = String.prototype.replace,
    pMatch = String.prototype.match,
    pSubstr = String.prototype.substr,
    $stringify = JSON.stringify,
    $keys = Object.keys,
    $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    $getPrototypeOf = Object.getPrototypeOf,
    $getOwnPropertyNames = Object.getOwnPropertyNames,
    $getOwnPropertySymbols = Object.getOwnPropertySymbols,
    inspectIt, formatValueIt;

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

  function isCollection(value) {
    return isObjectLike(value) && (isSet(value) || isMap(value));
  }

  function isMapIterator(value) {
    if (!MAP || !isObjectLike(value) || !ES.IsCallable(value.next)) {
      return false;
    }
    try {
      return ES.Call(value.next, testMap.values()).value === true;
    } catch (ignore) {}
    return false;
  }

  function isSetIterator(value) {
    if (!SET || !isObjectLike(value) || !ES.IsCallable(value.next)) {
      return false;
    }
    try {
      return ES.Call(value.next, testSet.values()).value === true;
    } catch (ignore) {}
    return false;
  }

  function includes(arr, value)  {
    return ES.Call(pIndexOf, arr, [value]) > -1;
  }

  function filterIndex(keys, length) {
    return ES.Call(pFilter, keys, [function (key) {
      return !(key > -1 && key % 1 === 0 && key <= length);
    }]);
  }

  function push(arr, value) {
    ES.Call(pPush, arr, [value]);
  }

  function pushUniq(arr, value) {
    if (!includes(arr, value)) {
      push(arr, value);
    }
  }

  function unshiftUniq(arr, value) {
    var val = [value],
      index = ES.Call(pIndexOf, arr, val);
    if (index > -1) {
      ES.Call(pSplice, arr, [index, 1]);
    }
    ES.Call(pUnshift, arr, val);
  }

  function stylizeWithColor(str, styleType) {
    var style = inspectIt.styles[styleType];
    if (style) {
      return '\u001b[' + inspectIt.colors[style][0] + 'm' + str +
        '\u001b[' + inspectIt.colors[style][1] + 'm';
    }
    return str;
  }

  function stylizeNoColor(str, styleType) {
    /*jshint unused:false */
    return str;
  }

  function getNameSep(obj) {
    var name = getFunctionName(obj);
    return name ? ': ' + name : name;
  }

  function forEach(arrayLike, callback, thisArg) {
    ES.Call(pForEach, arrayLike, [callback, thisArg]);
  }

  function each(arrayLike, callback, thisArg) {
    var l = arrayLike.length,
      i = 0;
    while (i < l) {
      ES.Call(callback, thisArg, [arrayLike[i], i, arrayLike]);
      i += 1;
    }
  }

  function collectionEach(collection, callback, thisArg) {
    var forEach = isMap(collection) ? mForEach : sForEach;
    if (forEach) {
      ES.Call(forEach, collection, [callback, thisArg]);
    }
  }

  function replace(str, pattern, replacement) {
    return ES.Call(pReplace, str, [pattern, replacement]);
  }

  function getConstructorOf(obj) {
    var maxLoop = 100,
      descriptor;
    while (!isNil(obj) && maxLoop > -1) {
      obj = ES.ToObject(obj);
      descriptor = $getOwnPropertyDescriptor(obj, 'constructor');
      if (!isUndefined(descriptor) && ES.IsCallable(descriptor.value)) {
        return descriptor.value;
      }
      obj = $getPrototypeOf(obj);
      maxLoop -= 1;
    }
    return null;
  }

  function regExpToString(value) {
    var str = '/' + value.source + '/';
    if (value.global) {
      str += 'g';
    }
    if (value.ignoreCase) {
      str += 'i';
    }
    if (value.multiline) {
      str += 'm';
    }
    if (value.sticky) {
      str += 'y';
    }
    return str;
  }

  function formatNumber(ctx, value) {
    // Format -0 as '-0'.
    return ctx.stylize(
      ES.SameValue(value, -0) ? '-0' : ES.Call(pNumberToString, value),
      'number'
    );
  }

  function formatPrimitive(ctx, value) {
    var simple;
    if (isUndefined(value)) {
      return ctx.stylize('undefined', 'undefined');
    }
    // For some reason typeof null is "object", so special case here.
    if (isNull(value)) {
      return ctx.stylize('null', 'null');
    }
    if (isStringType(value)) {
      simple = replace($stringify(value), /^"|"$/g, '');
      simple = replace(simple, /'/g, '\\\'');
      simple = replace(simple, /\\"/g, '"');
      return ctx.stylize('\'' + simple + '\'', 'string');
    }
    if (isNumberType(value)) {
      return formatNumber(ctx, value);
    }
    if (isBooleanType(value)) {
      return ctx.stylize(ES.Call(pBooleanToString, value), 'boolean');
    }
    // es6 symbol primitive
    if (isSymbolType(value)) {
      return ctx.stylize(ES.Call(pSymbolToString, value), 'symbol');
    }
  }

  function formatPrimitiveNoColor(ctx, value) {
    var stylize = ctx.stylize,
      str;
    ctx.stylize = stylizeNoColor;
    str = formatPrimitive(ctx, value);
    ctx.stylize = stylize;
    return str;
  }

  function formatError(value) {
    return '[' + ES.Call(pErrorToString, value) + ']';
  }

  function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
    var desc = $getOwnPropertyDescriptor(value, key) || {
        value: value[key]
      },
      name, str, constructor;
    if (key === 'size' && isCollection(value) && ES.IsCallable(value.size)) {
      desc.value = value.size();
    }
    if (desc.get) {
      if (desc.set) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
    if (!includes(visibleKeys, key)) {
      if (key === 'BYTES_PER_ELEMENT' &&
          !value.BYTES_PER_ELEMENT && isTypedArray(value)) {

        constructor = getConstructorOf(value);
        if (constructor) {
          desc.value = constructor.BYTES_PER_ELEMENT;
        }
      } else if (isSymbolType(key)) {
        name = '[' + ctx.stylize(ES.Call(pSymbolToString, key), 'symbol') + ']';
      } else {
        name = '[' + key + ']';
      }
    }
    if (!str) {
      if (!includes(ctx.seen, desc.value)) {
        str = formatValueIt(
          ctx,
          desc.value,
          isNull(recurseTimes) ? recurseTimes : recurseTimes - 1
        );
        if (str.indexOf('\n') > -1) {
          str = array ?
            replace(str, /\n/g, '\n  ') :
            replace(str, /(^|\n)/g, '\n   ');
        }
      } else {
        str = ctx.stylize('[Circular]', 'special');
      }
    }
    if (isUndefined(name)) {
      if (array && ES.Call(pMatch, key, [/^\d+$/])) {
        return str;
      }
      name = $stringify(key);
      if (ES.Call(pMatch, name, [/^"([a-z_][\w]*)"$/i])) {
        name = ctx.stylize(
          ES.Call(pSubstr, name, [1, name.length - 2]),
          'name'
        );
      } else {
        name = replace(name, /'/g, '\\\'');
        name = replace(name, /\\"/g, '"');
        name = replace(name, /(^"|"$)/g, '\'');
        name = replace(name, /\\\\/g, '\\');
        name = ctx.stylize(name, 'string');
      }
    }
    return name + ': ' + str;
  }

  function formatObject(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    forEach(keys, function (key) {
      push(
        output,
        formatProperty(ctx, value, recurseTimes, visibleKeys, key, false)
      );
    });
    return output;
  }

  function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    each(value, function (unused, index) {
      var k = ES.Call(pNumberToString, index);
      if (hasOwnProperty(value, k)) {
        push(
          output,
          formatProperty(ctx, value, recurseTimes, visibleKeys, k, true)
        );
      } else {
        push(output, '');
      }
    });
    forEach(keys, function (key) {
      if (isSymbolType(key) || !ES.Call(pMatch, key, [/^\d+$/])) {
        push(
          output,
          formatProperty(ctx, value, recurseTimes, visibleKeys, key, true)
        );
      }
    });
    return output;
  }

  function formatTypedArray(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    each(value, function (item) {
      push(output, formatNumber(ctx, item));
    });
    forEach(keys, function (key) {
      if (isSymbolType(key) || !ES.Call(pMatch, key, [/^\d+$/])) {
        push(
          output,
          formatProperty(ctx, value, recurseTimes, visibleKeys, key, true)
        );
      }
    });
    return output;
  }

  function formatSet(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    collectionEach(value, function (v) {
      var nextRecurseTimes = isNull(recurseTimes) ? null : recurseTimes - 1,
        str = formatValueIt(ctx, v, nextRecurseTimes);
      push(output, str);
    });
    forEach(keys, function (key) {
      push(
        output,
        formatProperty(ctx, value, recurseTimes, visibleKeys, key, false)
      );
    });
    return output;
  }

  function formatMap(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    collectionEach(value, function (v, k) {
      var nextRecurseTimes = isNull(recurseTimes) ? null : recurseTimes - 1,
        str = formatValueIt(ctx, k, nextRecurseTimes);
      str += ' => ';
      str += formatValueIt(ctx, v, nextRecurseTimes);
      push(output, str);
    });
    forEach(keys, function (key) {
      push(
        output,
        formatProperty(ctx, value, recurseTimes, visibleKeys, key, false)
      );
    });
    return output;
  }

  function reduceToSingleString(output, base, braces) {
    var length = ES.Call(pReduce, output, [function (prev, cur) {
        return prev + replace(cur, /\u001b\[\d\d?m/g, '').length + 1;
      }, 0]),
      result;
    if (length > 60) {
      result = braces[0] +
        // If the opening "brace" is too large, like in the case of "Set {",
        // we need to force the first item to be on the next line or the
        // items will not line up correctly.
        (base === '' && braces[0].length === 1 ? '' : base + '\n ') + ' ' +
        ES.Call(pJoin, output, [',\n  ']) + ' ' + braces[1];
    } else {
      result = braces[0] + base + ' ' + ES.Call(pJoin, output, [', ']) +
        ' ' + braces[1];
    }
    return replace(result, /\{[\s\n]+\}/, '{}');
  }

  formatValueIt = function formatValue(ctx, value, recurseTimes) {
    var ret, dateString, primitive, keys, visibleKeys, raw,
      constructor, name, base, empty, braces, formatter, output;
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (ctx.customInspect && !isPrimitive(value) &&
      ES.IsCallable(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== inspectIt &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {

      ret = value.inspect(recurseTimes, ctx);
      if (!isStringType(ret)) {
        return formatValue(ctx, ret, recurseTimes);
      }
      return ret;
    }
    // Primitive types cannot have properties
    primitive = formatPrimitive(ctx, value);
    if (primitive) {
      return primitive;
    }
    // Look up the keys of the object.
    visibleKeys = keys = $keys(value);
    if (ctx.showHidden) {
      keys = $getOwnPropertyNames(value);
      if (isError(value)) {
        if (!includes(visibleKeys, 'message') && !includes(keys, 'message')) {
          unshiftUniq(keys, 'message');
        }
        if (!includes(visibleKeys, 'name') && !includes(keys, 'name')) {
          unshiftUniq(keys, 'name');
        }
      }
      if ($getOwnPropertySymbols) {
        keys = ES.Call(pConcat, keys, [$getOwnPropertySymbols(value)]);
      }
    }
    // This could be a boxed primitive (new String(), etc.), check valueOf()
    // NOTE: Avoid calling `valueOf` on `Date` instance because it will return
    // a number which, when object has some additional user-stored `keys`,
    // will be printed out.
    raw = value;
    try {
      // the .valueOf() call can fail for a multitude of reasons
      raw = isDate(value) ? raw : value.valueOf();
    } catch (ignore) {}
    if (isStringType(raw)) {
      // for boxed Strings, we have to remove the 0-n indexed entries,
      // since they just noisey up the output and are redundant
      keys = filterIndex(keys, raw.length);
    } else if (isArrayBuffer(value)) {
      keys = filterIndex(keys, raw.byteLength);
    }
    // Some type of object without properties can be shortcutted.
    if (keys.length === 0) {
      if (ES.IsCallable(value)) {
        return ctx.stylize('[Function' + getNameSep(value) + ']', 'special');
      }
      if (ES.IsRegExp(value)) {
        return ctx.stylize(regExpToString(value), 'regexp');
      }
      if (isDate(value)) {
        try {
          dateString = ES.Call(pDateToString, value);
        } catch (e) {
          dateString = 'Date {}';
        }
        return ctx.stylize(dateString, 'date');
      }
      if (isError(value)) {
        return formatError(value);
      }
      // now check the `raw` value to handle boxed primitives
      if (isStringType(raw)) {
        return ctx.stylize(
          '[String: ' + formatPrimitiveNoColor(ctx, raw) + ']',
          'string'
        );
      }
      if (isNumberType(raw)) {
        return ctx.stylize(
          '[Number: ' + formatPrimitiveNoColor(ctx, raw) + ']',
          'number'
        );
      }
      if (isBooleanType(raw)) {
        return ctx.stylize(
          '[Boolean: ' + formatPrimitiveNoColor(ctx, raw) + ']',
          'boolean'
        );
      }
      // Fast path for ArrayBuffer. Can't do the same for DataView because it
      // has a non-primitive .buffer property that we need to recurse for.
      if (isArrayBuffer(value)) {
        return 'ArrayBuffer { byteLength: ' +
          formatNumber(ctx, value.byteLength) + ' }';
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
    constructor = getConstructorOf(value);
    name = constructor && getFunctionName(constructor);
    base = '';
    empty = false;
    braces = ['{', '}'];
    formatter = formatObject;
    // We can't compare constructors for various objects using a comparison
    // like `constructor === Array` because the object could have come from a
    // different context and thus the constructor won't match. Instead we check
    // the constructor names (including those up the prototype chain where
    // needed) to determine object types.
    if (Array.isArray(value)) {
      // Unset the constructor to prevent "Array [...]" for ordinary arrays.
      name = name === 'Array' ? null : name;
      braces = ['[', ']'];
      if (ctx.showHidden) {
        unshiftUniq(keys, 'length');
      }
      empty = value.length === 0;
      formatter = formatArray;
    } else if (isCollection(value)) {
      // With `showHidden`, `length` will display as a hidden property for
      // arrays. For consistency's sake, do the same for `size`, even though
      // this property isn't selected by Object.getOwnPropertyNames().
      if (ctx.showHidden) {
        unshiftUniq(keys, 'size');
      }
      empty = value.size === 0;
      if (isSet(value)) {
        name = 'Set';
        formatter = formatSet;
      } else {
        name = 'Map';
        formatter = formatMap;
      }
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
      formatter = formatTypedArray;
      if (ctx.showHidden) {
        unshiftUniq(keys, 'buffer');
        unshiftUniq(keys, 'byteOffset');
        unshiftUniq(keys, 'byteLength');
        unshiftUniq(keys, 'length');
        unshiftUniq(keys, 'BYTES_PER_ELEMENT');
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
      name = name === 'Object' ? null : name;
      empty = true;  // No other data than keys.
    }
    empty = empty === true && keys.length === 0;
    if (ES.IsCallable(value)) {
      // Make functions say that they are functions
      base = '[Function' + getNameSep(value) + ']';
    } else if (ES.IsRegExp(value)) {
      // Make RegExps say that they are RegExps
      name = 'RegExp';
      base = regExpToString(value);
    } else if (isDate(value)) {
      // Make dates with properties first say the date
      name = 'Date';
      try {
        dateString = ES.Call(pUTCToString, value);
      } catch (e) {
        dateString = name + ' {}';
      }
      base = dateString;
    } else if (isError(value)) {
      // Make error with message first say the error
      base = formatError(value);
    } else if (isStringType(raw)) {
      // Make boxed primitive Strings look like such
      base = '[String: ' + formatPrimitiveNoColor(ctx, raw) + ']';
    } else if (isNumberType(raw)) {
      // Make boxed primitive Numbers look like such
      base = '[Number: ' + formatPrimitiveNoColor(ctx, raw) + ']';
    } else if (isBooleanType(raw)) {
      // Make boxed primitive Booleans look like such
      base = '[Boolean: ' + formatPrimitiveNoColor(ctx, raw) + ']';
    }
    if (base) {
      base = ' ' + base;
    }
    // Add constructor name if available
    if (base === '' && name) {
      if (name) {
        braces[0] = name + ' ' + braces[0];
      }
    }
    if (empty) {
      return braces[0] + base + braces[1];
    }
    if (recurseTimes < 0) {
      if (ES.IsRegExp(value)) {
        return ctx.stylize(regExpToString(value), 'regexp');
      }
      return ctx.stylize('[Object]', 'special');
    }
    push(ctx.seen, value);
    output = formatter(ctx, value, recurseTimes, visibleKeys, keys);
    ES.Call(pPop, ctx.seen);
    return reduceToSingleString(output, base, braces);
  };

  /**
   * Echos the value of a value. Trys to print the value out
   * in the best way possible given the different types.
   * Values may supply their own custom `inspect(depth, opts)` functions,
   * when called they receive the current depth in the recursive inspection,
   * as well as the options object passed to `inspect`.
   *
   * @param {Object} obj The object to print out.
   * @param {Object} [opts] Options object that alters the output.
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
      forEach($keys(opts), function (opt) {
        ctx[opt] = opts[opt];
      });
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
    return formatValueIt(ctx, obj, ctx.depth);
  };

  // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
  defProps(inspectIt, {
    colors: {},
    styles: {}
  });

  defProps(inspectIt.colors, {
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
  defProps(inspectIt.styles, {
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

},{"define-properties":2,"es-abstract/es6":7,"get-function-name-x":22,"has-own-property-x":23,"has-symbol-support-x":24,"is-array-buffer-x":25,"is-data-view-x":27,"is-date-object":29,"is-error-x":30,"is-map-x":33,"is-nil-x":34,"is-object-like-x":35,"is-primitive":36,"is-promise":37,"is-set-x":38,"is-typed-array":39,"lodash.isnull":41,"validate.io-undefined":42}],2:[function(require,module,exports){
'use strict';

var keys = require('object-keys');
var foreach = require('foreach');
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

var toStr = Object.prototype.toString;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
        /* eslint-disable no-unused-vars, no-restricted-syntax */
        for (var _ in obj) { return false; }
        /* eslint-enable no-unused-vars, no-restricted-syntax */
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		Object.defineProperty(object, name, {
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
		props = props.concat(Object.getOwnPropertySymbols(map));
	}
	foreach(props, function (name) {
		defineProperty(object, name, map[name], predicates[name]);
	});
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;

},{"foreach":3,"object-keys":4}],3:[function(require,module,exports){

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


},{}],4:[function(require,module,exports){
'use strict';

// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = require('./isArguments');
var hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString');
var hasProtoEnumBug = function () {}.propertyIsEnumerable('prototype');
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
var blacklistedKeys = {
	$console: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$parent: true,
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
			if (!blacklistedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
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

var keysShim = function keys(object) {
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

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

},{"./isArguments":5}],5:[function(require,module,exports){
'use strict';

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

},{}],6:[function(require,module,exports){
'use strict';

var $isNaN = Number.isNaN || function (a) { return a !== a; };
var $isFinite = require('./helpers/isFinite');

var sign = require('./helpers/sign');
var mod = require('./helpers/mod');

var IsCallable = require('is-callable');
var toPrimitive = require('es-to-primitive/es5');

// https://es5.github.io/#x9
var ES5 = {
	ToPrimitive: toPrimitive,

	ToBoolean: function ToBoolean(value) {
		return Boolean(value);
	},
	ToNumber: function ToNumber(value) {
		return Number(value);
	},
	ToInteger: function ToInteger(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number)) { return 0; }
		if (number === 0 || !$isFinite(number)) { return number; }
		return sign(number) * Math.floor(Math.abs(number));
	},
	ToInt32: function ToInt32(x) {
		return this.ToNumber(x) >> 0;
	},
	ToUint32: function ToUint32(x) {
		return this.ToNumber(x) >>> 0;
	},
	ToUint16: function ToUint16(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x10000);
	},
	ToString: function ToString(value) {
		return String(value);
	},
	ToObject: function ToObject(value) {
		this.CheckObjectCoercible(value);
		return Object(value);
	},
	CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
		/* jshint eqnull:true */
		if (value == null) {
			throw new TypeError(optMessage || 'Cannot call method on ' + value);
		}
		return value;
	},
	IsCallable: IsCallable,
	SameValue: function SameValue(x, y) {
		if (x === y) { // 0 === -0, but they are not identical.
			if (x === 0) { return 1 / x === 1 / y; }
			return true;
		}
        return $isNaN(x) && $isNaN(y);
	}
};

module.exports = ES5;

},{"./helpers/isFinite":10,"./helpers/mod":12,"./helpers/sign":13,"es-to-primitive/es5":15,"is-callable":20}],7:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';
var symbolToStr = hasSymbols ? Symbol.prototype.toString : toStr;

var $isNaN = Number.isNaN || function (a) { return a !== a; };
var $isFinite = require('./helpers/isFinite');
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

var assign = require('./helpers/assign');
var sign = require('./helpers/sign');
var mod = require('./helpers/mod');
var isPrimitive = require('./helpers/isPrimitive');
var toPrimitive = require('es-to-primitive/es6');
var parseInteger = parseInt;
var bind = require('function-bind');
var strSlice = bind.call(Function.call, String.prototype.slice);
var isBinary = bind.call(Function.call, RegExp.prototype.test, /^0b[01]+$/i);
var isOctal = bind.call(Function.call, RegExp.prototype.test, /^0o[0-7]+$/i);
var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
var nonWSregex = new RegExp('[' + nonWS + ']', 'g');
var hasNonWS = bind.call(Function.call, RegExp.prototype.test, nonWSregex);
var invalidHexLiteral = /^[\-\+]0x[0-9a-f]+$/i;
var isInvalidHexLiteral = bind.call(Function.call, RegExp.prototype.test, invalidHexLiteral);

// whitespace from: http://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
var ws = [
	'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
	'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
	'\u2029\uFEFF'
].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var replace = bind.call(Function.call, String.prototype.replace);
var trim = function (value) {
	return replace(value, trimRegex, '');
};

var ES5 = require('./es5');

var hasRegExpMatcher = require('is-regex');

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-abstract-operations
var ES6 = assign(assign({}, ES5), {

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-call-f-v-args
	Call: function Call(F, V) {
		var args = arguments.length > 2 ? arguments[2] : [];
		if (!this.IsCallable(F)) {
			throw new TypeError(F + ' is not a function');
		}
		return F.apply(V, args);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toprimitive
	ToPrimitive: toPrimitive,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toboolean
	// ToBoolean: ES5.ToBoolean,

	// http://www.ecma-international.org/ecma-262/6.0/#sec-tonumber
	ToNumber: function ToNumber(argument) {
		var value = isPrimitive(argument) ? argument : toPrimitive(argument, 'number');
		if (typeof value === 'symbol') {
			throw new TypeError('Cannot convert a Symbol value to a number');
		}
		if (typeof value === 'string') {
			if (isBinary(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 2));
			} else if (isOctal(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 8));
			} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
				return NaN;
			} else {
				var trimmed = trim(value);
				if (trimmed !== value) {
					return this.ToNumber(trimmed);
				}
			}
		}
		return Number(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tointeger
	// ToInteger: ES5.ToNumber,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint32
	// ToInt32: ES5.ToInt32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint32
	// ToUint32: ES5.ToUint32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint16
	ToInt16: function ToInt16(argument) {
		var int16bit = this.ToUint16(argument);
		return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint16
	// ToUint16: ES5.ToUint16,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint8
	ToInt8: function ToInt8(argument) {
		var int8bit = this.ToUint8(argument);
		return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8
	ToUint8: function ToUint8(argument) {
		var number = this.ToNumber(argument);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x100);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8clamp
	ToUint8Clamp: function ToUint8Clamp(argument) {
		var number = this.ToNumber(argument);
		if ($isNaN(number) || number <= 0) { return 0; }
		if (number >= 0xFF) { return 0xFF; }
		var f = Math.floor(argument);
		if (f + 0.5 < number) { return f + 1; }
		if (number < f + 0.5) { return f; }
		if (f % 2 !== 0) { return f + 1; }
		return f;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tostring
	ToString: function ToString(argument) {
		if (typeof argument === 'symbol') {
			throw new TypeError('Cannot convert a Symbol value to a string');
		}
		return String(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toobject
	ToObject: function ToObject(value) {
		this.RequireObjectCoercible(value);
		return Object(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-topropertykey
	ToPropertyKey: function ToPropertyKey(argument) {
		var key = this.ToPrimitive(argument, String);
		return typeof key === 'symbol' ? symbolToStr.call(key) : this.ToString(key);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	ToLength: function ToLength(argument) {
		var len = this.ToInteger(argument);
		if (len <= 0) { return 0; } // includes converting -0 to +0
		if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
		return len;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-canonicalnumericindexstring
	CanonicalNumericIndexString: function CanonicalNumericIndexString(argument) {
		if (toStr.call(argument) !== '[object String]') {
			throw new TypeError('must be a string');
		}
		if (argument === '-0') { return -0; }
		var n = this.ToNumber(argument);
		if (this.SameValue(this.ToString(n), argument)) { return n; }
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-requireobjectcoercible
	RequireObjectCoercible: ES5.CheckObjectCoercible,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isarray
	IsArray: Array.isArray || function IsArray(argument) {
		return toStr.call(argument) === '[object Array]';
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iscallable
	// IsCallable: ES5.IsCallable,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isconstructor
	IsConstructor: function IsConstructor(argument) {
		return this.IsCallable(argument); // unfortunately there's no way to truly check this without try/catch `new argument`
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isextensible-o
	IsExtensible: function IsExtensible(obj) {
		if (!Object.preventExtensions) { return true; }
		if (isPrimitive(obj)) {
			return false;
		}
		return Object.isExtensible(obj);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isinteger
	IsInteger: function IsInteger(argument) {
		if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
			return false;
		}
		var abs = Math.abs(argument);
		return Math.floor(abs) === abs;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ispropertykey
	IsPropertyKey: function IsPropertyKey(argument) {
		return typeof argument === 'string' || typeof argument === 'symbol';
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-isregexp
	IsRegExp: function IsRegExp(argument) {
		if (!argument || typeof argument !== 'object') {
			return false;
		}
		if (hasSymbols) {
			var isRegExp = RegExp[Symbol.match];
			if (typeof isRegExp !== 'undefined') {
				return ES5.ToBoolean(isRegExp);
			}
		}
		return hasRegExpMatcher(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevalue
	// SameValue: ES5.SameValue,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero
	SameValueZero: function SameValueZero(x, y) {
		return (x === y) || ($isNaN(x) && $isNaN(y));
	}
});

delete ES6.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible

module.exports = ES6;

},{"./es5":6,"./helpers/assign":9,"./helpers/isFinite":10,"./helpers/isPrimitive":11,"./helpers/mod":12,"./helpers/sign":13,"es-to-primitive/es6":16,"function-bind":19,"is-regex":21}],8:[function(require,module,exports){
'use strict';

var ES6 = require('./es6');
var assign = require('./helpers/assign');

var ES7 = assign(ES6, {
	// https://github.com/tc39/ecma262/pull/60
	SameValueNonNumber: function SameValueNonNumber(x, y) {
		if (typeof x === 'number' || typeof x !== typeof y) {
			throw new TypeError('SameValueNonNumber requires two non-number values of the same type.');
		}
		return this.SameValue(x, y);
	}
});

module.exports = ES7;

},{"./es6":7,"./helpers/assign":9}],9:[function(require,module,exports){
var has = Object.prototype.hasOwnProperty;
module.exports = Object.assign || function assign(target, source) {
	for (var key in source) {
		if (has.call(source, key)) {
			target[key] = source[key];
		}
	}
	return target;
};

},{}],10:[function(require,module,exports){
var $isNaN = Number.isNaN || function (a) { return a !== a; };

module.exports = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };

},{}],11:[function(require,module,exports){
module.exports = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};

},{}],12:[function(require,module,exports){
module.exports = function mod(number, modulo) {
	var remain = number % modulo;
	return Math.floor(remain >= 0 ? remain : remain + modulo);
};

},{}],13:[function(require,module,exports){
module.exports = function sign(number) {
	return number >= 0 ? 1 : -1;
};

},{}],14:[function(require,module,exports){
'use strict';

var assign = require('./helpers/assign');

var ES5 = require('./es5');
var ES6 = require('./es6');
var ES7 = require('./es7');

var ES = {
	ES5: ES5,
	ES6: ES6,
	ES7: ES7
};
assign(ES, ES5);
delete ES.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible
assign(ES, ES6);

module.exports = ES;

},{"./es5":6,"./es6":7,"./es7":8,"./helpers/assign":9}],15:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

var isPrimitive = require('./helpers/isPrimitive');

var isCallable = require('is-callable');

// https://es5.github.io/#x8.12
var ES5internalSlots = {
	'[[DefaultValue]]': function (O, hint) {
		if (!hint) {
			hint = toStr.call(O) === '[object Date]' ? String : Number;
		}

		if (hint === String || hint === Number) {
			var methods = hint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
			var value, i;
			for (i = 0; i < methods.length; ++i) {
				if (isCallable(O[methods[i]])) {
					value = O[methods[i]]();
					if (isPrimitive(value)) {
						return value;
					}
				}
			}
			throw new TypeError('No default value');
		}
		throw new TypeError('invalid [[DefaultValue]] hint supplied');
	}
};

// https://es5.github.io/#x9
module.exports = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	if (arguments.length < 2) {
		PreferredType = toStr.call(input) === '[object Date]' ? String : Number;
	}
	if (PreferredType === String) {
		return String(input);
	} else if (PreferredType === Number) {
		return Number(input);
	} else {
		throw new TypeError('invalid PreferredType supplied');
	}
	return ES5internalSlots['[[DefaultValue]]'](input, PreferredType);
};

},{"./helpers/isPrimitive":17,"is-callable":20}],16:[function(require,module,exports){
'use strict';

var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';

var isPrimitive = require('./helpers/isPrimitive');
var isCallable = require('is-callable');
var isDate = require('is-date-object');
var isSymbol = require('is-symbol');

var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
	if (O == null) {
		throw new TypeError('Cannot call method on ' + O);
	}
	if (typeof hint !== 'string' || (hint !== 'number' && hint !== 'string')) {
		throw new TypeError('hint must be "string" or "number"');
	}
	var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
	var method, result, i;
	for (i = 0; i < methodNames.length; ++i) {
		method = O[methodNames[i]];
		if (isCallable(method)) {
			result = method.call(O);
			if (isPrimitive(result)) {
				return result;
			}
		}
	}
	throw new TypeError('No default value');
};

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toprimitive
module.exports = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	var hint = 'default';
	if (arguments.length > 1) {
		if (PreferredType === String) {
			hint = 'string';
		} else if (PreferredType === Number) {
			hint = 'number';
		}
	}

	var exoticToPrim;
	if (hasSymbols) {
		if (Symbol.toPrimitive) {
			throw new TypeError('Symbol.toPrimitive not supported yet');
			// exoticToPrim = this.GetMethod(input, Symbol.toPrimitive);
		} else if (isSymbol(input)) {
			exoticToPrim = Symbol.prototype.valueOf;
		}
	}
	if (typeof exoticToPrim !== 'undefined') {
		var result = exoticToPrim.call(input, hint);
		if (isPrimitive(result)) {
			return result;
		}
		throw new TypeError('unable to convert exotic object to primitive');
	}
	if (hint === 'default' && (isDate(input) || isSymbol(input))) {
		hint = 'string';
	}
	return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
};

},{"./helpers/isPrimitive":17,"is-callable":20,"is-date-object":29,"is-symbol":18}],17:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11}],18:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') { return false; }
		return symStringRegex.test(symToStr.call(value));
	};
	module.exports = function isSymbol(value) {
		if (typeof value === 'symbol') { return true; }
		if (toStr.call(value) !== '[object Symbol]') { return false; }
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {
	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return false;
	};
}

},{}],19:[function(require,module,exports){
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

    var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


},{}],20:[function(require,module,exports){
'use strict';

var constructorRegex = /\s*class /;
var isNonES6ClassFn = function isNonES6ClassFn(value) {
	try {
		return !constructorRegex.test(value);
	} catch (e) {
		return false; // not a function
	}
};

var fnToStr = Function.prototype.toString;
var tryFunctionObject = function tryFunctionObject(value) {
	try {
		if (constructorRegex.test(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isCallable(value) {
	if (!value) { return false; }
	if (typeof value !== 'function' && typeof value !== 'object') { return false; }
	if (hasToStringTag) { return tryFunctionObject(value); }
	if (!isNonES6ClassFn(value)) { return false; }
	var strClass = toStr.call(value);
	return strClass === fnClass || strClass === genClass;
};

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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
 * @version 1.0.0
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
  maxstatements:9, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var ES = require('es-abstract/es6'),
    pFunctionToString, pMatch, reName, getFnName;

  if ((function test() {}).name !== 'test') {
    pFunctionToString = Function.prototype.toString;
    pMatch = String.prototype.match;
    reName = [/^\s*function\s+([\w\$]+)\s*\(/i];
    getFnName = function getName(fn) {
      var name = ES.Call(pMatch, ES.Call(pFunctionToString, fn), reName);
      if (name) {
        name = name[1];
      }
      return name && name !== 'anonymous' ? name : '';
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
   * getFunctionName(function test() {}); // 'test'
   */
  module.exports = function getFunctionName(fn) {
    if (!ES.IsCallable(fn)) {
      return;
    }
    return getFnName ? getFnName(fn) : fn.name;

  };
}());

},{"es-abstract/es6":7}],23:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/has-own-property-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/has-own-property-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/has-own-property-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/has-own-property-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/has-own-property-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/has-own-property-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/has-own-property-x" title="npm version">
 * <img src="https://badge.fury.io/js/has-own-property-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * hasOwnProperty module.
 * @version 1.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module has-own-property-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:2, maxdepth:1,
  maxstatements:2, maxcomplexity:1 */

/*global module */

;(function () {
  'use strict';

  var pHasOwnProperty = Object.prototype.hasOwnProperty,
    ES = require('es-abstract/es6');

  /**
   * The `hasOwnProperty` method returns a boolean indicating whether
   * the `object` has the specified `property`. Does not attempt to fix known
   * issues in older browsers, but does ES6ify the method.
   *
   * @param {!Object} object The object to test.
   * @param {string|Symbol} property The name or Symbol of the property to test.
   * @return {boolean} `true` if the property is set on `object`, else `false`.
   * @example
   * var hasOwnProperty = require('has-own-property-x');
   * var o = {
   *   foo: 'bar'
   * };
   }
   *
   * hasOwnProperty(o, 'bar'); // false
   * hasOwnProperty(o, 'foo'); // true
   * hasOwnProperty(undefined, 'foo');
   *                   // TypeError: Cannot convert undefined or null to object
   */
  module.exports = function hasOwnProperty(object, property) {
    return ES.Call(
      pHasOwnProperty,
      ES.ToObject(ES.RequireObjectCoercible(object)),
      [property]
    );
  };
}());

},{"es-abstract/es6":7}],24:[function(require,module,exports){
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
 * @version 1.0.1
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module has-symbol-support-x
 */

/*jslint maxlen:80, es6:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:true, plusplus:true, maxparams:1, maxdepth:1,
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

},{}],25:[function(require,module,exports){
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
 * isArrayBuffer module. Detect whether or not an object is an ES6 ArrayBuffer
 * or a legacy Arraybuffer.
 * @version 1.0.2
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-array-buffer-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:3,
  maxstatements:8, maxcomplexity:6 */

/*global module */

;(function () {
  'use strict';

  var ES = require('es-abstract/es6'),
    isObjectLike = require('is-object-like-x'),
    toStringTag = require('to-string-tag-x'),
    ARRAYBUFFER = typeof ArrayBuffer === 'function' && ArrayBuffer,
    getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    getPrototypeOf = Object.getPrototypeOf,
    getByteLength;

  if (ARRAYBUFFER) {
    try {
      getByteLength = getOwnPropertyDescriptor(
        getPrototypeOf(new ARRAYBUFFER(4)),
        'byteLength'
      ).get;
      if (typeof ES.Call(getByteLength, new ARRAYBUFFER(4)) !== 'number') {
        throw 'not a number';
      }
    } catch (ignore) {
      getByteLength = null;
    }
  }

  /**
   * Determine if an `object` is an `ArrayBuffer`.
   *
   * @param {*} object The object to test.
   * @param {boolean} [es6=false] If `true` then only ES6 ArrayBuffer objects
   *  will be determined `true`.
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
    if (!ARRAYBUFFER || !isObjectLike(object) || !getByteLength && arguments[1]) {
      return false;
    }
    if (!getByteLength && !arguments[1]) {
      return toStringTag(object) === '[object ArrayBuffer]';
    }
    try {
      return typeof ES.Call(getByteLength, object) === 'number';
    } catch (ignore) {}
    return false;
  };
}());

},{"es-abstract/es6":7,"is-object-like-x":35,"to-string-tag-x":26}],26:[function(require,module,exports){
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
 * @version 1.0.0
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
  maxstatements:11, maxcomplexity:6 */

/*global module */

;(function () {
  'use strict';

  var pToString = Object.prototype.toString,
    ES = require('es-abstract/es6');

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
    if (value === null) {
      return '[object Null]';
    }
    if (typeof value === 'undefined') {
      return '[object Undefined]';
    }
    return ES.Call(pToString, value);
  };
}());

},{"es-abstract/es6":7}],27:[function(require,module,exports){
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
 * isDataView module. Detect whether or not an object is an ES6 DataView or
 * a legacy DataView.
 * @version 1.0.3
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
  maxstatements:8, maxcomplexity:6 */

/*global module */

;(function () {
  'use strict';

  var ES = require('es-abstract/es6'),
    isObjectLike = require('is-object-like-x'),
    toStringTag = require('to-string-tag-x'),
    isArrayBuffer = require('is-array-buffer-x'),
    DATAVIEW = typeof DataView === 'function' && DataView,
    getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    getPrototypeOf = Object.getPrototypeOf,
    getByteLength, testObject, legacyCheck;

  if (DATAVIEW) {
    try {
      testObject = new DATAVIEW(new ArrayBuffer(4));
      getByteLength = getOwnPropertyDescriptor(
        getPrototypeOf(testObject),
        'byteLength'
      ).get;
      if (typeof ES.Call(getByteLength, testObject) !== 'number') {
        throw 'not a number';
      }
    } catch (ignore) {
      getByteLength = null;
    }
    if (!getByteLength) {
      if (toStringTag(testObject) === '[object DataView]') {
        legacyCheck = function byStringTag(object) {
            return toStringTag(object) === '[object DataView]';
        };
      } else {
        legacyCheck = function byDuckType(object) {
            return toStringTag(object) === '[object Object]' &&
              typeof object.byteLength === 'number' &&
              typeof object.byteOffset === 'number' &&
              isArrayBuffer(object.buffer) &&
              ES.IsCallable(object.getFloat32) &&
              ES.IsCallable(object.setFloat64);
        };
      }
    }
  }

  /**
   * Determine if an `object` is an `DataView`.
   *
   * @param {*} object The object to test.
   * @param {boolean} [es6=false] If `true` then only ES6 DataView objects will
   * be determined `true`.
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
    if (!DATAVIEW || !isObjectLike(object) || !getByteLength && arguments[1]) {
      return false;
    }
    if (!getByteLength && !arguments[1]) {
      return legacyCheck(object);
    }
    try {
      return typeof ES.Call(getByteLength, object) === 'number';
    } catch (ignore) {}
    return false;
  };
}());

},{"es-abstract/es6":7,"is-array-buffer-x":25,"is-object-like-x":35,"to-string-tag-x":28}],28:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26,"es-abstract/es6":7}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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
 * @version 1.0.1
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
  maxstatements:11, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var toStringTag = require('to-string-tag-x'),
    isObjectLike = require('is-object-like'),
    $getPrototypeOf = Object.getPrototypeOf;

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
    var object, maxLoop;
    if (!isObjectLike(value)) {
      return false;
    }
    object = value;
    maxLoop = 1000;
    while (object && maxLoop > -1) {
      if (toStringTag(object) === '[object Error]') {
        return true;
      }
      object = $getPrototypeOf(object);
      maxLoop -= 1;
    }
    return false;
  };
}());

},{"is-object-like":31,"to-string-tag-x":32}],31:[function(require,module,exports){
'use strict'

module.exports = function isObjectLike (value) {
  return (typeof value === 'object' || typeof value === 'function') && value !== null
}

},{}],32:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26,"es-abstract/es6":7}],33:[function(require,module,exports){
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
 * @version 1.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-map-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:3,
  maxstatements:8, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var ES = require('es-abstract/es6'),
    isObjectLike = require('is-object-like-x'),
    MAP = typeof Map === 'function' && Map,
    getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    getPrototypeOf = Object.getPrototypeOf,
    getSize;

  if (MAP) {
    try {
      getSize = getOwnPropertyDescriptor(
        getPrototypeOf(new MAP()),
        'size'
      ).get;
      if (typeof ES.Call(getSize, new MAP()) !== 'number') {
        throw 'not a number';
      }
    } catch (ignore) {
      MAP = getSize = null;
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
      return typeof ES.Call(getSize, object) === 'number';
    } catch (ignore) {}
    return false;
  };
}());

},{"es-abstract/es6":7,"is-object-like-x":35}],34:[function(require,module,exports){
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
 * ES3 isNil module.
 * @version 1.0.0
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
  maxstatements:2, maxcomplexity:2 */

/*global module */

;(function () {
  'use strict';

  var isUndefined = require('validate.io-undefined'),
    isNull = require('lodash.isnull');

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

},{"lodash.isnull":41,"validate.io-undefined":42}],35:[function(require,module,exports){
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
 * @version 1.0.0
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
  maxstatements:2, maxcomplexity:1 */

/*global module */

;(function () {
  'use strict';

  var ES = require('es-abstract'),
    isPrimitive = require('is-primitive');

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
    return !isPrimitive(value) && !ES.IsCallable(value);
  };
}());

},{"es-abstract":14,"is-primitive":36}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
module.exports = isPromise;

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

},{}],38:[function(require,module,exports){
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
 * @version 1.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-set-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:3,
  maxstatements:8, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var ES = require('es-abstract/es6'),
    isObjectLike = require('is-object-like-x'),
    SET = typeof Set === 'function' && Set,
    getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    getPrototypeOf = Object.getPrototypeOf,
    getSize;

  if (SET) {
    try {
      getSize = getOwnPropertyDescriptor(
        getPrototypeOf(new SET()),
        'size'
      ).get;
      if (typeof ES.Call(getSize, new SET()) !== 'number') {
        throw 'not a number';
      }
    } catch (ignore) {
      SET = getSize = null;
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
      return typeof ES.Call(getSize, object) === 'number';
    } catch (ignore) {}
    return false;
  };
}());

},{"es-abstract/es6":7,"is-object-like-x":35}],39:[function(require,module,exports){
(function (global){
'use strict';

var forEach = require('foreach');

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
},{"foreach":40}],40:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

},{}]},{},[1])(1)
});