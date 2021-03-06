describe('a vertical guide', function(){
	it('can be instantiated', function(){
		var element = new dia.ElementType().emptyElement();
		
		var guide = new dia.VerticalGuide({
			element: element,
			x: function(){ return 10; },
			y: function(){ return 15; },
			offset: function(){ return 20; }
		});
		
		expect(guide.type).toBe('vertical');
		expect(guide.element).toBe(element);
		expect(guide.getX()).toBe(10);
		expect(guide.getY()).toBe(15);
		expect(guide.getOffset()).toBe(20);
	});
	
	it('should snap to another one', function(){
		var guide1 = new dia.VerticalGuide({
			element: null,
			x: function(){ return 10; },
			offset: function(){ return 20; }
		});
		var guide2 = new dia.VerticalGuide({
			element: null,
			x: function(){ return 13; },
			offset: function(){ return 20; }
		});
		var guide3 = new dia.VerticalGuide({
			element: null,
			x: function(){ return 17; },
			offset: function(){ return 20; }
		});
		var guide4 = new dia.Guide();
		
		expect(guide1.shouldSnap(guide2)).toBe(true);
		expect(guide1.shouldSnap(guide3)).toBe(false);
		expect(guide1.shouldSnap(guide4)).toBe(false);
		
		expect(guide2.shouldSnap(guide3)).toBe(true);
		expect(guide2.shouldSnap(guide4)).toBe(false);
		
		expect(guide3.shouldSnap(guide4)).toBe(false);
	});
	
	it('can snap to another one', function(){
		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'x',
			type: dia.DataType.INTEGER,
			default: 0
		}));
		
		var element = type.emptyElement();
		
		var guide1 = new dia.VerticalGuide({
			element: element,
			x: function(){ return this.element.getProperty('x'); },
			offset: function(){ return 10; }
		});
		var guide2 = new dia.VerticalGuide({
			element: null,
			x: function(){ return 50; },
			offset: function(){ return 20; }
		});
		
		guide1.snap(guide2);
		
		expect(element.getProperty('x')).toBe(40);
		
	});
});
