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
});
