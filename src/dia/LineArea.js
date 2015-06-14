dia.LineArea = function(options){
	dia.Area.call(this);
	
	options = options || {};
	this.getX1 = options.x1;
	this.getY1 = options.y1;
	this.getX2 = options.x2;
	this.getY2 = options.y2;
	this.thickness = options.thickness || 10;
};

extend(dia.LineArea, dia.Area);

dia.LineArea.prototype.contains = function(x, y){
	if(this.distance(x, y) > this.thickness){
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

dia.LineArea.prototype.intersectsWith = function(otherArea){
	// TODO
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
	c.lineWidth = this.thickness;
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
