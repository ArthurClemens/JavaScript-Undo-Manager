if (Function.prototype.bind === undefined) {
    Function.prototype.bind = function (scope) {
        var ofunction = this;
        return function () {
            return ofunction.apply(scope, arguments);
        };
    };
}

function CircleDrawer(canvasId) {
    "use strict";

    this.undoManager = undefined;
    this.CANVAS_WIDTH = 300;
    this.CANVAS_HEIGHT = 150;
    this.CIRCLE_RADIUS = 10;
    this.drawingContext = undefined;
    this.circles = [];
    this.circleId = 0;

    var drawingCanvas = window.document.getElementById(canvasId);
    if (drawingCanvas.getContext === undefined) {
        return;
    }
    
    this.drawingContext = drawingCanvas.getContext('2d');

    drawingCanvas.onclick = function (event) {

		/* global window */
        var mouseX, mouseY, intColor, hexColor, color, id;
        
        if (!event) {
            event = window.event;
        }
        mouseX = event.offsetX;
        if (mouseX === undefined) {
            mouseX = event.layerX;
        }
        mouseY = event.offsetY;
        if (mouseY === undefined) {
            mouseY = event.layerY;
        }
        
        intColor = Math.floor(Math.random() * (256 * 256 * 256));
        hexColor = parseInt(intColor, 10).toString(16); 
        color = (hexColor.length < 2) ? "0" + hexColor : hexColor;
        id = this.circleId;
        this.circleId += 1;
        
        this.createCircle(id, mouseX, mouseY, color);   
    }.bind(this);
}

CircleDrawer.prototype.setUndoManager = function (undoManager) {
    this.undoManager = undoManager;
};
    
CircleDrawer.prototype.createCircle = function (id, x, y, color) {
    this.circles.push({id: id, x: x, y: y, color: color});
    this.draw();
    this.undoManager.register(
        this, this.removeCircle, [id], 'Remove circle',
        this, this.createCircle, [id, x, y, color], 'Create circle'
    );
};
    
CircleDrawer.prototype.removeCircle = function (id) {
    var i = 0, index = -1;
    for (i = 0; i < this.circles.length; i += 1) {
        if (this.circles[i].id === id) {
            index = i;
        }
    }
    if (index !== -1) {
        this.circles.splice(index, 1);
    }
    this.draw();
};
    
CircleDrawer.prototype.drawCircle = function (x, y, color) {
    this.drawingContext.fillStyle = color;
    this.drawingContext.beginPath();
    this.drawingContext.arc(x, y, this.CIRCLE_RADIUS, 0, Math.PI * 2, true); 
    this.drawingContext.closePath();
    this.drawingContext.fill();
};
    
CircleDrawer.prototype.draw = function () {
    this.clear();
    var i;
    for (i = 0; i < this.circles.length; i += 1) {
        this.drawCircle(this.circles[i].x, this.circles[i].y, this.circles[i].color);
    }
};
    
CircleDrawer.prototype.clear = function () {
    this.drawingContext.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
};