dia.InteractionManager = function(sheet){
	if(!sheet){
		throw new Error('Cannot instantiate InteractionManager without a sheet');
	}
	
	this.sheet = sheet;
	
	this.tool = null;
	this.currentPosition = {x: 0, y: 0};
};

dia.InteractionManager.prototype.setTool = function(tool){
	this.tool = tool;
};

dia.InteractionManager.prototype.mouseDown = function(x, y){
	if(this.tool){
		this.tool.mouseDown(this.sheet, x, y);
	}
};

dia.InteractionManager.prototype.mouseMove = function(x, y){
	if(this.tool){
		this.tool.mouseMove(this.sheet, x, y);
	}
	this.currentPosition = {x: x, y: y};
};

dia.InteractionManager.prototype.mouseUp = function(){
	if(this.tool){
		this.tool.mouseUp(this.sheet, this.currentPosition.x, this.currentPosition.y);
	}
};
