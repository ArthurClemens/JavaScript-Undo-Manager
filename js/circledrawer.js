if (Function.prototype.bind === undefined) {
	Function.prototype.bind = function (scope) {
		var ofunction = this;
		return function () {
			return ofunction.apply(scope, arguments);
		};
	};
}

var CircleDrawer = function (canvasId) {
	"use strict";

	var undoManager,
		CANVAS_WIDTH = 300,
		CANVAS_HEIGHT = 150,
		CIRCLE_RADIUS = 10,
		drawingContext,
		circles = [],
		circleId = 0,
		drawingCanvas = window.document.getElementById(canvasId);

	if (drawingCanvas.getContext === undefined) {
		return;
	}

	drawingContext = drawingCanvas.getContext('2d');

	function clear() {
		drawingContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	function drawCircle(x, y, color) {
		drawingContext.fillStyle = color;
		drawingContext.beginPath();
		drawingContext.arc(x, y, CIRCLE_RADIUS, 0, Math.PI * 2, true);
		drawingContext.closePath();
		drawingContext.fill();
	}

	function draw() {
		clear();
		var i;
		for (i = 0; i < circles.length; i += 1) {
			drawCircle(circles[i].x, circles[i].y, circles[i].color);
		}
	}

	function removeCircle(id) {
		var i = 0, index = -1;
		for (i = 0; i < circles.length; i += 1) {
			if (circles[i].id === id) {
				index = i;
			}
		}
		if (index !== -1) {
			circles.splice(index, 1);
		}
		draw();
	}

	function createCircle(id, x, y, color) {
		circles.push({id: id, x: x, y: y, color: color});
		draw();
		undoManager.register(undefined, removeCircle, [id], 'Remove circle', undefined, createCircle, [id, x, y, color], 'Create circle');
	}

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
		id = circleId;
		circleId += 1;

		createCircle(id, mouseX, mouseY, color);
	}.bind(this);

	// public

	return {
		setUndoManager: function (inUndoManager) {
			undoManager = inUndoManager;
		}
	};
};