var dia = {};

// https://gist.github.com/kaizhu256/2853704
dia.uuid4 = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(){
		var rr = Math.random() * 16 | 0; 
		return (cc === 'x' ? rr : (rr & 0x3 | 0x8)).toString(16);
	});
};

function extend(subClass,superClass){
	if(!subClass.extendsClasses || !subClass.extendsClasses[superClass]){
		for(var i in superClass.prototype){
			if(!subClass.prototype[i]){
				subClass.prototype[i] = superClass.prototype[i];
			}
		}
		
		subClass.extendsClasses = subClass.extendsClasses || {};
		subClass.extendsClasses[superClass] = true;
	}
};

function extendPrototype(superClasses,proto){
    superClasses = superClasses instanceof Array ? superClasses : [superClasses];
    //superClasses = [superClasses];
	
	var propStart = '__prop_';
    
	var subProto = {
        superior : {}
    };
    for(var i in superClasses){
        for(var j in superClasses[i].prototype){
			var g = superClasses[i].prototype.__lookupGetter__(j), 
				s = superClasses[i].prototype.__lookupSetter__(j);
			
			var propName = j;
			if(propName.indexOf(propStart) === 0){
				g = superClasses[i].prototype[j].get;
				s = superClasses[i].prototype[j].set;
				propName = j.substr(propStart.length);
			}
       
			if ( g || s ) {
				var prop = {};
				if ( g )
					prop.get = g;
				if ( s )
					prop.set = s;
				Object.defineProperty(subProto,propName,prop);
				subProto[propStart + j] = prop;
			}else{
				subProto[j] = superClasses[i].prototype[j];
				subProto.superior[j] = superClasses[i].prototype[j];
			}
        }
    }
    
    if(proto){
        for(var i in proto){
            subProto[i] = proto[i];
        }
    }
	
	return subProto;
};

function quickImplementation(object,prototype){
    for(var i in prototype){
        object[i] = prototype[i];
    }
    return object;
};

function extendObject(base,additions){
	var res = {};
	for(var i in base){
		res[i] = base[i];
	}
	for(var i in additions){
		res[i] = additions[i];
	}
	return res;
}
dia.Sheet = function(){
	this.title = null;
	this.elements = [];
};

dia.Sheet.prototype.addElement = function(element){
	if(element.sheet === this){
		return;
	}

	element.remove();
	this.elements.push(element);
	element.sheet = this;
};

dia.Sheet.prototype.removeElement = function(element){
	if(element.sheet !== this){
		return;
	}

	var index = this.elements.indexOf(element);
	if(index >= 0){
		this.elements.splice(index, 1);
	}
	
	element.sheet = null;
};

dia.Element = function(type){
	if(!type){
		throw new Error('Cannot initialize element without a type.');
	}
	
	this.id = dia.uuid4();
	this.sheet = null;
	this.type = type;
	this.properties = {};
	this.representation = null;
};

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

