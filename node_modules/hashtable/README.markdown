# JS HashTable

An easy way to use anything you need/want as a key to a hash.

Install:

```
$ npm install hashtable
```

## API

There are two classes for your hashtable pleasure:

### QHash

`QHash` stands for "quick hash". It's primary advantage is that it is light and fast. `QHash` will
not check to see if two keys are similar enough to be declared equal (for the most part). Therefore,
if you pass in an object as a key, only that object will be able to retrieve the value. In this way,
QHash offers more security than `HashTable`.

```javascript
var bob, hash, apiKey;
bob = new Person('Bob');
apiKey = new SomeLongUniqueThing();

apiKeys = new QHash();
apiKeys.set(bob, apiKey); // -> apiKey

apiKeys.get(bob); // -> apiKey

apiKeys.set(bob, null); // -> null
apiKeys.remove(bob); // -> null
apiKeys.get(bob); // -> undefined
```

### HashTable

**Alias**: `Hash`

This hash will convert all keys passed in to a string. Objects with the same properties in different
orders will generate the same strings. Therefore, the object does not have to be exactly the same
in order to retrieve the value, but instead must share all the same information. Inherited values will
not be accounted for.

Like `QHash`, `HashTable` supports the `get`, `set` and `remove` functions, but we now have a little
extra.

```javascript
var routes, hkey = Hash.key;

routes = new Hash();
// Define a route in your routes hash
routes.set(/^\/user\/all(\.json)?$/, UsersController.displayAll);
// Two ways to do the same thing
routes[hkey( /^\/user\/(\d*)$/ )] = UsersController.displayById;
```