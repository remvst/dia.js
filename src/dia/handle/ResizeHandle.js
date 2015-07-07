dia.ResizeHandle = function(element, area){
	dia.DragHandle.call(this, element, area);
};

extend(dia.ResizeHandle, dia.DragHandle);

dia.ResizeHandle.prototype.dragMove = function(dx, dy, x, y){

};

dia.ResizeHandle.handleWidthRight = function(dx, dy, x, y){
	element.setProperty('width', Math.max(getRequiredWidth(), element.getProperty('width') + dx));
};
dia.ResizeHandle.handleHeightBottom = function(dx, dy, x, y){
	element.setProperty('height', Math.max(getRequiredHeight(), element.getProperty('height') + dy));
};
dia.ResizeHandle.handleWidthLeft = function(dx, dy, x, y){
	var newWidth = getWidth() - dx;
	newWidth = Math.max(getRequiredWidth(), newWidth);

	dx = element.getProperty('width') - newWidth;

	element.setProperty('width', newWidth);
	element.setProperty('x', element.getProperty('x') + dx);
};
dia.ResizeHandle.handleHeightTop = function(dx, dy, x, y){
	var newHeight = getHeight() - dy;
	newHeight = Math.max(getRequiredHeight(), newHeight);

	dy = element.getProperty('height') - newHeight;

	element.setProperty('height', newHeight);
	element.setProperty('y', element.getProperty('y') + dy);
};

dia.ResizeHandle.setupElement = function(element, repr, options){
	options.size = options.size || 10;

	var leftX = function(){ return options.x() - options.size / 2; };
	var middleX = function(){ return options.x() + options.width() / 2 - options.size / 2; }
	var rightX = function(){ return options.x() + options.width() - options.size / 2; };
	var topY = function(){ return options.y() - options.size / 2; };
	var middleY = function(){ return options.y() + options.height() / 2 - options.size / 2; }
	var bottomY = function(){ return options.y() + options.height() - options.size / 2; };
	var size = function(){ return options.size; };

	var leftHandle = new dia.DragHandle(element, new dia.RectangleArea({
		x: leftX,
		y: middleY,
		width: size,
		height: size
	}));
	repr.addHandle(leftHandle);

	var rightHandle = new dia.DragHandle(element, new dia.RectangleArea({
		x: rightX,
		y: middleY,
		width: size,
		height: size
	}));
	repr.addHandle(rightHandle);

	var topHandle = new dia.DragHandle(element, new dia.RectangleArea({
		x: middleX,
		y: topY,
		width: size,
		height: size
	}));
	repr.addHandle(topHandle);

	var bottomHandle = new dia.DragHandle(element, new dia.RectangleArea({
		x: middleX,
		y: bottomY,
		width: size,
		height: size
	}));
	repr.addHandle(bottomHandle);

	var bottomRightHandle = new dia.DragHandle(element, new dia.RectangleArea({
		x: rightX,
		y: bottomY,
		width: size,
		height: size
	}));
	repr.addHandle(bottomRightHandle);

	var topRightHandle = new dia.DragHandle(element, new dia.RectangleArea({
		x: rightX,
		y: topY,
		width: size,
		height: size
	}));
	repr.addHandle(topRightHandle);

	var bottomLeftHandle = new dia.DragHandle(element, new dia.RectangleArea({
		x: leftX,
		y: bottomY,
		width: size,
		height: size
	}));
	repr.addHandle(bottomLeftHandle);

	var topLeftHandle = new dia.DragHandle(element, new dia.RectangleArea({
		x: leftX,
		y: topY,
		width: size,
		height: size
	}));
	repr.addHandle(topLeftHandle);

};
