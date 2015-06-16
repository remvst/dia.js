describe('math utilities', function(){
	it('can calculate distances', function(){
		expect(dia.distance(0, 0, 2, 0)).toBe(2);
	});
	
	it('can check betweenness', function(){
		expect(dia.between(0, 1, 2)).toBe(true);
		expect(dia.between(1, 1, 2)).toBe(true);
		expect(dia.between(1, 0, 2)).toBe(false);
		expect(dia.between(1, 2, 2)).toBe(true);
		expect(dia.between(1, .5, 0)).toBe(false);
	});
	
	it('can do limits', function(){
		expect(dia.limit(0, 1, 2)).toBe(1);
		expect(dia.limit(4, 1, 2)).toBe(2);
		expect(dia.limit(1.5, 1, 2)).toBe(1.5);
	});
	
	it('can adjust anchor ratios', function(){
		expect(dia.adjustAnchorRatios({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
		expect(dia.adjustAnchorRatios({ x: .3, y: .2 })).toEqual({ x: .3, y: 0 });
		expect(dia.adjustAnchorRatios({ x: .2, y: .3 })).toEqual({ x: 0, y: .3 });
		expect(dia.adjustAnchorRatios({ x: .7, y: .2 })).toEqual({ x: .7, y: 0 });
		expect(dia.adjustAnchorRatios({ x: .2, y: .7 })).toEqual({ x: 0, y: .7 });
	});
});
