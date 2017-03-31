<a name="module_inspect-x"></a>

## inspect-x
<a href="https://travis-ci.org/Xotic750/inspect-x"
title="Travis status">
<img src="https://travis-ci.org/Xotic750/inspect-x.svg?branch=master"
alt="Travis status" height="18">
</a>
<a href="https://david-dm.org/Xotic750/inspect-x"
title="Dependency status">
<img src="https://david-dm.org/Xotic750/inspect-x.svg"
alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/inspect-x#info=devDependencies"
title="devDependency status">
<img src="https://david-dm.org/Xotic750/inspect-x/dev-status.svg"
alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/inspect-x" title="npm version">
<img src="https://badge.fury.io/js/inspect-x.svg"
alt="npm version" height="18">
</a>

An implementation of node's inspect module.

**See**: https://nodejs.org/api/util.html#util_util_inspect_object_options  
**Version**: 1.2.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
**Example**  
```js
var util = require('inspect-x');

var obj = { name: 'nate' };
obj.inspect = function(depth) {
  return '{' + this.name + '}';
};

inspect(obj);
  // "{nate}"

var obj = { foo: 'this will not show up in the inspect() out' };
obj.inspect = function(depth) {
  return { bar: 'baz' };
};

inspect(obj);
  // "{ bar: 'baz' }"
```
<a name="exp_module_inspect-x--module.exports"></a>

### `module.exports` ⇒ <code>string</code> ⏏
Echos the value of a value. Trys to print the value out
in the best way possible given the different types.
Values may supply their own custom `inspect(depth, opts)` functions,
when called they receive the current depth in the recursive inspection,
as well as the options object passed to `inspect`.

**Kind**: Exported member  
**Returns**: <code>string</code> - The string representation.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object to print out. |
| [opts] | <code>Object</code> | Options object that alters the out. |

**Example**  
```js
var inspect = require('inspect-x');

console.log(inspect(inspect, { showHidden: true, depth: null }));
//{ [Function: inspect]
//  [length]: 2,
//  [name]: 'inspect',
//  [prototype]: inspect { [constructor]: [Circular] },
//  [colors]:
//   { [bold]: [ 1, 22, [length]: 2 ],
//     [italic]: [ 3, 23, [length]: 2 ],
//     [underline]: [ 4, 24, [length]: 2 ],
//     [inverse]: [ 7, 27, [length]: 2 ],
//     [white]: [ 37, 39, [length]: 2 ],
//     [grey]: [ 90, 39, [length]: 2 ],
//     [black]: [ 30, 39, [length]: 2 ],
//     [blue]: [ 34, 39, [length]: 2 ],
//     [cyan]: [ 36, 39, [length]: 2 ],
//     [green]: [ 32, 39, [length]: 2 ],
//     [magenta]: [ 35, 39, [length]: 2 ],
//     [red]: [ 31, 39, [length]: 2 ],
//     [yellow]: [ 33, 39, [length]: 2 ] },
//  [styles]:
//   { [special]: 'cyan',
//     [number]: 'yellow',
//     [boolean]: 'yellow',
//     [undefined]: 'grey',
//     [null]: 'bold',
//     [string]: 'green',
//     [symbol]: 'green',
//     [date]: 'magenta',
//     [regexp]: 'red' } }
```
