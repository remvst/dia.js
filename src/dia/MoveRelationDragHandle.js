dia.MoveRelationDragHandle = function(element, area, property){
	dia.DragHandle.call(this, element, area);
	
	this.property = property;
};

extend(dia.MoveRelationDragHandle, dia.DragHandle);

dia.MoveRelationDragHandle.prototype.dragMove = function(dx, dy){
	var points = this.element.getProperty(this.property);
	
	var newPoints = [];
	for(var i = 0 ; i < points.length ; i++){
		newPoints.push({
			x: points[i].x + dx,
			y: points[i].y + dy
		});
	}
	
	this.element.setProperty(this.property, newPoints);
};
