dia.GraphicalRepresentation = function(element){
	if(!element){
		throw new Error('Cannot instantiate a GraphicalRepresentation without an element.');
	}
	
	this.element = element;
	this.renderables = []; // list of renderable objects that will render on the canvas
	this.handles = []; // drag handles used to modify the element
	this.guides = []; // guides that should help align other elements
	
	this.area = null; // area covered by the representation
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
