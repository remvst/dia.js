dia.BrokenLineArea = function(options){
	dia.Area.call(this);
	
	this.getPoints = options.points;
	this.thickness = options.thickness;
	this.type = 'brokenline'
};

extend(dia.BrokenLineArea, dia.Area);

dia.BrokenLineArea.prototype.contains = function(x, y){
	return this.indexOfLineThatContains(x, y) !== -1;
};

dia.BrokenLineArea.prototype.indexOfLineThatContains = function(x, y){
	var points = this.getPoints(),
		area;
	for(var i = 0 ; i < points.length - 1 ; i++){
		area = new dia.LineArea({
			x1: function(){ return points[i].x; },
			y1: function(){ return points[i].y; },
			x2: function(){ return points[i + 1].x; },
			y2: function(){ return points[i + 1].y; },
			thickness: this.thickness
		});
		
		if(area.contains(x, y)){
			return i;
		}
	}
	
	return -1;
};
