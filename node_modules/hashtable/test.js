(function() {
  var Hash, QHash, action, h, hash, hkey, key, _i, _ref;
  try {
    _ref = require('hashtable'), Hash = _ref.Hash, QHash = _ref.QHash;
  } catch (e) {
    Hash = window.Hash, QHash = window.QHash;
  }
  hkey = Hash.key;
  hash = new Hash();
  hash[hkey([1, 2, 3, 4])] = "asdf";
  h = new QHash();
  for (_i = 0; _i <= 4; _i++) {
    key = {
      verb: 'get',
      route: '/'
    };
    action = function() {
      return dosomething();
    };
    h.set(key, action);
  }
  console.log(h.getStorage());
}).call(this);
