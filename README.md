# JavaScript Undo Manager

Simple undo manager to provide undo and redo actions in your JavaScript application.


## Documentation

Each action the user does (typing a character, moving an object) must be undone AND recreated. We combine this destruction and recreation as one "command" and put it on the undo stack:

    var undoManager = new UndoManager();
    undoManager.add({
        undo: function() {
            // ...
        },
        redo: function() {
            // ...
        }
    });

Note that you (or the user) still need to do the initial creation yourself. Undo Manager only bother with destruction and recreation.

When undo is called, the top-most item is retrieved from the stack, and its undo callback function is called.

    undoManager.undo();

This moved the current index one down. We can now use redo to call the (now) next item to reverse the action:

    undoManager.redo();

To lose all stored states:

    undoManager.clear();

Test if any undo actions are available:

	var hasUndo = undoManager.hasUndo();
	
Test if any redo actions are available:

    var hasRedo = undoManager.hasRedo();

To get notified on changes:

	undoManager.setCallback(myCallback);
	

## Example

    var undoManager = new UndoManager(),
        people = {};

    addPerson = function(id, name) {
        people[id] = name;
    };

    removePerson = function(id) {
        delete people[id];
    };

    function createPerson (id, name) {

        // initial storage
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
    
    console.log("people", people);
    // people Object {101: "John", 102: "Mary"} 
    
    undoManager.undo();
    console.log("people", people);
    // people Object {101: "John"} 
    
    undoManager.undo();
    console.log("people", people);
    // people Object {} 
    
    undoManager.redo();
    console.log("people", people);
    // people Object {101: "John"}

## Demo
See [Undo Manager with  canvas drawing](http://arthurclemens.github.com/Javascript-Undo-Manager/).

