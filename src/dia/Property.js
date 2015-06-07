dia.Property = function(options){
	options = options || {};
	
	this.label = options.label || null;
	this.type = options.type || null;
	this.description = options.description || null;
	this.default = 'default' in options ? options.default : null;
	this.id = options.id || null;
};
