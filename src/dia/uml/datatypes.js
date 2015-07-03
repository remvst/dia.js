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

dia.uml.TYPED_ATTRIBUTE_ARRAY = new dia.ArrayDataType(dia.uml.TYPED_ATTRIBUTE);
