dia.Canvas = function(sheet){
	this.sheet = sheet;
	
	this.offsetX = 0;
	this.offsetY = 0;
	
	this.width = 0;
	this.height = 0;
};

dia.Canvas.prototype.setDimensions = function(width, height){
	this.width = width;
	this.height = height;
};

dia.Canvas.prototype.render = function(ctx){
	// Background color
	ctx.fillStyle = 'rgb(240, 240, 240)';
	ctx.fillRect(0,0, this.width, this.height);
	
	// Grid (TODO)
	
	// Sheet
	ctx.save();
	ctx.translate(this.offsetX, this.offsetY);
	this.sheet.render(ctx);
	ctx.restore();
};
