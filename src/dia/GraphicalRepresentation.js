dia.GraphicalRepresentation = function(element){
	if(!element){
		throw new Error('Cannot instantiate a GraphicalRepresentation without an element.');
	}
	
	this.element = element;
	this.primitives = [];
	this.handles = [];
};

dia.GraphicalRepresentation.prototype.addPrimitive = function(primitive){
	this.primitives.push(primitive);
};

dia.GraphicalRepresentation.prototype.render = function(ctx){
	for(var i = 0 ; i < this.primitives.length ; i++){
		this.primitives[i].render(ctx);
	}
};

dia.GraphicalRepresentation.prototype.addHandle = function(handle){
	this.handles.push(handle);
};
