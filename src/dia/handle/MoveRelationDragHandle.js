dia.MoveRelationDragHandle = function(element, area, property){
	dia.DragHandle.call(this, element, area);
	
	this.property = property;
};

extend(dia.MoveRelationDragHandle, dia.DragHandle);

dia.MoveRelationDragHandle.prototype.dragStart = function(x, y){
	this.accumDX = 0;
	this.accumDY = 0;
	
	this.initialPoints = this.element.getProperty(this.property);
};

dia.MoveRelationDragHandle.prototype.dragMove = function(dx, dy){
	this.accumDX += dx;
	this.accumDY += dy;
	
	var points = this.element.getProperty(this.property);
	
	var newPoints = [];
	for(var i = 0 ; i < points.length ; i++){
		newPoints.push({
			x: dia.snap(this.initialPoints[i].x + this.accumDX, this.element.sheet.gridSize),
			y: dia.snap(this.initialPoints[i].y + this.accumDY, this.element.sheet.gridSize)
		});
	}
	
	this.element.setProperty(this.property, newPoints);
};
