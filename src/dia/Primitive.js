dia.Primitive = function(representation){
	this.representation = representation;
	this.bindings = {};
	this.defaults = {};
};

dia.Primitive.prototype.setDefault = function(property, value){
	this.defaults[property] = value;
};

dia.Primitive.prototype.bind = function(primitiveProperty, objectProperty){
	this.bindings[primitiveProperty] = objectProperty;
};

dia.Primitive.prototype.getPropertyValue = function(property){
	if(this.bindings[property] === undefined && !(property in this.defaults)){
		throw new Error('Property ' + property + ' was not bound for primitive');
	}
	
	if(this.bindings[property] === undefined){
		return this.defaults[property];
	}
	
	var binding = this.bindings[property];
	if(binding.call){
		return binding.call(this, this.representation.element);
	}else if(this.representation.element.type.hasPropertyId(binding)){
		return this.representation.element.getProperty(binding);
	}else{
		return binding;
	}
};

dia.Primitive.prototype.render = function(context){
	throw new Error('render() not implemented');
};

dia.Primitive.prototype.requiresBinding = function(property){
	this.bindings[property] = this.bindings[property] || undefined;
};

dia.Primitive.prototype.fullyBound = function(){
	for(var i in this.bindings){
		if(!this.bindings[i]){
			return false;
		}
	}
	return true;
};
