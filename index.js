/**
 * @file An implementation of node's ES6 inspect module.
 * @version 2.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @see https://nodejs.org/api/util.html#util_util_inspect_object_options
 * @module inspect-x
 */

'use strict';

var bind = require('bind-x');
var call = Function.prototype.call;
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
var objectIs = require('object-is');
var isSymbol = require('is-symbol');
var isPrimitive = require('is-primitive');
var isArray = require('is-array-x');
var isNumberNaN = require('is-nan');
var toStr = require('to-string-x');
var getFunctionName = require('get-function-name-x');
var hasSymbolSupport = require('has-symbol-support-x');
var whiteSpace = require('white-space-x');
var hasSet = typeof Set === 'function' && isSet(new Set());
var testSet = hasSet && new Set(['SetSentinel']);
var setForEach = hasSet && bind(call, Set.prototype.forEach);
var setValues = hasSet && bind(call, Set.prototype.values);
var hasMap = typeof Map === 'function' && isMap(new Map());
var testMap = hasMap && new Map([[1, 'MapSentinel']]);
var mapForEach = hasMap && bind(call, Map.prototype.forEach);
var mapValues = hasMap && bind(call, Map.prototype.values);
var symbolToString = hasSymbolSupport && bind(call, Symbol.prototype.toString);
var symbolValueOf = hasSymbolSupport && bind(call, Symbol.prototype.valueOf);
var reduce = require('array-reduce-x');
var filter = require('array-filter-x');
var some = require('array-some-x');
var every = require('array-every-x');
var map = require('array-map-x');
var slice = require('array-slice-x');
var reflectOwnKeys = require('reflect-own-keys-x');
var stringify = require('json3').stringify;
var objectKeys = require('object-keys-x');
var getOwnPropertyDescriptor = require('object-get-own-property-descriptor-x');
var getPrototypeOf = require('get-prototype-of-x');
var objectSeal = isFunction(Object.seal) ? Object.seal : require('lodash.identity');
var getOwnPropertySymbols = require('get-own-property-symbols-x');
var arrayincludes = require('array-includes-x');
var assign = require('object-assign-x');
var toISOString = require('to-iso-string-x');
var collections = require('collections-x');
var defineProperty = require('object-define-property-x');
var startsWith = require('string-starts-with-x');
var strIncludes = require('string-includes-x');
var clamp = require('math-clamp');
var difference = require('array-difference-x');
var intersection = require('array-intersection-x');
var union = require('array-union-x');
var regexpToString = bind(call, RegExp.prototype.toString);
var regexpTest = bind(call, RegExp.prototype.test);
var errorToString = bind(call, Error.prototype.toString);
var numberToString = bind(call, Number.prototype.toString);
var booleanToString = bind(call, Boolean.prototype.toString);
var concat = bind(call, Array.prototype.concat, []);
var join = bind(call, Array.prototype.join);
var push = bind(call, Array.prototype.push);
var getTime = bind(call, Date.prototype.getTime);
var replace = bind(call, String.prototype.replace);
var strSlice = bind(call, String.prototype.slice);
var propertyIsEnumerable = bind(call, Object.prototype.propertyIsEnumerable);
var customInspectSymbol = hasSymbolSupport ? Symbol('inspect.custom') : '_inspect.custom_';
var inspect;
var fmtValue;

var isFalsey = function _isFalsey(value) {
  return Boolean(value) === false;
};

var supportsClasses;
try {
  // eslint-disable-next-line no-new-func
  Function('return class My {}')();
  supportsClasses = true;
} catch (e) {}

var isClass = function _isClass(value) {
  return supportsClasses ? isFunction(value, true) && isFunction(value) === false : false;
};

var supportsGetSet;
try {
  var testVar;
  var testObject = defineProperty({}, 'defaultOptions', {
    get: function () {
      return testVar;
    },
    set: function (val) {
      testVar = val;
      return testVar;
    }
  });

  testObject.defaultOptions = 'test';
  supportsGetSet = testVar === 'test' && testObject.defaultOptions === 'test';
} catch (ignore) {}

var pluralEnding = function _pluralEnding(number) {
  return number > 1 ? 's' : '';
};

var isDigits = function _isDigits(key) {
  return regexpTest(/^\d+$/, key);
};

var appendMissing = function _appendMissing(array, values) {
  return concat(array, difference(values, array));
};

