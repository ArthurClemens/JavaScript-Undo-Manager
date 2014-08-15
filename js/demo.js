window.onload = function () {
    "use strict";

    var undoManager,
        circleDrawer,
        btnUndo,
        btnRedo,
        btnClear;

    undoManager = new UndoManager();
    circleDrawer = new CircleDrawer("view", undoManager);

    btnUndo = document.getElementById('btnUndo');
    btnRedo = document.getElementById('btnRedo');
    btnClear = document.getElementById('btnClear');

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

    updateUI();
};