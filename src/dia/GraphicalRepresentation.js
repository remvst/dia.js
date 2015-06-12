dia.GraphicalRepresentation = function(element){
	if(!element){
		throw new Error('Cannot instantiate a GraphicalRepresentation without an element.');
	}
	
	this.element = element;
	this.renderables = [];
	this.handles = [];
	
	this.area = null;
};

dia.GraphicalRepresentation.prototype.addRenderable = function(renderable){
	this.renderables.push(renderable);
};

dia.GraphicalRepresentation.prototype.render = function(ctx){
	for(var i = 0 ; i < this.renderables.length ; i++){
		this.renderables[i].render(ctx);
	}
};

dia.GraphicalRepresentation.prototype.addHandle = function(handle){
	this.handles.push(handle);
};
