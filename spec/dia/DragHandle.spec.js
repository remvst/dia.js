describe('a drag handle', function(){
	it('is initialized properly', function(){
		var element = new dia.Element(new dia.ElementType());
		var handle = new dia.DragHandle(element);
		
		expect(handle.element).toBe(element);
	});
	
	it('cannot be initialized without an element', function(){
		expect(function(){
			new dia.DragHandle();
		}).toThrow();
	});
});
