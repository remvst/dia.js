dia.Dialog = function(settings){
	settings = settings || {};
	
	var template = dia.Dialog.getTemplate();
	var html = Mustache.render(template, {
		title: settings.title || null
	});
	
	this.root = $(html);
};

dia.Dialog.prototype.show = function(){
	this.root.appendTo('body');
};

dia.Dialog.prototype.hide = function(){
	this.root.detach();
};

dia.Dialog.getTemplate = function(){
	if(!this.template){
		this.template = $('#popup-template').html();
	}
	return this.template;
};
