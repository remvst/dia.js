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
