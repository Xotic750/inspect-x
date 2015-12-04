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

Return a string representation of object, which is useful for debugging.
An optional options object may be passed that alters certain aspects of the
formatted string:
- showHidden - if true then the object's non-enumerable and symbol properties
will be shown too. Defaults to false.
- depth - tells inspect how many times to recurse while formatting the
object. This is useful for inspecting large complicated objects. Defaults to 2. To make it recurse indefinitely pass null.
- colors - if true, then the output will be styled with ANSI color codes.
Defaults to false. Colors are customizable, see below.
- customInspect - if false, then custom inspect(depth, opts) functions
defined on the objects being inspected won't be called. Defaults to true.

**See**: https://nodejs.org/api/util.html#util_util_inspect_object_options  
**Version**: 0.0.1  
**Author:** Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_inspect-x--module.exports"></a>
### `module.exports` ⇒ <code>string</code> ⏏
Echos the value of a value. Trys to print the value out
in the best way possible given the different types.

**Kind**: Exported member  
**Returns**: <code>string</code> - The string representation.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object to print out. |
| [opts] | <code>Object</code> | Options object that alters the output. |

