dia.generic = dia.generic || {};

dia.generic.RECTANGLE = new dia.ElementType({
	id: 'generic.rectangle'
});

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'x',
	type: dia.DataType.INTEGER,
	default: 0,
	private: true
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'y',
	type: dia.DataType.INTEGER,
	default: 0,
	private: true
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'width',
	type: dia.DataType.INTEGER,
	default: 100,
	private: true
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'height',
	type: dia.DataType.INTEGER,
	default: 100,
	private: true
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'label',
	type: dia.DataType.STRING,
	default: ''
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'fontColor',
	type: dia.DataType.STRING,
	default: '#000'
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'fontFamily',
	type: dia.DataType.STRING,
	default: 'Arial'
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'fontSize',
	type: dia.DataType.INTEGER,
	default: 14
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'backgroundColor',
	type: dia.DataType.STRING,
	default: '#ffffff'
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'borderColor',
	type: dia.DataType.STRING,
	default: '#000'
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'borderThickness',
	type: dia.DataType.INTEGER,
	default: 1
}));

dia.generic.RECTANGLE.setRepresentationFactory(function(element){
	var repr = new dia.GraphicalRepresentation(element);
	
	repr.addRenderable(new dia.Renderable(function(c){
		c.fillStyle = element.getProperty('backgroundColor');
		c.fillRect(
			element.getProperty('x'),
			element.getProperty('y'),
			element.getProperty('width'),
			element.getProperty('height')
		);
		
		c.strokeStyle = element.getProperty('borderColor');
		c.lineWidth = element.getProperty('borderThickness');
		c.strokeRect(
			element.getProperty('x') + .5,
			element.getProperty('y') + .5,
			element.getProperty('width'),
			element.getProperty('height')
		);
		
		c.textAlign = 'center';
		c.textBaseline = 'middle';
		c.font = element.getProperty('fontSize') + 'pt ' + element.getProperty('fontFamily');
		c.fillStyle = element.getProperty('fontColor');
		c.fillText(
			element.getProperty('label'),
			element.getProperty('x') + element.getProperty('width') / 2,
			element.getProperty('y') + element.getProperty('height') / 2
		);
	}));

	repr.area = new dia.RectangleArea({
		x: function(){ return element.getProperty('x'); },
		y: function(){ return element.getProperty('y'); },
		width: function(){ return element.getProperty('width'); },
		height: function(){ return element.getProperty('height'); },
	});

	var handle = new dia.MoveElementDragHandle(element, repr.area, 'points');
	repr.addHandle(handle);
	
	return repr;
});

dia.generic.RECTANGLE.creatorTool = new dia.CreateTool({
	type: dia.generic.RECTANGLE,
	mouseDown: function(sheet, x, y){
		var element = this.type.create({
			x: x,
			y: y
		});
		sheet.addElement(element);
		this.dispatch('elementcreated');
	}
});
