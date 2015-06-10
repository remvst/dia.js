dia.ElementForm = function(element){
	if(!element){
		throw new Error('Cannot create ElementForm without element parameter.');
	}
	
	this.element = element;
	this.htmlRoot = null;
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
		var propertyRoot = document.createElement('div');
		
		var label = document.createElement('label');
		label.innerHTML = property.label || property.id;
		label.title = property.description;
		propertyRoot.appendChild(label);
		
		var input = property.type.createHTMLInput(form.element.getProperty(property.id));
		propertyRoot.appendChild(input);
		
		root.appendChild(propertyRoot);
	});
	
	return root;
};
