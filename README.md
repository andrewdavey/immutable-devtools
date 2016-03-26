# Chrome Dev Tools for Immutable-js

The [Immutable](http://facebook.github.io/immutable-js/) library is fantastic, but inspecting immutable collections in Chrome's Dev Tools is awkward. You only see the internal data structure, not the logical contents. For example, when inspecting the contents of an Immutable List, you'd really like to see the items in the list.

Chrome (v47+) has support for custom "formatters". A formatter tells Chrome's Dev Tools how to display values in the Console, Scope list, etc. This means we can display Lists, Maps and other collections, in a much better way.

Essentially, it turns this:

![Before](before.png)

into:

![After](after.png)

This library provides a formatter to do just that.

## Installation

Chrome v47+

In Dev Tools, press F1 to load the Settings. Scroll down to the Console section and tick "Enable custom formatters".

Then, in your project, install via npm:

```
npm install --save-dev immutable-devtools
```

And enable with:

```js
var Immutable = require("immutable");

var installDevTools = require("immutable-devtools");
installDevTools(Immutable);
```

Note: You probably only want this library for debug builds, so perhaps wrap with `if (DEBUG) {...}` or similar.

## Using with webpack

You could use `webpack.DefinePlugin` to create a condition that will be allowed to install `immutable-devtools` in the debug build but unreachable in the production build:

```javascript
// webpack.config.js
var webpack = require('webpack');
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production')
    })
  ],
};
```

In your source you'd have something like this...

```javascript
// index.js
var immutable = require('immutable');
if (__DEV__) {
  var installDevTools = require('immutable-devtools');
  installDevTools(immutable);
}
```

And then by adding the `-p` shortcut to webpack for production mode which enables dead code elimination, the condition that requires immutable-devtools will be removed.

```
NODE_ENV=production webpack -p index.js
```

See [#16](https://github.com/andrewdavey/immutable-devtools/issues/16) for more info.

## Features

The library currently has formatters for: List, Map, Set, Record, OrderedMap & OrderedSet.

