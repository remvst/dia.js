describe('a renderable', function(){
	it('is initialized properly', function(){
		var f = function(){};
		var renderable = new dia.Renderable(f);
		
		expect(renderable.renderFunction).toBe(f);
	});
	
	it('renders correctly', function(){
		var param;
		var f = function(p){
			param = p;
		};
		var renderable = new dia.Renderable(f);
		
		var ctx = {};
		renderable.render(ctx);
		
		expect(param).toBe(ctx);
	});
});
