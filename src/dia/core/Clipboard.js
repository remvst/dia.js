dia.Clipboard = function(elements){
	elements = elements || [];

	// Creating a map original element ID => new element ID
	var matchMap = {};
	for(var i = 0 ; i < elements.length ; i++){
		matchMap[elements[i].id] = dia.uuid4();
	}

	// Copying elements
	this.elements = [];
	for(var i = 0 ; i < elements.length ; i++){
		this.elements.push(elements[i].copy(matchMap));
	}
};

dia.Clipboard.prototype.getPastableElements = function(element){
	// Creating a map copied element ID => pasted element ID
	var matchMap = {};
	for(var i = 0 ; i < this.elements.length ; i++){
		matchMap[this.elements[i].id] = dia.uuid4();
	}

	// Copying elements
	var pastable = [];
	for(var i = 0 ; i < this.elements.length ; i++){
		pastable.push(this.elements[i].copy(matchMap));
	}
	return pastable;
};
