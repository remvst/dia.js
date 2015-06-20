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
			y: function(){ return area.getY(); },
			offset: function(){ return 0; }
		}),
		new dia.HorizontalGuide({
			element: element,
			y: function(){ return area.getY() + area.getHeight(); },
			offset: function(){ return area.getHeight(); }
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
