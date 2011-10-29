(function() {
  var egal, fileScope, getArray;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  getArray = function(item) {
    if (item instanceof Array) {
      return item;
    } else if (item != null) {
      return [item];
    } else {
      return [];
    }
  };
  egal = function(a, b) {
    if (a === b) {
      return a !== 0 || 1 / a === 1 / b;
    } else {
      return a !== a && b !== b;
    }
  };
  fileScope = this;
  this.QHash = (function() {
    function QHash(entries) {
      var argslen, entry, key, value, _i, _len;
      if (entries == null) {
        entries = [];
      }
      this.storage = new QHash.Storage();
      argslen = arguments.length;
      if (entries instanceof Array && argslen === 1) {
        for (_i = 0, _len = entries.length; _i < _len; _i++) {
          entry = entries[_i];
          this.set.apply(this, entry);
        }
      } else if (argslen === 1) {
        for (key in entries) {
          if (!__hasProp.call(entries, key)) continue;
          value = entries[key];
          this.set(key, value);
        }
      } else if (argslen === 2) {
        this.set.apply(this, arguments);
      }
    }
    QHash.prototype.set = function(key, value) {
      var index;
      if ((index = this.storage.indexOf(key)) >= 0) {
        this.storage[index][1] = value;
      } else {
        this.storage.push([key, value]);
      }
      return value;
    };
    QHash.prototype.get = function(key) {
      return this.storage.valueAt(this.storage.indexOf(key));
    };
    QHash.prototype.remove = function(key) {
      var index, ret;
      index = this.storage.indexOf(key);
      if (index >= 0) {
        ret = this.storage.valueAt(index);
        this.storage = (this.storage.slice(0, index)).concat(this.storage.slice(index + 1));
      } else {
        ret = false;
      }
      return ret;
    };
    QHash.prototype.forEach = function(callback) {
      var item, _i, _len, _ref, _results;
      _ref = this.storage;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(callback.apply(null, item));
      }
      return _results;
    };
    QHash.prototype.getStorage = function() {
      return this.storage;
    };
    Object.defineProperty(QHash.prototype, 'length', {
      get: function() {
        return this.storage.length;
      }
    });
    QHash.Storage = (function() {
      __extends(Storage, Array);
      function Storage(arr) {
        var item, _i, _len, _ref;
        if (arr instanceof Array) {
          for (_i = 0, _len = arr.length; _i < _len; _i++) {
            item = arr[_i];
            if (item instanceof Array && (0 < (_ref = item.length) && _ref < 3)) {
              this.push[item];
            }
          }
        }
      }
      Storage.prototype.indexOf = function(key) {
        var index, item, item_key, _len;
        for (index = 0, _len = this.length; index < _len; index++) {
          item = this[index];
          item_key = getArray(item)[0];
          if (egal(key, item_key)) {
            return index;
          }
        }
        return -1;
      };
      Storage.prototype.valueAt = function(index) {
        var key, value, _ref;
        _ref = getArray(this[index]), key = _ref[0], value = _ref[1];
        return value;
      };
      Storage.prototype.keyAt = function(index) {
        var key;
        key = getArray(this[index])[0];
        return key;
      };
      Storage.prototype.sort = function() {
        var arr, entry;
        arr = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = this.length; _i < _len; _i++) {
            entry = this[_i];
            _results.push(entry);
          }
          return _results;
        }).call(this);
        return arr.sort();
      };
      return Storage;
    })();
    return QHash;
  })();
  this.Hash = this.HashTable = (function() {
    function HashTable(entries) {
      var entry, key, value, _i, _len;
      if (entries == null) {
        entries = [];
      }
      if (entries instanceof Array) {
        for (_i = 0, _len = entries.length; _i < _len; _i++) {
          entry = entries[_i];
          this.set.apply(this, entry);
        }
      } else if (entries instanceof Object) {
        for (key in entries) {
          if (!__hasProp.call(entries, key)) continue;
          value = entries[key];
          this.set(key, value);
        }
      } else if (arguments.length) {
        this.set.apply(this, arguments);
      }
    }
    HashTable.prototype.set = function(obj, value) {
      return this[HashTable.key(obj)] = value;
    };
    HashTable.prototype.get = function(obj) {
      return this[HashTable.key(obj)];
    };
    HashTable.prototype.remove = function(obj) {
      var ret;
      ret = get(obj);
      delete this[HashTable.key(obj)];
      if (ret != null) {
        return ret;
      } else {
        return false;
      }
    };
    HashTable.sortedObjectClone = function(obj) {
      var arr, clone, fn, key, num, re, val, value;
      if (obj instanceof RegExp) {
        re = obj;
        obj = {
          "object-type": "RegExp",
          "object-value": re.toString()
        };
      } else if (typeof obj === "function") {
        fn = obj;
        obj = {
          "object-type": "Function",
          "object-value": fn.toString()
        };
      } else if (obj instanceof Array) {
        arr = obj;
        obj = {};
        for (key in arr) {
          if (!__hasProp.call(arr, key)) continue;
          value = arr[key];
          obj[key] = value;
        }
      } else if (typeof obj === "number") {
        num = obj;
        if (val === 0 && 1 / val === -Infinity) {
          num = "-0";
        }
        obj = {
          "object-type": "number",
          "object-value": num.toString()
        };
      } else if (!(obj instanceof Object)) {
        val = obj;
        obj = {
          "object-type": typeof val,
          "object-value": val.toString()
        };
      }
      clone = new fileScope.QHash(obj);
      clone.forEach(__bind(function(key, value) {
        if (value instanceof Object) {
          return clone.set(key, this.sortedObjectClone(value));
        }
      }, this));
      clone = clone.getStorage();
      return clone.sort();
    };
    HashTable.stringify = function(obj) {
      var clone;
      clone = this.sortedObjectClone(obj);
      return JSON.stringify(clone);
    };
    HashTable.key = HashTable.stringify.bind(HashTable);
    return HashTable;
  })();
}).call(this);
