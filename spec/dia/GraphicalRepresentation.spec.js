describe('a graphical representation', function(){
	it('is initialized correctly', function(){
		var element = new dia.Element(new dia.ElementType());
		var repr = new dia.GraphicalRepresentation(element);
		
		expect(repr.primitives).toEqual([]);
	});
	
	it('cannot be initialized without an element', function(){
		expect(function(){
			new dia.GraphicalRepresentation();
		}).toThrow();
	});
	
	it('can be added primitives', function(){
		var element = new dia.Element(new dia.ElementType());
		var repr = new dia.GraphicalRepresentation(element);
		
		var primitive = new dia.Primitive(repr);
		repr.addPrimitive(primitive);
		
		expect(repr.primitives).toEqual([primitive]);
	});
	
	it('can be added drag handles', function(){
		var element = new dia.Element(new dia.ElementType());
		var repr = new dia.GraphicalRepresentation(element);
		
		var handle = new dia.DragHandle(element);
		repr.addHandle(handle);
		
		expect(repr.handles).toEqual([handle]);
	});
});
