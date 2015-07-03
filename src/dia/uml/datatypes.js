dia.uml = dia.uml || {};

dia.uml.TYPED_ATTRIBUTE = new dia.DataType({
	label: 'attribute',
	validate: function(value){
		return typeof value.name === 'string'
			&& typeof value.type === 'object';
	},
	toHTML: function(value){
		var input = dia.DataType.STRING.createHTMLInput('');
		if(value){
			input.value = value.name;
			if(value.type){
				input.value += ' : ' + value.type;
			}
		}
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
	}
});

dia.uml.TYPED_ATTRIBUTE_ARRAY = new dia.ArrayDataType(dia.uml.TYPED_ATTRIBUTE);
