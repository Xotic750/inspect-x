<a
  href="https://travis-ci.org/Xotic750/inspect-x"
  title="Travis status">
<img
  src="https://travis-ci.org/Xotic750/inspect-x.svg?branch=master"
  alt="Travis status" height="18">
</a>
<a
  href="https://david-dm.org/Xotic750/inspect-x"
  title="Dependency status">
<img src="https://david-dm.org/Xotic750/inspect-x/status.svg"
  alt="Dependency status" height="18"/>
</a>
<a
  href="https://david-dm.org/Xotic750/inspect-x?type=dev"
  title="devDependency status">
<img src="https://david-dm.org/Xotic750/inspect-x/dev-status.svg"
  alt="devDependency status" height="18"/>
</a>
<a
  href="https://badge.fury.io/js/inspect-x"
  title="npm version">
<img src="https://badge.fury.io/js/inspect-x.svg"
  alt="npm version" height="18">
</a>
<a
  href="https://www.jsdelivr.com/package/npm/inspect-x"
  title="jsDelivr hits">
<img src="https://data.jsdelivr.com/v1/package/npm/inspect-x/badge?style=rounded"
  alt="jsDelivr hits" height="18">
</a>
<a
  href="https://bettercodehub.com/results/Xotic750/inspect-x"
  title="bettercodehub score">
<img src="https://bettercodehub.com/edge/badge/Xotic750/inspect-x?branch=master"
  alt="bettercodehub score" height="18">
</a>

<a name="module_inspect-x"></a>

## inspect-x

An implementation of node's ES6 inspect module.

**See**: https://nodejs.org/api/util.html#util_util_inspect_object_options

<a name="exp_module_inspect-x--module.exports"></a>

### `module.exports` ⇒ <code>string</code> ⏏

Echos the value of a value. Trys to print the value out
in the best way possible given the different types.
Values may supply their own custom `inspect(depth, opts)` functions,
when called they receive the current depth in the recursive inspection,
as well as the options object passed to `inspect`.

**Kind**: Exported member  
**Returns**: <code>string</code> - The string representation.

| Param  | Type                | Description                         |
| ------ | ------------------- | ----------------------------------- |
| obj    | <code>Object</code> | The object to print out.            |
| [opts] | <code>Object</code> | Options object that alters the out. |

**Example**

```js
import inspect from 'inspect-x';

console.log(inspect(inspect, {showHidden: true, depth: null}));
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
