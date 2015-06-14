dia.App = function(){
	this.toolbox = new dia.Toolbox();
	this.sheet = new dia.Sheet();
};

dia.App.prototype.start = function(){
	this.toolbox.addTool(new dia.SelectionTool());
	
	for(var i in dia.ElementType.types){
		if(dia.ElementType.types[i].creatorTool){
			this.toolbox.addTool(dia.ElementType.types[i].creatorTool);
		}
	}
	
	this.gui = new dia.GUI(this);
	this.gui.renderToolbox();
};
