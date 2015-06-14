dia.Sheet = function(){
	dia.EventDispatcher.call(this);
	
	this.title = null;
	this.elements = [];
	this.elementsMap = {};
	this.id = dia.uuid4();
};

extend(dia.Sheet, dia.EventDispatcher);

dia.Sheet.prototype.addElement = function(element){
	if(element.sheet === this){
		return;
	}

	element.remove();
	this.elements.push(element);
	element.sheet = this;
	
	this.elementsMap[element.id] = element;
	
	this.dispatch('elementadded', { element: element });
};

dia.Sheet.prototype.removeElement = function(element){
	if(element.sheet !== this){
		return;
	}

	var index = this.elements.indexOf(element);
	if(index >= 0){
		this.elements.splice(index, 1);
		element.sheet = null;
		
		delete this.elementsMap[element.id];
		
		this.dispatch('elementremoved', { element: element });
	}
};

dia.Sheet.prototype.render = function(ctx){
	for(var i = 0 ; i < this.elements.length ; i++){
		this.elements[i].render(ctx);
	}
};

dia.Sheet.prototype.toJSON = function(){
	var json = {
		title: this.title,
		elements: []
	};
	for(var i = 0 ; i < this.elements.length ; i++){
		json.elements.push(this.elements[i].toJSON());
	}
	return json;
};

dia.Sheet.prototype.getElement = function(id){
	return this.elementsMap[id] || null;
};

dia.Sheet.fromJSON = function(json){
	var sheet = new dia.Sheet();
	sheet.title = json.title || this.title;
	
	var element;
	for(var i = 0 ; i < json.elements.length ; i++){
		element = dia.Element.fromJSON(json.elements[i]);
		sheet.addElement(element);
	}
	
	return sheet;
};
