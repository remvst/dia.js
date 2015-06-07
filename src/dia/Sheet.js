dia.Sheet = function(){
	this.title = null;
	this.elements = [];
};

dia.Sheet.prototype.addElement = function(element){
	if(element.sheet === this){
		return;
	}

	element.remove();
	this.elements.push(element);
	element.sheet = this;
};

dia.Sheet.prototype.removeElement = function(element){
	if(element.sheet !== this){
		return;
	}

	var index = this.elements.indexOf(element);
	if(index >= 0){
		this.elements.splice(index, 1);
	}
	
	element.sheet = null;
};
