window.onload = function() {
    var undoManager = new UndoManager();

    var circleDrawer = new CircleDrawer('view');
    circleDrawer.setUndoManager(undoManager);

    var btnUndo = document.getElementById('btnUndo');
    var btnRedo = document.getElementById('btnRedo');
    var btnClear = document.getElementById('btnClear');

    function updateUI() {
        btnUndo.disabled = !undoManager.hasUndo();
        btnRedo.disabled = !undoManager.hasRedo();
    }
    undoManager.setCallback(updateUI);

    btnUndo.onclick = function() {
        undoManager.undo();
        updateUI();
    };
    btnRedo.onclick = function() {
        undoManager.redo();
        updateUI();
    };
    btnClear.onclick = function() {
        undoManager.clear();
        updateUI();
    };

    updateUI();
};