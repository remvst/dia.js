dia.MoveAnchorDragHandle = function(element, area, property){
	dia.DragHandle.call(this, element, area);

	this.property = property;
};

extend(dia.MoveAnchorDragHandle, dia.DragHandle);

dia.MoveAnchorDragHandle.prototype.dragMove = function(dx, dy, x, y){
	x = dia.snap(x, this.element.sheet.gridSize);
	y = dia.snap(y, this.element.sheet.gridSize);

	var anchor = this.element.getProperty(this.property);

	var anchoredElement = this.element.sheet.getElement(anchor.element);
	var anchoredArea = anchoredElement.getRepresentation().area;

	if(!anchoredArea.contains(x, y)){
		anchoredElement = this.element.sheet.findElementContaining(x, y, function(element){
			return element.type.isAnchorable();
		}) || anchoredElement;
	}

	anchoredArea = anchoredElement.getRepresentation().area;
	var relativePosition = anchoredArea.getRelativePositionFromAbsolute(x, y);

	// Copying the object is necessary to trigger property change event.
	var newAnchor = {
		element: anchoredElement.id,
		x: relativePosition.x,
		y: relativePosition.y,
		angle: anchor.angle
	};

	// Let's bind the coordinates to the element's side
	if(anchoredArea.contains(x, y)){
		anchoredArea.bindAnchorToBounds(newAnchor);
	}

	// Update the object
	this.element.setProperty(this.property, newAnchor);
};

dia.MoveAnchorDragHandle.prototype.dragDrop = function(x, y){
	var anchor = this.element.getProperty(this.property);
	var anchoredElement = this.element.sheet.getElement(anchor.element);
	var anchoredArea = anchoredElement.getRepresentation().area;

	var newAnchor = {
		element: anchor.element,
		x: anchor.x,
		y: anchor.y,
		angle: anchor.angle
	};
	anchoredArea.bindAnchorToBounds(newAnchor);

	// Update the object
	this.element.setProperty(this.property, newAnchor);
};
