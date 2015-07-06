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

	var absolutePosition = anchoredArea.getAbsolutePositionFromRelative(
		dia.snap(this.initialAnchorPositions.x + this.accumDX, this.element.sheet.gridSize),
		dia.snap(this.initialAnchorPositions.y + this.accumDY, this.element.sheet.gridSize)
	);

	if(!anchoredArea.contains(absolutePosition.x, absolutePosition.y)){
		var newElement = anchoredElement.sheet.findElementContaining(
			absolutePosition.x,
			absolutePosition.y,
			function(element){
				return element.type.isAnchorable();
			}
		);
		if(newElement){
			anchoredElement = newElement;
			anchoredArea = newElement.getRepresentation().area;
		}
	}

	var newRelativePosition = anchoredArea.getRelativePositionFromAbsolute(
		absolutePosition.x,
		absolutePosition.y
	);

	var newAnchor = {
		element: anchoredElement.id,
		x: newRelativePosition.x,
		y: newRelativePosition.y
	};

	anchoredArea.bindAnchorToBounds(newAnchor);

	// Update the object
	this.element.setProperty(this.property, newAnchor);
};
