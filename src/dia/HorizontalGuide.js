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
