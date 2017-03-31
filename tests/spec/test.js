/* jslint maxlen:80, es6:true, white:true */

/* jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
   freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
   nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
   es3:false, esnext:true, plusplus:true, maxparams:1, maxdepth:2,
   maxstatements:12, maxcomplexity:4 */

/* eslint strict: 1, max-lines: 1, symbol-description: 1, max-nested-callbacks: 1,
   max-statements: 1, id-length: 1, complexity: 1, max-statements-per-line: 1 */

/* global expect, module, require, describe, xit, it, returnExports,
   Promise:true, JSON:true, ArrayBuffer, DataView, Int8Array, Uint8ClampedArray,
   Float32Array, Float64Array, Int16Array, Int32Array, Uint8Array, Uint16Array,
   Uint32Array */

;(function () { // eslint-disable-line no-extra-semi

  'use strict';

  var inspect;

  if (typeof module === 'object' && module.exports) {
    require('es5-shim');
    require('es5-shim/es5-sham');
    if (typeof JSON === 'undefined') {
      JSON = {};
    }
    require('json3').runInContext(null, JSON);
    require('es6-shim');
    var es7 = require('es7-shim');
    Object.keys(es7).forEach(function (key) {
      var obj = es7[key];
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

  var hasSymbol = typeof Symbol === 'function' && typeof Symbol() === 'symbol';
  var ifHasSymbolIt = hasSymbol ? it : xit;
  var hasSet = typeof Set === 'function';
  var ifHasSetIt = hasSet ? it : xit;
  var hasMap = typeof Map === 'function';
  var ifHasMapIt = hasMap ? it : xit;
  var hasArrayBuffer = typeof ArrayBuffer === 'function';
  var ifHasArrayBuffer = hasArrayBuffer ? it : xit;
  var hasDataView = typeof DataView === 'function';
  var ifHasDataView = hasArrayBuffer && hasDataView ? it : xit;
  var hasInt8Array = typeof Int8Array === 'function';
  var hasUint8ClampedArray = typeof Uint8ClampedArray === 'function';
  var hasPromise = typeof Promise === 'function';
  var ifHasPromiseIt = hasPromise ? it : xit;
  var propVisibleOnArrayBuffer = hasArrayBuffer && (function () {
    var ab = new ArrayBuffer(4);
    ab.x = true;
    return Object.keys(ab).indexOf('x') > -1;
  }());

  var getSupport = (function () {
    /* jshint unused:false */
    try {
      /* jshint evil:true */
      eval('var x={get prop(){return;}};'); // eslint-disable-line no-eval
      return true;
    } catch (ignore) {}
    return false;
  }());
  var ifGetSupportIt = getSupport ? it : xit;

  var noHidden = (function () {
    var x = Object.defineProperty({}, 'hidden', {
      enumerable: false,
      value: null
    });
    return Object.keys(x).length !== 0;
  }());

  var supportsInferredName;
  if (function test1() {}.name === 'test1') {
    var xx = { yy: function () {} };
    supportsInferredName = xx.yy.name === 'yy';
  }

  var supportsGetSetIt = xit;
  try {
    var testVar;
    var testObject = Object.defineProperty(Object.create(null), 'defaultOptions', {
      get: function () {
        return testVar;
      },
      set: function (val) {
        testVar = val;
        return testVar;
      }
    });
    testObject.defaultOptions = 'test';
    supportsGetSetIt = testVar === 'test' ? it : xit;
  } catch (ignore) {}

  var ifGenSupportedIt = xit;
  try {
    new Function('return function*() {}')(); // eslint-disable-line no-new-func
    ifGenSupportedIt = it;
  } catch (e) {}

  var ifArrowSupportedIt = xit;
  try {
    new Function('return () => {}')(); // eslint-disable-line no-new-func
    ifArrowSupportedIt = it;
  } catch (e) {}

  var ifAsyncSupportedIt = xit;
  try {
    new Function('return async function() {}')(); // eslint-disable-line no-new-func
    ifAsyncSupportedIt = it;
  } catch (e) {}

  describe('inspect', function () {
    it('basic', function () {
      expect(inspect(1)).toBe('1');
      expect(inspect(false)).toBe('false');
      expect(inspect('')).toBe('\'\'');
      expect(inspect('hello')).toBe('\'hello\'');
      expect(inspect(function () {})).toBe('[Function]');
      expect(inspect(function f() {})).toBe('[Function: f]');

      expect(inspect(undefined)).toBe('undefined');
      expect(inspect(null)).toBe('null');
      expect(inspect(/foo(bar\n)?/igm)).toBe('/foo(bar\\n)?/gim');
      var subject = new Date(1266148120000);
      var ex = inspect(subject);
      var match = ex.match(/(2010-02-14T11:48:40.000Z)/);
      match = match ? match[0] : ex;
      expect(match).toBe('2010-02-14T11:48:40.000Z');
      subject = new Date('');
      expect(inspect(subject)).toBe('Invalid Date');
      expect(inspect('\n\u0001')).toBe('\'\\n\\u0001\'');

      expect(inspect([])).toBe('[]');
      var arr = Object.create([]);
      ex = inspect(arr);
      expect(ex.slice(0, 7)).toBe('Array {');
      expect(ex.slice(-1)).toBe('}');
      expect(inspect([1, 2])).toBe('[ 1, 2 ]');
      expect(inspect([1, [2, 3]])).toBe('[ 1, [ 2, 3 ] ]');

      expect(inspect({})).toBe('{}');
      expect(inspect({ a: 1 })).toBe('{ a: 1 }');
      expect(inspect({ a: function () {} })).toBe(supportsInferredName ? '{ a: [Function: a] }' : '{ a: [Function] }');
      expect(inspect({ a: function test() {} })).toBe('{ a: [Function: test] }');
      expect(inspect({ a: 1, b: 2 })).toBe('{ a: 1, b: 2 }');
      expect(inspect({ a: {} })).toBe('{ a: {} }');
      expect(inspect({ a: { b: 2 } })).toBe('{ a: { b: 2 } }');
      expect(inspect({ a: { b: { c: { d: 2 } } } })).toBe('{ a: { b: { c: [Object] } } }');
      expect(inspect({ a: { b: { c: { d: 2 } } } }, false, null)).toBe('{ a: { b: { c: { d: 2 } } } }');
      expect(inspect([1, 2, 3], true)).toBe('[ 1, 2, 3, [length]: 3 ]');
      expect(inspect({ a: { b: { c: 2 } } }, false, 0)).toBe('{ a: [Object] }');
      expect(inspect({ a: { b: { c: 2 } } }, false, 1)).toBe('{ a: { b: [Object] } }');
    });

    ifArrowSupportedIt('arrow functions', function () {
      expect(inspect(new Function('return () => {}')())).toBe('[Function]'); // eslint-disable-line no-new-func
    });

    ifGenSupportedIt('generator functions', function () {
      expect(inspect(new Function('return function*() {}')())).toBe('[GeneratorFunction]'); // eslint-disable-line no-new-func
    });

    ifAsyncSupportedIt('async functions', function () {
      expect(inspect(new Function('return async function() {}')())).toBe('[AsyncFunction]'); // eslint-disable-line no-new-func
      expect(inspect(new Function('return async () => {}')())).toBe('[AsyncFunction]'); // eslint-disable-line no-new-func
    });

    ifHasArrayBuffer('ArrayBuffer', function () {
      [true, false].forEach(function (showHidden) {
        var ab = new ArrayBuffer(4);
        var ex = inspect(ab, showHidden);
        expect(ex.slice(0, 13)).toBe('ArrayBuffer {');
        expect(ex.slice(-1)).toBe('}');
        var match = ex.match(/byteLength: 4/);
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

    ifHasDataView('DataView', function () {
      [true, false].forEach(function (showHidden) {
        var ab = new ArrayBuffer(4);
        var dv = new DataView(ab, 1, 2);
        var ex = inspect(dv, showHidden);

        expect(ex.slice(0, 10)).toBe('DataView {');
        expect(ex.slice(-1)).toBe('}');
        var match = ex.match(/(byteLength: 2,)[\s\S]+(byteOffset: 1,)[\s\S]+(buffer:)[\s\S]+(ArrayBuffer)[\s\S]+(byteLength: 4)/);
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
          match = ex.match(/(byteLength: 2,)[\s\S]+(byteOffset: 1,)[\s\S]+(buffer:)[\s\S]+(ArrayBuffer)[\s\S]+(byteLength: 4,)[\s\S]+(x: 42)[\s\S]+(y: 1337)/);
          match = match ? match.slice(1).join(' ') : ex;
          expect(match).toBe('byteLength: 2, byteOffset: 1, buffer: ArrayBuffer byteLength: 4, x: 42 y: 1337');
        } else {
          match = ex.match(/(byteLength: 2,)[\s\S]+(byteOffset: 1,)[\s\S]+(buffer:)[\s\S]+(ArrayBuffer)[\s\S]+(byteLength: 4)[\s\S]+(y: 1337)/);
          match = match ? match.slice(1).join(' ') : ex;
          expect(match).toBe('byteLength: 2, byteOffset: 1, buffer: ArrayBuffer byteLength: 4 y: 1337');
        }
      });
    });

    ifHasArrayBuffer('TypedArrays', function () {
      var arrays = [{
        Ctr: Float32Array,
        name: 'Float32Array'
      }, {
        Ctr: Float64Array,
        name: 'Float64Array'
      }, {
        Ctr: Int16Array,
        name: 'Int16Array'
      }, {
        Ctr: Int32Array,
        name: 'Int32Array'
      }, {
        Ctr: Uint16Array,
        name: 'Uint16Array'
      }, {
        Ctr: Uint32Array,
        name: 'Uint32Array'
      }, {
        Ctr: Uint8Array,
        name: 'Uint8Array'
      }];
      if (hasUint8ClampedArray) {
        arrays.push({
          Ctr: Uint8ClampedArray,
          name: 'Uint8ClampedArray'
        });
      }
      if (hasInt8Array) {
        arrays.push({
          Ctr: Int8Array,
          name: 'Int8Array'
        });
      }
      arrays.forEach(function (item) {
        var length = 2;
        var byteLength = length * item.Ctr.BYTES_PER_ELEMENT;
        var array = new item.Ctr(new ArrayBuffer(byteLength), 0, length);
        array[0] = 65;
        array[1] = 97;
        var ex = inspect(array, true);
        expect(ex.slice(0, item.name.length + 2)).toBe(item.name + ' [');
        expect(ex.slice(-1)).toBe(']');
        var match = ex.match(/(65,)[\s\S]+(97)[\s\S]+\[?(BYTES_PER_ELEMENT)\]?: (\d*)[\s\S]+\[?(length)\]?: (\d*)[\s\S]+\[?(byteLength)\]?: (\d*)[\s\S]+\[?(byteOffset)\]?: (0)[\s\S]+\[?(buffer)\]?:[\s\S]+(ArrayBuffer)[\s\S]+(byteLength: \d*)/);
        match = match ? match.slice(1).join(' ') : ex;
        expect(match).toBe('65, 97 BYTES_PER_ELEMENT ' + item.Ctr.BYTES_PER_ELEMENT + ' length ' + length + ' byteLength ' + byteLength + ' byteOffset 0 buffer ArrayBuffer byteLength: ' + byteLength);

        ex = inspect(array, false);
        expect(ex.slice(0, item.name.length + 2)).toBe(item.name + ' [');
        expect(ex.slice(-1)).toBe(']');
        match = ex.match(/(65,)[\s\S]+(97)/);
        match = match ? match.slice(1).join(' ') : ex;
        expect(match).toBe('65, 97');
      });
    });

    it('Objects without prototype', function () {
      // Due to the hash seed randomization it's not deterministic the order
      // that the following ways this hash is displayed.
      // See http://codereview.chromium.org/9124004/

      var out = inspect(Object.create({}, {
        hidden: { value: 'Visible on ES3' },
        visible: {
          enumerable: true,
          value: 1
        }
      }), true);
      if (noHidden) {
        if (!(out !== '{ [hidden]: \'Visible on ES3\', visible: 1 }' && out !== '{ visible: 1, [hidden]: \'Visible on ES3\' }')) {

          expect(false).toBe(true);
        }
      } else if (out !== '{ [hidden]: \'Visible on ES3\', visible: 1 }' && out !== '{ visible: 1, [hidden]: \'Visible on ES3\' }') {

        expect(false).toBe(true);
      }
    });

    it('Objects without prototype', function () {
      // Objects without prototype
      var out = inspect(Object.create(null, {
        hidden: { value: 'Visible on ES3' },
        name: {
          enumerable: true,
          value: 'Tim'
        }
      }), true);
      if (noHidden) {
        if (!(out !== '{ [hidden]: \'Visible on ES3\', name: \'Tim\' }' && out !== '{ name: \'Tim\', [hidden]: \'Visible on ES3\' }')) {

          expect(false).toBe(true);
        }
      } else if (out !== '{ [hidden]: \'Visible on ES3\', name: \'Tim\' }' && out !== '{ name: \'Tim\', [hidden]: \'Visible on ES3\' }') {

        expect(false).toBe(true);
      }

      expect(
        inspect(Object.create(null, {
          hidden: { value: 'Visible on ES3' },
          name: {
            enumerable: true,
            value: 'Tim'
          }
        }))).toBe(noHidden ? '{ name: \'Tim\', hidden: \'Visible on ES3\' }' : '{ name: \'Tim\' }'
      );
    });

    ifGetSupportIt('Dynamic properties', function () {
      // Dynamic properties
      var subject = {};
      Object.defineProperty(subject, 'readonly', {
        enumerable: true,
        get: function () {}
      });
      expect(inspect(subject)).toBe('{ readonly: [Getter] }');

      subject = {};
      Object.defineProperty(subject, 'readwrite', {
        enumerable: true,
        get: function () {},
        /* jshint unused:false */
        set: function (val) {} // eslint-disable-line no-unused-vars
      });
      expect(inspect(subject)).toBe('{ readwrite: [Getter/Setter] }');

      subject = {};
      Object.defineProperty(subject, 'writeonly', { // eslint-disable-line accessor-pairs
        enumerable: true,
        set: function (val) {} // eslint-disable-line no-unused-vars
      });
      expect(inspect(subject)).toBe('{ writeonly: [Setter] }');

      var value = {};
      value.a = value;
      expect(inspect(value)).toBe('{ a: [Circular] }');
    });

    ifGetSupportIt('Array with dynamic properties', function () {
      // Array with dynamic properties
      var value = [1, 2, 3];
      Object.defineProperty(value, 'growingLength', {
        enumerable: true,
        get: function () {
          this.push(true);
          return this.length;
        }
      });
      expect(inspect(value)).toBe('[ 1, 2, 3, growingLength: [Getter] ]');
    });

    it('Function with properties', function () {
      // Function with properties
      var value = function () {};
      value.aprop = 42;
      expect(inspect(value)).toBe(supportsInferredName ? '{ [Function: value] aprop: 42 }' : '{ [Function] aprop: 42 }');
    });

    ifArrowSupportedIt('Anonymous function with properties', function () {
      // Anonymous function with properties
      var value = new Function('return (() => function() {})()')(); // eslint-disable-line no-new-func
      value.aprop = 42;
      expect(inspect(value)).toBe('{ [Function] aprop: 42 }');
    });

    it('Regular expressions with properties', function () {
      // Regular expressions with properties
      var value = /123/mig;
      value.aprop = 42;
      expect(inspect(value)).toBe('{ /123/gim aprop: 42 }');
    });

    it('Dates with properties', function () {
      // Dates with properties
      var value = new Date(1266148120000);
      value.aprop = 42;
      var ex = inspect(value);
      expect(ex.slice(0, 1)).toBe('{');
      expect(ex.slice(-1)).toBe('}');
      var match = ex.match(/(2010-02-14T11:48:40.000Z)[\s\S]+(aprop: 42)/);
      match = match ? match.slice(1).join(' ') : ex;
      expect(match).toBe('2010-02-14T11:48:40.000Z aprop: 42');
    });

    it('positive/negative zero', function () {
      // test positive/negative zero
      expect(inspect(0)).toBe('0');
      expect(inspect(-0)).toBe('-0');
    });

    it('sparse array', function () {
      // test for sparse array
      var a = ['foo', 'bar', 'baz'];
      expect(inspect(a)).toBe('[ \'foo\', \'bar\', \'baz\' ]');
      delete a[1];
      expect(inspect(a)).toBe('[ \'foo\', <1 empty item>, \'baz\' ]');
      expect(inspect(a, true)).toBe('[ \'foo\', <1 empty item>, \'baz\', [length]: 3 ]');
      expect(inspect(new Array(5))).toBe('[ <5 empty items> ]');
      a[3] = 'bar';
      a[100] = 'qux';
      expect(inspect(a, { breakLength: Infinity })).toBe('[ \'foo\', <1 empty item>, \'baz\', \'bar\', <96 empty items>, \'qux\' ]');
    });

    ifGetSupportIt('property descriptors', function () {
      // test for property descriptors
      var getter = Object.create(null, {
        a: {
          get: function () {
            return 'aaa';
          }
        }
      });
      var setter = Object.create(null, { b: { set: function () {} } }); // eslint-disable-line accessor-pairs
      var getterAndSetter = Object.create(null, {
        c: {
          get: function () {
            return 'ccc';
          },
          set: function () {}
        }
      });
      expect(inspect(getter, true)).toBe('{ [a]: [Getter] }');
      expect(inspect(setter, true)).toBe('{ [b]: [Setter] }');
      expect(inspect(getterAndSetter, true)).toBe('{ [c]: [Getter/Setter] }');
    });

    it('exceptions should print the error message, not \'{}\'', function () {
      // exceptions should print the error message, not '{}'
      var errors = [];
      errors.push(new Error());
      errors.push(new Error('FAIL'));
      errors.push(new TypeError('FAIL'));
      errors.push(new SyntaxError('FAIL'));
      errors.forEach(function (err) {
        expect(inspect(err)).toBe(err.stack || '[' + err.toString() + ']');
      });

      try {
        /* jshint undef:false */
        undef(); // eslint-disable-line no-undef
      } catch (e) {
        expect(inspect(e)).toBe(e.stack || '[' + e.toString() + ']');
      }
      var err = new Error('FAILURE');
      var ex = inspect(err, true);
      expect(ex.includes('Error: FAILURE')).toBe(true);
      if (err.stack !== undefined) {
        var stack = ex.match(/\[?stack\]?:/);
        stack = stack ? stack[1] : ex;
        expect(stack).not.toBe('stack');
      }
      if (err.message !== undefined) {
        var message = ex.match(/\[?(message)\]?(: 'FAILURE')/);
        message = message ? message[1] + message[2] : ex;
        expect(message).toBe('message: \'FAILURE\'');
      }
      /*
      if (err.name !== undefined) {
        var name = ex.match(/\[?(name)\]?(: \'Error\')/);
        name = name ? name[1] + name[2] : ex;
        expect(name).toBe('name: \'Error\'');
      }
      */
    });

    it('Doesn\'t capture stack trace', function () {
      // Doesn't capture stack trace
      var BadCustomError = function (msg) {
        Error.call(this);
        Object.defineProperty(this, 'message', { enumerable: false, value: msg });
        Object.defineProperty(this, 'name', { enumerable: false, value: 'BadCustomError' });
      };
      BadCustomError.prototype = Error.prototype;
      expect(inspect(new BadCustomError('foo'))).toBe('[BadCustomError: foo]');
    });

    it('GH-1941', function () {
      // GH-1941
      // should not throw:
      var prot = Object.create(Date.prototype);
      var ex = inspect(prot);
      expect(ex.slice(0, 6)).toBe('Date {');
      expect(ex.slice(-1)).toBe('}');
    });

    it('GH-1944', function () {
      // GH-1944
      expect(function () {
        var d = new Date();
        d.toUTCString = null;
        inspect(d);
      }).not.toThrow();

      expect(function () {
        var d = new Date();
        d.toISOString = null;
        inspect(d);
      }).not.toThrow();

      expect(function () {
        var r = /regexp/;
        r.toString = null;
        inspect(r);
      }).not.toThrow();
    });

    it('bug with user-supplied inspect function returns non-string', function () {
      // bug with user-supplied inspect function returns non-string
      expect(function () {
        inspect([{
          inspect: function () {
            return 123;
          }
        }]);
      }).not.toThrow();
    });

    it('GH-2225', function () {
      // GH-2225
      var x = { inspect: inspect };
      expect(inspect(x).indexOf('inspect')).not.toBe(-1);
    });

    it('inspect should not display the escaped value of a key.', function () {
      // inspect should not display the escaped value of a key.
      var w = {
        '\\': 1,
        '\\\\': 2,
        '\\\\\\': 3,
        '\\\\\\\\': 4
      };

      var y = ['a', 'b', 'c'];
      y['\\\\\\'] = 'd';

      expect(inspect(w))
        .toBe('{ \'\\\': 1, \'\\\\\': 2, \'\\\\\\\': 3, \'\\\\\\\\\': 4 }');
      expect(inspect(y)).toBe('[ \'a\', \'b\', \'c\', \'\\\\\\\': \'d\' ]');
    });

    it('inspect.styles and inspect.colors', function () {
      // inspect.styles and inspect.colors
      var testColorStyle = function (style, input) {
        var colorName = inspect.styles[style];
        var color = ['', ''];
        if (inspect.colors[colorName]) {
          color = inspect.colors[colorName];
        }

        var withoutColor = inspect(input, false, 0, false);
        var withColor = inspect(input, false, 0, true);
        var expected = '\u001b[' + color[0] + 'm' + withoutColor + '\u001b[' + color[1] + 'm';
        expect(withColor).toBe(expected, 'inspect color for style ' + style);
      };

      testColorStyle('special', function () {});
      testColorStyle('number', 123.456);
      testColorStyle('boolean', true);
      testColorStyle('undefined', undefined);
      testColorStyle('null', null);
      testColorStyle('string', 'test string');
      testColorStyle('date', new Date());
      testColorStyle('regexp', /regexp/);
    });

    it('an object with "hasOwnProperty" overwritten should not throw', function () {
      // an object with "hasOwnProperty" overwritten should not throw
      expect(function () {
        inspect({
          /* jshint -W001 */
          hasOwnProperty: null
        });
      }).not.toThrow();
    });

    it('new API, accepts an "options" object', function () {
      // new API, accepts an "options" object
      var subject = {
        a: { b: { c: { d: 0 } } },
        foo: 'bar',
        hello: 31
      };
      Object.defineProperty(subject, 'hidden', {
        enumerable: false,
        value: null
      });

      if (!noHidden) {
        expect(inspect(subject, { showHidden: false }).indexOf('hidden')).toBe(-1, 'Visible on ES3');
      }
      expect(inspect(subject, { showHidden: true }).indexOf('hidden')).not.toBe(-1);
      expect(inspect(subject, { colors: false }).indexOf('\u001b[32m')).toBe(-1);
      expect(inspect(subject, { colors: true }).indexOf('\u001b[32m')).not.toBe(-1);
      expect(inspect(subject, { depth: 2 }).indexOf('c: [Object]')).not.toBe(1);
      expect(inspect(subject, { depth: 0 }).indexOf('a: [Object]')).not.toBe(-1);
      expect(inspect(subject, { depth: null }).indexOf('{ d: 0 }')).not.toBe(-1);
    });

    it('"customInspect" option can enable/disable calling inspect() on objects', function () {
      // "customInspect" option can enable/disable calling inspect() on objects
      var subject = {
        inspect: function () {
          return 123;
        }
      };

      expect(inspect(subject, { customInspect: true }).indexOf('123')).not.toBe(-1);
      expect(inspect(subject, { customInspect: true }).indexOf('inspect')).toBe(-1);
      expect(inspect(subject, { customInspect: false }).indexOf('123')).toBe(-1);
      expect(inspect(subject, { customInspect: false }).indexOf('inspect')).not.toBe(-1);
    });

    it('custom inspect() functions should be able to return other Objects', function () {
      // custom inspect() functions should be able to return other Objects
      var subject = {
        inspect: function () {
          return { foo: 'bar' };
        }
      };

      expect(inspect(subject)).toBe('{ foo: \'bar\' }');

      subject.inspect = function (depth, opts) {
        expect(opts.customInspectOptions).toBe(true);
      };

      inspect(subject, { customInspectOptions: true });
    });

    it('"customInspect" option can enable/disable calling [inspect.custom]()', function () {
      // "customInspect" option can enable/disable calling [inspect.custom]()
      var subject = {};
      subject[inspect.custom] = function () {
        return 123;
      };

      expect(inspect(subject, { customInspect: true }).includes('123')).toBe(true);
      expect(inspect(subject, { customInspect: false }).includes('123')).toBe(false);

      // a custom [inspect.custom]() should be able to return other Objects
      subject[inspect.custom] = function () {
        return { foo: 'bar' };
      };

      expect(inspect(subject), '{ foo: \'bar\' }');

      subject[inspect.custom] = function (depth, opts) {
        expect(opts.customInspectOptions).toBe(true);
      };

      inspect(subject, { customInspectOptions: true });
    });

    it('[inspect.custom] takes precedence over inspect', function () {
      // [inspect.custom] takes precedence over inspect
      var subject = {};
      subject[inspect.custom] = function () {
        return 123;
      };
      subject.inspect = function () {
        return 456;
      };

      expect(inspect(subject, { customInspect: true }).includes('123')).toBe(true);
      expect(inspect(subject, { customInspect: false }).includes('123')).toBe(false);
      expect(inspect(subject, { customInspect: true }).includes('456')).toBe(false);
      expect(inspect(subject, { customInspect: false }).includes('456')).toBe(false);
    });

    it('Returning `this` from a custom inspection function works', function () {
      // Returning `this` from a custom inspection function works.
      var subject = { a: 123, inspect: function () { return this; } };
      var str;
      if (supportsInferredName) {
        str = '{ a: 123, inspect: [Function: inspect] }';
      } else {
        str = '{ a: 123, inspect: [Function] }';
      }
      expect(inspect(subject)).toBe(str);
      subject = { a: 123 };
      subject[inspect.custom] = function () {
        return this;
      };

      if (hasSymbol) {
        str = '{ a: 123, [Symbol(inspect.custom)]: [Function] }';
      } else {
        str = '{ a: 123, \'_inspect.custom_\': [Function] }';
      }

      expect(inspect(subject)).toBe(str);
    });

    it('inspect with "colors" option should produce as many lines as without it', function () {
      // inspect with "colors" option should produce as many lines as without it
      var testLines = function (input) {
        var countLines = function (str) {
          return (str.match(/\n/g) || []).length;
        };

        var withoutColor = inspect(input);
        var withColor = inspect(input, { colors: true });
        expect(countLines(withoutColor)).toBe(countLines(withColor));
      };

      testLines([1, 2, 3, 4, 5, 6, 7]);
      testLines(function () {
        var bigArray = [];
        for (var i = 0; i < 100; i += 1) {
          bigArray.push(i);
        }
        return bigArray;
      }());
      testLines({
        b: { a: 35 },
        baz: 35,
        foo: 'bar'
      });
      testLines({
        b: { a: 35 },
        baz: 35,
        evenLongerKey: ['with even longer value in array'],
        foo: 'bar',
        veryLongKey: 'very_long_value'
      });
    });

    it('boxed primitives output the correct values', function () {
      // test boxed primitives output the correct values
      expect(inspect(Object('test'))).toBe('[String: \'test\']');
      expect(inspect(Object(false))).toBe('[Boolean: false]');
      expect(inspect(Object(true))).toBe('[Boolean: true]');
      expect(inspect(Object(0))).toBe('[Number: 0]');
      expect(inspect(Object(-0))).toBe('[Number: -0]');
      expect(inspect(Object(-1.1))).toBe('[Number: -1.1]');
      expect(inspect(Object(13.37))).toBe('[Number: 13.37]');
    });

    it('boxed primitives with own properties', function () {
      // test boxed primitives with own properties
      var str = Object('baz');
      str.foo = 'bar';
      expect(inspect(str)).toBe('{ [String: \'baz\'] foo: \'bar\' }');

      var bool = Object(true);
      bool.foo = 'bar';
      expect(inspect(bool)).toBe('{ [Boolean: true] foo: \'bar\' }');

      var num = Object(13.37);
      num.foo = 'bar';
      expect(inspect(num)).toBe('{ [Number: 13.37] foo: \'bar\' }');
    });

    ifHasSymbolIt('Symbol', function () {
      // test es6 Symbol
      expect(inspect(Symbol())).toBe('Symbol()');
      expect(inspect(Symbol(123))).toBe('Symbol(123)');
      expect(inspect(Symbol('hi'))).toBe('Symbol(hi)');
      expect(inspect([Symbol()])).toBe('[ Symbol() ]');
      expect(inspect({ foo: Symbol() })).toBe('{ foo: Symbol() }');

      var options = { showHidden: true };
      var subject = {};

      subject[Symbol('symbol')] = 42;

      expect(inspect(subject)).toBe('{ [Symbol(symbol)]: 42 }');
      expect(inspect(subject, options)).toBe('{ [Symbol(symbol)]: 42 }');

      Object.defineProperty(subject, Symbol(), { enumerable: false, value: 'non-enum' });
      expect(inspect(subject)).toBe('{ [Symbol(symbol)]: 42 }');
      expect(inspect(subject, options)).toBe('{ [Symbol(symbol)]: 42, [Symbol()]: \'non-enum\' }');

      subject = [1, 2, 3];
      subject[Symbol('symbol')] = 42;

      expect(inspect(subject)).toBe('[ 1, 2, 3, [Symbol(symbol)]: 42 ]');
    });

    ifHasSetIt('Set', function () {
      // test Set
      var set = new Set();
      var ex = inspect(set);
      expect(ex.slice(0, 5)).toBe('Set {');
      expect(ex.slice(-1)).toBe('}');
      set.add(1);
      set.add(2);
      set.add(3);
      set.add(4);
      ex = inspect(set);
      var match = ex.match(/1, 2, 3/);
      match = match ? match[0] : ex;
      expect(match).toBe('1, 2, 3');
      set = new Set();
      set.add('foo');
      set.bar = 42;
      ex = inspect(set, true);
      match = ex.match(/('foo',)[\s\S]+(\[size\]: 1,)[\s\S]+(bar: 42)/);
      match = match ? match.slice(1).join(' ') : ex;
      expect(match).toBe('\'foo\', [size]: 1, bar: 42');
    });

    ifHasMapIt('Map', function () {
      // test Map
      var map = new Map();
      var ex = inspect(map);
      expect(ex.slice(0, 5)).toBe('Map {');
      expect(ex.slice(-1)).toBe('}');
      map.set(1, 'a');
      map.set(2, 'b');
      map.set(3, 'c');
      ex = inspect(map);
      var match = ex.match(/1 => 'a', 2 => 'b', 3 => 'c'/);
      match = match ? match[0] : ex;
      expect(match).toBe('1 => \'a\', 2 => \'b\', 3 => \'c\'');
      map = new Map();
      map.set('foo', null);
      map.bar = 42;
      ex = inspect(map, true);
      match = ex.match(/('foo' => null,)[\s\S]+(\[size\]: 1,)[\s\S]+(bar: 42)/);
      match = match ? match.slice(1).join(' ') : ex;
      expect(match).toBe('\'foo\' => null, [size]: 1, bar: 42');
    });

    ifHasPromiseIt('Promise', function () {
      // test Promise
      var ex = inspect(Promise.resolve(3));
      expect(ex.slice(0, 9)).toBe('Promise {');
      expect(ex.slice(-1)).toBe('}');
      var rejected = Promise.reject(3); // eslint-disable-line prefer-promise-reject-errors
      ex = inspect(rejected);
      rejected['catch'](function () {});  // eslint-disable-line dot-notation
      expect(ex.slice(0, 9)).toBe('Promise {');
      expect(ex.slice(-1)).toBe('}');
      ex = inspect(new Promise(function () {}));
      expect(ex.slice(0, 9)).toBe('Promise {');
      expect(ex.slice(-1)).toBe('}');
      var promise = Promise.resolve('foo');
      promise.bar = 42;
      ex = inspect(promise);
      expect(ex.slice(0, 9)).toBe('Promise {');
      expect(ex.slice(-1)).toBe('}');
      var match = ex.match(/(bar: 42)/);
      match = match ? match[0] : ex;
      expect(match).toBe('bar: 42');
    });

    ifHasMapIt('MapIterator', function () {
      var m = new Map();
      var ex;
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

    ifHasSetIt('SetIterator', function () {
      var s = new Set();
      var ex;
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

    it('alignment', function () {
      // Test alignment of items in container
      // Assumes that the first numeric character is the start of an item.

      var checkAlignment = function (container) {
        var lines = inspect(container).split('\n');
        var pos;
        lines.forEach(function (line) {
          var npos = line.search(/\d/);
          if (npos !== -1) {
            if (pos !== undefined) {
              expect(pos).toBe(npos, 'container items not aligned');
            }
            pos = npos;
          }
        });
      };

      var bigArray = [];
      for (var i = 0; i < 100; i += 1) {
        bigArray.push(i);
      }

      checkAlignment(bigArray);
      checkAlignment(function () {
        var obj = {};
        bigArray.forEach(function (v) {
          obj[v] = null;
        });
        return obj;
      }());
      if (hasSet) {
        var s = new Set();
        bigArray.forEach(function (item) {
          s.add(item);
        });
        checkAlignment(s);
      }
      if (hasMap) {
        var m = new Map();
        bigArray.forEach(function (item, index) {
          m.set(index, item);
        });
        checkAlignment(m);
      }
    });

    it('Corner cases', function () {
      // Corner cases.
      var x = { constructor: 42 };
      expect(inspect(x)).toBe('{ constructor: 42 }');

      if (getSupport) {
        x = {};
        Object.defineProperty(x, 'constructor', {
          enumerable: true,
          get: function () {
            throw new Error('should not access constructor');
          }
        });
        expect(inspect(x)).toBe('{ constructor: [Getter] }');
      }

      /* jshint singleGroups:false, supernew:true */
      x = new function () {}();
      /* jshint singleGroups:true, supernew:false */
      expect(inspect(x)).toBe('{}');

      x = Object.create(null);
      expect(inspect(x)).toBe('{}');
    });

    it('inspect.defaultOptions', function () {
      // inspect.defaultOptions tests
      var arr = new Array(101).fill();
      var obj = { a: { a: { a: { a: 1 } } } };
      var oldOptions = Object.assign({}, inspect.defaultOptions);
      var reMore = /1 more item/;
      var reObject = /Object/;

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
      inspect.defaultOptions = { depth: null, maxArrayLength: null };
      expect(!reMore.test(inspect(arr))).toBe(true);
      expect(!reObject.test(inspect(obj))).toBe(true);
      inspect.defaultOptions = oldOptions;
      expect(reMore.test(inspect(arr))).toBe(true);
      expect(reObject.test(inspect(obj))).toBe(true);
      expect(JSON.stringify(inspect.defaultOptions)).toBe(JSON.stringify(oldOptions));

    });

    supportsGetSetIt('inspect.defaultOptions getter setter error', function () {
      expect(function () {
        inspect.defaultOptions = null;
      }).toThrow('"options" must be an object');

      expect(function () {
        inspect.defaultOptions = 'bad';
      }).toThrow('"options" must be an object');
    });
  });
}());
