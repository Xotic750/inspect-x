/* global Promise, ArrayBuffer, DataView, Int8Array, Uint8ClampedArray,
   Float32Array, Float64Array, Int16Array, Int32Array, Uint16Array,
   Uint32Array, Uint8Array */

let inspect;

if (typeof module === 'object' && module.exports) {
  require('es5-shim');
  require('es5-shim/es5-sham');

  if (typeof JSON === 'undefined') {
    JSON = {};
  }

  require('json3').runInContext(null, JSON);
  require('es6-shim');
  const es7 = require('es7-shim');
  Object.keys(es7).forEach(function(key) {
    const obj = es7[key];

    if (typeof obj.shim === 'function') {
      obj.shim();
    }
  });
  inspect = require('../../index.js');
  // Test against `master`
  // inspect = require('util').inspect;
} else {
  inspect = returnExports;
}

const hasSymbol = typeof Symbol === 'function' && typeof Symbol('') === 'symbol';
const ifHasSymbolIt = hasSymbol ? it : xit;
const hasSet = typeof Set === 'function';
const ifHasSetIt = hasSet ? it : xit;
const hasMap = typeof Map === 'function';
const ifHasMapIt = hasMap ? it : xit;
const hasArrayBuffer = typeof ArrayBuffer === 'function';
const ifHasArrayBuffer = hasArrayBuffer ? it : xit;
const hasDataView = typeof DataView === 'function';
const ifHasDataView = hasArrayBuffer && hasDataView ? it : xit;
const hasInt8Array = typeof Int8Array === 'function';
const hasUint8ClampedArray = typeof Uint8ClampedArray === 'function';
const hasPromise = typeof Promise === 'function';
const ifHasPromiseIt = hasPromise ? it : xit;
const propVisibleOnArrayBuffer =
  hasArrayBuffer &&
  (function() {
    const ab = new ArrayBuffer(4);
    ab.x = true;

    return Object.keys(ab).indexOf('x') > -1;
  })();

const getSupport = (function() {
  try {
    // eslint-disable-next-line no-eval
    eval('var x={get prop(){return;}};');

    return true;
  } catch (ignore) {
    // empty
  }

  return false;
})();
const ifGetSupportIt = getSupport ? it : xit;

const noHidden = (function() {
  const x = Object.defineProperty({}, 'hidden', {
    enumerable: false,
    value: null,
  });

  return Object.keys(x).length !== 0;
})();

let fnSupportsFnName;
let supportsInferredName;

if (function test1() {}.name === 'test1') {
  fnSupportsFnName = true;
  const xx = {yy() {}};
  supportsInferredName = xx.yy.name === 'yy';
}

const itSupportsFnName = fnSupportsFnName ? it : xit;
const itDoesNotSupportsFnName = fnSupportsFnName ? xit : it;

let supportsGetSetIt = xit;
let isGetSetEnumerable;
try {
  let testVar;
  const testObject = Object.defineProperty(Object.create(null), 'defaultOptions', {
    get() {
      return testVar;
    },
    set(val) {
      testVar = val;

      return testVar;
    },
  });
  testObject.defaultOptions = 'test';
  supportsGetSetIt = testVar === 'test' ? it : xit;
  isGetSetEnumerable = Object.prototype.propertyIsEnumerable.call(testObject, 'defaultOptions');
} catch (ignore) {
  // empty
}

let ifGenSupportedIt = xit;
try {
  // eslint-disable-next-line no-new-func
  new Function('return function*() {}')();
  ifGenSupportedIt = it;
} catch (e) {}

let ifArrowSupportedIt = xit;
try {
  // eslint-disable-next-line no-new-func
  new Function('return () => {}')();
  ifArrowSupportedIt = it;
} catch (e) {}

let ifAsyncSupportedIt = xit;
try {
  // eslint-disable-next-line no-new-func
  new Function('return async function() {}')();
  ifAsyncSupportedIt = it;
} catch (e) {}

let ifClassSupportedIt = xit;
try {
  // eslint-disable-next-line no-new-func
  new Function('return class My {}')();
  ifClassSupportedIt = it;
} catch (e) {}

let missingError;
try {
  throw new Error('test');
} catch (e) {
  const errorString = e.toString();
  const errorStack = e.stack;

  if (errorStack) {
    const errorRx = new RegExp(`^${errorString}`);

    if (errorRx.test(errorStack) === false) {
      missingError = true;
    }
  }
}

let splitEs6Shim;
let sliceEs6Shim;

if (hasSet || hasMap) {
  splitEs6Shim = function _splitEs6Shim(value) {
    let insStr = inspect(value);

    // eslint-disable-next-line no-underscore-dangle
    if (value._es6map || value._es6set) {
      insStr = insStr.split(/\n /).join('');
    }

    return insStr;
  };

  sliceEs6Shim = function _sliceEs6Shim(value) {
    let insStr = inspect(value);

    // eslint-disable-next-line no-underscore-dangle
    if (value._es6map || value._es6set) {
      insStr = insStr.split(/\n /);
      insStr = `${insStr
        .slice(0, 2)
        .join('')
        .split(/( })|,/)
        .shift()} ${insStr.pop().slice(-1)}`;
    }

    return insStr;
  };
}

const fmtError = function(er) {
  const {stack} = er;

  if (missingError && stack) {
    return `${er.toString()}\n${stack}`;
  }

  return stack || `[${er.toString()}]`;
};

