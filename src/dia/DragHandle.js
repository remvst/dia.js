dia.DragHandle = function(element, area){
	if(!element){
		throw new Error('Cannot create a DragHandle without an element');
	}
	
	this.element = element;
	this.area = area || null;
};

dia.DragHandle.prototype.dragStart = function(x, y){
	
};

dia.DragHandle.prototype.dragMove = function(dx, dy, x, y){
	
};

dia.DragHandle.prototype.dragDrop = function(x, y){
	
};

dia.DragHandle.prototype.render = function(c){
	this.area.render(c);
};
