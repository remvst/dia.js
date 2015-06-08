describe('a line primitive', function(){
	it('renders correctly', function(){
		var lineType = new dia.ElementType();
		lineType.addProperty(new dia.Property({
			id: 'p1.x',
			type: dia.DataType.INTEGER,
			default: 0
		}));
		lineType.addProperty(new dia.Property({
			id: 'p1.y',
			type: dia.DataType.INTEGER,
			default: 1
		}));
		lineType.addProperty(new dia.Property({
			id: 'p2.x',
			type: dia.DataType.INTEGER,
			default: 2
		}));
		lineType.addProperty(new dia.Property({
			id: 'p2.y',
			type: dia.DataType.INTEGER,
			default: 3
		}));
		var element = lineType.emptyElement();
		var repr = new dia.GraphicalRepresentation(element);
		
		var primitive = new dia.LinePrimitive(repr);
		primitive.bind('p1.x', 'p1.x');
		primitive.bind('p1.y', 'p1.y');
		primitive.bind('p2.x', 'p2.x');
		primitive.bind('p2.y', 'p2.y');
		
		// Mocking fillRect
		var args = [];
		var fakeCtx = {
			moveTo: function(){
				args.push(Array.prototype.slice.call(arguments));
			},
			lineTo: function(){
				args.push(Array.prototype.slice.call(arguments));
			},
			beginPath: function(){},
			stroke: function(){}
		};
		
		primitive.render(fakeCtx);
		
		expect(args[0]).toEqual([
			element.getProperty('p1.x'),
			element.getProperty('p1.y')
		]);
		expect(args[1]).toEqual([
			element.getProperty('p2.x'),
			element.getProperty('p2.y')
		]);
	});
});
