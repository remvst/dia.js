describe('an element type', function(){
	it('is initialized correctly', function(){
		var type = new dia.ElementType();
		
		expect(type.id).toBe(null);
		expect(type.label).toBe(null);
		expect(type.properties).toEqual([]);
		expect(type.propertyMap).toEqual({});
		expect(type.creatorTool).toBe(null);
	});
	
	it('is initialized correctly with options', function(){
		var type = new dia.ElementType({
			id: 'mytype',
			label: 'mylabel'
		});
		
		expect(type.id).toEqual('mytype');
		expect(type.label).toEqual('mylabel');
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
		var renderable = new dia.Renderable(function(){});
		
		var rectType = new dia.ElementType();
		rectType.setRepresentationFactory(function(element, repr){
			repr.addRenderable(renderable);
		});
		
		var element = rectType.emptyElement();
		var repr = element.getRepresentation();
		
		expect(repr.renderables[0]).toBe(renderable);
	});
	
	it('can extend its representation factory', function(){
		var renderable = new dia.Renderable(function(){});
		
		var rectType = new dia.ElementType();
		rectType.setRepresentationFactory(function(element, repr){
			repr.foo = [];
		});
		rectType.extendRepresentationFactory(function(element, repr){
			repr.foo.push(1);
		});
		rectType.extendRepresentationFactory(function(element, repr){
			repr.foo.push(2);
		});
		
		var element = rectType.emptyElement();
		var repr = element.getRepresentation();
		
		expect(repr.foo).toEqual([1, 2]);
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
	
	it('can generate an element with properties', function(){
		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'prop',
			type: dia.DataType.INTEGER,
			default: null
		}));
		
		// Let's just check emptyElement() fails
		expect(function(){
			type.emptyElement();
		}).toThrow();
		
		var element = type.create({
			prop: 123
		});
		
		expect(element.getProperty('prop')).toBe(123);
	});
	
	it('can be cloned', function(){
		var type = new dia.ElementType({
			id: 'myid',
			label: 'mylabel'
		});
		type.addProperty(new dia.Property({
			id: 'x',
			type: dia.DataType.INTEGER,
			default: 0
		}));
		type.addProperty(new dia.Property({
			id: 'y',
			type: dia.DataType.INTEGER,
			default: 1
		}));
		type.setRepresentationFactory(function(element){
			repr.addRenderable(new dia.RectanglePrimitive(repr));
		});
		type.creatorTool = new dia.CreateTool({
			type: type
		});
		type.addElementDependencies(function(){
			return [];
		});
		
		var clone = type.clone({
			id: 'otherid'
		});
		
		expect(clone).not.toBe(type);
		expect(clone.id).toEqual('otherid');
		expect(clone.label).toEqual(type.label);
		expect(clone.properties[0]).toEqual(type.properties[0]);
		expect(clone.properties[1]).toEqual(type.properties[1]);
		expect(clone.properties[0]).not.toBe(type.properties[0]);
		expect(clone.properties[1]).not.toBe(type.properties[1]);
		expect(clone.creatorTool).not.toBe(type.creatorTool);
		expect(clone.creatorTool.type).toBe(clone);
		expect(clone.dependencyFunctions).not.toBe(type.dependencyFunctions);
		expect(clone.dependencyFunctions).toEqual(type.dependencyFunctions);
	});
	
	it('can specify element dependencies', function(){
		var type = new dia.ElementType();
		
		var param = null;
		type.addElementDependencies(function(p){
			expect(p).toBe(element);
			return ['foo', 'bar'];
		});
		type.addElementDependencies(function(p){
			expect(p).toBe(element);
			return ['yolo'];
		});
		
		var element = type.emptyElement();
		
		expect(type.getElementDependencies(element)).toEqual(['foo', 'bar', 'yolo']);
	});
});