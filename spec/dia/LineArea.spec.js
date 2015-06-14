describe('a line area', function(){
	it('is initialized properly', function(){
		var area = new dia.LineArea({
			x1: function(){ return 1; },
			y1: function(){ return 2; },
			x2: function(){ return 3; },
			y2: function(){ return 4; },
			thickness: 5
		});
		
		expect(area.getX1()).toBe(1);
		expect(area.getY1()).toBe(2);
		expect(area.getX2()).toBe(3);
		expect(area.getY2()).toBe(4);
		expect(area.thickness).toBe(5);
	});
	
	it('can contain points', function(){
		var area = new dia.LineArea({
			x1: function(){ return 0; },
			y1: function(){ return 0; },
			x2: function(){ return 20; },
			y2: function(){ return 20; },
			thickness: 5
		});
		
		expect(area.contains(0, 0)).toBe(true);
		expect(area.contains(10, 10)).toBe(true);
		expect(area.contains(20, 20)).toBe(true);
		expect(area.contains(15, 17)).toBe(true);
		
		expect(area.contains(0, -20)).toBe(false);
		expect(area.contains(-20, -20)).toBe(false);
	});
	
	it('can check for intersection with lines', function(){
		var area1 = new dia.LineArea({
			x1: function(){ return 0; },
			y1: function(){ return 0; },
			x2: function(){ return 20; },
			y2: function(){ return 20; },
			thickness: 5
		});
		var area2 = new dia.LineArea({
			x1: function(){ return 0; },
			y1: function(){ return 20; },
			x2: function(){ return 20; },
			y2: function(){ return 0; },
			thickness: 5
		});
		var area3 = new dia.LineArea({
			x1: function(){ return 0; },
			y1: function(){ return 20; },
			x2: function(){ return 8; },
			y2: function(){ return 12; },
			thickness: 5
		});
		
		expect(area1.intersectsWith(area2)).toBe(true);
		expect(area1.intersectsWith(area3)).toBe(false);
	});
	
	it('can check for intersection with rectangles', function(){
		var rectangle = new dia.RectangleArea({
			x: function(){ return 0; },
			y: function(){ return 0; },
			width: function(){ return 100; },
			height: function(){ return 100; },
		});
		
		// Cuts left side but does not cross
		var line1 = new dia.LineArea({
			x1: function(){ return -10; },
			y1: function(){ return 50; },
			x2: function(){ return 40; },
			y2: function(){ return 50; }
		});
		// Goes through
		var line2 = new dia.LineArea({
			x1: function(){ return -10; },
			y1: function(){ return -10; },
			x2: function(){ return 100; },
			y2: function(){ return 200; }
		});
		// Left side
		var line3 = new dia.LineArea({
			x1: function(){ return -10; },
			y1: function(){ return -10; },
			x2: function(){ return -10; },
			y2: function(){ return 200; }
		});
		
		expect(line1.intersectsWith(rectangle)).toBe(true);
		expect(line2.intersectsWith(rectangle)).toBe(true);
		expect(line3.intersectsWith(rectangle)).toBe(false);
	});
});
