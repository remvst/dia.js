dia.ElementType = function(options){
	options = options || {};

	this.id = options.id || null;
	this.label = options.label || null;
	this.properties = [];
	this.propertyMap = {};
	this.representationFactory = function(){};
	this.tools = [];
	this.toolMap = {};
	this.anchorable = 'anchorable' in options ? options.anchorable : true;
	this.functions = [];
	this.functionMap = {};
	this.layer = 'layer' in options ? options.layer : 2;
	this.setupFunctions = [];
	this.group = options.group || null;

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

	// Executing setup functions
	for(var i = 0 ; i < this.setupFunctions.length ; i++){
		this.setupFunctions[i].call(this, element);
	}

	// Setting up properties
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
		label: options.label || this.label,
		anchorable: 'anchorable' in options ? options.anchorable : this.anchorable,
		layer: 'layer' in options ? options.layer : this.layer,
		package: this.package
	});
	type.representationFactory = this.representationFactory;

	if(this.creatorTool){
		type.creatorTool = this.creatorTool.extend({
			type: type
		});
	}

	for(var i = 0 ; i < this.properties.length ; i++){
		type.addProperty(this.properties[i].clone());
	}

	for(var i = 0 ; i < this.setupFunctions.length ; i++){
		type.addSetupFunction(this.setupFunctions[i]);
	}

	for(var key in this.functionMap){
		type.addFunction(this.functionMap[key]);
	}

	return type;
};

dia.ElementType.prototype.isAnchorable = function(){
	return this.anchorable;
};

dia.ElementType.prototype.addFunction = function(func){
	if(!this.functionMap[func.id]){
		this.functionMap[func.id] = func;
		this.functions.push(func);
	}else{
		throw new Error('Tried to add two functions with ID ' + func.id);
	}
};

dia.ElementType.prototype.getFunction = function(id){
	return this.functionMap[id] || null;
};

dia.ElementType.prototype.addSetupFunction = function(f){
	this.setupFunctions.push(f);
};

dia.ElementType.prototype.addTool = function(tool){
	this.tools.push(tool);
	this.toolMap[tool.id] = tool;
};

dia.ElementType.prototype.getTool = function(id){
	return this.toolMap[id] || null;
};

dia.ElementType.register = function(type){
	if(!type.id){
		throw new Error('Cannot register a type with no ID.');
	}

	dia.ElementType.types = dia.ElementType.types || {};
	if(!dia.ElementType.types[type.id]){
		dia.ElementType.types[type.id] = type;
	}

	if(type.group){
		dia.ElementType.groups = dia.ElementType.groups || {};
		dia.ElementType.groups[type.group] = dia.ElementType.groups[type.group] || [];
		dia.ElementType.groups[type.group].push(type);
	}
};

dia.ElementType.lookupType = function(id){
	return dia.ElementType.types[id] || null;
};

dia.ElementType.getGroup = function(group){
	return dia.ElementType.groups[group] || null;
};
