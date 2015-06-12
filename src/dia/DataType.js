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
		return input;
	};
	this.fromHTML = options.fromHTML || function(html){
		return html.value;
	};
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
	},
	toHTML: function(currentValue){
		var add = function(value){
			var inputContainer = document.createElement('div');
			inputsContainer.appendChild(inputContainer);
			
			var input = document.createElement('input');
			input.setAttribute('type', 'text');
			input.setAttribute('value', value);
			inputContainer.appendChild(input);
			
			var remover = document.createElement('button');
			remover.innerHTML = 'X';
			remover.addEventListener('click', function(){
				inputContainer.parentNode.removeChild(inputContainer);
			}, false);
			inputContainer.appendChild(remover);
			
			return input;
		};
		var remove = function(index){
			container.removeChild(container.children[index]);
		};
		
		var container = document.createElement('div');
		
		var inputsContainer = document.createElement('div');
		container.appendChild(inputsContainer);
		
		for(var i = 0 ; i < currentValue.length ; i++){
			add(currentValue[i]);
		}
		
		var nextIndex = currentValue.length;
		
		var adder = document.createElement('button');
		adder.innerHTML = 'Add';
		adder.addEventListener('click', function(){
			add('');
		}, false);
		container.appendChild(adder);
		
		return container;
	},
	fromHTML: function(html){
		var inputs = html.querySelectorAll('input');
		var value = [];
		for(var i = 0 ; i < inputs.length ; i++){
			value.push(inputs[i].value);
		}
		return value;
	}
});
