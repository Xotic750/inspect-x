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
 * @version 1.0.1
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
    toStringTag = require('to-string-tag-x'),
    typedArrayLib = require('is-typed-array-x'),
    isArrayBuffer = typedArrayLib.isArrayBuffer,
    isTypedArray = typedArrayLib.isTypedArray,
    isPrimitive = require('is-primitive'),
    assign = require('object.assign').getPolyfill(),
    SetObject = require('collections-x').Set,
    pSetForEach = SetObject.prototype.forEach,
    pSetAdd = SetObject.prototype.add,
    pSetHas = SetObject.prototype.has,
    pSetDelete = SetObject.prototype['delete'],
    ERROR = Error,
    SYMBOL = typeof Symbol === 'function' &&
      typeof Symbol() === 'symbol' && Symbol,
    SET = typeof Set === 'function' && Set,
    MAP = typeof Map === 'function' && Map,
    PROMISE = typeof Promise === 'function' && Promise,
    DATAVIEW = typeof DataView === 'function' && DataView,
    sForEach = SET && SET.prototype.forEach,
    mForEach = MAP && MAP.prototype.forEach,
    pSymbolToString = SYMBOL && SYMBOL.prototype.toString,
    pFunctionToString = Function.prototype.toString,
    pErrorToString = ERROR.prototype.toString,
    pExec = RegExp.prototype.exec,
    pBooleanToString = Boolean.prototype.toString,
    pNumberToString = Number.prototype.toString,
    pDateToString = Date.prototype.toString,
    pUTCToString = Date.prototype.toUTCString,
    pUnshift = Array.prototype.unshift,
    pPush = Array.prototype.push,
    pIndexOf = Array.prototype.indexOf,
    pFilter = Array.prototype.filter,
    pReduce = Array.prototype.reduce,
    pSlice = Array.prototype.slice,
    pJoin = Array.prototype.join,
    pConcat = Array.prototype.concat,
    pReplace = String.prototype.replace,
    pMatch = String.prototype.match,
    pSubstr = String.prototype.substr,
    $stringify = JSON.stringify,
    $keys = Object.keys,
    $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    $getPrototypeOf = Object.getPrototypeOf,
    $getOwnPropertyNames = Object.getOwnPropertyNames,
    $getOwnPropertySymbols = Object.getOwnPropertySymbols,
    // .buffer goes last, it's not a primitive like the others.
    hiddenTypedArray = [
      'BYTES_PER_ELEMENT',
      'length',
      'byteLength',
      'byteOffset',
      'buffer'
    ],
    hiddenDataView = ES.Call(pSlice, hiddenTypedArray, [2]),
    hiddenMessage = ['message'],
    hiddenStack = ['stack'],
    hiddenLength = ['length'],
    hiddenSize = ['size'],
    hiddeByteLength = ['byteLength'],
    unwantedOldArrayBuffer = ['slice', 'length'],
    unwantedOldTypedArray = ['get', 'set', 'slice', 'subarray'],
    unwantedProto = ['__proto__'],
    unwantedDataView = [
      'getUint8', 'getInt8', 'getUint16', 'getInt16', 'getUint32', 'getInt32',
      'getFloat32', 'getFloat64', 'setUint8', 'setInt8', 'setUint16',
      'setInt16', 'setUint32', 'setInt32', 'setFloat32', 'setFloat64'
    ],
    unwantedMap = MAP ? $keys(new MAP()) : [],
    unwantedSet = SET ? $keys(new SET()) : [],
    unwantedArrayBuffer =
      typedArrayLib.hasArrayBuffer ? $keys(new ArrayBuffer(4)) : [],
    unwantedTypedArray =
      typedArrayLib.hasArrayBuffer ? $keys(new Int16Array(4)) : [],
    unwantedError, inspectIt, formatValueIt;
  try {
    throw new ERROR('a');
  } catch (e) {
    unwantedError = $keys(e);
  }

  function isNull(arg) {
    return arg === null;
  }

  function isUndefined(arg) {
    return typeof arg === 'undefined';
  }

  function isNil(arg) {
    return isNull(arg) || isUndefined(arg);
  }

  function isBoolean(arg) {
    return typeof arg === 'boolean';
  }

  function isNumber(arg) {
    return typeof arg === 'number';
  }

  function isString(arg) {
    return typeof arg === 'string';
  }

  function isSymbol(arg) {
    return SYMBOL && typeof arg === 'symbol';
  }

  function isError(err) {
    return !isPrimitive(err) &&
      (toStringTag(err) === '[object Error]' || err instanceof ERROR);
  }

  function isSet(value) {
    return SET && !isPrimitive(value) &&
      (toStringTag(value) === '[object Set]' || value instanceof SET) &&
      ES.IsCallable(value.add);
  }

  function isMap(value) {
    return MAP && !isPrimitive(value) &&
      (toStringTag(value) === '[object Map]' || value instanceof MAP) &&
      ES.IsCallable(value.set);
  }

  function isCollection(value) {
    return !isPrimitive(value) && (isSet(value) || isMap(value));
  }

  function isPromise(value) {
    return PROMISE && !isPrimitive(value) &&
      (toStringTag(value) === '[object Promise]' || value instanceof PROMISE) &&
      ES.IsCallable(value.then);
  }

  function isCollectionIterator(value, stringTag) {
    return !isPrimitive(value) &&
      toStringTag(value) === stringTag &&
      ES.IsCallable(value.next);
  }

  function isMapIterator(value) {
    return MAP && isCollectionIterator(value, '[object Map Iterator]');
  }

  function isSetIterator(value) {
    return SET && isCollectionIterator(value, '[object Set Iterator]');
  }

  function isDataView(value) {
    return DATAVIEW && !isPrimitive(value) &&
      (toStringTag(value) === '[object DataView]' || value instanceof DATAVIEW);
  }

  function filterUnwanted(keys, list) {
    return ES.Call(pFilter, keys, [function (key) {
      return ES.Call(pIndexOf, list, [key]) < 0;
    }]);
  }

  function filterIndex(keys, length) {
    return ES.Call(pFilter, keys, [function (key) {
      return !(key > -1 && key % 1 === 0 && key <= length);
    }]);
  }

  function add(set, value) {
    return ES.Call(pSetAdd, set, [value]);
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

  function getFunctionName(fn) {
    var match;
    try {
      match = ES.Call(
        pExec,
        /^\s*function\s+([\w\$]+)\s*\(/i,
        [ES.Call(pFunctionToString, fn)]
      );
    } catch (ignore) {}
    return match ? match[1] : '';
  }

  function getName(obj) {
    return !isPrimitive(obj) && (obj.name || getFunctionName(obj)) || '';
  }

  function getNameSep(obj) {
    var name = getName(obj);
    return name ? ': ' + name : name;
  }

  function arrayEach(arrayLike, callback, thisArg) {
    var l = ES.ToLength(arrayLike.length),
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
    return ES.SameValue(value, -0) ?
      ctx.stylize('-0', 'number') :
      ctx.stylize(ES.Call(pNumberToString, value), 'number');
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
    if (isString(value)) {
      simple = replace($stringify(value), /^"|"$/g, '');
      simple = replace(simple, /'/g, '\\\'');
      simple = replace(simple, /\\"/g, '"');
      return ctx.stylize('\'' + simple + '\'', 'string');
    }
    if (isNumber(value)) {
      return formatNumber(ctx, value);
    }
    if (isBoolean(value)) {
      return ctx.stylize(ES.Call(pBooleanToString, value), 'boolean');
    }
    // es6 symbol primitive
    if (isSymbol(value)) {
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
    if (!visibleKeys.has(key)) {
      if (key === 'BYTES_PER_ELEMENT' &&
          !value.BYTES_PER_ELEMENT && isTypedArray(value)) {

        constructor = getConstructorOf(value);
        if (constructor) {
          desc.value = constructor.BYTES_PER_ELEMENT;
        }
      } else if (isSymbol(key)) {
        name = '[' + ctx.stylize(ES.Call(pSymbolToString, key), 'symbol') + ']';
      } else {
        name = '[' + key + ']';
      }
    }
    if (!str) {
      if (!ES.Call(pSetHas, ctx.seen, [desc.value])) {
        str = formatValueIt(
          ctx,
          desc.value,
          isNull(recurseTimes) ? null : recurseTimes - 1
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
      if (ES.Call(pMatch, name, [/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/])) {
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
    ES.Call(pSetForEach, keys, [function (key) {
      ES.Call(pPush, output,
        [formatProperty(ctx, value, recurseTimes, visibleKeys, key, false)]
      );
    }]);
    return output;
  }

  function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    arrayEach(value, function (unused, index) {
      var k = ES.Call(pNumberToString, index);
      if (hasOwnProperty(value, k)) {
        ES.Call(pPush, output,
          [formatProperty(ctx, value, recurseTimes, visibleKeys, k, true)]
        );
      } else {
        ES.Call(pPush, output, ['']);
      }
    });
    ES.Call(pSetForEach, keys, [function (key) {
      if (isSymbol(key) || !key.match(/^\d+$/)) {
        ES.Call(pPush, output,
          [formatProperty(ctx, value, recurseTimes, visibleKeys, key, true)]
        );
      }
    }]);
    return output;
  }

  function formatTypedArray(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    arrayEach(value, function (item) {
      ES.Call(pPush, output, [formatNumber(ctx, item)]);
    });
    ES.Call(pSetForEach, keys, [function (key) {
      if (isSymbol(key) || !key.match(/^\d+$/)) {
        ES.Call(pPush, output,
          [formatProperty(ctx, value, recurseTimes, visibleKeys, key, true)]
        );
      }
    }]);
    return output;
  }

  function formatSet(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    collectionEach(value, function (v) {
      var nextRecurseTimes = isNull(recurseTimes) ? null : recurseTimes - 1,
        str = formatValueIt(ctx, v, nextRecurseTimes);
      ES.Call(pPush, output, [str]);
    });
    ES.Call(pSetForEach, keys, [function (key) {
      ES.Call(pPush, output,
        [formatProperty(ctx, value, recurseTimes, visibleKeys, key, false)]
      );
    }]);
    return output;
  }

  function formatMap(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    collectionEach(value, function (v, k) {
      var nextRecurseTimes = isNull(recurseTimes) ? null : recurseTimes - 1,
        str = formatValueIt(ctx, k, nextRecurseTimes);
      str += ' => ';
      str += formatValueIt(ctx, v, nextRecurseTimes);
      ES.Call(pPush, output, [str]);
    });
    ES.Call(pSetForEach, keys, [function (key) {
      ES.Call(pPush, output,
        [formatProperty(ctx, value, recurseTimes, visibleKeys, key, false)]
      );
    }]);
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
    var ret, dateString, primitive, keys, visibleKeys, formatted, raw,
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
      if (!isString(ret)) {
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
    keys = filterUnwanted($keys(value), unwantedProto);
    if (isError(value)) {
      keys = filterUnwanted(keys, unwantedError);
    } else if (isMap(value)) {
      keys = filterUnwanted(keys, unwantedMap);
    } else if (isSet(value)) {
      keys = filterUnwanted(keys, unwantedSet);
    } else if (isArrayBuffer(value)) {
      keys = filterUnwanted(keys, unwantedArrayBuffer);
    } else if (isTypedArray(value)) {
      keys = filterUnwanted(keys, unwantedTypedArray);
    } else if (isDataView(value)) {
      keys = filterUnwanted(
        filterIndex(keys, value.byteLength),
        unwantedDataView
      );
    }

    visibleKeys = new SetObject(keys);
    if (ctx.showHidden) {
      keys = $getOwnPropertyNames(value);
      if (isError(value)) {
        if (ES.Call(pIndexOf, keys, hiddenMessage) < 0) {
          ES.Call(pUnshift, keys, hiddenMessage);
        }
        if (ES.Call(pIndexOf, keys, hiddenStack) < 0) {
          ES.Call(pUnshift, keys, hiddenStack);
        }
      } else if (isTypedArray(value)) {
        keys = filterUnwanted(keys, unwantedOldTypedArray);
      } else if (isArrayBuffer(value)) {
        keys = filterUnwanted(
          filterIndex(keys, value.byteLength),
          unwantedOldArrayBuffer
        );
      } else if (isDataView(value)) {
        keys = filterUnwanted(
          filterIndex(keys, value.byteLength),
          unwantedDataView
        );
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
    } catch (ignore) { }

    if (isString(raw)) {
      // for boxed Strings, we have to remove the 0-n indexed entries,
      // since they just noisey up the output and are redundant
      keys = filterIndex(keys, raw.length);
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
      if (isString(raw)) {
        formatted = formatPrimitiveNoColor(ctx, raw);
        return ctx.stylize('[String: ' + formatted + ']', 'string');
      }
      if (isNumber(raw)) {
        formatted = formatPrimitiveNoColor(ctx, raw);
        return ctx.stylize('[Number: ' + formatted + ']', 'number');
      }
      if (isBoolean(raw)) {
        formatted = formatPrimitiveNoColor(ctx, raw);
        return ctx.stylize('[Boolean: ' + formatted + ']', 'boolean');
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
    name = constructor && getName(constructor);
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
        ES.Call(pUnshift, keys, hiddenLength);
      }
      empty = value.length === 0;
      formatter = formatArray;
    } else if (isCollection(value)) {
      // With `showHidden`, `length` will display as a hidden property for
      // arrays. For consistency's sake, do the same for `size`, even though
      // this property isn't selected by Object.getOwnPropertyNames().
      if (ctx.showHidden) {
        ES.Call(pUnshift, keys, hiddenSize);
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
      ES.Call(pUnshift, keys, hiddeByteLength);
      add(visibleKeys, 'byteLength');
    } else if (isDataView(value)) {
      name = 'DataView';
      ES.Call(pUnshift, keys, hiddenDataView);
      add(visibleKeys, 'byteLength');
      add(visibleKeys, 'byteOffset');
      add(visibleKeys, 'buffer');
    } else if (isTypedArray(value)) {
      braces = ['[', ']'];
      formatter = formatTypedArray;
      if (ctx.showHidden) {
        ES.Call(pUnshift, keys, hiddenTypedArray);
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
    } else if (isString(raw)) {
      // Make boxed primitive Strings look like such
      formatted = formatPrimitiveNoColor(ctx, raw);
      base = '[String: ' + formatted + ']';
    } else if (isNumber(raw)) {
      // Make boxed primitive Numbers look like such
      formatted = formatPrimitiveNoColor(ctx, raw);
      base = '[Number: ' + formatted + ']';
    } else if (isBoolean(raw)) {
      // Make boxed primitive Booleans look like such
      formatted = formatPrimitiveNoColor(ctx, raw);
      base = '[Boolean: ' + formatted + ']';
    }

    if (base) {
      base = ' ' + base;
    }

    // Add constructor name if available
    if (!base && name) {
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

    add(ctx.seen, value);

    output = formatter(
      ctx,
      value,
      recurseTimes,
      visibleKeys,
      new SetObject(keys)
    );

    ES.Call(pSetDelete, ctx.seen, [value]);

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
      seen: new SetObject(),
      stylize: stylizeNoColor
    };
    // legacy...
    if (arguments.length >= 3) {
      ctx.depth = arguments[2];
      if (arguments.length >= 4) {
        ctx.colors = arguments[3];
      }
    }
    if (isBoolean(opts)) {
      // legacy...
      ctx.showHidden = opts;
    } else if (!isPrimitive(opts) && !ES.IsCallable(opts)) {
      // got an "options" object
      assign(ctx, opts);
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
