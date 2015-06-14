dia.BrokenLineDragHandle = function(element, area, property){
	dia.DragHandle.call(this, element, area);
	
	this.property = property;
	this.breakIndex = null;
	this.modifiedPoint = null;
};

extend(dia.BrokenLineDragHandle, dia.DragHandle);

dia.BrokenLineDragHandle.prototype.dragStart = function(x, y){
	this.breakIndex = null;
	
	// Let's find the line we should split into two
	var index = Math.max(this.area.indexOfLineThatContains(x, y), 0);
	
	var points = this.element.getProperty(this.property);
	var point1 = points[index - 1];
	var point2 = points[index];
	
	if(point1 && dia.distance(x, y, point1.x, point1.y) <= 20 && index >= 0){
		this.modifiedPoint = point1;
   	}else if(point2 && dia.distance(x, y, point2.x, point2.y) <= 20 && index < points.length){
		this.modifiedPoint = point2;
	}else{
		// We're too far from the points, let's create a new one
		// not splitting until we move the mouse (to avoid having too many points)
		this.breakIndex = index;
	}
};

dia.BrokenLineDragHandle.prototype.dragMove = function(dx, dy, x, y){
	var propertyValue = this.element.getProperty(this.property);
	
	var newPoints = propertyValue.slice(0);
	if(this.breakIndex !== null){
		this.modifiedPoint = {};
		newPoints.splice(this.breakIndex, 0, this.modifiedPoint);
		this.breakIndex = null;
	}
	
	this.modifiedPoint.x = x;
	this.modifiedPoint.y = y;
	
	// Update the object
	// Copying the object is necessary to trigger property change event.
	this.element.setProperty(this.property, newPoints);
};

dia.BrokenLineDragHandle.prototype.dragDrop = function(x, y){
	this.breakIndex = null;
	this.modifiedPoint = null;
};
