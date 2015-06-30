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
