describe('a broken line drag handle', function(){
	it('can split the broken line', function(){
		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'points',
			type: dia.DataType.ANY
		}));
		
		var element = type.create({
			points: []
		});
		
		var from = { x: 0, y: 0 };
		var to = { x: 200, y: 0 };
		
		var area = new dia.BrokenLineArea({
			points: function(){
				return [from].concat(element.getProperty('points')).concat([to]);
			}
		});
		
		var handle = new dia.BrokenLineDragHandle(element, area, 'points');
		
		handle.dragStart(100, 0);
		handle.dragMove(0, 100, 100, 100);
		handle.dragDrop(100, 100);
		
		expect(element.getProperty('points')).toEqual([{ x: 100, y: 100 }]);
		
		handle.dragStart(50, 50);
		handle.dragMove(0, 50, 50, 100);
		handle.dragDrop(50, 100);
		
		expect(element.getProperty('points')).toEqual([{ x: 50, y: 100 }, { x: 100, y: 100 }]);
		
		handle.dragStart(150, 50);
		handle.dragMove(0, -50, 150, 0);
		handle.dragDrop(150, 0);
		
		expect(element.getProperty('points')).toEqual([{ x: 50, y: 100 }, { x: 100, y: 100 }, { x: 150, y: 0 }]);
	});
	
	it('can move existing points', function(){
		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'points',
			type: dia.DataType.ANY
		}));
		
		var element = type.create({
			points: []
		});
		
		var from = { x: 0, y: 0 };
		var to = { x: 200, y: 0 };
		
		var area = new dia.BrokenLineArea({
			points: function(){
				return [from].concat(element.getProperty('points')).concat([to]);
			}
		});
		
		var handle = new dia.BrokenLineDragHandle(element, area, 'points');
		
		// Creating one point
		handle.dragStart(100, 0);
		handle.dragMove(0, 100, 100, 100);
		handle.dragDrop(100, 100);
		
		// Moving it back
		handle.dragStart(100, 100);
		handle.dragMove(0, -100, 100, 0);
		handle.dragDrop(100, 0);
		
		expect(element.getProperty('points')).toEqual([{ x: 100, y: 0 }]);
	});
	
	it('can fuse existing points', function(){
		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'points',
			type: dia.DataType.ANY
		}));
		
		var element = type.create({
			points: []
		});
		
		var from = { x: 0, y: 0 };
		var to = { x: 200, y: 0 };
		
		var area = new dia.BrokenLineArea({
			points: function(){
				return [from].concat(element.getProperty('points')).concat([to]);
			}
		});
		
		var handle = new dia.BrokenLineDragHandle(element, area, 'points');
		
		// Creating one point
		handle.dragStart(100, 0);
		handle.dragMove(0, 100, 100, 100);
		handle.dragDrop(100, 100);
		
		// A second one
		handle.dragStart(50, 50);
		handle.dragMove(0, 50, 50, 100);
		handle.dragDrop(50, 100);
		
		expect(element.getProperty('points')).toEqual([{ x: 50, y: 100 }, { x: 100, y: 100 }]);
		
		// Moving the first one into the second
		handle.dragStart(100, 100);
		handle.dragMove(-50, 0, 50, 100);
		handle.dragDrop(50, 100);
		
		expect(element.getProperty('points')).toEqual([{ x: 50, y: 100 }]);
	});
});
