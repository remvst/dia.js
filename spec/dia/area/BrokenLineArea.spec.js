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
	
	it('can be rendered', function(){
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
		
		var ctx = {
			beginPath: function(){},
			moveTo: function(){},
			lineTo: function(){},
			stroke: function(){}
		};
		
		expect(function(){
			area.render(ctx);
		}).not.toThrow();
	});
	
	it('has the correct surface and length', function(){
		var pts = [
			{ x: 0, y: 0 },
			{ x: 10, y: 0 },
			{ x: 20, y: 0 },
			{ x: 30, y: 0 }
		];
		var area = new dia.BrokenLineArea({
			points: function(){ return pts; },
			thickness: 2
		});
		
		expect(area.getLength()).toEqual(30);
		expect(area.surface()).toEqual(30 * 2);
	});
	
	it('can calculate positions at specific ratios', function(){
		var pts = [
			{ x: 0, y: 0 },
			{ x: 10, y: -10 },
			{ x: 20, y: 0 },
			{ x: 30, y: -10 }
		];
		var area = new dia.BrokenLineArea({
			points: function(){ return pts; },
			thickness: 2
		});
		
		var round = function(p){
			p.x = Math.round(p.x);
			p.y = Math.round(p.y);
			return p;
		};
		
		expect(round(area.getPositionAtRatio(0))).toEqual({ x: 0, y: 0 });
		expect(round(area.getPositionAtRatio(.5))).toEqual({ x: 15, y: -5 });
		expect(round(area.getPositionAtRatio(1))).toEqual({ x: 30, y: -10 });
		
		expect(round(area.getPositionAtRatio(1 / 3))).toEqual({ x: 10, y: -10 });
		expect(round(area.getPositionAtRatio(2 / 3))).toEqual({ x: 20, y: 0 });
		
		expect(round(area.getPositionAtRatio(1 / 6))).toEqual({ x: 5, y: -5 });
		expect(round(area.getPositionAtRatio(5 / 6))).toEqual({ x: 25, y: -5 });
	});
	
	it('can intersect with a rectangle', function(){
		var pts = [
			{ x: 0, y: 0 },
			{ x: 10, y: 0 },
			{ x: 20, y: 0 },
			{ x: 30, y: 0 }
		];
		var area = new dia.BrokenLineArea({
			points: function(){ return pts; },
			thickness: 2
		});
		
		var rectangle1 = new dia.RectangleArea({
			x: function(){ return -1; },
			y: function(){ return -1; },
			width: function(){ return 10; },
			height: function(){ return 10; }
		});
		
		var rectangle2 = new dia.RectangleArea({
			x: function(){ return -1; },
			y: function(){ return -1; },
			width: function(){ return -10; },
			height: function(){ return -10; }
		});
		
		var rectangle3 = new dia.RectangleArea({
			x: function(){ return 5; },
			y: function(){ return 5; },
			width: function(){ return 10; },
			height: function(){ return -10; }
		});
		
		expect(area.intersectsWith(rectangle1)).toBe(true);
		expect(area.intersectsWith(rectangle2)).toBe(false);
		expect(area.intersectsWith(rectangle3)).toBe(true);
	});
});
