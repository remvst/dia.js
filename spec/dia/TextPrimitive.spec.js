describe('a text primitive', function(){
	it('renders correctly', function(){
		var repr = new dia.GraphicalRepresentation(new dia.Element(new dia.ElementType()));
		
		var primitive = new dia.TextPrimitive(repr);
		primitive.bind('x', 0);
		primitive.bind('y', 0);
		primitive.bind('text', function(){
			return "hello\nthis\nis\na test";
		});
		
		// Mocking fillRect
		var lines = 0;
		var fakeCtx = {
			fillText: function(){
				lines++;
			}
		};
		
		primitive.render(fakeCtx);
		
		expect(lines).toEqual(4);
	});
});
