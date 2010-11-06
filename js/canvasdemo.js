var CircleDrawer = {
		
	undoManager:undefined,
	CANVAS_WIDTH:300,
	CANVAS_HEIGHT:150,
	CIRCLE_RADIUS:10,
	drawingContext:undefined,
	circles:[],
	circleId:0,
	
	init:function(undoManager) {
	
		this.undoManager = undoManager;
		
		var drawingCanvas = document.getElementById('view');
		
		if (drawingCanvas.getContext) {
			this.drawingContext = drawingCanvas.getContext('2d');

			var canvas = this;
			drawingCanvas.onclick = function(event) {
				if (!event) event = window.event;
				var mouseX = event.offsetX;
				if (mouseX == undefined) mouseX = event.layerX;
				var mouseY = event.offsetY;
				if (mouseY == undefined) mouseY = event.layerY;
				
				var intColor = Math.floor(Math.random() * (256 * 256 * 256));
				var hexColor = parseInt(intColor).toString(16);  
				color = (hexColor.length < 2) ? "0" + hexColor : hexColor;
				
				id = canvas.circleId++;
				
				canvas.createCircle(id, mouseX, mouseY, color);
			}
		}
	},
	
	createCircle:function(id, x, y, color) {

		this.circles.push({id:id, x:x, y:y, color:color});
		this.draw();
		
		this.undoManager.register(
			this, this.removeCircle, [id], 'Remove circle',
			this, this.createCircle, [id, x, y, color], 'Create circle'
		);
	},
	
	removeCircle:function(id) {
		var index = -1;
		for (var i=0; i<this.circles.length; i++) {
			if (this.circles[i].id == id) {
				index = i;
			}
		}
		if (index != -1) {
			this.circles.splice(index, 1);
		}
		this.draw();
	},
	
	drawCircle:function(x, y, color) {
		this.drawingContext.fillStyle = color;
		this.drawingContext.beginPath();
		this.drawingContext.arc(x, y, this.CIRCLE_RADIUS, 0, Math.PI*2, true); 
		this.drawingContext.closePath();
		this.drawingContext.fill();
	},
	
	draw:function() {
		this.clear();
		for (var i=0; i<this.circles.length; i++) {
			this.drawCircle(this.circles[i].x, this.circles[i].y, this.circles[i].color);
		}
	},
	
	clear:function() {
		this.drawingContext.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
	}
}