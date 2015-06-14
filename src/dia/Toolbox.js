dia.Toolbox = function(){
	this.tools = {};
};

dia.Toolbox.prototype.addTool = function(tool){
	if(!this.tools[tool.id]){
		this.tools[tool.id] = tool;
	}
};

dia.Toolbox.prototype.getTool = function(id){
	return this.tools[id] || null;
};
