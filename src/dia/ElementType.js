dia.ElementType = function(options){
	options = options || {};
	
	this.id = options.id || null;
	this.label = options.label || null;
	this.properties = [];
	this.propertyMap = {};
	this.representationFactory = function(){};
	this.creatorTool = null;
	
	if(this.id){
		dia.ElementType.register(this);
	}
};

dia.ElementType.prototype.addProperty = function(property){
	this.properties.push(property);
	this.propertyMap[property.id] = property;
};

dia.ElementType.prototype.emptyElement = function(){
	return this.create({});
};

dia.ElementType.prototype.create = function(properties){
	var element = new dia.Element(this);
	
	this.properties.forEach(function(p){
		if(p.id in properties){
			element.setProperty(p.id, properties[p.id]);
		}else{
			element.setProperty(p.id, p.default);
		}
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

dia.ElementType.prototype.extendRepresentationFactory = function(extension){
	var factory = this.representationFactory,
		type = this;
	this.setRepresentationFactory(function(element, representation){
		factory.call(type, element, representation);
		extension.call(type, element, representation);
	});
};

dia.ElementType.prototype.createRepresentation = function(element){
	var representation = new dia.GraphicalRepresentation(element);
	
	this.representationFactory.call(this, element, representation);
	
	return representation;
};

dia.ElementType.prototype.clone = function(options){
	var type = new dia.ElementType({
		id: options.id || this.id,
		label: options.label || this.label
	});
	type.representationFactory = this.representationFactory;
	type.creatorTool = this.creatorTool;
	if(type.creatorTool){
		type.creatorTool.type = type;
	}
	
	for(var i = 0 ; i < this.properties.length ; i++){
		type.addProperty(this.properties[i].clone());
	}
	
	return type;
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
