dia.DragHandle = function(element){
	if(!element){
		throw new Error('Cannot create a DragHandle without an element');
	}
	
	this.element = element;
};

dia.DragHandle.prototype.dragStart = function(x, y){
	
};

dia.DragHandle.prototype.dragMove = function(dx, dy){
	
};

dia.DragHandle.prototype.dragDrop = function(x, y){
	
};
