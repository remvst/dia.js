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

dia.distance = function(x1, y1, x2, y2){
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
};

dia.between = function(a, b, c){
	return a <= b && b <= c;
};

dia.limit = function(x, min, max){
	if(x < min){
		return min;
	}else if(x > max){
		return max;
	}else{
		return x;
	}
};

dia.snap = function(x, gridSize){
	gridSize = Math.abs(gridSize) || 1;
	return Math.round(x / gridSize) * gridSize;
};

dia.measureFontWidth = function(font, text){
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	ctx.font = font;
	return ctx.measureText(text).width;
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
		for(var i = this.listeners[event].length - 1 ; i >= 0 ; i--){
			this.listeners[event][i].call(this, data);
		}
	}
};

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
		id: this.id,
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

dia.Sheet.prototype.reset = function(){
	this.elements = [];
	this.elementsMap = {};
	this.id = dia.uuid4();
	this.title = null;
};

dia.Sheet.fromJSON = function(json){
	var sheet = new dia.Sheet();
	sheet.title = json.title || sheet.title;
	sheet.id = json.id || sheet.id;
	sheet.gridSize = json.gridSize || sheet.gridSize;

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
				throw new Error('Validation error: Property ' + id + ' cannot have value ' + newValue);
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

dia.Element.prototype.execute = function(functionId){
	var fn = this.type.getFunction(functionId);
	if(!fn){
		throw new Error('Function ' + functionId + ' does not seem to exist.');
	}
	fn.apply(this);
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

dia.ElementType = function(options){
	options = options || {};

	this.id = options.id || null;
	this.label = options.label || null;
	this.properties = [];
	this.propertyMap = {};
	this.representationFactory = function(){};
	this.tools = [];
	this.anchorable = 'anchorable' in options ? options.anchorable : true;
	this.functions = [];
	this.functionMap = {};
	this.layer = 'layer' in options ? options.layer : 2;
	this.setupFunctions = [];

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
		layer: 'layer' in options ? options.layer : this.layer
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

dia.ElementTypeFunction = function(options){
	this.id = options.id || null;
	this.label = options.label || null;
	this.applyFunction = options.apply;
};

dia.ElementTypeFunction.prototype.apply = function(element){
	this.applyFunction.call(this, element);
};

dia.Property = function(options){
	options = options || {};
	
	this.label = options.label || null;
	this.type = options.type || dia.DataType.ANY;
	this.description = options.description || null;
	this.default = 'default' in options ? options.default : null;
	this.id = options.id || null;
	this.private = options.private || false;
	this.onChange = options.onChange || null;
};

dia.Property.prototype.clone = function(){
	return new dia.Property({
		label: this.label,
		type: this.type,
		description: this.description,
		default: this.default,
		id: this.id,
		private: this.private
	});
};

dia.Property.prototype.elementChangedValue = function(element, fromValue, toValue){
	if(this.onChange){
		this.onChange(element, fromValue, toValue);
	}
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
	this.toString = options.toString || function(v) { return v.toString(); };
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

dia.DataType.ANCHOR = new dia.DataType({
	label: 'anchor',
	validate: function(value){
		return !!(value
			&& typeof value.x === 'number'
			&& typeof value.y === 'number'
			&& typeof value.element === 'string'
			&& typeof value.angle === 'number');

	}
});

dia.DataType.POINT = new dia.DataType({
	label: 'point',
	validate: function(value){
		return !!(value
			&& typeof value.x === 'number'
			&& typeof value.y === 'number');

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
		remover.className = 'btn btn-default btn-remove';
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
	adder.className = 'btn btn-default btn-add';
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
dia.DataType.INTEGER_ARRAY = new dia.ArrayDataType(dia.DataType.INTEGER);
dia.DataType.FLOAT_ARRAY = new dia.ArrayDataType(dia.DataType.FLOAT);
dia.DataType.POINT_ARRAY = new dia.ArrayDataType(dia.DataType.POINT);
dia.DataType.ANY_ARRAY = new dia.ArrayDataType(dia.DataType.ANY);

dia.EnumerationDataType = function(settings){
	dia.DataType.call(this);
	
	this.label = settings.label || 'choice';
	this.values = settings.values || settings;
};

extend(dia.EnumerationDataType, dia.DataType);

dia.EnumerationDataType.prototype.validateValue = function(value){
	return this.values.indexOf(value) !== -1;
};

dia.EnumerationDataType.prototype.createHTMLInput = function(currentValue){
	var select = document.createElement('select'),
		option;
	
	select.className = 'form-control';
	
	for(var i = 0 ; i < this.values.length ; i++){
		option = document.createElement('option');
		option.valueRef = this.values[i];
		option.innerHTML = this.values[i].toString();
		select.appendChild(option);
		
		if(currentValue === this.values[i]){
			select.selectedIndex = i;
		}
	}
	
	return select;
};

dia.EnumerationDataType.prototype.getValueFromHTMLInput = function(html){
	return html.options[html.selectedIndex].valueRef;
};

dia.GraphicalRepresentation = function(element){
	if(!element){
		throw new Error('Cannot instantiate a GraphicalRepresentation without an element.');
	}
	
	this.element = element;
	this.renderables = []; // list of renderable objects that will render on the canvas
	this.handles = []; // drag handles used to modify the element
	this.guides = []; // guides that should help align other elements
	
	this.area = null; // area covered by the representation
	this.moveHandle = null; // area that should be used to move the element around
};

dia.GraphicalRepresentation.prototype.addRenderable = function(renderable){
	this.renderables.push(renderable);
};

dia.GraphicalRepresentation.prototype.render = function(ctx){
	ctx.save();
	
	for(var i = 0 ; i < this.renderables.length ; i++){
		this.renderables[i].render(ctx);
	}
	
	if(this.element.highlighted){
		for(var i = 0 ; i < this.handles.length ; i++){
			this.handles[i].render(ctx);
		}
	}
	
	ctx.restore();
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

dia.DragHandle = function(element, area){
	if(!element){
		throw new Error('Cannot create a DragHandle without an element');
	}
	
	this.element = element;
	this.area = area || null;
	this.cursor = '-webkit-grab';
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
	
	this.start = null;
	
	this.currentSnap = null;
};

extend(dia.MoveElementDragHandle, dia.DragHandle);

dia.MoveElementDragHandle.prototype.dragStart = function(x, y){
	this.currentSnap = null;
	
	this.lastPosition = {
		x: this.element.getProperty('x'),
		y: this.element.getProperty('y')
	};
};

dia.MoveElementDragHandle.prototype.dragMove = function(dx, dy){
	var expectedX = this.lastPosition.x + dx;
	var expectedY = this.lastPosition.y + dy;

	this.element.setProperty('x', expectedX);
	this.element.setProperty('y', expectedY);
	
	// Snap to guides
	var repr = this.element.getRepresentation();
	
	this.currentSnap = null;
	for(var i = 0 ; !this.currentSnap && repr && i < repr.guides.length ; i++){
		this.trySnap(repr.guides[i]);
	}
	
	// Snapping to grid
	if(this.element.getProperty('x') === expectedX){
		this.element.setProperty('x', dia.snap(expectedX, this.element.sheet.gridSize));
	}
	if(this.element.getProperty('y') === expectedY){
		this.element.setProperty('y', dia.snap(expectedY, this.element.sheet.gridSize));
	}

	this.lastPosition = {
		x: expectedX,
		y: expectedY
	};
};

dia.MoveElementDragHandle.prototype.dragDrop = function(){
	this.currentSnap = null;
};

dia.MoveElementDragHandle.prototype.render = function(c){
	dia.DragHandle.prototype.render.call(this, c);
	
	if(this.currentSnap){
		this.currentSnap.elementGuide.render(c, this.currentSnap.otherGuide);
	}
};

dia.MoveElementDragHandle.prototype.trySnap = function(guide){
	this.currentSnap = null;
	
	var handle = this;
	this.element.sheet.elements.forEach(function(element){
		if(handle.element === element || handle.currentSnap){
			// No need to snap with self
			return;
		}
		
		var repr = element.getRepresentation();
		
		for(var i = 0 ; repr && i < repr.guides.length ; i++){
			if(guide.shouldSnap(repr.guides[i], 10)){
			  	guide.snap(repr.guides[i]);
				handle.currentSnap = {
					elementGuide: guide,
					otherGuide: repr.guides[i]
				};
				
				break; // Let's snap to only one guide
			}
		}
	});
};

dia.MoveRelationDragHandle = function(element, area, property){
	dia.DragHandle.call(this, element, area);
	
	this.property = property;
};

extend(dia.MoveRelationDragHandle, dia.DragHandle);

dia.MoveRelationDragHandle.prototype.dragStart = function(x, y){
	this.accumDX = 0;
	this.accumDY = 0;
	
	this.initialPoints = this.element.getProperty(this.property);
};

dia.MoveRelationDragHandle.prototype.dragMove = function(dx, dy){
	this.accumDX += dx;
	this.accumDY += dy;
	
	var points = this.element.getProperty(this.property);
	
	var newPoints = [];
	for(var i = 0 ; i < points.length ; i++){
		newPoints.push({
			x: dia.snap(this.initialPoints[i].x + this.accumDX, this.element.sheet.gridSize),
			y: dia.snap(this.initialPoints[i].y + this.accumDY, this.element.sheet.gridSize)
		});
	}
	
	this.element.setProperty(this.property, newPoints);
};

dia.MoveAnchorDragHandle = function(element, area, property){
	dia.DragHandle.call(this, element, area);

	this.property = property;
};

extend(dia.MoveAnchorDragHandle, dia.DragHandle);

dia.MoveAnchorDragHandle.prototype.dragMove = function(dx, dy, x, y){
	x = dia.snap(x, this.element.sheet.gridSize);
	y = dia.snap(y, this.element.sheet.gridSize);

	var anchor = this.element.getProperty(this.property);

	var anchoredElement = this.element.sheet.getElement(anchor.element);
	var anchoredArea = anchoredElement.getRepresentation().area;

	if(!anchoredArea.contains(x, y)){
		anchoredElement = this.element.sheet.findElementContaining(x, y, function(element){
			return element.type.isAnchorable();
		}) || anchoredElement;
	}

	anchoredArea = anchoredElement.getRepresentation().area;
	var relativePosition = anchoredArea.getRelativePositionFromAbsolute(x, y);

	// Copying the object is necessary to trigger property change event.
	var newAnchor = {
		element: anchoredElement.id,
		x: relativePosition.x,
		y: relativePosition.y,
		angle: anchor.angle
	};

	// Let's bind the coordinates to the element's side
	if(anchoredArea.contains(x, y)){
		anchoredArea.bindAnchorToBounds(newAnchor);
	}

	// Update the object
	this.element.setProperty(this.property, newAnchor);
};

dia.MoveAnchorDragHandle.prototype.dragDrop = function(x, y){
	var anchor = this.element.getProperty(this.property);
	var anchoredElement = this.element.sheet.getElement(anchor.element);
	var anchoredArea = anchoredElement.getRepresentation().area;

	var newAnchor = {
		element: anchor.element,
		x: anchor.x,
		y: anchor.y,
		angle: anchor.angle
	};
	anchoredArea.bindAnchorToBounds(newAnchor);

	// Update the object
	this.element.setProperty(this.property, newAnchor);
};

dia.BrokenLineDragHandle = function(element, area, property){
	dia.DragHandle.call(this, element, area);

	this.property = property;
	this.breakIndex = null;
	this.modifiedPoint = null;
	this.breakOffset = 0;
};

extend(dia.BrokenLineDragHandle, dia.DragHandle);

dia.BrokenLineDragHandle.prototype.dragStart = function(x, y){
	this.breakIndex = null;
	this.modifiedPoint = null;

	// Let's find the line we should split into two
	var index = this.area.indexOfLineThatContains(x, y);

	if(index !== -1){
		var points = this.element.getProperty(this.property);
		var point1 = points[index - 1];
		var point2 = points[index];

		if(point1 && dia.distance(x, y, point1.x, point1.y) <= 20 && index >= 0){
			this.modifiedPoint = point1;
		}else if(point2 && dia.distance(x, y, point2.x, point2.y) <= 20 && index < points.length){
			this.modifiedPoint = point2;
		}else{
			// We're too far from the points, let's create a new one
			// not splitting until we move the mouse (to avoid having too many points)
			this.breakIndex = index;
			this.modifiedPoint = {};
		}
	}
};

dia.BrokenLineDragHandle.prototype.dragMove = function(dx, dy, x, y){
	var points = this.element.getProperty(this.property);

	var newPoints = points.slice(0);
	if(this.breakIndex !== null){
		newPoints.splice(this.breakIndex + this.breakOffset, 0, this.modifiedPoint);
		this.breakIndex = null;
	}

	this.modifiedPoint.x = dia.snap(x, this.element.sheet.gridSize);
	this.modifiedPoint.y = dia.snap(y, this.element.sheet.gridSize);

	// Update the object
	// Copying the object is necessary to trigger property change event.
	this.element.setProperty(this.property, newPoints);
};

dia.BrokenLineDragHandle.prototype.dragDrop = function(x, y){
	if(!this.modifiedPoint){
		return;
	}

	var points = this.element.getProperty(this.property);
	var modifiedIndex = points.indexOf(this.modifiedPoint);

	var point1 = points[modifiedIndex - 1];
	var point2 = points[modifiedIndex + 1];

	var newPoints,
		needsRemove = false;
	if(point1 && dia.distance(this.modifiedPoint.x, this.modifiedPoint.y, point1.x, point1.y) <= 10
	   || point2 && dia.distance(this.modifiedPoint.x, this.modifiedPoint.y, point2.x, point2.y) <= 10){

		needsRemove = true;
	}else{
		// Fusing with the first or last point (not intermediate)
		var areaPoints = this.area.getPoints();
		var areaFirstPoint = areaPoints[0];
		var areaLastPoint = areaPoints[areaPoints.length - 1];

		var areaPoints = this.area.getPoints(),
			areaFusedPoint;
		if(modifiedIndex === 0){
			areaPoints = this.area.getPoints();
			areaFusedPoint = areaPoints[0];
			if(dia.distance(this.modifiedPoint.x, this.modifiedPoint.y, areaFusedPoint.x, areaFusedPoint.y) <= 10){
				needsRemove = true;
			}
		}
		if(modifiedIndex === points.length - 1){
			areaPoints = this.area.getPoints();
			areaFusedPoint = areaPoints[areaPoints.length - 1];
			if(dia.distance(this.modifiedPoint.x, this.modifiedPoint.y, areaFusedPoint.x, areaFusedPoint.y) <= 10){
				needsRemove = true;
			}
		}
	}

	if(needsRemove){
		newPoints = points.slice(0);
		newPoints.splice(modifiedIndex, 1);

		this.element.setProperty(this.property, newPoints);
	}

	this.breakIndex = null;
	this.modifiedPoint = null;
};

dia.Area = function(){
	this.type = null;
	this.guides = null;
};

dia.Area.prototype.contains = function(x, y){
	return false;	
};

dia.Area.prototype.intersectsWith = function(otherArea){
	return dia.Area.intersect(this, otherArea);
};

dia.Area.prototype.render = function(c){
	
};

dia.Area.prototype.surface = function(){
	return 0;
};

dia.Area.prototype.bindAnchorToBounds = function(anchor){
	
};

dia.Area.prototype.getRelativeCenter = function(){
	return {
		x: 0,
		y: 0
	};
};

dia.Area.prototype.getAbsolutePositionFromRelative = function(x, y){
	return {
		x: x,
		y: y
	};
};

dia.Area.prototype.getRelativePositionFromAbsolute = function(x, y){
	return {
		x: x,
		y: y
	};
};

dia.Area.prototype.getGuides = function(element){
	return [];
};

dia.Area.intersectionMap = {};

dia.Area.defineIntersection = function(type1, type2, func){
	dia.Area.intersectionMap[type1 + '-' + type2] = func;
	
	if(type1 !== type2){
		// Let's add it for both ways
		dia.Area.intersectionMap[type2 + '-' + type1] = function(a, b){
			return func(b, a);
		};
	}
};

dia.Area.intersect = function(area1, area2){
	var func = dia.Area.intersectionMap[area1.type + '-' + area2.type];
	if(!func){
		return false;
	}else{
		return func(area1, area2);
	}
};

dia.RectangleArea = function(options){
	dia.Area.call(this);
	
	this.type = 'rectangle';
	
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

dia.RectangleArea.prototype.render = function(c){
	var areaX = this.getX();
	var areaY = this.getY();
	var areaWidth = this.getWidth();
	var areaHeight = this.getHeight();
	
	c.strokeStyle = 'red';
	c.lineWidth = 1;
	c.strokeRect(areaX + .5, areaY + .5, areaWidth, areaHeight);
};

dia.RectangleArea.prototype.surface = function(){
	return this.getWidth() * this.getHeight();
};

dia.RectangleArea.prototype.bindAnchorToBounds = function(anchor){
	var bounds = this.getBounds();
	
	var width = this.getWidth(),
		height = this.getHeight();
	
	// Let's put the anchor within our bounds
	anchor.x = dia.limit(anchor.x, 0, width);
	anchor.y = dia.limit(anchor.y, 0, height);
	
	// Now let's adjust it
	var factorX = (anchor.x - width / 2) / width;
	var factorY = (anchor.y - height / 2) / height;
	
	if(Math.abs(factorX) > Math.abs(factorY)){
		anchor.x = factorX > 0 ? width : 0;
	}else{
		anchor.y = factorY > 0 ? height : 0;
	}
	
	// Let's set the outgoing angle
	if(anchor.x === 0){
		anchor.angle = Math.PI;
	}else if(anchor.x === width){
		anchor.angle = 0;
	}else if(anchor.y === 0){
		anchor.angle = -Math.PI / 2;
	}else{
		anchor.angle = Math.PI / 2;
	}
	
	return anchor;
};

dia.RectangleArea.prototype.getAbsolutePositionFromRelative = function(x, y){
	return {
		x: x + this.getX(),
		y: y + this.getY()
	};
};

dia.RectangleArea.prototype.getRelativePositionFromAbsolute = function(x, y){
	return {
		x: x - this.getX(),
		y: y - this.getY()
	};
};

dia.RectangleArea.prototype.getRelativeCenter = function(){
	return {
		x: this.getWidth() / 2,
		y: this.getHeight() / 2
	};
};

dia.RectangleArea.prototype.getGuides = function(element){
	var area = this;
	
	return [
		new dia.HorizontalGuide({
			element: element,
			x: function(){ return area.getX() + area.getWidth() / 2; },
			y: function(){ return area.getY(); },
			offset: function(){ return 0; }
		}),
		new dia.HorizontalGuide({
			element: element,
			x: function(){ return area.getX() + area.getWidth() / 2; },
			y: function(){ return area.getY() + area.getHeight(); },
			offset: function(){ return area.getHeight(); }
		}),
		new dia.VerticalGuide({
			element: element,
			x: function(){ return area.getX(); },
			y: function(){ return area.getY() + area.getHeight() / 2; },
			offset: function(){ return 0; }
		}),
		new dia.VerticalGuide({
			element: element,
			x: function(){ return area.getX() + area.getWidth(); },
			y: function(){ return area.getY() + area.getHeight() / 2; },
			offset: function(){ return area.getWidth(); }
		})
	];
};

dia.Area.defineIntersection('rectangle', 'rectangle', function(a, b){
	// Let's assume it's another rectangle area
	var boundsA = a.getBounds();
	var boundsB = b.getBounds();
	
	// Taken from http://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
	return boundsA.x1 < boundsB.x2 && boundsA.x2 > boundsB.x1 &&
    	   boundsA.y1 < boundsB.y2 && boundsA.y2 > boundsB.y1;
});

dia.CircleArea = function(options){
	dia.Area.call(this);
	
	this.type = 'circle';
	
	this.getX = options.x;
	this.getY = options.y;
	this.getRadius = options.radius;
};

extend(dia.CircleArea, dia.Area);

dia.CircleArea.prototype.contains = function(x, y){
	return dia.distance(x, y, this.getX(), this.getY()) <= this.getRadius();
};

dia.CircleArea.prototype.render = function(c){
	var areaX = this.getX();
	var areaY = this.getY();
	var areaRadius = this.getRadius();
	
	c.strokeStyle = 'red';
	c.lineWidth = 1;
	c.beginPath();
	c.arc(areaX, areaY, areaRadius, 0, 2 * Math.PI, true);
	c.stroke();
};

dia.CircleArea.prototype.surface = function(){
	return Math.PI * Math.pow(this.getRadius(), 2);
};

dia.CircleArea.prototype.bindAnchorToBounds = function(anchor){
	var angle = Math.atan2(anchor.y, anchor.x);
	anchor.x = Math.cos(angle) * this.getRadius();
	anchor.y = Math.sin(angle) * this.getRadius();
	anchor.angle = angle;
	return anchor;
};

dia.CircleArea.prototype.getAbsolutePositionFromRelative = function(x, y){
	return {
		x: x + this.getX(),
		y: y + this.getY()
	};
};

dia.CircleArea.prototype.getRelativePositionFromAbsolute = function(x, y){
	return {
		x: x - this.getX(),
		y: y - this.getY()
	};
};

dia.CircleArea.prototype.getGuides = function(element){
	var area = this;
	
	return [
		new dia.HorizontalGuide({
			element: element,
			x: function(){ return area.getX(); },
			y: function(){ return area.getY() - area.getRadius(); },
			offset: function(){ return -area.getRadius(); }
		}),
		new dia.HorizontalGuide({
			element: element,
			x: function(){ return area.getX(); },
			y: function(){ return area.getY() + area.getRadius(); },
			offset: function(){ return area.getRadius(); }
		}),
		new dia.VerticalGuide({
			element: element,
			x: function(){ return area.getX() - area.getRadius(); },
			y: function(){ return area.getY(); },
			offset: function(){ return -area.getRadius(); }
		}),
		new dia.VerticalGuide({
			element: element,
			x: function(){ return area.getX() + area.getRadius(); },
			y: function(){ return area.getY(); },
			offset: function(){ return area.getRadius(); }
		})
	];
};

dia.Area.defineIntersection('rectangle', 'circle', function(rectangle, circle){
	// Let's assume it's another rectangle area
	var areaX = circle.getX();
	var areaY = circle.getY();
	var areaRadius = circle.getRadius();
	
	var bounds = rectangle.getBounds();
	
	// Check if rectangle contains the center
	if(dia.between(bounds.x1, areaX, bounds.x2) && dia.between(bounds.y1, areaY, bounds.y2)){
		return true;
	}
	
	// Check if circle is on the top or bottom
	if(dia.between(bounds.x1, areaX, bounds.x2) && dia.between(bounds.y1 - areaRadius, areaY, bounds.y2 + areaRadius)){
		return true;
	}
	
	// Check if circle is on the left or right
	if(dia.between(bounds.y1, areaY, bounds.y2) && dia.between(bounds.x1 - areaRadius, areaX, bounds.x2 + areaRadius)){
		return true;
	}
	
	return false;
});

dia.LineArea = function(options){
	dia.Area.call(this);
	
	this.type = 'line';
	
	this.getX1 = options.x1;
	this.getY1 = options.y1;
	this.getX2 = options.x2;
	this.getY2 = options.y2;
	this.thickness = options.thickness || 10;
};

extend(dia.LineArea, dia.Area);

dia.LineArea.prototype.contains = function(x, y){
	if(this.distance(x, y) > this.thickness / 2){
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
	c.lineWidth = this.thickness / 4;
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

dia.Area.defineIntersection('line', 'line', function(a, b){
	var coeffA = (a.getY2() - a.getY1()) / (a.getX2() - a.getX1());
	var coeffB = (b.getY2() - b.getY1()) / (b.getX2() - b.getX1());
	
	// Parallel lines
	if(coeffA === coeffB){
		return false;
	}
	
	// Let's calculate the full equations
	var originA = a.getY1() - coeffA * a.getX1();
	var originB = b.getY1() - coeffB * b.getX1();
	
	// Let's find the intersection point
	var intersectionY = (originA * coeffB - coeffA * originB) / (coeffB - coeffA);
	var intersectionX = (intersectionY - originA) / coeffA;
	
	return dia.between(
		Math.min(a.getX1(), a.getX2()),
		intersectionX,
		Math.max(a.getX1(), a.getX2())
	) &&
	dia.between(
		Math.min(a.getY1(), a.getY2()),
		intersectionY,
		Math.max(a.getY1(), a.getY2())
	) && dia.between(
		Math.min(b.getX1(), b.getX2()),
		intersectionX,
		Math.max(b.getX1(), b.getX2())
	) &&
	dia.between(
		Math.min(b.getY1(), b.getY2()),
		intersectionY,
		Math.max(b.getY1(), b.getY2())
	);
});

dia.Area.defineIntersection('line', 'rectangle', function(line, rectangle){
	// Easy case, if the rectangle contains one of the intersections
	if(rectangle.contains(line.getX1(), line.getY1())
	  || rectangle.contains(line.getX2(), line.getY2())){
		return true;
	}
	
	// Otherwise, we have to check for intersections with diagonals
	
	var bounds = rectangle.getBounds();
	var diag1 = new dia.LineArea({
		x1: function(){ return bounds.x1; },
		y1: function(){ return bounds.y1; },
		x2: function(){ return bounds.x2; },
		y2: function(){ return bounds.y2; },
	});
	var diag2 = new dia.LineArea({
		x1: function(){ return bounds.x2; },
		y1: function(){ return bounds.y1; },
		x2: function(){ return bounds.x1; },
		y2: function(){ return bounds.y2; },
	});
	
	return line.intersectsWith(diag1) || line.intersectsWith(diag2);
});

dia.BrokenLineArea = function(options){
	dia.Area.call(this);

	this.getPoints = options.points;
	this.thickness = options.thickness || 10;
	this.type = 'brokenline'
};

extend(dia.BrokenLineArea, dia.Area);

dia.BrokenLineArea.prototype.contains = function(x, y){
	return this.indexOfLineThatContains(x, y) !== -1;
};

dia.BrokenLineArea.prototype.indexOfLineThatContains = function(x, y){
	var points = this.getPoints(),
		area,
		minDistance,
		dist,
		closest = -1;
	for(var i = 0 ; i < points.length - 1 ; i++){
		area = new dia.LineArea({
			x1: function(){ return points[i].x; },
			y1: function(){ return points[i].y; },
			x2: function(){ return points[i + 1].x; },
			y2: function(){ return points[i + 1].y; },
			thickness: this.thickness
		});

		if(area.contains(x, y)){
			dist = area.distance(x, y);
			if(closest === -1 || dist < minDistance){
				closest = i;
				minDistance = dist;
			}
		}
	}

	return closest;
};

dia.BrokenLineArea.prototype.render = function(c){
	c.strokeStyle = 'red';
	c.lineWidth = this.thickness / 4;
	c.beginPath();

	var points = this.getPoints();
	for(var i = 0 ; i < points.length ; i++){
		c.lineTo(points[i].x, points[i].y);
	}
	c.stroke();
};

dia.BrokenLineArea.prototype.surface = function(){
	return this.getLength() * this.thickness;
};

dia.BrokenLineArea.prototype.getLength = function(){
	var points = this.getPoints(),
		length = 0;
	for(var i = 0 ; i < points.length - 1 ; i++){
		length += dia.distance(
			points[i].x, points[i].y,
			points[i + 1].x, points[i + 1].y
		);
	}
	return length;
};

dia.BrokenLineArea.prototype.getPositionAtRatio = function(ratio){
	ratio = dia.limit(ratio, 0, 1);

	var totalLength = this.getLength(),
		expectedLength = totalLength * ratio,
		points = this.getPoints(),
		length = 0,
		nextLength;

	for(var i = 0 ; i < points.length - 1 ; i++){
		nextLength = length + dia.distance(
			points[i].x, points[i].y,
			points[i + 1].x, points[i + 1].y
		);

		if(expectedLength >= length && expectedLength <= nextLength){
			break;
		}else{
			length = nextLength;
		}
	}

	var segmentLength = nextLength - length,
		distanceLeft = expectedLength - length,
		segmentRatio = distanceLeft / segmentLength;

	// i = point before
	// i + 1 = point after
	return {
		x: segmentRatio * (points[i + 1].x - points[i].x) + points[i].x,
		y: segmentRatio * (points[i + 1].y - points[i].y) + points[i].y,
		angle: Math.atan2(points[i + 1].y - points[i].y, points[i + 1].x - points[i].x)
	};
};

dia.Area.defineIntersection('line', 'brokenline', function(line, brokenLine){
	var points = brokenLine.getPoints(),
		area;
	for(var i = 0 ; i < points.length - 1 ; i++){
		area = new dia.LineArea({
			x1: function(){ return points[i].x; },
			y1: function(){ return points[i].y; },
			x2: function(){ return points[i + 1].x; },
			y2: function(){ return points[i + 1].y; },
			thickness: brokenLine.thickness
		});

		if(area.intersectsWith(line)){
			return true;
		}
	}

	return false;
});

dia.Area.defineIntersection('rectangle', 'brokenline', function(rectangle, brokenLine){
	var points = brokenLine.getPoints(),
		area;
	for(var i = 0 ; i < points.length - 1 ; i++){
		area = new dia.LineArea({
			x1: function(){ return points[i].x; },
			y1: function(){ return points[i].y; },
			x2: function(){ return points[i + 1].x; },
			y2: function(){ return points[i + 1].y; },
			thickness: brokenLine.thickness
		});

		if(area.intersectsWith(rectangle)){
			return true;
		}
	}

	return false;
});

dia.InteractionManager = function(gui){
	this.gui = gui;
	
	this.sheet = null;
	this.tool = null;
	this.currentPosition = {x: 0, y: 0, absoluteX: 0, absoluteY: 0 };
	this.downKeys = {};
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

dia.InteractionManager.prototype.mouseMove = function(x, y, absoluteX, absoluteY){
	if(this.downKeys[32]){
		var canvas = this.gui.getSheetCanvas(this.sheet);
		canvas.scroll(
			this.currentPosition.absoluteX - absoluteX,
			this.currentPosition.absoluteY - absoluteY
		);
	}else if(this.tool){
		this.tool.mouseMove(this.sheet, x, y);
	}
	this.currentPosition = {x: x, y: y, absoluteX: absoluteX, absoluteY: absoluteY};
};

dia.InteractionManager.prototype.mouseUp = function(){
	if(this.tool){
		this.tool.mouseUp(this.sheet, this.currentPosition.x, this.currentPosition.y);
	}
};

dia.InteractionManager.prototype.keyDown = function(keyCode){
	if(this.tool){
		this.tool.keyDown(this.sheet, keyCode);
	}
	this.downKeys[keyCode] = true;
};

dia.InteractionManager.prototype.keyUp = function(keyCode){
	if(this.tool){
		this.tool.keyUp(this.sheet, keyCode);
	}
	this.downKeys[keyCode] = false;
};

dia.Dialog = function(settings){
	dia.EventDispatcher.call(this);
	
	settings = settings || {};
	
	this.hideOnOk = 'hideOnOk' in settings ? settings.hideOnOk : true;
	this.hideOnCancel = 'hideOnCancel' in settings ? settings.hideOnCancel : true;
	
	this.ok = 'ok' in settings ? settings.ok : true;
	this.cancel = 'cancel' in settings ? settings.cancel : true;
	this.close = 'close' in settings ? settings.close : true;
	
	var mustacheContent = settings.content instanceof HTMLElement ? null : settings.content;
	
	var template = dia.Dialog.getTemplate();
	var html = Mustache.render(template, {
		title: settings.title || null,
		content: mustacheContent || null,
		cancelLabel: settings.cancelLabel || 'Cancel',
		okLabel: settings.okLabel || 'Ok'
	});
	
	this.root = $(html);
	
	if(!this.ok) this.root.find('.modal-footer .btn-primary').remove();
	if(!this.cancel) this.root.find('.modal-footer .btn-default').remove();
	if(!this.close) this.root.find('.close').remove();
	
	this.root.on('hidden', function () {
        $(this).remove();
    });
	
	if(settings.content instanceof HTMLElement){
		this.root.find('.modal-body').append(settings.content);
	}
	
	var dialog = this;
	this.root.find('.modal-footer .btn-primary').click(function(){
		this.dispatch('clickok');
		if(this.hideOnOk){
			this.hide();
		}
	}.bind(this));
	this.root.find('.modal-footer .btn-default').click(function(){
		this.dispatch('clickcancel');
		if(this.hideOnCancel){
			this.hide();
		}
	}.bind(this));
	this.root.find('.close').click(function(){
		this.hide('clickcancel');
		if(this.hideOnCancel){
			this.hide();
		}
	}.bind(this));
	
	this.visible = false;
};

extend(dia.Dialog, dia.EventDispatcher);

dia.Dialog.prototype.show = function(){
	if(this.visible){
		return;
	}
	
	this.root.appendTo('body');
	this.root.modal({
		show: true,
		backdrop: 'static'
	});
	this.dispatch('show');
	
	this.visible = true;
	dia.Dialog.openCount++;
};

dia.Dialog.prototype.hide = function(){
	if(!this.visible){
		return;
	}
	
	this.root.modal('hide');
	this.dispatch('hide');
	
	this.visible = false;
	dia.Dialog.openCount--;
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

dia.Dialog.openCount = 0;

dia.Dialog.alert = function(title, message){
	var dialog = new dia.Dialog({
		title: title,
		message: message,
		cancel: false
	});
	dialog.show();
};

dia.Canvas = function(sheet){
	dia.EventDispatcher.call(this);
	
	this.sheet = sheet;
	this.sheet.canvas = this;
	
	this.scrollX = 0;
	this.scrollY = 0;
	
	this.width = 0;
	this.height = 0;
};

extend(dia.Canvas, dia.EventDispatcher);

dia.Canvas.prototype.setDimensions = function(width, height){
	this.width = width;
	this.height = height;
};

dia.Canvas.prototype.scroll = function(dx, dy){
	this.scrollTo(this.scrollX + dx, this.scrollY + dy);
};

dia.Canvas.prototype.scrollTo = function(x, y){
	this.scrollX = x;
	this.scrollY = y;
	
	this.dispatch('scrollchange');
};

dia.Canvas.prototype.render = function(ctx){
	// Background color
	ctx.fillStyle = 'rgb(240, 240, 240)';
	ctx.fillRect(0,0, this.width, this.height);
	
	// Grid
	ctx.fillStyle = '#ffffff';
	for(var x = this.sheet.gridSize - (this.scrollX % this.sheet.gridSize) ; x < this.width ; x += this.sheet.gridSize){
		ctx.fillRect(x, 0, 1, this.height);
	}
	for(var y = this.sheet.gridSize - (this.scrollY % this.sheet.gridSize) ; y < this.height ; y += this.sheet.gridSize){
		ctx.fillRect(0, y, this.width, 1);
	}
	
	// Sheet
	ctx.save();
	ctx.translate(-this.scrollX, -this.scrollY);
	this.sheet.render(ctx);
	ctx.restore();
};

dia.App = function(){
	dia.EventDispatcher.call(this);

	this.toolbox = new dia.Toolbox();

	this.toolbox.addTool(new dia.SelectionTool());

	var types = dia.ElementType.types;
	for(var id in types){
		for(var k = 0 ; k < types[id].tools.length ; k++){
			this.toolbox.addTool(types[id].tools[k]);
		}
	}

	this.sheet = null;
};

extend(dia.App, dia.EventDispatcher);

dia.App.prototype.newSheet = function(){
	this.openSheet(new dia.Sheet());
};

dia.App.prototype.openSheet = function(sheet){
	this.sheet = sheet;

	this.dispatch('newsheet', {
		sheet: this.sheet
	});
};

dia.GUI = function(app){
	if(!app){
		throw new Error('Cannot instantiate GUI without an app');
	}

	this.app = app;
	this.sheet = null;

	this.sheetCanvases = {};

	this.canvas = document.getElementById('canvas');
	this.context = this.canvas.getContext('2d');

	this.setupInteractionManager();

	var selectionTool = this.app.toolbox.getTool('select');
	if(selectionTool){
		selectionTool.listen('selectionmove', this.renderSheet.bind(this));
		selectionTool.listen('selectionchange', this.renderSheet.bind(this));
		selectionTool.listen('click', this.selectionClick.bind(this));
	}

	//
	this.app.listen('newsheet', this.newAppSheet.bind(this));

	// Canvas auto-resize
	window.addEventListener('resize', this.resizeCanvas.bind(this), false);
	this.resizeCanvas();

	// UI buttons
	var saveButton = document.getElementById('button-save-sheet');
	var newButton = document.getElementById('button-new-sheet');
	var loadButton = document.getElementById('button-load-sheet');

	if(saveButton) saveButton.addEventListener('click', this.saveSheet.bind(this), false);
	if(newButton) newButton.addEventListener('click', this.newSheet.bind(this), false);
	if(loadButton) loadButton.addEventListener('click', this.loadSheet.bind(this), false);

	this.renderToolbox();
};

dia.GUI.prototype.newAppSheet = function(e){
	this.app.sheet.listen('elementadded', this.elementAdded.bind(this));
	this.app.sheet.listen('elementremoved', this.elementRemoved.bind(this));
	this.app.sheet.listen('renderableadded', this.renderSheet.bind(this));
	this.app.sheet.listen('renderableremoved', this.renderSheet.bind(this));

	// In case the sheet already contains elements, let's watch them
	for(var i = 0 ; i < this.app.sheet.elements.length ; i++){
		this.app.sheet.elements[i].listen('propertychange', this.elementModified.bind(this));
	}

	// Rendering the selection tool
	var selectionTool = this.app.toolbox.getTool('select');
	if(selectionTool){
		this.app.sheet.addRenderable(selectionTool.getRenderable());
	}

	this.interactionManager.setSheet(this.app.sheet);

	this.renderSheet();
};

dia.GUI.prototype.resizeCanvas = function(){
	var content = $('#canvas-container');

	var width = content.outerWidth();
	var height = content.outerHeight();

	this.canvas.width = width;
	this.canvas.height = height;

	if(this.app.sheet){
		var sheetCanvas = this.getSheetCanvas(this.app.sheet);
		sheetCanvas.setDimensions(width, height);
	}

	this.renderSheet();
};

dia.GUI.prototype.setupInteractionManager = function(){
	if(this.interactionManager){
		return;
	}

	this.interactionManager = new dia.InteractionManager(this);

	var selectionTool = this.app.toolbox.getTool('select');
	if(selectionTool){
		this.interactionManager.setTool(selectionTool);
	}

	var gui = this;

	this.canvas.addEventListener('mousedown', function(e){
		if(dia.Dialog.openCount === 0){
			gui.bufferSheetRender();

			e.preventDefault();

			var position = gui.getPositionOnSheet(e);
			gui.interactionManager.mouseDown(position.x, position.y);

			gui.flushSheetRender();
		}
	}, false);
	this.canvas.addEventListener('mousemove', function(e){
		if(dia.Dialog.openCount === 0){
			gui.bufferSheetRender();

			e.preventDefault();

			var position = gui.getPositionOnSheet(e);
			gui.interactionManager.mouseMove(position.x, position.y, position.absoluteX, position.absoluteY);

			var handle = gui.app.sheet.findHandleContaining(position.x, position.y);
			gui.canvas.style.cursor = handle ? handle.cursor : 'default';

			gui.flushSheetRender();
		}
	}, false);
	this.canvas.addEventListener('mouseup', function(e){
		if(dia.Dialog.openCount === 0){
			gui.bufferSheetRender();

			e.preventDefault();

			var position = gui.getPositionOnSheet(e);
			gui.interactionManager.mouseUp(position.x, position.y);

			gui.flushSheetRender();
		}
	}, false);
	document.addEventListener('keydown', function(e){
		if(dia.Dialog.openCount === 0){
			gui.bufferSheetRender();

			e.preventDefault();
			gui.interactionManager.keyDown(e.keyCode);

			gui.flushSheetRender();
		}
	}, false);
	document.addEventListener('keyup', function(e){
		if(dia.Dialog.openCount === 0){
			gui.bufferSheetRender();

			e.preventDefault();
			gui.interactionManager.keyUp(e.keyCode);

			gui.flushSheetRender();
		}
	}, false);
};

dia.GUI.prototype.getPositionOnSheet = function(event){
	var offset = this.canvas.getBoundingClientRect();

	var canvas = this.getSheetCanvas(this.app.sheet);

	return {
		x: event.pageX - offset.left + canvas.scrollX,
		y: event.pageY - offset.top + canvas.scrollY,
		absoluteX: event.pageX - offset.left,
		absoluteY: event.pageY - offset.top
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
					.text(tool.label || tool.id)
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
	if(this.bufferRender){
		this.bufferedRenders++;
	}else{
		if(this.app.sheet){
			var canvas = this.getSheetCanvas(this.app.sheet);
			canvas.render(this.context);
		}
	}
};

dia.GUI.prototype.selectionClick = function(e){
	if(e.clickCount === 2 && e.element){
		var form = new dia.ElementForm(e.element);
		var root = form.getHTMLRoot();

		var dialog = new dia.Dialog({
			title: 'Edit ' + e.element.type.label,
			content: root
		});
		dialog.show();

		dialog.listen('clickok', function(){
			form.submit();
			this.hide();
		});
		dialog.listen('clickcancel', function(){
			this.hide();
		});
	}
};

dia.GUI.prototype.elementAdded = function(e){
	e.element.listen('propertychange', this.elementModified.bind(this));
	this.renderSheet();
};

dia.GUI.prototype.elementRemoved = function(e){
	this.renderSheet();
};

dia.GUI.prototype.elementModified = function(e){
	this.renderSheet();
};

dia.GUI.prototype.getSheetCanvas = function(sheet){
	if(!this.sheetCanvases[sheet.id]){
		this.sheetCanvases[sheet.id] = new dia.Canvas(sheet);
		this.sheetCanvases[sheet.id].setDimensions(this.canvas.width, this.canvas.height);
		this.sheetCanvases[sheet.id].listen('scrollchange', this.renderSheet.bind(this));
	}
	return this.sheetCanvases[sheet.id];
};

dia.GUI.prototype.bufferSheetRender = function(){
	this.bufferRender = true;
	this.bufferedRenders = 0;
};

dia.GUI.prototype.flushSheetRender = function(){
	this.bufferRender = false;

	if(this.bufferedRenders > 0){
		this.renderSheet();
	}
	this.bufferedRenders = 0;
};

dia.GUI.prototype.loadSheet = function(){
	var input = document.createElement('textarea');
	input.className = 'form-control';
	input.rows = 10;

	var modal = new dia.Dialog({
		title: 'Load an existing sheet',
		content: input,
		hideOnOk: false,
		hideOnCancel: true
	});
	modal.show();

	var gui = this;
	modal.listen('clickok', function(){
		var json,
			sheet;
		try{
			json = JSON.parse(input.value);
			sheet = dia.Sheet.fromJSON(json);
			gui.app.openSheet(sheet);
			modal.hide();
		}catch(ex){
			dia.Dialog.alert('Error', 'Error while loading: ' + ex);
		}
	});
};

dia.GUI.prototype.saveSheet = function(){
	var input = document.createElement('textarea');
	input.className = 'form-control';
	input.rows = 10;
	input.value = JSON.stringify(this.app.sheet.toJSON());

	var modal = new dia.Dialog({
		title: 'Save the current sheet',
		content: input,
		cancel: false
	});
	modal.show();
};

dia.GUI.prototype.newSheet = function(){
	var modal = new dia.Dialog({
		title: 'New sheet',
		content: 'Create a new sheet without saving the current one?'
	});
	modal.show();

	var gui = this;
	modal.listen('clickok', function(){
		gui.app.newSheet();
	});
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

	this.element.type.functions.forEach(function(func){
		var btn = document.createElement('a');
		btn.className = 'btn btn-default';
		btn.innerHTML = func.label || func.id;
		btn.addEventListener('click', function(){
			func.apply(form.element);
		}, false);
		root.appendChild(btn);
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
	this.label = null;
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
	
	if(this.type){
		if(this.type.id){
			this.id = 'create-' + this.type.id;
		}
		if(this.type.label){
			this.label = this.type.label;
		}
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

dia.CreateTool.prototype.extend = function(options){
	var original = this;
	
	options.mouseDown = options.mouseDown || new Function();
	options.mouseMove = options.mouseMove || new Function();
	options.mouseUp = options.mouseUp || new Function();
	
	return new dia.CreateTool({
		type: options.type || this.type,
		mouseDown: function(sheet, x, y){
			original.onMouseDown.call(this, sheet, x, y);
			options.mouseDown.call(this, sheet, x, y);
		},
		mouseMove: function(sheet, x, y){
			original.onMouseMove.call(this, sheet, x, y);
			options.mouseMove.call(this, sheet, x, y);
		},
		mouseUp: function(sheet, x, y){
			original.onMouseUp.call(this, sheet, x, y);
			options.mouseUp.call(this, sheet, x, y);
		}
	});
};

dia.SelectionTool = function(){
	dia.Tool.call(this);
	
	this.selectionStart = null;
	this.selectionEnd = null;
	this.previousClick = null;
	this.currentSelection = [];
	this.clickCount = 0;
	this.id = 'select';
	this.label = 'Selection';
	this.down = false;
	this.multipleKeyDown = false;
	
	this.currentHandle = null;
	this.currentPosition = {x: 0, y: 0};
};

extend(dia.SelectionTool, dia.Tool);

dia.SelectionTool.prototype.mouseDown = function(sheet, x, y){
	this.down = true;
	
	// Before selecting anything, let's try to find a handle to drag
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
		
	if(!this.multipleKeyDown && 
	   (!this.currentHandle || this.currentSelection.indexOf(this.currentHandle.element) === -1)){
		// Clicked on an element outside of the selection or on no element, let's reset the selection
		for(var i = 0 ; i < this.currentSelection.length ; i++){
			this.currentSelection[i].highlighted = false;
		}
		this.currentSelection = [];
	}

	if(this.currentHandle){
		// Let's highlight that element
		if(this.currentSelection.indexOf(this.currentHandle.element) === -1){
			this.currentSelection.push(this.currentHandle.element);
			this.currentHandle.element.highlighted = true;
			this.dispatch('selectionchange', { selection: this.currentSelection });
		}
		
		var repr = this.currentHandle.element.getRepresentation();
		if(this.currentHandle === repr.moveHandle){
			this.currentSelection.forEach(function(element){
				var repr = element.getRepresentation();
				if(repr && repr.moveHandle){
					repr.moveHandle.dragStart(x, y);
				}
			});
			this.currentHandle = null;
		}else{
			this.currentHandle.dragStart(x, y);
		}
	}else{
		// No handle, let's do selection mode
		this.selectionStart = { x: x, y: y };
		this.selectionEnd = { x: x, y: y };
	}
	
	this.currentPosition = {x: x, y: y};
	this.mouseMoved = false;
};

dia.SelectionTool.prototype.mouseMove = function(sheet, x, y){
	var tool = this;
	if(this.down){
		if(this.selectionStart){
			this.selectionEnd = { x: x, y: y };

			this.dispatch('selectionmove');
		}else if(this.currentHandle){
			this.currentHandle.dragMove(
				x - this.currentPosition.x,
				y - this.currentPosition.y,
				x,
				y
			);
		}else{
			this.currentSelection.forEach(function(element){
				var repr = element.getRepresentation();
				if(repr && repr.moveHandle){
					repr.moveHandle.dragMove(
						x - tool.currentPosition.x,
						y - tool.currentPosition.y,
						x,
						y
					);
				}
			});
		}
	}
	
	this.currentPosition = {x: x, y: y};
	
	// Cancel click
	this.mouseMoved = true;
	this.clickCount = 0;
};

dia.SelectionTool.prototype.mouseUp = function(sheet, x, y){
	this.down = false;
	
	if(this.selectionStart){
		// If we were selection, let's apply that selection
		var tool = this;
		var area = new dia.RectangleArea({
			x: function(){ return tool.selectionStart.x; },
			y: function(){ return tool.selectionStart.y; },
			width: function(){ return tool.selectionEnd.x - tool.selectionStart.x; },
			height: function(){ return tool.selectionEnd.y - tool.selectionStart.y; }
		});
		
		for(var i = 0 ; i < this.currentSelection.length ; i++){
			this.currentSelection[i].highlighted = false;
		}

		this.currentSelection = [];

		for(var i in sheet.elements){
			if(sheet.elements[i].isContainedIn(area)){
				this.currentSelection.push(sheet.elements[i]);
				sheet.elements[i].highlighted = true;
			}
		}
	
		this.selectionStart = null;
		this.dispatch('selectionchange', { selection: this.currentSelection });
	}else if(this.currentHandle){
		this.currentHandle.dragDrop(this.currentPosition.x, this.currentPosition.y);
	}else{
		this.currentSelection.forEach(function(element){
			var repr = element.getRepresentation();
			if(repr && repr.moveHandle){
				repr.moveHandle.dragDrop(
					x,
					y
				);
			}
		});
	}
	
	if(!this.mouseMoved){
		if(!this.previousClick 
		   || x === this.previousClick.x
		   && y === this.previousClick.y
		   && Date.now() - this.previousClick.time < 500){

			this.clickCount++;
		}else{
			this.clickCount = 1;
		}
		
		this.previousClick = {
			x: x,
			y: y,
			time: Date.now()
		};
		this.dispatch('click', {
			clickCount: this.clickCount,
			element: (this.currentHandle ? this.currentHandle.element : this.currentSelection[0]) || null
		});
	}
	
	this.currentHandle = null;
	this.currentPosition = {x: x, y: y};
	this.selectionEnd = null;
};

dia.SelectionTool.prototype.keyDown = function(sheet, keyCode){
	var moveX = 0,
		moveY = 0;
	switch(keyCode){
		case 37: moveX = -1; break;
		case 38: moveY = -1; break;
		case 39: moveX = 1; break;
		case 40: moveY = 1; break;
		case 17:
		case 91:
			this.multipleKeyDown = true;
			break;
	}
	
	if(moveX || moveY){
		moveX *= 10;
		moveY *= 10;
		
		this.currentSelection.forEach(function(element){
			var repr = element.getRepresentation();
			if(repr && repr.moveHandle){
				repr.moveHandle.dragStart(0, 0);
				repr.moveHandle.dragMove(moveX, moveY);
				repr.moveHandle.dragDrop(0, 0);
			}
		});
	}
};

dia.SelectionTool.prototype.keyUp = function(sheet, keyCode){
	if(keyCode === 8){
		this.currentSelection.forEach(function(element){
			element.remove();
		});
	}else if(keyCode === 91 || keyCode === 17){
		this.multipleKeyDown = false;
	}
};

dia.SelectionTool.prototype.getRenderable = function(){
	return new dia.Renderable(function(c){
		if(this.selectionStart){
			c.strokeStyle = 'black';
			c.strokeRect(
				this.selectionStart.x + .5,
				this.selectionStart.y + .5,
				this.selectionEnd.x - this.selectionStart.x,
				this.selectionEnd.y - this.selectionStart.y
			)
		}
	}.bind(this));
};

dia.Guide = function(){
	this.type = null;
};

dia.Guide.prototype.shouldSnap = function(otherGuide, delta){
	return false;
};

dia.Guide.prototype.render = function(c, otherGuide){
	
};

dia.Guide.prototype.snap = function(guide){
	
};

dia.HorizontalGuide = function(options){
	dia.Guide.call(this);
	
	this.type = 'horizontal';
	
	this.element = options.element;
	this.getX = options.x;
	this.getY = options.y;
	this.getOffset = options.offset || function(){ return 0; };
};

extend(dia.HorizontalGuide, dia.Guide);

dia.HorizontalGuide.prototype.shouldSnap = function(guide, delta){
	delta = delta || 5;
	
	return this.type === guide.type
		&& Math.abs(this.getY() - guide.getY()) < delta;
};

dia.HorizontalGuide.prototype.render = function(c, otherGuide){
	var myX = this.getX();
	var otherX = otherGuide.getX();
	
	c.fillStyle = 'red';
	c.fillRect(myX, this.getY(), otherX - myX, 1);
};

dia.HorizontalGuide.prototype.snap = function(guide){
	this.element.setProperty('y', guide.getY() - this.getOffset());
};

dia.VerticalGuide = function(options){
	dia.Guide.call(this);
	
	this.type = 'vertical';
	
	this.element = options.element;
	this.getX = options.x;
	this.getY = options.y;
	this.getOffset = options.offset || function(){ return 0; };
};

extend(dia.VerticalGuide, dia.Guide);

dia.VerticalGuide.prototype.shouldSnap = function(guide, delta){
	delta = delta || 5;
	
	return this.type === guide.type
		&& Math.abs(this.getX() - guide.getX()) < delta;
};

dia.VerticalGuide.prototype.render = function(c, otherGuide){
	var myY = this.getY();
	var otherY = otherGuide.getY();
	
	c.fillStyle = 'red';
	c.fillRect(this.getX(), myY, 1, otherY - myY);
};

dia.VerticalGuide.prototype.snap = function(guide){
	this.element.setProperty('x', guide.getX() - this.getOffset());
};

dia.generic = dia.generic || {};

dia.generic.CIRCLE = new dia.ElementType({
	id: 'generic.circle',
	label: 'Generic circle'
});

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'x',
	type: dia.DataType.INTEGER,
	default: 0,
	private: true
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'y',
	type: dia.DataType.INTEGER,
	default: 0,
	private: true
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'radius',
	type: dia.DataType.INTEGER,
	default: 30,
	private: true
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'label',
	type: dia.DataType.STRING,
	default: ''
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'fontColor',
	type: dia.DataType.STRING,
	default: '#000'
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'fontFamily',
	type: dia.DataType.STRING,
	default: 'Arial'
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'fontSize',
	type: dia.DataType.INTEGER,
	default: 14
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'backgroundColor',
	type: dia.DataType.STRING,
	default: '#ffffff'
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'borderColor',
	type: dia.DataType.STRING,
	default: '#000'
}));

dia.generic.CIRCLE.addProperty(new dia.Property({
	id: 'borderThickness',
	type: dia.DataType.INTEGER,
	default: 1
}));

dia.generic.CIRCLE.setRepresentationFactory(function(element, repr){
	repr.addRenderable(new dia.Renderable(function(c){
		c.fillStyle = element.getProperty('backgroundColor');
		c.strokeStyle = element.getProperty('borderColor');
		c.lineWidth = element.getProperty('borderThickness');

		c.beginPath();
		c.arc(
			element.getProperty('x'),
			element.getProperty('y'),
			element.getProperty('radius'),
			0,
			2 * Math.PI,
			true
		);
		c.fill();
		c.stroke();

		c.textAlign = 'center';
		c.textBaseline = 'middle';
		c.font = element.getProperty('fontSize') + 'pt ' + element.getProperty('fontFamily');
		c.fillStyle = element.getProperty('fontColor');
		c.fillText(
			element.getProperty('label'),
			element.getProperty('x'),
			element.getProperty('y')
		);
	}));

	repr.area = new dia.CircleArea({
		x: function(){ return element.getProperty('x'); },
		y: function(){ return element.getProperty('y'); },
		radius: function(){ return element.getProperty('radius'); }
	});

	repr.guides = repr.area.getGuides(element);

	repr.moveHandle = new dia.MoveElementDragHandle(element, repr.area, 'points');
	repr.addHandle(repr.moveHandle);
});

dia.generic.CIRCLE.addTool(new dia.CreateTool({
	type: dia.generic.CIRCLE,
	mouseDown: function(sheet, x, y){
		var element = this.type.create({
			x: x,
			y: y
		});
		sheet.addElement(element);
		this.dispatch('elementcreated');
	}
}));

dia.generic = dia.generic || {};

dia.generic.RECTANGLE = new dia.ElementType({
	id: 'generic.rectangle',
	label: 'Generic rectangle'
});

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'x',
	type: dia.DataType.INTEGER,
	default: 0,
	private: true
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'y',
	type: dia.DataType.INTEGER,
	default: 0,
	private: true
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'width',
	type: dia.DataType.INTEGER,
	default: 100,
	private: true
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'height',
	type: dia.DataType.INTEGER,
	default: 100,
	private: true
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'label',
	type: dia.DataType.STRING,
	default: ''
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'fontColor',
	type: dia.DataType.STRING,
	default: '#000'
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'fontFamily',
	type: dia.DataType.STRING,
	default: 'Arial'
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'fontSize',
	type: dia.DataType.INTEGER,
	default: 14
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'backgroundColor',
	type: dia.DataType.STRING,
	default: '#ffffff'
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'borderColor',
	type: dia.DataType.STRING,
	default: '#000'
}));

dia.generic.RECTANGLE.addProperty(new dia.Property({
	id: 'borderThickness',
	type: dia.DataType.INTEGER,
	default: 1
}));

dia.generic.RECTANGLE.setRepresentationFactory(function(element, repr){
	repr.addRenderable(new dia.Renderable(function(c){
		c.fillStyle = element.getProperty('backgroundColor');
		c.fillRect(
			element.getProperty('x'),
			element.getProperty('y'),
			element.getProperty('width'),
			element.getProperty('height')
		);

		c.strokeStyle = element.getProperty('borderColor');
		c.lineWidth = element.getProperty('borderThickness');
		c.strokeRect(
			element.getProperty('x') + .5,
			element.getProperty('y') + .5,
			element.getProperty('width'),
			element.getProperty('height')
		);

		c.textAlign = 'center';
		c.textBaseline = 'middle';
		c.font = element.getProperty('fontSize') + 'pt ' + element.getProperty('fontFamily');
		c.fillStyle = element.getProperty('fontColor');
		c.fillText(
			element.getProperty('label'),
			element.getProperty('x') + element.getProperty('width') / 2,
			element.getProperty('y') + element.getProperty('height') / 2
		);
	}));

	repr.area = new dia.RectangleArea({
		x: function(){ return element.getProperty('x'); },
		y: function(){ return element.getProperty('y'); },
		width: function(){ return element.getProperty('width'); },
		height: function(){ return element.getProperty('height'); },
	});

	repr.guides = repr.area.getGuides(element);

	repr.moveHandle = new dia.MoveElementDragHandle(element, repr.area, 'points');
	repr.addHandle(repr.moveHandle);

	var resizeBottomRightArea = new dia.RectangleArea({
		x: function(){ return element.getProperty('x') + element.getProperty('width') - 5; },
		y: function(){ return element.getProperty('y') + element.getProperty('height') - 5; },
		width: function(){ return 10; },
		height: function(){ return 10; },
	});
	var resizeBottomRightHandle = new dia.DragHandle(element, resizeBottomRightArea);
	repr.addHandle(resizeBottomRightHandle);
	resizeBottomRightHandle.dragMove = function(dx, dy){
		element.setProperty('width', Math.max(100, element.getProperty('width') + dx));
		element.setProperty('height', Math.max(100, element.getProperty('height') + dy));
	};
});

dia.generic.RECTANGLE.addTool(new dia.CreateTool({
	type: dia.generic.RECTANGLE,
	mouseDown: function(sheet, x, y){
		var element = this.type.create({
			x: dia.snap(x - 50, sheet.gridSize),
			y: dia.snap(y - 50, sheet.gridSize),
			width: 100,
			height: 100
		});
		sheet.addElement(element);
		this.dispatch('elementcreated');
	}
}));

dia.generic = dia.generic || {};

dia.generic.RELATION = new dia.ElementType({
	id: 'generic.relation',
	label: 'Generic relation',
	anchorable: false
});
dia.generic.RELATION.addProperty(new dia.Property({
	id: 'from',
	type: dia.DataType.ANCHOR,
	private: true
}));
dia.generic.RELATION.addProperty(new dia.Property({
	id: 'to',
	type: dia.DataType.ANCHOR,
	private: true
}));
dia.generic.RELATION.addProperty(new dia.Property({
	id: 'points',
	type: dia.DataType.POINT_ARRAY,
	private: true,
	default: []
}));

dia.generic.RELATION.setRepresentationFactory(function(element, repr){
	repr.fromPosition = function(){
		var from = element.getProperty('from');
		var fromRepr = element.sheet.getElement(from.element).getRepresentation();

		var position = fromRepr.area.getAbsolutePositionFromRelative(from.x, from.y);
		position.angle = from.angle;

		return position;
	};

	repr.toPosition = function(){
		var to = element.getProperty('to');
		var toRepr = element.sheet.getElement(to.element).getRepresentation();

		var position = toRepr.area.getAbsolutePositionFromRelative(to.x, to.y);
		position.angle = to.angle;

		return position;
	};

	repr.areaFrom = new dia.RectangleArea({
		x: function(){ return repr.fromPosition().x - 5 },
		y: function(){ return repr.fromPosition().y - 5 },
		width: function(){ return 10; },
		height: function(){ return 10; }
	});

	repr.areaTo = new dia.RectangleArea({
		x: function(){ return repr.toPosition().x - 5 },
		y: function(){ return repr.toPosition().y - 5 },
		width: function(){ return 10; },
		height: function(){ return 10; }
	});

	repr.getPoints = function(){
		var from = repr.fromPosition();
		var to = repr.toPosition();

		var fromExtension = {
			x: from.x + Math.cos(from.angle) * repr.extension,
			y: from.y + Math.sin(from.angle) * repr.extension
		};
		var toExtension = {
			x: to.x + Math.cos(to.angle) * repr.extension,
			y: to.y + Math.sin(to.angle) * repr.extension
		};

		if(repr.extension > 0){
			return [from, fromExtension].concat(element.getProperty('points')).concat([toExtension, to]);
		}else{
			return [from].concat(element.getProperty('points')).concat([to]);
		}
	};

	repr.addRenderable(new dia.Renderable(function(c){
		var fromPos = repr.fromPosition();
		var toPos = repr.toPosition();

		c.strokeStyle = '#000';
		c.fillStyle = '#000';

		var points = repr.getPoints();

		c.setLineDash(repr.getLineDash());

		c.beginPath();
		c.moveTo(points[0].x, points[0].y);
		for(var i = 1 ; i < points.length ; i++){
			c.lineTo(points[i].x, points[i].y);
		}
		c.stroke();

		for(var i = 1 ; i < points.length - 1 ; i++){
			c.fillRect(points[i].x - 2, points[i].y - 2, 4, 4);
		}
	}));

	repr.extension = 10;

	repr.area = new dia.BrokenLineArea({
		points: function(){
			// No direct call, in case a subclass needs to override getPoints()
			return repr.getPoints();
		}
	});

	repr.mainHandle = new dia.BrokenLineDragHandle(element, repr.area, 'points');
	repr.mainHandle.breakOffset = -1;
	repr.addHandle(repr.mainHandle);

	repr.fromHandle = new dia.MoveAnchorDragHandle(element, repr.areaFrom, 'from');
	repr.addHandle(repr.fromHandle);

	repr.toHandle = new dia.MoveAnchorDragHandle(element, repr.areaTo, 'to');
	repr.addHandle(repr.toHandle);

	repr.moveHandle = new dia.MoveRelationDragHandle(element, repr.area, 'points');

	repr.getLineDash = function(){
		return [];
	};
});

dia.generic.RELATION.addTool(new dia.CreateTool({
	type: dia.generic.RELATION,
	mouseDown: function(sheet, x, y){
		this.from = sheet.findElementContaining(x, y, function(element){
			return element.type.isAnchorable();
		});

		if(this.from){
			var fromArea = this.from.getRepresentation().area;
			var fromRelativePosition = fromArea.getRelativePositionFromAbsolute(x, y);

			this.fromAnchor = {
				element: this.from.id,
				x: fromRelativePosition.x,
				y: fromRelativePosition.y
			};
			this.toAnchor = {
				element: this.from.id,
				x: fromRelativePosition.x,
				y: fromRelativePosition.y
			};

			fromArea.bindAnchorToBounds(this.fromAnchor);
			fromArea.bindAnchorToBounds(this.toAnchor);

			this.element = this.type.create({
				from: this.fromAnchor,
				to: this.toAnchor
			});
			sheet.addElement(this.element);
		}
	},
	mouseMove: function(sheet, x, y){
		if(!this.from) return;

		this.to = sheet.findElementContaining(x, y, function(element){
			return element.type.isAnchorable();
		});

		if(this.to){
			var toArea = this.to.getRepresentation().area;
			var toRelativePosition = toArea.getRelativePositionFromAbsolute(x, y);

			this.toAnchor = {
				element: this.to.id,
				x: toRelativePosition.x,
				y: toRelativePosition.y,
				angle: 0
			};
			toArea.bindAnchorToBounds(this.toAnchor);
		}else{
			var fromArea = this.from.getRepresentation().area;
			var fromRelativePosition = fromArea.getRelativePositionFromAbsolute(x, y);

			this.toAnchor = {
				element: this.from.id,
				x: fromRelativePosition.x,
				y: fromRelativePosition.y,
				angle: this.toAnchor.angle
			};
		}

		this.element.setProperty('to', this.toAnchor);
	},
	mouseUp: function(sheet, x, y){
		if(this.element && this.from === this.to){
			this.element.remove();
		}

		this.element = null;
		this.from = null;
		this.to = null;
		this.dispatch('elementcreated');
	}
}));

dia.generic.RELATION.addFunction(new dia.ElementTypeFunction({
	id: 'invert',
	label: 'Invert relation',
	apply: function(element){
		var fromProp = element.getProperty('from');
		var toProp = element.getProperty('to');

		element.setProperty('from', toProp);
		element.setProperty('to', fromProp);
		element.setProperty('points', element.getProperty('points').slice(0).reverse())
	}
}));

dia.generic.RELATION.addFunction(new dia.ElementTypeFunction({
	id: 'removepoints',
	label: 'Remove all points',
	apply: function(element){
		element.setProperty('points', []);
	}
}));

dia.generic.RELATION.addFunction(new dia.ElementTypeFunction({
	id: 'reanchor',
	label: 'Readapt anchors',
	apply: function(element){
		var anchorFrom = element.getProperty('from');
		var anchorTo = element.getProperty('to');

		var fromElementId = element.getProperty('from').element;
		var toElementId = element.getProperty('to').element;

		var fromElement = element.sheet.getElement(fromElementId);
		var toElement = element.sheet.getElement(toElementId);

		var fromElementRepr = fromElement.getRepresentation();
		var toElementRepr = toElement.getRepresentation();

		var newAnchorFrom = {
			element: anchorFrom.element,
			x: anchorFrom.x,
			y: anchorFrom.y,
			angle: anchorFrom.angle
		};
		var newAnchorTo = {
			element: anchorTo.element,
			x: anchorTo.x,
			y: anchorTo.y,
			angle: anchorTo.angle
		};

		fromElementRepr.area.bindAnchorToBounds(newAnchorFrom);
		toElementRepr.area.bindAnchorToBounds(newAnchorTo);

		element.setProperty('from', newAnchorFrom);
		element.setProperty('to', newAnchorTo);
	}
}));

dia.generic.RELATION.addSetupFunction(function(element){
	var onDependencyRemoved = function(e){
		element.remove();
		ignore();
	}.bind(element);

	var onAnchoredElementChange = function(){
		element.execute('reanchor');
	}.bind(element);

	var currentFrom = null,
		currentTo = null;

	var listen = function(){
		var newFrom = findElement('from');
		var newTo = findElement('to');

		if(newFrom !== currentFrom || newTo !== currentTo){
			ignore();

			if(newFrom){
				newFrom.listen('removedfromsheet', onDependencyRemoved);
				newFrom.listen('propertychange', onAnchoredElementChange);
			}
			if(newTo){
				newTo.listen('removedfromsheet', onDependencyRemoved);
				newTo.listen('propertychange', onAnchoredElementChange);
			}

			currentFrom = newFrom;
			currentTo = newTo;
		}
	};

	var findElement = function(property){
		var anchor = element.getProperty(property);
		if(anchor && anchor.element && element.sheet){
			return element.sheet.getElement(anchor.element);
		}
	};

	var ignore = function(){
		if(currentFrom){
			currentFrom.ignore('removedfromsheet', onDependencyRemoved);
			currentFrom.ignore('propertychange', onAnchoredElementChange);
		}
		if(currentTo){
			currentTo.ignore('removedfromsheet', onDependencyRemoved);
			currentTo.ignore('propertychange', onAnchoredElementChange);
		}

		currentFrom = null;
		currentTo = null;
	};

	element.listen('propertychange', function(e){
		if(e.property.id === 'to' || e.property.id === 'from'){
			listen();
		}
	});

	element.listen('addedtosheet', listen);
	element.listen('removedfromsheet', ignore);
});

dia.uml = dia.uml || {};

dia.uml.TYPED_ATTRIBUTE = new dia.DataType({
	label: 'attribute',
	validate: function(value){
		return typeof value.name === 'string'
			&& (value.type === null || typeof value.type === 'string');
	},
	toHTML: function(value){
		var input = dia.DataType.STRING.createHTMLInput(this.toString(value));
		return input;
	},
	fromHTML: function(html){
		var strValue = dia.DataType.STRING.getValueFromHTMLInput(html);
		var split = strValue.split(':');

		var before = split[0].trim();
		var after = split[1] ? split[1].trim() : null;

		return {
			name: before,
			type: after
		};
	},
	toString: function(value){
		var s = '';
		if(value){
			s = value.name;
			if(value.type){
				s += ' : ' + value.type;
			}
		}
		return s;
	}
});

dia.uml.TYPED_METHOD = new dia.DataType({
	label: 'method',
	validate: function(value){
		return typeof value.name === 'string'
			&& (value.type === null || typeof value.type === 'string')
			&& 'length' in value.parameters;

		// TODO validate parameters
	},
	toHTML: function(value){
		var input = dia.DataType.STRING.createHTMLInput(this.toString(value));
		return input;
	},
	fromHTML: function(html){
		var strValue = dia.DataType.STRING.getValueFromHTMLInput(html);

		var name = strValue.replace(/^([ a-z0-9_]+)\(.*\).*$/, "$1");
		var type = strValue.replace(/^.*:?([^:]*)$/, "$1");

		var lastSplitIndex = strValue.lastIndexOf(':');
		if(lastSplitIndex === -1){
			lastSplitIndex = strValue.length;
		}

		var before = strValue.substring(0, lastSplitIndex).trim();
		var type = strValue.substring(lastSplitIndex + 1).trim();

		// Catching the name
		var name = before.replace(/^(.*)\(.*$/, "$1");

		var paramsStr = before.replace(/^.*\((.*)\).*$/, "$1");

		var paramsSplit = paramsStr.split(','),
			params = [];
		for(var i = 0 ; i < paramsSplit.length ; i++){
			split = paramsSplit[i].split(':');

			before = split[0].trim();
			after = split[1] ? split[1].trim() : null;

			params.push({
				name: before,
				type: after
			})
		}

		return {
			name: name.trim(),
			type: type,
			parameters: params
		};
	},
	toString: function(value){
		if(!value){
			return '';
		}

		var attrs = [],
			attr;
		for(var i = 0 ; i < value.parameters.length ; i++){
			if(value.parameters[i]){
				attr = value.parameters[i].name;
				if(value.parameters[i].type){
					attr += ' : ' + value.parameters[i].type;
				}
				attrs.push(attr);
			}
		}

		var s = value.name + '(' + attrs.join(', ') + ')';
		if(value.type){
			s += ' : ' + value.type;
		}

		return s;
	}
});

dia.uml.TYPED_ATTRIBUTE_ARRAY = new dia.ArrayDataType(dia.uml.TYPED_ATTRIBUTE);
dia.uml.TYPED_METHOD_ARRAY = new dia.ArrayDataType(dia.uml.TYPED_METHOD);

dia.uml = dia.uml || {};

dia.uml.CLASS = new dia.ElementType({
	id: 'uml.class',
	label: 'Class',
	layer: 2
});
dia.uml.CLASS.addProperty(new dia.Property({
	id: 'x',
	type: dia.DataType.INTEGER,
	default: 50,
	private: true
}));
dia.uml.CLASS.addProperty(new dia.Property({
	id: 'y',
	type: dia.DataType.INTEGER,
	default: 100,
	private: true
}));
dia.uml.CLASS.addProperty(new dia.Property({
	id: 'title',
	type: dia.DataType.STRING,
	default: 'class',
	label: 'Class title'
}));
dia.uml.CLASS.addProperty(new dia.Property({
	id: 'attributes',
	type: dia.uml.TYPED_ATTRIBUTE_ARRAY,
	default: [],
	label: 'Instance attributes'
}));
dia.uml.CLASS.addProperty(new dia.Property({
	id: 'methods',
	type: dia.uml.TYPED_METHOD_ARRAY,
	default: [],
	label: 'Instance methods'
}));
dia.uml.CLASS.setRepresentationFactory(function(element, representation){
	var lineHeight = 20;
	var padding = 10;

	var font = '10pt Courier';

	representation.cachedRequiredWidth = null;
	representation.cachedRequiredHeight = null;

	var getRequiredWidth = function(){
		if(representation.cachedRequiredWidth === null){
			representation.cachedRequiredWidth = dia.measureFontWidth(font, element.getProperty('title'));
			element.getProperty('attributes').forEach(function(attr){
				var s = dia.uml.TYPED_ATTRIBUTE.toString(attr);
				representation.cachedRequiredWidth = Math.max(representation.cachedRequiredWidth, dia.measureFontWidth(font, s));
			});
			element.getProperty('methods').forEach(function(method){
				var s = dia.uml.TYPED_METHOD.toString(method);
				representation.cachedRequiredWidth = Math.max(representation.cachedRequiredWidth, dia.measureFontWidth(font, s));
			});
			representation.cachedRequiredWidth = ~~(representation.cachedRequiredWidth + 2 * padding);
		}
		return representation.cachedRequiredWidth;
	};

	var getRequiredHeight = function(){
		if(representation.cachedRequiredHeight === null){
			representation.cachedRequiredHeight = lineHeight * (1 + Math.max(1, element.getProperty('methods').length)
							 					+ Math.max(1, element.getProperty('attributes').length));
		}
		return representation.cachedRequiredHeight;
	};

	representation.addRenderable(new dia.Renderable(function(c){
		c.translate(element.getProperty('x'), element.getProperty('y'));

		var width = getRequiredWidth();
		var height = getRequiredHeight();

		c.fillStyle = '#ffffff';
		c.fillRect(0, 0, width, height);

		c.fillStyle = '#000';

		c.fillRect(0, 0, width, 1);
		c.fillRect(0, height - 1, width, 1);
		c.fillRect(0, lineHeight, width, 1);
		c.fillRect(0, lineHeight * (Math.max(1, element.getProperty('attributes').length) + 1), width, 1);

		c.fillRect(0, 0, 1, height);
		c.fillRect(width - 1, 0, 1, height);

		c.textBaseline = 'middle';
		c.font = font;

		c.textAlign = 'center';
		c.fillText(element.getProperty('title'), width / 2, lineHeight / 2);

		c.textAlign = 'left';

		var y = 1.5 * lineHeight,
			attrs = element.getProperty('attributes'),
			methods = element.getProperty('methods'),
			s;
		for(var i = 0 ; i < attrs.length ; i++){
			s = dia.uml.TYPED_ATTRIBUTE.toString(attrs[i]);
			c.fillText(s, padding, y);

			y += lineHeight;
		}
		if(attrs.length === 0){
			y += lineHeight;
		}
		for(var i = 0 ; i < methods.length ; i++){
			s = dia.uml.TYPED_METHOD.toString(methods[i]);
			c.fillText(s, padding, y);

			y += lineHeight;
		}
	}));

	var area = new dia.RectangleArea({
		x: function(){ return element.getProperty('x'); },
		y: function(){ return element.getProperty('y'); },
		width: getRequiredWidth,
		height: getRequiredHeight
	});

	representation.moveHandle = new dia.MoveElementDragHandle(element, area);
	representation.addHandle(representation.moveHandle);

	representation.area = area;
});

dia.uml.CLASS.addTool(new dia.CreateTool({
	type: dia.uml.CLASS,
	mouseDown: function(sheet, x, y){
		var element = this.type.emptyElement();
		element.setProperty('x', x);
		element.setProperty('y', y);
		sheet.addElement(element);

		this.dispatch('elementcreated');
	}
}));

dia.uml.CLASS.addSetupFunction(function(element){
	element.listen('propertychange', function(e){
		if(e.property.id === 'attributes' || e.property.id === 'methods' || e.property.id === 'title'){
			var repr = element.getRepresentation();
			repr.cachedRequiredWidth = null;
			repr.cachedRequiredHeight = null;
		}
	});
});

dia.uml = dia.uml || {};

dia.uml.INTERFACE = new dia.ElementType({
	id: 'uml.interface',
	label: 'Interface',
	layer: 2
});
dia.uml.INTERFACE.addProperty(new dia.Property({
	id: 'x',
	type: dia.DataType.INTEGER,
	default: 50,
	private: true
}));
dia.uml.INTERFACE.addProperty(new dia.Property({
	id: 'y',
	type: dia.DataType.INTEGER,
	default: 100,
	private: true
}));
dia.uml.INTERFACE.addProperty(new dia.Property({
	id: 'title',
	type: dia.DataType.STRING,
	default: 'interface',
	label: 'Interface title'
}));
dia.uml.INTERFACE.addProperty(new dia.Property({
	id: 'methods',
	type: dia.uml.TYPED_METHOD_ARRAY,
	default: [],
	label: 'Instance methods'
}));
dia.uml.INTERFACE.setRepresentationFactory(function(element, representation){
	var lineHeight = 20;
	var padding = 10;

	var font = '10pt Courier';
	var label = '<<interface>>';

	representation.cachedRequiredWidth = null;
	representation.cachedRequiredHeight = null;

	var getRequiredWidth = function(){
		if(representation.cachedRequiredWidth === null){
			representation.cachedRequiredWidth = dia.measureFontWidth(font, element.getProperty('title'));
			element.getProperty('methods').forEach(function(method){
				var s = dia.uml.TYPED_METHOD.toString(method);
				representation.cachedRequiredWidth = Math.max(representation.cachedRequiredWidth, dia.measureFontWidth(font, s));
			});
			representation.cachedRequiredWidth = Math.max(representation.cachedRequiredWidth, dia.measureFontWidth(font, label));
			representation.cachedRequiredWidth = ~~(representation.cachedRequiredWidth + 2 * padding);
		}
		return representation.cachedRequiredWidth;
	};

	var getRequiredHeight = function(){
		if(representation.cachedRequiredHeight === null){
			representation.cachedRequiredHeight = lineHeight
												* (2 + Math.max(1, element.getProperty('methods').length));
		}
		return representation.cachedRequiredHeight;
	};

	representation.addRenderable(new dia.Renderable(function(c){
		c.translate(element.getProperty('x'), element.getProperty('y'));

		var width = getRequiredWidth();
		var height = getRequiredHeight();

		c.fillStyle = '#ffffff';
		c.fillRect(0, 0, width, height);

		c.fillStyle = '#000';

		c.fillRect(0, 0, width, 1);
		c.fillRect(0, height - 1, width, 1);
		c.fillRect(0, lineHeight * 2, width, 1);

		c.fillRect(0, 0, 1, height);
		c.fillRect(width - 1, 0, 1, height);

		c.textBaseline = 'middle';
		c.font = font;

		c.textAlign = 'center';
		c.fillText(label, width / 2, lineHeight * 0.5);
		c.fillText(element.getProperty('title'), width / 2, lineHeight * 1.5);

		c.textAlign = 'left';

		var y = 2.5 * lineHeight,
			methods = element.getProperty('methods'),
			s;
		for(var i = 0 ; i < methods.length ; i++){
			s = dia.uml.TYPED_METHOD.toString(methods[i]);
			c.fillText(s, padding, y);

			y += lineHeight;
		}
	}));

	var area = new dia.RectangleArea({
		x: function(){ return element.getProperty('x'); },
		y: function(){ return element.getProperty('y'); },
		width: getRequiredWidth,
		height: getRequiredHeight
	});

	representation.moveHandle = new dia.MoveElementDragHandle(element, area);
	representation.addHandle(representation.moveHandle);

	representation.area = area;
});

dia.uml.INTERFACE.addTool(new dia.CreateTool({
	type: dia.uml.INTERFACE,
	mouseDown: function(sheet, x, y){
		var element = this.type.emptyElement();
		element.setProperty('x', x);
		element.setProperty('y', y);
		sheet.addElement(element);

		this.dispatch('elementcreated');
	}
}));

dia.uml.INTERFACE.addSetupFunction(function(element){
	element.listen('propertychange', function(e){
		if(e.property.id === 'methods' || e.property.id === 'title'){
			var repr = element.getRepresentation();
			repr.cachedRequiredWidth = null;
			repr.cachedRequiredHeight = null;
		}
	});
});

dia.uml = dia.uml || {};

dia.uml.RELATION = dia.generic.RELATION.clone({
	id: 'uml.composition',
	label: 'UML relation',
	layer: 0
});

dia.uml.RELATION.addProperty(new dia.Property({
	id: 'type',
	label: 'Relation type',
	type: new dia.EnumerationDataType([
		'relation',
		'composition',
		'aggregation',
		'implementation',
		'inheritance'
	]),
	default: 'relation'
}));

dia.uml.RELATION.addProperty(new dia.Property({
	id: 'cardinalityFrom',
	label: 'Cardinality from',
	type: dia.DataType.STRING,
	default: ''
}));

dia.uml.RELATION.addProperty(new dia.Property({
	id: 'cardinalityTo',
	label: 'Cardinality to',
	type: dia.DataType.STRING,
	default: ''
}));

dia.uml.RELATION.addProperty(new dia.Property({
	id: 'label',
	label: 'Relation label',
	type: dia.DataType.STRING,
	default: ''
}));

dia.uml.RELATION.extendRepresentationFactory(function(element, repr){
	repr.getPoints = function(){
		return [repr.fromPosition()].concat(element.getProperty('points')).concat([repr.toPosition()]);
	};

	repr.mainHandle.breakOffset = 0;

	repr.addRenderable(new dia.Renderable(function(c){
		var points = repr.getPoints();

		var p1 = points[points.length - 1];
		var p2 = points[points.length - 2];
		var p3 = points[1];
		var p4 = points[0];

		var angleTo = Math.atan2(p2.y - p1.y, p2.x - p1.x);
		var angleFrom = Math.atan2(p4.y - p3.y, p4.x - p3.x);

		c.save();
		c.translate(p1.x, p1.y);
		c.rotate(angleTo);

		switch(element.getProperty('type')){
			case 'composition':
				c.fillStyle = '#000';
				c.beginPath();
				c.moveTo(0, 0);
				c.lineTo(10, 5);
				c.lineTo(20, 0);
				c.lineTo(10, -5);
				c.fill();
			break;
			case 'aggregation':
				c.fillStyle = '#ffffff';
				c.strokeStyle = '#000';
				c.lineWidth = 1;
				c.beginPath();
				c.moveTo(0, 0);
				c.lineTo(10, 5);
				c.lineTo(20, 0);
				c.lineTo(10, -5);
				c.closePath();
				c.fill();
				c.stroke();
			break;
			case 'inheritance':
			case 'implementation':
				c.fillStyle = '#ffffff';
				c.strokeStyle = '#000';
				c.lineWidth = 1;
				c.beginPath();
				c.moveTo(0, 0);
				c.lineTo(10, 5);
				c.lineTo(10, -5);
				c.closePath();
				c.fill();
				c.stroke();
			break;
		}

		c.restore();

		var fromLabelAngle = angleFrom + Math.PI / 2;
		var fromLabelPosition = {
			x: p4.x - Math.cos(angleFrom) * 10 + Math.cos(fromLabelAngle) * 10,
			y: p4.y - Math.sin(angleFrom) * 10 +  Math.sin(fromLabelAngle) * 10
		};

		c.fillStyle = '#000';
		c.font = '10pt Arial';
		c.textAlign = 'center';
		c.textBaseline = 'middle';
		c.fillText(element.getProperty('cardinalityFrom'), fromLabelPosition.x, fromLabelPosition.y);

		var toLabelAngle = angleTo + Math.PI / 2;
		var toLabelPosition = {
			x: p1.x + Math.cos(angleTo) * 10 + Math.cos(toLabelAngle) * 10,
			y: p1.y + Math.sin(angleTo) * 10 +  Math.sin(toLabelAngle) * 10
		};

		c.fillStyle = '#000';
		c.font = '10pt Arial';
		c.textAlign = 'center';
		c.textBaseline = 'middle';
		c.fillText(element.getProperty('cardinalityTo'), toLabelPosition.x, toLabelPosition.y);

		var middlePosition = repr.area.getPositionAtRatio(.5);
		var labelPosition = {
			x: middlePosition.x + Math.cos(middlePosition.angle + Math.PI / 2) * 10,
			y: middlePosition.y + Math.sin(middlePosition.angle + Math.PI / 2) * 10
		}
		c.fillText(element.getProperty('label'), labelPosition.x, labelPosition.y);
	}));

	repr.getLineDash = function(){
		if(element.getProperty('type') === 'implementation'){
			return [10, 10];
		}else{
			return [];
		}
	};
});
