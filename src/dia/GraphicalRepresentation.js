dia.GraphicalRepresentation = function(element){
	if(!element){
		throw new Error('Cannot instantiate a GraphicalRepresentation without an element.');
	}
	
	this.element = element;
	this.primitives = [];
};

dia.GraphicalRepresentation.prototype.addPrimitive = function(primitive){
	this.primitives.push(primitive);
};
