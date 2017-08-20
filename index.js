/**
 * @file An implementation of node's ES6 inspect module.
 * @version 1.9.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @see https://nodejs.org/api/util.html#util_util_inspect_object_options
 * @module inspect-x
 */

'use strict';

var isFunction = require('is-function-x');
var isGeneratorFunction = require('is-generator-function');
var isAsyncFunction = require('is-async-function-x');
var isRegExp = require('is-regex');
var defineProperties = require('object-define-properties-x');
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
var hasOwn = require('has-own-property-x');
var whiteSpace = require('white-space-x');
var reSingle = new RegExp('\\{[' + whiteSpace.string + ']+\\}');
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
var reduce = require('array-reduce-x');
var forEach = require('array-for-each-x');
var filter = require('array-filter-x');
var reflectOwnKeys = require('reflect-own-keys-x');
var $stringify = require('json3').stringify;
var $keys = require('object-keys-x');
var getOwnPropertyDescriptor = require('object-get-own-property-descriptor-x');
var $getPrototypeOf = require('get-prototype-of-x');
var $propertyIsEnumerable = Object.prototype.propertyIsEnumerable;
var $isArray = require('is-array-x');
var $includes = require('array-includes-x');
var $assign = require('object-assign-x');
var $isNaN = require('is-nan');
var pRegExpToString = RegExp.prototype.toString;
var pErrorToString = Error.prototype.toString;
var pNumberToString = Number.prototype.toString;
var pBooleanToString = Boolean.prototype.toString;
var toISOString = require('to-iso-string-x');
var collections = require('collections-x');
var defineProperty = require('object-define-property-x');
// var hasToStringTag = hasSymbolSupport && typeof Symbol.toStringTag === 'symbol';
var bpe = 'BYTES_PER_ELEMENT';
var inspect;
var fmtValue;

var customInspectSymbol = hasSymbolSupport ? Symbol('inspect.custom') : '_inspect.custom_';

var supportsClasses;
try {
  // eslint-disable-next-line no-new-func
  new Function('return class My {}')();
  supportsClasses = true;
} catch (e) {}

var supportsGetSet;
try {
  var testVar;
  var testObject = defineProperty({}, 'defaultOptions', {
    get: function _get() {
      return testVar;
    },
    set: function _set(val) {
      testVar = val;
      return testVar;
    }
  });

  testObject.defaultOptions = 'test';
  supportsGetSet = testVar === 'test' && testObject.defaultOptions === 'test';
} catch (ignore) {}

var $seal = isFunction(Object.seal) ? Object.seal : function seal(obj) {
  return obj;
};

var $getOwnPropertySymbols = isFunction(Object.getOwnPropertySymbols) && Object.getOwnPropertySymbols;
if ($getOwnPropertySymbols) {
  try {
    var gOPSymbol = hasSymbolSupport && Symbol('');
    var gOPSObj = { a: 1 };
    gOPSObj[gOPSymbol] = 2;

    var gOPSymbols = $getOwnPropertySymbols(gOPSObj);
    if (gOPSymbol) {
      if (gOPSymbols.length !== 1 || gOPSymbols[0] !== gOPSymbol) {
        throw new Error('Inavlid result');
      }
    } else if (gOPSymbols.length !== 0) {
      throw new Error('Inavlid result');
    }
  } catch (ignore) {
    $getOwnPropertySymbols = null;
  }
}

var missingError;
var errProps;
try {
  throw new Error('test');
} catch (e) {
  errProps = $keys(e);
  forEach($keys(new Error()), function _pusher(p) {
    if ($includes(errProps, p) === false) {
      errProps.push(p);
    }
  });

  var errorString = pErrorToString.call(e);
  var errorStack = e.stack;
  if (errorStack) {
    var errorRx = new RegExp('^' + errorString);
    if (errorRx.test(errorStack) === false) {
      missingError = true;
    }
  }
}

if (isDate(Date.prototype)) {
  isDate = function _isDate(value) {
    try {
      value.getTime();
      return true;
    } catch (ignore) {
      return false;
    }
  };
}

var dateProps = $keys(Date);
var shimmedDate;
if (dateProps.length && $includes(dateProps, 'now') && $includes(dateProps, 'UTC') && $includes(dateProps, 'parse')) {
  shimmedDate = $includes($keys(new Date()), 'constructor');
}

var inspectDefaultOptions = $seal({
  breakLength: 60,
  colors: false,
  customInspect: true,
  depth: 2,
  maxArrayLength: 100,
  showHidden: false,
  showProxy: false
});

