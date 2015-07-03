dia.ElementForm = function(element){
	if(!element){
		throw new Error('Cannot create ElementForm without element parameter.');
	}

	this.element = element;
	this.htmlRoot = null;
	this.inputMap = {};
	this.validMap = {};
};

dia.ElementForm.prototype.getHTMLRoot = function(){
	if(!this.htmlRoot){
		this.htmlRoot = this.createHTMLRoot();
	}
	return this.htmlRoot;
};

dia.ElementForm.prototype.createHTMLRoot = function(){
	var root = document.createElement('div'),
		form = this;

	this.element.type.properties.forEach(function(property){
		if(property.private){
			return;
		}

		console.log(property);

		var propertyRoot = document.createElement('div');
		propertyRoot.className = 'row form-group';

		var labelContainer = document.createElement('div');
		labelContainer.className = 'col-md-6';
		propertyRoot.appendChild(labelContainer);

		var inputContainer = document.createElement('div');
		inputContainer.className = 'col-md-6';
		propertyRoot.appendChild(inputContainer);

		var label = document.createElement('label');
		label.innerHTML = property.label || property.id;
		label.title = property.description;
		label.className = 'col-md-6';
		labelContainer.appendChild(label);

		var input = property.type.createHTMLInput(form.element.getProperty(property.id));
		inputContainer.appendChild(input);

		root.appendChild(propertyRoot);

		// Let's store the input so we can parse it later
		form.inputMap[property.id] = input;

		form.validMap[property.id] = true;
	});

	this.element.type.functions.forEach(function(func){
		var btn = document.createElement('a');
		btn.className = 'btn btn-default';
		btn.innerHTML = func.label || func.id;
		btn.addEventListener('click', function(){
			func.apply(form.element);
		}, false);
		root.appendChild(btn);
	});

	return root;
};

dia.ElementForm.prototype.isValid = function(){
	if(!this.htmlRoot){
		throw new Error('Cannot check validation form a form that was never rendered');
	}

	var valid = true,
		form = this;
	this.element.type.properties.forEach(function(property){
		if(property.private){
			return;
		}

		var input = form.inputMap[property.id];
		var newValue = property.type.getValueFromHTMLInput(input);

		if(!property.type.validateValue(newValue)){
			valid = false;
			form.validMap[property.id] = false;
		}else{
			form.validMap[property.id] = true;
		}
	});

	return valid;
};

dia.ElementForm.prototype.submit = function(){
	if(!this.htmlRoot){
		throw new Error('Cannot submit a form that was never rendered');
	}

	if(!this.isValid()){
		throw new Error('Form is invalid. Cannot submit');
	}

	var form = this;

	this.element.type.properties.forEach(function(property){
		if(property.private){
			return;
		}

		var input = form.inputMap[property.id];
		var newValue = property.type.getValueFromHTMLInput(input);

		form.element.setProperty(property.id, newValue);
	});
};
