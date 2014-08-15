/*
Simple Javascript undo and redo.
https://github.com/ArthurClemens/Javascript-Undo-Manager
*/
var UndoManager = function () {
    "use strict";

    var commands = [],
        index = -1,
        isExecuting = false,
        callback,
        
        // functions
        execute;

    execute = function(command, action) {
        if (!command || typeof command[action] !== "function") {
            return this;
        }
        isExecuting = true;

        command[action]();

        isExecuting = false;
        return this;
    };

    return {

        /*
        Add a command to the queue.
        */
        add: function (command) {
            if (isExecuting) {
                return this;
            }
            // if we are here after having called undo,
            // invalidate items higher on the stack
            commands.splice(index + 1, commands.length - index);

            commands.push(command);

            // set the current index to the end
            index = commands.length - 1;
            if (callback) {
                callback();
            }
            return this;
        },

        /*
        Pass a function to be called on undo and redo actions.
        */
        setCallback: function (callbackFunc) {
            callback = callbackFunc;
        },

        /*
        Perform undo: call the undo function at the current index and decrease the index by 1.
        */
        undo: function () {
            var command = commands[index];
            if (!command) {
                return this;
            }
            execute(command, "undo");
            index -= 1;
            if (callback) {
                callback();
            }
            return this;
        },

        /*
        Perform redo: call the redo function at the next index and increase the index by 1.
        */
        redo: function () {
            var command = commands[index + 1];
            if (!command) {
                return this;
            }
            execute(command, "redo");
            index += 1;
            if (callback) {
                callback();
            }
            return this;
        },

        /*
        Clears the memory, losing all stored states. Reset the index.
        */
        clear: function () {
            var prev_size = commands.length;

            commands = [];
            index = -1;

            if (callback && (prev_size > 0)) {
                callback();
            }
        },

        hasUndo: function () {
            return index !== -1;
        },

        hasRedo: function () {
            return index < (commands.length - 1);
        },

        getCommands: function () {
            return commands;
        }
    };
};

/*
LICENSE

The MIT License

Copyright (c) 2010-2014 Arthur Clemens, arthurclemens@gmail.com

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