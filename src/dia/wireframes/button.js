dia.wireframes = dia.wireframes || {};

dia.wireframes.BUTTON = new dia.ElementType({
	id: 'wireframes.BUTTON',
	label: 'Button',
	layer: 2
});
dia.wireframes.BUTTON.addProperty(new dia.Property({
	id: 'x',
	type: dia.DataType.INTEGER,
	default: 0,
	private: true
}));
dia.wireframes.BUTTON.addProperty(new dia.Property({
	id: 'y',
	type: dia.DataType.INTEGER,
	default: 0,
	private: true
}));
dia.wireframes.BUTTON.addProperty(new dia.Property({
	id: 'width',
	type: dia.DataType.INTEGER,
	default: 100,
	private: true
}));
dia.wireframes.BUTTON.addProperty(new dia.Property({
	id: 'height',
	type: dia.DataType.INTEGER,
	default: 20,
	private: true
}));
dia.wireframes.BUTTON.addProperty(new dia.Property({
	id: 'title',
	type: dia.DataType.STRING,
	default: 'Button',
	label: 'Button title'
}));
dia.wireframes.BUTTON.setRepresentationFactory(function(element, representation){
	var lineHeight = 16;
	var padding = 5;

	var font = '8pt Courier';

	representation.cachedRequiredWidth = null;
	representation.cachedRequiredHeight = null;

	var getWidth = function(){
		return Math.max(element.getProperty('width'), 20);
	};
	var getHeight = function(){
		return Math.max(element.getProperty('height'), 20);
	};

	representation.addRenderable(new dia.Renderable(function(c){
		c.translate(element.getProperty('x'), element.getProperty('y'));

		var width = getWidth();
		var height = getHeight();

		c.fillStyle = '#ffffff';
		c.fillRect(0, 0, element.getProperty('width'), element.getProperty('height'));

		c.fillStyle = '#000';
		c.fillRect(0, 0, width, 1);
		c.fillRect(0, height, width, 1);
		c.fillRect(0, 0, 1, height);
		c.fillRect(width, 0, 1, height);

		c.fillStyle = '#000';
		c.textBaseline = 'middle';
		c.font = font;
		c.textAlign = 'center';
		c.fillText(element.getProperty('title'), element.getProperty('width') / 2, element.getProperty('height') / 2);
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
		minWidth: function(){ return 20; },
		minHeight: function(){ return 20; }
	});
});

dia.wireframes.BUTTON.addTool(new dia.CreateTool({
	type: dia.wireframes.BUTTON,
	mouseDown: function(sheet, x, y){
		var element = this.type.emptyElement();
		element.setProperty('x', ~~x);
		element.setProperty('y', ~~y);
		sheet.addElement(element);

		this.dispatch('elementcreated');
	}
}));

dia.wireframes.BUTTON.addSetupFunction(function(element){
	element.listen('propertychange', function(e){
		if(e.property.id === 'attributes' || e.property.id === 'methods' || e.property.id === 'title'){
			var repr = element.getRepresentation();
			repr.cachedRequiredWidth = null;
			repr.cachedRequiredHeight = null;
		}
	});
});
