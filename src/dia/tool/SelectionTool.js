dia.SelectionTool = function(){
	dia.Tool.call(this);

	this.selectionStart = null;
	this.selectionEnd = null;
	this.previousClick = null;
	this.currentSelection = [];
	this.clickCount = 0;
	this.id = 'select';
	this.label = 'Selection';
	this.down = false;
	this.multipleKeyDown = false;
	this.clipboard = null;

	this.currentHandle = null;
	this.currentPosition = {x: 0, y: 0};
};

extend(dia.SelectionTool, dia.Tool);

dia.SelectionTool.prototype.mouseDown = function(sheet, x, y){
	this.down = true;

	// Before selecting anything, let's try to find a handle to drag
	this.currentHandle = sheet.findHandleContaining(x, y);

	if(!this.multipleKeyDown &&
	   (!this.currentHandle || this.currentSelection.indexOf(this.currentHandle.element) === -1)){
		// Clicked on an element outside of the selection or on no element, let's reset the selection
		for(var i = 0 ; i < this.currentSelection.length ; i++){
			this.currentSelection[i].highlighted = false;
		}
		this.currentSelection = [];
	}

	if(this.currentHandle){
		// Let's highlight that element
		if(this.currentSelection.indexOf(this.currentHandle.element) === -1){
			this.currentSelection.push(this.currentHandle.element);
			this.currentHandle.element.highlighted = true;
			this.dispatch('selectionchange', { selection: this.currentSelection });
		}

		var repr = this.currentHandle.element.getRepresentation();
		if(this.currentHandle === repr.moveHandle){
			this.currentSelection.forEach(function(element){
				var repr = element.getRepresentation();
				if(repr && repr.moveHandle){
					repr.moveHandle.dragStart(x, y);
				}
			});
			this.currentHandle = null;
		}else{
			this.currentHandle.dragStart(x, y);
		}
	}else{
		// No handle, let's do selection mode
		this.selectionStart = { x: x, y: y };
		this.selectionEnd = { x: x, y: y };
	}

	this.currentPosition = {x: x, y: y};
	this.mouseMoved = false;
};

dia.SelectionTool.prototype.mouseMove = function(sheet, x, y){
	var tool = this;
	if(this.down){
		if(this.selectionStart){
			this.selectionEnd = { x: x, y: y };

			this.dispatch('selectionmove');
		}else if(this.currentHandle){
			this.currentHandle.dragMove(
				x - this.currentPosition.x,
				y - this.currentPosition.y,
				x,
				y
			);
		}else{
			this.currentSelection.forEach(function(element){
				var repr = element.getRepresentation();
				if(repr && repr.moveHandle){
					repr.moveHandle.dragMove(
						x - tool.currentPosition.x,
						y - tool.currentPosition.y,
						x,
						y
					);
				}
			});
		}
	}

	this.currentPosition = {x: x, y: y};

	// Cancel click
	this.mouseMoved = true;
	this.clickCount = 0;
};

dia.SelectionTool.prototype.mouseUp = function(sheet, x, y){
	this.down = false;

	if(this.selectionStart){
		// If we were selection, let's apply that selection
		var tool = this;
		var area = new dia.RectangleArea({
			x: function(){ return tool.selectionStart.x; },
			y: function(){ return tool.selectionStart.y; },
			width: function(){ return tool.selectionEnd.x - tool.selectionStart.x; },
			height: function(){ return tool.selectionEnd.y - tool.selectionStart.y; }
		});

		for(var i = 0 ; i < this.currentSelection.length ; i++){
			this.currentSelection[i].highlighted = false;
		}

		this.currentSelection = [];

		for(var i in sheet.elements){
			if(sheet.elements[i].isContainedIn(area)){
				this.currentSelection.push(sheet.elements[i]);
				sheet.elements[i].highlighted = true;
			}
		}

		this.selectionStart = null;
		this.dispatch('selectionchange', { selection: this.currentSelection });
	}else if(this.currentHandle){
		this.currentHandle.dragDrop(this.currentPosition.x, this.currentPosition.y);
	}else{
		this.currentSelection.forEach(function(element){
			var repr = element.getRepresentation();
			if(repr && repr.moveHandle){
				repr.moveHandle.dragDrop(
					x,
					y
				);
			}
		});
	}

	if(!this.mouseMoved){
		if(!this.previousClick
		   || x === this.previousClick.x
		   && y === this.previousClick.y
		   && Date.now() - this.previousClick.time < 500){

			this.clickCount++;
		}else{
			this.clickCount = 1;
		}

		this.previousClick = {
			x: x,
			y: y,
			time: Date.now()
		};
		this.dispatch('click', {
			clickCount: this.clickCount,
			element: (this.currentHandle ? this.currentHandle.element : this.currentSelection[0]) || null
		});
	}

	this.currentHandle = null;
	this.currentPosition = {x: x, y: y};
	this.selectionEnd = null;
};

dia.SelectionTool.prototype.keyDown = function(sheet, keyCode){
	var moveX = 0,
		moveY = 0;
	switch(keyCode){
		case 37: moveX = -1; break;
		case 38: moveY = -1; break;
		case 39: moveX = 1; break;
		case 40: moveY = 1; break;
		case 17:
		case 91:
			this.multipleKeyDown = true;
			break;
	}

	if(moveX || moveY){
		moveX *= 10;
		moveY *= 10;

		this.currentSelection.forEach(function(element){
			var repr = element.getRepresentation();
			if(repr && repr.moveHandle){
				repr.moveHandle.dragStart(0, 0);
				repr.moveHandle.dragMove(moveX, moveY);
				repr.moveHandle.dragDrop(0, 0);
			}
		});
	}
};

dia.SelectionTool.prototype.keyUp = function(sheet, keyCode){
	if(keyCode === 8){
		this.currentSelection.forEach(function(element){
			element.remove();
		});
	}else if(keyCode === 91 || keyCode === 17){
		this.multipleKeyDown = false;
	}
};

dia.SelectionTool.prototype.getRenderable = function(){
	return new dia.Renderable(function(c){
		if(this.selectionStart){
			c.strokeStyle = 'black';
			c.strokeRect(
				this.selectionStart.x + .5,
				this.selectionStart.y + .5,
				this.selectionEnd.x - this.selectionStart.x,
				this.selectionEnd.y - this.selectionStart.y
			)
		}
	}.bind(this));
};

dia.SelectionTool.prototype.copy = function(){
	if(this.currentSelection.length === 0){
		return;
	}

	
};
