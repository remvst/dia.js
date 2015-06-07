dia.Generic = {};

dia.Generic.RECTANGLE = new dia.ElementType({
	id: 'generic.rectangle'
});

dia.Generic.RECTANGLE.addProperty(new dia.Property({
	id: 'x',
	type: dia.DataType.INTEGER,
	default: 0
}));

dia.Generic.RECTANGLE.addProperty(new dia.Property({
	id: 'y',
	type: dia.DataType.INTEGER,
	default: 0
}));

dia.Generic.RECTANGLE.addProperty(new dia.Property({
	id: 'width',
	type: dia.DataType.INTEGER,
	default: 100
}));

dia.Generic.RECTANGLE.addProperty(new dia.Property({
	id: 'height',
	type: dia.DataType.INTEGER,
	default: 100
}));

dia.Generic.RECTANGLE.setRepresentationFactory(function(element){
	var repr = new dia.GraphicalRepresentation(element);
	
	var rect = new dia.RectanglePrimitive(repr);
	rect.bind('x', 'x');
	rect.bind('y', 'y');
	rect.bind('width', 'width');
	rect.bind('height', 'height');
	repr.addPrimitive(rect);
	
	return repr;
});