describe('inspect', function() {
  it('basic', function() {
    expect.assertions(1);
    expect.assertions(1);
    expect(inspect(1)).toBe('1');
    expect(inspect(false)).toBe('false');
    expect(inspect('')).toBe("''");
    expect(inspect('hello')).toBe("'hello'");
    expect(inspect(function() {})).toBe('[Function]');
    expect(inspect(function f() {})).toBe('[Function: f]');

    expect(inspect(undefined)).toBe('undefined');
    expect(inspect(null)).toBe('null');
    expect(inspect(/foo(bar\n)?/gim)).toBe('/foo(bar\\n)?/gim');
    let subject = new Date(1266148120000);
    let ex = inspect(subject);
    let match = ex.match(/(2010-02-14T11:48:40.000Z)/);
    match = match ? match[0] : ex;
    expect(match).toBe('2010-02-14T11:48:40.000Z');
    subject = new Date('');
    expect(inspect(subject)).toBe('Invalid Date');
    expect(inspect('\n\u0001')).toBe("'\\n\\u0001'");

    expect(inspect([])).toBe('[]');
    const arr = Object.create([]);
    ex = inspect(arr);
    expect(ex.slice(0, 7)).toBe('Array {');
    expect(ex.slice(-1)).toBe('}');
    expect(inspect([1, 2])).toBe('[ 1, 2 ]');
    expect(inspect([1, [2, 3]])).toBe('[ 1, [ 2, 3 ] ]');

    expect(inspect({})).toBe('{}');
    expect(inspect({a: 1})).toBe('{ a: 1 }');
    expect(inspect({a() {}})).toBe(supportsInferredName ? '{ a: [Function: a] }' : '{ a: [Function] }');
    expect(inspect({a: function test() {}})).toBe('{ a: [Function: test] }');
    expect(inspect({a: 1, b: 2})).toBe('{ a: 1, b: 2 }');
    expect(inspect({a: {}})).toBe('{ a: {} }');
    expect(inspect({a: {b: 2}})).toBe('{ a: { b: 2 } }');
    expect(inspect({a: {b: {c: {d: 2}}}})).toBe('{ a: { b: { c: [Object] } } }');
    expect(inspect({a: {b: {c: {d: 2}}}}, false, null)).toBe('{ a: { b: { c: { d: 2 } } } }');
    expect(inspect([1, 2, 3], true)).toBe('[ 1, 2, 3, [length]: 3 ]');
    expect(inspect({a: {b: {c: 2}}}, false, 0)).toBe('{ a: [Object] }');
    expect(inspect({a: {b: {c: 2}}}, false, 1)).toBe('{ a: { b: [Object] } }');
  });

  itSupportsFnName('Function - name - show hidden', function() {
    expect(inspect(function f() {}, true)).toBe(
      ['{ [Function: f]', '  [length]: 0,', "  [name]: 'f',", '  [prototype]: f { [constructor]: [Circular] } }'].join('\n'),
    );
  });

  itDoesNotSupportsFnName('Function - no name - show hidden', function() {
    expect(inspect(function f() {}, true)).toBe('{ [Function: f] [length]: 0, [prototype]: f { [constructor]: [Circular] } }');
  });

  ifArrowSupportedIt('arrow functions', function() {
    // eslint-disable-next-line no-new-func
    expect(inspect(new Function('return () => {}')())).toBe('[Function]');
  });

  ifGenSupportedIt('generator functions', function() {
    // eslint-disable-next-line no-new-func
    expect(inspect(new Function('return function*() {}')())).toBe('[GeneratorFunction]');
  });

  ifAsyncSupportedIt('async functions', function() {
    // eslint-disable-next-line no-new-func
    expect(inspect(new Function('return async function() {}')())).toBe('[AsyncFunction]');
    // eslint-disable-next-line no-new-func
    expect(inspect(new Function('return async () => {}')())).toBe('[AsyncFunction]');
  });

  ifHasArrayBuffer('ArrayBuffer', function() {
    [true, false].forEach(function(showHidden) {
      const ab = new ArrayBuffer(4);
      let ex = inspect(ab, showHidden);
      expect(ex.slice(0, 13)).toBe('ArrayBuffer {');
      expect(ex.slice(-1)).toBe('}');
      let match = ex.match(/byteLength: 4/);
      match = match ? match[0] : ex;
      expect(match).toBe('byteLength: 4');
      ab.x = 42;
      ex = inspect(ab, showHidden);

      if (propVisibleOnArrayBuffer) {
        match = ex.match(/(byteLength: 4,)[\s\S]+(x: 42)/);
        match = match ? match.slice(1).join(' ') : ex;
        expect(match).toBe('byteLength: 4, x: 42');
      } else {
        match = ex.match(/byteLength: 4/);
        match = match ? match[0] : ex;
        expect(match).toBe('byteLength: 4');
      }
    });
  });

  ifHasDataView('DataView', function() {
    [true, false].forEach(function(showHidden) {
      const ab = new ArrayBuffer(4);
      const dv = new DataView(ab, 1, 2);
      let ex = inspect(dv, showHidden);

      expect(ex.slice(0, 10)).toBe('DataView {');
      expect(ex.slice(-1)).toBe('}');
      let match = ex.match(/(byteLength: 2,)[\s\S]+(byteOffset: 1,)[\s\S]+(buffer:)[\s\S]+(ArrayBuffer)[\s\S]+(byteLength: 4)/);
      match = match ? match.slice(1).join(' ') : ex;
      expect(match).toBe('byteLength: 2, byteOffset: 1, buffer: ArrayBuffer byteLength: 4');
      ex = inspect(dv, showHidden);
      match = ex.match(/(byteLength: 2,)[\s\S]+(byteOffset: 1,)[\s\S]+(buffer:)[\s\S]+(ArrayBuffer)[\s\S]+(byteLength: 4)/);
      match = match ? match.slice(1).join(' ') : ex;
      expect(match).toBe('byteLength: 2, byteOffset: 1, buffer: ArrayBuffer byteLength: 4');
      ab.x = 42;
      dv.y = 1337;
      ex = inspect(dv, showHidden);

      if (propVisibleOnArrayBuffer) {
        match = ex.match(
          /(byteLength: 2,)[\s\S]+(byteOffset: 1,)[\s\S]+(buffer:)[\s\S]+(ArrayBuffer)[\s\S]+(byteLength: 4,)[\s\S]+(x: 42)[\s\S]+(y: 1337)/,
        );
        match = match ? match.slice(1).join(' ') : ex;
        expect(match).toBe('byteLength: 2, byteOffset: 1, buffer: ArrayBuffer byteLength: 4, x: 42 y: 1337');
      } else {
        match = ex.match(
          /(byteLength: 2,)[\s\S]+(byteOffset: 1,)[\s\S]+(buffer:)[\s\S]+(ArrayBuffer)[\s\S]+(byteLength: 4)[\s\S]+(y: 1337)/,
        );
        match = match ? match.slice(1).join(' ') : ex;
        expect(match).toBe('byteLength: 2, byteOffset: 1, buffer: ArrayBuffer byteLength: 4 y: 1337');
      }
    });
  });

  ifHasArrayBuffer('TypedArrays', function() {
    const arrays = [
      {
        Ctr: Float32Array,
        name: 'Float32Array',
      },
      {
        Ctr: Float64Array,
        name: 'Float64Array',
      },
      {
        Ctr: Int16Array,
        name: 'Int16Array',
      },
      {
        Ctr: Int32Array,
        name: 'Int32Array',
      },
      {
        Ctr: Uint16Array,
        name: 'Uint16Array',
      },
      {
        Ctr: Uint32Array,
        name: 'Uint32Array',
      },
      {
        Ctr: Uint8Array,
        name: 'Uint8Array',
      },
    ];

    if (hasUint8ClampedArray) {
      arrays.push({
        Ctr: Uint8ClampedArray,
        name: 'Uint8ClampedArray',
      });
    }

    if (hasInt8Array) {
      arrays.push({
        Ctr: Int8Array,
        name: 'Int8Array',
      });
    }

    arrays.forEach(function(item) {
      const length = 2;
      const byteLength = length * item.Ctr.BYTES_PER_ELEMENT;
      const array = new item.Ctr(new ArrayBuffer(byteLength), 0, length);
      array[0] = 65;
      array[1] = 97;
      let ex = inspect(array, true);
      expect(ex.slice(0, item.name.length + 2)).toBe(`${item.name} [`);
      expect(ex.slice(-1)).toBe(']');
      let match = ex.match(
        /(65,)[\s\S]+(97)[\s\S]+\[?(BYTES_PER_ELEMENT)\]?: (\d*)[\s\S]+\[?(length)\]?: (\d*)[\s\S]+\[?(byteLength)\]?: (\d*)[\s\S]+\[?(byteOffset)\]?: (0)[\s\S]+\[?(buffer)\]?:[\s\S]+(ArrayBuffer)[\s\S]+(byteLength: \d*)/,
      );
      match = match ? match.slice(1).join(' ') : ex;
      expect(match).toBe(
        `65, 97 BYTES_PER_ELEMENT ${
          item.Ctr.BYTES_PER_ELEMENT
        } length ${length} byteLength ${byteLength} byteOffset 0 buffer ArrayBuffer byteLength: ${byteLength}`,
      );

      ex = inspect(array, false);
      expect(ex.slice(0, item.name.length + 2)).toBe(`${item.name} [`);
      expect(ex.slice(-1)).toBe(']');
      match = ex.match(/(65,)[\s\S]+(97)/);
      match = match ? match.slice(1).join(' ') : ex;
      expect(match).toBe('65, 97');
    });
  });

  it('objects without prototype', function() {
    expect.assertions(1);
    expect.assertions(1); // Due to the hash seed randomization it's not deterministic the order
    // that the following ways this hash is displayed.
    // See http://codereview.chromium.org/9124004/

    const out = inspect(
      Object.create(
        {},
        {
          hidden: {value: 'Visible on ES3'},
          visible: {
            enumerable: true,
            value: 1,
          },
        },
      ),
      true,
    );

    if (noHidden) {
      if (!(out !== "{ [hidden]: 'Visible on ES3', visible: 1 }" && out !== "{ visible: 1, [hidden]: 'Visible on ES3' }")) {
        expect(false).toBe(true);
      }
    } else if (out !== "{ [hidden]: 'Visible on ES3', visible: 1 }" && out !== "{ visible: 1, [hidden]: 'Visible on ES3' }") {
      expect(false).toBe(true);
    }
  });

  it('objects without prototype', function() {
    expect.assertions(1);
    expect.assertions(1); // Objects without prototype
    const out = inspect(
      Object.create(null, {
        hidden: {value: 'Visible on ES3'},
        name: {
          enumerable: true,
          value: 'Tim',
        },
      }),
      true,
    );

    if (noHidden) {
      if (!(out !== "{ [hidden]: 'Visible on ES3', name: 'Tim' }" && out !== "{ name: 'Tim', [hidden]: 'Visible on ES3' }")) {
        expect(false).toBe(true);
      }
    } else if (out !== "{ [hidden]: 'Visible on ES3', name: 'Tim' }" && out !== "{ name: 'Tim', [hidden]: 'Visible on ES3' }") {
      expect(false).toBe(true);
    }

    expect(
      inspect(
        Object.create(null, {
          hidden: {value: 'Visible on ES3'},
          name: {
            enumerable: true,
            value: 'Tim',
          },
        }),
      ),
    ).toBe(noHidden ? "{ hidden: 'Visible on ES3', name: 'Tim' }" : "{ name: 'Tim' }");
  });

  ifGetSupportIt('Dynamic properties', function() {
    // Dynamic properties
    let subject = {};
    Object.defineProperty(subject, 'readonly', {
      enumerable: true,
      get() {
        return void 0;
      },
    });
    expect(inspect(subject)).toBe('{ readonly: [Getter] }');

    subject = {};
    Object.defineProperty(subject, 'readwrite', {
      enumerable: true,
      get() {
        return void 0;
      },
      set(val) {}, // eslint-disable-line no-unused-vars
    });
    expect(inspect(subject)).toBe('{ readwrite: [Getter/Setter] }');

    subject = {};
    Object.defineProperty(subject, 'writeonly', {
      // eslint-disable-line accessor-pairs
      enumerable: true,
      set(val) {}, // eslint-disable-line no-unused-vars
    });
    expect(inspect(subject)).toBe('{ writeonly: [Setter] }');

    const value = {};
    value.a = value;
    expect(inspect(value)).toBe('{ a: [Circular] }');
  });

  ifGetSupportIt('Array with dynamic properties', function() {
    // Array with dynamic properties
    const value = [1, 2, 3];
    Object.defineProperty(value, 'growingLength', {
      enumerable: true,
      get() {
        this.push(true);

        return this.length;
      },
    });
    expect(inspect(value)).toBe('[ 1, 2, 3, growingLength: [Getter] ]');
  });

  it('function with properties', function() {
    expect.assertions(1);
    expect.assertions(1); // Function with properties
    const value = function() {};

    value.aprop = 42;
    expect(inspect(value)).toBe(supportsInferredName ? '{ [Function: value] aprop: 42 }' : '{ [Function] aprop: 42 }');
  });

  ifArrowSupportedIt('Anonymous function with properties', function() {
    // Anonymous function with properties
    // eslint-disable-next-line no-new-func
    const value = new Function('return (() => function() {})()')();
    value.aprop = 42;
    expect(inspect(value)).toBe('{ [Function] aprop: 42 }');
  });

  it('regular expressions with properties', function() {
    expect.assertions(1);
    expect.assertions(1); // Regular expressions with properties
    const value = /123/gim;
    value.aprop = 42;
    expect(inspect(value)).toBe('{ /123/gim aprop: 42 }');
  });

  it('dates with properties', function() {
    expect.assertions(1);
    expect.assertions(1); // Dates with properties
    const value = new Date(1266148120000);
    value.aprop = 42;
    const ex = inspect(value);
    expect(ex.slice(0, 1)).toBe('{');
    expect(ex.slice(-1)).toBe('}');
    let match = ex.match(/(2010-02-14T11:48:40.000Z)[\s\S]+(aprop: 42)/);
    match = match ? match.slice(1).join(' ') : ex;
    expect(match).toBe('2010-02-14T11:48:40.000Z aprop: 42');
  });

  it('positive/negative zero', function() {
    expect.assertions(1);
    expect.assertions(1); // test positive/negative zero
    expect(inspect(0)).toBe('0');
    expect(inspect(-0)).toBe('-0');
  });

  it('sparse array', function() {
    expect.assertions(1);
    expect.assertions(1); // test for sparse array
    const a = ['foo', 'bar', 'baz'];
    expect(inspect(a)).toBe("[ 'foo', 'bar', 'baz' ]");
    delete a[1];
    expect(inspect(a)).toBe("[ 'foo', <1 empty item>, 'baz' ]");
    expect(inspect(a, true)).toBe("[ 'foo', <1 empty item>, 'baz', [length]: 3 ]");
    expect(inspect(new Array(5))).toBe('[ <5 empty items> ]');
    a[3] = 'bar';
    a[100] = 'qux';
    expect(inspect(a, {breakLength: Infinity})).toBe("[ 'foo', <1 empty item>, 'baz', 'bar', <96 empty items>, 'qux' ]");
  });

  ifGetSupportIt('property descriptors', function() {
    // test for property descriptors
    const getter = Object.create(null, {
      a: {
        get() {
          return 'aaa';
        },
      },
    });
    // eslint-disable-next-line accessor-pairs
    const setter = Object.create(null, {b: {set() {}}});
    const getterAndSetter = Object.create(null, {
      c: {
        get() {
          return 'ccc';
        },
        set() {},
      },
    });

    if (isGetSetEnumerable) {
      expect(inspect(getter, true)).toBe('{ a: [Getter] }');
      expect(inspect(setter, true)).toBe('{ b: [Setter] }');
      expect(inspect(getterAndSetter, true)).toBe('{ c: [Getter/Setter] }');
    } else {
      expect(inspect(getter, true)).toBe('{ [a]: [Getter] }');
      expect(inspect(setter, true)).toBe('{ [b]: [Setter] }');
      expect(inspect(getterAndSetter, true)).toBe('{ [c]: [Getter/Setter] }');
    }
  });

  it("exceptions should print the error message, not '{}'", function() {
    expect.assertions(1);
    expect.assertions(1); // exceptions should print the error message, not '{}'
    const errors = [new Error(), new Error('FAIL'), new TypeError('FAIL'), new SyntaxError('FAIL')];

    errors.forEach(function(err) {
      expect(inspect(err)).toStrictEqual(fmtError(err));

      return inspect(err);
    });

    try {
      // eslint-disable-next-line no-undef
      undef();
    } catch (e) {
      expect(inspect(e)).toBe(fmtError(e));
    }

    const err = new Error('FAILURE');
    const ex = inspect(err, true);
    expect(ex).toContain('Error: FAILURE');

    if (err.stack !== undefined) {
      let stack = ex.match(/\[?stack\]?:/);
      stack = stack ? stack[1] : ex;
      expect(stack).not.toBe('stack');
    }

    if (err.message !== undefined) {
      let message = ex.match(/\[?(message)\]?(: 'FAILURE')/);
      message = message ? message[1] + message[2] : ex;
      expect(message).toBe("message: 'FAILURE'");
    }
    /*
    if (err.name !== undefined) {
      var name = ex.match(/\[?(name)\]?(: \'Error\')/);
      name = name ? name[1] + name[2] : ex;
      expect(name).toBe('name: \'Error\'');
    }
    */
  });

  it("doesn't capture stack trace", function() {
    expect.assertions(1);
    expect.assertions(1); // Doesn't capture stack trace
    const BadCustomError = function(msg) {
      Error.call(this);
      Object.defineProperty(this, 'message', {enumerable: false, value: msg});
    };

    BadCustomError.prototype = Object.create(Error.prototype);
    Object.defineProperties(BadCustomError.prototype, {
      constructor: {
        value: BadCustomError,
      },
      name: {
        value: 'BadCustomError',
      },
    });

    expect(inspect(new BadCustomError('foo'))).toBe('[BadCustomError: foo]');
  });

  it('correct stack.trace', function() {
    expect.assertions(1);
    expect.assertions(1);
    const CustomError = function(msg) {
      Error.call(this);
      Object.defineProperty(this, 'message', {enumerable: false, value: msg});
    };

    CustomError.prototype = Object.create(Error.prototype);
    Object.defineProperties(CustomError.prototype, {
      constructor: {
        value: CustomError,
      },
      name: {
        value: 'CustomError',
      },
    });

    const customError = new CustomError('bar');
    expect(inspect(customError)).toBe(fmtError(customError));
  });

  it('gH-1941', function() {
    expect.assertions(1);
    expect.assertions(1); // GH-1941
    // should not throw:
    const prot = Object.create(Date.prototype);
    const ex = inspect(prot);
    expect(ex.slice(0, 6)).toBe('Date {');
    expect(ex.slice(-1)).toBe('}');
  });

  it('gH-1944', function() {
    expect.assertions(1);
    expect.assertions(1); // GH-1944
    expect(function() {
      const d = new Date();
      d.toUTCString = null;
      inspect(d);
    }).not.toThrowErrorMatchingSnapshot();

    expect(function() {
      const d = new Date();
      d.toISOString = null;
      inspect(d);
    }).not.toThrowErrorMatchingSnapshot();

    expect(function() {
      const r = /regexp/;
      r.toString = null;
      inspect(r);
    }).not.toThrowErrorMatchingSnapshot();
  });

  it('bug with user-supplied inspect function returns non-string', function() {
    expect.assertions(1);
    expect.assertions(1); // bug with user-supplied inspect function returns non-string
    expect(function() {
      inspect([
        {
          inspect() {
            return 123;
          },
        },
      ]);
    }).not.toThrowErrorMatchingSnapshot();
  });

  it('gH-2225', function() {
    expect.assertions(1);
    expect.assertions(1); // GH-2225
    const x = {inspect};
    expect(inspect(x).indexOf('inspect')).not.toBe(-1);
  });

  it('inspect should not display the escaped value of a key.', function() {
    expect.assertions(1);
    expect.assertions(1); // inspect should not display the escaped value of a key.
    const w = {
      '\\': 1,
      '\\\\': 2,
      '\\\\\\': 3,
      '\\\\\\\\': 4,
    };

    const y = ['a', 'b', 'c'];
    y['\\\\\\'] = 'd';

    expect(inspect(w)).toBe("{ '\\': 1, '\\\\': 2, '\\\\\\': 3, '\\\\\\\\': 4 }");
    expect(inspect(y)).toBe("[ 'a', 'b', 'c', '\\\\\\': 'd' ]");
  });

  it('inspect.styles and inspect.colors', function() {
    expect.assertions(1);
    expect.assertions(1); // inspect.styles and inspect.colors
    const testColorStyle = function(style, input) {
      const colorName = inspect.styles[style];
      let color = ['', ''];

      if (inspect.colors[colorName]) {
        color = inspect.colors[colorName];
      }

      const withoutColor = inspect(input, false, 0, false);
      const withColor = inspect(input, false, 0, true);
      const expected = `\u001b[${color[0]}m${withoutColor}\u001b[${color[1]}m`;
      expect(withColor).toBe(expected, `inspect color for style ${style}`);
    };

    testColorStyle('special', function() {});
    testColorStyle('number', 123.456);
    testColorStyle('boolean', true);
    testColorStyle('undefined', undefined);
    testColorStyle('null', null);
    testColorStyle('string', 'test string');
    testColorStyle('date', new Date());
    testColorStyle('regexp', /regexp/);
  });

  it('an object with "hasOwnProperty" overwritten should not throw', function() {
    expect.assertions(1);
    expect.assertions(1); // an object with "hasOwnProperty" overwritten should not throw
    expect(function() {
      inspect({hasOwnProperty: null});
    }).not.toThrowErrorMatchingSnapshot();
  });

  it('new API, accepts an "options" object', function() {
    expect.assertions(1);
    expect.assertions(1); // new API, accepts an "options" object
    const subject = {
      a: {b: {c: {d: 0}}},
      foo: 'bar',
      hello: 31,
    };
    Object.defineProperty(subject, 'hidden', {
      enumerable: false,
      value: null,
    });

    if (!noHidden) {
      expect(inspect(subject, {showHidden: false}).indexOf('hidden')).toBe(-1, 'Visible on ES3');
    }

    expect(inspect(subject, {showHidden: true}).indexOf('hidden')).not.toBe(-1);
    expect(inspect(subject, {colors: false}).indexOf('\u001b[32m')).toBe(-1);
    expect(inspect(subject, {colors: true}).indexOf('\u001b[32m')).not.toBe(-1);
    expect(inspect(subject, {depth: 2}).indexOf('c: [Object]')).not.toBe(1);
    expect(inspect(subject, {depth: 0}).indexOf('a: [Object]')).not.toBe(-1);
    expect(inspect(subject, {depth: null}).indexOf('{ d: 0 }')).not.toBe(-1);
  });

  it('"customInspect" option can enable/disable calling inspect() on objects', function() {
    expect.assertions(1);
    expect.assertions(1); // "customInspect" option can enable/disable calling inspect() on objects
    const subject = {
      inspect() {
        return 123;
      },
    };

    expect(inspect(subject, {customInspect: true}).indexOf('123')).not.toBe(-1);
    expect(inspect(subject, {customInspect: true}).indexOf('inspect')).toBe(-1);
    expect(inspect(subject, {customInspect: false}).indexOf('123')).toBe(-1);
    expect(inspect(subject, {customInspect: false}).indexOf('inspect')).not.toBe(-1);
  });

  it('custom inspect() functions should be able to return other Objects', function() {
    expect.assertions(1);
    expect.assertions(1); // custom inspect() functions should be able to return other Objects
    const subject = {
      inspect() {
        return {foo: 'bar'};
      },
    };

    expect(inspect(subject)).toBe("{ foo: 'bar' }");

    subject.inspect = function(depth, opts) {
      expect(opts.customInspectOptions).toBe(true);
    };

    inspect(subject, {customInspectOptions: true});
  });

  it('"customInspect" option can enable/disable calling [inspect.custom]()', function() {
    expect.assertions(1);
    expect.assertions(1); // "customInspect" option can enable/disable calling [inspect.custom]()
    const subject = {};
    subject[inspect.custom] = function() {
      return 123;
    };

    expect(inspect(subject, {customInspect: true})).toContain('123');
    expect(inspect(subject, {customInspect: false})).not.toContain('123');

    // a custom [inspect.custom]() should be able to return other Objects
    subject[inspect.custom] = function() {
      return {foo: 'bar'};
    };

    expect(inspect(subject), "{ foo: 'bar' }");

    subject[inspect.custom] = function(depth, opts) {
      expect(opts.customInspectOptions).toBe(true);
    };

    inspect(subject, {customInspectOptions: true});
  });

  it('[inspect.custom] takes precedence over inspect', function() {
    expect.assertions(1);
    expect.assertions(1); // [inspect.custom] takes precedence over inspect
    const subject = {};
    subject[inspect.custom] = function() {
      return 123;
    };

    subject.inspect = function() {
      return 456;
    };

    expect(inspect(subject, {customInspect: true})).toContain('123');
    expect(inspect(subject, {customInspect: false})).not.toContain('123');
    expect(inspect(subject, {customInspect: true})).not.toContain('456');
    expect(inspect(subject, {customInspect: false})).not.toContain('456');
  });

  it('returning `this` from a custom inspection function works', function() {
    expect.assertions(1);
    expect.assertions(1); // Returning `this` from a custom inspection function works.
    let subject = {
      a: 123,
      inspect() {
        return this;
      },
    };

    let str;

    if (supportsInferredName) {
      str = '{ a: 123, inspect: [Function: inspect] }';
    } else {
      str = '{ a: 123, inspect: [Function] }';
    }

    expect(inspect(subject)).toBe(str);
    subject = {a: 123};
    subject[inspect.custom] = function() {
      return this;
    };

    if (hasSymbol) {
      str = '{ a: 123, [Symbol(inspect.custom)]: [Function] }';
    } else {
      str = "{ a: 123, '_inspect.custom_': [Function] }";
    }

    expect(inspect(subject)).toBe(str);
  });

  it('inspect with "colors" option should produce as many lines as without it', function() {
    expect.assertions(1);
    expect.assertions(1); // inspect with "colors" option should produce as many lines as without it
    const testLines = function(input) {
      const countLines = function(str) {
        return (str.match(/\n/g) || []).length;
      };

      const withoutColor = inspect(input);
      const withColor = inspect(input, {colors: true});
      expect(countLines(withoutColor)).toBe(countLines(withColor));
    };

    testLines([1, 2, 3, 4, 5, 6, 7]);
    testLines(
      (function() {
        const bigArray = [];
        for (let i = 0; i < 100; i += 1) {
          bigArray.push(i);
        }

        return bigArray;
      })(),
    );
    testLines({
      b: {a: 35},
      baz: 35,
      foo: 'bar',
    });
    testLines({
      b: {a: 35},
      baz: 35,
      evenLongerKey: ['with even longer value in array'],
      foo: 'bar',
      veryLongKey: 'very_long_value',
    });
  });

  it('boxed primitives output the correct values', function() {
    expect.assertions(1);
    expect.assertions(1); // test boxed primitives output the correct values
    expect(inspect(Object('test'))).toBe("[String: 'test']");
    expect(inspect(Object(false))).toBe('[Boolean: false]');
    expect(inspect(Object(true))).toBe('[Boolean: true]');
    expect(inspect(Object(0))).toBe('[Number: 0]');
    expect(inspect(Object(-0))).toBe('[Number: -0]');
    expect(inspect(Object(-1.1))).toBe('[Number: -1.1]');
    expect(inspect(Object(13.37))).toBe('[Number: 13.37]');
  });

  it('boxed primitives with own properties', function() {
    expect.assertions(1);
    expect.assertions(1); // test boxed primitives with own properties
    const str = Object('baz');
    str.foo = 'bar';
    expect(inspect(str)).toBe("{ [String: 'baz'] foo: 'bar' }");

    const bool = Object(true);
    bool.foo = 'bar';
    expect(inspect(bool)).toBe("{ [Boolean: true] foo: 'bar' }");

    const num = Object(13.37);
    num.foo = 'bar';
    expect(inspect(num)).toBe("{ [Number: 13.37] foo: 'bar' }");
  });

  ifHasSymbolIt('Symbol', function() {
    // test es6 Symbol
    expect(inspect(Symbol(''))).toBe('Symbol()');
    expect(inspect(Symbol(123))).toBe('Symbol(123)');
    expect(inspect(Symbol('hi'))).toBe('Symbol(hi)');
    expect(inspect([Symbol('')])).toBe('[ Symbol() ]');
    expect(inspect({foo: Symbol('')})).toBe('{ foo: Symbol() }');

    const options = {showHidden: true};
    let subject = {};

    subject[Symbol('symbol')] = 42;

    expect(inspect(subject)).toBe('{ [Symbol(symbol)]: 42 }');
    expect(inspect(subject, options)).toBe('{ [Symbol(symbol)]: 42 }');

    Object.defineProperty(subject, Symbol(''), {enumerable: false, value: 'non-enum'});
    expect(inspect(subject)).toBe('{ [Symbol(symbol)]: 42 }');
    expect(inspect(subject, options)).toBe("{ [Symbol(symbol)]: 42, [Symbol()]: 'non-enum' }");

    subject = [1, 2, 3];
    subject[Symbol('symbol')] = 42;

    expect(inspect(subject)).toBe('[ 1, 2, 3, [Symbol(symbol)]: 42 ]');
  });

  ifHasSetIt('Set', function() {
    // test Set
    let set = new Set();
    let ex = inspect(set);
    expect(ex.slice(0, 5)).toBe('Set {');
    expect(ex.slice(-1)).toBe('}');
    set.add(1);
    set.add(2);
    set.add(3);
    set.add(4);
    ex = splitEs6Shim(set);
    let match = ex.match(/1, 2, 3, 4/);
    match = match ? match[0] : ex;
    expect(match).toBe('1, 2, 3, 4');
    set = new Set();
    set.add('foo');
    set.bar = 42;
    ex = inspect(set, true);
    match = ex.match(/('foo',)[\s\S]+(\[size\]: 1,)[\s\S]+(bar: 42)/);
    match = match ? match.slice(1).join(' ') : ex;
    expect(match).toBe("'foo', [size]: 1, bar: 42");

    set = new Set();
    set.add(set);
    ex = sliceEs6Shim(set);
    expect(ex).toBe('Set { [Circular] }');
  });

  ifHasMapIt('Map', function() {
    // test Map
    let map = new Map();
    let ex = inspect(map);
    expect(ex.slice(0, 5)).toBe('Map {');
    expect(ex.slice(-1)).toBe('}');
    map.set(1, 'a');
    map.set(2, 'b');
    map.set(3, 'c');
    ex = splitEs6Shim(map);
    let match = ex.match(/1 => 'a', 2 => 'b', 3 => 'c'/);
    match = match ? match[0] : ex;
    expect(match).toBe("1 => 'a', 2 => 'b', 3 => 'c'");
    map = new Map();
    map.set('foo', null);
    map.bar = 42;
    ex = inspect(map, true);
    match = ex.match(/('foo' => null,)[\s\S]+(\[size\]: 1,)[\s\S]+(bar: 42)/);
    match = match ? match.slice(1).join(' ') : ex;
    expect(match).toBe("'foo' => null, [size]: 1, bar: 42");

    map = new Map();
    map.set(map, 'map');
    ex = sliceEs6Shim(map);
    expect(ex).toBe("Map { [Circular] => 'map' }");

    map.set(map, map);
    ex = sliceEs6Shim(map);
    expect(ex).toBe('Map { [Circular] => [Circular] }');

    map.delete(map);
    map.set('map', map);
    ex = sliceEs6Shim(map);
    expect(ex).toBe("Map { 'map' => [Circular] }");
  });

  ifHasPromiseIt('Promise', function() {
    // test Promise
    let ex = inspect(Promise.resolve(3));
    expect(ex.slice(0, 9)).toBe('Promise {');
    expect(ex.slice(-1)).toBe('}');
    // eslint-disable-next-line prefer-promise-reject-errors
    const rejected = Promise.reject(3);
    ex = inspect(rejected);
    rejected.catch(function() {});
    expect(ex.slice(0, 9)).toBe('Promise {');
    expect(ex.slice(-1)).toBe('}');
    ex = inspect(new Promise(function() {}));
    expect(ex.slice(0, 9)).toBe('Promise {');
    expect(ex.slice(-1)).toBe('}');
    const promise = Promise.resolve('foo');
    promise.bar = 42;
    ex = inspect(promise);
    expect(ex.slice(0, 9)).toBe('Promise {');
    expect(ex.slice(-1)).toBe('}');
    let match = ex.match(/(bar: 42)/);
    match = match ? match[0] : ex;
    expect(match).toBe('bar: 42');
  });

  ifHasMapIt('MapIterator', function() {
    const m = new Map();
    let ex;
    m.set('foo', 'bar');

    if (m.keys) {
      ex = inspect(m.keys());
      expect(ex.slice(0, 13)).toBe('MapIterator {');
      expect(ex.slice(-1)).toBe('}');
    }

    if (m.values) {
      ex = inspect(m.values());
      expect(ex.slice(0, 13)).toBe('MapIterator {');
      expect(ex.slice(-1)).toBe('}');
    }

    if (m.entries) {
      ex = inspect(m.entries());
      expect(ex.slice(0, 13)).toBe('MapIterator {');
      expect(ex.slice(-1)).toBe('}');
    }
  });

  ifHasSetIt('SetIterator', function() {
    const s = new Set();
    let ex;
    s.add(1);
    s.add(3);

    if (s.keys) {
      ex = inspect(s.keys());
      expect(ex.slice(0, 13)).toBe('SetIterator {');
      expect(ex.slice(-1)).toBe('}');
    }

    if (s.values) {
      ex = inspect(s.values());
      expect(ex.slice(0, 13)).toBe('SetIterator {');
      expect(ex.slice(-1)).toBe('}');
    }

    if (s.entries) {
      ex = inspect(s.entries());
      expect(ex.slice(0, 13)).toBe('SetIterator {');
      expect(ex.slice(-1)).toBe('}');
    }
  });

  it('alignment', function() {
    expect.assertions(1);
    expect.assertions(1); // Test alignment of items in container
    // Assumes that the first numeric character is the start of an item.

    const checkAlignment = function(container) {
      const lines = inspect(container).split('\n');
      let pos;
      lines.forEach(function(line) {
        const npos = line.search(/\d/);

        if (npos !== -1) {
          if (pos !== undefined) {
            expect(pos).toBe(npos, 'container items not aligned');
          }

          pos = npos;
        }
      });
    };

    const bigArray = [];
    for (let i = 0; i < 100; i += 1) {
      bigArray.push(i);
    }

    checkAlignment(bigArray);
    checkAlignment(
      (function() {
        const obj = {};
        bigArray.forEach(function(v) {
          obj[v] = null;
        });

        return obj;
      })(),
    );

    if (hasSet) {
      const s = new Set();

      // eslint-disable-next-line no-underscore-dangle
      if (s._es6set !== true) {
        bigArray.forEach(function(item) {
          s.add(item);
        });
        checkAlignment(s);
      }
    }

    if (hasMap) {
      const m = new Map();

      // eslint-disable-next-line no-underscore-dangle
      if (m._es6map !== true) {
        bigArray.forEach(function(item, index) {
          m.set(index, item);
        });
        checkAlignment(m);
      }
    }
  });

  it('corner cases', function() {
    expect.assertions(1);
    expect.assertions(1); // Corner cases.
    let x = {constructor: 42};
    expect(inspect(x)).toBe('{ constructor: 42 }');

    if (getSupport) {
      x = {};
      Object.defineProperty(x, 'constructor', {
        enumerable: true,
        get() {
          throw new Error('should not access constructor');
        },
      });
      expect(inspect(x)).toBe('{ constructor: [Getter] }');
    }

    x = new function() {}();
    expect(inspect(x)).toBe('{}');

    x = Object.create(null);
    expect(inspect(x)).toBe('{}');
  });

  it('inspect.defaultOptions', function() {
    expect.assertions(1);
    expect.assertions(1); // inspect.defaultOptions tests
    const arr = new Array(101).fill();
    const obj = {a: {a: {a: {a: 1}}}};
    const oldOptions = {...inspect.defaultOptions};
    const reMore = /1 more item/;
    const reObject = /Object/;

    // Set single option through property assignment
    inspect.defaultOptions.maxArrayLength = null;
    expect(!reMore.test(inspect(arr))).toBe(true);
    inspect.defaultOptions.maxArrayLength = oldOptions.maxArrayLength;
    expect(reMore.test(inspect(arr))).toBe(true);
    inspect.defaultOptions.depth = null;
    expect(!reObject.test(inspect(obj))).toBe(true);
    inspect.defaultOptions.depth = oldOptions.depth;
    expect(reObject.test(inspect(obj))).toBe(true);
    expect(JSON.stringify(inspect.defaultOptions)).toBe(JSON.stringify(oldOptions));

    // Set multiple options through object assignment
    inspect.defaultOptions = {depth: null, maxArrayLength: null};
    expect(!reMore.test(inspect(arr))).toBe(true);
    expect(!reObject.test(inspect(obj))).toBe(true);
    inspect.defaultOptions = oldOptions;
    expect(reMore.test(inspect(arr))).toBe(true);
    expect(reObject.test(inspect(obj))).toBe(true);
    expect(JSON.stringify(inspect.defaultOptions)).toBe(JSON.stringify(oldOptions));
  });

  supportsGetSetIt('inspect.defaultOptions getter setter error', function() {
    expect(function() {
      inspect.defaultOptions = null;
    }).toThrow('"options" must be an object');

    expect(function() {
      inspect.defaultOptions = 'bad';
    }).toThrow('"options" must be an object');
  });

  ifClassSupportedIt('classes', function() {
    // eslint-disable-next-line no-new-func
    const classFn = new Function('return class My {}')();
    expect(inspect(classFn)).toBe('[Class: My]');

    // eslint-disable-next-line no-new-func
    const ObjectSubclass = new Function('return class ObjectSubclass {}')();
    // eslint-disable-next-line no-new-func
    const ArraySubclass = new Function('return class ArraySubclass extends Array {}')();
    // eslint-disable-next-line no-new-func
    const SetSubclass = new Function('return class SetSubclass extends Set {}')();
    // eslint-disable-next-line no-new-func
    const MapSubclass = new Function('return class MapSubclass extends Map {}')();
    // eslint-disable-next-line no-new-func
    const PromiseSubclass = new Function('return class PromiseSubclass extends Promise {}')();
    // eslint-disable-next-line no-new-func
    const StringSubclass = new Function('return class StringSubclass extends String {}')();
    // eslint-disable-next-line no-new-func
    const BooleanSubclass = new Function('return class BooleanSubclass extends Boolean {}')();
    // eslint-disable-next-line no-new-func
    const NumberSubclass = new Function('return class NumberSubclass extends Number {}')();

    let x = new ObjectSubclass();
    x.foo = 42;
    expect(inspect(x)).toBe('ObjectSubclass { foo: 42 }');
    expect(inspect(new ArraySubclass(1, 2, 3))).toBe('ArraySubclass [ 1, 2, 3 ]');
    expect(inspect(new SetSubclass([1, 2, 3]))).toBe('SetSubclass { 1, 2, 3 }');
    expect(inspect(new MapSubclass([['foo', 42]]))).toBe("MapSubclass { 'foo' => 42 }");
    expect(inspect(new PromiseSubclass(function _cb() {}))).toBe('PromiseSubclass {}');

    if (Date.toString().includes('Date() { [native code] }')) {
      // eslint-disable-next-line no-new-func
      const DateSubclass = new Function('return class DateSubclass extends Date {}')();
      expect(inspect(new DateSubclass(0))).toBe('[DateSubclass: 1970-01-01T00:00:00.000Z]');
    }

    expect(inspect(new StringSubclass('abc'))).toBe("[StringSubclass: 'abc']");
    expect(inspect(new BooleanSubclass(true))).toBe('[BooleanSubclass: true]');
    expect(inspect(new NumberSubclass(1))).toBe('[NumberSubclass: 1]');

    // eslint-disable-next-line no-new-func
    const ErrorSubclass = new Function('return class ErrorSubclass extends Error {}')();
    x = inspect(new ErrorSubclass('test'));
    expect(x.split('\n').shift()).toBe('ErrorSubclass: test');
  });
});
