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
import {stringify} from 'json3';
import objectKeys from 'object-keys-x';
import getOwnPropertyDescriptor from 'object-get-own-property-descriptor-x';
import getPrototypeOf from 'get-prototype-of-x';
import getOwnPropertySymbols from 'get-own-property-symbols-x';
import arrayincludes from 'array-includes-x';
import assign from 'object-assign-x';
import toISOString from 'to-iso-string-x';
import {SetConstructor} from 'collections-x';
import defineProperty from 'object-define-property-x';
import startsWith from 'string-starts-with-x';
import strIncludes from 'string-includes-x';
import clamp from 'math-clamp-x';
import difference from 'array-difference-x';
import intersection from 'array-intersection-x';
import union from 'array-union-x';

/** @type {RegExpConstructor} */
const RegExpCtr = /none/.constructor;
/** @type {BooleanConstructor} */
const NumberCtr = (0).constructor;
/** @type {ArrayConstructor} */
const ArrayCtr = [].constructor;
/** @type {StringConstructor} */
const StringCtr = ''.constructor;
/** @type {ObjectConstructor} */
const castObject = {}.constructor;
/** @type {BooleanConstructor} */
const castBoolean = true.constructor;
const {call} = isFunction;

/* eslint-disable-next-line compat/compat */
const hasSet = typeof Set === 'function' && isSet(new Set());
/* eslint-disable-next-line compat/compat */
const testSet = hasSet && new Set(['SetSentinel']);
/* eslint-disable-next-line compat/compat */
const setForEach = hasSet && bind(call, Set.prototype.forEach);
/* eslint-disable-next-line compat/compat */
const setValues = hasSet && bind(call, Set.prototype.values);
/* eslint-disable-next-line compat/compat */
const hasMap = typeof Map === 'function' && isMap(new Map());
/* eslint-disable-next-line compat/compat */
const testMap = hasMap && new Map([[1, 'MapSentinel']]);
/* eslint-disable-next-line compat/compat */
const mapForEach = hasMap && bind(call, Map.prototype.forEach);
/* eslint-disable-next-line compat/compat */
const mapValues = hasMap && bind(call, Map.prototype.values);
/* eslint-disable-next-line compat/compat */
const symbolToString = hasSymbolSupport && bind(call, Symbol.prototype.toString);
/* eslint-disable-next-line compat/compat */
const symbolValueOf = hasSymbolSupport && bind(call, Symbol.prototype.valueOf);
const objectSeal = isFunction(castObject.seal)
  ? castObject.seal
  : function seal(value) {
      return value;
    };

const regexpToString = bind(call, RegExpCtr.prototype.toString);
const regexpTest = bind(call, RegExpCtr.prototype.test);
const errorToString = bind(call, Error.prototype.toString);
const numberToString = bind(call, NumberCtr.prototype.toString);
const booleanToString = bind(call, castBoolean.prototype.toString);
const concat = bind(call, ArrayCtr.prototype.concat, []);
const join = bind(call, ArrayCtr.prototype.join);
const push = bind(call, ArrayCtr.prototype.push);
const getTime = bind(call, Date.prototype.getTime);
const replace = bind(call, StringCtr.prototype.replace);
const strSlice = bind(call, StringCtr.prototype.slice);
const propertyIsEnumerable = bind(call, castObject.prototype.propertyIsEnumerable);
/* eslint-disable-next-line compat/compat */
const customInspectSymbol = hasSymbolSupport ? Symbol('inspect.custom') : '_inspect.custom_';

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
let inspect;
let fmtValue;

const isFalsey = function _isFalsey(value) {
  return castBoolean(value) === false;
};

let supportsClasses;
try {
  /* eslint-disable-next-line no-new-func */
  Function('return class My {}')();
  supportsClasses = true;
} catch (ignore) {
  // empty
}

const isClass = function _isClass(value) {
  return supportsClasses ? isFunction(value, true) && isFunction(value) === false : false;
};

