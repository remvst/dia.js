describe('an element type', function(){
	it('is initialized correctly', function(){
		var type = new dia.ElementType();
		
		expect(type.id).toBe(null);
		expect(type.properties).toEqual([]);
		expect(type.propertyMap).toEqual({});
	});
	
	it('is initialized correctly with options', function(){
		var type = new dia.ElementType({
			id: 'mytype'
		});
		
		expect(type.id).toEqual('mytype');
		expect(type.properties).toEqual([]);
		expect(type.propertyMap).toEqual({});
	});
	
	it('can have properties', function(){
		var type = new dia.ElementType();
		
		var property = new dia.Property({
			id: 'title',
			type: dia.DataType.STRING,
			label: 'title',
			description: 'title of the element',
			default: 'empty'
		});
		
		type.addProperty(property);
		
		expect(type.properties).toEqual([property]);
		expect(type.propertyMap).toEqual({'title': property});
		expect(type.hasPropertyId('title')).toBe(true);
		expect(type.hasPropertyId('other')).toBe(false);
	});
	
	it('can return an empty element', function(){
		var type = new dia.ElementType();
		
		type.addProperty(new dia.Property({
			id: 'title',
			type: dia.DataType.STRING,
			label: 'title',
			description: 'title of the element',
			default: 'empty'
		}));
		
		var element = type.emptyElement();
		
		expect(element.type).toBe(type);
		expect(element.properties.title).toEqual('empty');
	});
	
	it('can have a representation factory', function(){
		var rectType = new dia.ElementType();
		rectType.addProperty(new dia.Property({
			id: 'e.x',
			type: dia.DataType.STRING,
			default: 0
		}));
		rectType.addProperty(new dia.Property({
			id: 'e.y',
			type: dia.DataType.STRING,
			default: 1
		}));
		rectType.addProperty(new dia.Property({
			id: 'e.width',
			type: dia.DataType.STRING,
			default: 2
		}));
		rectType.addProperty(new dia.Property({
			id: 'e.height',
			type: dia.DataType.STRING,
			default: 3
		}));
		rectType.setRepresentationFactory(function(element){
			var repr = new dia.GraphicalRepresentation(element);
			repr.addPrimitive(new dia.RectanglePrimitive(repr));
			return repr;
		});
		
		var element = rectType.emptyElement();
		var repr = element.getRepresentation();
		
		expect(repr.primitives[0].render).toBe(dia.RectanglePrimitive.prototype.render);
	});
	
	it('is automatically registered upon instanciation', function(){
		var type = new dia.ElementType({
			id: 'mytypeid'
		});
		
		expect(dia.ElementType.lookupType('mytypeid')).toBe(type);
	});
	
	it('is not registered if no ID is specified', function(){
		var type = new dia.ElementType();
		
		expect(function(){
			dia.ElementType.register(type);
		}).toThrow();
	});
});
