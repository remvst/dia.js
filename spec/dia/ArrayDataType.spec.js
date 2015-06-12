describe('an array data type', function(){
	it('is initialized correctly', function(){
		var simple = new dia.DataType();
		var complex = new dia.ArrayDataType(simple);
		
		expect(complex.containedType).toBe(simple);
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