var promote = function _promote(array, values) {
  return concat(values, difference(array, values));
};

var missingError;
var errProps;
try {
  throw new Error('test');
} catch (e) {
  errProps = union(objectKeys(new Error()), objectKeys(e));
  var errorString = errorToString(e);
  var errorStack = e.stack;
  if (errorStack) {
    var errorRx = new RegExp('^' + errorString);
    if (regexpTest(errorRx, errorStack) === false) {
      missingError = true;
    }
  }
}

if (isDate(Date.prototype)) {
  isDate = function _isDate(value) {
    try {
      getTime(value);
      return true;
    } catch (ignore) {
      return false;
    }
  };
}

var shimmedDate;
var dateProps = objectKeys(Date);
if (dateProps.length > 0) {
  var datePropsCheck = [
    'now',
    'UTC',
    'parse'
  ];

  shimmedDate = every(datePropsCheck, function (prop) {
    return arrayincludes(dateProps, prop);
  }) && arrayincludes(objectKeys(new Date()), 'constructor');
}

var testFunc1 = function test1() {};
var fnSupportsName = testFunc1.name === 'test1';
var hiddenFuncCtr = arrayincludes(reflectOwnKeys(testFunc1.prototype), 'constructor') === false;
var wantedFnProps = [
  'length',
  'name',
  'prototype'
];

var fnPropsCheck = fnSupportsName ? slice(wantedFnProps) : filter(wantedFnProps, function (prop) {
  return prop !== 'name';
});

