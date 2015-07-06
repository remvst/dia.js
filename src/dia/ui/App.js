dia.App = function(){
	dia.EventDispatcher.call(this);

	this.toolbox = new dia.Toolbox();

	this.toolbox.addTool(new dia.SelectionTool());

	var types = dia.ElementType.types;
	for(var id in types){
		for(var k = 0 ; k < types[id].tools.length ; k++){
			this.toolbox.addTool(types[id].tools[k]);
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
