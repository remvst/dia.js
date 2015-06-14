dia.MoveAnchorDragHandle = function(element, area, property){
	dia.DragHandle.call(this, element, area);
	
	this.property = property;
};

extend(dia.MoveAnchorDragHandle, dia.DragHandle);

dia.MoveAnchorDragHandle.prototype.dragMove = function(dx, dy, x, y){
	var propertyValue = this.element.getProperty(this.property);
	
	// Let's bind the coordinates to the element's side
	// At the moment we assume its area will be a rectangle
	var anchoredArea = propertyValue.element.getRepresentation().area;
	var anchoredX = anchoredArea.getX();
	var anchoredY = anchoredArea.getY();
	var anchoredWidth = anchoredArea.getWidth();
	var anchoredHeight = anchoredArea.getHeight();
	
	if(x < anchoredX) x = anchoredX;
	else if(x > anchoredX + anchoredWidth) x = anchoredX + anchoredWidth;
	if(y < anchoredY) y = anchoredY;
	else if(y > anchoredY + anchoredHeight) y = anchoredY + anchoredHeight;
	
	// Let's calculate the ratio (that we're actually storing)
	var ratioX = (x - anchoredX) / anchoredWidth;
	var ratioY = (y - anchoredY) / anchoredHeight;
	
	// And adjust it: the ratio that is the closest to 0 or 1 should be bound to that value
	// and the other will keep the value it was originally going for.
	var factorX = ratioX - .5;
	var factorY = ratioY - .5;
	
	if(Math.abs(factorX) > Math.abs(factorY)){
		ratioX = factorX > 0 ? 1 : 0;
	}else{
		ratioY = factorY > 0 ? 1 : 0;
	}
	
	// Update the object
	// Copying the object is necessary to trigger property change event.
	this.element.setProperty(this.property, {
		element: propertyValue.element,
		x: ratioX,
		y: ratioY
	});
};
