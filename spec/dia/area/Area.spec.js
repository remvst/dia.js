describe('an area', function(){
	it('contains nothing by default', function(){
		var area = new dia.Area();

		expect(area.contains(0,0)).toBe(false);
		expect(area.contains(10,10)).toBe(false);
	});

	it('intersects with nothing by default', function(){
		var area = new dia.Area();

		expect(area.intersectsWith(area)).toBe(false);
	});

	it('does not contain anything in its bounds', function(){
		var area = new dia.Area();

		expect(area.boundsContain(0, 0)).toBe(false);
	});

	it('does not optimize paths', function(){
		var area = new dia.Area();

		var fromPoint = { x: 0, y: 0 };
		var toPoint = { x: 100, y: 100 };

		expect(area.optimizePath(fromPoint, toPoint)).toEqual(fromPoint);
	});

	it('returns a default snapshot', function(){
		var area = new dia.Area();
		var snapshot = area.snapshot();

		expect(area.snapshot).not.toBe(area);
	});

	it('has no surface', function(){
		var area = new dia.Area();

		expect(area.surface()).toBe(0);
	});

	it('has a default relative center', function(){
		var area = new dia.Area();

		expect(area.getRelativeCenter()).toEqual({ x: 0, y: 0 });
	});

	it('has no guides', function(){
		var area = new dia.Area();

		expect(area.getGuides({})).toEqual([]);
	});
});
