# Undo Manager

Simple undo manager to provide undo and redo actions in JavaScript applications.


- [Demos](#demos)
- [Installation](#installation)
- [Example](#example)
- [Updating the UI](#updating-the-ui)
- [Methods](#methods)
  - [add](#add)
  - [undo](#undo)
  - [redo](#redo)
  - [clear](#clear)
  - [setLimit](#setlimit)
  - [hasUndo](#hasundo)
  - [hasRedo](#hasredo)
  - [setCallback](#setcallback)
  - [getIndex](#getindex)
  - [getCommands](#getcommands)
- [Use with CommonJS](#use-with-commonjs)
- [Use with RequireJS](#use-with-requirejs)


## Demos

* [CodeSandbox with RGB color slider](https://codesandbox.io/s/undo-manager-color-sliders-z4myoj)
* [Undo Manager with canvas drawing](https://arthurclemens.github.io/JavaScript-Undo-Manager/)
* [JSBin demo, also with canvas](http://jsbin.com/tidibi/edit?js,output)


## Installation

```
npm install undo-manager
```


## Example

Actions (typing a character, moving an object) are structured as command pairs: one command for destruction (undo) and one for creation (redo). Each pair is added to the undo stack:

```js
const undoManager = new UndoManager();
undoManager.add({
  undo: function() {
    // ...
  },
  redo: function() {
    // ...
  }
});
```

To make an action undoable, you'd add an undo/redo command pair to the undo manager:

```js
const undoManager = new UndoManager();
const people = {}; 

function addPerson(id, name) {
  people[id] = name;
};

function removePerson(id) {
  delete people[id];
};

function createPerson(id, name) {
  // first creation
  addPerson(id, name);

  // make undoable
  undoManager.add({
    undo: () => removePerson(id),
    redo: () => addPerson(id, name)
  });
}

createPerson(101, "John");
createPerson(102, "Mary");

console.log(people); // logs: {101: "John", 102: "Mary"}

undoManager.undo();
console.log(people); // logs: {101: "John"}

undoManager.undo();
console.log(people); // logs: {}

undoManager.redo();
console.log(people); // logs: {101: "John"}
```

## Updating the UI

TL;DR UI that relies on undo manager state - for example `hasUndo` and `hasRedo` - needs to be updated using the callback function provided with `setCallback`. This ensures that all internal state has been resolved before the UI is repainted.

Let's say we have an update function that conditionally disables the undo and redo buttons:

```js
function updateUI() {
  btn_undo.disabled = !undoManager.hasUndo();
  btn_redo.disabled = !undoManager.hasRedo();
}
```

You might be inclined to call the update in the undo/redo command pair:

```js
// wrong approach, don't copy
const undoManager = new UndoManager();
const states = [];

function updateState(newState) {
  states.push(newState);
  updateUI();

  undoManager.add({
    undo: function () {
      states.pop();
      updateUI(); // <= this will lead to inconsistent UI state
    },
    redo: function () {
      states.push(newState);
      updateUI(); // <= this will lead to inconsistent UI state
    }
  });
}
```

Instead, pass the update function to `setCallback`:

```js
// recommended approach
const undoManager = new UndoManager();
undoManager.setCallback(updateUI);

const states = [];

function updateState(newState) {
  states.push(newState);
  updateUI();

  undoManager.add({
    undo: function () {
      states.pop();
    },
    redo: function () {
      states.push(newState);
    }
  });
}
```

## Methods

### add

Adds an undo/redo command pair to the stack.

```js
function createPerson(id, name) {
  // first creation
  addPerson(id, name);

  // make undoable
  undoManager.add({
    undo: () => removePerson(id),
    redo: () => addPerson(id, name)
  });
}
```

Optionally add a `groupId` to identify related command pairs. Undo and redo actions will then be performed on all adjacent command pairs with that group id.

```js
undoManager.add({
  groupId: 'auth',
  undo: () => removePerson(id),
  redo: () => addPerson(id, name)
});
```


### undo

Performs the undo action.

```js
undoManager.undo();
```

If a `groupId` was set, the undo action will be performed on all adjacent command pairs with that group id.

### redo

Performs the redo action.

```js
undoManager.redo();
```

If a `groupId` was set, the redo action will be performed on all adjacent command pairs with that group id.

### clear

Clears all stored states.

```js
undoManager.clear();
```

### setLimit

Set the maximum number of undo steps. Default: 0 (unlimited).

```js
undoManager.setLimit(limit);
```

### hasUndo

Tests if any undo actions exist.

```js
const hasUndo = undoManager.hasUndo();
```

### hasRedo

Tests if any redo actions exist.

```js
const hasRedo = undoManager.hasRedo();
```

### setCallback

Get notified on changes. Pass a function to be called on undo and redo actions.

```js
undoManager.setCallback(myCallback);
```

### getIndex

Returns the index of the actions list.

```js
const index = undoManager.getIndex();
```

### getCommands

Returns the list of queued commands, optionally filtered by group id.

```js
const commands = undoManager.getCommands();
const commands = undoManager.getCommands(groupId);
```

## Use with CommonJS

```bash
npm install undo-manager
```

```js
const UndoManager = require('undo-manager')
```

If you only need a single instance of UndoManager throughout your application, it may be wise to create a module that exports a singleton:

```js
// undoManager.js
const undoManager = require('undo-manager'); // require the lib from node_modules
let singleton = undefined;

if (!singleton) {
  singleton = new undoManager();
}

module.exports = singleton;
```

Then in your app:

```js
// app.js
const undoManager = require('undoManager');

undoManager.add(...);
undoManager.undo();
```


## Use with RequireJS

If you are using RequireJS, you need to use the `shim` config parameter.

Assuming `require.js` and `domReady.js` are located in `js/extern`, the `index.html` load call would be:

```html
<script src="js/extern/require.js" data-main="js/demo"></script>
```

And `demo.js` would look like this:

```js
requirejs.config({
  baseUrl: "js",
  paths: {
    domReady: "extern/domReady",
    app: "../demo",
    undomanager: "../../js/undomanager",
    circledrawer: "circledrawer"
  },
  shim: {
    "undomanager": {
      exports: "UndoManager"
    },
    "circledrawer": {
      exports: "CircleDrawer"
    }
  }
});

require(["domReady", "undomanager", "circledrawer"], function(domReady, UndoManager, CircleDrawer) {
  "use strict";

  let undoManager,
    circleDrawer,
    btnUndo,
    btnRedo,
    btnClear;

  undoManager = new UndoManager();
  circleDrawer = new CircleDrawer("view", undoManager);

  // etcetera
});
```
