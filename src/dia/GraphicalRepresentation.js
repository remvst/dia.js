dia.GraphicalRepresentation = function(element){
	if(!element){
		throw new Error('Cannot instantiate a GraphicalRepresentation without an element.');
	}
	
	this.element = element;
	this.renderables = [];
	this.handles = [];
	this.guides = [];
	
	this.area = null;
};

dia.GraphicalRepresentation.prototype.addRenderable = function(renderable){
	this.renderables.push(renderable);
};

dia.GraphicalRepresentation.prototype.render = function(ctx){
	ctx.save();
	
	for(var i = 0 ; i < this.renderables.length ; i++){
		this.renderables[i].render(ctx);
	}
	
	if(this.element.highlighted){
		for(var i = 0 ; i < this.handles.length ; i++){
			this.handles[i].render(ctx);
		}
	}
	
	ctx.restore();
};

dia.GraphicalRepresentation.prototype.addHandle = function(handle){
	this.handles.push(handle);
};
