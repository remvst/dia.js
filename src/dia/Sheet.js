dia.Sheet = function(){
	dia.EventDispatcher.call(this);
	
	this.title = null;
	this.elements = [];
	this.elementsMap = {};
	this.id = dia.uuid4();
	this.renderables = [];
	this.dependencies = {};
	this.dependents = {};
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
	
	// Dependencies
	this.dependents[element.id] = [];
	this.dependencies[element.id] = [];
	element.installDependencies();
	
	this.dispatch('elementadded', { element: element });
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
		
		this.dispatch('elementremoved', { element: element });
		
		// Removing elements that depend on the one being removed
		var dependents = this.dependents[element.id].slice(0);
		for(var i = 0 ; i < dependents.length ; i++){
			this.removeElement(this.getElement(dependents[i]));
		}
		
		// Clearing the current element's dependencies
		this.clearDependencies(element.id);
		
		delete this.dependents[element.id];
		delete this.dependencies[element.id];
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

dia.Sheet.prototype.addDependency = function(dependentId, dependencyId){
	if(!this.dependencies[dependentId]){
		this.dependencies[dependentId] = [];
	}
	this.dependencies[dependentId].push(dependencyId);
	
	if(!this.dependents[dependencyId]){
		this.dependents[dependencyId] = [];
	}
	this.dependents[dependencyId].push(dependentId);
};

dia.Sheet.prototype.clearDependencies = function(dependentId){
	if(!this.dependencies[dependentId]){
		return;
	}
	
	var dependents,
		index;
	for(var i = 0 ; i < this.dependencies[dependentId].length ; i++){
		dependents = this.dependents[this.dependencies[dependentId][i]];
		if(dependents){
			index = dependents.indexOf(dependentId);
			if(index >= 0){
				dependents.splice(index, 1);
			}
		}
	}
	
	this.dependencies[dependentId] = [];
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
