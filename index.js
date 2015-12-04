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
 * object. This is useful for inspecting large complicated objects. Defaults to 2. To make it recurse indefinitely pass null.
 * - colors - if true, then the output will be styled with ANSI color codes.
 * Defaults to false. Colors are customizable, see below.
 * - customInspect - if false, then custom inspect(depth, opts) functions
 * defined on the objects being inspected won't be called. Defaults to true.
 * @version 0.0.1
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
    hasOwnProperty = require('has-own-property-x'),
    isDate = require('is-date-object'),
    toStringTag = require('to-string-tag-x'),
    isArrayBuffer = require('is-array-buffer'),
    isTypedArray = require('is-typedarray'),
    isObject = require('is-object'),
    isFunction = require('lodash.isfunction'),
    assign = require('object.assign').getPolyfill(),
    hasSymbol = typeof Symbol === 'function' && typeof Symbol() === 'symbol',
    hasSet = typeof Set === 'function',
    hasMap = typeof Map === 'function',
    inspectIt, formatValueIt;

  function isNull(arg) {
    return arg === null;
  }

  function isUndefined(arg) {
    return typeof arg === 'undefined';
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
    return hasSymbol && typeof arg === 'symbol';
  }

  function isError(err) {
    return isObject(err) &&
      (toStringTag(err) === '[object Error]' || err instanceof Error);
  }

  function isSet(value) {
    return hasSet && isObject(value) &&
      (toStringTag(value) === '[object Set]' || value instanceof Set);
  }

  function isMap(value) {
    return hasMap && isObject(value) &&
      (toStringTag(value) === '[object Map]' || value instanceof Map);
  }

  function stylizeWithColor(str, styleType) {
    var style = inspectIt.styles[styleType];
    if (style) {
      return '\u001b[' + inspectIt.colors[style][0] + 'm' + str +
        '\u001b[' + inspectIt.colors[style][1] + 'm';
    } else {
      return str;
    }
  }

  function stylizeNoColor(str) {
    return str;
  }

  function arrayToHash(array) {
    var hash = Object.create(null);
    array.forEach(function (val) {
      hash[val] = true;
    });
    return hash;
  }

  function getConstructorOf(obj) {
    while (obj) {
      var descriptor = Object.getOwnPropertyDescriptor(obj, 'constructor');
      if (!isUndefined(descriptor) &&
          isFunction(descriptor.value) &&
          descriptor.value.name !== '') {

        return descriptor.value;
      }
      obj = Object.getPrototypeOf(obj);
    }
    return null;
  }

  function formatNumber(ctx, value) {
    // Format -0 as '-0'. Strict equality won't distinguish 0 from -0,
    // so instead we use the fact that 1 / -0 < 0 whereas 1 / 0 > 0 .
    if (value === 0 && 1 / value < 0) {
      return ctx.stylize('-0', 'number');
    }
    return ctx.stylize(ES.ToString(value), 'number');
  }

  function formatPrimitive(ctx, value) {
    if (isUndefined(value)) {
      return ctx.stylize('undefined', 'undefined');
    }
    // For some reason typeof null is "object", so special case here.
    if (isNull(value)) {
      return ctx.stylize('null', 'null');
    }
    if (isString(value)) {
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
        .replace(/'/g, '\\\'')
        .replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');
    }
    if (isNumber(value)) {
      return formatNumber(ctx, value);
    }
    if (isBoolean(value)) {
      return ctx.stylize('' + value, 'boolean');
    }
    // es6 symbol primitive
    if (isSymbol(value)) {
      return ctx.stylize(value.toString(), 'symbol');
    }
  }

  function formatPrimitiveNoColor(ctx, value) {
    var stylize = ctx.stylize;
    ctx.stylize = stylizeNoColor;
    var str = formatPrimitive(ctx, value);
    ctx.stylize = stylize;
    return str;
  }

  function formatError(value) {
    return '[' + Error.prototype.toString.call(value) + ']';
  }

  function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
    var desc = Object.getOwnPropertyDescriptor(value, key) || {
        value: value[key]
      },
      name, str;
    if (desc.get) {
      if (desc.set) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else {
      if (desc.set) {
        str = ctx.stylize('[Setter]', 'special');
      }
    }
    if (!hasOwnProperty(visibleKeys, key)) {
      if (isSymbol(key)) {
        name = '[' + ctx.stylize(key.toString(), 'symbol') + ']';
      } else {
        name = '[' + key + ']';
      }
    }
    if (!str) {
      if (ctx.seen.indexOf(desc.value) < 0) {
        if (isNull(recurseTimes)) {
          str = formatValueIt(ctx, desc.value, null);
        } else {
          str = formatValueIt(ctx, desc.value, recurseTimes - 1);
        }
        if (str.indexOf('\n') > -1) {
          if (array) {
            str = str.replace(/\n/g, '\n  ');
          } else {
            str = str.replace(/(^|\n)/g, '\n   ');
          }
        }
      } else {
        str = ctx.stylize('[Circular]', 'special');
      }
    }
    if (isUndefined(name)) {
      if (array && key.match(/^\d+$/)) {
        return str;
      }
      name = JSON.stringify(ES.ToString(key));
      if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
        name = name.substr(1, name.length - 2);
        name = ctx.stylize(name, 'name');
      } else {
        name = name.replace(/'/g, '\\\'')
          .replace(/\\"/g, '"')
          .replace(/(^"|"$)/g, '\'')
          .replace(/\\\\/g, '\\');
        name = ctx.stylize(name, 'string');
      }
    }

    return name + ': ' + str;
  }

  function formatObject(ctx, value, recurseTimes, visibleKeys, keys) {
    return keys.map(function (key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, false);
    });
  }

  function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    for (var i = 0, l = value.length; i < l; i += 1) {
      var k = ES.ToString(i);
      if (hasOwnProperty(value, k)) {
        output.push(
          formatProperty(ctx, value, recurseTimes, visibleKeys, k, true)
        );
      } else {
        output.push('');
      }
    }
    keys.forEach(function (key) {
      if (isSymbol(key) || !key.match(/^\d+$/)) {
        output.push(
          formatProperty(ctx, value, recurseTimes, visibleKeys, key, true)
        );
      }
    });
    return output;
  }

  function formatTypedArray(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = new Array(value.length);
    for (var i = 0, l = value.length; i < l; i += 1) {
      output[i] = formatNumber(ctx, value[i]);
    }
    keys.forEach(function (key) {
      if (isSymbol(key) || !key.match(/^\d+$/)) {
        output.push(
          formatProperty(ctx, value, recurseTimes, visibleKeys, key, true)
        );
      }
    });
    return output;
  }

  function formatSet(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    value.forEach(function (v) {
      var nextRecurseTimes = isNull(recurseTimes) ? null : recurseTimes - 1;
      var str = formatValueIt(ctx, v, nextRecurseTimes);
      output.push(str);
    });
    keys.forEach(function (key) {
      output.push(
        formatProperty(ctx, value, recurseTimes, visibleKeys, key, false)
      );
    });
    return output;
  }

  function formatMap(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    value.forEach(function (v, k) {
      var nextRecurseTimes = isNull(recurseTimes) ? null : recurseTimes - 1;
      var str = formatValueIt(ctx, k, nextRecurseTimes);
      str += ' => ';
      str += formatValueIt(ctx, v, nextRecurseTimes);
      output.push(str);
    });
    keys.forEach(function (key) {
      output.push(
        formatProperty(ctx, value, recurseTimes, visibleKeys, key, false)
      );
    });
    return output;
  }

  function reduceToSingleString(output, base, braces) {
    var length = output.reduce(function (prev, cur) {
      return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
    }, 0);

    if (length > 60) {
      return braces[0] +
        // If the opening "brace" is too large, like in the case of "Set {",
        // we need to force the first item to be on the next line or the
        // items will not line up correctly.
        (base === '' && braces[0].length === 1 ? '' : base + '\n ') +
        ' ' +
        output.join(',\n  ') +
        ' ' +
        braces[1];
    }

    return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
  }

  formatValueIt = function formatValue(ctx, value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (ctx.customInspect && value && isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== inspectIt &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {

      var ret = value.inspect(recurseTimes, ctx);
      if (!isString(ret)) {
        ret = formatValue(ctx, ret, recurseTimes);
      }
      return ret;
    }

    // Primitive types cannot have properties
    var primitive = formatPrimitive(ctx, value);
    if (primitive) {
      return primitive;
    }

    // Look up the keys of the object.
    var keys = Object.keys(value);
    var visibleKeys = arrayToHash(keys);

    if (ctx.showHidden && isFunction(Object.getOwnPropertyNames)) {
      keys = Object.getOwnPropertyNames(value);
      if (isFunction(Object.getOwnPropertySymbols)) {
        keys = keys.concat(Object.getOwnPropertySymbols(value));
      }
    }

    // This could be a boxed primitive (new String(), etc.), check valueOf()
    // NOTE: Avoid calling `valueOf` on `Date` instance because it will return
    // a number which, when object has some additional user-stored `keys`,
    // will be printed out.
    var formatted;
    var raw = value;
    try {
      // the .valueOf() call can fail for a multitude of reasons
      if (!isDate(value)) {
        raw = value.valueOf();
      }
    } catch (ignore) { }

    if (isString(raw)) {
      // for boxed Strings, we have to remove the 0-n indexed entries,
      // since they just noisey up the output and are redundant
      keys = keys.filter(function (key) {
        return !(key > -1 && key % 1 === 0 && key <= raw.length);
      });
    }

    // Some type of object without properties can be shortcutted.
    if (keys.length === 0) {
      if (isFunction(value)) {
        var name = value.name ? ': ' + value.name : '';
        return ctx.stylize('[Function' + name + ']', 'special');
      }
      if (ES.IsRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      }
      if (isDate(value)) {
        return ctx.stylize(Date.prototype.toString.call(value), 'date');
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
      // Fast path for ArrayBuffer.  Can't do the same for DataView because it
      // has a non-primitive .buffer property that we need to recurse for.
      if (isArrayBuffer(value)) {
        return getConstructorOf(value).name +
          ' { byteLength: ' + formatNumber(ctx, value.byteLength) + ' }';
      }
    }

    var constructor = getConstructorOf(value);
    var base = '',
      empty = false,
      braces;
    var formatter = formatObject;

    // We can't compare constructors for various objects using a comparison
    // like `constructor === Array` because the object could have come from a
    // different context and thus the constructor won't match. Instead we check
    // the constructor names (including those up the prototype chain where
    // needed) to determine object types.
    if (Array.isArray(value)) {
      // Unset the constructor to prevent "Array [...]" for ordinary arrays.
      if (constructor && constructor.name === 'Array') {
        constructor = null;
      }
      braces = ['[', ']'];
      empty = value.length === 0;
      formatter = formatArray;
    } else if (isSet(value)) {
      braces = ['{', '}'];
      // With `showHidden`, `length` will display as a hidden property for
      // arrays. For consistency's sake, do the same for `size`, even though
      // this property isn't selected by Object.getOwnPropertyNames().
      if (ctx.showHidden) {
        keys.unshift('size');
      }
      empty = value.size === 0;
      formatter = formatSet;
    } else if (isMap(value)) {
      braces = ['{', '}'];
      // Ditto.
      if (ctx.showHidden) {
        keys.unshift('size');
      }
      empty = value.size === 0;
      formatter = formatMap;
    } else if (isArrayBuffer(value)) {
      braces = ['{', '}'];
      keys.unshift('byteLength');
      visibleKeys.byteLength = true;
    } else if (isTypedArray(value)) {
      braces = ['[', ']'];
      formatter = formatTypedArray;
      if (ctx.showHidden) {
        // .buffer goes last, it's not a primitive like the others.
        keys.unshift('BYTES_PER_ELEMENT',
          'length',
          'byteLength',
          'byteOffset',
          'buffer');
      }
    } else {
      // Unset the constructor to prevent "Object {...}" for ordinary
      // objects.
      if (constructor && constructor.name === 'Object') {
        constructor = null;
      }
      braces = ['{', '}'];
      empty = true; // No other data than keys.
    }

    empty = empty === true && keys.length === 0;

    // Make functions say that they are functions
    if (isFunction(value)) {
      var n = value.name ? ': ' + value.name : '';
      base = ' [Function' + n + ']';
    }

    // Make RegExps say that they are RegExps
    if (ES.IsRegExp(value)) {
      base = ' ' + RegExp.prototype.toString.call(value);
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + Date.prototype.toUTCString.call(value);
    }

    // Make error with message first say the error
    if (isError(value)) {
      base = ' ' + formatError(value);
    }

    // Make boxed primitive Strings look like such
    if (isString(raw)) {
      formatted = formatPrimitiveNoColor(ctx, raw);
      base = ' [String: ' + formatted + ']';
    }

    // Make boxed primitive Numbers look like such
    if (isNumber(raw)) {
      formatted = formatPrimitiveNoColor(ctx, raw);
      base = ' ' + '[Number: ' + formatted + ']';
    }

    // Make boxed primitive Booleans look like such
    if (isBoolean(raw)) {
      formatted = formatPrimitiveNoColor(ctx, raw);
      base = ' ' + '[Boolean: ' + formatted + ']';
    }

    // Add constructor name if available
    if (base === '' && constructor) {
      braces[0] = constructor.name + ' ' + braces[0];
    }

    if (empty === true) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (ES.IsRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      } else {
        return ctx.stylize('[Object]', 'special');
      }
    }

    ctx.seen.push(value);

    var output = formatter(ctx, value, recurseTimes, visibleKeys, keys);

    ctx.seen.pop();

    return reduceToSingleString(output, base, braces);
  };

  /**
   * Echos the value of a value. Trys to print the value out
   * in the best way possible given the different types.
   *
   * @param {Object} obj The object to print out.
   * @param {Object} [opts] Options object that alters the output.
   * @return {string} The string representation.
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
    }
    if (arguments.length >= 4) {
      ctx.colors = arguments[3];
    }
    if (isBoolean(opts)) {
      // legacy...
      ctx.showHidden = opts;
    } else if (isObject(opts)) {
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
  inspectIt.colors = {
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
  };

  // Don't use 'blue' not visible on cmd.exe
  inspectIt.styles = {
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
  };
}());
