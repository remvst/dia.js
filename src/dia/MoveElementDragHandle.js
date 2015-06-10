dia.MoveElementDragHandle = function(element){
	dia.DragHandle.call(this, element);
	
	if(!this.element.type.hasPropertyId('x') || !this.element.type.hasPropertyId('y')){
		throw new Error('Cannot bind a MoveElementDragHandle to an element that has no x or y');
	}
};

extend(dia.MoveElementDragHandle, dia.DragHandle);

dia.MoveElementDragHandle.prototype.dragMove = function(dx, dy){
	var elementX = this.element.getProperty('x');
	var elementY = this.element.getProperty('y');
	
	this.element.setProperty('x', elementX + dx);
	this.element.setProperty('y', elementY + dy);
};
