dia.CreateTool = function(options){
	dia.Tool.call(this);
	
	options = options || {};
	
	this.type = options.type || null;
	this.onMouseDown = options.mouseDown || new Function();
	this.onMouseMove = options.mouseMove || new Function();
	this.onMouseUp = options.mouseUp || new Function();
	
	this.currentElement = null;
};

extend(dia.CreateTool, dia.Tool);

dia.CreateTool.prototype.mouseDown = function(sheet, x, y){
	this.onMouseDown.call(this, sheet, x, y);
};

dia.CreateTool.prototype.mouseMove = function(sheet, x, y){
	this.onMouseMove.call(this, sheet, x, y);
};

dia.CreateTool.prototype.mouseUp = function(sheet, x, y){
	this.onMouseUp.call(this, sheet, x, y);
	
	this.currentElement = null;
};
