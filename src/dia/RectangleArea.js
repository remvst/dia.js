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
