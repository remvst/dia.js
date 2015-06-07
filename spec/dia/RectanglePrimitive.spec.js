describe('a rectangle primitive', function(){
	it('renders correctly', function(){
		var rectType = new dia.ElementType();
		rectType.addProperty(new dia.Property({
			id: 'e.x',
			type: dia.DataType.STRING,
			default: 0
		}));
		rectType.addProperty(new dia.Property({
			id: 'e.y',
			type: dia.DataType.STRING,
			default: 1
		}));
		rectType.addProperty(new dia.Property({
			id: 'e.width',
			type: dia.DataType.STRING,
			default: 2
		}));
		rectType.addProperty(new dia.Property({
			id: 'e.height',
			type: dia.DataType.STRING,
			default: 3
		}));
		var element = rectType.emptyElement();
		var repr = new dia.GraphicalRepresentation(element);
		
		var primitive = new dia.RectanglePrimitive(repr);
		primitive.bind('e.x', 'x');
		primitive.bind('e.y', 'y');
		primitive.bind('e.width', 'width');
		primitive.bind('e.height', 'height');
		
		// Mocking fillRect
		var args = [];
		var fakeCtx = {
			fillRect: function(){
				args.push(Array.prototype.slice.call(arguments));
			},
			strokeRect: function(){
				args.push(Array.prototype.slice.call(arguments));
			}
		};
		
		primitive.render(fakeCtx);
		
		expect(args[0]).toEqual([0,1,2,3]);
		expect(args[1]).toEqual([0,1,2,3]);
	});
});
