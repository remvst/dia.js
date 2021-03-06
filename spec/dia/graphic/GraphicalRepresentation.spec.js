describe('a graphical representation', function(){
	it('is initialized correctly', function(){
		var element = new dia.Element(new dia.ElementType());
		var repr = new dia.GraphicalRepresentation(element);

		expect(repr.renderables).toEqual([]);
		expect(repr.handles).toEqual([]);
		expect(repr.guides).toEqual([]);
		expect(repr.area).toEqual(null);
		expect(repr.moveHandle).toEqual(null);
	});

	it('cannot be initialized without an element', function(){
		expect(function(){
			new dia.GraphicalRepresentation();
		}).toThrow();
	});

	it('can be added renderables', function(){
		var element = new dia.Element(new dia.ElementType());
		var repr = new dia.GraphicalRepresentation(element);

		var renderable = new dia.Renderable(function(){});
		repr.addRenderable(renderable);

		expect(repr.renderables).toEqual([renderable]);
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
