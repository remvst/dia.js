dia.EditTool = function(){
	dia.Tool.call(this);
	
	this.currentHandle = null;
	this.currentPosition = {x: 0, y: 0};
	this.id = 'edit';
};

extend(dia.EditTool, dia.Tool);

dia.EditTool.prototype.mouseDown = function(sheet, x, y){
	this.currentHandle = null;
	
	var repr,
		handleArea;
	for(var i = 0 ; i < sheet.elements.length ; i++){
		repr = sheet.elements[i].getRepresentation();
		for(var j = 0 ; j < repr.handles.length ; j++){
			handleArea = repr.handles[j].area;
			if(handleArea.contains(x, y) && 
			   (!this.currentHandle || handleArea.surface() < this.currentHandle.area.surface())){
				this.currentHandle = repr.handles[j];
			}
		}
	}

	if(this.currentHandle){
		this.currentHandle.dragStart(x, y);
	}
	
	this.currentPosition = {x: x, y: y};
};

dia.EditTool.prototype.mouseMove = function(sheet, x, y){
	if(this.currentHandle){
		this.currentHandle.dragMove(
			x - this.currentPosition.x,
			y - this.currentPosition.y,
			x,
			y
		);
	}
	
	this.currentPosition = {x: x, y: y};
};

dia.EditTool.prototype.mouseUp = function(sheet, x, y){
	if(this.currentHandle){
		this.currentHandle.dragDrop(this.currentPosition.x, this.currentPosition.y);
	}
	this.currentHandle = null;
	this.currentPosition = {x: x, y: y};
};
