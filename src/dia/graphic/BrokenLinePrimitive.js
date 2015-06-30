dia.BrokenLinePrimitive = function(representation){
	dia.Primitive.call(this, representation);
	
	this.requiresBinding('points');
	
	this.setDefault('color', '#000');
	this.setDefault('thickness', 2);
};

extend(dia.BrokenLinePrimitive, dia.Primitive);

dia.BrokenLinePrimitive.prototype.render = function(ctx){
	ctx.strokeStyle = this.getPropertyValue('color');
	ctx.lineWidth = this.getPropertyValue('thickness');
	
	var points = this.getPropertyValue('points');
	
	ctx.beginPath();
	for(var i = 0 ; i < points.length ; i++){
		ctx.lineTo(points[i].x, points[i].y);
	}
	ctx.stroke();
};
