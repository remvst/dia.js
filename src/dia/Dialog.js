dia.Dialog = function(settings){
	dia.EventDispatcher.call(this);
	
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
	
	this.root.find('.modal-footer .btn-primary').click(function(){
		this.hide(true);
	}.bind(this));
	this.root.find('.modal-footer .btn-default').click(function(){
		this.hide(false);
	}.bind(this));
	this.root.find('.close').click(function(){
		this.hide();
	}.bind(this));
};

extend(dia.Dialog, dia.EventDispatcher);

dia.Dialog.prototype.show = function(){
	this.root.appendTo('body');
	this.root.modal({
		show: true,
		backdrop: 'static'
	});
	this.dispatch('show');
};

dia.Dialog.prototype.hide = function(confirmed){
	this.root.modal('hide');
	this.dispatch('hide', {
		confirmed: !!confirmed
	});
};

dia.Dialog.getTemplate = function(){
	return '\
<div class="modal fade" role="dialog">\
	<div class="modal-dialog">\
		<div class="modal-content">\
			<div class="modal-header">\
				<button type="button" class="close">&times;</button>\
				<h4 class="modal-title">{{ title }}</h4>\
			</div>\
			<div class="modal-body">\
				{{ content }}\
			</div>\
			<div class="modal-footer">\
				<button type="button" class="btn btn-default">{{ cancelLabel }}</button>\
				<button type="button" class="btn btn-primary">{{ okLabel }}</button>\
			</div>\
		</div>\
	</div>\
</div>';
};
