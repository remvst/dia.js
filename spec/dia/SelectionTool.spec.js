describe('a selection tool', function(){
	it('is initialized properly', function(){
		var tool = new dia.SelectionTool();
		
		expect(tool.currentSelection).toEqual([]);
		expect(tool.id).toEqual('select');
	});
	
	it('can select some elements', function(){
		var rectangleType = new dia.ElementType();
		rectangleType.addProperty(new dia.Property({
			id: 'x',
			type: dia.DataType.INTEGER,
			default: 0
		}));
		rectangleType.addProperty(new dia.Property({
			id: 'y',
			type: dia.DataType.INTEGER,
			default: 0
		}));
		rectangleType.addProperty(new dia.Property({
			id: 'width',
			type: dia.DataType.INTEGER,
			default: 10
		}));
		rectangleType.addProperty(new dia.Property({
			id: 'height',
			type: dia.DataType.INTEGER,
			default: 10
		}));
		rectangleType.setRepresentationFactory(function(element){
			var repr = new dia.GraphicalRepresentation(element);
			
			repr.area = new dia.RectangleArea({
				x: function(){ return element.getProperty('x'); },
				y: function(){ return element.getProperty('y'); },
				width: function(){ return element.getProperty('width'); },
				height: function(){ return element.getProperty('height'); }
			});
			
			return repr;
		});
		
		var sheet = new dia.Sheet();
		
		var element1 = rectangleType.emptyElement();
		element1.setProperty('x', 10);
		element1.setProperty('y', 10);
		sheet.addElement(element1);
		
		var element2 = rectangleType.emptyElement();
		element2.setProperty('x', 10);
		element2.setProperty('y', 100);
		sheet.addElement(element2);
		
		var tool = new dia.SelectionTool();
		
		var eventFired = 0;
		tool.listen('selectionchange', function(){
			eventFired++;
		});
		
		tool.mouseDown(sheet, 0, 0);
		tool.mouseUp(sheet, 0, 0);
		expect(tool.currentSelection).toEqual([]);
		expect(eventFired).toBe(1);
		
		tool.mouseDown(sheet, 0, 0);
		tool.mouseMove(sheet, 15, 15);
		tool.mouseUp(sheet, 15, 15);
		expect(tool.currentSelection).toEqual([element1]);
		expect(eventFired).toBe(2);
		
		tool.mouseDown(sheet, 0, 0);
		tool.mouseUp(sheet, 0, 0);
		expect(tool.currentSelection).toEqual([]);
		expect(eventFired).toBe(3);
		
		tool.mouseDown(sheet, 0, 0);
		tool.mouseMove(sheet, 200, 200);
		tool.mouseUp(sheet, 200, 200);
		expect(tool.currentSelection).toEqual([element1, element2]);
		expect(eventFired).toBe(4);
		
		tool.mouseDown(sheet, 0, 100);
		tool.mouseMove(sheet, 200, 200);
		tool.mouseUp(sheet, 200, 200);
		expect(tool.currentSelection).toEqual([element2]);
		expect(eventFired).toBe(5);
	});
	
	it('can perform double clicks', function(){
		var rectangleType = new dia.ElementType();
		rectangleType.addProperty(new dia.Property({
			id: 'x',
			type: dia.DataType.INTEGER,
			default: 0
		}));
		rectangleType.addProperty(new dia.Property({
			id: 'y',
			type: dia.DataType.INTEGER,
			default: 0
		}));
		rectangleType.addProperty(new dia.Property({
			id: 'width',
			type: dia.DataType.INTEGER,
			default: 10
		}));
		rectangleType.addProperty(new dia.Property({
			id: 'height',
			type: dia.DataType.INTEGER,
			default: 10
		}));
		rectangleType.setRepresentationFactory(function(element){
			var repr = new dia.GraphicalRepresentation(element);
			
			repr.area = new dia.RectangleArea({
				x: function(){ return element.getProperty('x'); },
				y: function(){ return element.getProperty('y'); },
				width: function(){ return element.getProperty('width'); },
				height: function(){ return element.getProperty('height'); }
			});
			
			return repr;
		});
		
		var sheet = new dia.Sheet();
		
		var element = rectangleType.emptyElement();
		sheet.addElement(element);
		
		var tool = new dia.SelectionTool();
		
		var event;
		tool.listen('click', function(e){
			event = e;
		});
		
		tool.mouseDown(sheet, 5, 5);
		tool.mouseUp(sheet, 5, 5);
		
		tool.mouseDown(sheet, 5, 5);
		tool.mouseUp(sheet, 5, 5);
		
		expect(event.element).toBe(element);
		expect(event.clickCount).toBe(2);
	});
	
	it('does not perform slow double clicks', function(){
		var sheet = new dia.Sheet();
		var tool = new dia.SelectionTool();
		
		var event;
		tool.listen('click', function(e){
		 	event = e;
		});
		
		Date.now = function(){ return 0; };
		tool.mouseDown(sheet, 5, 5);
		tool.mouseUp(sheet, 5, 5);
		
		Date.now = function(){ return 1000; };
		tool.mouseDown(sheet, 5, 5);
		tool.mouseUp(sheet, 5, 5);
		
		expect(event.clickCount).toBe(1);
	});
	
	it('does not perform double clicks when moving the mouse', function(){
		var sheet = new dia.Sheet();
		var tool = new dia.SelectionTool();
		
		var event;
		tool.listen('click', function(e){
		 	event = e;
		});
		
		tool.mouseDown(sheet, 5, 5);
		tool.mouseUp(sheet, 5, 5);
		tool.mouseMove(sheet, 10, 10);
		
		tool.mouseDown(sheet, 5, 5);
		tool.mouseUp(sheet, 5, 5);
		
		expect(event.clickCount).toBe(1);
	});
});
