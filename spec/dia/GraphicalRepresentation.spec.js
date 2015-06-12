describe('a graphical representation', function(){
	it('is initialized correctly', function(){
		var element = new dia.Element(new dia.ElementType());
		var repr = new dia.GraphicalRepresentation(element);
		
		expect(repr.renderables).toEqual([]);
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
		repr.addRenderable(primitive);
		
		expect(repr.renderables).toEqual([primitive]);
	});
	
	it('can be added drag handles', function(){
		var element = new dia.Element(new dia.ElementType());
		var repr = new dia.GraphicalRepresentation(element);
		
		var handle = new dia.DragHandle(element);
		repr.addHandle(handle);
		
		expect(repr.handles).toEqual([handle]);
	});
});
