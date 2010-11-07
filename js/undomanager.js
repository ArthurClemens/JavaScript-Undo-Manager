var UndoManager = {

	_commandStack:[],
  	_index:-1,
  	_undoManagerContext:false,
  	_callback:undefined,

  	/*
  	Registers an undo and redo command. Both commands are passed as parameters and turned into command objects.
  	param undoObj: caller of the undo function
  	param undoFunc: function to be called at myUndoManager.undo
  	param undoParamsList: (array) parameter list
  	param undoMsg: message to be used
  	*/
	register:function(
    	undoObj, undoFunc, undoParamsList, undoMsg,
    	redoObj, redoFunc, redoParamsList, redoMsg
    ) {
    	if (this._undoManagerContext) return;
    
    	// if we are here after having called undo,
    	// invalidate items higher on the stack
		this._commandStack.splice(this._index + 1, this._commandStack.length - this._index);
				
    	this._commandStack.push(
    		{
    			undo:{o:undoObj, f:undoFunc, p:undoParamsList, m:undoMsg},
    			redo:{o:redoObj, f:redoFunc, p:redoParamsList, m:redoMsg}
    		}
    	);
    	// set the current index to the end
    	this._index = this._commandStack.length - 1;
    	if (this._callback) this._callback();
    },
    
    /*
    Pass a function to be called on undo and redo actions.
    */
    setCallback:function(callbackFunc) {
    	this._callback = callbackFunc;
    },
    
    undo:function() {
    	var command = this._commandStack[this._index];
    	if (!command) return;
		this._callCommand(command.undo);
		this._index -= 1;
		if (this._callback) this._callback();
    },
    
    redo:function() {
    	var command = this._commandStack[this._index + 1];
    	if (!command) return;
		this._callCommand(command.redo);
		this._index += 1;
		if (this._callback) this._callback();
    },
    
    /*
    Clears the memory, losing all stored states.
    */
    clear:function() {
    	this._commandStack = [];
    	this._index = -1;
    },
    
    hasUndo:function() {
    	return this._index != -1;
    },
    
    hasRedo:function() {
    	return this._index < (this._commandStack.length - 1)
    },
    
    _callCommand:function(command) {
    	if (!command) return;
    	this._undoManagerContext = true;
		command.f.apply(command.o, command.p);
    	this._undoManagerContext = false;
    }
};


/*
LICENSE

The MIT License

Copyright (c) 2010 Arthur Clemens, arthur@visiblearea.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
