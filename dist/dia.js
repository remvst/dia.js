var dia = {};

// https://gist.github.com/kaizhu256/2853704
dia.uuid4 = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(cc){
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
dia.distance = function(x1, y1, x2, y2){
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
};

dia.EventDispatcher = function(){
	this.listeners = {};
};

dia.EventDispatcher.prototype.listen = function(event, callback){
	if(!this.listeners[event]){
		this.listeners[event] = [];
	}
	this.listeners[event].push(callback);
};

dia.EventDispatcher.prototype.ignore = function(event, callback){
	if(this.listeners[event]){
		var index = this.listeners[event].indexOf(callback);
		if(index >= 0){
			this.listeners[event].splice(index, 1);
		}
	}
};

dia.EventDispatcher.prototype.dispatch = function(event, data){
	if(this.listeners[event]){
		for(var i = 0 ; i < this.listeners[event].length ; i++){
			this.listeners[event][i].call(this, data);
		}
	}
};

dia.Sheet = function(){
	dia.EventDispatcher.call(this);
	
	this.title = null;
	this.elements = [];
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

dia.Element.prototype.setProperty = function(id, value){
	var tmp;
	if(this.type.hasPropertyId(id)){
		if(this.type.getProperty(id).type.validate(value)){
			tmp = this.properties[id];
			this.properties[id] = value;
			
			if(tmp !== value){
				this.dispatch('propertychange', {
					property: this.type.getProperty(id),
					from: tmp,
					to: value
				});
			}
		}else{
			throw new Error('Validation error: Property ' + id + ' cannot have value ' + value);
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
	this.representationFactory = options.representation || null;
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
	this.type = options.type || dia.DataType.ANY;
	this.description = options.description || null;
	this.default = 'default' in options ? options.default : null;
	this.id = options.id || null;
	this.private = options.private || false;
};

dia.DataType = function(options){
	options = options || {};
	
	this.label = options.label || null;
	this.validate = options.validate || function(){ return true; };
	this.import = options.fromJSON || function(v){ return v; };
	this.export = options.toJSON || function(v){ return v; };
	this.toHTML = options.toHTML || function(currentValue){
		var input = document.createElement('input');
		input.setAttribute('type', 'text');
		input.setAttribute('value', currentValue);
		input.className = 'form-control';
		return input;
	};
	this.fromHTML = options.fromHTML || function(html){
		return html.value;
	};
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

dia.DataType.prototype.createHTMLInput = function(currentValue){
	return this.toHTML.call(this, currentValue);
};

dia.DataType.prototype.getValueFromHTMLInput = function(input){
	return this.fromHTML.call(this, input);
};

dia.DataType.ANY = new dia.DataType({
	label: 'any',
	validate: function(value){
		return true;
	}
});

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
	},
	fromHTML: function(html){
		return parseInt(html.value);
	}
});

dia.DataType.FLOAT = new dia.DataType({
	label: 'float',
	validate: function(value){
		var parsed = parseFloat(value);
		return parsed !== NaN && parsed === value;
	},
	fromHTML: function(html){
		return parseFloat(html.value);
	}
});

dia.ArrayDataType = function(containedType){
	dia.DataType.call(this);
	
	this.containedType = containedType;
};

extend(dia.ArrayDataType, dia.DataType);

dia.ArrayDataType.prototype.validateValue = function(value){
	if(!value || typeof value !== 'object' || value.length === undefined){
		return false;
	}
	for(var i = 0 ; i < value.length ; i++){
		if(!this.containedType.validate(value[i])){
			return false;
		}
	}
	return true;
};

dia.ArrayDataType.prototype.fromJSON = function(value){
	var res = [];
	for(var i = 0 ; i < value.length ; i++){
		res.push(this.containedType.fromJSON(value[i]));
	}
	return res;
};

dia.ArrayDataType.prototype.toJSON = function(value){
	var res = [];
	for(var i = 0 ; i < value.length ; i++){
		res.push(this.containedType.toJSON(value[i]));
	}
	return res;
};

dia.ArrayDataType.prototype.createHTMLInput = function(currentValue){
	var add = function(value){
		var inputContainer = document.createElement('div');
		inputContainer.className = 'input-group form-group';
		inputsContainer.appendChild(inputContainer);

		var input = this.containedType.createHTMLInput(value);
		input.className += ' contained-type-input';
		inputContainer.appendChild(input);
		
		var removerWrapper = document.createElement('span');
		removerWrapper.className = 'input-group-btn';
		inputContainer.appendChild(removerWrapper);

		var remover = document.createElement('button');
		remover.className = 'btn btn-default';
		remover.innerHTML = 'X';
		remover.addEventListener('click', function(){
			inputContainer.parentNode.removeChild(inputContainer);
		}, false);
		removerWrapper.appendChild(remover);
	}.bind(this);

	var container = document.createElement('div');

	var inputsContainer = document.createElement('div');
	container.appendChild(inputsContainer);

	for(var i = 0 ; i < currentValue.length ; i++){
		add(currentValue[i]);
	}

	var nextIndex = currentValue.length;

	var adder = document.createElement('button');
	adder.className = 'btn btn-default';
	adder.innerHTML = 'Add an item';
	adder.addEventListener('click', function(){
		add('');
	}, false);
	container.appendChild(adder);

	return container;
};

dia.ArrayDataType.prototype.getValueFromHTMLInput = function(html){
	var inputs = html.querySelectorAll('.contained-type-input');
	var value = [];
	for(var i = 0 ; i < inputs.length ; i++){
		value.push(this.containedType.getValueFromHTMLInput(inputs[i]));
	}
	return value;
};

dia.DataType.STRING_ARRAY = new dia.ArrayDataType(dia.DataType.STRING);

dia.GraphicalRepresentation = function(element){
	if(!element){
		throw new Error('Cannot instantiate a GraphicalRepresentation without an element.');
	}
	
	this.element = element;
	this.renderables = [];
	this.handles = [];
	
	this.area = null;
};

dia.GraphicalRepresentation.prototype.addRenderable = function(renderable){
	this.renderables.push(renderable);
};

dia.GraphicalRepresentation.prototype.render = function(ctx){
	for(var i = 0 ; i < this.renderables.length ; i++){
		this.renderables[i].render(ctx);
	}
	
	for(var i = 0 ; i < this.handles.length ; i++){
		this.handles[i].render(ctx);
	}
};

dia.GraphicalRepresentation.prototype.addHandle = function(handle){
	this.handles.push(handle);
};

dia.Renderable = function(render){
	this.renderFunction = render;
};

dia.Renderable.prototype.render = function(ctx){
	ctx.save();
	this.renderFunction.call(this, ctx);
	ctx.restore();
};

dia.Primitive = function(representation){
	dia.Renderable.call(this, this.render.bind(this));
	this.representation = representation;
	this.bindings = {};
	this.defaults = {};
};

extend(dia.Primitive, dia.Renderable);

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
		this.getPropertyValue('x') - .5,
		this.getPropertyValue('y') - .5,
		this.getPropertyValue('width') + 1,
		this.getPropertyValue('height') + 1
	);
};

