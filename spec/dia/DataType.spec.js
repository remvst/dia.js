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
	
	it('can create customized HTML input', function(){
		var type = new dia.DataType({
			toHTML: function(){
				return 'tohtml';
			},
			fromHTML: function(){
				return 'fromhtml';
			}
		});
		
		expect(type.createHTMLInput()).toEqual('tohtml');
		expect(type.getValueFromHTMLInput()).toEqual('fromhtml');
	});
	
	it('can create a default input', function(){
		var inputType,
			inputValue,
			document = {
				createElement: function(){
					return {
						setAttribute : function(key, value){
							if(key === 'value'){
								inputValue = value;
							}else if(key === 'type'){
								inputType = value;
							}
						}
					};
				}
			};
		
		var type = new dia.DataType();
		var html = type.createHTMLInput(document, 'myval');
		
		expect(inputType).toEqual('text');
		expect(inputValue).toEqual('myval');
	});
	
	it('can parse from an HTML input', function(){
		var document = {
			createElement: function(){
				return {
					setAttribute : function(){}
				};
			}
		};
		
		var type = new dia.DataType();
		var html = type.createHTMLInput(document, 'myval');
		html.value = 'newval';
		
		var retrieved = type.getValueFromHTMLInput(html);
		
		expect(retrieved).toEqual('newval');
	});
});

describe('built in any data type', function(){
	it('validates correctly', function(){
		expect(dia.DataType.ANY.validateValue('hello')).toBe(true);
		expect(dia.DataType.ANY.validateValue(123)).toBe(true);
		expect(dia.DataType.ANY.validateValue(123.54)).toBe(true);
		expect(dia.DataType.ANY.validateValue('')).toBe(true);
		expect(dia.DataType.ANY.validateValue(null)).toBe(true);
		expect(dia.DataType.ANY.validateValue(false)).toBe(true);
		expect(dia.DataType.ANY.validateValue(NaN)).toBe(true);
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
