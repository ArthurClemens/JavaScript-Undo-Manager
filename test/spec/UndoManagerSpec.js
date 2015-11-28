describe("UndoManager Suite", function() {
    var self,
        undoManager,
        items,
        addItem,
        removeItem,
        addItemToUndo;
    
    self = this;

    addItem = function(item) {
        items.push(item);
    };
    removeItem = function() {
        items.pop();
    };
    addItemToUndo = function(item) {
        undoManager.add({
            undo: function() {
                removeItem();
            },
            redo: function() {
                addItem(item);
            }
        });
    };

    beforeEach(function() {
        // Always start with a clean slate
        items = [];
        undoManager = new UndoManager();
    });

    it("Create the undo manager", function() {
        undoManager = new UndoManager();
        expect(undoManager).not.toBe(null);
        expect(undoManager.getCommands().length).toBe(0);
        expect(undoManager.getIndex()).toBe(-1);
    });

    it("Adding a command", function() {
        var item = "A";

        addItem(item);
        addItemToUndo(item);
        
        expect(undoManager.getCommands().length).toBe(1);
        expect(undoManager.getIndex()).toBe(0);
        expect(undoManager.hasUndo()).toBe(true);
        expect(undoManager.hasRedo()).toBe(false);
    });

    it("Adding a callback", function() {
        var callbackCalled = 0;

        addItemToUndo("A");

        undoManager.setCallback(function() {
            callbackCalled++;
        });
        
        undoManager.undo();
        undoManager.redo();
        expect(callbackCalled).toBe(2);

        undoManager.setCallback(undefined);
        
        undoManager.undo();
        undoManager.redo();
        expect(callbackCalled).toBe(2);
    });

    it("Calling redo", function() {
        var item1 = "A",
            item2 = "B";
            
        addItem(item1);
        addItemToUndo(item1);
        
        addItem(item2);
        addItemToUndo(item2);
        
        undoManager.undo();
        undoManager.redo();
        expect(items.length).toBe(2);
        expect(undoManager.hasUndo()).toBe(true);
        expect(undoManager.getCommands().length).toBe(2);
        expect(undoManager.getIndex()).toBe(1);
    });
    
    it("Calling redo that is not a function", function() {
        var item1 = "A",
            item2 = "B";
            
        addItem(item1);        
        undoManager.add({
            undo: function() {
                removeItem();
            },
            redo: undefined
        });
        
        addItem(item2);
        undoManager.add({
            undo: function() {
                removeItem();
            },
            redo: undefined
        });
        
        undoManager.undo();
        undoManager.redo();
        expect(items.length).toBe(1);
        expect(undoManager.hasUndo()).toBe(true);
        expect(undoManager.getCommands().length).toBe(2);
        expect(undoManager.getIndex()).toBe(1);
    });
    
    it("Calling undo without redo", function() {
        addItem("A");
        addItem("B");
        
        undoManager.add({
            undo: function() {
                removeItem();
            },
            redo: undefined
        });
        
        undoManager.undo();
        undoManager.undo();
        expect(items.length).toBe(1);
        expect(undoManager.hasUndo()).toBe(false);
        expect(undoManager.getCommands().length).toBe(1);
        expect(undoManager.getIndex()).toBe(-1);
    });
    
    it("Calling clear", function() {
        addItemToUndo("A");
        addItemToUndo("B");

        undoManager.clear();

        expect(undoManager.getCommands().length).toBe(0);
        expect(undoManager.getIndex()).toBe(-1);
        expect(undoManager.hasUndo()).toBe(false);
        expect(undoManager.hasRedo()).toBe(false);
    });

    it("Calling undo with limit set", function() {
        undoManager.setLimit(5);
        addItem("1");
        addItemToUndo("1");
        
        addItem("2");
        addItemToUndo("2");
        
        addItem("3");
        addItemToUndo("3");
        
        addItem("4");
        addItemToUndo("4");
        
        addItem("5");
        addItemToUndo("5");
        
        addItem("6");
        addItemToUndo("6");
        
        addItem("7");
        addItemToUndo("7");
        
        undoManager.undo();
        undoManager.undo();
        undoManager.undo();
        undoManager.undo();
        undoManager.undo();
        
        expect(undoManager.hasUndo()).toBe(false);
        expect(undoManager.hasRedo()).toBe(true);
        expect(undoManager.getCommands().length).toBe(5);
    });
    
    it("Calling undo with limit set to 1", function() {
        undoManager.setLimit(1);
        
        var item1 = "A",
            item2 = "B",
            item3 = "C";
            
        addItem(item1);
        addItemToUndo(item1);
        
        addItem(item2);
        addItemToUndo(item2);
        
        addItem(item3);
        addItemToUndo(item3);
        
        undoManager.undo();
        undoManager.undo();
        undoManager.undo();
        
        expect(undoManager.hasUndo()).toBe(false);
        expect(undoManager.hasRedo()).toBe(true);
        expect(undoManager.getCommands().length).toBe(1);
    });
    
    it("Calling undo with limit set to 0", function() {
        undoManager.setLimit(0);
        
        var item1 = "A",
            item2 = "B",
            item3 = "C";
            
        addItem(item1);
        addItemToUndo(item1);
        
        addItem(item2);
        addItemToUndo(item2);
        
        addItem(item3);
        addItemToUndo(item3);
        
        undoManager.undo();
        undoManager.undo();
        
        expect(undoManager.hasUndo()).toBe(true);
        expect(undoManager.hasRedo()).toBe(true);
        expect(undoManager.getCommands().length).toBe(3);
    });

});