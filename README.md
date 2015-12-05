# Undo Manager

Simple undo manager to provide undo and redo actions in JavaScript applications.


## Demos

* [Undo Manager with  canvas drawing](http://arthurclemens.github.com/Javascript-Undo-Manager/)
* [JSBin demo, also with canvas](http://jsbin.com/tidibi/edit?js,output)


## Installation

### npm

`npm install undo-manager`

### Bower

`bower install undo-manager`

### jspm

`jspm install npm:undo-manager`


## Background

Actions (typing a character, moving an object) are structured as command pairs: one command for destruction (undo)  and one for creation (redo). Each pair is added to the undo stack:

~~~javascript
var undoManager = new UndoManager();
undoManager.add({
    undo: function() {
        // ...
    },
    redo: function() {
        // ...
    }
});
~~~

Note that you are responsible for the initial creation; Undo Manager only bothers with destruction and recreation.

### Example

~~~javascript
var undoManager = new UndoManager(),
    people = {},
    addPerson,
    removePerson,
    createPerson;        

addPerson = function(id, name) {
    people[id] = name;
};

removePerson = function(id) {
    delete people[id];
};

createPerson = function (id, name) {
    // first creation
    addPerson(id, name);

    // make undo-able
    undoManager.add({
        undo: function() {
            removePerson(id)
        },
        redo: function() {
            addPerson(id, name);
        }
    });
}

createPerson(101, "John");
createPerson(102, "Mary");

console.log("people", people); // {101: "John", 102: "Mary"}

undoManager.undo();
console.log("people", people); // {101: "John"}

undoManager.undo();
console.log("people", people); // {}

undoManager.redo();
console.log("people", people); // {101: "John"}
~~~


## Methods

    undoManager.undo();

Performs the undo action.


    undoManager.redo();

Performs the redo action.


    undoManager.clear();

Clears all stored states.


	undoManager.setLimit(limit);

Set the maximum number of undo steps. Default: 0 (unlimited).


	var hasUndo = undoManager.hasUndo();

Tests if any undo actions exist.


    var hasRedo = undoManager.hasRedo();

Tests if any redo actions exist.


	undoManager.setCallback(myCallback);

Get notified on changes.


    var index = undoManager.getIndex();

Returns the index of the actions list.



## Use with CommonJS (Webpack, Browserify, Node, etc)

`npm install undo-manager`

`var UndoManager = require('undo-manager')`

If you only need a single instance of UndoManager throughout your application, it may be wise to create a module that exports a singleton:

In `undoManager.js`:

~~~javascript
    var UndoManager = require('undo-manager'); // require the lib from node_modules
    var singleton;

    if (!singleton) {
        singleton = new UndoManager();
    }

    module.exports = singleton;
~~~

Then in your app:

~~~javascript
    var undoManager = require('undoManager');

    undoManager.add(...);
    undoManager.undo();
~~~


## Use with RequireJS

If you are using RequireJS, you need to use the ``shim`` config parameter.

Assuming ``require.js`` and ``domReady.js`` are located in ``js/extern``, the ``index.html`` load call would be:

~~~html
<script src="js/extern/require.js" data-main="js/demo"></script>
~~~

And ``demo.js`` would look like this:

~~~javascript
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

    var undoManager,
        circleDrawer,
        btnUndo,
        btnRedo,
        btnClear;

    undoManager = new UndoManager();
    circleDrawer = new CircleDrawer("view", undoManager);

    // etcetera
});
~~~
