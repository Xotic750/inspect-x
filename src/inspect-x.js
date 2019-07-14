/**
 * @file An implementation of node's ES6 inspect module.
 * @version 2.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @see https://nodejs.org/api/util.html#util_util_inspect_object_options
 * @module inspect-x
 */

const bind = require('bind-x');

const {call} = Function.prototype;
const isFunction = require('is-function-x');
const isGeneratorFunction = require('is-generator-function');
const isAsyncFunction = require('is-async-function-x');
const isRegExp = require('is-regex');
const defineProperties = require('object-define-properties-x');
let isDate = require('is-date-object');
const isArrayBuffer = require('is-array-buffer-x');
const isSet = require('is-set-x');
const isMap = require('is-map-x');
const isTypedArray = require('is-typed-array');
const isDataView = require('is-data-view-x');
const isUndefined = require('validate.io-undefined');
const isNil = require('is-nil-x');
const isNull = require('lodash.isnull');
const isError = require('is-error-x');
const isObjectLike = require('is-object-like-x');
const isPromise = require('is-promise');
const isString = require('is-string');
const isNumber = require('is-number-object');
const isBoolean = require('is-boolean-object');
const objectIs = require('object-is');
const isSymbol = require('is-symbol');
const isPrimitive = require('is-primitive');
const isArray = require('is-array-x');
const isNumberNaN = require('is-nan');
const toStr = require('to-string-x');
const getFunctionName = require('get-function-name-x');
const hasSymbolSupport = require('has-symbol-support-x');
const whiteSpace = require('white-space-x');

const hasSet = typeof Set === 'function' && isSet(new Set());
const testSet = hasSet && new Set(['SetSentinel']);
const setForEach = hasSet && bind(call, Set.prototype.forEach);
const setValues = hasSet && bind(call, Set.prototype.values);
const hasMap = typeof Map === 'function' && isMap(new Map());
const testMap = hasMap && new Map([[1, 'MapSentinel']]);
const mapForEach = hasMap && bind(call, Map.prototype.forEach);
const mapValues = hasMap && bind(call, Map.prototype.values);
const symbolToString = hasSymbolSupport && bind(call, Symbol.prototype.toString);
const symbolValueOf = hasSymbolSupport && bind(call, Symbol.prototype.valueOf);
const reduce = require('array-reduce-x');
const filter = require('array-filter-x');
const some = require('array-some-x');
const every = require('array-every-x');
const map = require('array-map-x');
const slice = require('array-slice-x');
const reflectOwnKeys = require('reflect-own-keys-x');
const {stringify} = require('json3');
const objectKeys = require('object-keys-x');
const getOwnPropertyDescriptor = require('object-get-own-property-descriptor-x');
const getPrototypeOf = require('get-prototype-of-x');
const objectSeal = isFunction(Object.seal) ? Object.seal : require('lodash.identity');
const getOwnPropertySymbols = require('get-own-property-symbols-x');
const arrayincludes = require('array-includes-x');
const assign = require('object-assign-x');
const toISOString = require('to-iso-string-x');
const collections = require('collections-x');
const defineProperty = require('object-define-property-x');
const startsWith = require('string-starts-with-x');
const strIncludes = require('string-includes-x');
const clamp = require('math-clamp');
const difference = require('array-difference-x');
const intersection = require('array-intersection-x');
const union = require('array-union-x');

const regexpToString = bind(call, RegExp.prototype.toString);
const regexpTest = bind(call, RegExp.prototype.test);
const errorToString = bind(call, Error.prototype.toString);
const numberToString = bind(call, Number.prototype.toString);
const booleanToString = bind(call, Boolean.prototype.toString);
const concat = bind(call, Array.prototype.concat, []);
const join = bind(call, Array.prototype.join);
const push = bind(call, Array.prototype.push);
const getTime = bind(call, Date.prototype.getTime);
const replace = bind(call, String.prototype.replace);
const strSlice = bind(call, String.prototype.slice);
const propertyIsEnumerable = bind(call, Object.prototype.propertyIsEnumerable);
const customInspectSymbol = hasSymbolSupport ? Symbol('inspect.custom') : '_inspect.custom_';
let inspect;
let fmtValue;

const isFalsey = function _isFalsey(value) {
  return Boolean(value) === false;
};

let supportsClasses;
try {
  // eslint-disable-next-line no-new-func
  Function('return class My {}')();
  supportsClasses = true;
} catch (e) {}

const isClass = function _isClass(value) {
  return supportsClasses ? isFunction(value, true) && isFunction(value) === false : false;
};

