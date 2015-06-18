describe('a circle area', function(){
	it('is initialized properly', function(){
		var area = new dia.CircleArea({
			x: function(){ return 1 },
			y: function(){ return 2 },
			radius: function(){ return 3 },
		});
		
		expect(area.type).toBe('circle');
		expect(area.getX()).toBe(1);
		expect(area.getY()).toBe(2);
		expect(area.getRadius()).toBe(3);
	});
	
	it('checks for containment properly', function(){
		var area = new dia.CircleArea({
			x: function(){ return 10 },
			y: function(){ return 20 },
			radius: function(){ return 10 },
		});
		
		expect(area.contains(10, 20)).toBe(true);
		expect(area.contains(20, 20)).toBe(true);
		expect(area.contains(0, 20)).toBe(true);
		expect(area.contains(0, 0)).toBe(false);
		expect(area.contains(0, 30)).toBe(false);
	});
	
	it('has the right surface', function(){
		var area = new dia.CircleArea({
			x: function(){ return 10 },
			y: function(){ return 20 },
			radius: function(){ return 10 },
		});
		
		expect(area.surface()).toBe(Math.PI * 100);
	});
	
	it('can be rendered', function(){
		var area = new dia.CircleArea({
			x: function(){ return 10 },
			y: function(){ return 20 },
			radius: function(){ return 10 },
		});
		
		var ctx = {
			beginPath: function(){},
			arc: function(){},
			stroke: function(){}
		};
		
		expect(function(){
			area.render(ctx);
		}).not.toThrow();
	});
	
	it('can bind an anchor to its bounds', function(){
		var area = new dia.CircleArea({
			x: function(){ return 10 },
			y: function(){ return 20 },
			radius: function(){ return 10 }
		});
		
		expect(area.bindAnchorToBounds({
			x: 5,
			y: 0
		})).toEqual({
			x: 10,
			y: 0
		});
		
		// Floating point numbers make testing this harder
	});
	
	it('can calculate an absolute position from a relative one', function(){
		var area = new dia.CircleArea({
			x: function(){ return 10 },
			y: function(){ return 20 },
			radius: function(){ return 10 }
		});
		
		expect(area.getAbsolutePositionFromRelative(0, 0)).toEqual({ x: 10, y: 20 });
		expect(area.getAbsolutePositionFromRelative(20, 30)).toEqual({ x: 30, y: 50 });
	});
	
	it('can check for collisions with other rectangle areas', function(){
		var area1 = new dia.RectangleArea({
			x: function(){ return -8; },
			y: function(){ return 0; },
			width: function(){ return -100; },
			height: function(){ return -100; }
		});
		var area2 = new dia.RectangleArea({
			x: function(){ return 8; },
			y: function(){ return 8; },
			width: function(){ return 100; },
			height: function(){ return 100; }
		});
		var area3 = new dia.RectangleArea({
			x: function(){ return -2; },
			y: function(){ return 9; },
			width: function(){ return 4; },
			height: function(){ return 100; }
		});
		var area4 = new dia.RectangleArea({
			x: function(){ return -20; },
			y: function(){ return -10; },
			width: function(){ return 100; },
			height: function(){ return 100; }
		});
		
		var circle = new dia.CircleArea({
			x: function(){ return 0; },
			y: function(){ return 0; },
			radius: function(){ return 10; }
		});
		
		expect(circle.intersectsWith(area1)).toBe(true);
		expect(circle.intersectsWith(area2)).toBe(false);
		expect(circle.intersectsWith(area3)).toBe(true);
		expect(circle.intersectsWith(area4)).toBe(true);
	});
});
