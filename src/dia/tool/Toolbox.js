dia.Toolbox = function(){
	this.toolMap = {};
	this.toolList = [];
};

dia.Toolbox.prototype.addTool = function(tool){
	if(!this.toolMap[tool.id]){
		this.toolMap[tool.id] = tool;
		this.toolList.push(tool);
	}
};

dia.Toolbox.prototype.getTool = function(id){
	return this.toolMap[id] || null;
};
