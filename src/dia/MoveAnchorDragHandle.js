dia.MoveAnchorDragHandle = function(element, area, property){
	dia.DragHandle.call(this, element, area);
	
	this.property = property;
};

extend(dia.MoveAnchorDragHandle, dia.DragHandle);

dia.MoveAnchorDragHandle.prototype.dragStart = function(){
	var anchor = this.element.getProperty(this.property);
	
	this.accumDX = 0;
	this.accumDY = 0;
	
	this.initialAnchorPositions = {
		x: anchor.x,
		y: anchor.y
	};
};

dia.MoveAnchorDragHandle.prototype.dragMove = function(dx, dy, x, y){
	var anchor = this.element.getProperty(this.property);
	
	this.accumDX += dx;
	this.accumDY += dy;
	
	// Let's bind the coordinates to the element's side
	// At the moment we assume its area will be a rectangle
	var anchoredElement = this.element.sheet.getElement(anchor.element);
	var anchoredArea = anchoredElement.getRepresentation().area;
	
	// Copying the object is necessary to trigger property change event.
	var newAnchor = {
		element: anchoredElement.id,
		x: this.initialAnchorPositions.x + this.accumDX,
		y: this.initialAnchorPositions.y + this.accumDY
	};
	
	//dia.adjustAnchorRatios(newAnchor);
	anchoredArea.bindAnchorToBounds(newAnchor);
	
	// Update the object
	this.element.setProperty(this.property, newAnchor);
};
