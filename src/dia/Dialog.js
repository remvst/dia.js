dia.Dialog = function(settings){
	settings = settings || {};
	
	var mustacheContent = settings.content instanceof HTMLElement ? null : settings.content;
	
	var template = dia.Dialog.getTemplate();
	var html = Mustache.render(template, {
		title: settings.title || null,
		content: mustacheContent || null,
		cancelLabel: settings.cancelLabel || 'Cancel',
		okLabel: settings.okLabel || 'Ok'
	});
	
	this.root = $(html);
	
	this.root.on('hidden', function () {
        $(this).remove();
    });
	
	if(settings.content instanceof HTMLElement){
		this.root.find('.modal-body').append(settings.content);
	}
};

dia.Dialog.prototype.show = function(){
	this.root.appendTo('body');
	this.root.modal('show');
};

dia.Dialog.prototype.hide = function(){
	this.root.modal('hide');
};

dia.Dialog.getTemplate = function(){
	if(!this.template){
		this.template = $('#popup-template').html();
	}
	return this.template;
};
