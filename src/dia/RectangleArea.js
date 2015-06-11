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
	var areaX = this.getX();
	var areaY = this.getY();
	var areaWidth = this.getWidth();
	var areaHeight = this.getHeight();
	
	return x >= areaX && y >= areaY && x <= areaX + areaWidth && y <= areaY + areaHeight;
};
