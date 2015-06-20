describe('a graphical representation', function(){
	it('is initialized correctly', function(){
		var element = new dia.Element(new dia.ElementType());
		var repr = new dia.GraphicalRepresentation(element);
		
		expect(repr.renderables).toEqual([]);
		expect(repr.guides).toEqual([]);
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
	
	it('can be rendered properly', function(){
		var element = new dia.Element(new dia.ElementType());
		var repr = new dia.GraphicalRepresentation(element);
		
		var paramRenderable = null,
			paramHandle = null;
		repr.addRenderable(new dia.Renderable(function(p){
			paramRenderable = p;
		}));
		
		var handle = new dia.DragHandle(element, new dia.Area());
		handle.render = function(p){
			paramHandle = p;
		};
		repr.addHandle(handle);
		
		var ctx = {
			save: function(){},
			restore: function(){}
		};
		
		repr.render(ctx);
		
		expect(paramRenderable).toBe(ctx);
		expect(paramHandle).toBe(null);
		
		// Let's render when highlighted
		paramRenderable = null;
		element.highlighted = true;
		
		repr.render(ctx);
		
		expect(paramRenderable).toBe(ctx);
		expect(paramHandle).toBe(ctx);
   	});
});
