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

	// Let's set the outgoing angle
	if(anchor.x === 0){
		anchor.angle = Math.PI;
	}else if(anchor.x === width){
		anchor.angle = 0;
	}else if(anchor.y === 0){
		anchor.angle = -Math.PI / 2;
	}else{
		anchor.angle = Math.PI / 2;
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
			x: function(){ return area.getX() + area.getWidth() / 2; },
			y: function(){ return area.getY(); },
			offset: function(){ return 0; }
		}),
		new dia.HorizontalGuide({
			element: element,
			x: function(){ return area.getX() + area.getWidth() / 2; },
			y: function(){ return area.getY() + area.getHeight(); },
			offset: function(){ return area.getHeight(); }
		}),
		new dia.VerticalGuide({
			element: element,
			x: function(){ return area.getX(); },
			y: function(){ return area.getY() + area.getHeight() / 2; },
			offset: function(){ return 0; }
		}),
		new dia.VerticalGuide({
			element: element,
			x: function(){ return area.getX() + area.getWidth(); },
			y: function(){ return area.getY() + area.getHeight() / 2; },
			offset: function(){ return area.getWidth(); }
		})
	];
};

dia.RectangleArea.prototype.boundsContain = function(x, y){
	var bounds = this.getBounds();
	return ((x === bounds.x1 || x === bounds.x2) && dia.between(bounds.y1, y, bounds.y2))
		|| ((y === bounds.y1 || y === bounds.y2) && dia.between(bounds.x1, x, bounds.x2));
};

dia.RectangleArea.prototype.optimizePath = function(fromPoint, toPoint){
	if(this.contains(toPoint.x, toPoint.y)){
		// Do nothing
		return fromPoint;
	}

	// Let's find the equation y = a * x + b
	var a = (toPoint.y - fromPoint.y) / (toPoint.x - fromPoint.x);
	var b = fromPoint.y - a * fromPoint.x;

	var possiblePoints = [];

	var pointFromX = function(x){
		if(fromPoint.x === toPoint.x){
			// Vertical line
			return null;
		}else{
			return {
				x: x,
				y: a * x + b
			};
		}
	};
	var pointFromY = function(y){
		if(a === 0){
			// Horizontal line
			return null;
		}else{
			return {
				x: (y - b) / a,
				y: y
			}
		}
	};

	possiblePoints.push(pointFromX(this.getX()));
	possiblePoints.push(pointFromX(this.getX() + this.getWidth()));
	possiblePoints.push(pointFromY(this.getY()));
	possiblePoints.push(pointFromY(this.getY() + this.getHeight()));

	// Now from all these possible points, let's find the one that is the
	// closest to toPoint
	var distance,
		minDistance = Number.MAX_VALUE,
		closestPoint;
	for(var i = 0 ; i < possiblePoints.length ; i++){
		if(possiblePoints[i] && this.contains(possiblePoints[i].x, possiblePoints[i].y)){
			distance = dia.distance(
				toPoint.x, toPoint.y,
				possiblePoints[i].x, possiblePoints[i].y
			);
			if(distance < minDistance){
				closestPoint = possiblePoints[i];
				minDistance = distance;
			}
		}
	}

	return closestPoint || fromPoint;
};

dia.RectangleArea.prototype.snapshot = function(){
	var x = this.getX(),
		y = this.getY(),
		width = this.getWidth(),
		height = this.getHeight();

	return new dia.RectangleArea({
		x: function(){ return x; },
		y: function(){ return y; },
		width: function(){ return width; },
		height: function(){ return height; }
	});
};

dia.Area.defineIntersection('rectangle', 'rectangle', function(a, b){
	// Let's assume it's another rectangle area
	var boundsA = a.getBounds();
	var boundsB = b.getBounds();

	// Taken from http://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
	return boundsA.x1 < boundsB.x2 && boundsA.x2 > boundsB.x1 &&
    	   boundsA.y1 < boundsB.y2 && boundsA.y2 > boundsB.y1;
});
