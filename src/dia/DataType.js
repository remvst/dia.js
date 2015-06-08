dia.DataType = function(options){
	options = options || {};
	
	this.label = options.label || null;
	this.validate = options.validate || function(){ return true; };
	this.import = options.fromJSON || function(v){ return v; };
	this.export = options.toJSON || function(v){ return v; };
};

dia.DataType.prototype.validateValue = function(value){
	//console.log('validating ' + value + ' -> ' + this.validate(value));
	return this.validate(value);
};

dia.DataType.prototype.fromJSON = function(value){
	return this.import(value);
};

dia.DataType.prototype.toJSON = function(value){
	return this.export(value);
};

dia.DataType.ANY = new dia.DataType({
	label: 'any',
	validate: function(value){
		return true;
	}
});

dia.DataType.STRING = new dia.DataType({
	label: 'string',
	validate: function(value){
		return typeof value === 'string';
	}
});

dia.DataType.INTEGER = new dia.DataType({
	label: 'integer',
	validate: function(value){
		var parsed = parseInt(value);
		return parsed !== NaN && parsed === value;
	}
});

dia.DataType.FLOAT = new dia.DataType({
	label: 'float',
	validate: function(value){
		var parsed = parseFloat(value);
		return parsed !== NaN && parsed === value;
	}
});

dia.DataType.STRING_ARRAY = new dia.DataType({
	label: 'string_array',
	validate: function(value){
		if(!value || typeof value !== 'object' || value.length === undefined){
			return false;
		}
		for(var i = 0 ; i < value.length ; i++){
			if(!dia.DataType.STRING.validate(value[i])){
				return false;
			}
		}
		return true;
	}
});
