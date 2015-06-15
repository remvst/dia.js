describe('a property', function(){
	it('is initialized correctly', function(){
		var property = new dia.Property();
		
		expect(property.label).toBe(null);
		expect(property.type).toBe(dia.DataType.ANY);
		expect(property.description).toBe(null);
		expect(property.default).toBe(null);
		expect(property.id).toBe(null);
		expect(property.private).toBe(false);
	});
	
	it('is initialized correctly with options', function(){
		var property = new dia.Property({
			id: 'title',
			type: dia.DataType.STRING,
			label: 'label',
			description: 'title of the element',
			default: 'empty',
			private: true
		});
		
		expect(property.id).toEqual('title');
		expect(property.type).toEqual(dia.DataType.STRING);
		expect(property.label).toEqual('label');
		expect(property.description).toEqual('title of the element');
		expect(property.default).toEqual('empty');
		expect(property.private).toBe(true);
	});
	
	it('initializes default with falsy values', function(){
		var propertyInt = new dia.Property({
			id: 'p1',
			type: dia.DataType.INTEGER,
			default: 0
		});
		var propertyString = new dia.Property({
			id: 'p2',
			type: dia.DataType.INTEGER,
			default: ''
		});
		expect(propertyInt.default).toBe(0);
		expect(propertyString.default).toBe('');
	});
	
	it('can be cloned', function(){
		var property = new dia.Property({
			id: 'title',
			type: dia.DataType.STRING,
			label: 'label',
			description: 'title of the element',
			default: 'empty',
			private: true
		});
		
		var clone = property.clone();
		
		expect(clone).not.toBe(property);
		expect(clone).toEqual(property);
	});
});