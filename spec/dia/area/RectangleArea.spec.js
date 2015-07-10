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

	it('can be rendered', function(){
		var area = new dia.RectangleArea({
			x: function(){ return 0; },
			y: function(){ return 0; },
			width: function(){ return 2; },
			height: function(){ return 5; }
		});

		var ctx = {
			strokeRect: function(){}
		};

		expect(function(){
			area.render(ctx);
		}).not.toThrow();
	});

	it('can bind an anchor to its bounds', function(){
		var area = new dia.RectangleArea({
			x: function(){ return 100; },
			y: function(){ return 100; },
			width: function(){ return 200; },
			height: function(){ return 200; }
		});

		expect(area.bindAnchorToBounds({
			x: 50,
			y: 40
		})).toEqual({
			x: 50,
			y: 0,
			angle: -Math.PI / 2
		});

		expect(area.bindAnchorToBounds({
			x: 40,
			y: 50
		})).toEqual({
			x: 0,
			y: 50,
			angle: Math.PI
		});

		expect(area.bindAnchorToBounds({
			x: 160,
			y: 150
		})).toEqual({
			x: 200,
			y: 150,
			angle: 0
		});

		expect(area.bindAnchorToBounds({
			x: 110,
			y: 150
		})).toEqual({
			x: 110,
			y: 200,
			angle: Math.PI / 2
		});
	});

	it('has a relative center', function(){
		var area = new dia.RectangleArea({
			x: function(){ return 100; },
			y: function(){ return 100; },
			width: function(){ return 30; },
			height: function(){ return 30; }
		});

		expect(area.getRelativeCenter()).toEqual({ x: 15, y: 15 });
	});

	it('can create guides for an element', function(){
		var area = new dia.RectangleArea({
			x: function(){ return 100; },
			y: function(){ return 120; },
			width: function(){ return 40; },
			height: function(){ return 30; }
		});

		var element = new dia.ElementType().emptyElement();

		var guides = area.getGuides(element);

		expect(guides[0].element).toBe(element);
		expect(guides[0].getX()).toBe(120);
		expect(guides[0].getY()).toBe(120);
		expect(guides[0].getOffset()).toBe(0);

		expect(guides[1].element).toBe(element);
		expect(guides[1].getX()).toBe(120);
		expect(guides[1].getY()).toBe(150);
		expect(guides[1].getOffset()).toBe(30);

		expect(guides[2].element).toBe(element);
		expect(guides[2].getX()).toBe(100);
		expect(guides[2].getY()).toBe(135);
		expect(guides[2].getOffset()).toBe(0);

		expect(guides[3].element).toBe(element);
		expect(guides[3].getX()).toBe(140);
		expect(guides[3].getY()).toBe(135);
		expect(guides[3].getOffset()).toBe(40);
	});

	it('can contain stuff in its bounds', function(){
		var area = new dia.RectangleArea({
			x: function(){ return 100; },
			y: function(){ return 100; },
			width: function(){ return 30; },
			height: function(){ return 30; }
		});

		expect(area.boundsContain(0, 0)).toBe(false);

		// Left side
		expect(area.boundsContain(100, 0)).toBe(false);
		expect(area.boundsContain(100, 120)).toBe(true);
		expect(area.boundsContain(100, 131)).toBe(false);

		// Right side
		expect(area.boundsContain(130, 0)).toBe(false);
		expect(area.boundsContain(130, 120)).toBe(true);
		expect(area.boundsContain(130, 131)).toBe(false);

		// Top side
		expect(area.boundsContain(50, 100)).toBe(false);
		expect(area.boundsContain(110, 100)).toBe(true);
		expect(area.boundsContain(140, 100)).toBe(false);

		// Bottom side
		expect(area.boundsContain(50, 130)).toBe(false);
		expect(area.boundsContain(110, 130)).toBe(true);
		expect(area.boundsContain(140, 130)).toBe(false);
	});

	it('can optimize a path', function(){
		var area = new dia.RectangleArea({
			x: function(){ return 100; },
			y: function(){ return 100; },
			width: function(){ return 20; },
			height: function(){ return 20; }
		});

		var fromPoint = { x: 100, y: 110 };

		// Destination within the area, no optimization
		expect(area.optimizePath(fromPoint, { x: 110, y: 110 })).toEqual(fromPoint);

		// Destination on the right (horizontal line)
		expect(area.optimizePath(fromPoint, { x: 140, y: 110 })).toEqual({ x: 120, y: 110 });

		// Destination on the left
		expect(area.optimizePath(fromPoint, { x: 0, y: 110 })).toEqual(fromPoint);

		// Destination on the top
		expect(area.optimizePath(fromPoint, { x: 140, y: 150 })).toEqual({ x: 110, y: 120 });

		// Destination at the bottom
		expect(area.optimizePath(fromPoint, { x: 140, y: 70 })).toEqual({ x: 110, y: 100 });
	});

	it('can provide snapshots', function(){
		var x = 100,
			y = 110,
			width = 120,
			height = 130;

		var area = new dia.RectangleArea({
			x: function(){ return x; },
			y: function(){ return y; },
			width: function(){ return width; },
			height: function(){ return height; }
		});

		var snapshot = area.snapshot();

		x /= 2;
		y /= 2;
		width /= 2;
		height /= 2;

		expect(area.getX()).toBe(50);
		expect(area.getY()).toBe(55);
		expect(area.getWidth()).toBe(60);
		expect(area.getHeight()).toBe(65);

		expect(snapshot.getX()).toBe(100);
		expect(snapshot.getY()).toBe(110);
		expect(snapshot.getWidth()).toBe(120);
		expect(snapshot.getHeight()).toBe(130);
	});
});
