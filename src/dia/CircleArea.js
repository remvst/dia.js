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
	// TODO check formula
	return Math.PI * Math.pow(this.getRadius(), 2);
};

dia.CircleArea.prototype.bindAnchorToBounds = function(anchor){
	var angle = Math.atan2(anchor.y, anchor.x);
	anchor.x = Math.cos(angle) * this.getRadius();
	anchor.y = Math.sin(angle) * this.getRadius();
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
