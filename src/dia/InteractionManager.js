dia.InteractionManager = function(sheet){
	if(!sheet){
		throw new Error('Cannot instantiate InteractionManager without a sheet');
	}
	
	this.sheet = sheet;
	
	this.currentHandle = null;
	this.tool = null;
	this.currentPosition = {x: 0, y: 0};
};

dia.InteractionManager.prototype.setTool = function(tool){
	this.tool = tool;
};

dia.InteractionManager.prototype.mouseDown = function(x, y){
	this.currentHandle = null;
	this.currentPosition = {x: x, y: y};
	
	var element;
	if(this.tool){
		this.tool.mouseDown(this.sheet, x, y);
	}else{
		return;
		for(var i = 0 ; i < this.sheet.elements.length && !this.currentHandle ; i++){
			repr = this.sheet.elements[i].getRepresentation();
			for(var j = 0 ; j < repr.handles.length && !this.currentHandle ; j++){
				if(repr.handles[j].area.contains(x, y)){
					this.currentHandle = repr.handles[j];
				}
			}
		}

		if(this.currentHandle){
			this.currentHandle.dragStart(x, y);
		}
	}
};

dia.InteractionManager.prototype.mouseMove = function(x, y){
	if(this.tool){
		this.tool.mouseMove(this.sheet, x, y);
	}else if(this.currentHandle){
		return;
		this.currentHandle.dragMove(
			x - this.currentPosition.x,
			y - this.currentPosition.y
		);
	}
	this.currentPosition = {x: x, y: y};
};

dia.InteractionManager.prototype.mouseUp = function(){
	if(this.tool){
		this.tool.mouseUp(this.sheet, this.currentPosition.x, this.currentPosition.y);
	}else if(this.currentHandle){
		return;
		this.currentHandle.dragDrop(this.currentPosition.x, this.currentPosition.y);
	}
	
	this.currentHandle = null;
};
