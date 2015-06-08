describe('a sheet', function(){
	it('is initialized correctly', function(){
		var sheet = new dia.Sheet();
		
		expect(sheet.elements).toEqual([]);
		expect(sheet.title).toBe(null);
	});
	
	it('can add elements', function(){
		var element = new dia.Element(new dia.ElementType());
		var sheet = new dia.Sheet();
		
		sheet.addElement(element);
		
		expect(sheet.elements).toEqual([element]);
		expect(element.sheet).toBe(sheet);
	});
	
	it('does not add the same element twice', function(){
		var element = new dia.Element(new dia.ElementType());
		var sheet = new dia.Sheet();
		
		sheet.addElement(element);
		sheet.addElement(element);
		
		expect(sheet.elements).toEqual([element]);
		expect(element.sheet).toBe(sheet);
	});
	
	it('can remove an element', function(){
		var element = new dia.Element(new dia.ElementType());
		var sheet = new dia.Sheet();
		
		sheet.addElement(element);
		sheet.removeElement(element);
		
		expect(sheet.elements).toEqual([]);
		expect(element.sheet).toBe(null);
	});
	
	it('does not remove anything if the element is not in the sheet', function(){
		var element = new dia.Element(new dia.ElementType());
		var sheet = new dia.Sheet();
		
		sheet.addElement(element);
		sheet.removeElement(new dia.Element(new dia.ElementType()));
		
		expect(sheet.elements).toEqual([element]);
		expect(element.sheet).toBe(sheet);
	});
	
	it('renders all elements', function(){
		var element1 = new dia.Element(new dia.ElementType());
		var element2 = new dia.Element(new dia.ElementType());
		
		var render1 = false;
		var render2 = false;
		
		element1.render = function(){ render1 = true; };
		element2.render = function(){ render2 = true; };
		
		var sheet = new dia.Sheet();
		
		sheet.addElement(element1);
		sheet.addElement(element2);
		
		sheet.render();
		
		expect(render1).toBe(true);
		expect(render2).toBe(true);
	});
});
