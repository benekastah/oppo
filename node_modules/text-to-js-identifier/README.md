# Text to JS Identifier

Turn arbitrary text into a valid javascript identifier.

I found this code useful as I have been experimenting with building languages that compile into javascript in my spare time. Often I prefer to use identifiers that allow more characters that javascript does.

## Use

### npm

If you are using node.js, install with npm:

```
$ npm install text-to-js-identifier
```

then use it in your file like so:

```
var to_js_identifier = require("text-to-js-identifier");
to_js_identifier("hey!"); // -> "hey_$exclamationmark_"
```

### ender

If you are using [ender](http://ender.no.de/), then add it to your library:

```
$ ender add text-to-js-identifier
```

and use it like this:

```
$.to_js_identifier("bool?"); // -> "bool_$questionmark_"
```

### other

If you aren't using node or ender, then the function can be found in your global scope after you have downloaded and included your file:

```
to_js_identifier("pretty easy"); // -> "pretty_$space_easy"
```

## Technical Details

If your text happens to be a javascript keyword, then the keyword will be wrapped in `_$` and `_` (in fact, all replaced values are wrapped this way):

```
in            -> _$in_
throw         -> _$throw_
function      -> _$function_
```

If your text contains an invalid character, it will in most cases be replaced by a human-readable and javascript-compatable representation of that character:

```
-             -> _$dash_
.             -> _$period_
~             -> _$tilde_
```

If we don't have a handy human-readable representation on hand, we just display the ASCII character code:

```
0             -> _$ASCII_48_
†             -> _$ASCII_8224_
ƒ             -> _$ASCII_402_
```

If the text contains a part that is wrapped in `_$` and `_` (in other words, if it looks like a generated identifier), we will escape that with another set of wrappings. This is so that it is not possible to have two bits of different text generate the same identifier:

```
_$hey_        -> _$_$hey__
_$in_         -> _$_$in__
_$ASCII_402_  -> _$_$ASCII_402__
```

All text that is already valid will simply pass through unchanged:

```
hey           -> hey
?wassup       -> _$questionmark_wassup
etc.          -> etc_$period_
hey,you       -> hey_$comma_you
```

As you can see, replacement values can go anywhere. Any ASCII-compatable string should generate a valid javascript identifier.