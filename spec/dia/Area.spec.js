describe('an area', function(){
	it('contains nothing by default', function(){
		var area = new dia.Area();
		
		expect(area.contains(0,0)).toBe(false);
		expect(area.contains(10,10)).toBe(false);
	});
});