let supportsGetSet;
try {
  let testVar;
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
} catch (ignore) {}

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
  throw new Error('test');
} catch (e) {
  errProps = union(objectKeys(new Error()), objectKeys(e));
  const errorString = errorToString(e);
  const errorStack = e.stack;

  if (errorStack) {
    const errorRx = new RegExp(`^${errorString}`);

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
    every(datePropsCheck, function(prop) {
      return arrayincludes(dateProps, prop);
    }) && arrayincludes(objectKeys(new Date()), 'constructor');
}

const testFunc1 = function test1() {};

const fnSupportsName = testFunc1.name === 'test1';
const hiddenFuncCtr = arrayincludes(reflectOwnKeys(testFunc1.prototype), 'constructor') === false;
const wantedFnProps = ['length', 'name', 'prototype'];

const fnPropsCheck = fnSupportsName
  ? slice(wantedFnProps)
  : filter(wantedFnProps, function(prop) {
      return prop !== 'name';
    });

const funcKeys = reflectOwnKeys(testFunc1);
const unwantedFnProps = intersection(['arguments', 'caller'], funcKeys);
let mustFilterFnProps = difference(fnPropsCheck, funcKeys).length > 0;

if (mustFilterFnProps === false) {
  mustFilterFnProps = some(intersection(funcKeys, wantedFnProps), function(key, index) {
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
  } catch (ignore) {}

  return false;
};

const isSetIterator = function _isSetIterator(value) {
  if (hasSet === false || isObjectLike(value) === false) {
    return false;
  }

  try {
    return value.next.call(setValues(testSet)).value === 'SetSentinel';
  } catch (ignore) {}

  return false;
};

const filterIndexes = function _filterIndexes(keys, length) {
  return filter(keys, function(key) {
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
    o = Object(o);
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
  return isNull(depth) ? null : depth - 1;
};

const fmtPropReplacers = [[/'/g, "\\'"], [/\\"/g, '"'], [/(^"|"$)/g, "'"], [/\\\\/g, '\\']];

const fmtPropReplace = function _fmtPropReplace(acc, pair) {
  return replace(acc, pair[0], pair[1]);
};

const fmtPropReplacer1 = [/\n/g, '\n  '];
const fmtPropReplacer2 = [/(^|\n)/g, '\n   '];
const fmtPropTestRx = /^"[\w$]+"$/;

// eslint-disable-next-line max-params
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

  if (isUndefined(name)) {
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

// eslint-disable-next-line max-params
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

const filterOutIndexes = function(keys) {
  return filter(keys, function(key) {
    return isSymbolType(key) || isDigits(key) === false;
  });
};

// eslint-disable-next-line max-params
const fmtArray = function _fmtArray(ctx, value, depth, visibleKeys, keys) {
  const {length} = value;
  const maxLength = clamp(length, 0, ctx.maxArrayLength);
  let lastIndex = 0;
  let nextIndex = 0;
  const output = [];

  const moreItems = some(value, function(item, index) {
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

  const fmtdProps = map(filterOutIndexes(keys), function(key) {
    return fmtProp(ctx, value, depth, visibleKeys, key, true);
  });

  return concat(output, fmtdProps);
};

// eslint-disable-next-line max-params
const fmtTypedArray = function _fmtTypedArray(ctx, value, depth, visibleKeys, keys) {
  const {length} = value;
  const maxLength = clamp(length, 0, ctx.maxArrayLength);
  const output = [];
  output.length = maxLength;
  const moreItems = some(value, function(item, index) {
    if (index >= maxLength) {
      return true;
    }

    output[index] = fmtNumber(ctx, value[index]);

    return false;
  });

  if (moreItems) {
    push(output, getMoreItemText(length - maxLength));
  }

  const fmtdProps = map(filterOutIndexes(keys), function(key) {
    return fmtProp(ctx, value, depth, visibleKeys, key, true);
  });

  return concat(output, fmtdProps);
};

// eslint-disable-next-line max-params
const fmtSet = function _fmtSet(ctx, value, depth, visibleKeys, keys) {
  const output = [];
  setForEach(value, function(v) {
    push(output, fmtValue(ctx, v, recurse(depth)));
  });

  const fmtdProps = map(keys, function(key) {
    return fmtProp(ctx, value, depth, visibleKeys, key, false);
  });

  return concat(output, fmtdProps);
};

// eslint-disable-next-line max-params
const fmtMap = function(ctx, value, depth, visibleKeys, keys) {
  const r = recurse(depth);
  const output = [];
  mapForEach(value, function(v, k) {
    push(output, `${fmtValue(ctx, k, r)} => ${fmtValue(ctx, v, r)}`);
  });

  const fmtdProps = map(keys, function(key) {
    return fmtProp(ctx, value, depth, visibleKeys, key, false);
  });

  return concat(output, fmtdProps);
};

const reSingle = new RegExp(`\\{[${whiteSpace.string}]+\\}`);
const lengthReduceRx = /\u001b\[\d\d?m/g;

const lengthReduce = function _lengthReduce(prev, cur) {
  return prev + replace(cur, lengthReduceRx, '').length + 1;
};

// eslint-disable-next-line max-params
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

// eslint-disable-next-line complexity,max-params
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
          // eslint-disable-next-line max-depth
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
      visibleKeys = filter(visibleKeys, function(key) {
        return key !== 'constructor';
      });
    } else if (errProps.length > 0 && isError(value)) {
      visibleKeys = filter(visibleKeys, function(key) {
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
    const enumSymbols = filter(getOwnPropertySymbols(value), function(key) {
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
    seen: new collections.Set(),
    stylize: stylizeNoColor,
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