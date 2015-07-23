dia.Sheet = function(){
	dia.EventDispatcher.call(this);

	this.gridSize = 10;

	this.layers = [];
	for(var i = 0 ; i < 5 ; i++){
		this.layers.push([]);
	}

	this.renderables = [];
	this.reset();
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
	this.layers[element.type.layer].push(element);

	this.dispatch('elementadded', { sheet: this, element: element });
	element.dispatch('addedtosheet', { sheet: this, element: element });
};

dia.Sheet.prototype.removeElement = function(element){
	if(!element || element.sheet !== this){
		return;
	}

	var index = this.elements.indexOf(element);
	if(index >= 0){
		this.elements.splice(index, 1);
		element.sheet = null;

		delete this.elementsMap[element.id];

		var layerIndex = this.layers[element.type.layer].indexOf(element);
		if(layerIndex >= 0){
			this.layers[element.type.layer].splice(layerIndex, 1);
		}

		this.dispatch('elementremoved', { sheet: this, element: element });
		element.dispatch('removedfromsheet', { sheet: this, element: element });
	}
};

dia.Sheet.prototype.addRenderable = function(r){
	if(this.renderables.indexOf(r) >= 0){
		return;
	}

	this.renderables.push(r);

	this.dispatch('renderableadded', { renderable: r });
};

dia.Sheet.prototype.removeRenderable = function(r){
	var index = this.renderables.indexOf(r);
	if(index >= 0){
		this.renderables.splice(index, 1);
		this.dispatch('renderableremoved', { renderable: r });
	}
};

dia.Sheet.prototype.render = function(ctx){
	for(var i = 0 ; i < this.layers.length ; i++){
		for(var j = 0 ; j < this.layers[i].length ; j++){
			this.layers[i][j].render(ctx);
		}
	}

	for(var i = 0 ; i < this.renderables.length ; i++){
		this.renderables[i].render(ctx);
	}
};

dia.Sheet.prototype.toJSON = function(){
	var json = {
		title: this.title,
		elements: [],
		gridSize: this.gridSize
	};
	for(var i = 0 ; i < this.elements.length ; i++){
		json.elements.push(this.elements[i].toJSON());
	}
	return json;
};

dia.Sheet.prototype.getElement = function(id){
	return this.elementsMap[id] || null;
};

dia.Sheet.prototype.findElementContaining = function(x, y, additionalCriteria){
	var area;
	for(var i = 0 ; i < this.elements.length ; i++){
		area = this.elements[i].getRepresentation().area;
		if(area && area.contains(x, y) && (!additionalCriteria || additionalCriteria(this.elements[i]))){
			return this.elements[i];
		}
	}
	return null;
};

dia.Sheet.prototype.findHandleContaining = function(x, y){
	var repr,
		handleArea,
		handle = null,
		handles;
	for(var i = 0 ; i < this.elements.length ; i++){
		repr = this.elements[i].getRepresentation();

		handles = this.elements[i].highlighted ? repr.handles : [repr.moveHandle];
		for(var j = 0 ; j < handles.length ; j++){
			if(handles[j]){
				handleArea = handles[j].area;
				if(handleArea.contains(x, y) && (!handle || handleArea.surface() < handle.area.surface())){
					handle = handles[j];
				}
			}
		}
	}

	return handle;
};

dia.Sheet.prototype.reset = function(){
	this.elements = [];
	this.elementsMap = {};
	this.id = dia.uuid4(); // ID to be used only at run time. It shouldn't be persisted
	this.title = null;
};

dia.Sheet.fromJSON = function(json){
	var sheet = new dia.Sheet();
	sheet.title = json.title || sheet.title;
	sheet.gridSize = json.gridSize || sheet.gridSize;

	var element;
	for(var i = 0 ; i < json.elements.length ; i++){
		element = dia.Element.fromJSON(json.elements[i]);
		sheet.addElement(element);
	}

	return sheet;
};
