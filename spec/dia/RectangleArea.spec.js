describe('a rectangle area', function(){
	it('is initialized properly', function(){
		var area = new dia.RectangleArea({
			x: function(){ return 100; },
			y: function(){ return 200; },
			width: function(){ return 300; },
			height: function(){ return 400; }
		});
		
		expect(area.getX()).toEqual(100);
		expect(area.getY()).toEqual(200);
		expect(area.getWidth()).toEqual(300);
		expect(area.getHeight()).toEqual(400);
	});
	
	it('checks containment correctly', function(){
		var area = new dia.RectangleArea({
			x: function(){ return 100; },
			y: function(){ return 200; },
			width: function(){ return 300; },
			height: function(){ return 400; }
		});
		
		expect(area.contains(0, 0)).toBe(false);
		expect(area.contains(0, 100)).toBe(false);
		expect(area.contains(100, 100)).toBe(false);
		expect(area.contains(100, 200)).toBe(true);
		expect(area.contains(150, 230)).toBe(true);
		expect(area.contains(400, 600)).toBe(true);
		expect(area.contains(500, 600)).toBe(false);
		expect(area.contains(300, 700)).toBe(false);
	});
});
