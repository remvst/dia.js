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
		expect(sheet.gridSize).toBe(10);

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

		var event,
			event2;
		sheet.listen('elementadded', function(e){
			event = e;
		});
		element.listen('addedtosheet', function(e){
			event2 = e;
		});

		sheet.addElement(element);
		sheet.addElement(element);

		expect(sheet.elements).toEqual([element]);
		expect(element.sheet).toBe(sheet);
		expect(event.element).toBe(element);

		expect(event2.sheet).toBe(sheet);
	});

	it('can remove an element', function(){
		var element = new dia.Element(new dia.ElementType());
		var sheet = new dia.Sheet();

		var event,
			event2;
		sheet.listen('elementremoved', function(e){
			event = e;
		});
		element.listen('removedfromsheet', function(e){
			event2 = e;
		});

		sheet.addElement(element);
		sheet.removeElement(element);

		expect(sheet.elements).toEqual([]);
		expect(element.sheet).toBe(null);
		expect(event.element).toBe(element);

		expect(event2.sheet).toBe(sheet);
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
		var element1 = new dia.Element(new dia.ElementType({
			layer: 0
		}));
		var element2 = new dia.Element(new dia.ElementType({
			layer: 1
		}));

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
		sheet.gridSize = 1234;

		sheet.addElement(type.emptyElement());
		sheet.addElement(type.emptyElement());
		sheet.addElement(type.emptyElement());

		var json = sheet.toJSON();

		expect(json.title).toEqual('bar');
		expect(json.elements.length).toBe(3);

		var loaded = dia.Sheet.fromJSON(json);
		delete loaded.id;
		delete sheet.id;
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

	it('can find a handle containing a point', function(){
		var type1 = new dia.ElementType();
		type1.setRepresentationFactory(function(element, repr){
			var area = new dia.Area();
			area.contains = function(x, y){ return x === 0 && y === 1; };

			repr.addHandle(new dia.DragHandle(element, area));
		});

		var type2 = new dia.ElementType();
		type2.setRepresentationFactory(function(element, repr){
			var area = new dia.Area();
			area.contains = function(x, y){ return x === 1 && y === 2; };

			repr.addHandle(new dia.DragHandle(element, area));
		});

		var type3 = new dia.ElementType();
		type3.setRepresentationFactory(function(element, repr){
			var area = new dia.Area();
			area.contains = function(x, y){ return x === 2 && y === 3; };

			repr.addHandle(new dia.DragHandle(element, area));
		});

		var sheet = new dia.Sheet();

		var element1 = type1.emptyElement();
		element1.highlighted = true;
		sheet.addElement(element1);

		var element2 = type2.emptyElement();
		element2.highlighted = true;
		sheet.addElement(element2);

		var element3 = type3.emptyElement();
		sheet.addElement(element3);

		expect(sheet.findHandleContaining(0, 0)).toBe(null);
		expect(sheet.findHandleContaining(0, 1).element).toBe(element1);
		expect(sheet.findHandleContaining(1, 2).element).toBe(element2);
		expect(sheet.findHandleContaining(2, 3)).toBe(null);

		element3.highlighted = true;
		expect(sheet.findHandleContaining(2, 3).element).toBe(element3);
	});

	it('can claim ownership of an element', function(){
		var element = new dia.ElementType().emptyElement();

		var sheet1 = new dia.Sheet();
		var sheet2 = new dia.Sheet();

		sheet1.addElement(element);
		sheet2.addElement(element);

		expect(element.sheet).toBe(sheet2);
		expect(sheet1.elements).toEqual([]);
		expect(sheet2.elements).toEqual([element]);
	});

	it('can be added renderables', function(){
		var ctx = {
				save: function(){},
				restore: function(){}
			},
			param1,
			param2;

		var r1 = new dia.Renderable(function(p){
			param1 = p;
		});
		var r2 = new dia.Renderable(function(p){
			param2 = p;
		});

		var sheet = new dia.Sheet();
		sheet.addRenderable(r1);
		sheet.addRenderable(r2);

		sheet.render(ctx);

		expect(param1).toBe(ctx);
		expect(param2).toBe(ctx);
	});

	it('can be removed renderables', function(){
		var ctx = {
				save: function(){},
				restore: function(){}
			},
			param1,
			param2;

		var r1 = new dia.Renderable(function(p){
			param1 = p;
		});
		var r2 = new dia.Renderable(function(p){
			param2 = p;
		});

		var sheet = new dia.Sheet();
		sheet.addRenderable(r1);
		sheet.addRenderable(r2);

		sheet.removeRenderable(r1);

		sheet.render(ctx);

		expect(param1).toBe(undefined);
		expect(param2).toBe(ctx);
	});
});
