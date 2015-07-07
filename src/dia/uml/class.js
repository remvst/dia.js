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
	id: 'width',
	type: dia.DataType.INTEGER,
	default: 100,
	private: true
}));
dia.uml.CLASS.addProperty(new dia.Property({
	id: 'height',
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
	type: dia.uml.TYPED_METHOD_ARRAY,
	default: [],
	label: 'Instance methods'
}));
dia.uml.CLASS.setRepresentationFactory(function(element, representation){
	var lineHeight = 16;
	var padding = 5;

	var font = '8pt Courier';

	representation.cachedRequiredWidth = null;
	representation.cachedRequiredHeight = null;

	var getWidth = function(){
		return Math.max(element.getProperty('width'), getRequiredWidth());
	};
	var getHeight = function(){
		return Math.max(element.getProperty('height'), getRequiredHeight());
	};

	var getRequiredWidth = function(){
		if(representation.cachedRequiredWidth === null){
			representation.cachedRequiredWidth = dia.measureFontWidth(font, element.getProperty('title'));
			element.getProperty('attributes').forEach(function(attr){
				var s = dia.uml.TYPED_ATTRIBUTE.toString(attr);
				representation.cachedRequiredWidth = Math.max(representation.cachedRequiredWidth, dia.measureFontWidth(font, s));
			});
			element.getProperty('methods').forEach(function(method){
				var s = dia.uml.TYPED_METHOD.toString(method);
				representation.cachedRequiredWidth = Math.max(representation.cachedRequiredWidth, dia.measureFontWidth(font, s));
			});
			representation.cachedRequiredWidth = ~~(representation.cachedRequiredWidth + 2 * padding);
		}
		return representation.cachedRequiredWidth;
	};

	var getRequiredHeight = function(){
		if(representation.cachedRequiredHeight === null){
			representation.cachedRequiredHeight = lineHeight * (1 + Math.max(1, element.getProperty('methods').length)
							 					+ Math.max(1, element.getProperty('attributes').length));
		}
		return representation.cachedRequiredHeight;
	};

	representation.addRenderable(new dia.Renderable(function(c){
		c.translate(element.getProperty('x'), element.getProperty('y'));

		var width = getWidth();
		var height = getHeight();

		c.fillStyle = '#ffffff';
		c.fillRect(0, 0, width, height);

		c.fillStyle = '#000';

		var bottomAttributesY = lineHeight * (Math.max(1, element.getProperty('attributes').length) + 1);
		var topMethodsY = height - lineHeight * Math.max(1, element.getProperty('methods').length);

		c.fillRect(0, 0, width, 1);
		c.fillRect(0, height - 1, width, 1);
		c.fillRect(0, lineHeight, width, 1);
		c.fillRect(0, (bottomAttributesY + topMethodsY) / 2, width, 1);

		c.fillRect(0, 0, 1, height);
		c.fillRect(width - 1, 0, 1, height);

		c.textBaseline = 'middle';
		c.font = font;

		c.textAlign = 'center';
		c.fillText(element.getProperty('title'), width / 2, lineHeight / 2);

		c.textAlign = 'left';

		var y = 1.5 * lineHeight,
			attrs = element.getProperty('attributes'),
			methods = element.getProperty('methods'),
			s;
		for(var i = 0 ; i < attrs.length ; i++){
			s = dia.uml.TYPED_ATTRIBUTE.toString(attrs[i]);
			c.fillText(s, padding, y);

			y += lineHeight;
		}

		y = topMethodsY;
		for(var i = 0 ; i < methods.length ; i++){
			s = dia.uml.TYPED_METHOD.toString(methods[i]);
			c.fillText(s, padding, y);

			y += lineHeight;
		}
	}));

	var area = new dia.RectangleArea({
		x: function(){ return element.getProperty('x'); },
		y: function(){ return element.getProperty('y'); },
		width: getWidth,
		height: getHeight
	});

	representation.moveHandle = new dia.MoveElementDragHandle(element, area);
	representation.addHandle(representation.moveHandle);

	representation.area = area;
});

dia.uml.CLASS.addTool(new dia.CreateTool({
	type: dia.uml.CLASS,
	mouseDown: function(sheet, x, y){
		var element = this.type.emptyElement();
		element.setProperty('x', x);
		element.setProperty('y', y);
		sheet.addElement(element);

		this.dispatch('elementcreated');
	}
}));

dia.uml.CLASS.addSetupFunction(function(element){
	element.listen('propertychange', function(e){
		if(e.property.id === 'attributes' || e.property.id === 'methods' || e.property.id === 'title'){
			var repr = element.getRepresentation();
			repr.cachedRequiredWidth = null;
			repr.cachedRequiredHeight = null;
		}
	});
});
