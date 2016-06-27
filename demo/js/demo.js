window.onload = function () {
    "use strict";

    var undoManager,
        ctrlLimit,
        circleDrawer,
        groups,
        btnUndo,
        btnRedo,
        btnGroup,
        btnClear;

    undoManager = new UndoManager();    
    circleDrawer = new CircleDrawer("view", undoManager);

    ctrlLimit = document.getElementById("ctrlLimit");
    btnUndo = document.getElementById("btnUndo");
    btnRedo = document.getElementById("btnRedo");
    btnClear = document.getElementById("btnClear");
    btnGroup = document.getElementById("btnGroup");

    function updateUI() {
        btnUndo.disabled = !undoManager.hasUndo();
        btnRedo.disabled = !undoManager.hasRedo();
    }
    undoManager.setCallback(updateUI);

    btnUndo.onclick = function () {
        undoManager.undo();
        updateUI();
    };
    btnRedo.onclick = function () {
        undoManager.redo();
        updateUI();
    };
    btnClear.onclick = function () {
        undoManager.clear();
        updateUI();
    };
    btnGroup.onclick = function() {
        var c = btnGroup.classList;
        if(c.contains('active')){
            undoManager.group(undoManager.getIndex()-groups)
        }else{
            groups = undoManager.getIndex()
        }
        c.toggle('active');
    };
    var handleLimit = function(l) {
        var limit = parseInt(l, 10);
        if (!isNaN(limit)) {
            undoManager.setLimit(limit);
        }
        updateUI();
    };
    ctrlLimit.onchange = function() {
        handleLimit(this.value);
    };
    ctrlLimit.oninput = function() {
        handleLimit(this.value);
    };
    
    updateUI();
};
