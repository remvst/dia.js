dia.EventDispatcher = function(){
	this.listeners = {};
};

dia.EventDispatcher.prototype.listen = function(event, callback){
	if(!this.listeners[event]){
		this.listeners[event] = [];
	}
	this.listeners[event].push(callback);
};

dia.EventDispatcher.prototype.ignore = function(event, callback){
	if(this.listeners[event]){
		var index = this.listeners[event].indexOf(callback);
		if(index >= 0){
			this.listeners[event].splice(index, 1);
		}
	}
};

dia.EventDispatcher.prototype.dispatch = function(event, data){
	if(this.listeners[event]){
		for(var i = this.listeners[event].length - 1 ; i >= 0 ; i--){
			this.listeners[event][i].call(this, data);
		}
	}
};
