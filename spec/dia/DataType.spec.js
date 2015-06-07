describe('a data type', function(){
	it('is initialized correctly', function(){
		var type = new dia.DataType();
		
		expect(type.label).toBe(null);
	});

	it('is initialized correctly with options', function(){
		var validator = new Function();
		var type = new dia.DataType({
			label: 'datatype',
			validate: validator
		});
		
		expect(type.label).toEqual('datatype');
		expect(type.validate).toEqual(validator);
	});
	
	it('can handle JSON imports/exports', function(){
		var type = new dia.DataType({
			label: 'datatype',
			fromJSON: function(v){
				return 'imported';
			},
			toJSON: function(v){
				return 'exported';
			}
		});
		
		expect(type.toJSON('onevalue')).toEqual('exported');
		expect(type.fromJSON('onevalue')).toEqual('imported');
	});
});

describe('built in string data type', function(){
	it('validates correctly', function(){
		expect(dia.DataType.STRING.validateValue('hello')).toBe(true);
		expect(dia.DataType.STRING.validateValue(123)).toBe(false);
		expect(dia.DataType.STRING.validateValue(123.54)).toBe(false);
		expect(dia.DataType.STRING.validateValue('')).toBe(true);
		expect(dia.DataType.STRING.validateValue(null)).toBe(false);
		expect(dia.DataType.STRING.validateValue(false)).toBe(false);
		expect(dia.DataType.STRING.validateValue(NaN)).toBe(false);
	});
});

describe('built in integer data type', function(){
	it('validates correctly', function(){
		expect(dia.DataType.INTEGER.validateValue('hello')).toBe(false);
		expect(dia.DataType.INTEGER.validateValue(123)).toBe(true);
		expect(dia.DataType.INTEGER.validateValue(-123)).toBe(true);
		expect(dia.DataType.INTEGER.validateValue(123.54)).toBe(false);
		expect(dia.DataType.INTEGER.validateValue('')).toBe(false);
		expect(dia.DataType.INTEGER.validateValue(null)).toBe(false);
		expect(dia.DataType.INTEGER.validateValue(false)).toBe(false);
		expect(dia.DataType.INTEGER.validateValue(NaN)).toBe(false);
	});
});

describe('built in float data type', function(){
	it('validates correctly', function(){
		expect(dia.DataType.FLOAT.validateValue('hello')).toBe(false);
		expect(dia.DataType.FLOAT.validateValue(123)).toBe(true);
		expect(dia.DataType.FLOAT.validateValue(-123)).toBe(true);
		expect(dia.DataType.FLOAT.validateValue(123.54)).toBe(true);
		expect(dia.DataType.FLOAT.validateValue('')).toBe(false);
		expect(dia.DataType.FLOAT.validateValue(null)).toBe(false);
		expect(dia.DataType.FLOAT.validateValue(false)).toBe(false);
		expect(dia.DataType.FLOAT.validateValue(NaN)).toBe(false);
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
