dia.uml = dia.uml || {};

dia.uml.TYPED_ATTRIBUTE = new dia.DataType({
	label: 'attribute',
	validate: function(value){
		return typeof value.name === 'string'
			&& (value.type === null || typeof value.type === 'string');
	},
	toHTML: function(value){
		var input = dia.DataType.STRING.createHTMLInput(this.toString(value));
		return input;
	},
	fromHTML: function(html){
		var strValue = dia.DataType.STRING.getValueFromHTMLInput(html);
		var split = strValue.split(':');

		var before = split[0].trim();
		var after = split[1] ? split[1].trim() : null;

		return {
			name: before,
			type: after
		};
	},
	toString: function(value){
		var s = '';
		if(value){
			s = value.name;
			if(value.type){
				s += ' : ' + value.type;
			}
		}
		return s;
	}
});

dia.uml.TYPED_METHOD = new dia.DataType({
	label: 'method',
	validate: function(value){
		return typeof value.name === 'string'
			&& (value.type === null || typeof value.type === 'string')
			&& 'length' in value.parameters;

		// TODO validate parameters
	},
	toHTML: function(value){
		var input = dia.DataType.STRING.createHTMLInput(this.toString(value));
		return input;
	},
	fromHTML: function(html){
		var strValue = dia.DataType.STRING.getValueFromHTMLInput(html);

		var name = strValue.replace(/^([ a-z0-9_]+)\(.*\).*$/, "$1");
		var type = strValue.replace(/^.*:?([^:]*)$/, "$1");

		var lastSplitIndex = strValue.lastIndexOf(':');
		if(lastSplitIndex === -1){
			lastSplitIndex = strValue.length;
		}

		var before = strValue.substring(0, lastSplitIndex).trim();
		var type = strValue.substring(lastSplitIndex + 1).trim();

		// Catching the name
		var name = before.replace(/^(.*)\(.*$/, "$1");

		var paramsStr = before.replace(/^.*\((.*)\).*$/, "$1");

		var paramsSplit = paramsStr.split(','),
			params = [];
		for(var i = 0 ; i < paramsSplit.length ; i++){
			split = paramsSplit[i].split(':');

			before = split[0].trim();
			after = split[1] ? split[1].trim() : null;

			params.push({
				name: before,
				type: after
			})
		}

		return {
			name: name.trim(),
			type: type,
			parameters: params
		};
	},
	toString: function(value){
		if(!value){
			return '';
		}

		var attrs = [],
			attr;
		for(var i = 0 ; i < value.parameters.length ; i++){
			if(value.parameters[i]){
				attr = value.parameters[i].name;
				if(value.parameters[i].type){
					attr += ' : ' + value.parameters[i].type;
				}
				attrs.push(attr);
			}
		}

		var s = value.name + '(' + attrs.join(', ') + ')';
		if(value.type){
			s += ' : ' + value.type;
		}

		return s;
	}
});

dia.uml.TYPED_ATTRIBUTE_ARRAY = new dia.ArrayDataType(dia.uml.TYPED_ATTRIBUTE);
dia.uml.TYPED_METHOD_ARRAY = new dia.ArrayDataType(dia.uml.TYPED_METHOD);
