describe('an element', function(){
	it('is initialized correctly', function(){
		var uuid4 = dia.uuid4;
		
		dia.uuid4 = function(){
			return 'uuid'
		};
		
		var type = new dia.ElementType();
		var element = new dia.Element(type);
		
		expect(element.id).toBe('uuid');
		expect(element.sheet).toBe(null);
		expect(element.highlighted).toBe(false);
		expect(element.type).toBe(type);
		expect(element.properties).toEqual({});
		
		dia.uuid4 = uuid4;
	});
	
	it('cannot be initialized without a type', function(){
		expect(function(){
			new dia.Element();
		}).toThrow();
	});

	it('can be set properties', function(){
		var type = new dia.ElementType();
		
		var property = new dia.Property({
			id: 'title',
			type: dia.DataType.STRING,
			label: 'title',
			description: 'title of the element',
			default: 'empty'
		});
		type.addProperty(property);
		
		var element = type.emptyElement();
		
		var event;
		element.listen('propertychange', function(e){
			event = e;
		});
		
		element.setProperty('title', 'myval');
		
		expect(element.getProperty('title')).toEqual('myval');
		expect(function(){
			element.setProperty('title', 1);
	   }).toThrow();
		
		expect(event.property).toBe(property);
		expect(event.from).toBe('empty');
		expect(event.to).toBe('myval');
	});
	
	it('does not fire propertychange event when setting to the same value', function(){
		var type = new dia.ElementType();
		
		var property = new dia.Property({
			id: 'title',
			type: dia.DataType.STRING,
			label: 'title',
			description: 'title of the element',
			default: 'empty'
		});
		type.addProperty(property);
		
		var element = type.emptyElement();
		
		var fired = false;
		element.listen('propertychange', function(e){
			fired = true;
		});
		
		element.setProperty('title', 'empty');
		
		expect(fired).toBe(false);
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
		expect(parsed.type.id).toBe(element.type.id);
		expect(parsed.properties).toEqual(element.properties);
	});
	
	it('cannot be contained if no area is specified in the representation', function(){
		var type = new dia.ElementType();
		var element = type.emptyElement();
		
		var area = new dia.RectangleArea({
			x: function(){ return 0; },
			y: function(){ return 0; },
			width: function(){ return 100; },
			height: function(){ return 100; }
		});
		
		expect(element.isContainedIn(area)).toBe(false);
	});
	
	it('can be contained if an area is specified in the representation', function(){
		var type = new dia.ElementType();
		type.setRepresentationFactory(function(element, repr){
			repr.area = new dia.Area();
			repr.area.intersectsWith = function(otherArea){
				return true;
			};
		});
		var element = type.emptyElement();
		
		var area = new dia.RectangleArea({
			x: function(){ return 0; },
			y: function(){ return 0; },
			width: function(){ return 100; },
			height: function(){ return 100; }
		});
		
		expect(element.isContainedIn(area)).toBe(true);
	});
});
