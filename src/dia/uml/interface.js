dia.uml = dia.uml || {};

dia.uml.INTERFACE = new dia.ElementType({
	id: 'uml.interface',
	label: 'Interface'
});
dia.uml.INTERFACE.addProperty(new dia.Property({
	id: 'x',
	type: dia.DataType.INTEGER,
	default: 50,
	private: true
}));
dia.uml.INTERFACE.addProperty(new dia.Property({
	id: 'y',
	type: dia.DataType.INTEGER,
	default: 100,
	private: true
}));
dia.uml.INTERFACE.addProperty(new dia.Property({
	id: 'title',
	type: dia.DataType.STRING,
	default: 'interface',
	label: 'Interface title'
}));
dia.uml.INTERFACE.addProperty(new dia.Property({
	id: 'methods',
	type: dia.DataType.STRING_ARRAY,
	default: [],
	label: 'Instance methods'
}));
dia.uml.INTERFACE.setRepresentationFactory(function(element, representation){
	var lineHeight = 20;
	var padding = 10;

	var getRequiredWidth = function(){
		var maxLength = element.getProperty('title').length;
		element.getProperty('methods').forEach(function(attr){
			maxLength = Math.max(maxLength, attr.length);
		});
		return maxLength * 10 + 2 * padding;
	};

	var getRequiredHeight = function(){
		return lineHeight * (1 + Math.max(1, element.getProperty('methods').length));
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

		c.fillRect(0, 0, 1, height);
		c.fillRect(width - 1, 0, 1, height);

		c.textBaseline = 'middle';
		c.font = '10pt Arial';

		c.textAlign = 'center';
		c.fillText(element.getProperty('title'), width / 2, lineHeight / 2);

		c.textAlign = 'left';

		var y = 1.5 * lineHeight;
		var lines = element.getProperty('methods');
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

dia.uml.INTERFACE.creatorTool = new dia.CreateTool({
	type: dia.uml.INTERFACE,
	mouseDown: function(sheet, x, y){
		var element = this.type.emptyElement();
		element.setProperty('x', x);
		element.setProperty('y', y);
		sheet.addElement(element);

		this.dispatch('elementcreated');
	}
});
