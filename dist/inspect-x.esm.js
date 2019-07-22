var _this = this;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

import bind from 'bind-x';
import isFunction from 'is-function-x';
import isGeneratorFunction from 'is-generator-function';
import isAsyncFunction from 'is-async-function-x';
import isRegExp from 'is-regex';
import defineProperties from 'object-define-properties-x';
import isDate from 'is-date-object';
import isArrayBuffer from 'is-array-buffer-x';
import isSet from 'is-set-x';
import isMap from 'is-map-x';
import isTypedArray from 'is-typed-array';
import isDataView from 'is-data-view-x';
import isNil from 'is-nil-x';
import isError from 'is-error-x';
import isObjectLike from 'is-object-like-x';
import isPromise from 'is-promise';
import isString from 'is-string';
import isNumber from 'is-number-object';
import isBoolean from 'is-boolean-object';
import objectIs from 'object-is';
import isSymbol from 'is-symbol';
import isPrimitive from 'is-primitive';
import isArray from 'is-array-x';
import isNumberNaN from 'is-nan';
import toStr from 'to-string-x';
import getFunctionName from 'get-function-name-x';
import hasSymbolSupport from 'has-symbol-support-x';
import whiteSpace from 'white-space-x';
import reduce from 'array-reduce-x';
import filter from 'array-filter-x';
import some from 'array-some-x';
import every from 'array-every-x';
import map from 'array-map-x';
import slice from 'array-slice-x';
import reflectOwnKeys from 'reflect-own-keys-x';
import { stringify } from 'json3';
import objectKeys from 'object-keys-x';
import getOwnPropertyDescriptor from 'object-get-own-property-descriptor-x';
import getPrototypeOf from 'get-prototype-of-x';
import getOwnPropertySymbols from 'get-own-property-symbols-x';
import arrayincludes from 'array-includes-x';
import assign from 'object-assign-x';
import toISOString from 'to-iso-string-x';
import { SetConstructor } from 'collections-x';
import defineProperty from 'object-define-property-x';
import startsWith from 'string-starts-with-x';
import strIncludes from 'string-includes-x';
import clamp from 'math-clamp-x';
import difference from 'array-difference-x';
import intersection from 'array-intersection-x';
import union from 'array-union-x';
/** @type {RegExpConstructor} */

var RegExpCtr = /none/.constructor;
/** @type {BooleanConstructor} */

var NumberCtr = 0 .constructor;
/** @type {ArrayConstructor} */

var ArrayCtr = [].constructor;
/** @type {StringConstructor} */

var StringCtr = ''.constructor;
/** @type {ObjectConstructor} */

var castObject = {}.constructor;
/** @type {BooleanConstructor} */

var castBoolean = true.constructor;
var call = isFunction.call;
/* eslint-disable-next-line compat/compat */

var hasSet = typeof Set === 'function' && isSet(new Set());
/* eslint-disable-next-line compat/compat */

var testSet = hasSet && new Set(['SetSentinel']);
/* eslint-disable-next-line compat/compat */

var setForEach = hasSet && bind(call, Set.prototype.forEach);
/* eslint-disable-next-line compat/compat */

var setValues = hasSet && bind(call, Set.prototype.values);
/* eslint-disable-next-line compat/compat */

var hasMap = typeof Map === 'function' && isMap(new Map());
/* eslint-disable-next-line compat/compat */

var testMap = hasMap && new Map([[1, 'MapSentinel']]);
/* eslint-disable-next-line compat/compat */

var mapForEach = hasMap && bind(call, Map.prototype.forEach);
/* eslint-disable-next-line compat/compat */

var mapValues = hasMap && bind(call, Map.prototype.values);
/* eslint-disable-next-line compat/compat */

var symbolToString = hasSymbolSupport && bind(call, Symbol.prototype.toString);
/* eslint-disable-next-line compat/compat */