var isBooleanType = function _isBooleanType(arg) {
  return typeof arg === 'boolean';
};

var isNumberType = function _isNumberType(arg) {
  return typeof arg === 'number';
};

var isStringType = function _isStringType(arg) {
  return typeof arg === 'string';
};

var isSymbolType = function _isSymbolType(arg) {
  return typeof arg === 'symbol';
};

var isMapIterator = function _isMapIterator(value) {
  if (hasMap === false || isObjectLike(value) === false) {
    return false;
  }

  try {
    return value.next.call(mValues.call(testMap)).value === 'MapSentinel';
  } catch (ignore) {}

  return false;
};

var isSetIterator = function _isSetIterator(value) {
  if (hasSet === false || isObjectLike(value) === false) {
    return false;
  }

  try {
    return value.next.call(sValues.call(testSet)).value === 'SetSentinel';
  } catch (ignore) {}

  return false;
};

var filterIndexes = function _filterIndexes(keys, length) {
  var i = keys.length - 1;
  while (i > -1) {
    var key = keys[i];
    if (key > -1 && key % 1 === 0 && key < length && isSymbolType(key) === false) {
      keys.splice(i, 1);
    }

    i -= 1;
  }
};

var pushUniq = function _pushUniq(arr, value) {
  if ($includes(arr, value) === false) {
    arr.push(value);
  }
};

var unshiftUniq = function _unshiftUniq(arr, value) {
  var index = indexOf(arr, value);
  if (index > -1) {
    arr.splice(index, 1);
  }

  arr.unshift(value);
};

var stylizeWithColor = function _stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];
  if (style) {
    var colors = inspect.colors[style];
    return '\u001b[' + colors[0] + 'm' + str + '\u001b[' + colors[1] + 'm';
  }

  return str;
};

var stylizeNoColor = function _stylizeNoColor(str) {
  return str;
};

var getNameSep = function _getNameSep(obj) {
  var name = getFunctionName(obj);
  return name ? ': ' + name : name;
};

var collectionEach = function _collectionEach(collection, callback) {
  if (isMap(collection)) {
    mForEach.call(collection, callback);
  } else if (isSet(collection)) {
    sForEach.call(collection, callback);
  }
};

var getConstructorOf = function _getConstructorOf(obj) {
  var o = obj;
  var maxLoop = 100;
  while (isNil(o) === false && maxLoop > -1) {
    o = Object(o);
    var descriptor = getOwnPropertyDescriptor(o, 'constructor');
    if (descriptor && descriptor.value) {
      return descriptor.value;
    }

    o = $getPrototypeOf(o);
    maxLoop -= 1;
  }

  return null;
};

var isSub = function _isSub(value) {
  if (supportsClasses !== true || isPrimitive(value)) {
    return false;
  }

  var constructor = getConstructorOf(value);
  return isFunction(constructor) === false && isFunction(constructor, true);
};

var getSubName = function _getSubName(value, name) {
  if (isSub(value)) {
    var subName = getFunctionName(getConstructorOf(value));
    if (subName && subName !== name) {
      return subName;
    }
  }

  return name ? name : getFunctionName(getConstructorOf(value));
};

var fmtNumber = function _fmtNumber(ctx, value) {
  // Format -0 as '-0'.
  return ctx.stylize(isNegZero(value) ? '-0' : pNumberToString.call(value), 'number');
};