let supportsGetSet;
try {
  /* eslint-disable-next-line no-void */
  let testVar = void 0;
  const testObject = defineProperty({}, 'defaultOptions', {
    get() {
      return testVar;
    },
    set(val) {
      testVar = val;

      return testVar;
    },
  });

  testObject.defaultOptions = 'test';
  supportsGetSet = testVar === 'test' && testObject.defaultOptions === 'test';
} catch (ignore) {
  // empty
}

const pluralEnding = function _pluralEnding(number) {
  return number > 1 ? 's' : '';
};

const isDigits = function _isDigits(key) {
  return regexpTest(/^\d+$/, key);
};

const appendMissing = function _appendMissing(array, values) {
  return concat(array, difference(values, array));
};

const promote = function _promote(array, values) {
  return concat(values, difference(array, values));
};

let missingError;
let errProps;
try {
  // noinspection ExceptionCaughtLocallyJS
  throw new Error('test');
} catch (e) {
  errProps = union(objectKeys(new Error()), objectKeys(e));
  const errorString = errorToString(e);
  const errorStack = e.stack;

  if (errorStack) {
    const errorRx = new RegExpCtr(`^${errorString}`);

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

let shimmedDate;
const dateProps = objectKeys(Date);

if (dateProps.length > 0) {
  const datePropsCheck = ['now', 'UTC', 'parse'];

  shimmedDate =
    every(datePropsCheck, (prop) => {
      return arrayincludes(dateProps, prop);
    }) && arrayincludes(objectKeys(new Date()), 'constructor');
}

/* eslint-disable-next-line lodash/prefer-noop */
const testFunc1 = function test1() {};

const fnSupportsName = testFunc1.name === 'test1';
const hiddenFuncCtr = arrayincludes(reflectOwnKeys(testFunc1.prototype), 'constructor') === false;
const wantedFnProps = ['length', 'name', 'prototype'];

const fnPropsCheck = fnSupportsName
  ? slice(wantedFnProps)
  : filter(wantedFnProps, (prop) => {
      return prop !== 'name';
    });

const funcKeys = reflectOwnKeys(testFunc1);
const unwantedFnProps = intersection(['arguments', 'caller'], funcKeys);
let mustFilterFnProps = difference(fnPropsCheck, funcKeys).length > 0;

if (mustFilterFnProps === false) {
  mustFilterFnProps = some(intersection(funcKeys, wantedFnProps), (key, index) => {
    return wantedFnProps[index] !== key;
  });
}

const inspectDefaultOptions = objectSeal({
  breakLength: 60,
  colors: false,
  customInspect: true,
  depth: 2,
  maxArrayLength: 100,
  showHidden: false,
  showProxy: false,
});

const isBooleanType = function _isBooleanType(arg) {
  return typeof arg === 'boolean';
};

const isNumberType = function _isNumberType(arg) {
  return typeof arg === 'number';
};

const isStringType = function _isStringType(arg) {
  return typeof arg === 'string';
};

const isSymbolType = function _isSymbolType(arg) {
  return typeof arg === 'symbol';
};

const isMapIterator = function _isMapIterator(value) {
  if (hasMap === false || isObjectLike(value) === false) {
    return false;
  }

  try {
    return value.next.call(mapValues(testMap)).value === 'MapSentinel';
  } catch (ignore) {
    // empty
  }

  return false;
};

const isSetIterator = function _isSetIterator(value) {
  if (hasSet === false || isObjectLike(value) === false) {
    return false;
  }

  try {
    return value.next.call(setValues(testSet)).value === 'SetSentinel';
  } catch (ignore) {
    // empty
  }

  return false;
};

const filterIndexes = function _filterIndexes(keys, length) {
  return filter(keys, (key) => {
    return isSymbolType(key) || key < 0 || key > length || key % 1 !== 0;
  });
};

const stylizeWithColor = function _stylizeWithColor(str, styleType) {
  const style = inspect.styles[styleType];

  if (style) {
    const colors = inspect.colors[style];

    return `\u001b[${colors[0]}m${str}\u001b[${colors[1]}m`;
  }

  return str;
};

const stylizeNoColor = function _stylizeNoColor(str) {
  return str;
};

const getNameSep = function _getNameSep(obj) {
  const name = getFunctionName(obj);

  return name ? `: ${name}` : name;
};

const getConstructorOf = function _getConstructorOf(obj) {
  let o = obj;
  let maxLoop = 100;
  while (isNil(o) === false && maxLoop >= 0) {
    o = castObject(o);
    const descriptor = getOwnPropertyDescriptor(o, 'constructor');

    if (descriptor && descriptor.value) {
      return descriptor.value;
    }

    o = getPrototypeOf(o);
    maxLoop -= 1;
  }

  return null;
};

const isSub = function _isSub(value) {
  if (supportsClasses !== true || isPrimitive(value)) {
    return false;
  }

  const constructor = getConstructorOf(value);

  return isFunction(constructor) === false && isFunction(constructor, true);
};

const getSubName = function _getSubName(value, name) {
  if (isSub(value)) {
    const subName = getFunctionName(getConstructorOf(value));

    if (subName && subName !== name) {
      return subName;
    }
  }

  return name || getFunctionName(getConstructorOf(value));
};

const fmtNumber = function _fmtNumber(ctx, value) {
  // Format -0 as '-0'.
  return ctx.stylize(objectIs(value, -0) ? '-0' : numberToString(value), 'number');
};

const fmtPrimitiveReplacers = [[/^"|"$/g, ''], [/'/g, "\\'"], [/\\"/g, '"']];

const fmtPrimitiveReplace = function _fmtPrimitiveReplace(acc, pair) {
  return replace(acc, pair[0], pair[1]);
};

const fmtPrimitive = function _fmtPrimitive(ctx, value) {
  if (isNil(value)) {
    const str = toStr(value);

    return ctx.stylize(str, str);
  }

  if (isStringType(value)) {
    return ctx.stylize(`'${reduce(fmtPrimitiveReplacers, fmtPrimitiveReplace, stringify(value))}'`, 'string');
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

  /* eslint-disable-next-line no-void */
  return void 0;
};

const fmtPrimNoColor = function _fmtPrimNoColor(ctx, value) {
  const {stylize} = ctx;
  ctx.stylize = stylizeNoColor;
  const str = fmtPrimitive(ctx, value);
  ctx.stylize = stylize;

  return str;
};

const recurse = function _recurse(depth) {
  return depth === null ? null : depth - 1;
};

const fmtPropReplacers = [[/'/g, "\\'"], [/\\"/g, '"'], [/(^"|"$)/g, "'"], [/\\\\/g, '\\']];

const fmtPropReplace = function _fmtPropReplace(acc, pair) {
  return replace(acc, pair[0], pair[1]);
};

const fmtPropReplacer1 = [/\n/g, '\n  '];
const fmtPropReplacer2 = [/(^|\n)/g, '\n   '];
const fmtPropTestRx = /^"[\w$]+"$/;

const fmtProp = function _fmtProp(ctx, value, depth, visibleKeys, key, arr) {
  const desc = getOwnPropertyDescriptor(value, key) || {value: value[key]};

  /*
  // this is a fix for broken FireFox, should not be needed with es6-shim
  if (key === 'size' && (isSet(value) || isMap(value) && isFunction(value.size)) {
    desc.value = value.size();
  }
  */

  let name;

  if (arrayincludes(visibleKeys, key) === false) {
    if (key === 'BYTES_PER_ELEMENT' && isFalsey(value.BYTES_PER_ELEMENT) && isTypedArray(value)) {
      const constructor = getConstructorOf(value);

      if (constructor) {
        desc.value = constructor.BYTES_PER_ELEMENT;
      }
    } else if (isSymbolType(key)) {
      name = `[${ctx.stylize(symbolToString(key), 'symbol')}]`;
    } else {
      name = `[${key}]`;
    }
  }

  let str;

  if (desc.get) {
    str = ctx.stylize(desc.set ? '[Getter/Setter]' : '[Getter]', 'special');
  } else if (desc.set) {
    str = ctx.stylize('[Setter]', 'special');
  } else {
    const formattedStr = fmtValue(ctx, desc.value, recurse(depth), key === 'prototype');

    if (strIncludes(formattedStr, '\n')) {
      const replacer = arr ? fmtPropReplacer1 : fmtPropReplacer2;
      str = replace(formattedStr, replacer[0], replacer[1]);
    } else {
      str = formattedStr;
    }
  }

  if (typeof name === 'undefined') {
    if (arr && isDigits(key)) {
      return str;
    }

    const serialisedKey = stringify(key);

    if (regexpTest(fmtPropTestRx, serialisedKey)) {
      name = ctx.stylize(strSlice(serialisedKey, 1, -1), 'name');
    } else {
      name = ctx.stylize(reduce(fmtPropReplacers, fmtPropReplace, serialisedKey), 'string');
    }
  }

  return `${name}: ${str}`;
};

const fmtObject = function _fmtObject(ctx, value, depth, visibleKeys, keys) {
  return map(keys, function _mapFmObject(key) {
    return fmtProp(ctx, value, depth, visibleKeys, key, false);
  });
};

const getMoreItemText = function _getMoreItemText(remaining) {
  return `... ${remaining} more item${pluralEnding(remaining)}`;
};

const getEmptyItemText = function _getEmptyItemText(emptyItems) {
  return `<${emptyItems} empty item${pluralEnding(emptyItems)}>`;
};

const filterOutIndexes = function _filterOutIndexes(keys) {
  return filter(keys, (key) => {
    return isSymbolType(key) || isDigits(key) === false;
  });
};

const fmtArray = function _fmtArray(ctx, value, depth, visibleKeys, keys) {
  const {length} = value;
  const maxLength = clamp(length, 0, ctx.maxArrayLength);
  let lastIndex = 0;
  let nextIndex = 0;
  const output = [];

  const moreItems = some(value, (item, index) => {
    if (index !== nextIndex) {
      push(output, ctx.stylize(getEmptyItemText(index - lastIndex - 1), 'undefined'));
    }

    push(output, fmtProp(ctx, value, depth, visibleKeys, numberToString(index), true));
    lastIndex = index;
    nextIndex = index + 1;

    return nextIndex >= maxLength;
  });

  const remaining = length - nextIndex;

  if (remaining > 0) {
    if (moreItems) {
      push(output, getMoreItemText(remaining));
    } else {
      push(output, ctx.stylize(getEmptyItemText(remaining), 'undefined'));
    }
  }

  const fmtdProps = map(filterOutIndexes(keys), (key) => {
    return fmtProp(ctx, value, depth, visibleKeys, key, true);
  });

  return concat(output, fmtdProps);
};

const fmtTypedArray = function _fmtTypedArray(ctx, value, depth, visibleKeys, keys) {
  const {length} = value;
  const maxLength = clamp(length, 0, ctx.maxArrayLength);
  const output = [];
  output.length = maxLength;
  const moreItems = some(value, (item, index) => {
    if (index >= maxLength) {
      return true;
    }

    output[index] = fmtNumber(ctx, value[index]);

    return false;
  });

  if (moreItems) {
    push(output, getMoreItemText(length - maxLength));
  }

  const fmtdProps = map(filterOutIndexes(keys), (key) => {
    return fmtProp(ctx, value, depth, visibleKeys, key, true);
  });

  return concat(output, fmtdProps);
};

const fmtSet = function _fmtSet(ctx, value, depth, visibleKeys, keys) {
  const output = [];
  setForEach(value, (v) => {
    push(output, fmtValue(ctx, v, recurse(depth)));
  });

  const fmtdProps = map(keys, (key) => {
    return fmtProp(ctx, value, depth, visibleKeys, key, false);
  });

  return concat(output, fmtdProps);
};

const fmtMap = function _fmtMap(ctx, value, depth, visibleKeys, keys) {
  const r = recurse(depth);
  const output = [];
  mapForEach(value, (v, k) => {
    push(output, `${fmtValue(ctx, k, r)} => ${fmtValue(ctx, v, r)}`);
  });

  const fmtdProps = map(keys, (key) => {
    return fmtProp(ctx, value, depth, visibleKeys, key, false);
  });

  return concat(output, fmtdProps);
};

const reSingle = new RegExpCtr(`\\{[${whiteSpace}]+\\}`);
/* eslint-disable-next-line no-control-regex */
const lengthReduceRx = /\u001b\[\d\d?m/g;

const lengthReduce = function _lengthReduce(prev, cur) {
  return prev + replace(cur, lengthReduceRx, '').length + 1;
};

const reduceToSingleString = function _reduceToSingleString(out, base, braces, breakLength) {
  let result;

  if (reduce(out, lengthReduce, 0) > breakLength) {
    // If the opening "brace" is too large, like in the case of "Set {",
    // we need to force the first item to be on the next line or the
    // items will not line up correctly.
    const layoutBase = base === '' && braces[0].length === 1 ? '' : `${base}\n `;
    result = `${braces[0] + layoutBase} ${join(out, ',\n  ')} ${braces[1]}`;
  } else {
    result = `${braces[0] + base} ${join(out, ', ')} ${braces[1]}`;
  }

  return replace(result, reSingle, '{}');
};

const fmtDate = function _fmtDate(value) {
  return isNumberNaN(getTime(value)) ? 'Invalid Date' : toISOString(value);
};

const fmtError = function _fmtError(value) {
  const {stack} = value;

  if (stack) {
    if (supportsClasses) {
      const subName = getSubName(value);

      if (subName && startsWith(stack, subName) === false) {
        const msg = value.message;

        return replace(stack, errorToString(value), subName + (msg ? `: ${msg}` : ''));
      }
    } else if (missingError) {
      return `${errorToString(value)}\n${stack}`;
    }
  }

  return stack || `[${errorToString(value)}]`;
};

const typedArrayKeys = ['BYTES_PER_ELEMENT', 'length', 'byteLength', 'byteOffset', 'buffer'];

const dataViewKeys = ['byteLength', 'byteOffset', 'buffer'];

const arrayBufferKeys = ['byteLength'];
const collectionKeys = ['size'];
const arrayKeys = ['length'];
const errorKeys = ['message'];

fmtValue = function _fmtValue(ctx, value, depth, isProto) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value) {
    const maybeCustomInspect = value[customInspectSymbol] || value.inspect;

    if (isFunction(maybeCustomInspect)) {
      // Filter out the util module, its inspect function is special
      if (maybeCustomInspect !== inspect) {
        const constructor = getConstructorOf(value);
        // Also filter out any prototype objects using the circular check.
        const isCircular = constructor && constructor.prototype === value;

        if (isCircular === false) {
          const ret = maybeCustomInspect.call(value, depth, ctx);

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
  const primitive = fmtPrimitive(ctx, value);

  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  let visibleKeys = objectKeys(value);

  if (visibleKeys.length > 0) {
    if (shimmedDate && isDate(value)) {
      visibleKeys = filter(visibleKeys, (key) => {
        return key !== 'constructor';
      });
    } else if (errProps.length > 0 && isError(value)) {
      visibleKeys = filter(visibleKeys, (key) => {
        return arrayincludes(errProps, key) === false;
      });
    }
  }

  let keys;

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
        const keysDiff = difference(keys, fnPropsCheck);
        const missingFnProps = difference(fnPropsCheck, visibleKeys, keysDiff);
        keys = concat(missingFnProps, keysDiff);
      }
    } else if (hiddenFuncCtr && isProto && isFunction(getConstructorOf(value))) {
      if (arrayincludes(visibleKeys, 'constructor') === false && arrayincludes(keys, 'constructor') === false) {
        keys = promote(keys, 'constructor');
      }
    }
  } else {
    const enumSymbols = filter(getOwnPropertySymbols(value), (key) => {
      return propertyIsEnumerable(value, key);
    });

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

  let name;
  let formatted;

  // Some type of object without properties can be shortcutted.
  if (keys.length < 1) {
    // This could be a boxed primitive (new String(), etc.)
    if (isString(value)) {
      return ctx.stylize(`[${getSubName(value, 'String')}: ${fmtPrimNoColor(ctx, value.valueOf())}]`, 'string');
    }

    if (isNumber(value)) {
      return ctx.stylize(`[${getSubName(value, 'Number')}: ${fmtPrimNoColor(ctx, value.valueOf())}]`, 'number');
    }

    if (isBoolean(value)) {
      return ctx.stylize(`[${getSubName(value, 'Boolean')}: ${fmtPrimNoColor(ctx, value.valueOf())}]`, 'boolean');
    }

    if (isSymbol(value)) {
      return ctx.stylize(`[Symbol: ${fmtPrimNoColor(ctx, symbolValueOf(value))}]`, 'symbol');
    }

    if (isAsyncFunction(value)) {
      return ctx.stylize(`[AsyncFunction${getNameSep(value)}]`, 'special');
    }

    if (isGeneratorFunction(value)) {
      return ctx.stylize(`[GeneratorFunction${getNameSep(value)}]`, 'special');
    }

    if (isFunction(value)) {
      return ctx.stylize(`[${getSubName(value, 'Function')}${getNameSep(value)}]`, 'special');
    }

    if (isClass(value)) {
      return ctx.stylize(`[Class${getNameSep(value)}]`, 'special');
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

      return ctx.stylize(`[${name}: ${formatted}]`, 'date');
    }

    if (isError(value)) {
      return fmtError(value);
    }

    // Fast path for ArrayBuffer. Can't do the same for DataView because it
    // has a non-primitive buffer property that we need to recurse for.
    if (isArrayBuffer(value)) {
      return `${getSubName(value, 'ArrayBuffer')} { byteLength: ${fmtNumber(ctx, value.byteLength)} }`;
    }

    if (isMapIterator(value)) {
      return `${getSubName(value, 'MapIterator')} {}`;
    }

    if (isSetIterator(value)) {
      return `${getSubName(value, 'SetIterator')} {}`;
    }

    if (isPromise(value)) {
      return `${getSubName(value, 'Promise')} {}`;
    }
  }

  let base = '';
  let empty = false;
  let braces = ['{', '}'];
  let fmtter = fmtObject;

  // We can't compare constructors for various objects using a comparison
  // like `constructor === Array` because the object could have come from a
  // different context and thus the constructor won't match. Instead we check
  // the constructor names (including those up the prototype chain where
  // needed) to determine object types.
  if (isString(value)) {
    // Make boxed primitive Strings look like such
    base = `[${getSubName(value, 'String')}: ${fmtPrimNoColor(ctx, value.valueOf())}]`;
  } else if (isNumber(value)) {
    // Make boxed primitive Numbers look like such
    base = `[${getSubName(value, 'Number')}: ${fmtPrimNoColor(ctx, value.valueOf())}]`;
  } else if (isBoolean(value)) {
    // Make boxed primitive Booleans look like such
    base = `[${getSubName(value, 'Boolean')}: ${fmtPrimNoColor(ctx, value.valueOf())}]`;
  } else if (isFunction(value)) {
    // Make functions say that they are functions
    base = `[${getSubName(value, 'Function')}${getNameSep(value)}]`;
  } else if (isClass(value)) {
    // Make functions say that they are functions
    base = `[Class${getNameSep(value)}]`;
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
      base = `[${name}: ${formatted}]`;
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
    base = ` ${base}`;
  } else if (name) {
    // Add constructor name if available
    braces[0] = `${name} ${braces[0]}`;
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
  const out = fmtter(ctx, value, depth, visibleKeys, keys);
  ctx.seen.delete(value);

  return reduceToSingleString(out, base, braces, ctx.breakLength);
};

inspect = function _inspect(obj, opts) {
  // default options
  let ctx = {
    seen: new SetConstructor(),
    stylize: stylizeNoColor,
  };

  // legacy...
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
    },
  });
} else {
  defineProperties(inspect, {
    defaultOptions: {
      value: assign({}, inspectDefaultOptions),
      writable: true,
    },
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
      yellow: [33, 39],
    },
  },
  custom: {
    value: customInspectSymbol,
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
      undefined: 'grey',
    },
  },
});

const ins = inspect;

export default ins;
