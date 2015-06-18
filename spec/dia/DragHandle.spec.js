describe('a drag handle', function(){
	it('is initialized properly', function(){
		var element = new dia.Element(new dia.ElementType());
		var area = new dia.Area();
		var handle = new dia.DragHandle(element, area);
		
		expect(handle.element).toBe(element);
		expect(handle.area).toBe(area);
	});
	
	it('cannot be initialized without an element', function(){
		expect(function(){
			new dia.DragHandle();
		}).toThrow();
	});
	
	it('can be rendered', function(){
		var element = new dia.Element(new dia.ElementType());
		var area = new dia.Area();
		var handle = new dia.DragHandle(element, area);
		
		var param;
		area.render = function(p){
			param = p;
		};
		
		var ctx = {};
		handle.render(ctx);
		
		expect(param).toBe(ctx);
	});
	
	it('has default empty implementations', function(){
		var element = new dia.Element(new dia.ElementType());
		var area = new dia.Area();
		var handle = new dia.DragHandle(element, area);
		
		expect(function(){
			handle.dragStart();
			handle.dragMove();
			handle.dragDrop();
		}).not.toThrow();
	});
});
