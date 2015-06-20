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
	
	it('can move an element', function(){
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
		
		handle.dragStart(0, 0);
		handle.dragMove(5, -3);
		
		expect(element.getProperty('x')).toBe(6);
		expect(element.getProperty('y')).toBe(-1);
	});
	
	it('will snap elements to each other', function(){
		var snapCount = 0;
		
		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'x',
			default: 0
		}));
		type.addProperty(new dia.Property({
			id: 'y',
			default: 0
		}));
		type.setRepresentationFactory(function(element, repr){
			var guide = new dia.Guide();
			guide.shouldSnap = function(other, delta){
				return other.element.getProperty('x') === guide.element.getProperty('x');
			};
			guide.snap = function(){
				snapCount++;
			};
			guide.element = element;
			
			repr.guides = [guide];
		});
		
		var sheet = new dia.Sheet();
		
		var element1 = type.emptyElement();
		sheet.addElement(element1);
		
		var element2 = type.emptyElement();
		sheet.addElement(element2);
		
		element1.setProperty('x', 0);
		element2.setProperty('x', 10);
		
		var handle = new dia.MoveElementDragHandle(element1);
		
		handle.dragStart(0, 0);
		handle.dragMove(2, 0);
		
		expect(snapCount).toBe(0);
		
		handle.dragMove(8, 0);
		
		expect(snapCount).toBe(1);
	});
	
});
