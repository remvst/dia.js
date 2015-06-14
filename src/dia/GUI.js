dia.GUI = function(app){
	if(!app){
		throw new Error('Cannot instantiate GUI without an app');
	}
	
	this.app = app;
};
