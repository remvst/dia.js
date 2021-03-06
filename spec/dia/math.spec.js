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
	
	it('can snap', function(){
		expect(dia.snap(0, 10)).toBe(0);
		expect(dia.snap(1, 10)).toBe(0);
		expect(dia.snap(-1, 10)).toBe(0);
		expect(dia.snap(4, 10)).toBe(0);
		expect(dia.snap(5, 10)).toBe(10);
		expect(dia.snap(6, 10)).toBe(10);
		expect(dia.snap(10, 10)).toBe(10);
		expect(dia.snap(10, -10)).toBe(10);
		expect(dia.snap(1, -10)).toBe(0);
	});
});
