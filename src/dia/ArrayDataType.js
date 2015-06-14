dia.ArrayDataType = function(containedType){
	dia.DataType.call(this);
	
	this.containedType = containedType;
};

extend(dia.ArrayDataType, dia.DataType);

dia.ArrayDataType.prototype.validateValue = function(value){
	if(!value || typeof value !== 'object' || value.length === undefined){
		return false;
	}
	for(var i = 0 ; i < value.length ; i++){
		if(!this.containedType.validate(value[i])){
			return false;
		}
	}
	return true;
};

dia.ArrayDataType.prototype.fromJSON = function(value){
	var res = [];
	for(var i = 0 ; i < value.length ; i++){
		res.push(this.containedType.fromJSON(value[i]));
	}
	return res;
};

dia.ArrayDataType.prototype.toJSON = function(value){
	var res = [];
	for(var i = 0 ; i < value.length ; i++){
		res.push(this.containedType.toJSON(value[i]));
	}
	return res;
};

dia.ArrayDataType.prototype.createHTMLInput = function(currentValue){
	var add = function(value){
		var inputContainer = document.createElement('div');
		inputContainer.className = 'input-group';
		inputsContainer.appendChild(inputContainer);

		var input = this.containedType.createHTMLInput(value);
		input.className += ' contained-type-input';
		inputContainer.appendChild(input);
		
		var removerWrapper = document.createElement('span');
		removerWrapper.className = 'input-group-btn';
		inputContainer.appendChild(removerWrapper);

		var remover = document.createElement('button');
		remover.className = 'btn btn-default';
		remover.innerHTML = 'X';
		remover.addEventListener('click', function(){
			inputContainer.parentNode.removeChild(inputContainer);
		}, false);
		removerWrapper.appendChild(remover);
	}.bind(this);

	var container = document.createElement('div');

	var inputsContainer = document.createElement('div');
	container.appendChild(inputsContainer);

	for(var i = 0 ; i < currentValue.length ; i++){
		add(currentValue[i]);
	}

	var nextIndex = currentValue.length;

	var adder = document.createElement('button');
	adder.className = 'btn btn-default';
	adder.innerHTML = 'Add an item';
	adder.addEventListener('click', function(){
		add('');
	}, false);
	container.appendChild(adder);

	return container;
};

dia.ArrayDataType.prototype.getValueFromHTMLInput = function(html){
	var inputs = html.querySelectorAll('.contained-type-input');
	var value = [];
	for(var i = 0 ; i < inputs.length ; i++){
		value.push(this.containedType.getValueFromHTMLInput(inputs[i]));
	}
	return value;
};

dia.DataType.STRING_ARRAY = new dia.ArrayDataType(dia.DataType.STRING);