dia.LinePrimitive = function(representation){
	dia.Primitive.call(this, representation);
	
	this.requiresBinding('p1.x');
	this.requiresBinding('p1.y');
	this.requiresBinding('p2.x');
	this.requiresBinding('p2.y');
	
	this.setDefault('color', '#000');
	this.setDefault('thickness', 2);
};

extend(dia.LinePrimitive, dia.Primitive);

dia.LinePrimitive.prototype.render = function(ctx){
	ctx.strokeStyle = this.getPropertyValue('color');
	ctx.lineWidth = this.getPropertyValue('thickness');
	
	ctx.beginPath();
	ctx.moveTo(this.getPropertyValue('p1.x'), this.getPropertyValue('p1.y'));
	ctx.lineTo(this.getPropertyValue('p2.x'), this.getPropertyValue('p2.y'));
	ctx.stroke();
};

dia.BrokenLinePrimitive = function(representation){
	dia.Primitive.call(this, representation);
	
	this.requiresBinding('points');
	
	this.setDefault('color', '#000');
	this.setDefault('thickness', 2);
};

extend(dia.BrokenLinePrimitive, dia.Primitive);

dia.BrokenLinePrimitive.prototype.render = function(ctx){
	ctx.strokeStyle = this.getPropertyValue('color');
	ctx.lineWidth = this.getPropertyValue('thickness');
	
	var points = this.getPropertyValue('points');
	
	ctx.beginPath();
	for(var i = 0 ; i < points.length ; i++){
		ctx.lineTo(points[i].x, points[i].y);
	}
	ctx.stroke();
};