dia.Element.prototype.setProperty = function(id, value){
	if(this.type.hasPropertyId(id)){
		this.properties[id] = value;
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

dia.Element.fromJSON = function(json){
	var type = dia.ElementType.lookupType(json.type);
	if(type === null){
		throw new Error('Type could not be found');
	}
	
	var element = type.emptyElement(),
		property,
		value;
	
	for(var id in json.properties){
		property = type.getProperty(id);
		if(property){
			value = property.type.fromJSON(json.properties[id]);
			element.setProperty(id, value);
		}
	}
	
	element.id = json.id;
	
	return element;
};

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

dia.Property = function(options){
	options = options || {};
	
	this.label = options.label || null;
	this.type = options.type || null;
	this.description = options.description || null;
	this.default = 'default' in options ? options.default : null;
	this.id = options.id || null;
};

dia.DataType = function(options){
	options = options || {};
	
	this.label = options.label || null;
	this.validate = options.validate || function(){ return true; };
	this.import = options.fromJSON || function(v){ return v; };
	this.export = options.toJSON || function(v){ return v; };
};

dia.DataType.prototype.validateValue = function(value){
	return this.validate(value);
};

dia.DataType.prototype.fromJSON = function(value){
	return this.import(value);
};

dia.DataType.prototype.toJSON = function(value){
	return this.export(value);
};

dia.DataType.STRING = new dia.DataType({
	label: 'string',
	validate: function(value){
		return typeof value === 'string';
	}
});

dia.DataType.INTEGER = new dia.DataType({
	label: 'integer',
	validate: function(value){
		var parsed = parseInt(value);
		return parsed !== NaN && parsed === value;
	}
});

dia.DataType.FLOAT = new dia.DataType({
	label: 'float',
	validate: function(value){
		var parsed = parseFloat(value);
		return parsed !== NaN && parsed === value;
	}
});

dia.DataType.STRING_ARRAY = new dia.DataType({
	label: 'string_array',
	validate: function(value){
		if(!value || typeof value !== 'object' || value.length === undefined){
			return false;
		}
		for(var i = 0 ; i < value.length ; i++){
			if(!dia.DataType.STRING.validate(value[i])){
				return false;
			}
		}
		return true;
	}
});

dia.GraphicalRepresentation = function(element){
	if(!element){
		throw new Error('Cannot instantiate a GraphicalRepresentation without an element.');
	}
	
	this.element = element;
	this.primitives = [];
};

dia.GraphicalRepresentation.prototype.addPrimitive = function(primitive){
	this.primitives.push(primitive);
};

dia.Primitive = function(representation){
	this.representation = representation;
	this.bindings = {};
	this.defaults = {};
};

dia.Primitive.prototype.setDefault = function(property, value){
	this.defaults[property] = value;
};

dia.Primitive.prototype.bind = function(objectProperty, primitiveProperty){
	if(!this.representation.element.type.hasPropertyId(objectProperty)){
		throw new Error('Cannot bind a property that is not set by the element type');
	}
	this.bindings[primitiveProperty] = objectProperty;
};

dia.Primitive.prototype.getPropertyValue = function(property){
	if(!(property in this.bindings) && !(property in this.defaults)){
		throw new Error('Property ' + property + ' was not bound for primitive');
	}
	
	if(!(property in this.bindings)){
		return this.defaults[property];
	}
	
	var binding = this.bindings[property];
	if(binding.call){
		return binding.call(this, this.representation.element);
	}else{
		return this.representation.element.getProperty(binding);
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

dia.RectanglePrimitive = function(representation){
	dia.Primitive.call(this, representation);
	
	this.requiresBinding('x');
	this.requiresBinding('y');
	this.requiresBinding('width');
	this.requiresBinding('height');
	
	this.setDefault('bgColor', '#ffffff');
	this.setDefault('borderColor', '#000');
};

extend(dia.RectanglePrimitive, dia.Primitive);

dia.RectanglePrimitive.prototype.render = function(ctx){
	ctx.fillStyle = this.getPropertyValue('bgColor');
	ctx.fillRect(
		this.getPropertyValue('x'),
		this.getPropertyValue('y'),
		this.getPropertyValue('width'),
		this.getPropertyValue('height')
	);

	ctx.strokeStyle = this.getPropertyValue('borderColor');
	ctx.strokeRect(
		this.getPropertyValue('x'),
		this.getPropertyValue('y'),
		this.getPropertyValue('width'),
		this.getPropertyValue('height')
	);
};

dia.Generic = {};

dia.Generic.RECTANGLE = new dia.ElementType({
	id: 'generic.rectangle'
});

dia.Generic.RECTANGLE.addProperty(new dia.Property({
	id: 'x',
	type: dia.DataType.INTEGER,
	default: 0
}));

dia.Generic.RECTANGLE.addProperty(new dia.Property({
	id: 'y',
	type: dia.DataType.INTEGER,
	default: 0
}));

dia.Generic.RECTANGLE.addProperty(new dia.Property({
	id: 'width',
	type: dia.DataType.INTEGER,
	default: 100
}));

dia.Generic.RECTANGLE.addProperty(new dia.Property({
	id: 'height',
	type: dia.DataType.INTEGER,
	default: 100
}));

dia.Generic.RECTANGLE.setRepresentationFactory(function(element){
	var repr = new dia.GraphicalRepresentation(element);
	
	var rect = new dia.RectanglePrimitive(repr);
	rect.bind('x', 'x');
	rect.bind('y', 'y');
	rect.bind('width', 'width');
	rect.bind('height', 'height');
	repr.addPrimitive(rect);
	
	return repr;
});
