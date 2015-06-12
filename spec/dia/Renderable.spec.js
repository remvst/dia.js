describe('a renderable', function(){
	it('is initialized properly', function(){
		var f = function(){};
		var renderable = new dia.Renderable(f);
		
		expect(renderable.renderFunction).toBe(f);
	});
	
	it('renders correctly', function(){
		var param, saved, restored;
		var f = function(p){
			param = p;
		};
		var renderable = new dia.Renderable(f);
		
		var ctx = {
			save: function(){ saved = true; },
			restore: function(){ restored = true; }
		};
		renderable.render(ctx);
		
		expect(param).toBe(ctx);
		expect(saved).toBe(true);
		expect(restored).toBe(true);
	});
});
