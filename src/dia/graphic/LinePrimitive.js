dia.LinePrimitive = function(representation){
	dia.Primitive.call(this, representation);
	
	this.requiresBinding('p1.x');
	this.requiresBinding('p1.y');
	this.requiresBinding('p2.x');
	this.requiresBinding('p2.y');
	
	this.setDefault('color', '#000');
	this.setDefault('thickness', 2);
};

extend(dia.LinePrimitive, dia.Primitive);

dia.LinePrimitive.prototype.render = function(ctx){
	ctx.strokeStyle = this.getPropertyValue('color');
	ctx.lineWidth = this.getPropertyValue('thickness');
	
	ctx.beginPath();
	ctx.moveTo(this.getPropertyValue('p1.x'), this.getPropertyValue('p1.y'));
	ctx.lineTo(this.getPropertyValue('p2.x'), this.getPropertyValue('p2.y'));
	ctx.stroke();
};
