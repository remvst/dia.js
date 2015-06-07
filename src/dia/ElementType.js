dia.ElementType = function(options){
	options = options || {};
	
	this.id = options.id || null;
	this.properties = [];
	this.propertyMap = {};
	this.representationFactory = null;
	
	if(this.id){
		dia.ElementType.register(this);
	}
};

dia.ElementType.prototype.addProperty = function(property){
	this.properties.push(property);
	this.propertyMap[property.id] = property;
};

dia.ElementType.prototype.emptyElement = function(){
	var element = new dia.Element(this);
	
	this.properties.forEach(function(p){
		element.setProperty(p.id, p.default);
	});
	
	return element;
};

dia.ElementType.prototype.hasPropertyId = function(id){
	return id in this.propertyMap;
};

dia.ElementType.prototype.getProperty = function(id){
	return this.propertyMap[id];
};

dia.ElementType.prototype.setRepresentationFactory = function(factory){
	this.representationFactory = factory;
};

dia.ElementType.prototype.createRepresentation = function(element){
	if(!this.representationFactory){
		throw new Error('Representation factory not set');
	}
	return this.representationFactory.call(this, element);
};

dia.ElementType.register = function(type){
	if(!type.id){
		throw new Error('Cannot register a type with no ID.');
	}

	dia.ElementType.types = dia.ElementType.types || {};
	if(!dia.ElementType.types[type.id]){
		dia.ElementType.types[type.id] = type;
	}
};

dia.ElementType.lookupType = function(id){
	return dia.ElementType.types[id] || null;
};
