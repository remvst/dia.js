describe('a move element drag handle', function(){
	it('cannot be initialized without an element', function(){
		expect(function(){
			new dia.MoveElementDragHandle();
		}).toThrow();
	});
	
	it('cannot be bound to an element with no x or y', function(){
		var element = new dia.Element(new dia.ElementType());
		
		expect(function(){
			new dia.MoveElementDragHandle(element);	
		}).toThrow();
	});
	
	it('cannot be bound to an element with no x or y', function(){
		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'x',
			default: 1
		}));
		type.addProperty(new dia.Property({
			id: 'y',
			default: 2
		}));
		
		var element = type.emptyElement();
		var handle = new dia.MoveElementDragHandle(element);
		
		expect(element.getProperty('x')).toBe(1);
		expect(element.getProperty('y')).toBe(2);
		
		handle.dragMove(5, -3);
		
		expect(element.getProperty('x')).toBe(6);
		expect(element.getProperty('y')).toBe(-1);
	});
	
});
