dia.SelectionTool = function(){
	dia.Tool.call(this);
	
	this.selectionStart = null;
	this.selectionEnd = null;
	this.previousClick = null;
	this.currentSelection = [];
};

extend(dia.SelectionTool, dia.Tool);

dia.SelectionTool.prototype.mouseDown = function(sheet, x, y){
	this.selectionStart = { x: x, y: y };
	this.selectionEnd = { x: x, y: y };
};

dia.SelectionTool.prototype.mouseMove = function(sheet, x, y){
	if(this.selectionStart){
		this.selectionEnd = { x: x, y: y };
	}
	
	// Cancel double click
	this.previousClick = null;
};

dia.SelectionTool.prototype.mouseUp = function(sheet, x, y){
	if(this.selectionStart){
		var tool = this;
		var area = new dia.RectangleArea({
			x: function(){ return tool.selectionStart.x; },
			y: function(){ return tool.selectionStart.y; },
			width: function(){ return tool.selectionEnd.x - tool.selectionStart.x; },
			height: function(){ return tool.selectionEnd.y - tool.selectionStart.y; }
		});

		this.currentSelection = [];

		for(var i in sheet.elements){
			if(sheet.elements[i].isContainedIn(area)){
				this.currentSelection.push(sheet.elements[i]);
			}
		}	
	}
	
	if(this.selectionStart.x === this.selectionEnd.x && this.selectionStart.y == this.selectionEnd.y){
		// It's a click
		if(this.previousClick 
		   && this.selectionStart.x == this.previousClick.x
		   && this.selectionStart.y == this.previousClick.y
		   && Date.now() - this.previousClick.time < 500){
			
			// It's a double click
			this.dispatch('doubleclick', { element: this.currentSelection[0] || null });
		}else{
			this.previousClick = this.selectionStart;
			this.previousClick.time = Date.now();
		}
	}
	
	this.selectionStart = null;
	this.selectionEnd = null;
};

dia.SelectionTool.prototype.keyDown = function(sheet, keyCode){
	// TODO
};

dia.SelectionTool.prototype.keyUp = function(sheet, keyCode){
	// TODO
};
