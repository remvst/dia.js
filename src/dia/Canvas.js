dia.Canvas = function(sheet){
	dia.EventDispatcher.call(this);
	
	this.sheet = sheet;
	this.sheet.canvas = this;
	
	this.scrollX = 0;
	this.scrollY = 0;
	
	this.width = 0;
	this.height = 0;
	
	this.gridSize = 10;
};

extend(dia.Canvas, dia.EventDispatcher);

dia.Canvas.prototype.setDimensions = function(width, height){
	this.width = width;
	this.height = height;
};

dia.Canvas.prototype.scroll = function(dx, dy){
	this.scrollTo(this.scrollX + dx, this.scrollY + dy);
};

dia.Canvas.prototype.scrollTo = function(x, y){
	this.scrollX = x;
	this.scrollY = y;
	
	this.dispatch('scrollchange');
};

dia.Canvas.prototype.render = function(ctx){
	// Background color
	ctx.fillStyle = 'rgb(240, 240, 240)';
	ctx.fillRect(0,0, this.width, this.height);
	
	// Grid
	ctx.fillStyle = '#ffffff';
	for(var x = this.gridSize - (this.scrollX % this.gridSize) ; x < this.width ; x += this.gridSize){
		ctx.fillRect(x, 0, 1, this.height);
	}
	for(var y = this.gridSize - (this.scrollY % this.gridSize) ; y < this.height ; y += this.gridSize){
		ctx.fillRect(0, y, this.width, 1);
	}
	
	// Sheet
	ctx.save();
	ctx.translate(-this.scrollX, -this.scrollY);
	this.sheet.render(ctx);
	ctx.restore();
};

dia.Canvas.prototype.snapElementToGrid = function(element){
	var x = element.getProperty('x');
	var y = element.getProperty('y');
	
	element.setProperty('x', Math.round(x / this.gridSize) * this.gridSize);
	element.setProperty('y', Math.round(y / this.gridSize) * this.gridSize);
};
