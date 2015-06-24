dia.GUI = function(app){
	if(!app){
		throw new Error('Cannot instantiate GUI without an app');
	}
	
	this.app = app;
	this.sheet = null;
	
	this.sheetCanvases = {};
	
	this.canvas = document.getElementById('canvas');
	this.context = this.canvas.getContext('2d');
	
	this.setupInteractionManager();
	
	var selectionTool = this.app.toolbox.getTool('select');
	if(selectionTool){
		selectionTool.listen('selectionmove', this.renderSheet.bind(this));
		selectionTool.listen('selectionchange', this.renderSheet.bind(this));
		selectionTool.listen('click', this.selectionClick.bind(this));
	}
	
	// 
	this.app.listen('newsheet', this.newAppSheet.bind(this));
	
	// Canvas auto-resize
	window.addEventListener('resize', this.resizeCanvas.bind(this), false);
	this.resizeCanvas();
	
	// UI buttons
	var saveButton = document.getElementById('button-save-sheet');
	var newButton = document.getElementById('button-new-sheet');
	var loadButton = document.getElementById('button-load-sheet');
	
	if(saveButton) saveButton.addEventListener('click', this.saveSheet.bind(this), false);
	if(newButton) newButton.addEventListener('click', this.newSheet.bind(this), false);
	if(loadButton) loadButton.addEventListener('click', this.loadSheet.bind(this), false);
	
	this.renderToolbox();
};

dia.GUI.prototype.newAppSheet = function(e){
	this.app.sheet.listen('elementadded', this.elementAdded.bind(this));
	this.app.sheet.listen('elementremoved', this.elementRemoved.bind(this));
	this.app.sheet.listen('renderableadded', this.renderSheet.bind(this));
	this.app.sheet.listen('renderableremoved', this.renderSheet.bind(this));
	
	// In case the sheet already contains elements, let's watch them
	for(var i = 0 ; i < this.app.sheet.elements.length ; i++){
		this.app.sheet.elements[i].listen('propertychange', this.elementModified.bind(this));
	}
	
	// Rendering the selection tool
	var selectionTool = this.app.toolbox.getTool('select');
	if(selectionTool){
		this.app.sheet.addRenderable(selectionTool.getRenderable());
	}
	
	this.interactionManager.setSheet(this.app.sheet);
	
	this.renderSheet();
};

dia.GUI.prototype.resizeCanvas = function(){
	var content = $('#canvas-container');
	
	var width = content.outerWidth();
	var height = content.outerHeight();

	this.canvas.width = width;
	this.canvas.height = height;
	
	this.renderSheet();
};

dia.GUI.prototype.setupInteractionManager = function(){
	if(this.interactionManager){
		return;
	}
	
	this.interactionManager = new dia.InteractionManager(this);
	
	var selectionTool = this.app.toolbox.getTool('select');
	if(selectionTool){
		this.interactionManager.setTool(selectionTool);
	}
	
	var gui = this;
	
	this.canvas.addEventListener('mousedown', function(e){
		if(dia.Dialog.openCount === 0){
			gui.bufferSheetRender();
		
			e.preventDefault();

			var position = gui.getPositionOnSheet(e);
			gui.interactionManager.mouseDown(position.x, position.y);
			
			gui.flushSheetRender();
		}
	}, false);
	this.canvas.addEventListener('mousemove', function(e){
		if(dia.Dialog.openCount === 0){
			gui.bufferSheetRender();
		
			e.preventDefault();

			var position = gui.getPositionOnSheet(e);
			gui.interactionManager.mouseMove(position.x, position.y, position.absoluteX, position.absoluteY);
			
			var handle = gui.app.sheet.findHandleContaining(position.x, position.y);
			gui.canvas.style.cursor = handle ? handle.cursor : 'default';
			
			gui.flushSheetRender();
		}
	}, false);
	this.canvas.addEventListener('mouseup', function(e){
		if(dia.Dialog.openCount === 0){
			gui.bufferSheetRender();
			
			e.preventDefault();

			var position = gui.getPositionOnSheet(e);
			gui.interactionManager.mouseUp(position.x, position.y);
			
			gui.flushSheetRender();
		}
	}, false);
	document.addEventListener('keydown', function(e){
		if(dia.Dialog.openCount === 0){
			gui.bufferSheetRender();
			
			e.preventDefault();
			gui.interactionManager.keyDown(e.keyCode);
			
			gui.flushSheetRender();
		}
	}, false);
	document.addEventListener('keyup', function(e){
		if(dia.Dialog.openCount === 0){
			gui.bufferSheetRender();
			
			e.preventDefault();
			gui.interactionManager.keyUp(e.keyCode);
			
			gui.flushSheetRender();
		}
	}, false);
};

