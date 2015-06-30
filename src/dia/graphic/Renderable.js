dia.Renderable = function(render){
	this.renderFunction = render;
};

dia.Renderable.prototype.render = function(ctx){
	ctx.save();
	this.renderFunction.call(this, ctx);
	ctx.restore();
};
