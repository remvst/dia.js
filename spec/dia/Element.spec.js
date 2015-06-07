describe('an element', function(){
	it('is initialized correctly', function(){
		dia.uuid4 = function(){
			return 'uuid'
		};
		
		var type = new dia.ElementType();
		var element = new dia.Element(type);
		
		expect(element.id).toBe('uuid');
		expect(element.sheet).toBe(null);
		expect(element.type).toBe(type);
		expect(element.properties).toEqual({});
	});
	
	it('cannot be initialized without a type', function(){
		expect(function(){
			new dia.Element();
		}).toThrow();
	});

	it('can be set properties', function(){
		var type = new dia.ElementType();
		
		type.addProperty(new dia.Property({
			id: 'title',
			type: dia.DataType.STRING,
			label: 'title',
			description: 'title of the element',
			default: 'empty'
		}));
		var element = new dia.Element(type);
		
		element.setProperty('title', 'myval');
		
		expect(element.getProperty('title')).toEqual('myval');
	});
	
	it('cannot be set properties that are not defined in the type', function(){
		var element = new dia.Element(new dia.ElementType());
		
		expect(function(){
			element.setProperty('title', 'myval');
		}).toThrow();
	});
	
	it('cannot get properties that are not defined in the type', function(){
		var element = new dia.Element(new dia.ElementType());
		
		expect(function(){
			element.getProperty('title');
		}).toThrow();
	});

	it('can be converted to JSON', function(){
		var type = new dia.ElementType({
			id: 'typeid'
		});
		
		type.addProperty(new dia.Property({
			id: 'title',
			type: dia.DataType.STRING,
			label: 'title',
			description: 'title of the element',
			default: 'empty'
		}));
		var element = new dia.Element(type);
		
		element.setProperty('title', 'myval');
		
		expect(element.toJSON()).toEqual({
			id: element.id,
			type: 'typeid',
			properties: {
				title: 'myval'
			}
		});
	});
	
	it('can be parsed from JSON', function(){
		var type = new dia.ElementType({
			id: 'typeid'
		});
		
		type.addProperty(new dia.Property({
			id: 'title',
			type: dia.DataType.STRING,
			label: 'title',
			description: 'title of the element',
			default: 'empty'
		}));
		var element = new dia.Element(type);
		
		element.setProperty('title', 'myval');
		
		var json = element.toJSON();
		var parsed = dia.Element.fromJSON(json);
		
		expect(parsed.id).toEqual(element.id);
		expect(parsed.type).toEqual(element.type);
		expect(parsed.properties).toEqual(element.properties);
	});
});
