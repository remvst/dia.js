dia.BrokenLineArea = function(options){
	dia.Area.call(this);

	this.getPoints = options.points;
	this.thickness = options.thickness || 10;
	this.type = 'brokenline'
};

extend(dia.BrokenLineArea, dia.Area);

dia.BrokenLineArea.prototype.contains = function(x, y){
	return this.indexOfLineThatContains(x, y) !== -1;
};

dia.BrokenLineArea.prototype.indexOfLineThatContains = function(x, y){
	var points = this.getPoints(),
		area,
		minDistance,
		dist,
		closest = -1;
	for(var i = 0 ; i < points.length - 1 ; i++){
		area = new dia.LineArea({
			x1: function(){ return points[i].x; },
			y1: function(){ return points[i].y; },
			x2: function(){ return points[i + 1].x; },
			y2: function(){ return points[i + 1].y; },
			thickness: this.thickness
		});

		if(area.contains(x, y)){
			dist = area.distance(x, y);
			if(closest === -1 || dist < minDistance){
				closest = i;
				minDistance = dist;
			}
		}
	}

	return closest;
};

dia.BrokenLineArea.prototype.render = function(c){
	c.strokeStyle = 'red';
	c.lineWidth = this.thickness / 4;
	c.beginPath();

	var points = this.getPoints();
	for(var i = 0 ; i < points.length ; i++){
		c.lineTo(points[i].x, points[i].y);
	}
	c.stroke();
};

dia.BrokenLineArea.prototype.surface = function(){
	return this.getLength() * this.thickness;
};

dia.BrokenLineArea.prototype.getLength = function(){
	var points = this.getPoints(),
		length = 0;
	for(var i = 0 ; i < points.length - 1 ; i++){
		length += dia.distance(
			points[i].x, points[i].y,
			points[i + 1].x, points[i + 1].y
		);
	}
	return length;
};

dia.BrokenLineArea.prototype.getPositionAtRatio = function(ratio){
	ratio = dia.limit(ratio, 0, 1);

	var totalLength = this.getLength(),
		expectedLength = totalLength * ratio,
		points = this.getPoints(),
		length = 0,
		nextLength;

	for(var i = 0 ; i < points.length - 1 ; i++){
		nextLength = length + dia.distance(
			points[i].x, points[i].y,
			points[i + 1].x, points[i + 1].y
		);

		if(expectedLength >= length && expectedLength <= nextLength){
			break;
		}else{
			length = nextLength;
		}
	}

	var segmentLength = nextLength - length,
		distanceLeft = expectedLength - length,
		segmentRatio = distanceLeft / segmentLength;

	// i = point before
	// i + 1 = point after
	return {
		x: segmentRatio * (points[i + 1].x - points[i].x) + points[i].x,
		y: segmentRatio * (points[i + 1].y - points[i].y) + points[i].y,
		angle: Math.atan2(points[i + 1].y - points[i].y, points[i + 1].x - points[i].x)
	};
};

dia.Area.defineIntersection('line', 'brokenline', function(line, brokenLine){
	var points = brokenLine.getPoints(),
		area;
	for(var i = 0 ; i < points.length - 1 ; i++){
		area = new dia.LineArea({
			x1: function(){ return points[i].x; },
			y1: function(){ return points[i].y; },
			x2: function(){ return points[i + 1].x; },
			y2: function(){ return points[i + 1].y; },
			thickness: brokenLine.thickness
		});

		if(area.intersectsWith(line)){
			return true;
		}
	}

	return false;
});

dia.Area.defineIntersection('rectangle', 'brokenline', function(rectangle, brokenLine){
	var points = brokenLine.getPoints(),
		area;
	for(var i = 0 ; i < points.length - 1 ; i++){
		area = new dia.LineArea({
			x1: function(){ return points[i].x; },
			y1: function(){ return points[i].y; },
			x2: function(){ return points[i + 1].x; },
			y2: function(){ return points[i + 1].y; },
			thickness: brokenLine.thickness
		});

		if(area.intersectsWith(rectangle)){
			return true;
		}
	}

	return false;
});