var symbolValueOf = hasSymbolSupport && bind(call, Symbol.prototype.valueOf);
var objectSeal = isFunction(castObject.seal) ? castObject.seal : function seal(value) {
  return value;
};
var regexpToString = bind(call, RegExpCtr.prototype.toString);
var regexpTest = bind(call, RegExpCtr.prototype.test);
var errorToString = bind(call, Error.prototype.toString);
var numberToString = bind(call, NumberCtr.prototype.toString);
var booleanToString = bind(call, castBoolean.prototype.toString);
var concat = bind(call, ArrayCtr.prototype.concat, []);
var join = bind(call, ArrayCtr.prototype.join);
var push = bind(call, ArrayCtr.prototype.push);
var getTime = bind(call, Date.prototype.getTime);
var replace = bind(call, StringCtr.prototype.replace);
var strSlice = bind(call, StringCtr.prototype.slice);
var propertyIsEnumerable = bind(call, castObject.prototype.propertyIsEnumerable);
/* eslint-disable-next-line compat/compat */

var customInspectSymbol = hasSymbolSupport ? Symbol('inspect.custom') : '_inspect.custom_';
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

var inspect;
var fmtValue;

var isFalsey = function _isFalsey(value) {
  return castBoolean(value) === false;
};

var supportsClasses;

try {
  /* eslint-disable-next-line no-new-func */
  Function('return class My {}')();
  supportsClasses = true;
} catch (ignore) {// empty
}

var isClass = function _isClass(value) {
  return supportsClasses ? isFunction(value, true) && isFunction(value) === false : false;
};

var supportsGetSet;