dia.TextPrimitive = function(representation){
	dia.Primitive.call(this, representation);
	
	this.requiresBinding('x');
	this.requiresBinding('y');
	
	this.setDefault('text', '');
	this.setDefault('color', '#000');
	this.setDefault('font', 'Arial');
	this.setDefault('size', 14);
	this.setDefault('lineHeight', 20);
	this.setDefault('align', 'left');
};

extend(dia.TextPrimitive, dia.Primitive);

dia.TextPrimitive.prototype.render = function(ctx){
	ctx.fillStyle = this.getPropertyValue('color');
	ctx.font = this.getPropertyValue('size') + 'pt ' + this.getPropertyValue('font');
	ctx.textBaseline = 'middle';
	ctx.textAlign = this.getPropertyValue('align');
	
	var lines = this.getPropertyValue('text').split("\n"),
		y = this.getPropertyValue('y') + this.getPropertyValue('lineHeight') / 2;
	
	for(var i = 0 ; i < lines.length ; i++, y += this.getPropertyValue('lineHeight')){
		ctx.fillText(lines[i], this.getPropertyValue('x'), y);
	}
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

dia.DragHandle = function(element, area){
	if(!element){
		throw new Error('Cannot create a DragHandle without an element');
	}
	
	this.element = element;
	this.area = area || null;
};

dia.DragHandle.prototype.dragStart = function(x, y){
	
};

dia.DragHandle.prototype.dragMove = function(dx, dy, x, y){
	
};

dia.DragHandle.prototype.dragDrop = function(x, y){
	
};

dia.DragHandle.prototype.render = function(c){
	this.area.render(c);
};

dia.MoveElementDragHandle = function(element, area){
	dia.DragHandle.call(this, element, area);
	
	if(!this.element.type.hasPropertyId('x') || !this.element.type.hasPropertyId('y')){
		throw new Error('Cannot bind a MoveElementDragHandle to an element that has no x or y');
	}
};

extend(dia.MoveElementDragHandle, dia.DragHandle);

dia.MoveElementDragHandle.prototype.dragMove = function(dx, dy){
	var elementX = this.element.getProperty('x');
	var elementY = this.element.getProperty('y');
	
	this.element.setProperty('x', elementX + dx);
	this.element.setProperty('y', elementY + dy);
};

dia.MoveAnchorDragHandle = function(element, area, property){
	dia.DragHandle.call(this, element, area);
	
	this.property = property;
};

extend(dia.MoveAnchorDragHandle, dia.DragHandle);

dia.MoveAnchorDragHandle.prototype.dragMove = function(dx, dy, x, y){
	var propertyValue = this.element.getProperty(this.property);
	
	// Let's bind the coordinates to the element's side
	// At the moment we assume its area will be a rectangle
	var anchoredArea = propertyValue.element.getRepresentation().area;
	var anchoredX = anchoredArea.getX();
	var anchoredY = anchoredArea.getY();
	var anchoredWidth = anchoredArea.getWidth();
	var anchoredHeight = anchoredArea.getHeight();
	
	if(x < anchoredX) x = anchoredX;
	else if(x > anchoredX + anchoredWidth) x = anchoredX + anchoredWidth;
	if(y < anchoredY) y = anchoredY;
	else if(y > anchoredY + anchoredHeight) y = anchoredY + anchoredHeight;
	
	// Let's calculate the ratio (that we're actually storing)
	var ratioX = (x - anchoredX) / anchoredWidth;
	var ratioY = (y - anchoredY) / anchoredHeight;
	
	// And adjust it: the ratio that is the closest to 0 or 1 should be bound to that value
	// and the other will keep the value it was originally going for.
	var factorX = ratioX - .5;
	var factorY = ratioY - .5;
	
	if(Math.abs(factorX) > Math.abs(factorY)){
		ratioX = factorX > 0 ? 1 : 0;
	}else{
		ratioY = factorY > 0 ? 1 : 0;
	}
	
	// Update the object
	// Copying the object is necessary to trigger property change event.
	this.element.setProperty(this.property, {
		element: propertyValue.element,
		x: ratioX,
		y: ratioY
	});
};

dia.Area = function(){
	
};

dia.Area.prototype.contains = function(x, y){
	return false;	
};

dia.Area.prototype.intersectsWith = function(otherArea){
	return false;	
};

dia.Area.prototype.render = function(c){
	
};

dia.Area.prototype.surface = function(){
	return 0;
};

dia.RectangleArea = function(options){
	dia.Area.call(this);
	
	options = options || {};
	this.getX = options.x;
	this.getY = options.y;
	this.getWidth = options.width;
	this.getHeight = options.height;
};

extend(dia.RectangleArea, dia.Area);

dia.RectangleArea.prototype.contains = function(x, y){
	var bounds = this.getBounds();
	
	return x >= bounds.x1 && y >= bounds.y1 && x <= bounds.x2 && y <= bounds.y2;
};

dia.RectangleArea.prototype.getBounds = function(){
	var areaX = this.getX();
	var areaY = this.getY();
	var areaWidth = this.getWidth();
	var areaHeight = this.getHeight();
	
	if(areaWidth < 0){
		areaX += areaWidth;
		areaWidth *= -1;
	}
	if(areaHeight < 0){
		areaY += areaHeight;
		areaHeight *= -1;
	}
	
	return {
		x1: areaX,
		x2: areaX + areaWidth,
		y1: areaY,
		y2: areaY + areaHeight
	};
};

dia.RectangleArea.prototype.intersectsWith = function(otherArea){
	// Let's assume it's another rectangle area
	var a = this.getBounds();
	var b = otherArea.getBounds();
	
	// Taken from http://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
	return a.x1 < b.x2 && a.x2 > b.x1 &&
    	   a.y1 < b.y2 && a.y2 > b.y1;
};

dia.RectangleArea.prototype.render = function(c){
	var areaX = this.getX();
	var areaY = this.getY();
	var areaWidth = this.getWidth();
	var areaHeight = this.getHeight();
	
	c.strokeStyle = 'red';
	c.strokeRect(areaX, areaY, areaWidth, areaHeight);
};

dia.RectangleArea.prototype.surface = function(){
	return this.getWidth() * this.getHeight();
};

dia.LineArea = function(options){
	dia.Area.call(this);
	
	options = options || {};
	this.getX1 = options.x1;
	this.getY1 = options.y1;
	this.getX2 = options.x2;
	this.getY2 = options.y2;
	this.thickness = options.thickness || 10;
};

extend(dia.LineArea, dia.Area);

dia.LineArea.prototype.contains = function(x, y){
	if(this.distance(x, y) > this.thickness){
		return false;
	}else{
		var x1 = this.getX1(),
			x2 = this.getX2(),
			y1 = this.getY1(),
			y2 = this.getY2();
		var dist1 = dia.distance(x, y, x1, y1),
			dist2 = dia.distance(x, y, x2, y2);
		
		return Math.max(dist1, dist2) <= this.getLength();
	}
};

dia.LineArea.prototype.intersectsWith = function(otherArea){
	// TODO
};

dia.LineArea.prototype.distance = function(x0, y0){
	// Taken from https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points
	var x1 = this.getX1(),
		x2 = this.getX2(),
		y1 = this.getY1(),
		y2 = this.getY2();
	
	var up = Math.abs(
		x0 * (y2 - y1) -
		y0 * (x2 - x1) +
		x2 * y1 -
		y2 * x1
	);
	var down = Math.sqrt(
		Math.pow(y2 - y1, 2) +
		Math.pow(x2 - x1, 2)
	);
	
	return up / down;
};

dia.LineArea.prototype.render = function(c){
	c.strokeStyle = 'red';
	c.lineWidth = this.thickness;
	c.beginPath();
	c.moveTo(this.getX1(), this.getY1());
	c.lineTo(this.getX2(), this.getY2());
	c.stroke();
};

dia.LineArea.prototype.getLength = function(){
	var a = this.getX1() - this.getX2();
	var b = this.getY1() - this.getY2();
	
	return dia.distance(this.getX1(), this.getY1(), this.getX2(), this.getY2());
};

dia.LineArea.prototype.surface = function(){
	return this.getLength() * this.thickness;
};

dia.InteractionManager = function(){
	this.sheet = null;
	this.tool = null;
	this.currentPosition = {x: 0, y: 0};
};

dia.InteractionManager.prototype.setTool = function(tool){
	this.tool = tool;
};

dia.InteractionManager.prototype.setSheet = function(sheet){
	this.sheet = sheet;
};

dia.InteractionManager.prototype.mouseDown = function(x, y){
	if(this.tool){
		this.tool.mouseDown(this.sheet, x, y);
	}
};

dia.InteractionManager.prototype.mouseMove = function(x, y){
	if(this.tool){
		this.tool.mouseMove(this.sheet, x, y);
	}
	this.currentPosition = {x: x, y: y};
};

dia.InteractionManager.prototype.mouseUp = function(){
	if(this.tool){
		this.tool.mouseUp(this.sheet, this.currentPosition.x, this.currentPosition.y);
	}
};

dia.InteractionManager.prototype.keyDown = function(keyCode){
	if(this.tool){
		this.tool.keyDown(keyCode);
	}
};

dia.InteractionManager.prototype.keyUp = function(keyUp){
	if(this.tool){
		this.tool.keyUp(keyCode);
	}
};

dia.Toolbox = function(){
	this.toolMap = {};
	this.toolList = [];
};

dia.Toolbox.prototype.addTool = function(tool){
	if(!this.toolMap[tool.id]){
		this.toolMap[tool.id] = tool;
		this.toolList.push(tool);
	}
};

dia.Toolbox.prototype.getTool = function(id){
	return this.toolMap[id] || null;
};

dia.Tool = function(){
	dia.EventDispatcher.call(this);
	
	this.id = null;
};

extend(dia.Tool, dia.EventDispatcher);

dia.Tool.prototype.mouseDown = function(sheet, x, y){
	
};

dia.Tool.prototype.mouseMove = function(sheet, x, y){
	
};

dia.Tool.prototype.mouseUp = function(sheet, x, y){
	
};

dia.Tool.prototype.keyDown = function(sheet, keyCode){
	
};

dia.Tool.prototype.keyUp = function(sheet, keyCode){
	
};

dia.CreateTool = function(options){
	dia.Tool.call(this);
	
	options = options || {};
	
	this.type = options.type || null;
	this.onMouseDown = options.mouseDown || new Function();
	this.onMouseMove = options.mouseMove || new Function();
	this.onMouseUp = options.mouseUp || new Function();
	
	this.currentElement = null;
	
	if(this.type && this.type.id){
		this.id = 'create-' + this.type.id;
	}
};

extend(dia.CreateTool, dia.Tool);

dia.CreateTool.prototype.mouseDown = function(sheet, x, y){
	this.onMouseDown.call(this, sheet, x, y);
};

dia.CreateTool.prototype.mouseMove = function(sheet, x, y){
	this.onMouseMove.call(this, sheet, x, y);
};

dia.CreateTool.prototype.mouseUp = function(sheet, x, y){
	this.onMouseUp.call(this, sheet, x, y);
	
	this.currentElement = null;
};

dia.SelectionTool = function(){
	dia.Tool.call(this);
	
	this.selectionStart = null;
	this.selectionEnd = null;
	this.previousClick = null;
	this.currentSelection = [];
	this.clickCount = 0;
	this.id = 'select';
};

extend(dia.SelectionTool, dia.Tool);

dia.SelectionTool.prototype.mouseDown = function(sheet, x, y){
	this.selectionStart = { x: x, y: y };
	this.selectionEnd = { x: x, y: y };
};

dia.SelectionTool.prototype.mouseMove = function(sheet, x, y){
	if(this.selectionStart){
		this.selectionEnd = { x: x, y: y };
		
		this.dispatch('selectionmove');
	}
	
	// Cancel double click
	this.clickCount = 0;
};

dia.SelectionTool.prototype.mouseUp = function(sheet, x, y){
	if(this.selectionStart){
		var tool = this;
		var area = new dia.RectangleArea({
			x: function(){ return tool.selectionStart.x; },
			y: function(){ return tool.selectionStart.y; },
			width: function(){ return tool.selectionEnd.x - tool.selectionStart.x; },
			height: function(){ return tool.selectionEnd.y - tool.selectionStart.y; }
		});

		this.currentSelection = [];

		for(var i in sheet.elements){
			if(sheet.elements[i].isContainedIn(area)){
				this.currentSelection.push(sheet.elements[i]);
			}
		}
		
		if(this.selectionStart.x === this.selectionEnd.x && this.selectionStart.y == this.selectionEnd.y){
			// It's a click
			if(!this.previousClick 
			   || this.selectionStart.x == this.previousClick.x
			   && this.selectionStart.y == this.previousClick.y
			   && Date.now() - this.previousClick.time < 500){

				this.clickCount++;
			}else{
				this.clickCount = 1;
			}
			
			this.dispatch('click', { clickCount: this.clickCount, element: this.currentSelection[0] || null });

			this.previousClick = this.selectionStart;
			this.previousClick.time = Date.now();
		}
	
		this.selectionStart = null;
		this.dispatch('selectionchange', { selection: this.currentSelection });
	}
	this.selectionEnd = null;
};

dia.SelectionTool.prototype.keyDown = function(sheet, keyCode){
	// TODO
};

dia.SelectionTool.prototype.keyUp = function(sheet, keyCode){
	// TODO
};

dia.EditTool = function(){
	dia.Tool.call(this);
	
	this.currentHandle = null;
	this.currentPosition = {x: 0, y: 0};
	this.id = 'edit';
};

extend(dia.EditTool, dia.Tool);

dia.EditTool.prototype.mouseDown = function(sheet, x, y){
	this.currentHandle = null;
	
	var repr,
		handleArea;
	for(var i = 0 ; i < sheet.elements.length ; i++){
		repr = sheet.elements[i].getRepresentation();
		for(var j = 0 ; j < repr.handles.length ; j++){
			handleArea = repr.handles[j].area;
			if(handleArea.contains(x, y) && 
			   (!this.currentHandle || handleArea.surface() < this.currentHandle.area.surface())){
				this.currentHandle = repr.handles[j];
			}
		}
	}

	if(this.currentHandle){
		this.currentHandle.dragStart(x, y);
	}
	
	this.currentPosition = {x: x, y: y};
};

dia.EditTool.prototype.mouseMove = function(sheet, x, y){
	if(this.currentHandle){
		this.currentHandle.dragMove(
			x - this.currentPosition.x,
			y - this.currentPosition.y,
			x,
			y
		);
	}
	
	this.currentPosition = {x: x, y: y};
};

dia.EditTool.prototype.mouseUp = function(sheet, x, y){
	if(this.currentHandle){
		this.currentHandle.dragDrop(this.currentPosition.x, this.currentPosition.y);
	}
	this.currentHandle = null;
	this.currentPosition = {x: x, y: y};
};

dia.Dialog = function(settings){
	dia.EventDispatcher.call(this);
	
	settings = settings || {};
	
	var mustacheContent = settings.content instanceof HTMLElement ? null : settings.content;
	
	var template = dia.Dialog.getTemplate();
	var html = Mustache.render(template, {
		title: settings.title || null,
		content: mustacheContent || null,
		cancelLabel: settings.cancelLabel || 'Cancel',
		okLabel: settings.okLabel || 'Ok'
	});
	
	this.root = $(html);
	
	this.root.on('hidden', function () {
        $(this).remove();
    });
	
	if(settings.content instanceof HTMLElement){
		this.root.find('.modal-body').append(settings.content);
	}
	
	this.root.find('.modal-footer .btn-primary').click(function(){
		this.hide(true);
	}.bind(this));
	this.root.find('.modal-footer .btn-default').click(function(){
		this.hide(false);
	}.bind(this));
	this.root.find('.close').click(function(){
		this.hide();
	}.bind(this));
};

extend(dia.Dialog, dia.EventDispatcher);

dia.Dialog.prototype.show = function(){
	this.root.appendTo('body');
	this.root.modal({
		show: true,
		backdrop: 'static'
	});
	this.dispatch('show');
};

dia.Dialog.prototype.hide = function(confirmed){
	this.root.modal('hide');
	this.dispatch('hide', {
		confirmed: !!confirmed
	});
};

dia.Dialog.getTemplate = function(){
	return '\
<div class="modal fade" role="dialog">\
	<div class="modal-dialog">\
		<div class="modal-content">\
			<div class="modal-header">\
				<button type="button" class="close">&times;</button>\
				<h4 class="modal-title">{{ title }}</h4>\
			</div>\
			<div class="modal-body">\
				{{ content }}\
			</div>\
			<div class="modal-footer">\
				<button type="button" class="btn btn-default">{{ cancelLabel }}</button>\
				<button type="button" class="btn btn-primary">{{ okLabel }}</button>\
			</div>\
		</div>\
	</div>\
</div>';
};

dia.Canvas = function(sheet){
	this.sheet = sheet;
	
	this.offsetX = 0;
	this.offsetY = 0;
	
	this.width = 0;
	this.height = 0;
};

dia.Canvas.prototype.setDimensions = function(width, height){
	this.width = width;
	this.height = height;
};

dia.Canvas.prototype.render = function(ctx){
	// Background color
	ctx.fillStyle = 'rgb(240, 240, 240)';
	ctx.fillRect(0,0, this.width, this.height);
	
	// Grid (TODO)
	
	// Sheet
	ctx.save();
	ctx.translate(this.offsetX, this.offsetY);
	this.sheet.render(ctx);
	ctx.restore();
};

dia.App = function(){
	this.toolbox = new dia.Toolbox();
	this.sheet = new dia.Sheet();
};

dia.App.prototype.start = function(){
	this.toolbox.addTool(new dia.SelectionTool());
	this.toolbox.addTool(new dia.EditTool());
	
	for(var i in dia.ElementType.types){
		if(dia.ElementType.types[i].creatorTool){
			this.toolbox.addTool(dia.ElementType.types[i].creatorTool);
		}
	}
	
	this.gui = new dia.GUI(this);
	this.gui.renderToolbox();
};

dia.GUI = function(app){
	if(!app){
		throw new Error('Cannot instantiate GUI without an app');
	}
	
	this.app = app;
	
	this.canvas = document.getElementById('canvas');
	this.context = this.canvas.getContext('2d');
	
	this.sheetCanvases = {};
	
	this.boundElementAdded = this.elementAdded.bind(this);
	this.boundElementRemoved = this.elementRemoved.bind(this);
	this.boundElementModified = this.elementModified.bind(this);
	
	this.setupInterationManager();
	
	var selectionTool = this.app.toolbox.getTool('select');
	if(selectionTool){
		selectionTool.listen('selectionmove', this.renderSheet.bind(this));
		selectionTool.listen('selectionchange', this.renderSheet.bind(this));
		selectionTool.listen('click', this.selectionClick.bind(this));
	}
	
	
	// Resizing the canvas
	var content = $('#canvas-container'),
		gui = this;
			
	var resize = function(){
		var width = content.outerWidth();
		var height = content.outerHeight();

		gui.canvas.width = width;
		gui.canvas.height = height;
		
		gui.sheetCanvases[gui.app.sheet.id].setDimensions(width, height);
	};
	window.addEventListener('resize', resize, false);
	resize();
};

dia.GUI.prototype.setupInterationManager = function(){
	if(this.interactionManager){
		return;
	}
	
	this.interactionManager = new dia.InteractionManager();
	this.interactionManager.setSheet(this.app.sheet);
	
	var selectionTool = this.app.toolbox.getTool('select');
	if(selectionTool){
		this.interactionManager.setTool(selectionTool);
	}
	
	this.sheetCanvases[this.app.sheet.id] = new dia.Canvas(this.app.sheet);
	
	var gui = this;
	
	this.canvas.addEventListener('mousedown', function(e){
		var position = gui.getPositionOnSheet(e);
		gui.interactionManager.mouseDown(position.x, position.y);
	}, false);
	this.canvas.addEventListener('mousemove', function(e){
		var position = gui.getPositionOnSheet(e);
		gui.interactionManager.mouseMove(position.x, position.y);
	}, false);
	this.canvas.addEventListener('mouseup', function(e){
		var position = gui.getPositionOnSheet(e);
		gui.interactionManager.mouseUp(position.x, position.y);
	}, false);
	
	this.app.sheet.listen('elementadded', this.elementAdded.bind(this));
	this.app.sheet.listen('elementremoved', this.elementRemoved.bind(this));
};

dia.GUI.prototype.getPositionOnSheet = function(event){
	var offset = $('#canvas').offset();
	
	// TODO account for canvas offset
	return {
		x: event.pageX - offset.left,
		y: event.pageY - offset.top
	};
};

dia.GUI.prototype.renderToolbox = function(){
	var container = $('#toolbox'),
		gui = this;
	
	var tool,
		button;
	for(var i = 0 ; i < this.app.toolbox.toolList.length ; i++){
		tool = this.app.toolbox.toolList[i];
		button = $('<button></button>')
					.addClass('btn btn-default btn-block btn-lg')
					.text(tool.id)
					.appendTo(container)
					.click((function(t){
						return function(){
							gui.selectTool(t);
						}
					})(tool));
		
		tool.listen('elementcreated', this.doneCreating.bind(this));
	}
};

dia.GUI.prototype.doneCreating = function(){
	var select = this.app.toolbox.getTool('select');
	this.interactionManager.setTool(select);
};

dia.GUI.prototype.selectTool = function(tool){
	this.interactionManager.setTool(tool);
};

dia.GUI.prototype.renderSheet = function(){
	var canvas = this.sheetCanvases[this.app.sheet.id];
	canvas.render(this.context);
	
	// Rendering selection
	var selectionTool = this.app.toolbox.getTool('select');
	if(selectionTool && selectionTool.selectionStart){
		this.context.strokeStyle = 'black';
		this.context.strokeRect(
			selectionTool.selectionStart.x + .5,
			selectionTool.selectionStart.y + .5,
			selectionTool.selectionEnd.x - selectionTool.selectionStart.x,
			selectionTool.selectionEnd.y - selectionTool.selectionStart.y
		)
	}
};

dia.GUI.prototype.selectionClick = function(e){
	if(e.clickCount == 2 && e.element){
		var form = new dia.ElementForm(e.element);
		var root = form.getHTMLRoot();

		var dialog = new dia.Dialog({
			title: 'Edit class',
			content: root
		});
		dialog.show();
		
		dialog.listen('hide', function(e){
			if(e.confirmed){
				form.submit();
			}
		});
	}
};

dia.GUI.prototype.elementAdded = function(e){
	e.element.listen('propertychange', this.boundElementModified);
	this.renderSheet();
};

dia.GUI.prototype.elementRemoved = function(e){
	this.renderSheet();
};

dia.GUI.prototype.elementModified = function(e){
	this.renderSheet();
};

dia.ElementForm = function(element){
	if(!element){
		throw new Error('Cannot create ElementForm without element parameter.');
	}
	
	this.element = element;
	this.htmlRoot = null;
	this.inputMap = {};
	this.validMap = {};
};

dia.ElementForm.prototype.getHTMLRoot = function(){
	if(!this.htmlRoot){
		this.htmlRoot = this.createHTMLRoot();
	}
	return this.htmlRoot;
};

dia.ElementForm.prototype.createHTMLRoot = function(){
	var root = document.createElement('div'),
		form = this;
	
	this.element.type.properties.forEach(function(property){
		if(property.private){
			return;
		}
		
		var propertyRoot = document.createElement('div');
		propertyRoot.className = 'row form-group';
		
		var labelContainer = document.createElement('div');
		labelContainer.className = 'col-md-6';
		propertyRoot.appendChild(labelContainer);
		
		var inputContainer = document.createElement('div');
		inputContainer.className = 'col-md-6';
		propertyRoot.appendChild(inputContainer);
		
		var label = document.createElement('label');
		label.innerHTML = property.label || property.id;
		label.title = property.description;
		label.className = 'col-md-6';
		labelContainer.appendChild(label);
		
		var input = property.type.createHTMLInput(form.element.getProperty(property.id));
		inputContainer.appendChild(input);
		
		root.appendChild(propertyRoot);
		
		// Let's store the input so we can parse it later
		form.inputMap[property.id] = input;
		
		form.validMap[property.id] = true;
	});
	
	return root;
};

dia.ElementForm.prototype.isValid = function(){
	if(!this.htmlRoot){
		throw new Error('Cannot check validation form a form that was never rendered');
	}
	
	var valid = true,
		form = this;
	this.element.type.properties.forEach(function(property){
		if(property.private){
			return;
		}
		
		var input = form.inputMap[property.id];
		var newValue = property.type.getValueFromHTMLInput(input);
		
		if(!property.type.validateValue(newValue)){
			valid = false;
			form.validMap[property.id] = false;
		}else{
			form.validMap[property.id] = true;
		}
	});
	
	return valid;
};

dia.ElementForm.prototype.submit = function(){
	if(!this.htmlRoot){
		throw new Error('Cannot submit a form that was never rendered');
	}
	
	if(!this.isValid()){
		throw new Error('Form is invalid. Cannot submit');
	}
	
	var form = this;
	
	this.element.type.properties.forEach(function(property){
		if(property.private){
			return;
		}
		
		var input = form.inputMap[property.id];
		var newValue = property.type.getValueFromHTMLInput(input);
		
		form.element.setProperty(property.id, newValue);
	});
};
