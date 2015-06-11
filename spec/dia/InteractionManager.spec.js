describe('an interaction manager', function(){
	it('is initialized properly', function(){
		var sheet = new dia.Sheet();
		var im = new dia.InteractionManager(sheet);
		
		expect(im.sheet).toBe(sheet);
		expect(im.currentPosition).toEqual({x: 0, y: 0});
	});
	
	it('cannot be instantiated without a sheet', function(){
		expect(function(){
			new dia.InteractionManager();
		}).toThrow();
	});
	
	it('updates the current position even when not dragging', function(){
		var sheet = new dia.Sheet();
		var im = new dia.InteractionManager(sheet);
		
		expect(im.currentPosition).toEqual({x: 0, y: 0});
		
		im.mouseMove(100, 20);
		
		expect(im.currentPosition).toEqual({x: 100, y: 20});
	});
	
	it('can move objects', function(){
		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'x',
			default: 0
		}));
		type.addProperty(new dia.Property({
			id: 'y',
			default: 0
		}));
		type.setRepresentationFactory(function(element){
			var repr = new dia.GraphicalRepresentation(element);
			
			var area = new dia.RectangleArea({
				x: function(){ return element.getProperty('x'); },
				y: function(){ return element.getProperty('y'); },
				width: function(){ return 100; },
				height: function(){ return 100; }
			});
			var handle = new dia.MoveElementDragHandle(element, area);
			
			repr.addHandle(handle);
			
			return repr;
		});
		
		var sheet = new dia.Sheet();
		
		var element = type.emptyElement();
		sheet.addElement(element);
		
		var im = new dia.InteractionManager(sheet);
		
		im.mouseDown(200,200);
		expect(im.currentHandle).toBe(null);
		
		im.mouseDown(50, 50);
		expect(im.currentHandle.element).toBe(element);
		expect(im.currentPosition).toEqual({x: 50, y: 50});
		
		im.mouseMove(100, 120);
		expect(element.getProperty('x')).toBe(50);
		expect(element.getProperty('y')).toBe(70);
		expect(im.currentPosition).toEqual({x: 100, y: 120});
		
		im.mouseMove(50, 50);
		expect(element.getProperty('x')).toBe(0);
		expect(element.getProperty('y')).toBe(0);
		expect(im.currentPosition).toEqual({x: 50, y: 50});
		
		im.mouseUp();
		expect(element.getProperty('x')).toBe(0);
		expect(element.getProperty('y')).toBe(0);
		expect(im.currentHandle).toBe(null);
		expect(im.currentPosition).toEqual({x: 50, y: 50});
	});
});
