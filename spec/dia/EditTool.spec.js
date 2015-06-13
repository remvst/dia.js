describe('an edit tool', function(){
	it('is initialized properly', function(){
		var tool = new dia.EditTool();
		
		expect(tool.currentHandle).toBe(null);
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
		
		var im = new dia.InteractionManager(sheet);
		im.setTool(tool);
		
		im.mouseDown(200,200);
		expect(tool.currentHandle).toBe(null);
		
		im.mouseDown(50, 50);
		expect(tool.currentHandle.element).toBe(element);
		expect(tool.currentPosition).toEqual({x: 50, y: 50});
		
		im.mouseMove(100, 120);
		expect(element.getProperty('x')).toBe(50);
		expect(element.getProperty('y')).toBe(70);
		expect(tool.currentPosition).toEqual({x: 100, y: 120});
		
		im.mouseMove(50, 50);
		expect(element.getProperty('x')).toBe(0);
		expect(element.getProperty('y')).toBe(0);
		expect(tool.currentPosition).toEqual({x: 50, y: 50});
		
		im.mouseUp();
		expect(element.getProperty('x')).toBe(0);
		expect(element.getProperty('y')).toBe(0);
		expect(tool.currentHandle).toBe(null);
		expect(tool.currentPosition).toEqual({x: 50, y: 50});
	});
});
