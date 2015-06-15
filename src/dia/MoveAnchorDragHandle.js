dia.MoveAnchorDragHandle = function(element, area, property){
	dia.DragHandle.call(this, element, area);
	
	this.property = property;
};

extend(dia.MoveAnchorDragHandle, dia.DragHandle);

dia.MoveAnchorDragHandle.prototype.dragMove = function(dx, dy, x, y){
	var anchor = this.element.getProperty(this.property);
	
	// Let's bind the coordinates to the element's side
	// At the moment we assume its area will be a rectangle
	var anchoredElement = this.element.sheet.getElement(anchor.element);
	var anchoredArea = anchoredElement.getRepresentation().area;
	
	// Copying the object is necessary to trigger property change event.
	var newAnchor = {
		element: anchoredElement.id,
		x: dia.limit((x - anchoredArea.getX()) / anchoredArea.getWidth(), 0, 1),
		y: dia.limit((y - anchoredArea.getY()) / anchoredArea.getHeight(), 0, 1)
	};
	
	dia.adjustAnchorRatios(newAnchor);
	
	// Update the object
	this.element.setProperty(this.property, newAnchor);
};
