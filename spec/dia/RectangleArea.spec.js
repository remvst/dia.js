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
	
	it('can find its own relative center', function(){
		var area = new dia.RectangleArea({
			x: function(){ return 100; },
			y: function(){ return 200; },
			width: function(){ return 300; },
			height: function(){ return 400; }
		});
		
		expect(area.getRelativeCenter()).toEqual({ x: 150, y: 200 });
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
	
	it('can deal with negative width/height', function(){
		var area = new dia.RectangleArea({
			x: function(){ return 400; },
			y: function(){ return 600; },
			width: function(){ return -300; },
			height: function(){ return -400; }
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
	
	it('can check for intersection with other rectangle areas', function(){
		var area1 = new dia.RectangleArea({
			x: function(){ return 0; },
			y: function(){ return 0; },
			width: function(){ return 100; },
			height: function(){ return 100; }
		});
		var area2 = new dia.RectangleArea({
			x: function(){ return 0; },
			y: function(){ return 100; },
			width: function(){ return 100; },
			height: function(){ return 100; }
		});
		var area3 = new dia.RectangleArea({
			x: function(){ return 50; },
			y: function(){ return 50; },
			width: function(){ return 100; },
			height: function(){ return 100; }
		});
		
		expect(area1.intersectsWith(area2)).toBe(false);
		expect(area2.intersectsWith(area1)).toBe(false);
		
		expect(area1.intersectsWith(area3)).toBe(true);
		expect(area3.intersectsWith(area1)).toBe(true);
		
		expect(area2.intersectsWith(area3)).toBe(true);
		expect(area3.intersectsWith(area2)).toBe(true);
	});
	
	it('has a correct surface', function(){
		var area = new dia.RectangleArea({
			x: function(){ return 0; },
			y: function(){ return 0; },
			width: function(){ return 2; },
			height: function(){ return 5; }
		});
		
		expect(area.surface()).toBe(10);
	});
});
