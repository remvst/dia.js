dia.VerticalGuide = function(options){
	dia.Guide.call(this);
	
	this.type = 'vertical';
	
	this.element = options.element;
	this.getX = options.x;
	this.getOffset = options.offset || function(){ return 0; };
};

extend(dia.VerticalGuide, dia.Guide);

dia.VerticalGuide.prototype.shouldSnap = function(guide, delta){
	delta = delta || 5;
	
	return this.type === guide.type
		&& Math.abs(this.getX() - guide.getX()) < delta;
};

dia.VerticalGuide.prototype.render = function(c){
	
};

dia.VerticalGuide.prototype.snap = function(guide){
	this.element.setProperty('x', guide.getX() - this.getOffset());
};
