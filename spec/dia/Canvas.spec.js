describe('a canvas', function(){
	it('is initialized correctly', function(){
		var sheet = new dia.Sheet();
		var canvas = new dia.Canvas(sheet);
		
		expect(canvas.width).toBe(0);
		expect(canvas.height).toBe(0);
		expect(canvas.offsetX).toBe(0);
		expect(canvas.offsetY).toBe(0);
	});
	
	it('can be set new dimensions', function(){
		var sheet = new dia.Sheet();
		var canvas = new dia.Canvas(sheet);
		
		canvas.setDimensions(100, 200);
		
		expect(canvas.width).toBe(100);
		expect(canvas.height).toBe(200);
	});
	
	it('renders properly', function(){
		var sheet = new dia.Sheet();
		var canvas = new dia.Canvas(sheet);
		
		canvas.offsetX = 200;
		canvas.offsetY = 100;
		
		canvas.setDimensions(100, 200);
		
		var translateParams;
		var ctx = {
			save: function(){},
			restore: function(){},
			translate: function(){
				translateParams = Array.prototype.slice.call(arguments, 0);
			},
			fillRect: function(){}
		};
		
		canvas.render(ctx);
		
		expect(translateParams).toEqual([200, 100]);
	});
});