try {
  /* eslint-disable-next-line no-void */
  var testVar = void 0;
  var testObject = defineProperty({}, 'defaultOptions', {
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
  // noinspection ExceptionCaughtLocallyJS
  throw new Error('test');
} catch (e) {
  errProps = union(objectKeys(new Error()), objectKeys(e));
  var errorString = errorToString(e);
  var errorStack = e.stack;

  if (errorStack) {
    var errorRx = new RegExpCtr("^".concat(errorString));

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
  var datePropsCheck = ['now', 'UTC', 'parse'];
  shimmedDate = every(datePropsCheck, function (prop) {
    _newArrowCheck(this, _this);

    return arrayincludes(dateProps, prop);
  }.bind(this)) && arrayincludes(objectKeys(new Date()), 'constructor');
}
/* eslint-disable-next-line lodash/prefer-noop */


var testFunc1 = function test1() {};

var fnSupportsName = testFunc1.name === 'test1';
var hiddenFuncCtr = arrayincludes(reflectOwnKeys(testFunc1.prototype), 'constructor') === false;
var wantedFnProps = ['length', 'name', 'prototype'];
var fnPropsCheck = fnSupportsName ? slice(wantedFnProps) : filter(wantedFnProps, function (prop) {
  _newArrowCheck(this, _this);

  return prop !== 'name';
}.bind(this));
var funcKeys = reflectOwnKeys(testFunc1);
var unwantedFnProps = intersection(['arguments', 'caller'], funcKeys);
var mustFilterFnProps = difference(fnPropsCheck, funcKeys).length > 0;

if (mustFilterFnProps === false) {
  mustFilterFnProps = some(intersection(funcKeys, wantedFnProps), function (key, index) {
    _newArrowCheck(this, _this);

    return wantedFnProps[index] !== key;
  }.bind(this));
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
  return _typeof(arg) === 'symbol';
};

var isMapIterator = function _isMapIterator(value) {
  if (hasMap === false || isObjectLike(value) === false) {
    return false;
  }

  try {
    return value.next.call(mapValues(testMap)).value === 'MapSentinel';
  } catch (ignore) {// empty
  }

  return false;
};

var isSetIterator = function _isSetIterator(value) {
  if (hasSet === false || isObjectLike(value) === false) {
    return false;
  }

  try {
    return value.next.call(setValues(testSet)).value === 'SetSentinel';
  } catch (ignore) {// empty
  }

  return false;
};

var filterIndexes = function _filterIndexes(keys, length) {
  var _this2 = this;

  return filter(keys, function (key) {
    _newArrowCheck(this, _this2);

    return isSymbolType(key) || key < 0 || key > length || key % 1 !== 0;
  }.bind(this));
};

var stylizeWithColor = function _stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    var colors = inspect.colors[style];
    return "\x1B[".concat(colors[0], "m").concat(str, "\x1B[").concat(colors[1], "m");
  }

  return str;
};

var stylizeNoColor = function _stylizeNoColor(str) {
  return str;
};

var getNameSep = function _getNameSep(obj) {
  var name = getFunctionName(obj);
  return name ? ": ".concat(name) : name;
};

var getConstructorOf = function _getConstructorOf(obj) {
  var o = obj;
  var maxLoop = 100;

  while (isNil(o) === false && maxLoop >= 0) {
    o = castObject(o);
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

  return name || getFunctionName(getConstructorOf(value));
};

var fmtNumber = function _fmtNumber(ctx, value) {
  // Format -0 as '-0'.
  return ctx.stylize(objectIs(value, -0) ? '-0' : numberToString(value), 'number');
};

var fmtPrimitiveReplacers = [[/^"|"$/g, ''], [/'/g, "\\'"], [/\\"/g, '"']];

var fmtPrimitiveReplace = function _fmtPrimitiveReplace(acc, pair) {
  return replace(acc, pair[0], pair[1]);
};

var fmtPrimitive = function _fmtPrimitive(ctx, value) {
  if (isNil(value)) {
    var str = toStr(value);
    return ctx.stylize(str, str);
  }

  if (isStringType(value)) {
    return ctx.stylize("'".concat(reduce(fmtPrimitiveReplacers, fmtPrimitiveReplace, stringify(value)), "'"), 'string');
  }

  if (isNumberType(value)) {
    return fmtNumber(ctx, value);
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

var fmtPrimNoColor = function _fmtPrimNoColor(ctx, value) {
  var stylize = ctx.stylize;
  ctx.stylize = stylizeNoColor;
  var str = fmtPrimitive(ctx, value);
  ctx.stylize = stylize;
  return str;
};

var recurse = function _recurse(depth) {
  return depth === null ? null : depth - 1;
};

var fmtPropReplacers = [[/'/g, "\\'"], [/\\"/g, '"'], [/(^"|"$)/g, "'"], [/\\\\/g, '\\']];

var fmtPropReplace = function _fmtPropReplace(acc, pair) {
  return replace(acc, pair[0], pair[1]);
};

var fmtPropReplacer1 = [/\n/g, '\n  '];
var fmtPropReplacer2 = [/(^|\n)/g, '\n   '];
var fmtPropTestRx = /^"[\w$]+"$/;

var fmtProp = function _fmtProp(ctx, value, depth, visibleKeys, key, arr) {
  var desc = getOwnPropertyDescriptor(value, key) || {
    value: value[key]
  };
  /*
  // this is a fix for broken FireFox, should not be needed with es6-shim
  if (key === 'size' && (isSet(value) || isMap(value) && isFunction(value.size)) {
    desc.value = value.size();
  }
  */

  var name;

  if (arrayincludes(visibleKeys, key) === false) {
    if (key === 'BYTES_PER_ELEMENT' && isFalsey(value.BYTES_PER_ELEMENT) && isTypedArray(value)) {
      var _constructor = getConstructorOf(value);

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
    var formattedStr = fmtValue(ctx, desc.value, recurse(depth), key === 'prototype');

    if (strIncludes(formattedStr, '\n')) {
      var replacer = arr ? fmtPropReplacer1 : fmtPropReplacer2;
      str = replace(formattedStr, replacer[0], replacer[1]);
    } else {
      str = formattedStr;
    }
  }

  if (typeof name === 'undefined') {
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

  return "".concat(name, ": ").concat(str);
};

var fmtObject = function _fmtObject(ctx, value, depth, visibleKeys, keys) {
  return map(keys, function _mapFmObject(key) {
    return fmtProp(ctx, value, depth, visibleKeys, key, false);
  });
};

var getMoreItemText = function _getMoreItemText(remaining) {
  return "... ".concat(remaining, " more item").concat(pluralEnding(remaining));
};

var getEmptyItemText = function _getEmptyItemText(emptyItems) {
  return "<".concat(emptyItems, " empty item").concat(pluralEnding(emptyItems), ">");
};

var filterOutIndexes = function _filterOutIndexes(keys) {
  var _this3 = this;

  return filter(keys, function (key) {
    _newArrowCheck(this, _this3);

    return isSymbolType(key) || isDigits(key) === false;
  }.bind(this));
};

var fmtArray = function _fmtArray(ctx, value, depth, visibleKeys, keys) {
  var _this4 = this;

  var length = value.length;
  var maxLength = clamp(length, 0, ctx.maxArrayLength);
  var lastIndex = 0;
  var nextIndex = 0;
  var output = [];
  var moreItems = some(value, function (item, index) {
    _newArrowCheck(this, _this4);

    if (index !== nextIndex) {
      push(output, ctx.stylize(getEmptyItemText(index - lastIndex - 1), 'undefined'));
    }

    push(output, fmtProp(ctx, value, depth, visibleKeys, numberToString(index), true));
    lastIndex = index;
    nextIndex = index + 1;
    return nextIndex >= maxLength;
  }.bind(this));
  var remaining = length - nextIndex;

  if (remaining > 0) {
    if (moreItems) {
      push(output, getMoreItemText(remaining));
    } else {
      push(output, ctx.stylize(getEmptyItemText(remaining), 'undefined'));
    }
  }

  var fmtdProps = map(filterOutIndexes(keys), function (key) {
    _newArrowCheck(this, _this4);

    return fmtProp(ctx, value, depth, visibleKeys, key, true);
  }.bind(this));
  return concat(output, fmtdProps);
};

var fmtTypedArray = function _fmtTypedArray(ctx, value, depth, visibleKeys, keys) {
  var _this5 = this;

  var length = value.length;
  var maxLength = clamp(length, 0, ctx.maxArrayLength);
  var output = [];
  output.length = maxLength;
  var moreItems = some(value, function (item, index) {
    _newArrowCheck(this, _this5);

    if (index >= maxLength) {
      return true;
    }

    output[index] = fmtNumber(ctx, value[index]);
    return false;
  }.bind(this));

  if (moreItems) {
    push(output, getMoreItemText(length - maxLength));
  }

  var fmtdProps = map(filterOutIndexes(keys), function (key) {
    _newArrowCheck(this, _this5);

    return fmtProp(ctx, value, depth, visibleKeys, key, true);
  }.bind(this));
  return concat(output, fmtdProps);
};

var fmtSet = function _fmtSet(ctx, value, depth, visibleKeys, keys) {
  var _this6 = this;

  var output = [];
  setForEach(value, function (v) {
    _newArrowCheck(this, _this6);

    push(output, fmtValue(ctx, v, recurse(depth)));
  }.bind(this));
  var fmtdProps = map(keys, function (key) {
    _newArrowCheck(this, _this6);

    return fmtProp(ctx, value, depth, visibleKeys, key, false);
  }.bind(this));
  return concat(output, fmtdProps);
};

var fmtMap = function _fmtMap(ctx, value, depth, visibleKeys, keys) {
  var _this7 = this;

  var r = recurse(depth);
  var output = [];
  mapForEach(value, function (v, k) {
    _newArrowCheck(this, _this7);

    push(output, "".concat(fmtValue(ctx, k, r), " => ").concat(fmtValue(ctx, v, r)));
  }.bind(this));
  var fmtdProps = map(keys, function (key) {
    _newArrowCheck(this, _this7);

    return fmtProp(ctx, value, depth, visibleKeys, key, false);
  }.bind(this));
  return concat(output, fmtdProps);
};

var reSingle = new RegExpCtr("\\{[".concat(whiteSpace, "]+\\}"));
/* eslint-disable-next-line no-control-regex */

var lengthReduceRx = /\u001b\[\d\d?m/g;

var lengthReduce = function _lengthReduce(prev, cur) {
  return prev + replace(cur, lengthReduceRx, '').length + 1;
};

var reduceToSingleString = function _reduceToSingleString(out, base, braces, breakLength) {
  var result;

  if (reduce(out, lengthReduce, 0) > breakLength) {
    // If the opening "brace" is too large, like in the case of "Set {",
    // we need to force the first item to be on the next line or the
    // items will not line up correctly.
    var layoutBase = base === '' && braces[0].length === 1 ? '' : "".concat(base, "\n ");
    result = "".concat(braces[0] + layoutBase, " ").concat(join(out, ',\n  '), " ").concat(braces[1]);
  } else {
    result = "".concat(braces[0] + base, " ").concat(join(out, ', '), " ").concat(braces[1]);
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
        return replace(stack, errorToString(value), subName + (msg ? ": ".concat(msg) : ''));
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

fmtValue = function _fmtValue(ctx, value, depth, isProto) {
  var _this8 = this;

  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value) {
    var maybeCustomInspect = value[customInspectSymbol] || value.inspect;

    if (isFunction(maybeCustomInspect)) {
      // Filter out the util module, its inspect function is special
      if (maybeCustomInspect !== inspect) {
        var _constructor2 = getConstructorOf(value); // Also filter out any prototype objects using the circular check.


        var isCircular = _constructor2 && _constructor2.prototype === value;

        if (isCircular === false) {
          var ret = maybeCustomInspect.call(value, depth, ctx); // If the custom inspection method returned `this`, don't go into
          // infinite recursion.

          if (ret !== value) {
            return isStringType(ret) ? ret : fmtValue(ctx, ret, depth);
          }
        }
      }
    }
  } // Primitive types cannot have properties


  var primitive = fmtPrimitive(ctx, value);

  if (primitive) {
    return primitive;
  } // Look up the keys of the object.


  var visibleKeys = objectKeys(value);

  if (visibleKeys.length > 0) {
    if (shimmedDate && isDate(value)) {
      visibleKeys = filter(visibleKeys, function (key) {
        _newArrowCheck(this, _this8);

        return key !== 'constructor';
      }.bind(this));
    } else if (errProps.length > 0 && isError(value)) {
      visibleKeys = filter(visibleKeys, function (key) {
        _newArrowCheck(this, _this8);

        return arrayincludes(errProps, key) === false;
      }.bind(this));
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
      _newArrowCheck(this, _this8);

      return propertyIsEnumerable(value, key);
    }.bind(this));
    keys = concat(visibleKeys, enumSymbols);
  }

  if (isString(value)) {
    // for boxed Strings, we have to remove the 0-n indexed entries,
    // since they just noisy up the out and are redundant
    keys = filterIndexes(keys, value.length);
    visibleKeys = filterIndexes(visibleKeys, value.length);
  } else if (isArrayBuffer(value)) {
    keys = filterIndexes(keys, value.byteLength);
    visibleKeys = filterIndexes(visibleKeys, value.byteLength);
  }

  var name;
  var formatted; // Some type of object without properties can be shortcutted.

  if (keys.length < 1) {
    // This could be a boxed primitive (new String(), etc.)
    if (isString(value)) {
      return ctx.stylize("[".concat(getSubName(value, 'String'), ": ").concat(fmtPrimNoColor(ctx, value.valueOf()), "]"), 'string');
    }

    if (isNumber(value)) {
      return ctx.stylize("[".concat(getSubName(value, 'Number'), ": ").concat(fmtPrimNoColor(ctx, value.valueOf()), "]"), 'number');
    }

    if (isBoolean(value)) {
      return ctx.stylize("[".concat(getSubName(value, 'Boolean'), ": ").concat(fmtPrimNoColor(ctx, value.valueOf()), "]"), 'boolean');
    }

    if (isSymbol(value)) {
      return ctx.stylize("[Symbol: ".concat(fmtPrimNoColor(ctx, symbolValueOf(value)), "]"), 'symbol');
    }

    if (isAsyncFunction(value)) {
      return ctx.stylize("[AsyncFunction".concat(getNameSep(value), "]"), 'special');
    }

    if (isGeneratorFunction(value)) {
      return ctx.stylize("[GeneratorFunction".concat(getNameSep(value), "]"), 'special');
    }

    if (isFunction(value)) {
      return ctx.stylize("[".concat(getSubName(value, 'Function')).concat(getNameSep(value), "]"), 'special');
    }

    if (isClass(value)) {
      return ctx.stylize("[Class".concat(getNameSep(value), "]"), 'special');
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

      return ctx.stylize("[".concat(name, ": ").concat(formatted, "]"), 'date');
    }

    if (isError(value)) {
      return fmtError(value);
    } // Fast path for ArrayBuffer. Can't do the same for DataView because it
    // has a non-primitive buffer property that we need to recurse for.


    if (isArrayBuffer(value)) {
      return "".concat(getSubName(value, 'ArrayBuffer'), " { byteLength: ").concat(fmtNumber(ctx, value.byteLength), " }");
    }

    if (isMapIterator(value)) {
      return "".concat(getSubName(value, 'MapIterator'), " {}");
    }

    if (isSetIterator(value)) {
      return "".concat(getSubName(value, 'SetIterator'), " {}");
    }

    if (isPromise(value)) {
      return "".concat(getSubName(value, 'Promise'), " {}");
    }
  }

  var base = '';
  var empty = false;
  var braces = ['{', '}'];
  var fmtter = fmtObject; // We can't compare constructors for various objects using a comparison
  // like `constructor === Array` because the object could have come from a
  // different context and thus the constructor won't match. Instead we check
  // the constructor names (including those up the prototype chain where
  // needed) to determine object types.

  if (isString(value)) {
    // Make boxed primitive Strings look like such
    base = "[".concat(getSubName(value, 'String'), ": ").concat(fmtPrimNoColor(ctx, value.valueOf()), "]");
  } else if (isNumber(value)) {
    // Make boxed primitive Numbers look like such
    base = "[".concat(getSubName(value, 'Number'), ": ").concat(fmtPrimNoColor(ctx, value.valueOf()), "]");
  } else if (isBoolean(value)) {
    // Make boxed primitive Booleans look like such
    base = "[".concat(getSubName(value, 'Boolean'), ": ").concat(fmtPrimNoColor(ctx, value.valueOf()), "]");
  } else if (isFunction(value)) {
    // Make functions say that they are functions
    base = "[".concat(getSubName(value, 'Function')).concat(getNameSep(value), "]");
  } else if (isClass(value)) {
    // Make functions say that they are functions
    base = "[Class".concat(getNameSep(value), "]");
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
      base = "[".concat(name, ": ").concat(formatted, "]");
    }
  } else if (isError(value)) {
    name = getSubName(value); // Make error with message first say the error

    base = fmtError(value);
  } else if (isArray(value)) {
    name = getSubName(value); // Unset the constructor to prevent "Array [...]" for ordinary arrays.

    name = name === 'Array' ? '' : name;
    braces = ['[', ']'];

    if (ctx.showHidden) {
      keys = promote(keys, arrayKeys);
    }

    empty = value.length < 1;
    fmtter = fmtArray;
  } else if (isSet(value)) {
    name = getSubName(value, 'Set');
    fmtter = fmtSet; // With `showHidden`, `length` will display as a hidden property for
    // arrays. For consistency's sake, do the same for `size`, even though
    // this property isn't selected by Object.getOwnPropertyNames().

    if (ctx.showHidden) {
      keys = promote(keys, collectionKeys);
    }

    empty = value.size < 1;
  } else if (isMap(value)) {
    name = getSubName(value, 'Map');
    fmtter = fmtMap; // With `showHidden`, `length` will display as a hidden property for
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
    name = getSubName(value); // Unset the constructor to prevent "Object {...}" for ordinary objects.

    name = name === 'Object' ? '' : name;
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
  ctx.seen.delete(value);
  return reduceToSingleString(out, base, braces, ctx.breakLength);
};

inspect = function _inspect(obj, opts) {
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

  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } // Set default and user-specified options


  if (supportsGetSet) {
    ctx = assign({}, inspect.defaultOptions, ctx, opts);
  } else {
    ctx = assign({}, inspectDefaultOptions, inspect.defaultOptions, ctx, opts);
  }

  if (ctx.colors) {
    ctx.stylize = stylizeWithColor;
  }

  if (ctx.maxArrayLength === null) {
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
var ins = inspect;
export default ins;

//# sourceMappingURL=inspect-x.esm.js.map