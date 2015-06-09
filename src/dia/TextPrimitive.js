dia.TextPrimitive = function(representation){
	dia.Primitive.call(this, representation);
	
	this.requiresBinding('x');
	this.requiresBinding('y');
	
	this.setDefault('text', '');
	this.setDefault('color', '#000');
	this.setDefault('font', 'Arial');
	this.setDefault('size', 14);
	this.setDefault('lineHeight', 20);
	this.setDefault('align', 'left');
};

extend(dia.TextPrimitive, dia.Primitive);

dia.TextPrimitive.prototype.render = function(ctx){
	ctx.fillStyle = this.getPropertyValue('color');
	ctx.font = this.getPropertyValue('size') + 'pt ' + this.getPropertyValue('font');
	ctx.textBaseline = 'middle';
	ctx.textAlign = this.getPropertyValue('align');
	
	var lines = this.getPropertyValue('text').split("\n"),
		y = this.getPropertyValue('y') + this.getPropertyValue('lineHeight') / 2;
	
	for(var i = 0 ; i < lines.length ; i++, y += this.getPropertyValue('lineHeight')){
		ctx.fillText(lines[i], this.getPropertyValue('x'), y);
	}
};
