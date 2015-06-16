dia.Sheet = function(){
	dia.EventDispatcher.call(this);
	
	this.title = null;
	this.elements = [];
	this.elementsMap = {};
	this.id = dia.uuid4();
	this.renderables = [];
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

dia.Sheet.prototype.addRenderable = function(r){
	if(this.renderables.indexOf(r) >= 0){
		return;
	}
	
	this.renderables.push(r);
};

dia.Sheet.prototype.removeRenderable = function(r){
	var index = this.renderables.indexOf(r);
	if(index >= 0){
		this.renderables.splice(index, 1);
	}
};

dia.Sheet.prototype.render = function(ctx){
	for(var i = 0 ; i < this.elements.length ; i++){
		this.elements[i].render(ctx);
	}
	
	for(var i = 0 ; i < this.renderables.length ; i++){
		this.renderables[i].render(ctx);
	}
};

dia.Sheet.prototype.toJSON = function(){
	var json = {
		title: this.title,
		elements: [],
		id: this.id
	};
	for(var i = 0 ; i < this.elements.length ; i++){
		json.elements.push(this.elements[i].toJSON());
	}
	return json;
};

dia.Sheet.prototype.getElement = function(id){
	return this.elementsMap[id] || null;
};

dia.Sheet.prototype.findElementContaining = function(x, y){
	var area;
	for(var i = 0 ; i < this.elements.length ; i++){
		area = this.elements[i].getRepresentation().area;
		if(area && area.contains(x, y)){
			return this.elements[i];
		}
	}
	return null;
};

dia.Sheet.prototype.findHandleContaining = function(x, y){
	var repr,
		handleArea,
		handle = null;
	for(var i = 0 ; i < this.elements.length ; i++){
		repr = this.elements[i].getRepresentation();
		for(var j = 0 ; j < repr.handles.length ; j++){
			handleArea = repr.handles[j].area;
			if(handleArea.contains(x, y) && (!handle || handleArea.surface() < handle.area.surface())){
				handle = repr.handles[j];
			}
		}
	}
	return handle;
};

dia.Sheet.fromJSON = function(json){
	var sheet = new dia.Sheet();
	sheet.title = json.title || sheet.title;
	sheet.id = json.id || sheet.id;
	
	var element;
	for(var i = 0 ; i < json.elements.length ; i++){
		element = dia.Element.fromJSON(json.elements[i]);
		sheet.addElement(element);
	}
	
	return sheet;
};
