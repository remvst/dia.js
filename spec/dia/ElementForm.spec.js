describe('an element form', function(){
	it('is initialized properly', function(){
		var element = new dia.Element(new dia.ElementType());
		
		var form = new dia.ElementForm(element);
		
		expect(form.element).toBe(element);
	});
	
	it('cannot be initialized without an element', function(){
		expect(function(){
			new dia.ElementForm();
		}).toThrow();
   	});
	
	it('can create a basic form', function(){
		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'prop1',
			label: 'label1',
			description: 'description1',
		}));
		type.addProperty(new dia.Property({
			id: 'prop2',
			label: 'label2',
			description: 'description2',
		}));
		var element = type.emptyElement();
		
		element.setProperty('prop1', 'value1');
		element.setProperty('prop2', 'value2');
		
		var form = new dia.ElementForm(element);
		var root = form.getHTMLRoot();
		
		var labels = root.querySelectorAll('label');
		var inputs = root.querySelectorAll('input');
		
		expect(root.children.length).toEqual(2);

		expect(labels[0].innerHTML).toContain('label1');
		expect(labels[1].innerHTML).toContain('label2');

		expect(labels[0].title).toContain('description1');
		expect(labels[1].title).toContain('description2');
		
		expect(inputs[0].value).toEqual('value1');
		expect(inputs[1].value).toEqual('value2');
	});
	
	it('does not create its root twice', function(){
		var type = new dia.ElementType();
		var element = type.emptyElement();
		
		var form = new dia.ElementForm(element);
		var root1 = form.getHTMLRoot();
		var root2 = form.getHTMLRoot();
		
		expect(root1).toBe(root2);
	});
});
