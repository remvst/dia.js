describe('an eeration data type', function(){
	it('is initialized correctly with an array', function(){
		var choices = [1, 2, 3, {}];
		
		var e = new dia.EnumerationDataType(choices);
		
		expect(e.label).toBe('choice');
		expect(e.values).toBe(choices);
	});
	
	it('is initialized correctly with an object', function(){
		var choices = [1, 2, 3, {}];
		
		var e = new dia.EnumerationDataType({
			label: 'mylab',
			values: choices
		});
		
		expect(e.label).toBe('mylab');
		expect(e.values).toBe(choices);
	});
	
	it('does validation correctly', function(){
		var choices = [1, 2, 3, {}];
		var e = new dia.EnumerationDataType(choices);
		
		expect(e.validateValue(choices)).toBe(false);
		expect(e.validateValue(0)).toBe(false);
		expect(e.validateValue({})).toBe(false);
		expect(e.validateValue(1)).toBe(true);
		expect(e.validateValue(2)).toBe(true);
		expect(e.validateValue(3)).toBe(true);
		expect(e.validateValue(choices[3])).toBe(true);
	});
	
	it('does HTML conversions correctly', function(){
		var choices = [1, 2, 3, 'hello'];
		var e = new dia.EnumerationDataType(choices);
		
		var value = ['a', 'b', 'c', 'd'];
		var input = e.createHTMLInput('hello');
		
		expect(input.selectedIndex).toBe(3);
		expect(input.options[0].valueRef).toBe(1);
		expect(input.options[1].valueRef).toBe(2);
		expect(input.options[2].valueRef).toBe(3);
		expect(input.options[3].valueRef).toBe('hello');

		expect(input.options[0].innerHTML).toBe('1');
		expect(input.options[1].innerHTML).toBe('2');
		expect(input.options[2].innerHTML).toBe('3');
		expect(input.options[3].innerHTML).toBe('hello');
		
		expect(e.getValueFromHTMLInput(input)).toBe('hello');
	});
});