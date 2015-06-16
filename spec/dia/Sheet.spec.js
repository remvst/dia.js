describe('a sheet', function(){
	it('is initialized correctly', function(){
		var uuid4 = dia.uuid4;
		
		dia.uuid4 = function(){
			return 'uuid';
		};
		
		var sheet = new dia.Sheet();
		
		expect(sheet.elements).toEqual([]);
		expect(sheet.title).toBe(null);
		expect(sheet.id).toBe('uuid');
		
		dia.uuid4 = uuid4;
	});
	
	it('can add elements', function(){
		var element = new dia.Element(new dia.ElementType());
		var sheet = new dia.Sheet();
		
		sheet.addElement(element);
		
		expect(sheet.elements).toEqual([element]);
		expect(element.sheet).toBe(sheet);
		expect(sheet.getElement(element.id)).toBe(element);
	});
	
	it('does not add the same element twice', function(){
		var element = new dia.Element(new dia.ElementType());
		var sheet = new dia.Sheet();
		
		var event;
		sheet.listen('elementadded', function(e){
			event = e;
		});
		
		sheet.addElement(element);
		sheet.addElement(element);
		
		expect(sheet.elements).toEqual([element]);
		expect(element.sheet).toBe(sheet);
		expect(event.element).toBe(element);
	});
	
	it('can remove an element', function(){
		var element = new dia.Element(new dia.ElementType());
		var sheet = new dia.Sheet();
		
		var event;
		sheet.listen('elementremoved', function(e){
			event = e;
		});
		
		sheet.addElement(element);
		sheet.removeElement(element);
		
		expect(sheet.elements).toEqual([]);
		expect(element.sheet).toBe(null);
		expect(event.element).toBe(element);
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
	
	it('can be saved to JSON', function(){
		var type = new dia.ElementType({
			id: 'foo'
		});
		
		var sheet = new dia.Sheet();
		sheet.title = 'bar';
		
		sheet.addElement(type.emptyElement());
		sheet.addElement(type.emptyElement());
		sheet.addElement(type.emptyElement());
		
		var json = sheet.toJSON();
		
		expect(json.title).toEqual('bar');
		expect(json.elements.length).toBe(3);
		
		var loaded = dia.Sheet.fromJSON(json);
		expect(loaded).toEqual(sheet);
	});
	
	it('can find an element containing a point', function(){
		var type1 = new dia.ElementType();
		type1.setRepresentationFactory(function(element, repr){
			repr.area = new dia.Area();
			repr.area.contains = function(x, y){ return x === 0 && y === 1; };
		});
		
		var type2 = new dia.ElementType();
		type2.setRepresentationFactory(function(element, repr){
			repr.area = new dia.Area();
			repr.area.contains = function(x, y){ return x === 1 && y === 2; };
		});
		
		var sheet = new dia.Sheet();
		
		var element1 = type1.emptyElement();
		sheet.addElement(element1);
		
		var element2 = type2.emptyElement();
		sheet.addElement(element2);
		
		expect(sheet.findElementContaining(0, 0)).toBe(null);
		expect(sheet.findElementContaining(0, 1)).toBe(element1);
		expect(sheet.findElementContaining(1, 2)).toBe(element2);
	});
});
