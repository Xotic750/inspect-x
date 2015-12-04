/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:false, maxdepth:false,
  maxstatements:false, maxcomplexity:false */

/*global expect, module, require, describe, it, returnExports */

(function () {
  'use strict';

  var inspect, assert;
  if (typeof module === 'object' && module.exports) {
    require('es5-shim');
    require('es5-shim/es5-sham');
    assert = require('assert');
    inspect = require('../../index.js');
  } else {
    inspect = returnExports;
  }

  describe('inspect', function () {
    assert.equal(inspect(1), '1');
    assert.equal(inspect(false), 'false');
    assert.equal(inspect(''), "''");
    assert.equal(inspect('hello'), "'hello'");
    assert.equal(inspect(function () {}), '[Function]');
    assert.equal(inspect(undefined), 'undefined');
    assert.equal(inspect(null), 'null');
    assert.equal(inspect(/foo(bar\n)?/gi), '/foo(bar\\n)?/gi');
    assert.equal(inspect(new Date('Sun, 14 Feb 2010 11:48:40 GMT')),
      new Date('2010-02-14T12:48:40+01:00').toString());

    assert.equal(inspect('\n\u0001'), "'\\n\\u0001'");

    assert.equal(inspect([]), '[]');
    assert.equal(inspect(Object.create([])), 'Array {}');
    assert.equal(inspect([1, 2]), '[ 1, 2 ]');
    assert.equal(inspect([1, [2, 3]]), '[ 1, [ 2, 3 ] ]');

    assert.equal(inspect({}), '{}');
    assert.equal(inspect({
      a: 1
    }), '{ a: 1 }');
    assert.equal(inspect({
      a: function () {}
    }), '{ a: [Function] }');
    assert.equal(inspect({
      a: 1,
      b: 2
    }), '{ a: 1, b: 2 }');
    assert.equal(inspect({
      'a': {}
    }), '{ a: {} }');
    assert.equal(inspect({
      'a': {
        'b': 2
      }
    }), '{ a: { b: 2 } }');
    assert.equal(inspect({
        'a': {
          'b': {
            'c': {
              'd': 2
            }
          }
        }
      }),
      '{ a: { b: { c: [Object] } } }');
    assert.equal(inspect({
        'a': {
          'b': {
            'c': {
              'd': 2
            }
          }
        }
      }, false, null),
      '{ a: { b: { c: { d: 2 } } } }');
    assert.equal(inspect([1, 2, 3], true), '[ 1, 2, 3, [length]: 3 ]');
    assert.equal(inspect({
        'a': {
          'b': {
            'c': 2
          }
        }
      }, false, 0),
      '{ a: [Object] }');
    assert.equal(inspect({
        'a': {
          'b': {
            'c': 2
          }
        }
      }, false, 1),
      '{ a: { b: [Object] } }');
    assert.equal(inspect(Object.create({}, {
        visible: {
          value: 1,
          enumerable: true
        },
        hidden: {
          value: 2
        }
      })),
      '{ visible: 1 }'
    );

    [true, false].forEach(function (showHidden) {
      var ab = new ArrayBuffer(4);
      assert.equal(inspect(ab, showHidden), 'ArrayBuffer { byteLength: 4 }');
      assert.equal(inspect(ab, showHidden), 'ArrayBuffer { byteLength: 4 }');
      ab.x = 42;
      assert.equal(inspect(ab, showHidden),
        'ArrayBuffer { byteLength: 4, x: 42 }');
    });

    [Float32Array,
      Float64Array,
      Int16Array,
      Int32Array,
      Int8Array,
      Uint16Array,
      Uint32Array,
      Uint8Array,
      Uint8ClampedArray
    ].forEach(function (Constructor) {
      var length = 2;
      var byteLength = length * Constructor.BYTES_PER_ELEMENT;
      var array = new Constructor(new ArrayBuffer(byteLength), 0, length);
      array[0] = 65;
      array[1] = 97;
      assert.equal(inspect(array, true),
        Constructor.name + ' [\n' +
        '  65,\n' +
        '  97,\n' +
        '  [BYTES_PER_ELEMENT]: ' + Constructor.BYTES_PER_ELEMENT + ',\n' +
        '  [length]: ' + length + ',\n' +
        '  [byteLength]: ' + byteLength + ',\n' +
        '  [byteOffset]: 0,\n' +
        '  [buffer]: ArrayBuffer { byteLength: ' + byteLength + ' } ]');
      assert.equal(inspect(array, false), Constructor.name + ' [ 65, 97 ]');
    });

    // Due to the hash seed randomization it's not deterministic the order that
    // the following ways this hash is displayed.
    // See http://codereview.chromium.org/9124004/

    var out = inspect(Object.create({}, {
      visible: {
        value: 1,
        enumerable: true
      },
      hidden: {
        value: 2
      }
    }), true);
    if (out !== '{ [hidden]: 2, visible: 1 }' &&
      out !== '{ visible: 1, [hidden]: 2 }') {
      assert.ok(false);
    }


    // Objects without prototype
    out = inspect(Object.create(null, {
      name: {
        value: 'Tim',
        enumerable: true
      },
      hidden: {
        value: 'secret'
      }
    }), true);
    if (out !== "{ [hidden]: 'secret', name: 'Tim' }" &&
      out !== "{ name: 'Tim', [hidden]: 'secret' }") {
      assert(false);
    }


    assert.equal(
      inspect(Object.create(null, {
        name: {
          value: 'Tim',
          enumerable: true
        },
        hidden: {
          value: 'secret'
        }
      })),
      '{ name: \'Tim\' }'
    );


    // Dynamic properties
    assert.equal(inspect({get readonly() {}
      }),
      '{ readonly: [Getter] }');

    assert.equal(inspect({get readwrite() {},
        set readwrite(val) {}
      }),
      '{ readwrite: [Getter/Setter] }');

    assert.equal(inspect({set writeonly(val) {}
      }),
      '{ writeonly: [Setter] }');

    var value = {};
    value.a = value;
    assert.equal(inspect(value), '{ a: [Circular] }');

    // Array with dynamic properties
    value = [1, 2, 3];
    value.__defineGetter__('growingLength', function () {
      this.push(true);
      return this.length;
    });
    assert.equal(inspect(value), '[ 1, 2, 3, growingLength: [Getter] ]');

    // Function with properties
    value = function () {};
    value.aprop = 42;
    assert.equal(inspect(value), '{ [Function] aprop: 42 }');

    // Regular expressions with properties
    value = /123/ig;
    value.aprop = 42;
    assert.equal(inspect(value), '{ /123/gi aprop: 42 }');

    // Dates with properties
    value = new Date('Sun, 14 Feb 2010 11:48:40 GMT');
    value.aprop = 42;
    assert.equal(inspect(value), '{ Sun, 14 Feb 2010 11:48:40 GMT aprop: 42 }');

    // test positive/negative zero
    assert.equal(inspect(0), '0');
    assert.equal(inspect(-0), '-0');

    // test for sparse array
    var a = ['foo', 'bar', 'baz'];
    assert.equal(inspect(a), '[ \'foo\', \'bar\', \'baz\' ]');
    delete a[1];
    assert.equal(inspect(a), '[ \'foo\', , \'baz\' ]');
    assert.equal(inspect(a, true), '[ \'foo\', , \'baz\', [length]: 3 ]');
    assert.equal(inspect(new Array(5)), '[ , , , ,  ]');

    // test for property descriptors
    var getter = Object.create(null, {
      a: {
        get: function () {
          return 'aaa';
        }
      }
    });
    var setter = Object.create(null, {
      b: {
        set: function () {}
      }
    });
    var getterAndSetter = Object.create(null, {
      c: {
        get: function () {
          return 'ccc';
        },
        set: function () {}
      }
    });
    assert.equal(inspect(getter, true), '{ [a]: [Getter] }');
    assert.equal(inspect(setter, true), '{ [b]: [Setter] }');
    assert.equal(inspect(getterAndSetter, true), '{ [c]: [Getter/Setter] }');

    // exceptions should print the error message, not '{}'
    assert.equal(inspect(new Error()), '[Error]');
    assert.equal(inspect(new Error('FAIL')), '[Error: FAIL]');
    assert.equal(inspect(new TypeError('FAIL')), '[TypeError: FAIL]');
    assert.equal(inspect(new SyntaxError('FAIL')), '[SyntaxError: FAIL]');
    try {
      undef();
    } catch (e) {
      assert.equal(inspect(e), '[ReferenceError: undef is not defined]');
    }
    var ex = inspect(new Error('FAIL'), true);
    assert.ok(ex.indexOf('[Error: FAIL]') !== -1);
    assert.ok(ex.indexOf('[stack]') !== -1);
    assert.ok(ex.indexOf('[message]') !== -1);

    // GH-1941
    // should not throw:
    assert.equal(inspect(Object.create(Date.prototype)), 'Date {}');

    // GH-1944
    assert.doesNotThrow(function () {
      var d = new Date();
      d.toUTCString = null;
      inspect(d);
    });

    assert.doesNotThrow(function () {
      var r = /regexp/;
      r.toString = null;
      inspect(r);
    });

    // bug with user-supplied inspect function returns non-string
    assert.doesNotThrow(function () {
      inspect([{
        inspect: function () {
          return 123;
        }
      }]);
    });

    // GH-2225
    var x = {
      inspect: inspect
    };
    assert.ok(inspect(x).indexOf('inspect') !== -1);

    // inspect should not display the escaped value of a key.
    var w = {
      '\\': 1,
      '\\\\': 2,
      '\\\\\\': 3,
      '\\\\\\\\': 4,
    };

    var y = ['a', 'b', 'c'];
    y['\\\\\\'] = 'd';

    assert.ok(inspect(w),
      '{ \'\\\': 1, \'\\\\\': 2, \'\\\\\\\': 3, \'\\\\\\\\\': 4 }');
    assert.ok(inspect(y), '[ \'a\', \'b\', \'c\', \'\\\\\\\': \'d\' ]');

    // inspect.styles and inspect.colors
    function testColorStyle(style, input) {
      var colorName = inspect.styles[style];
      var color = ['', ''];
      if (inspect.colors[colorName]) {
        color = inspect.colors[colorName];
      }

      var withoutColor = inspect(input, false, 0, false);
      var withColor = inspect(input, false, 0, true);
      var expect = '\u001b[' + color[0] + 'm' + withoutColor +
        '\u001b[' + color[1] + 'm';
      assert.equal(withColor, expect, 'inspect color for style ' + style);
    }

    testColorStyle('special', function () {});
    testColorStyle('number', 123.456);
    testColorStyle('boolean', true);
    testColorStyle('undefined', undefined);
    testColorStyle('null', null);
    testColorStyle('string', 'test string');
    testColorStyle('date', new Date());
    testColorStyle('regexp', /regexp/);

    // an object with "hasOwnProperty" overwritten should not throw
    assert.doesNotThrow(function () {
      inspect({
        hasOwnProperty: null
      });
    });

    // new API, accepts an "options" object
    var subject = {
      foo: 'bar',
      hello: 31,
      a: {
        b: {
          c: {
            d: 0
          }
        }
      }
    };
    Object.defineProperty(subject, 'hidden', {
      enumerable: false,
      value: null
    });

    assert(inspect(subject, {
      showHidden: false
    }).indexOf('hidden') === -1);
    assert(inspect(subject, {
      showHidden: true
    }).indexOf('hidden') !== -1);
    assert(inspect(subject, {
      colors: false
    }).indexOf('\u001b[32m') === -1);
    assert(inspect(subject, {
      colors: true
    }).indexOf('\u001b[32m') !== -1);
    assert(inspect(subject, {
      depth: 2
    }).indexOf('c: [Object]') !== -1);
    assert(inspect(subject, {
      depth: 0
    }).indexOf('a: [Object]') !== -1);
    assert(inspect(subject, {
      depth: null
    }).indexOf('{ d: 0 }') !== -1);

    // "customInspect" option can enable/disable calling inspect() on objects
    subject = {
      inspect: function () {
        return 123;
      }
    };

    assert(inspect(subject, {
      customInspect: true
    }).indexOf('123') !== -1);
    assert(inspect(subject, {
      customInspect: true
    }).indexOf('inspect') === -1);
    assert(inspect(subject, {
      customInspect: false
    }).indexOf('123') === -1);
    assert(inspect(subject, {
      customInspect: false
    }).indexOf('inspect') !== -1);

    // custom inspect() functions should be able to return other Objects
    subject.inspect = function () {
      return {
        foo: 'bar'
      };
    };

    assert.equal(inspect(subject), '{ foo: \'bar\' }');

    subject.inspect = function (depth, opts) {
      assert.strictEqual(opts.customInspectOptions, true);
    };

    inspect(subject, {
      customInspectOptions: true
    });

    // inspect with "colors" option should produce as many lines as without it
    function testLines(input) {
      var countLines = function (str) {
        return (str.match(/\n/g) || []).length;
      };

      var withoutColor = inspect(input);
      var withColor = inspect(input, {
        colors: true
      });
      assert.equal(countLines(withoutColor), countLines(withColor));
    }

    testLines([1, 2, 3, 4, 5, 6, 7]);
    testLines(function () {
      var bigArray = [];
      for (var i = 0; i < 100; i += 1) {
        bigArray.push(i);
      }
      return bigArray;
    }());
    testLines({
      foo: 'bar',
      baz: 35,
      b: {
        a: 35
      }
    });
    testLines({
      foo: 'bar',
      baz: 35,
      b: {
        a: 35
      },
      veryLongKey: 'very_long_value',
      evenLongerKey: ['with even longer value in array']
    });

    // test boxed primitives output the correct values
    assert.equal(inspect(Object('test')), '[String: \'test\']');
    assert.equal(inspect(Object(false)), '[Boolean: false]');
    assert.equal(inspect(Object(true)), '[Boolean: true]');
    assert.equal(inspect(Object(0)), '[Number: 0]');
    assert.equal(inspect(Object(-0)), '[Number: -0]');
    assert.equal(inspect(Object(-1.1)), '[Number: -1.1]');
    assert.equal(inspect(Object(13.37)), '[Number: 13.37]');

    // test boxed primitives with own properties
    var str = Object('baz');
    str.foo = 'bar';
    assert.equal(inspect(str), '{ [String: \'baz\'] foo: \'bar\' }');

    var bool = Object(true);
    bool.foo = 'bar';
    assert.equal(inspect(bool), '{ [Boolean: true] foo: \'bar\' }');

    var num = Object(13.37);
    num.foo = 'bar';
    assert.equal(inspect(num), '{ [Number: 13.37] foo: \'bar\' }');

    // test es6 Symbol
    if (typeof Symbol !== 'undefined') {
      assert.equal(inspect(Symbol()), 'Symbol()');
      assert.equal(inspect(Symbol(123)), 'Symbol(123)');
      assert.equal(inspect(Symbol('hi')), 'Symbol(hi)');
      assert.equal(inspect([Symbol()]), '[ Symbol() ]');
      assert.equal(inspect({
        foo: Symbol()
      }), '{ foo: Symbol() }');

      var options = {
        showHidden: true
      };
      subject = {};

      subject[Symbol('symbol')] = 42;

      assert.equal(inspect(subject), '{}');
      assert.equal(inspect(subject, options), '{ [Symbol(symbol)]: 42 }');

      subject = [1, 2, 3];
      subject[Symbol('symbol')] = 42;

      assert.equal(inspect(subject), '[ 1, 2, 3 ]');
      assert.equal(inspect(subject, options),
        '[ 1, 2, 3, [length]: 3, [Symbol(symbol)]: 42 ]');

    }

    // test Set
    assert.equal(inspect(new Set()), 'Set {}');
    assert.equal(inspect(new Set([1, 2, 3])), 'Set { 1, 2, 3 }');
    var set = new Set(['foo']);
    set.bar = 42;
    assert.equal(inspect(set, true), 'Set { \'foo\', [size]: 1, bar: 42 }');

    // test Map
    assert.equal(inspect(new Map()), 'Map {}');
    assert.equal(inspect(new Map([
        [1, 'a'],
        [2, 'b'],
        [3, 'c']
      ])),
      'Map { 1 => \'a\', 2 => \'b\', 3 => \'c\' }');
    var map = new Map([
      ['foo', null]
    ]);
    map.bar = 42;
    assert.equal(inspect(map, true),
      'Map { \'foo\' => null, [size]: 1, bar: 42 }');

    // test Promise
    assert.equal(inspect(Promise.resolve(3)), 'Promise {}');
    assert.equal(inspect(Promise.reject(3)), 'Promise {}');
    assert.equal(inspect(new Promise(function () {})), 'Promise {}');
    var promise = Promise.resolve('foo');
    promise.bar = 42;
    assert.equal(inspect(promise), 'Promise { bar: 42 }');

    // Make sure it doesn't choke on polyfills. Unlike Set/Map, there is no
    // standard interface to synchronously inspect a Promise, so our techniques
    // only work on a bonafide native Promise.
    var oldPromise = Promise;
    global.Promise = function () {
      this.bar = 42;
    };
    assert.equal(inspect(new Promise()), '{ bar: 42 }');
    global.Promise = oldPromise;

    /*
    // Map/Set Iterators
    var m = new Map([
      ['foo', 'bar']
    ]);
    assert.strictEqual(inspect(m.keys()), 'MapIterator { \'foo\' }');
    assert.strictEqual(inspect(m.values()), 'MapIterator { \'bar\' }');
    assert.strictEqual(inspect(m.entries()),
      'MapIterator { [ \'foo\', \'bar\' ] }');
    // make sure the iterator doesn't get consumed
    var keys = m.keys();
    assert.strictEqual(inspect(keys), 'MapIterator { \'foo\' }');
    assert.strictEqual(inspect(keys), 'MapIterator { \'foo\' }');

    var s = new Set([1, 3]);
    assert.strictEqual(inspect(s.keys()), 'SetIterator { 1, 3 }');
    assert.strictEqual(inspect(s.values()), 'SetIterator { 1, 3 }');
    assert.strictEqual(inspect(s.entries()),
      'SetIterator { [ 1, 1 ], [ 3, 3 ] }');
    // make sure the iterator doesn't get consumed
    keys = s.keys();
    assert.strictEqual(inspect(keys), 'SetIterator { 1, 3 }');
    assert.strictEqual(inspect(keys), 'SetIterator { 1, 3 }');
    */

    // Test alignment of items in container
    // Assumes that the first numeric character is the start of an item.

    function checkAlignment(container) {
      var lines = inspect(container).split('\n');
      var pos;
      lines.forEach(function (line) {
        var npos = line.search(/\d/);
        if (npos !== -1) {
          if (pos !== undefined) {
            assert.equal(pos, npos, 'container items not aligned');
          }
          pos = npos;
        }
      });
    }

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
    checkAlignment(new Set(bigArray));
    checkAlignment(new Map(bigArray.map(function (y) {
      return [y, null];
    })));

    // Corner cases.
    x = {
      constructor: 42
    };
    assert.equal(inspect(x), '{ constructor: 42 }');

    x = {};
    Object.defineProperty(x, 'constructor', {
      get: function () {
        throw new Error('should not access constructor');
      },
      enumerable: true
    });
    assert.equal(inspect(x), '{ constructor: [Getter] }');

    x = new function () {};
    assert.equal(inspect(x), '{}');

    x = Object.create(null);
    assert.equal(inspect(x), '{}');
  });
}());
