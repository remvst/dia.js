describe('a primitive', function(){
	it('is initialized correctly', function(){
		var element = new dia.Element(new dia.ElementType());
		var repr = new dia.GraphicalRepresentation(element);
		var primitive = new dia.Primitive(repr);
		
		expect(primitive.representation).toBe(repr);
		expect(primitive.bindings).toEqual({});
	});

	it('can be bound to properties to the element', function(){
		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'title',
			type: dia.DataType.STRING,
			default: 'empty'
		}));
		var element = new dia.Element(type);
		element.setProperty('title', 'mytitle');
		
		var repr = new dia.GraphicalRepresentation(element);
		
		var primitive = new dia.Primitive(repr);
		primitive.bind('title', 'primprop');
		
		expect(primitive.getPropertyValue('primprop')).toEqual('mytitle');
	});
	
	it('cannot get properties that are not bound', function(){
		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'title',
			type: dia.DataType.STRING,
			default: 'empty'
		}));
		var element = new dia.Element(type);
		element.setProperty('title', 'mytitle');
		
		var repr = new dia.GraphicalRepresentation(element);
		
		var primitive = new dia.Primitive(repr);
		
		expect(function(){
			primitive.getPropertyValue('undefprop');
		}).toThrow();
	});
	
	it('can set properties to be required', function(){
		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'title1',
			type: dia.DataType.STRING,
			default: 'empty1'
		}));
		type.addProperty(new dia.Property({
			id: 'title2',
			type: dia.DataType.STRING,
			default: 'empty2'
		}));
		var element = type.emptyElement();
		var repr = new dia.GraphicalRepresentation(element);
		
		var primitive = new dia.Primitive(repr);
		primitive.bind('title1', 'req1');
		
		primitive.requiresBinding('req1');
		
		primitive.requiresBinding('req2');
		
		expect(primitive.fullyBound()).toBe(false);

		primitive.bind('title2', 'req2');
		
		expect(primitive.fullyBound()).toBe(true);
		expect(primitive.getPropertyValue('req1')).toEqual('empty1');
		expect(primitive.getPropertyValue('req2')).toEqual('empty2');
	});
});
