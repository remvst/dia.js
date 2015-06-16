dia.generic = dia.generic || {};

dia.generic.CIRCLE = new dia.ElementType({
	id: 'generic.circle'
});

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'x',
	type: dia.DataType.INTEGER,
	default: 0,
	private: true
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'y',
	type: dia.DataType.INTEGER,
	default: 0,
	private: true
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'radius',
	type: dia.DataType.INTEGER,
	default: 30,
	private: true
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'label',
	type: dia.DataType.STRING,
	default: ''
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'fontColor',
	type: dia.DataType.STRING,
	default: '#000'
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'fontFamily',
	type: dia.DataType.STRING,
	default: 'Arial'
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'fontSize',
	type: dia.DataType.INTEGER,
	default: 14
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'backgroundColor',
	type: dia.DataType.STRING,
	default: '#ffffff'
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'borderColor',
	type: dia.DataType.STRING,
	default: '#000'
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'borderThickness',
	type: dia.DataType.INTEGER,
	default: 1
}));

dia.generic.CIRCLE.setRepresentationFactory(function(element, repr){
	repr.addRenderable(new dia.Renderable(function(c){
		c.fillStyle = element.getProperty('backgroundColor');
		c.strokeStyle = element.getProperty('borderColor');
		c.lineWidth = element.getProperty('borderThickness');
		
		c.beginPath();
		c.arc(
			element.getProperty('x'),
			element.getProperty('y'),
			element.getProperty('radius'),
			0,
			2 * Math.PI,
			true
		);
		c.fill();
		c.stroke();
		
		c.textAlign = 'center';
		c.textBaseline = 'middle';
		c.font = element.getProperty('fontSize') + 'pt ' + element.getProperty('fontFamily');
		c.fillStyle = element.getProperty('fontColor');
		c.fillText(
			element.getProperty('label'),
			element.getProperty('x'),
			element.getProperty('y')
		);
	}));

	repr.area = new dia.RectangleArea({
		x: function(){ return element.getProperty('x') - element.getProperty('radius'); },
		y: function(){ return element.getProperty('y') - element.getProperty('radius'); },
		width: function(){ return element.getProperty('radius') * 2; },
		height: function(){ return element.getProperty('radius') * 2; },
	});

	var handle = new dia.MoveElementDragHandle(element, repr.area, 'points');
	repr.addHandle(handle);
});

dia.generic.CIRCLE.creatorTool = new dia.CreateTool({
	type: dia.generic.CIRCLE,
	mouseDown: function(sheet, x, y){
		var element = this.type.create({
			x: x,
			y: y
		});
		sheet.addElement(element);
		this.dispatch('elementcreated');
	}
});