var fmtPrimitive = function _fmtPrimitive(ctx, value) {
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

var fmtPrimNoColor = function _fmtPrimNoColor(ctx, value) {
  var stylize = ctx.stylize;
  ctx.stylize = stylizeNoColor;
  var str = fmtPrimitive(ctx, value);
  ctx.stylize = stylize;
  return str;
};

var recurse = function _recurse(depth) {
  return isNull(depth) ? null : depth - 1;
};

/*
var isCollection = function (value) {
  return isSet(value) || isMap(value);
};
*/

var isDigits = function _isDigits(key) {
  return (/^\d+$/).test(key);
};

// eslint-disable-next-line max-params
var fmtProp = function _fmtProp(ctx, value, depth, visibleKeys, key, arr) {
  var desc = getOwnPropertyDescriptor(value, key) || { value: value[key] };

  /*
  // this is a fix for broken FireFox, should not be needed with es6-shim
  if (key === 'size' && isCollection(value) && isFunction(value.size)) {
    desc.value = value.size();
  }
  */

  var name;
  if ($includes(visibleKeys, key) === false) {
    if (key === bpe && Boolean(value[bpe]) === false && isTypedArray(value)) {
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

// eslint-disable-next-line max-params
var fmtObject = function _fmtObject(ctx, value, depth, visibleKeys, keys) {
  var out = [];
  forEach(keys, function _pusherFmObject(key) {
    out.push(fmtProp(ctx, value, depth, visibleKeys, key, false));
  });

  return out;
};

// eslint-disable-next-line max-params
var fmtArray = function _fmtArray(ctx, value, depth, visibleKeys, keys) {
  var output = [];
  var visibleLength = 0;
  var index = 0;
  while (index < value.length && visibleLength < ctx.maxArrayLength) {
    var emptyItems = 0;
    while (index < value.length && hasOwn(value, pNumberToString.call(index)) === false) {
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

  forEach(keys, function _pusherFmtArray(key) {
    if (isSymbolType(key) || isDigits(key) === false) {
      output.push(fmtProp(ctx, value, depth, visibleKeys, key, true));
    }
  });

  return output;
};

// eslint-disable-next-line max-params
var fmtTypedArray = function _fmtTypedArray(ctx, value, depth, visibleKeys, keys) {
  var maxLength = Math.min(Math.max(0, ctx.maxArrayLength), value.length);
  var remaining = value.length - maxLength;
  var output = new Array(maxLength);
  for (var i = 0; i < maxLength; i += 1) {
    output[i] = fmtNumber(ctx, value[i]);
  }

  if (remaining > 0) {
    output.push('... ' + remaining + ' more item' + (remaining > 1 ? 's' : ''));
  }

  forEach(keys, function _pusherFmtTypedArray(key) {
    if (isSymbolType(key) || isDigits(key) === false) {
      output.push(fmtProp(ctx, value, depth, visibleKeys, key, true));
    }
  });

  return output;
};

// eslint-disable-next-line max-params
var fmtSet = function _fmtSet(ctx, value, depth, visibleKeys, keys) {
  var out = [];
  collectionEach(value, function _pusherFmtSet1(v) {
    out.push(fmtValue(ctx, v, recurse(depth)));
  });

  forEach(keys, function _pusherFmtSet2(key) {
    out.push(fmtProp(ctx, value, depth, visibleKeys, key, false));
  });

  return out;
};

// eslint-disable-next-line max-params
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

var reduceToSingleString = function _reduceToSingleString(out, base, braces) {
  var length = reduce(out, function _reducer(prev, cur) {
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

var fmtDate = function _fmtDate(value) {
  return $isNaN(value.getTime()) ? 'Invalid Date' : toISOString(value);
};

var fmtError = function _fmtError(value) {
  var stack = value.stack;
  if (stack) {
    if (supportsClasses) {
      var subName = getSubName(value);
      if (subName && stack.startsWith(subName) === false) {
        var msg = value.message;
        return stack.replace(pErrorToString.call(value), subName + (msg ? ': ' + msg : ''));
      }
    } else if (missingError) {
      return pErrorToString.call(value) + '\n' + stack;
    }
  }

  return stack || '[' + pErrorToString.call(value) + ']';
};

var filterDateKeys = function _filterDateKeys(key) {
  return key !== 'constructor';
};

var filterErrorKeys = function _filterErrorKeys(key) {
  return $includes(errProps, key) === false;
};

var getVisibleKeys = function _getVisibleKeys(value) {
  var keys = $keys(value);
  if (keys.length > 0) {
    if (shimmedDate && isDate(value)) {
      return filter(keys, filterDateKeys);
    }

    if (errProps.length > 0 && isError(value)) {
      return filter(keys, filterErrorKeys);
    }
  }

  return keys;
};

var getEnumSymbols = function _getEnumSymbols(value) {
  if ($getOwnPropertySymbols) {
    return filter($getOwnPropertySymbols(value), function _filterEnumSymbolKeys(key) {
      return $propertyIsEnumerable.call(value, key);
    });
  }

  return [];
};

// eslint-disable-next-line complexity
fmtValue = function _fmtValue(ctx, value, depth) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value) {
    var maybeCustomInspect = value[customInspectSymbol] || value.inspect;
    if (isFunction(maybeCustomInspect)) {
      // Filter out the util module, its inspect function is special
      if (maybeCustomInspect !== inspect) {
        var constructor = getConstructorOf(value);
        // Also filter out any prototype objects using the circular check.
        var isCircular = constructor && constructor.prototype === value;
        if (isCircular === false) {
          var ret = maybeCustomInspect.call(value, depth, ctx);
          // If the custom inspection method returned `this`, don't go into
          // infinite recursion.
          // eslint-disable-next-line max-depth
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
  var visibleKeys = getVisibleKeys(value);
  var keys;
  if (ctx.showHidden) {
    keys = reflectOwnKeys(value);
    if (isError(value)) {
      if ($includes(visibleKeys, 'message') === false && $includes(keys, 'message') === false) {
        unshiftUniq(keys, 'message');
      }

      /*
      if (includes(visibleKeys, 'name') === false && includes(keys, 'name') === false) {
        unshiftUniq(keys, 'name');
      }
      */
    }
  } else {
    keys = visibleKeys.concat(getEnumSymbols(value));
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

  var name;
  var formatted;
  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    // This could be a boxed primitive (new String(), etc.)
    if (isString(value)) {
      return ctx.stylize(
        '[' + getSubName(value, 'String') + ': ' + fmtPrimNoColor(ctx, value.valueOf()) + ']',
        'string'
      );
    }

    if (isNumber(value)) {
      return ctx.stylize(
        '[' + getSubName(value, 'Number') + ': ' + fmtPrimNoColor(ctx, value.valueOf()) + ']',
        'number'
      );
    }

    if (isBoolean(value)) {
      return ctx.stylize(
        '[' + getSubName(value, 'Boolean') + ': ' + fmtPrimNoColor(ctx, value.valueOf()) + ']',
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
      return ctx.stylize('[' + getSubName(value, 'Function') + getNameSep(value) + ']', 'special');
    }

    if (supportsClasses && isFunction(value, true)) {
      return ctx.stylize('[Class' + getNameSep(value) + ']', 'special');
    }

    if (isRegExp(value)) {
      return ctx.stylize(pRegExpToString.call(value), 'regexp');
    }

    if (isDate(value)) {
      name = getSubName(value);
      formatted = ctx.stylize(fmtDate(value), 'date');
      if (name === 'Date') {
        return formatted;
      }

      return ctx.stylize('[' + name + ': ' + formatted + ']', 'date');
    }

    if (isError(value)) {
      return fmtError(value);
    }

    // Fast path for ArrayBuffer. Can't do the same for DataView because it
    // has a non-primitive buffer property that we need to recurse for.
    if (isArrayBuffer(value)) {
      return getSubName(value, 'ArrayBuffer') + ' { byteLength: ' + fmtNumber(ctx, value.byteLength) + ' }';
    }

    if (isMapIterator(value)) {
      return getSubName(value, 'MapIterator') + ' {}';
    }

    if (isSetIterator(value)) {
      return getSubName(value, 'SetIterator') + ' {}';
    }

    if (isPromise(value)) {
      return getSubName(value, 'Promise') + ' {}';
    }
  }

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
    base = '[' + getSubName(value, 'String') + ': ' + fmtPrimNoColor(ctx, value.valueOf()) + ']';
  } else if (isNumber(value)) {
    // Make boxed primitive Numbers look like such
    base = '[' + getSubName(value, 'Number') + ': ' + fmtPrimNoColor(ctx, value.valueOf()) + ']';
  } else if (isBoolean(value)) {
    // Make boxed primitive Booleans look like such
    base = '[' + getSubName(value, 'Boolean') + ': ' + fmtPrimNoColor(ctx, value.valueOf()) + ']';
  } else if (isFunction(value)) {
    // Make functions say that they are functions
    base = '[' + getSubName(value, 'Function') + getNameSep(value) + ']';
  } else if (supportsClasses && isFunction(value, true)) {
    // Make functions say that they are functions
    base = '[Class' + getNameSep(value) + ']';
  } else if (isRegExp(value)) {
    // Make RegExps say that they are RegExps
    // name = getSubName(value, 'RegExp');
    base = pRegExpToString.call(value);
  } else if (isDate(value)) {
    // Make dates with properties first say the date
    name = getSubName(value);
    formatted = fmtDate(value);
    if (name === 'Date') {
      base = formatted;
    } else {
      base = '[' + name + ': ' + formatted + ']';
    }
  } else if (isError(value)) {
    name = getSubName(value);
    // Make error with message first say the error
    base = fmtError(value);
  } else if ($isArray(value)) {
    name = getSubName(value);
    // Unset the constructor to prevent "Array [...]" for ordinary arrays.
    name = name === 'Array' ? '' : name;
    braces = ['[', ']'];
    if (ctx.showHidden) {
      unshiftUniq(keys, 'length');
    }

    empty = value.length === 0;
    fmtter = fmtArray;
  } else if (isSet(value)) {
    name = getSubName(value, 'Set');
    fmtter = fmtSet;
    // With `showHidden`, `length` will display as a hidden property for
    // arrays. For consistency's sake, do the same for `size`, even though
    // this property isn't selected by Object.getOwnPropertyNames().
    if (ctx.showHidden) {
      unshiftUniq(keys, 'size');
    }

    empty = value.size === 0;
  } else if (isMap(value)) {
    name = getSubName(value, 'Map');
    fmtter = fmtMap;
    // With `showHidden`, `length` will display as a hidden property for
    // arrays. For consistency's sake, do the same for `size`, even though
    // this property isn't selected by Object.getOwnPropertyNames().
    if (ctx.showHidden) {
      unshiftUniq(keys, 'size');
    }

    empty = value.size === 0;
  } else if (isArrayBuffer(value)) {
    name = getSubName(value, 'ArrayBuffer');
    unshiftUniq(keys, 'byteLength');
    pushUniq(visibleKeys, 'byteLength');
  } else if (isDataView(value)) {
    name = getSubName(value, 'DataView');
    unshiftUniq(keys, 'buffer');
    unshiftUniq(keys, 'byteOffset');
    unshiftUniq(keys, 'byteLength');
    pushUniq(visibleKeys, 'byteLength');
    pushUniq(visibleKeys, 'byteOffset');
    pushUniq(visibleKeys, 'buffer');
  } else if (isTypedArray(value)) {
    name = getSubName(value);
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
    name = getSubName(value, 'Promise');
  } else if (isMapIterator(value)) {
    name = getSubName(value, 'MapIterator');
    empty = true;
  } else if (isSetIterator(value)) {
    name = getSubName(value, 'SetIterator');
    empty = true;
  } else {
    name = getSubName(value);
    // Unset the constructor to prevent "Object {...}" for ordinary objects.
    name = name === 'Object' ? '' : name;
    empty = true; // No other data than keys.
  }

  if (base) {
    base = ' ' + base;
  } else if (name) {
    // Add constructor name if available
    braces[0] = name + ' ' + braces[0];
  }

  empty = empty === true && keys.length === 0;
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

  if (ctx.seen.has(value)) {
    return ctx.stylize('[Circular]', 'special');
  }

  ctx.seen.add(value);
  var out = fmtter(ctx, value, depth, visibleKeys, keys);
  ctx.seen['delete'](value);
  return reduceToSingleString(out, base, braces);
};

inspect = function _inspect(obj, opts) {
  // default options
  var ctx = {
    seen: new collections.Set(),
    stylize: stylizeNoColor
  };

  // legacy...
  if (arguments.length >= 3 && isUndefined(arguments[2]) === false) {
    ctx.depth = arguments[2];
  }

  if (arguments.length >= 4 && isUndefined(arguments[3]) === false) {
    ctx.colors = arguments[3];
  }

  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  }

  // Set default and user-specified options
  if (supportsGetSet) {
    ctx = $assign({}, inspect.defaultOptions, ctx, opts);
  } else {
    ctx = $assign({}, inspectDefaultOptions, inspect.defaultOptions, ctx, opts);
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
  defineProperty(inspect, 'defaultOptions', {
    get: function _get() {
      return inspectDefaultOptions;
    },
    set: function _set(options) {
      if (isObjectLike(options) === false) {
        throw new TypeError('"options" must be an object');
      }

      return $assign(inspectDefaultOptions, options);
    }
  });
} else {
  defineProperties(inspect, {
    defaultOptions: {
      value: $assign({}, inspectDefaultOptions),
      writable: true
    }
  });
}

defineProperties(inspect, {
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
      'boolean': 'yellow',
      date: 'magenta',
      // name: intentionally not styling
      'null': 'bold',
      number: 'yellow',
      regexp: 'red',
      special: 'cyan',
      string: 'green',
      symbol: 'green',
      undefined: 'grey'
    }
  }
});

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 * Values may supply their own custom `inspect(depth, opts)` functions,
 * when called they receive the current depth in the recursive inspection,
 * as well as the options object passed to `inspect`.
 *
 * @param {Object} obj - The object to print out.
 * @param {Object} [opts] - Options object that alters the out.
 * @returns {string} The string representation.
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
module.exports = inspect;
