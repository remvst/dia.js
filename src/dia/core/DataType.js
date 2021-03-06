dia.DataType = function(options){
	options = options || {};

	this.label = options.label || null;
	this.validate = options.validate || function(){ return true; };
	this.import = options.fromJSON || function(v){ return v; };
	this.export = options.toJSON || function(v){ return v; };
	this.toHTML = options.toHTML || function(currentValue){
		var input = document.createElement('input');
		input.setAttribute('type', 'text');
		input.setAttribute('value', currentValue);
		input.className = 'form-control';
		return input;
	};
	this.fromHTML = options.fromHTML || function(html){
		return html.value;
	};
	this.toString = options.toString || function(v) { return v.toString(); };
	this.copyValue = options.copyValue || function(v, matchMap) { return v; };
};

dia.DataType.prototype.validateValue = function(value){
	return this.validate(value);
};

dia.DataType.prototype.fromJSON = function(value){
	return this.import(value);
};

dia.DataType.prototype.toJSON = function(value){
	return this.export(value);
};

dia.DataType.prototype.createHTMLInput = function(currentValue){
	return this.toHTML.call(this, currentValue);
};

dia.DataType.prototype.getValueFromHTMLInput = function(input){
	return this.fromHTML.call(this, input);
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
	},
	fromHTML: function(html){
		return parseInt(html.value);
	}
});

dia.DataType.FLOAT = new dia.DataType({
	label: 'float',
	validate: function(value){
		var parsed = parseFloat(value);
		return parsed !== NaN && parsed === value;
	},
	fromHTML: function(html){
		return parseFloat(html.value);
	}
});

dia.DataType.ANCHOR = new dia.DataType({
	label: 'anchor',
	validate: function(value){
		return !!(value
			&& typeof value.x === 'number'
			&& typeof value.y === 'number'
			&& typeof value.element === 'string'
			&& typeof value.angle === 'number');

	},
	copyValue: function(value, matchMap){
		return {
			x: value.x,
			y: value.y,
			angle: value.angle,
			element: matchMap[value.element] || value.element
		};
	}
});

dia.DataType.POINT = new dia.DataType({
	label: 'point',
	validate: function(value){
		return !!(value
			&& typeof value.x === 'number'
			&& typeof value.y === 'number');

	}
});
