dia.InteractionManager = function(gui){
	this.gui = gui;

	this.sheet = null;
	this.tool = null;
	this.currentPosition = {x: 0, y: 0, absoluteX: 0, absoluteY: 0 };
	this.downKeys = {};
};

dia.InteractionManager.prototype.setTool = function(tool){
	this.tool = tool;
};

dia.InteractionManager.prototype.setSheet = function(sheet){
	this.sheet = sheet;
};

dia.InteractionManager.prototype.mouseDown = function(x, y){
	if(this.tool){
		this.tool.mouseDown(this.sheet, x, y);
	}
};

dia.InteractionManager.prototype.mouseMove = function(x, y, absoluteX, absoluteY){
	if(this.downKeys[32]){
		var canvas = this.gui.getSheetCanvas(this.sheet);
		canvas.scroll(
			this.currentPosition.absoluteX - absoluteX,
			this.currentPosition.absoluteY - absoluteY
		);
	}else if(this.tool){
		this.tool.mouseMove(this.sheet, x, y);
	}
	this.currentPosition = {x: x, y: y, absoluteX: absoluteX, absoluteY: absoluteY};
};

dia.InteractionManager.prototype.mouseUp = function(){
	if(this.tool){
		this.tool.mouseUp(this.sheet, this.currentPosition.x, this.currentPosition.y);
	}
};

dia.InteractionManager.prototype.keyDown = function(keyCode){
	if(this.tool){
		this.tool.keyDown(this.sheet, keyCode);
	}
	this.downKeys[keyCode] = true;
};

dia.InteractionManager.prototype.keyUp = function(keyCode){
	if(this.tool){
		this.tool.keyUp(this.sheet, keyCode);
	}
	this.downKeys[keyCode] = false;
};

dia.InteractionManager.prototype.clearDownKeys = function(){
	for(var keyCode in this.downKeys){
		this.tool.keyUp(this.sheet, keyCode);
	}
	this.downKeys = {};
};
