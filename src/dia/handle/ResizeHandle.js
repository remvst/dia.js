dia.ResizeHandle = function(element, area, options){
	dia.DragHandle.call(this, element, area);

	options = options || {};
	this.type = options.type || 0;
	this.coveredArea = options.area;
	this.setX = options.setX || null;
	this.setY = options.setY || null;
	this.setWidth = options.setWidth || null;
	this.setHeight = options.setHeight || null;
	this.minWidth = options.minWidth || null;
	this.minHeight = options.minHeight || null;
};

extend(dia.ResizeHandle, dia.DragHandle);

dia.ResizeHandle.prototype.currentWidth = function(){
	return Math.max(this.minWidth(), this.coveredArea.getWidth());
};

dia.ResizeHandle.prototype.currentHeight = function(){
	return Math.max(this.minHeight(), this.coveredArea.getHeight());
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
	this.setWidth(Math.max(this.minWidth(), this.currentWidth() + dx));
};

dia.ResizeHandle.prototype.handleHeightBottom = function(dx, dy, x, y){
	this.setHeight(Math.max(this.minHeight(), this.currentHeight() + dy));
};

dia.ResizeHandle.prototype.handleWidthLeft = function(dx, dy, x, y){
	var newWidth = this.currentWidth() - dx;
	newWidth = Math.max(this.minWidth(), newWidth);

	dx = this.currentWidth() - newWidth;

	this.setWidth(newWidth);
	this.setX(this.coveredArea.getX() + dx);
};
dia.ResizeHandle.prototype.handleHeightTop = function(dx, dy, x, y){
	var newHeight = this.currentHeight() - dy;
	newHeight = Math.max(this.minHeight(), newHeight);

	dy = this.currentHeight() - newHeight;

	this.setHeight(newHeight);
	this.setY(this.coveredArea.getY() + dy);
};

dia.ResizeHandle.TOP = 1;
dia.ResizeHandle.BOTTOM = 2;
dia.ResizeHandle.LEFT = 4;
dia.ResizeHandle.RIGHT = 8;
dia.ResizeHandle.TOP_LEFT = dia.ResizeHandle.TOP | dia.ResizeHandle.LEFT;
dia.ResizeHandle.BOTTOM_LEFT = dia.ResizeHandle.BOTTOM | dia.ResizeHandle.LEFT;
dia.ResizeHandle.TOP_RIGHT = dia.ResizeHandle.TOP | dia.ResizeHandle.RIGHT;
dia.ResizeHandle.BOTTOM_RIGHT = dia.ResizeHandle.BOTTOM | dia.ResizeHandle.RIGHT;

dia.ResizeHandle.setupElement = function(element, repr, area, options){
	options.size = options.size || 10;

	var leftX = function(){ return area.getX() - options.size / 2; };
	var middleX = function(){ return area.getX() + area.getWidth() / 2 - options.size / 2; }
	var rightX = function(){ return area.getX() + area.getWidth() - options.size / 2; };
	var topY = function(){ return area.getY() - options.size / 2; };
	var middleY = function(){ return area.getY() + area.getHeight() / 2 - options.size / 2; }
	var bottomY = function(){ return area.getY() + area.getHeight() - options.size / 2; };
	var size = function(){ return options.size; };

	repr.addHandle(new dia.ResizeHandle(element, new dia.RectangleArea({
		x: leftX,
		y: middleY,
		width: size,
		height: size
	}), {
		type: dia.ResizeHandle.LEFT,
		area: area,
		setX: options.setX,
		setY: options.setY,
		setWidth: options.setWidth,
		setHeight: options.setHeight,
		minWidth: options.minWidth,
		minHeight: options.minHeight
	}));

	repr.addHandle(new dia.ResizeHandle(element, new dia.RectangleArea({
		x: rightX,
		y: middleY,
		width: size,
		height: size
	}), {
		type: dia.ResizeHandle.RIGHT,
		area: area,
		setX: options.setX,
		setY: options.setY,
		setWidth: options.setWidth,
		setHeight: options.setHeight,
		minWidth: options.minWidth,
		minHeight: options.minHeight
	}));

	repr.addHandle(new dia.ResizeHandle(element, new dia.RectangleArea({
		x: middleX,
		y: topY,
		width: size,
		height: size
	}), {
		type: dia.ResizeHandle.TOP,
		area: area,
		setX: options.setX,
		setY: options.setY,
		setWidth: options.setWidth,
		setHeight: options.setHeight,
		minWidth: options.minWidth,
		minHeight: options.minHeight
	}));

	repr.addHandle(new dia.ResizeHandle(element, new dia.RectangleArea({
		x: middleX,
		y: bottomY,
		width: size,
		height: size
	}), {
		type: dia.ResizeHandle.BOTTOM,
		area: area,
		setX: options.setX,
		setY: options.setY,
		setWidth: options.setWidth,
		setHeight: options.setHeight,
		minWidth: options.minWidth,
		minHeight: options.minHeight
	}));

	repr.addHandle(new dia.ResizeHandle(element, new dia.RectangleArea({
		x: rightX,
		y: bottomY,
		width: size,
		height: size
	}), {
		type: dia.ResizeHandle.BOTTOM_RIGHT,
		area: area,
		setX: options.setX,
		setY: options.setY,
		setWidth: options.setWidth,
		setHeight: options.setHeight,
		minWidth: options.minWidth,
		minHeight: options.minHeight
	}));

	repr.addHandle(new dia.ResizeHandle(element, new dia.RectangleArea({
		x: rightX,
		y: topY,
		width: size,
		height: size
	}), {
		type: dia.ResizeHandle.TOP_RIGHT,
		area: area,
		setX: options.setX,
		setY: options.setY,
		setWidth: options.setWidth,
		setHeight: options.setHeight,
		minWidth: options.minWidth,
		minHeight: options.minHeight
	}));

	repr.addHandle(new dia.ResizeHandle(element, new dia.RectangleArea({
		x: leftX,
		y: bottomY,
		width: size,
		height: size
	}), {
		type: dia.ResizeHandle.BOTTOM_LEFT,
		area: area,
		setX: options.setX,
		setY: options.setY,
		setWidth: options.setWidth,
		setHeight: options.setHeight,
		minWidth: options.minWidth,
		minHeight: options.minHeight
	}));

	repr.addHandle(new dia.ResizeHandle(element, new dia.RectangleArea({
		x: leftX,
		y: topY,
		width: size,
		height: size
	}), {
		type: dia.ResizeHandle.TOP_LEFT,
		area: area,
		setX: options.setX,
		setY: options.setY,
		setWidth: options.setWidth,
		setHeight: options.setHeight,
		minWidth: options.minWidth,
		minHeight: options.minHeight
	}));

};
