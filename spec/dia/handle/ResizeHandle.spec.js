describe('a resize handle', function(){
	it('is initialized correctly', function(){
		var type = new dia.ElementType();
		var element = type.emptyElement();
		var area = new dia.Area();
		var coveredArea = new dia.Area();

		var handle = new dia.ResizeHandle(element, area, {
			type: 1234,
			area: coveredArea,
			minWidth: function(){ return 10; },
			minHeight: function(){ return 15; }
		});

		expect(handle.element).toBe(element);
		expect(handle.area).toBe(area);
		expect(handle.coveredArea).toBe(coveredArea);
	});

	it('can automatically be setup for elements', function(){
		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'x',
			default: 0
		}));
		type.addProperty(new dia.Property({
			id: 'y',
			default: 0
		}));
		type.addProperty(new dia.Property({
			id: 'width',
			default: 0
		}));
		type.addProperty(new dia.Property({
			id: 'height',
			default: 0
		}));

		var element = type.create({
			x: 10,
			y: 15,
			width: 7,
			height: 12
		});
		var repr = element.getRepresentation();

		dia.ResizeHandle.setupElement(element, repr, new dia.Area(), {
			x: function(){ return element.getProperty('x'); },
			y: function(){ return element.getProperty('y'); },
			width: function(){ return element.getProperty('width'); },
			height: function(){ return element.getProperty('height'); },
			size: 2
		});

		expect(repr.handles.length).toBe(8);
	});
});
