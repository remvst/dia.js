describe('an array data type', function(){
	it('is initialized correctly', function(){
		var simple = new dia.DataType();
		var complex = new dia.ArrayDataType(simple);
		
		expect(complex.containedType).toBe(simple);
	});
	
	it('does validation correctly', function(){
		var simple = new dia.DataType({
			validate: function(value){
				return value === 'rem';
			}
		});
		var complex = new dia.ArrayDataType(simple);
		
		expect(complex.validateValue([])).toBe(true);
		expect(complex.validateValue(['rem'])).toBe(true);
		expect(complex.validateValue(['rem', 'rem'])).toBe(true);
		expect(complex.validateValue(['rem', 1, 'rem'])).toBe(false);
		expect(complex.validateValue([2, 1])).toBe(false);
	});
	
	it('does JSON imports/exports correctly', function(){
		var simple = new dia.DataType({
			toJSON: function(value){
				return 'json';
			},
			fromJSON: function(value){
				return 'data';
			}
		});
		var complex = new dia.ArrayDataType(simple);
		
		expect(complex.toJSON([1])).toEqual(['json']);
		expect(complex.fromJSON([1])).toEqual(['data']);
	});
	
	it('does HTML conversions correctly', function(){
		var simple = new dia.DataType({
			toHTML: function(value){
				var input = document.createElement('dd');
				input.innerHTML = value;
				return input;
			},
			fromHTML: function(html){
				return html.innerHTML;
			}
		});
		var complex = new dia.ArrayDataType(simple);
		
		var value = ['a', 'b', 'c', 'd'];
		var input = complex.createHTMLInput(value);
		
		var spans = input.querySelectorAll('dd');
		expect(spans.length).toEqual(value.length);
		
		for(var i = 0 ; i < spans.length ; i++){
			expect(spans[i].innerHTML).toEqual(value[i]);
		}
		
		for(var i = 0 ; i < spans.length ; i++){
			spans[i].innerHTML = 'z' + i;
		}
		
		// Let's remove one
		var removers = input.querySelectorAll('.btn-remove');
		removers[0].click();
		
		// Add one
		var adder = input.querySelector('.btn-add');
		adder.click();
		
		var spansAfter = input.querySelectorAll('dd');
		spansAfter[spansAfter.length - 1].innerHTML = 'abcd';
		
		expect(complex.getValueFromHTMLInput(input)).toEqual(['z1', 'z2', 'z3', 'abcd']);
	});
});

describe('built in string array data type', function(){
	it('validates correctly', function(){
		expect(dia.DataType.STRING_ARRAY.validateValue('hello')).toBe(false);
		expect(dia.DataType.STRING_ARRAY.validateValue(123)).toBe(false);
		expect(dia.DataType.STRING_ARRAY.validateValue(-123)).toBe(false);
		expect(dia.DataType.STRING_ARRAY.validateValue(123.54)).toBe(false);
		expect(dia.DataType.STRING_ARRAY.validateValue('')).toBe(false);
		expect(dia.DataType.STRING_ARRAY.validateValue(null)).toBe(false);
		expect(dia.DataType.STRING_ARRAY.validateValue(false)).toBe(false);
		expect(dia.DataType.STRING_ARRAY.validateValue(NaN)).toBe(false);
		expect(dia.DataType.STRING_ARRAY.validateValue({'hey': 'lo'})).toBe(false);
		
		expect(dia.DataType.STRING_ARRAY.validateValue([1, 2, 3])).toBe(false);
		expect(dia.DataType.STRING_ARRAY.validateValue(['1', 2, 3])).toBe(false);
		expect(dia.DataType.STRING_ARRAY.validateValue(['1', '2', '3'])).toBe(true);
	});
});
