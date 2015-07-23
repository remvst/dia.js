dia.wireframes = dia.wireframes || {};

dia.wireframes.WINDOW = new dia.ElementType({
	id: 'wireframes.WINDOW',
	label: 'Window',
	layer: 2
});
dia.wireframes.WINDOW.addProperty(new dia.Property({
	id: 'x',
	type: dia.DataType.INTEGER,
	default: 0,
	private: true
}));
dia.wireframes.WINDOW.addProperty(new dia.Property({
	id: 'y',
	type: dia.DataType.INTEGER,
	default: 0,
	private: true
}));
dia.wireframes.WINDOW.addProperty(new dia.Property({
	id: 'width',
	type: dia.DataType.INTEGER,
	default: 100,
	private: true
}));
dia.wireframes.WINDOW.addProperty(new dia.Property({
	id: 'height',
	type: dia.DataType.INTEGER,
	default: 100,
	private: true
}));
dia.wireframes.WINDOW.addProperty(new dia.Property({
	id: 'title',
	type: dia.DataType.STRING,
	default: 'Untitled window',
	label: 'Window title'
}));
dia.wireframes.WINDOW.setRepresentationFactory(function(element, representation){
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

		var topBarHeight = 20;

		var width = getWidth();
		var height = getHeight();

		c.fillStyle = '#ffffff';
		c.fillRect(0, 0, width, height);

		c.fillStyle = '#000';

		c.fillRect(0, 0, width, 1);
		c.fillRect(0, topBarHeight, width, 1);
		c.fillRect(0, height - 1, width, 1);
		c.fillRect(0, 0, 1, height);
		c.fillRect(width - 1, 0, 1, height);

		for(var i = 0, x = width - topBarHeight / 2 ; i < 3 ; i++, x -= 12){
			c.beginPath();
			c.arc(x, topBarHeight / 2, 5, 0, 2 * Math.PI, true);
			c.fill();
		}

		c.textBaseline = 'middle';
		c.font = font;

		c.textAlign = 'center';
		c.fillText(element.getProperty('title'), width / 2, topBarHeight / 2);
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

dia.wireframes.WINDOW.addTool(new dia.CreateTool({
	type: dia.wireframes.WINDOW,
	mouseDown: function(sheet, x, y){
		var element = this.type.emptyElement();
		element.setProperty('x', ~~x);
		element.setProperty('y', ~~y);
		sheet.addElement(element);

		this.dispatch('elementcreated');
	}
}));
