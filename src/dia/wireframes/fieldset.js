dia.wireframes = dia.wireframes || {};

dia.wireframes.FIELDSET = new dia.ElementType({
	id: 'wireframes.FIELDSET',
	label: 'Fieldset',
	layer: 2
});
dia.wireframes.FIELDSET.addProperty(new dia.Property({
	id: 'x',
	type: dia.DataType.INTEGER,
	default: 0,
	private: true
}));
dia.wireframes.FIELDSET.addProperty(new dia.Property({
	id: 'y',
	type: dia.DataType.INTEGER,
	default: 0,
	private: true
}));
dia.wireframes.FIELDSET.addProperty(new dia.Property({
	id: 'width',
	type: dia.DataType.INTEGER,
	default: 100,
	private: true
}));
dia.wireframes.FIELDSET.addProperty(new dia.Property({
	id: 'height',
	type: dia.DataType.INTEGER,
	default: 100,
	private: true
}));
dia.wireframes.FIELDSET.addProperty(new dia.Property({
	id: 'title',
	type: dia.DataType.STRING,
	default: 'Fieldset',
	label: 'Fieldset title'
}));
dia.wireframes.FIELDSET.setRepresentationFactory(function(element, representation){
	var lineHeight = 16;
	var padding = 5;

	var font = '8pt Courier';

	representation.cachedRequiredWidth = null;
	representation.cachedRequiredHeight = null;

	var getWidth = function(){
		return Math.max(element.getProperty('width'), 50);
	};
	var getHeight = function(){
		return Math.max(element.getProperty('height'), 50);
	};

	representation.addRenderable(new dia.Renderable(function(c){
		c.translate(element.getProperty('x'), element.getProperty('y'));

		var padding = 10;

		var width = getWidth();
		var height = getHeight();

		c.fillStyle = '#000';

		c.fillRect(padding, padding, width - 2 * padding, 1);
		c.fillRect(padding, height - padding, width - 2 * padding + 1, 1);
		c.fillRect(padding, padding, 1, height - 2 * padding);
		c.fillRect(width - padding, padding, 1, height - 2 * padding);

		var titleWidth = dia.measureFontWidth(font, element.getProperty('title'));
		c.fillStyle = '#ffffff';
		c.fillRect(2 * padding, 1, titleWidth, 2 * padding - 2);

		c.fillStyle = '#000';
		c.textBaseline = 'middle';
		c.font = font;
		c.textAlign = 'left';
		c.fillText(element.getProperty('title'), 2 * padding, padding);
	}));

	representation.area = new dia.RectangleArea({
		x: function(){ return element.getProperty('x'); },
		y: function(){ return element.getProperty('y'); },
		width: getWidth,
		height: getHeight
	});

	representation.guides = representation.area.getGuides(element);

	representation.moveHandle = new dia.MoveElementDragHandle(element, representation.area);
	representation.addHandle(representation.moveHandle);

	dia.ResizeHandle.setupElement(element, representation, representation.area, {
		setX: function(x){ element.setProperty('x', x); },
		setY: function(y){ element.setProperty('y', y); },
		setWidth: function(w){ element.setProperty('width', w); },
		setHeight: function(h){ element.setProperty('height', h); },
		minWidth: function(){ return 50; },
		minHeight: function(){ return 50; }
	});
});

dia.wireframes.FIELDSET.addTool(new dia.CreateTool({
	type: dia.wireframes.FIELDSET,
	mouseDown: function(sheet, x, y){
		var element = this.type.emptyElement();
		element.setProperty('x', ~~x);
		element.setProperty('y', ~~y);
		sheet.addElement(element);

		this.dispatch('elementcreated');
	}
}));
