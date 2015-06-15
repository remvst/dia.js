dia.SelectionTool = function(){
	dia.Tool.call(this);
	
	this.selectionStart = null;
	this.selectionEnd = null;
	this.previousClick = null;
	this.currentSelection = [];
	this.clickCount = 0;
	this.id = 'select';
	
	this.currentHandle = null;
	this.currentPosition = {x: 0, y: 0};
};

extend(dia.SelectionTool, dia.Tool);

dia.SelectionTool.prototype.mouseDown = function(sheet, x, y){
	// Before selecting anything, let's try to find a handle to drag
	this.currentHandle = null;
	
	var repr,
		handleArea;
	for(var i = 0 ; i < sheet.elements.length ; i++){
		repr = sheet.elements[i].getRepresentation();
		for(var j = 0 ; j < repr.handles.length ; j++){
			handleArea = repr.handles[j].area;
			if(handleArea.contains(x, y) && 
			   (!this.currentHandle || handleArea.surface() < this.currentHandle.area.surface())){
				this.currentHandle = repr.handles[j];
			}
		}
	}
		
	if(!this.currentHandle || this.currentSelection.indexOf(this.currentHandle.element) === -1){
		// Clicked on an element outside of the selection or on no element, let's reset the selection
		for(var i = 0 ; i < this.currentSelection.length ; i++){
			this.currentSelection[i].highlighted = false;
		}
		this.currentSelection = [];
	}

	if(this.currentHandle){
		this.currentHandle.dragStart(x, y);
		
		// Let's highlight that element
		if(this.currentSelection.indexOf(this.currentHandle.element) === -1){
			this.currentSelection = [this.currentHandle.element];
			this.currentHandle.element.highlighted = true;
			this.dispatch('selectionchange', { selection: this.currentSelection });
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
	}
	
	this.currentPosition = {x: x, y: y};
	
	// Cancel click
	this.mouseMoved = true;
	this.clickCount = 0;
};

dia.SelectionTool.prototype.mouseUp = function(sheet, x, y){
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
	
};

dia.SelectionTool.prototype.keyUp = function(sheet, keyCode){
	if(keyCode === 8){
		this.currentSelection.forEach(function(element){
			element.remove();
		});
	}
};
