dia.CreateTool = function(options){
	dia.Tool.call(this);
	
	options = options || {};
	
	this.type = options.type || null;
	this.onMouseDown = options.mouseDown || new Function();
	this.onMouseMove = options.mouseMove || new Function();
	this.onMouseUp = options.mouseUp || new Function();
	
	this.currentElement = null;
	
	if(this.type && this.type.id){
		this.id = 'create-' + this.type.id;
	}
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

dia.CreateTool.prototype.extend = function(options){
	var original = this;
	return new dia.CreateTool({
		type: options.type || this.type,
		mouseDown: function(sheet, x, y){
			original.onMouseDown.call(this, sheet, x, y);
			options.mouseDown.call(this, sheet, x, y);
		},
		mouseMove: function(sheet, x, y){
			original.onMouseMove.call(this, sheet, x, y);
			options.mouseMove.call(this, sheet, x, y);
		},
		mouseUp: function(sheet, x, y){
			original.onMouseUp.call(this, sheet, x, y);
			options.mouseUp.call(this, sheet, x, y);
		}
	});
};
