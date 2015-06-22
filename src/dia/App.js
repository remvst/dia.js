dia.App = function(){
	dia.EventDispatcher.call(this);
	
	this.toolbox = new dia.Toolbox();
	
	this.toolbox.addTool(new dia.SelectionTool());
	
	for(var i in dia.ElementType.types){
		if(dia.ElementType.types[i].creatorTool){
			this.toolbox.addTool(dia.ElementType.types[i].creatorTool);
		}
	}
	
	this.sheet = null;
};

extend(dia.App, dia.EventDispatcher);

dia.App.prototype.newSheet = function(){
	this.openSheet(new dia.Sheet());
};

dia.App.prototype.openSheet = function(sheet){
	this.sheet = sheet;
	
	this.dispatch('newsheet', {
		sheet: this.sheet
	});
};
