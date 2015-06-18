dia.MoveElementDragHandle = function(element, area){
	dia.DragHandle.call(this, element, area);
	
	if(!this.element.type.hasPropertyId('x') || !this.element.type.hasPropertyId('y')){
		throw new Error('Cannot bind a MoveElementDragHandle to an element that has no x or y');
	}
	
	this.start = null;
};

extend(dia.MoveElementDragHandle, dia.DragHandle);

dia.MoveElementDragHandle.prototype.dragStart = function(x, y){
	this.lastPosition = {
		x: this.element.getProperty('x'),
		y: this.element.getProperty('y')
	};
};

dia.MoveElementDragHandle.prototype.dragMove = function(dx, dy){
	var elementX = this.element.getProperty('x');
	var elementY = this.element.getProperty('y');

	this.element.setProperty('x', this.lastPosition.x + dx);
	this.element.setProperty('y', this.lastPosition.y + dy);

	this.lastPosition = {
		x: this.lastPosition.x + dx,
		y: this.lastPosition.y + dy
	};
};