var funcKeys = reflectOwnKeys(testFunc1);
var unwantedFnProps = intersection(['arguments', 'caller'], funcKeys);
var mustFilterFnProps = difference(fnPropsCheck, funcKeys).length > 0;
if (mustFilterFnProps === false) {
  mustFilterFnProps = some(intersection(funcKeys, wantedFnProps), function (key, index) {
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
    return value.next.call(mapValues(testMap)).value === 'MapSentinel';
  } catch (ignore) {}

  return false;
};

var isSetIterator = function _isSetIterator(value) {
  if (hasSet === false || isObjectLike(value) === false) {
    return false;
  }

  try {
    return value.next.call(setValues(testSet)).value === 'SetSentinel';
  } catch (ignore) {}

  return false;
};

var filterIndexes = function _filterIndexes(keys, length) {
  return filter(keys, function (key) {
    return isSymbolType(key) || key < 0 || key > length || key % 1 !== 0;
  });
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

var getConstructorOf = function _getConstructorOf(obj) {
  var o = obj;
  var maxLoop = 100;
  while (isNil(o) === false && maxLoop >= 0) {
    o = Object(o);
    var descriptor = getOwnPropertyDescriptor(o, 'constructor');
    if (descriptor && descriptor.value) {
      return descriptor.value;
    }

    o = getPrototypeOf(o);
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
  return ctx.stylize(objectIs(value, -0) ? '-0' : numberToString(value), 'number');
};

var fmtPrimitiveReplacers = [
  [/^"|"$/g, ''],
  [/'/g, '\\\''],
  [/\\"/g, '"']
];

var fmtPrimitiveReplace = function _fmtPrimitiveReplace(acc, pair) {
  return replace(acc, pair[0], pair[1]);
};

var fmtPrimitive = function _fmtPrimitive(ctx, value) {
  if (isNil(value)) {
    var str = toStr(value);
    return ctx.stylize(str, str);
  }

  if (isStringType(value)) {
    return ctx.stylize(
      '\'' + reduce(fmtPrimitiveReplacers, fmtPrimitiveReplace, stringify(value)) + '\'',
      'string'
    );
  }

  if (isNumberType(value)) {
    return fmtNumber(ctx, value);
  }

  if (isBooleanType(value)) {
    return ctx.stylize(booleanToString(value), 'boolean');
  }

  // es6 symbol primitive
  if (isSymbolType(value)) {
    return ctx.stylize(symbolToString(value), 'symbol');
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

var fmtPropReplacers = [
  [/'/g, '\\\''],
  [/\\"/g, '"'],
  [/(^"|"$)/g, '\''],
  [/\\\\/g, '\\']
];

var fmtPropReplace = function _fmtPropReplace(acc, pair) {
  return replace(acc, pair[0], pair[1]);
};

var fmtPropReplacer1 = [/\n/g, '\n  '];
var fmtPropReplacer2 = [/(^|\n)/g, '\n   '];
var fmtPropTestRx = /^"[\w$]+"$/;

// eslint-disable-next-line max-params
var fmtProp = function _fmtProp(ctx, value, depth, visibleKeys, key, arr) {
  var desc = getOwnPropertyDescriptor(value, key) || { value: value[key] };

  /*
  // this is a fix for broken FireFox, should not be needed with es6-shim
  if (key === 'size' && (isSet(value) || isMap(value) && isFunction(value.size)) {
    desc.value = value.size();
  }
  */

  var name;
  if (arrayincludes(visibleKeys, key) === false) {
    if (key === 'BYTES_PER_ELEMENT' && isFalsey(value.BYTES_PER_ELEMENT) && isTypedArray(value)) {
      var constructor = getConstructorOf(value);
      if (constructor) {
        desc.value = constructor.BYTES_PER_ELEMENT;
      }
    } else if (isSymbolType(key)) {
      name = '[' + ctx.stylize(symbolToString(key), 'symbol') + ']';
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
    var formattedStr = fmtValue(ctx, desc.value, recurse(depth), key === 'prototype');
    if (strIncludes(formattedStr, '\n')) {
      var replacer = arr ? fmtPropReplacer1 : fmtPropReplacer2;
      str = replace(formattedStr, replacer[0], replacer[1]);
    } else {
      str = formattedStr;
    }
  }

  if (isUndefined(name)) {
    if (arr && isDigits(key)) {
      return str;
    }

    var serialisedKey = stringify(key);
    if (regexpTest(fmtPropTestRx, serialisedKey)) {
      name = ctx.stylize(strSlice(serialisedKey, 1, -1), 'name');
    } else {
      name = ctx.stylize(reduce(fmtPropReplacers, fmtPropReplace, serialisedKey), 'string');
    }
  }

  return name + ': ' + str;
};

// eslint-disable-next-line max-params
var fmtObject = function _fmtObject(ctx, value, depth, visibleKeys, keys) {
  return map(keys, function _mapFmObject(key) {
    return fmtProp(ctx, value, depth, visibleKeys, key, false);
  });
};

var getMoreItemText = function _getMoreItemText(remaining) {
  return '... ' + remaining + ' more item' + pluralEnding(remaining);
};

var getEmptyItemText = function _getEmptyItemText(emptyItems) {
  return '<' + emptyItems + ' empty item' + pluralEnding(emptyItems) + '>';
};

var filterOutIndexes = function (keys) {
  return filter(keys, function (key) {
    return isSymbolType(key) || isDigits(key) === false;
  });
};

// eslint-disable-next-line max-params
var fmtArray = function _fmtArray(ctx, value, depth, visibleKeys, keys) {
  var length = value.length;
  var maxLength = clamp(length, 0, ctx.maxArrayLength);
  var lastIndex = 0;
  var nextIndex = 0;
  var output = [];

  var moreItems = some(value, function (item, index) {
    if (index !== nextIndex) {
      push(output, ctx.stylize(getEmptyItemText(index - lastIndex - 1), 'undefined'));
    }

    push(output, fmtProp(ctx, value, depth, visibleKeys, numberToString(index), true));
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

  var fmtdProps = map(filterOutIndexes(keys), function (key) {
    return fmtProp(ctx, value, depth, visibleKeys, key, true);
  });

  return concat(output, fmtdProps);
};

// eslint-disable-next-line max-params
var fmtTypedArray = function _fmtTypedArray(ctx, value, depth, visibleKeys, keys) {
  var length = value.length;
  var maxLength = clamp(length, 0, ctx.maxArrayLength);
  var output = [];
  output.length = maxLength;
  var moreItems = some(value, function (item, index) {
    if (index >= maxLength) {
      return true;
    }

    output[index] = fmtNumber(ctx, value[index]);
    return false;
  });

  if (moreItems) {
    push(output, getMoreItemText(length - maxLength));
  }

  var fmtdProps = map(filterOutIndexes(keys), function (key) {
    return fmtProp(ctx, value, depth, visibleKeys, key, true);
  });

  return concat(output, fmtdProps);
};

// eslint-disable-next-line max-params
var fmtSet = function _fmtSet(ctx, value, depth, visibleKeys, keys) {
  var output = [];
  setForEach(value, function (v) {
    push(output, fmtValue(ctx, v, recurse(depth)));
  });

  var fmtdProps = map(keys, function (key) {
    return fmtProp(ctx, value, depth, visibleKeys, key, false);
  });

  return concat(output, fmtdProps);
};

// eslint-disable-next-line max-params
var fmtMap = function (ctx, value, depth, visibleKeys, keys) {
  var r = recurse(depth);
  var output = [];
  mapForEach(value, function (v, k) {
    push(output, fmtValue(ctx, k, r) + ' => ' + fmtValue(ctx, v, r));
  });

  var fmtdProps = map(keys, function (key) {
    return fmtProp(ctx, value, depth, visibleKeys, key, false);
  });

  return concat(output, fmtdProps);
};

var reSingle = new RegExp('\\{[' + whiteSpace.string + ']+\\}');
var lengthReduceRx = /\u001b\[\d\d?m/g;

var lengthReduce = function _lengthReduce(prev, cur) {
  return prev + replace(cur, lengthReduceRx, '').length + 1;
};

// eslint-disable-next-line max-params
var reduceToSingleString = function _reduceToSingleString(out, base, braces, breakLength) {
  var result;
  if (reduce(out, lengthReduce, 0) > breakLength) {
    // If the opening "brace" is too large, like in the case of "Set {",
    // we need to force the first item to be on the next line or the
    // items will not line up correctly.
    var layoutBase = base === '' && braces[0].length === 1 ? '' : base + '\n ';
    result = braces[0] + layoutBase + ' ' + join(out, ',\n  ') + ' ' + braces[1];
  } else {
    result = braces[0] + base + ' ' + join(out, ', ') + ' ' + braces[1];
  }

  return replace(result, reSingle, '{}');
};

var fmtDate = function _fmtDate(value) {
  return isNumberNaN(getTime(value)) ? 'Invalid Date' : toISOString(value);
};

var fmtError = function _fmtError(value) {
  var stack = value.stack;
  if (stack) {
    if (supportsClasses) {
      var subName = getSubName(value);
      if (subName && startsWith(stack, subName) === false) {
        var msg = value.message;
        return replace(stack, errorToString(value), subName + (msg ? ': ' + msg : ''));
      }
    } else if (missingError) {
      return errorToString(value) + '\n' + stack;
    }
  }

  return stack || '[' + errorToString(value) + ']';
};

var typedArrayKeys = [
  'BYTES_PER_ELEMENT',
  'length',
  'byteLength',
  'byteOffset',
  'buffer'
];

var dataViewKeys = [
  'byteLength',
  'byteOffset',
  'buffer'
];

var arrayBufferKeys = ['byteLength'];
var collectionKeys = ['size'];
var arrayKeys = ['length'];
var errorKeys = ['message'];

// eslint-disable-next-line complexity,max-params
fmtValue = function _fmtValue(ctx, value, depth, isProto) {
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
  var visibleKeys = objectKeys(value);
  if (visibleKeys.length > 0) {
    if (shimmedDate && isDate(value)) {
      visibleKeys = filter(visibleKeys, function (key) {
        return key !== 'constructor';
      });
    } else if (errProps.length > 0 && isError(value)) {
      visibleKeys = filter(visibleKeys, function (key) {
        return arrayincludes(errProps, key) === false;
      });
    }
  }

  var keys;
  if (ctx.showHidden) {
    keys = reflectOwnKeys(value);
    if (isError(value)) {
      if (arrayincludes(keys, 'message') === false) {
        keys = promote(keys, errorKeys);
      }
    } else if ((unwantedFnProps.length > 0 || mustFilterFnProps) && isFunction(value)) {
      if (unwantedFnProps.length > 0) {
        keys = difference(keys, unwantedFnProps);
      }

      if (mustFilterFnProps) {
        var keysDiff = difference(keys, fnPropsCheck);
        var missingFnProps = difference(fnPropsCheck, visibleKeys, keysDiff);
        keys = concat(missingFnProps, keysDiff);
      }
    } else if (hiddenFuncCtr && isProto && isFunction(getConstructorOf(value))) {
      if (arrayincludes(visibleKeys, 'constructor') === false && arrayincludes(keys, 'constructor') === false) {
        keys = promote(keys, 'constructor');
      }
    }
  } else {
    var enumSymbols = filter(getOwnPropertySymbols(value), function (key) {
      return propertyIsEnumerable(value, key);
    });

    keys = concat(visibleKeys, enumSymbols);
  }

  if (isString(value)) {
    // for boxed Strings, we have to remove the 0-n indexed entries,
    // since they just noisey up the out and are redundant
    keys = filterIndexes(keys, value.length);
    visibleKeys = filterIndexes(visibleKeys, value.length);
  } else if (isArrayBuffer(value)) {
    keys = filterIndexes(keys, value.byteLength);
    visibleKeys = filterIndexes(visibleKeys, value.byteLength);
  }

  var name;
  var formatted;
  // Some type of object without properties can be shortcutted.
  if (keys.length < 1) {
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
        '[Symbol: ' + fmtPrimNoColor(ctx, symbolValueOf(value)) + ']',
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

    if (isClass(value)) {
      return ctx.stylize('[Class' + getNameSep(value) + ']', 'special');
    }

    if (isRegExp(value)) {
      return ctx.stylize(regexpToString(value), 'regexp');
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
  } else if (isClass(value)) {
    // Make functions say that they are functions
    base = '[Class' + getNameSep(value) + ']';
  } else if (isRegExp(value)) {
    // Make RegExps say that they are RegExps
    // name = getSubName(value, 'RegExp');
    base = regexpToString(value);
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
  } else if (isArray(value)) {
    name = getSubName(value);
    // Unset the constructor to prevent "Array [...]" for ordinary arrays.
    name = name === 'Array' ? '' : name;
    braces = ['[', ']'];
    if (ctx.showHidden) {
      keys = promote(keys, arrayKeys);
    }

    empty = value.length < 1;
    fmtter = fmtArray;
  } else if (isSet(value)) {
    name = getSubName(value, 'Set');
    fmtter = fmtSet;
    // With `showHidden`, `length` will display as a hidden property for
    // arrays. For consistency's sake, do the same for `size`, even though
    // this property isn't selected by Object.getOwnPropertyNames().
    if (ctx.showHidden) {
      keys = promote(keys, collectionKeys);
    }

    empty = value.size < 1;
  } else if (isMap(value)) {
    name = getSubName(value, 'Map');
    fmtter = fmtMap;
    // With `showHidden`, `length` will display as a hidden property for
    // arrays. For consistency's sake, do the same for `size`, even though
    // this property isn't selected by Object.getOwnPropertyNames().
    if (ctx.showHidden) {
      keys = promote(keys, collectionKeys);
    }

    empty = value.size < 1;
  } else if (isArrayBuffer(value)) {
    name = getSubName(value, 'ArrayBuffer');
    keys = promote(keys, arrayBufferKeys);
    visibleKeys = appendMissing(visibleKeys, arrayBufferKeys);
  } else if (isDataView(value)) {
    name = getSubName(value, 'DataView');
    keys = promote(keys, dataViewKeys);
    visibleKeys = appendMissing(visibleKeys, dataViewKeys);
  } else if (isTypedArray(value)) {
    name = getSubName(value);
    braces = ['[', ']'];
    fmtter = fmtTypedArray;
    if (ctx.showHidden) {
      keys = promote(keys, typedArrayKeys);
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

  empty = empty === true && keys.length < 1;
  if (empty) {
    return braces[0] + base + braces[1];
  }

  if (depth < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(regexpToString(value), 'regexp');
    }

    if (isArray(value)) {
      return ctx.stylize('[Array]', 'special');
    }

    return ctx.stylize('[Object]', 'special');
  }

  if (ctx.seen.has(value)) {
    return ctx.stylize('[Circular]', 'special');
  }

  ctx.seen.add(value);
  var out = fmtter(ctx, value, depth, visibleKeys, keys);
  ctx.seen['delete'](value);
  return reduceToSingleString(out, base, braces, ctx.breakLength);
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
    ctx = assign({}, inspect.defaultOptions, ctx, opts);
  } else {
    ctx = assign({}, inspectDefaultOptions, inspect.defaultOptions, ctx, opts);
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

      return assign(inspectDefaultOptions, options);
    }
  });
} else {
  defineProperties(inspect, {
    defaultOptions: {
      value: assign({}, inspectDefaultOptions),
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
