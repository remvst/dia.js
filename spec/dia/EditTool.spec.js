describe('an edit tool', function(){
	it('is initialized properly', function(){
		var tool = new dia.EditTool();
		
		expect(tool.currentHandle).toBe(null);
		expect(tool.id).toBe('edit');
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
		
		var tool = new dia.EditTool();
		
		tool.mouseDown(sheet, 200, 200);
		expect(tool.currentHandle).toBe(null);
		
		tool.mouseDown(sheet, 50, 50);
		expect(tool.currentHandle.element).toBe(element);
		expect(tool.currentPosition).toEqual({x: 50, y: 50});
		
		tool.mouseMove(sheet, 100, 120);
		expect(element.getProperty('x')).toBe(50);
		expect(element.getProperty('y')).toBe(70);
		expect(tool.currentPosition).toEqual({x: 100, y: 120});
		
		tool.mouseMove(sheet, 50, 50);
		expect(element.getProperty('x')).toBe(0);
		expect(element.getProperty('y')).toBe(0);
		expect(tool.currentPosition).toEqual({x: 50, y: 50});
		
		tool.mouseUp(sheet, 50, 50);
		expect(element.getProperty('x')).toBe(0);
		expect(element.getProperty('y')).toBe(0);
		expect(tool.currentHandle).toBe(null);
		expect(tool.currentPosition).toEqual({x: 50, y: 50});
	});
	
	it('always picks the handles with the smallest areas', function(){
		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'x',
			default: 0
		}));
		type.setRepresentationFactory(function(element){
			var repr = new dia.GraphicalRepresentation(element);
			
			var area = new dia.RectangleArea({
				x: function(){ return 0; },
				y: function(){ return 0; },
				width: function(){ return element.getProperty('x'); },
				height: function(){ return element.getProperty('x'); }
			});
			var handle = new dia.DragHandle(element, area);
			repr.addHandle(handle);
			
			return repr;
		});
		
		var sheet = new dia.Sheet();
		
		var smallElement = type.emptyElement();
		smallElement.setProperty('x', 5);
		sheet.addElement(smallElement);
		
		var bigElement = type.emptyElement();
		bigElement.setProperty('x', 10);
		sheet.addElement(bigElement);
		
		var tool = new dia.EditTool();
		
		tool.mouseDown(sheet, 2, 2);
		expect(tool.currentHandle.element).toBe(smallElement);
	});
});
