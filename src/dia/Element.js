dia.Element = function(type){
	dia.EventDispatcher.call(this);
	
	if(!type){
		throw new Error('Cannot initialize element without a type.');
	}
	
	this.id = dia.uuid4();
	this.sheet = null;
	this.type = type;
	this.properties = {};
	this.representation = null;
	this.highlighted = false;
};

extend(dia.Element, dia.EventDispatcher);

dia.Element.prototype.remove = function(){
	if(this.sheet){
		this.sheet.removeElement(this);
	}
};

dia.Element.prototype.getProperty = function(id){
	if(this.type.hasPropertyId(id)){
		return this.properties[id];
	}else{
		throw new Error('Property ' + id + ' does not exist for type ' + this.type.id);
	}
};

dia.Element.prototype.setProperty = function(id, newValue){
	var oldValue,
		property = this.type.getProperty(id);
	if(property){
		oldValue = this.properties[id];
		
		if(newValue !== oldValue){
			if(!property.type.validate(newValue)){
				throw new Error('Validation error: Property ' + id + ' cannot have value ' + value);
			}
			
			oldValue = this.properties[id];
			this.properties[id] = newValue;
			
			this.dispatch('propertychange', {
				element: this,
				property: property,
				from: oldValue,
				to: newValue
			});
			property.elementChangedValue(this, oldValue, newValue);
		}
	}else{
		throw new Error('Property ' + id + ' does not exist for type ' + this.type.id);
	}
};

dia.Element.prototype.toJSON = function(){
	var properties = {},
		property;
	for(var id in this.properties){
		property = this.type.getProperty(id);
		properties[id] = property.type.toJSON(this.properties[id]);
	}
	
	return {
		type: this.type.id,
		id: this.id,
		properties: properties
	};
};

dia.Element.prototype.getRepresentation = function(){
	if(!this.representation){
		this.representation = this.type.createRepresentation(this);
	}
	return this.representation;
};

dia.Element.prototype.render = function(ctx){
	this.getRepresentation().render(ctx);
};

dia.Element.prototype.isContainedIn = function(rectangleArea){
	var repr = this.getRepresentation();
	if(repr.area){
		return repr.area.intersectsWith(rectangleArea);
	}else{
		return false;
	}
};

dia.Element.prototype.installDependencies = function(){
	if(this.sheet){
		this.sheet.clearDependencies(this.id);
		
		var dependencies = this.type.getElementDependencies(this);
		for(var i = 0 ; i < dependencies.length ; i++){
			this.sheet.addDependency(this.id, dependencies[i]);
		}
	}
};

dia.Element.fromJSON = function(json){
	var type = dia.ElementType.lookupType(json.type);
	if(type === null){
		throw new Error('Type could not be found');
	}
	
	var element = type.create(json.properties);
	element.id = json.id;
	
	return element;
};
