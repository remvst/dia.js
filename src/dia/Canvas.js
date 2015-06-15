dia.Canvas = function(sheet){
	this.sheet = sheet;
	
	this.offsetX = 0;
	this.offsetY = 0;
	
	this.width = 0;
	this.height = 0;
	
	this.gridSize = 10;
};

dia.Canvas.prototype.setDimensions = function(width, height){
	this.width = width;
	this.height = height;
};

dia.Canvas.prototype.render = function(ctx){
	// Background color
	ctx.fillStyle = 'rgb(240, 240, 240)';
	ctx.fillRect(0,0, this.width, this.height);
	
	// Grid
	ctx.fillStyle = '#ffffff';
	for(var x = this.offsetX % this.gridSize ; x < this.width ; x += this.gridSize){
		ctx.fillRect(x, 0, 1, this.height);
	}
	for(var y = this.offsetY % this.gridSize ; y < this.height ; y += this.gridSize){
		ctx.fillRect(0, y, this.width, 1);
	}
	
	// Sheet
	ctx.save();
	ctx.translate(this.offsetX, this.offsetY);
	this.sheet.render(ctx);
	ctx.restore();
};

dia.Canvas.prototype.snapElementToGrid = function(element){
	var x = element.getProperty('x');
	var y = element.getProperty('y');
	
	element.setProperty('x', Math.round(x / this.gridSize) * this.gridSize);
	element.setProperty('y', Math.round(y / this.gridSize) * this.gridSize);
};
