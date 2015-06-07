dia.RectanglePrimitive = function(representation){
	dia.Primitive.call(this, representation);
	
	this.requiresBinding('x');
	this.requiresBinding('y');
	this.requiresBinding('width');
	this.requiresBinding('height');
	
	this.setDefault('bgColor', '#ffffff');
	this.setDefault('borderColor', '#000');
};

extend(dia.RectanglePrimitive, dia.Primitive);

dia.RectanglePrimitive.prototype.render = function(ctx){
	ctx.fillStyle = this.getPropertyValue('bgColor');
	ctx.fillRect(
		this.getPropertyValue('x'),
		this.getPropertyValue('y'),
		this.getPropertyValue('width'),
		this.getPropertyValue('height')
	);

	ctx.strokeStyle = this.getPropertyValue('borderColor');
	ctx.strokeRect(
		this.getPropertyValue('x'),
		this.getPropertyValue('y'),
		this.getPropertyValue('width'),
		this.getPropertyValue('height')
	);
};
