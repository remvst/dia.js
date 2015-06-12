dia.SelectionTool = function(){
	dia.Tool.call(this);
	
	this.selectionStart = null;
	this.selectionEnd = null;
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
	this.selectionStart = null;
	this.selectionEnd = null;
};

dia.SelectionTool.prototype.keyDown = function(sheet, keyCode){
	// TODO
};

dia.SelectionTool.prototype.keyUp = function(sheet, keyCode){
	// TODO
};
