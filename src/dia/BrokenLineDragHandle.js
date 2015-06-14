dia.BrokenLineDragHandle = function(element, area, property){
	dia.DragHandle.call(this, element, area);
	
	this.property = property;
	this.brokenIndex = null;
	this.broken = false;
};

extend(dia.BrokenLineDragHandle, dia.DragHandle);

dia.BrokenLineDragHandle.prototype.dragStart = function(x, y){
	// Let's find the line we should split into two
	this.brokenIndex = Math.max(this.area.indexOfLineThatContains(x, y), 0);
	this.broken = false;
	
	// not splitting until we move the mouse (to avoid having too many points)
};

dia.BrokenLineDragHandle.prototype.dragMove = function(dx, dy, x, y){
	var propertyValue = this.element.getProperty(this.property);
	
	var newPoints = propertyValue.slice(0);
	if(!this.broken){
		newPoints.splice(this.brokenIndex, 0, {});
		this.broken = true;
	}
	
	newPoints[this.brokenIndex].x = x;
	newPoints[this.brokenIndex].y = y;
	
	// Update the object
	// Copying the object is necessary to trigger property change event.
	this.element.setProperty(this.property, newPoints);
};

dia.BrokenLineDragHandle.prototype.dragDrop = function(x, y){
	this.brokenIndex = null;
	this.broken = false;
};
