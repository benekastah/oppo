/*!
 * Lo-Dash v0.4.2 <http://lodash.com>
 * Copyright 2012 John-David Dalton <http://allyoucanleet.com/>
 * Based on Underscore.js 1.3.3, copyright 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
 * <http://documentcloud.github.com/underscore>
 * Available under MIT license <http://lodash.com/license>
 */
;(function(window, undefined) {
  
  /**
   * Used to cache the last `_.templateSettings.evaluate` delimiter to avoid
   * unnecessarily assigning `reEvaluateDelimiter` a new generated regexp.
   * Assigned in `_.template`.
   */
  var lastEvaluateDelimiter;

  /**
   * Used to cache the last template `options.variable` to avoid unnecessarily
   * assigning `reDoubleVariable` a new generated regexp. Assigned in `_.template`.
   */
  var lastVariable;

  /**
   * Used to match potentially incorrect data object references, like `obj.obj`,
   * in compiled templates. Assigned in `_.template`.
   */
  var reDoubleVariable;

  /**
   * Used to match "evaluate" delimiters, including internal delimiters,
   * in template text. Assigned in `_.template`.
   */
  var reEvaluateDelimiter;

  /** Detect free variable `exports` */
  var freeExports = typeof exports == 'object' && exports &&
    (typeof global == 'object' && global && global == global.global && (window = global), exports);

  /** Native prototype shortcuts */
  var ArrayProto = Array.prototype,
      ObjectProto = Object.prototype;

  /** Used to generate unique IDs */
  var idCounter = 0;

  /** Used to restore the original `_` reference in `noConflict` */
  var oldDash = window._;

  /** Used to detect delimiter values that should be processed by `tokenizeEvaluate` */
  var reComplexDelimiter = /[-+=!~*%&^<>|{(\/]|\[\D|\b(?:delete|in|instanceof|new|typeof|void)\b/;

  /** Used to match empty string literals in compiled template source */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to insert the data object variable into compiled template source */
  var reInsertVariable = /(?:__e|__t = )\(\s*(?![\d\s"']|this\.)/g;

  /** Used to match tokens in template text */
  var reToken = /__token__(\d+)/g;

  /** Used to match unescaped characters in strings for inclusion in HTML */
  var reUnescapedHtml = /[&<"']/g;

  /** Used to match unescaped characters in compiled string literals */
  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

  /** Used to fix the JScript [[DontEnum]] bug */
  var shadowed = [
    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
    'toLocaleString', 'toString', 'valueOf'
  ];

  /** Used to make template sourceURLs easier to identify */
  var templateCounter = 0;

  /** Used to replace template delimiters */
  var token = '__token__';

  /** Used to store tokenized template text snippets */
  var tokenized = [];

  /** Native method shortcuts */
  var concat = ArrayProto.concat,
      hasOwnProperty = ObjectProto.hasOwnProperty,
      push = ArrayProto.push,
      propertyIsEnumerable = ObjectProto.propertyIsEnumerable,
      slice = ArrayProto.slice,
      toString = ObjectProto.toString;

  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeIsFinite = window.isFinite;

  /** `Object#toString` result shortcuts */
  var arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';

  /** Timer shortcuts */
  var clearTimeout = window.clearTimeout,
      setTimeout = window.setTimeout;

  /**
   * Detect the JScript [[DontEnum]] bug:
   * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
   * made non-enumerable as well.
   */
  var hasDontEnumBug = !propertyIsEnumerable.call({ 'valueOf': 0 }, 'valueOf');

  /** Detect if sourceURL syntax is usable without erroring */
  try {
    // Adobe's and Narwhal's JS engines will error
    var useSourceURL = (Function('//@')(), true);
  } catch(e){ }

  /**
   * Used to escape characters for inclusion in HTML.
   * The `>` and `/` characters don't require escaping in HTML and have no
   * special meaning unless they're part of a tag or an unquoted attribute value
   * http://mathiasbynens.be/notes/ambiguous-ampersands (semi-related fun fact)
   */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '"': '&quot;',
    "'": '&#x27;'
  };

  /** Used to escape characters for inclusion in compiled string literals */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /*--------------------------------------------------------------------------*/

  /**
   * The `lodash` function.
   *
   * @name _
   * @constructor
   * @param {Mixed} value The value to wrap in a `LoDash` instance.
   * @returns {Object} Returns a `LoDash` instance.
   */
  function lodash(value) {
    // allow invoking `lodash` without the `new` operator
    return 
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The template used to create iterator functions.
   *
   * @private
   * @param {Obect} data The data object used to populate the text.
   * @returns {String} Returns the interpolated text.
   */
  var iteratorTemplate = function(obj) {
    
    var __p = 'var index, iteratee = ' +
    obj.firstArg  +
    ', result';
     if (obj.init) {
    __p += ' = ' +
    obj.init ;
     } ;
    __p += ';\n' +
    obj.exit  +
    ';\n' +
    obj.top  +
    ';\n';
     if (obj.arrayBranch) {
    __p += 'var length = iteratee.length; index = -1;  ';
     if (obj.objectBranch) {
    __p += '\nif (length === length >>> 0) {';
     } ;
    
     if (obj.noCharByIndex) {
    __p += '\n  if (toString.call(iteratee) == stringClass) {\n    iteratee = iteratee.split(\'\')\n  }  ';
     } ;
    __p += 
    obj.arrayBranch.beforeLoop  +
    ';\n  while (++index < length) {\n    ' +
    obj.arrayBranch.inLoop  +
    '\n  }  ';
     if (obj.objectBranch) {
    __p += '\n}';
     } ;
    
     } ;
    
     if (obj.objectBranch) {
    
     if (obj.arrayBranch) {
    __p += '\nelse {';
     } ;
    
     if (!obj.hasDontEnumBug) {
    __p += '\n  var skipProto = typeof iteratee == \'function\' && \n    propertyIsEnumerable.call(iteratee, \'prototype\');\n  ';
     } ;
    
     if (obj.isKeysFast && obj.useHas) {
    __p += '\n  var props = nativeKeys(iteratee),\n      propIndex = -1,\n      length = props.length;\n\n  ' +
    obj.objectBranch.beforeLoop  +
    ';\n  while (++propIndex < length) {\n    index = props[propIndex];\n    if (!(skipProto && index == \'prototype\')) {\n      ' +
    obj.objectBranch.inLoop  +
    '\n    }\n  }  ';
     } else {
    __p += 
    obj.objectBranch.beforeLoop  +
    ';\n  for (index in iteratee) {    ';
     if (obj.hasDontEnumBug) {
    
       if (obj.useHas) {
    __p += 'if (hasOwnProperty.call(iteratee, index)) {\n  ';
     } ;
    __p += 
    obj.objectBranch.inLoop  +
    ';\n    ';
       if (obj.useHas) {
    __p += '}';
     } ;
    
     } else {
    __p += '\n    if (!(skipProto && index == \'prototype\')';
     if (obj.useHas) {
    __p += ' &&\n        hasOwnProperty.call(iteratee, index)';
     } ;
    __p += ') {\n      ' +
    obj.objectBranch.inLoop  +
    '\n    }    ';
     } ;
    __p += '\n  }  ';
     } ;
    
     if (obj.hasDontEnumBug) {
    __p += '\n\n  var ctor = iteratee.constructor;\n    ';
     for (var k = 0; k < 7; k++) {
    __p += '\n  index = \'' +
    obj.shadowed[k]  +
    '\';\n  if (';
          if (obj.shadowed[k] == 'constructor') {
    __p += '!(ctor && ctor.prototype === iteratee) && ';
          } ;
    __p += 'hasOwnProperty.call(iteratee, index)) {\n    ' +
    obj.objectBranch.inLoop  +
    '\n  }    ';
     } ;
    
     } ;
    
     if (obj.arrayBranch) {
    __p += '\n}';
     } ;
    
     } ;
    __p += 
    obj.bottom  +
    ';\nreturn result';
    
    
    return __p
  };

  /**
   * Reusable iterator options shared by
   * `every`, `filter`, `find`, `forEach`, `forIn`, `forOwn`, `groupBy`, `map`,
   * `reject`, `some`, and `sortBy`.
   */
  var baseIteratorOptions = {
    'args': 'collection, callback, thisArg',
    'init': 'collection',
    'top':
      'if (!callback) {\n' +
      '  callback = identity\n' +
      '}\n' +
      'else if (thisArg) callback = iteratorBind(callback, thisArg)',
    'inLoop': 'callback(iteratee[index], index, collection)'
  };

  /** Reusable iterator options for `every` and `some` */
  var everyIteratorOptions = {
    'init': 'true',
    'inLoop': 'if (!callback(iteratee[index], index, collection)) return !result'
  };

  /** Reusable iterator options for `defaults` and `extend` */
  var extendIteratorOptions = {
    'useHas': false,
    'args': 'object',
    'init': 'object',
    'top':
      'for (var iterateeIndex = 1, length = arguments.length; iterateeIndex < length; iterateeIndex++) {\n' +
      '  iteratee = arguments[iterateeIndex];\n' +
      (hasDontEnumBug ? '  if (iteratee) {' : ''),
    'inLoop': 'result[index] = iteratee[index]',
    'bottom': (hasDontEnumBug ? '  }\n' : '') + '}'
  };

  /** Reusable iterator options for `filter` and `reject` */
  var filterIteratorOptions = {
    'init': '[]',
    'inLoop': 'callback(iteratee[index], index, collection) && result.push(iteratee[index])'
  };

  /** Reusable iterator options for `find`, `forEach`, `forIn`, and `forOwn` */
  var forEachIteratorOptions = {
    'top': 'if (thisArg) callback = iteratorBind(callback, thisArg)'
  };

  /** Reusable iterator options for `forIn` and `forOwn` */
  var forOwnIteratorOptions = {
    'inLoop': {
      'object': baseIteratorOptions.inLoop
    }
  };

  /** Reusable iterator options for `invoke`, `map`, `pluck`, and `sortBy` */
  var mapIteratorOptions = {
    'init': '',
    'exit': 'if (!collection) return []',
    'beforeLoop': {
      'array':  'result = Array(length)',
      'object': 'result = []'
    },
    'inLoop': {
      'array':  'result[index] = callback(iteratee[index], index, collection)',
      'object': 'result.push(callback(iteratee[index], index, collection))'
    }
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a new function optimized for searching large arrays for a given `value`,
   * starting at `fromIndex`, using strict equality for comparisons, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Mixed} value The value to search for.
   * @param {Number} [fromIndex=0] The index to start searching from.
   * @param {Number} [largeSize=30] The length at which an array is considered large.
   * @returns {Boolean} Returns `true` if `value` is found, else `false`.
   */
  function cachedContains(array, fromIndex, largeSize) {
    fromIndex || (fromIndex = 0);

    var length = array.length,
        isLarge = (length - fromIndex) >= (largeSize || 30),
        cache = isLarge ? {} : array;

    if (isLarge) {
      // init value cache
      var key,
          index = fromIndex - 1;

      while (++index < length) {
        // manually coerce `value` to string because `hasOwnProperty`, in some
        // older versions of Firefox, coerces objects incorrectly
        key = array[index] + '';
        (hasOwnProperty.call(cache, key) ? cache[key] : (cache[key] = [])).push(array[index]);
      }
    }
    return function(value) {
      if (isLarge) {
        var key = value + '';
        return hasOwnProperty.call(cache, key) && indexOf(cache[key], value) > -1;
      }
      return indexOf(cache, value, fromIndex) > -1;
    }
  }

  /**
   * Used by `template` to replace tokens with their corresponding code snippets.
   *
   * @private
   * @param {String} match The matched token.
   * @param {String} index The `tokenized` index of the code snippet.
   * @returns {String} Returns the code snippet.
   */
  function detokenize(match, index) {
    return tokenized[index];
  }

  /**
   * Used by `template` to escape characters for inclusion in compiled
   * string literals.
   *
   * @private
   * @param {String} match The matched character to escape.
   * @returns {String} Returns the escaped character.
   */
  function escapeStringChar(match) {
    return '\\' + stringEscapes[match];
  }

  /**
   * Used by `escape` to escape characters for inclusion in HTML.
   *
   * @private
   * @param {String} match The matched character to escape.
   * @returns {String} Returns the escaped character.
   */
  function escapeHtmlChar(match) {
    return htmlEscapes[match];
  }

  /**
   * Creates a new function that, when called, invokes `func` with the `this`
   * binding of `thisArg` and the arguments (value, index, object).
   *
   * @private
   * @param {Function} func The function to bind.
   * @param {Mixed} [thisArg] The `this` binding of `func`.
   * @returns {Function} Returns the new bound function.
   */
  function iteratorBind(func, thisArg) {
    return function(value, index, object) {
      return func.call(thisArg, value, index, object);
    };
  }

  /**
   * A no-operation function.
   *
   * @private
   */
  function noop() {
    // no operation performed
  }

  /**
   * Used by `template` to replace "escape" template delimiters with tokens.
   *
   * @private
   * @param {String} match The matched template delimiter.
   * @param {String} value The delimiter value.
   * @returns {String} Returns a token.
   */
  function tokenizeEscape(match, value) {
    if (reComplexDelimiter.test(value)) {
      return '<e%-' + value + '%>';
    }
    var index = tokenized.length;
    tokenized[index] = "' +\n__e(" + value + ") +\n'";
    return token + index;
  }

  /**
   * Used by `template` to replace "evaluate" template delimiters, or complex
   * "escape" and "interpolate" delimiters, with tokens.
   *
   * @private
   * @param {String} match The matched template delimiter.
   * @param {String} value The delimiter value.
   * @param {String} escapeValue The "escape" delimiter value.
   * @param {String} interpolateValue The "interpolate" delimiter value.
   * @returns {String} Returns a token.
   */
  function tokenizeEvaluate(match, value, escapeValue, interpolateValue) {
    var index = tokenized.length;
    if (value) {
      tokenized[index] = "';\n" + value + ";\n__p += '"
    } else if (escapeValue) {
      tokenized[index] = "' +\n__e(" + escapeValue + ") +\n'";
    } else if (interpolateValue) {
      tokenized[index] = "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
    }
    return token + index;
  }

  /**
   * Used by `template` to replace "interpolate" template delimiters with tokens.
   *
   * @private
   * @param {String} match The matched template delimiter.
   * @param {String} value The delimiter value.
   * @returns {String} Returns a token.
   */
  function tokenizeInterpolate(match, value) {
    if (reComplexDelimiter.test(value)) {
      return '<e%=' + value + '%>';
    }
    var index = tokenized.length;
    tokenized[index] = "' +\n((__t = (" + value + ")) == null ? '' : __t) +\n'";
    return token + index;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Performs a deep comparison between two values to determine if they are
   * equivalent to each other.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} a The value to compare.
   * @param {Mixed} b The other value to compare.
   * @param {Array} [stack] Internally used to keep track of "seen" objects to
   *  avoid circular references.
   * @returns {Boolean} Returns `true` if the values are equvalent, else `false`.
   * @example
   *
   * var moe = { 'name': 'moe', 'luckyNumbers': [13, 27, 34] };
   * var clone = { 'name': 'moe', 'luckyNumbers': [13, 27, 34] };
   *
   * moe == clone;
   * // => false
   *
   * _.isEqual(moe, clone);
   * // => true
   */
  function isEqual(a, b, stack) {
    stack || (stack = []);

    // exit early for identical values
    if (a === b) {
      // treat `+0` vs. `-0` as not equal
      return a !== 0 || (1 / a == 1 / b);
    }
    // a strict comparison is necessary because `undefined == null`
    if (a == null || b == null) {
      return a === b;
    }
    // unwrap any wrapped objects
    if (a._chain) {
      a = a._wrapped;
    }
    if (b._chain) {
      b = b._wrapped;
    }
    // invoke a custom `isEqual` method if one is provided
    if (a.isEqual && toString.call(a.isEqual) == funcClass) {
      return a.isEqual(b);
    }
    if (b.isEqual && toString.call(b.isEqual) == funcClass) {
      return b.isEqual(a);
    }
    // compare [[Class]] names
    var className = toString.call(a);
    if (className != toString.call(b)) {
      return false;
    }
    switch (className) {
      // strings, numbers, dates, and booleans are compared by value
      case stringClass:
        // primitives and their corresponding object instances are equivalent;
        // thus, `'5'` is quivalent to `new String('5')`
        return a == String(b);

      case numberClass:
        // treat `NaN` vs. `NaN` as equal
        return a != +a
          ? b != +b
          // but treat `+0` vs. `-0` as not equal
          : (a == 0 ? (1 / a == 1 / b) : a == +b);

      case boolClass:
      case dateClass:
        // coerce dates and booleans to numeric values, dates to milliseconds and
        // booleans to 1 or 0; treat invalid dates coerced to `NaN` as not equal
        return +a == +b;

      // regexps are compared by their source and flags
      case regexpClass:
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') {
      return false;
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) {
        return true;
      }
    }

    var index = -1,
        result = true,
        size = 0;

    // add the first collection to the stack of traversed objects
    stack.push(a);

    // recursively compare objects and arrays
    if (className == arrayClass) {
      // compare array lengths to determine if a deep comparison is necessary
      size = a.length;
      result = size == b.length;

      if (result) {
        // deep compare the contents, ignoring non-numeric properties
        while (size--) {
          if (!(result = isEqual(a[size], b[size], stack))) {
            break;
          }
        }
      }
    }
    else {
      // objects with different constructors are not equivalent
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) {
        return false;
      }
      // deep compare objects.
      for (var prop in a) {
        if (hasOwnProperty.call(a, prop)) {
          // count the number of properties.
          size++;
          // deep compare each property value.
          if (!(result = hasOwnProperty.call(b, prop) && isEqual(a[prop], b[prop], stack))) {
            break;
          }
        }
      }
      // ensure both objects have the same number of properties
      if (result) {
        for (prop in b) {
          // Adobe's JS engine, embedded in applications like InDesign, has a
          // bug that causes `!size--` to throw an error so it must be wrapped
          // in parentheses.
          // https://github.com/documentcloud/underscore/issues/355
          if (hasOwnProperty.call(b, prop) && !(size--)) {
            break;
          }
        }
        result = !size;
      }
      // handle JScript [[DontEnum]] bug
      if (result && hasDontEnumBug) {
        while (++index < 7) {
          prop = shadowed[index];
          if (hasOwnProperty.call(a, prop)) {
            if (!(result = hasOwnProperty.call(b, prop) && isEqual(a[prop], b[prop], stack))) {
              break;
            }
          }
        }
      }
    }
    // remove the first collection from the stack of traversed objects
    stack.pop();
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Enables method chaining on the wrapper object.
   *
   * @name chain
   * @deprecated
   * @memberOf _
   * @category Chaining
   * @returns {Mixed} Returns the wrapper object.
   * @example
   *
   * _([1, 2, 3]).value();
   * // => [1, 2, 3]
   */
  function wrapperChain() {
    this._chain = true;
    return this;
  }

  /**
   * Extracts the wrapped value.
   *
   * @name value
   * @memberOf _
   * @category Chaining
   * @returns {Mixed} Returns the wrapped value.
   * @example
   *
   * _([1, 2, 3]).value();
   * // => [1, 2, 3]
   */
  function wrapperValue() {
    return this._wrapped;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type String
   */
  lodash.VERSION = '0.4.2';
  lodash.isEqual = isEqual;

  /*--------------------------------------------------------------------------*/

  // expose Lo-Dash
  // some AMD build optimizers, like r.js, check for specific condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lo-Dash to the global object even when an AMD loader is present in
    // case Lo-Dash was injected by a third-party script and not intended to be
    // loaded as a module. The global assignment can be reverted in the Lo-Dash
    // module via its `noConflict()` method.
    window._ = lodash;

    // define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module
    define(function() {
      return lodash;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports) {
    // in Node.js or RingoJS v0.8.0+
    if (typeof module == 'object' && module && module.exports == freeExports) {
      (module.exports = lodash)._ = lodash;
    }
    // in Narwhal or RingoJS v0.7.0-
    else {
      freeExports._ = lodash;
    }
  }
  else {
    // in a browser or Rhino
    window._ = lodash;
  }
}(this));