dia.GUI.prototype.getPositionOnSheet = function(event){
	var offset = this.canvas.getBoundingClientRect();
	
	var canvas = this.getSheetCanvas(this.app.sheet);
	
	return {
		x: event.pageX - offset.left + canvas.scrollX,
		y: event.pageY - offset.top + canvas.scrollY,
		absoluteX: event.pageX - offset.left,
		absoluteY: event.pageY - offset.top
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
					.text(tool.label || tool.id)
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
	if(this.bufferRender){
		this.bufferedRenders++;
	}else{
		if(this.app.sheet){
			var canvas = this.getSheetCanvas(this.app.sheet);
			canvas.render(this.context);
		}
	}
};

dia.GUI.prototype.selectionClick = function(e){
	if(e.clickCount === 2 && e.element){
		var form = new dia.ElementForm(e.element);
		var root = form.getHTMLRoot();

		var dialog = new dia.Dialog({
			title: 'Edit ' + e.element.type.label,
			content: root
		});
		dialog.show();
		
		dialog.listen('clickok', function(){
			form.submit();
			this.hide();
		});
		dialog.listen('clickcancel', function(){
			this.hide();
		});
	}
};

dia.GUI.prototype.elementAdded = function(e){
	e.element.listen('propertychange', this.elementModified.bind(this));
	this.renderSheet();
};

dia.GUI.prototype.elementRemoved = function(e){
	this.renderSheet();
};

dia.GUI.prototype.elementModified = function(e){
	this.renderSheet();
};

dia.GUI.prototype.getSheetCanvas = function(sheet){
	if(!this.sheetCanvases[sheet.id]){
		this.sheetCanvases[sheet.id] = new dia.Canvas(sheet);
		this.sheetCanvases[sheet.id].setDimensions(this.canvas.width, this.canvas.height);
		this.sheetCanvases[sheet.id].listen('scrollchange', this.renderSheet.bind(this));
	}
	return this.sheetCanvases[sheet.id];
};

dia.GUI.prototype.bufferSheetRender = function(){
	this.bufferRender = true;
	this.bufferedRenders = 0;
};

dia.GUI.prototype.flushSheetRender = function(){
	this.bufferRender = false;
	
	if(this.bufferedRenders > 0){
		this.renderSheet();
	}
	this.bufferedRenders = 0;
};

dia.GUI.prototype.loadSheet = function(){
	var input = document.createElement('textarea');
	input.className = 'form-control';
	input.rows = 10;
	
	var modal = new dia.Dialog({
		title: 'Load an existing sheet',
		content: input,
		hideOnOk: false,
		hideOnCancel: true
	});
	modal.show();
	
	var gui = this;
	modal.listen('clickok', function(){
		var json,
			sheet;
		try{
			json = JSON.parse(input.value);
			sheet = dia.Sheet.fromJSON(json);
			gui.app.openSheet(sheet);
			modal.hide();
		}catch(ex){
			dia.Dialog.alert('Error', 'Error while loading: ' + ex);
		}
	});
};

dia.GUI.prototype.saveSheet = function(){
	var input = document.createElement('textarea');
	input.className = 'form-control';
	input.rows = 10;
	input.value = JSON.stringify(this.app.sheet.toJSON());
	
	var modal = new dia.Dialog({
		title: 'Save the current sheet',
		content: input,
		cancel: false
	});
	modal.show();
};

dia.GUI.prototype.newSheet = function(){
	var modal = new dia.Dialog({
		title: 'New sheet',
		content: 'Create a new sheet without saving the current one?'
	});
	modal.show();
	
	var gui = this;
	modal.listen('clickok', function(){
		gui.app.newSheet();
	});
};
