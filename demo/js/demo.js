window.onload = function () {
  'use strict';

  const undoManager = new window.UndoManager();
  const circleDrawer = new CircleDrawer('view', undoManager);
  const ctrlLimit = document.getElementById('ctrlLimit');
  const btnUndo = document.getElementById('btnUndo');
  const btnRedo = document.getElementById('btnRedo');
  const btnClearMemory = document.getElementById('btnClearMemory');
  const btnClearScreen = document.getElementById('btnClearScreen');
  const btnGroup = document.getElementById('btnGroup');

  function updateUI() {
    btnUndo.disabled = !undoManager.hasUndo();
    btnRedo.disabled = !undoManager.hasRedo();
  }
  undoManager.setCallback(updateUI);

  btnUndo.addEventListener('click', function () {
    undoManager.undo();
    updateUI();
  });

  btnRedo.addEventListener('click', function () {
    undoManager.redo();
    updateUI();
  });

  btnClearMemory.addEventListener('click', function () {
    undoManager.clear();
    updateUI();
  });

  btnClearScreen.addEventListener('click', function () {
    circleDrawer.clearAll();
    undoManager.clear();
    updateUI();
  });

  btnGroup.addEventListener('click', function () {
    const c = btnGroup.classList;
    c.toggle('active');
    if (c.contains('active')) {
      circleDrawer.setGroupId(new Date().getTime());
    } else {
      circleDrawer.clearGroupId();
    }
  });

  function handleLimit(rawLimit) {
    const limit = parseInt(rawLimit, 10);
    if (!isNaN(limit)) {
      undoManager.setLimit(limit);
    }
    updateUI();
  }

  ctrlLimit.addEventListener('change', function () {
    handleLimit(this.value);
  });
  ctrlLimit.addEventListener('input', function () {
    handleLimit(this.value);
  });

  updateUI();
};
