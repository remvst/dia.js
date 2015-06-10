describe('a broken line primitive', function(){
	it('renders correctly', function(){
		var lineType = new dia.ElementType();
		var element = lineType.emptyElement();
		var repr = new dia.GraphicalRepresentation(element);
		
		var points = [
			{x: 0, y: 1},
			{x: 1, y: 2},
			{x: 2, y: 3},
			{x: 3, y: 4},
			{x: 4, y: 5},
			{x: 5, y: 6},
		];
		
		var primitive = new dia.BrokenLinePrimitive(repr);
		primitive.bind('points', function(){
			return points;
		});
		
		// Mocking fillRect
		var args = [];
		var fakeCtx = {
			moveTo: function(x, y){
				args.push({x: x, y: y});
			},
			lineTo: function(x, y){
				args.push({x: x, y: y});
			},
			beginPath: function(){},
			stroke: function(){}
		};
		
		primitive.render(fakeCtx);
		
		expect(args).toEqual(points);
	});
});
