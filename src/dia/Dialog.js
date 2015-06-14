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
	return '\
<div class="modal fade" role="dialog">\
	<div class="modal-dialog">\
		<div class="modal-content">\
			<div class="modal-header">\
				<button type="button" class="close" data-dismiss="modal">&times;</button>\
				<h4 class="modal-title">{{ title }}</h4>\
			</div>\
			<div class="modal-body">\
				{{ content }}\
			</div>\
			<div class="modal-footer">\
				<button type="button" class="btn btn-default" data-dismiss="modal">{{ cancelLabel }}</button>\
				<button type="button" class="btn btn-primary" data-dismiss="modal">{{ okLabel }}</button>\
			</div>\
		</div>\
	</div>\
</div>';
};
