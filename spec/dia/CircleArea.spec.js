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
});
