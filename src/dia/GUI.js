dia.GUI = function(app){
	if(!app){
		throw new Error('Cannot instantiate GUI without an app');
	}
	
	this.app = app;
	
	this.canvas = document.getElementById('canvas');
	this.context = this.canvas.getContext('2d');
	
	this.setupInterationManager();
};

dia.GUI.prototype.setupInterationManager = function(){
	if(this.interactionManager){
		return;
	}
	
	this.interactionManager = new dia.InteractionManager();
	this.interactionManager.setSheet(this.app.sheet);
	
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
		//<button type="button" class="btn btn-default btn-lg btn-block">Rectangle</button>
		button = $('<button></button>')
					.addClass('btn btn-default btn-block btn-lg')
					.text(tool.id)
					.appendTo(container)
					.click((function(t){
						return function(){
							gui.selectTool(t);
						}
					})(tool));
	}
};

dia.GUI.prototype.selectTool = function(tool){
	this.interactionManager.setTool(tool);
};

dia.GUI.prototype.renderSheet = function(){
	this.app.sheet.render(this.context);
};
