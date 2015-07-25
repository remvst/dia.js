describe('an element type', function(){
	it('is initialized correctly', function(){
		var type = new dia.ElementType();

		expect(type.id).toBe(null);
		expect(type.label).toBe(null);
		expect(type.properties).toEqual([]);
		expect(type.propertyMap).toEqual({});
		expect(type.tools).toEqual([]);
		expect(type.layer).toBe(2);
		expect(type.group).toBe(null);
	});

	it('is initialized correctly with options', function(){
		var type = new dia.ElementType({
			id: 'mytype',
			label: 'mylabel',
			layer: 3,
			group: 'gr'
		});

		expect(type.id).toEqual('mytype');
		expect(type.label).toEqual('mylabel');
		expect(type.properties).toEqual([]);
		expect(type.propertyMap).toEqual({});
		expect(type.layer).toBe(3);
		expect(type.group).toBe('gr');
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
			id: 'mytypeid',
			group: 'foo'
		});

		expect(dia.ElementType.lookupType('mytypeid')).toBe(type);
		expect(dia.ElementType.getGroup('foo')).toEqual([type]);
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
			label: 'mylabel',
			anchorable: false
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
		type.addFunction(new dia.ElementTypeFunction({
			id: 'someid',
			apply: new Function()
		}));
		type.addSetupFunction(new Function());

		var clone = type.clone({
			id: 'otherid'
		});

		expect(clone).not.toBe(type);
		expect(clone.id).toEqual('otherid');
		expect(clone.label).toEqual(type.label);
		expect(clone.anchorable).toEqual(type.anchorable);
		expect(clone.properties[0]).toEqual(type.properties[0]);
		expect(clone.properties[1]).toEqual(type.properties[1]);
		expect(clone.properties[0]).not.toBe(type.properties[0]);
		expect(clone.properties[1]).not.toBe(type.properties[1]);
		expect(clone.creatorTool).not.toBe(type.creatorTool);
		expect(clone.creatorTool.type).toBe(clone);
		expect(clone.functionMap).not.toBe(type.functionMap);
		expect(clone.getFunction('someid')).toBeTruthy();
		expect(clone.setupFunctions).not.toBe(type.setupFunctions);
		expect(clone.setupFunctions).toEqual(type.setupFunctions);
		expect(clone.tools).not.toBe(type.tools);
		expect(clone.tools).toEqual(type.tools);
	});

	it('can have functions', function(){
		var type = new dia.ElementType();

		var fn = new dia.ElementTypeFunction({
			id: 'someid',
			apply: new Function()
		});

		type.addFunction(fn);
		expect(type.getFunction('someid')).toBe(fn);
	});

	it('can have tools', function(){
		var type = new dia.ElementType();
		var tool = new dia.Tool();
		tool.id = 'fooooo';

		type.addTool(tool);

		expect(type.tools).toEqual([tool]);
		expect(type.getTool(tool.id)).toBe(tool);
	});

	it('can have element-specific setup', function(){
		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'myprop',
			default: 1234
		}));

		var prop;
		type.addSetupFunction(function(e){
			prop = e.getProperty('myprop');
		});

		var element = type.emptyElement();
		expect(prop).toBe(undefined);
	});

	it('can copy an element', function(){
		var dataType = new dia.DataType({
			copyValue: function(v, matchMap){
				return {
					'refersTo': matchMap[v.refersTo]
				};
			}
		});

		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'myprop',
			type: dataType
		}));

		var element = type.create({
			'myprop': { 'refersTo': 'id1' }
		});

		var matchMap = {
			'id1': 'id2'
		};
		matchMap[element.id] = 'copiedId';

		var copy = type.copyElement(element, matchMap);

		expect(copy.getProperty('myprop')).toEqual({ 'refersTo': 'id2' });
		expect(copy.id).toBe('copiedId');
	});
});
