dia.GUI = function(app){
	if(!app){
		throw new Error('Cannot instantiate GUI without an app');
	}
	
	this.app = app;
	
	this.canvas = document.getElementById('canvas');
	this.context = this.canvas.getContext('2d');
	
	this.sheetCanvases = {};
	
	this.boundElementAdded = this.elementAdded.bind(this);
	this.boundElementRemoved = this.elementRemoved.bind(this);
	this.boundElementModified = this.elementModified.bind(this);
	
	// In case the sheet already contains elements, let's watch them
	for(var i = 0 ; i < this.app.sheet.elements.length ; i++){
		this.app.sheet.elements[i].listen('propertychange', this.boundElementModified);
	}
	
	this.setupInterationManager();
	
	var selectionTool = this.app.toolbox.getTool('select');
	if(selectionTool){
		selectionTool.listen('selectionmove', this.renderSheet.bind(this));
		selectionTool.listen('selectionchange', this.renderSheet.bind(this));
		selectionTool.listen('click', this.selectionClick.bind(this));
	}
	
	
	// Canvas auto-resize
	window.addEventListener('resize', this.resizeCanvas.bind(this), false);
	this.resizeCanvas();
	
	this.renderSheet();
};

dia.GUI.prototype.resizeCanvas = function(){
	var content = $('#canvas-container');
	
	var width = content.outerWidth();
	var height = content.outerHeight();

	this.canvas.width = width;
	this.canvas.height = height;

	this.sheetCanvases[this.app.sheet.id].setDimensions(width, height);
};

dia.GUI.prototype.setupInterationManager = function(){
	if(this.interactionManager){
		return;
	}
	
	this.interactionManager = new dia.InteractionManager();
	this.interactionManager.setSheet(this.app.sheet);
	
	var selectionTool = this.app.toolbox.getTool('select');
	if(selectionTool){
		this.interactionManager.setTool(selectionTool);
	}
	
	this.sheetCanvases[this.app.sheet.id] = new dia.Canvas(this.app.sheet);
	
	var gui = this;
	
	this.canvas.addEventListener('mousedown', function(e){
		var position = gui.getPositionOnSheet(e);
		gui.interactionManager.mouseDown(position.x, position.y);
	}, false);
	this.canvas.addEventListener('mousemove', function(e){
		var position = gui.getPositionOnSheet(e);
		gui.interactionManager.mouseMove(position.x, position.y);
	}, false);
	this.canvas.addEventListener('mouseup', function(e){
		var position = gui.getPositionOnSheet(e);
		gui.interactionManager.mouseUp(position.x, position.y);
	}, false);
	
	this.app.sheet.listen('elementadded', this.elementAdded.bind(this));
	this.app.sheet.listen('elementremoved', this.elementRemoved.bind(this));
};

dia.GUI.prototype.getPositionOnSheet = function(event){
	var offset = $('#canvas').offset();
	
	// TODO account for canvas offset
	return {
		x: event.pageX - offset.left,
		y: event.pageY - offset.top
	};
};

dia.GUI.prototype.renderToolbox = function(){
	var container = $('#toolbox'),
		gui = this;
	
	var tool,
		button;
	for(var i = 0 ; i < this.app.toolbox.toolList.length ; i++){
		tool = this.app.toolbox.toolList[i];
		button = $('<button></button>')
					.addClass('btn btn-default btn-block btn-lg')
					.text(tool.id)
					.appendTo(container)
					.click((function(t){
						return function(){
							gui.selectTool(t);
						}
					})(tool));
		
		tool.listen('elementcreated', this.doneCreating.bind(this));
	}
};

dia.GUI.prototype.doneCreating = function(){
	var select = this.app.toolbox.getTool('select');
	this.interactionManager.setTool(select);
};

dia.GUI.prototype.selectTool = function(tool){
	this.interactionManager.setTool(tool);
};

dia.GUI.prototype.renderSheet = function(){
	var canvas = this.sheetCanvases[this.app.sheet.id];
	canvas.render(this.context);
	
	// Rendering selection
	var selectionTool = this.app.toolbox.getTool('select');
	if(selectionTool && selectionTool.selectionStart){
		this.context.strokeStyle = 'black';
		this.context.strokeRect(
			selectionTool.selectionStart.x + .5,
			selectionTool.selectionStart.y + .5,
			selectionTool.selectionEnd.x - selectionTool.selectionStart.x,
			selectionTool.selectionEnd.y - selectionTool.selectionStart.y
		)
	}
};

dia.GUI.prototype.selectionClick = function(e){
	if(e.clickCount == 2 && e.element){
		var form = new dia.ElementForm(e.element);
		var root = form.getHTMLRoot();

		var dialog = new dia.Dialog({
			title: 'Edit ' + e.element.type.label,
			content: root
		});
		dialog.show();
		
		dialog.listen('hide', function(e){
			if(e.confirmed){
				form.submit();
			}
		});
	}
};

dia.GUI.prototype.elementAdded = function(e){
	e.element.listen('propertychange', this.boundElementModified);
	this.renderSheet();
};

dia.GUI.prototype.elementRemoved = function(e){
	this.renderSheet();
};

dia.GUI.prototype.elementModified = function(e){
	this.renderSheet();
};
