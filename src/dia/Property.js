dia.Property = function(options){
	options = options || {};
	
	this.label = options.label || null;
	this.type = options.type || dia.DataType.ANY;
	this.description = options.description || null;
	this.default = 'default' in options ? options.default : null;
	this.id = options.id || null;
	this.private = options.private || false;
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
