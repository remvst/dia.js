dia.ElementTypeFunction = function(options){
	this.id = options.id || null;
	this.label = options.label || null;
	this.applyFunction = options.apply;
};

dia.ElementTypeFunction.prototype.apply = function(element){
	this.applyFunction.call(this, element);
};
