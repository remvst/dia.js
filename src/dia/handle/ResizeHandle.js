dia.ResizeHandle = function(element, area, options){
	dia.DragHandle.call(this, element, area);

	options = options || {};
	this.type = options.type || 0;
	this.minWidth = options.minWidth || null;
	this.minHeight = options.minHeight || null;
};

extend(dia.ResizeHandle, dia.DragHandle);

dia.ResizeHandle.prototype.currentWidth = function(){
	return Math.max(this.minWidth(), this.element.getProperty('width'));
};

dia.ResizeHandle.prototype.currentHeight = function(){
	return Math.max(this.minHeight(), this.element.getProperty('height'));
};

dia.ResizeHandle.prototype.dragMove = function(dx, dy, x, y){
	if(this.type & dia.ResizeHandle.RIGHT){
		this.handleWidthRight(dx, dy, x, y);
	}
	if(this.type & dia.ResizeHandle.BOTTOM){
		this.handleHeightBottom(dx, dy, x, y);
	}
	if(this.type & dia.ResizeHandle.TOP){
		this.handleHeightTop(dx, dy, x, y);
	}
	if(this.type & dia.ResizeHandle.LEFT){
		this.handleWidthLeft(dx, dy, x, y);
	}
};

dia.ResizeHandle.prototype.handleWidthRight = function(dx, dy, x, y){
	this.element.setProperty('width', Math.max(this.minWidth(), this.element.getProperty('width') + dx));
};

dia.ResizeHandle.prototype.handleHeightBottom = function(dx, dy, x, y){
	this.element.setProperty('height', Math.max(this.minHeight(), this.element.getProperty('height') + dy));
};

dia.ResizeHandle.prototype.handleWidthLeft = function(dx, dy, x, y){
	var newWidth = this.currentWidth() - dx;
	newWidth = Math.max(this.minWidth(), newWidth);

	dx = this.element.getProperty('width') - newWidth;

	this.element.setProperty('width', newWidth);
	this.element.setProperty('x', this.element.getProperty('x') + dx);
};
dia.ResizeHandle.prototype.handleHeightTop = function(dx, dy, x, y){
	var newHeight = this.currentHeight() - dy;
	newHeight = Math.max(this.minHeight(), newHeight);

	dy = this.element.getProperty('height') - newHeight;

	this.element.setProperty('height', newHeight);
	this.element.setProperty('y', this.element.getProperty('y') + dy);
};

dia.ResizeHandle.TOP = 1;
dia.ResizeHandle.BOTTOM = 2;
dia.ResizeHandle.LEFT = 4;
dia.ResizeHandle.RIGHT = 8;
dia.ResizeHandle.TOP_LEFT = dia.ResizeHandle.TOP | dia.ResizeHandle.LEFT;
dia.ResizeHandle.BOTTOM_LEFT = dia.ResizeHandle.BOTTOM | dia.ResizeHandle.LEFT;
dia.ResizeHandle.TOP_RIGHT = dia.ResizeHandle.TOP | dia.ResizeHandle.RIGHT;
dia.ResizeHandle.BOTTOM_RIGHT = dia.ResizeHandle.BOTTOM | dia.ResizeHandle.RIGHT;

dia.ResizeHandle.setupElement = function(element, repr, options){
	options.size = options.size || 10;

	var leftX = function(){ return options.x() - options.size / 2; };
	var middleX = function(){ return options.x() + options.width() / 2 - options.size / 2; }
	var rightX = function(){ return options.x() + options.width() - options.size / 2; };
	var topY = function(){ return options.y() - options.size / 2; };
	var middleY = function(){ return options.y() + options.height() / 2 - options.size / 2; }
	var bottomY = function(){ return options.y() + options.height() - options.size / 2; };
	var size = function(){ return options.size; };

	var leftHandle = new dia.ResizeHandle(element, new dia.RectangleArea({
		x: leftX,
		y: middleY,
		width: size,
		height: size
	}), {
		type: dia.ResizeHandle.LEFT,
		minWidth: options.minWidth,
		minHeight: options.minHeight
	});
	repr.addHandle(leftHandle);

	var rightHandle = new dia.ResizeHandle(element, new dia.RectangleArea({
		x: rightX,
		y: middleY,
		width: size,
		height: size
	}), {
		type: dia.ResizeHandle.RIGHT,
		minWidth: options.minWidth,
		minHeight: options.minHeight
	});
	repr.addHandle(rightHandle);

	var topHandle = new dia.ResizeHandle(element, new dia.RectangleArea({
		x: middleX,
		y: topY,
		width: size,
		height: size
	}), {
		type: dia.ResizeHandle.TOP,
		minWidth: options.minWidth,
		minHeight: options.minHeight
	});
	repr.addHandle(topHandle);

	var bottomHandle = new dia.ResizeHandle(element, new dia.RectangleArea({
		x: middleX,
		y: bottomY,
		width: size,
		height: size
	}), {
		type: dia.ResizeHandle.BOTTOM,
		minWidth: options.minWidth,
		minHeight: options.minHeight
	});
	repr.addHandle(bottomHandle);

	var bottomRightHandle = new dia.ResizeHandle(element, new dia.RectangleArea({
		x: rightX,
		y: bottomY,
		width: size,
		height: size
	}), {
		type: dia.ResizeHandle.BOTTOM_RIGHT,
		minWidth: options.minWidth,
		minHeight: options.minHeight
	});
	repr.addHandle(bottomRightHandle);

	var topRightHandle = new dia.ResizeHandle(element, new dia.RectangleArea({
		x: rightX,
		y: topY,
		width: size,
		height: size
	}), {
		type: dia.ResizeHandle.TOP_RIGHT,
		minWidth: options.minWidth,
		minHeight: options.minHeight
	});
	repr.addHandle(topRightHandle);

	var bottomLeftHandle = new dia.ResizeHandle(element, new dia.RectangleArea({
		x: leftX,
		y: bottomY,
		width: size,
		height: size
	}), {
		type: dia.ResizeHandle.BOTTOM_LEFT,
		minWidth: options.minWidth,
		minHeight: options.minHeight
	});
	repr.addHandle(bottomLeftHandle);

	var topLeftHandle = new dia.ResizeHandle(element, new dia.RectangleArea({
		x: leftX,
		y: topY,
		width: size,
		height: size
	}), {
		type: dia.ResizeHandle.TOP_LEFT,
		minWidth: options.minWidth,
		minHeight: options.minHeight
	});
	repr.addHandle(topLeftHandle);

};
