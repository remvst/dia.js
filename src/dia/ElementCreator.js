dia.ElementCreator = function(options){
	options = options || {};
	
	this.type = options.type || null;
	this.onMouseDown = options.mouseDown || new Function();
	this.onMouseMove = options.mouseMove || new Function();
	this.onMouseUp = options.mouseUp || new Function();
	
	this.currentElement = null;
	
	console.log(this.onMouseDown === options.mouseDown);
};

dia.ElementCreator.prototype.mouseDown = function(sheet, x, y){
	this.onMouseDown.call(this, sheet, x, y);
};

dia.ElementCreator.prototype.mouseMove = function(sheet, x, y){
	this.onMouseMove.call(this, sheet, x, y);
};

dia.ElementCreator.prototype.mouseUp = function(sheet, x, y){
	this.onMouseUp.call(this, sheet, x, y);
	
	this.currentElement = null;
};
