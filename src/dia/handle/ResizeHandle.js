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
	this.cursor = options.cursor || this.cursor || null;

	this.accumDX = 0;
	this.accumDY = 0;
};

extend(dia.ResizeHandle, dia.DragHandle);

dia.ResizeHandle.prototype.currentWidth = function(){
	return Math.max(this.minWidth(), this.coveredArea.getWidth());
};

dia.ResizeHandle.prototype.currentHeight = function(){
	return Math.max(this.minHeight(), this.coveredArea.getHeight());
};

dia.ResizeHandle.prototype.dragStart = function(){
	this.accumDX = 0;
	this.accumDY = 0;

	this.initialX = this.coveredArea.getX();
	this.initialY = this.coveredArea.getY();
	this.initialWidth = this.coveredArea.getWidth();
	this.initialHeight = this.coveredArea.getHeight();
};

dia.ResizeHandle.prototype.dragMove = function(dx, dy, x, y){
	this.accumDX += dx;
	this.accumDY += dy;

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
	var gs = this.element.sheet.gridSize;
	var newWidth = Math.max(this.minWidth(), this.initialWidth + this.accumDX);
	this.setWidth(dia.snap(newWidth, gs));
};

dia.ResizeHandle.prototype.handleHeightBottom = function(dx, dy, x, y){
	var gs = this.element.sheet.gridSize;
	var newHeight = Math.max(this.minHeight(), this.initialHeight + this.accumDY);
	this.setHeight(dia.snap(newHeight, gs));
};

dia.ResizeHandle.prototype.handleWidthLeft = function(dx, dy, x, y){
	var gs = this.element.sheet.gridSize;
	var newWidth = this.initialWidth - this.accumDX;
	newWidth = Math.max(this.minWidth(), newWidth);
	newWidth = dia.snap(newWidth, gs);

	dx = this.currentWidth() - newWidth;

	this.setWidth(newWidth);
	this.setX(dia.snap(this.coveredArea.getX() + dx, gs));
};

dia.ResizeHandle.prototype.handleHeightTop = function(dx, dy, x, y){
	var gs = this.element.sheet.gridSize;
	var newHeight = this.initialHeight - this.accumDY;
	newHeight = Math.max(this.minHeight(), newHeight);
	newHeight = dia.snap(newHeight, gs);

	dy = this.currentHeight() - newHeight;

	this.setHeight(newHeight);
	this.setY(dia.snap(this.coveredArea.getY() + dy, gs));
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
		minHeight: options.minHeight,
		cursor: 'ew-resize'
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
		minHeight: options.minHeight,
		cursor: 'ew-resize'
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
		minHeight: options.minHeight,
		cursor: 'ns-resize'
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
		minHeight: options.minHeight,
		cursor: 'ns-resize'
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
		minHeight: options.minHeight,
		cursor: 'nwse-resize'
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
		minHeight: options.minHeight,
		cursor: 'nesw-resize'
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
		minHeight: options.minHeight,
		cursor: 'nesw-resize'
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
		minHeight: options.minHeight,
		cursor: 'nwse-resize'
	}));

};
