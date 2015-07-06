dia.uml = dia.uml || {};

dia.uml.INTERFACE = new dia.ElementType({
	id: 'uml.interface',
	label: 'Interface',
	layer: 2
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
	type: dia.uml.TYPED_METHOD_ARRAY,
	default: [],
	label: 'Instance methods'
}));
dia.uml.INTERFACE.setRepresentationFactory(function(element, representation){
	var lineHeight = 20;
	var padding = 10;

	var font = '10pt Courier';
	var label = '<<interface>>';

	representation.cachedRequiredWidth = null;
	representation.cachedRequiredHeight = null;

	var getRequiredWidth = function(){
		if(representation.cachedRequiredWidth === null){
			representation.cachedRequiredWidth = dia.measureFontWidth(font, element.getProperty('title'));
			element.getProperty('methods').forEach(function(method){
				var s = dia.uml.TYPED_METHOD.toString(method);
				representation.cachedRequiredWidth = Math.max(representation.cachedRequiredWidth, dia.measureFontWidth(font, s));
			});
			representation.cachedRequiredWidth = Math.max(representation.cachedRequiredWidth, dia.measureFontWidth(font, label));
			representation.cachedRequiredWidth = ~~(representation.cachedRequiredWidth + 2 * padding);
		}
		return representation.cachedRequiredWidth;
	};

	var getRequiredHeight = function(){
		if(representation.cachedRequiredHeight === null){
			representation.cachedRequiredHeight = lineHeight
												* (2 + Math.max(1, element.getProperty('methods').length));
		}
		return representation.cachedRequiredHeight;
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
		c.fillRect(0, lineHeight * 2, width, 1);

		c.fillRect(0, 0, 1, height);
		c.fillRect(width - 1, 0, 1, height);

		c.textBaseline = 'middle';
		c.font = font;

		c.textAlign = 'center';
		c.fillText(label, width / 2, lineHeight * 0.5);
		c.fillText(element.getProperty('title'), width / 2, lineHeight * 1.5);

		c.textAlign = 'left';

		var y = 2.5 * lineHeight,
			methods = element.getProperty('methods'),
			s;
		for(var i = 0 ; i < methods.length ; i++){
			s = dia.uml.TYPED_METHOD.toString(methods[i]);
			c.fillText(s, padding, y);

			y += lineHeight;
		}
	}));

	var area = new dia.RectangleArea({
		x: function(){ return element.getProperty('x'); },
		y: function(){ return element.getProperty('y'); },
		width: getRequiredWidth,
		height: getRequiredHeight
	});

	representation.moveHandle = new dia.MoveElementDragHandle(element, area);
	representation.addHandle(representation.moveHandle);

	representation.area = area;
});

dia.uml.INTERFACE.addTool(new dia.CreateTool({
	type: dia.uml.INTERFACE,
	mouseDown: function(sheet, x, y){
		var element = this.type.emptyElement();
		element.setProperty('x', x);
		element.setProperty('y', y);
		sheet.addElement(element);

		this.dispatch('elementcreated');
	}
}));

dia.uml.INTERFACE.addSetupFunction(function(element){
	element.listen('propertychange', function(e){
		if(e.property.id === 'methods' || e.property.id === 'title'){
			var repr = element.getRepresentation();
			repr.cachedRequiredWidth = null;
			repr.cachedRequiredHeight = null;
		}
	});
});
