dia.EnumerationDataType = function(settings){
	dia.DataType.call(this);
	
	this.label = settings.label || null;
	this.values = settings.values || settings;
};

extend(dia.EnumerationDataType, dia.DataType);

dia.EnumerationDataType.prototype.validateValue = function(value){
	return this.values.indexOf(value) >= 0;
};

dia.EnumerationDataType.prototype.createHTMLInput = function(currentValue){
	var select = document.createElement('select'),
		option;
	
	select.className = 'form-control';
	
	for(var i = 0 ; i < this.values.length ; i++){
		option = document.createElement('option');
		option.value = this.values[i];
		option.innerHTML = this.values[i].toString();
		select.appendChild(option);
		
		if(currentValue === this.values[i]){
			select.selectedIndex = i;
		}
	}
	
	return select;
};

dia.EnumerationDataType.prototype.getValueFromHTMLInput = function(html){
	return html.options[html.selectedIndex].value;
};
