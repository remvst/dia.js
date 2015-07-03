dia.uml = dia.uml || {};

dia.uml.CLASS = new dia.ElementType({
	id: 'uml.class',
	label: 'Class',
	layer: 2
});
dia.uml.CLASS.addProperty(new dia.Property({
	id: 'x',
	type: dia.DataType.INTEGER,
	default: 50,
	private: true
}));
dia.uml.CLASS.addProperty(new dia.Property({
	id: 'y',
	type: dia.DataType.INTEGER,
	default: 100,
	private: true
}));
dia.uml.CLASS.addProperty(new dia.Property({
	id: 'title',
	type: dia.DataType.STRING,
	default: 'class',
	label: 'Class title'
}));
dia.uml.CLASS.addProperty(new dia.Property({
	id: 'attributes',
	type: dia.uml.TYPED_ATTRIBUTE_ARRAY,
	default: [],
	label: 'Instance attributes'
}));
dia.uml.CLASS.addProperty(new dia.Property({
	id: 'methods',
	type: dia.DataType.STRING_ARRAY,
	default: [],
	label: 'Instance methods'
}));
dia.uml.CLASS.setRepresentationFactory(function(element, representation){
	var lineHeight = 20;
	var padding = 10;

	var font = '10pt Courier';

	var getRequiredWidth = function(){
		var maxWidth = dia.measureFontWidth(font, element.getProperty('title'));
		element.getProperty('attributes').forEach(function(attr){
			maxWidth = Math.max(maxWidth, dia.measureFontWidth(font, attr));
		});
		element.getProperty('methods').forEach(function(attr){
			maxWidth = Math.max(maxWidth, dia.measureFontWidth(font, attr));
		});
		return ~~maxWidth + 2 * padding;
	};

	var getRequiredHeight = function(){
		return lineHeight * (1 + Math.max(1, element.getProperty('methods').length)
							 + Math.max(1, element.getProperty('attributes').length));
	};

	representation.addRenderable(new dia.Renderable(function(c){
		c.translate(element.getProperty('x'), element.getProperty('y'));

		var width = getRequiredWidth();
		var height = getRequiredHeight();

		c.fillStyle = '#ffffff';
		c.fillRect(0, 0, width, height);

		c.fillStyle = '#000';

		c.fillRect(0, 0, width, 1);
		c.fillRect(0, height - 1, width, 1);
		c.fillRect(0, lineHeight, width, 1);
		c.fillRect(0, lineHeight * (Math.max(1, element.getProperty('attributes').length) + 1), width, 1);

		c.fillRect(0, 0, 1, height);
		c.fillRect(width - 1, 0, 1, height);

		c.textBaseline = 'middle';
		c.font = font;

		c.textAlign = 'center';
		c.fillText(element.getProperty('title'), width / 2, lineHeight / 2);

		c.textAlign = 'left';

		var y = 1.5 * lineHeight;
		var lines = element.getProperty('attributes').concat(element.getProperty('methods'));
		for(var i = 0 ; i < lines.length ; i++){
			c.fillText(lines[i], padding, y);
			y += lineHeight;
		}
	}));

	var area = new dia.RectangleArea({
		x: function(){ return element.getProperty('x'); },
		y: function(){ return element.getProperty('y'); },
		width: getRequiredWidth,
		height: getRequiredHeight
	});

	var moveHandle = new dia.MoveElementDragHandle(element, area);
	representation.addHandle(moveHandle);

	representation.area = area;
});

dia.uml.CLASS.creatorTool = new dia.CreateTool({
	type: dia.uml.CLASS,
	mouseDown: function(sheet, x, y){
		var element = this.type.emptyElement();
		element.setProperty('x', x);
		element.setProperty('y', y);
		sheet.addElement(element);

		this.dispatch('elementcreated');
	}
});
