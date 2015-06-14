describe('a broken line area', function(){
	it('is initialized properly', function(){
		var pts = [{ x: 1, y: 1 }, { x: 2, y: 2 }];
		var area = new dia.BrokenLineArea({
			points: function(){ return pts; },
			thickness: 2
		});
		expect(area.type).toBe('brokenline');
		expect(area.getPoints()).toEqual(pts);
	});
	
	it('does intersections with lines properly', function(){
		var pts = [
			{ x: 0, y: 0 },
			{ x: 10, y: 10 },
			{ x: 20, y: 0 },
			{ x: 30, y: 10 }
		];
		var area = new dia.BrokenLineArea({
			points: function(){ return pts; }
		});
		
		var line1 = new dia.LineArea({
			x1: function(){ return 2; },
			y1: function(){ return 7; },
			x2: function(){ return 10; },
			y2: function(){ return 0; },
		});
		var line2 = new dia.LineArea({
			x1: function(){ return 0; },
			y1: function(){ return 10; },
			x2: function(){ return 4; },
			y2: function(){ return 5; },
		});
		
		expect(area.intersectsWith(line1)).toBe(true);
		expect(area.intersectsWith(line2)).toBe(false);
	});
	
	it('checks for containment properly', function(){
		var pts = [
			{ x: 0, y: 0 },
			{ x: 10, y: 10 },
			{ x: 20, y: 0 },
			{ x: 30, y: 10 }
		];
		var area = new dia.BrokenLineArea({
			points: function(){ return pts; },
			thickness: 2
		});
		
		expect(area.contains(5, 10)).toBe(false);
		expect(area.contains(5, 5)).toBe(true);
		expect(area.contains(17.5, 2.5)).toBe(true);
	});
});
