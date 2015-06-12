dia.Renderable = function(render){
	this.renderFunction = render;
};

dia.Renderable.prototype.render = function(ctx){
	this.renderFunction.call(this, ctx);
};
