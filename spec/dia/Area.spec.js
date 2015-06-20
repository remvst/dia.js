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
		
		expect(area.createGuides()).toEqual([]);
	});
	
	it('can have specified guides', function(){
		var area = new dia.Area();
		
		var createCalls = 0;
		area.createGuides = function(){
			createCalls++;
			return [1, 2];
		};
		
		expect(area.getGuides()).toEqual([1, 2]);
		expect(createCalls).toBe(1);
	});
});
