describe('a move anchor drag handle', function(){
	it('is initialized properly', function(){
		var element = new dia.ElementType().emptyElement();
		
		var area = new dia.Area();
		var handle = new dia.MoveAnchorDragHandle(element, area, 'anchor');
		
		
		expect(handle.property).toBe('anchor');
		expect(handle.area).toBe(area);
		expect(handle.element).toBe(element);
	});
	
	it('can move the anchor', function(){
		var sheet = new dia.Sheet();
		
		var anchoredType = new dia.ElementType({
			id: 'anchored'
		});
		
		var anchored1 = anchoredType.emptyElement();
		anchored1.getRepresentation().area = new dia.Area();
		anchored1.getRepresentation().area.contains = function(x, y){ return x === 20; };
		sheet.addElement(anchored1);
		
		var anchored2 = anchoredType.emptyElement();
		anchored2.getRepresentation().area = new dia.Area();
		anchored2.getRepresentation().area.contains = function(x, y){ return x === 40; };
		sheet.addElement(anchored2);
		
		var type = new dia.ElementType({
			id: 'anchoring'
		});
		type.addProperty(new dia.Property({
			id: 'anchor'
		}));
		
		var element = type.create({
			anchor: {
				element: anchored1.id,
				x: 10,
				y: 10
			}
		});
		sheet.addElement(element);
		
		var area = new dia.Area();
		var handle = new dia.MoveAnchorDragHandle(element, area, 'anchor');
		
		// Let's move and drop within the same element
		handle.dragStart();
		handle.dragMove(10, 20);
		handle.dragDrop();
		
		expect(element.getProperty('anchor')).toEqual({
			element: anchored1.id,
			x: 20,
			y: 30
		});
		
		// Let's move and drop outside the element
		handle.dragStart();
		handle.dragMove(10, 0);
		handle.dragDrop();
		
		expect(element.getProperty('anchor')).toEqual({
			element: anchored1.id,
			x: 30,
			y: 30
		});
		
		// Let's move and drop on the other element
		handle.dragStart();
		handle.dragMove(10, 0);
		handle.dragDrop();
		
		expect(element.getProperty('anchor')).toEqual({
			element: anchored2.id,
			x: 40,
			y: 30
		});
	});
});
