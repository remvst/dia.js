dia.Dialog = function(settings){
	dia.EventDispatcher.call(this);
	
	settings = settings || {};
	
	this.hideOnOk = 'hideOnOk' in settings ? settings.hideOnOk : true;
	this.hideOnCancel = 'hideOnCancel' in settings ? settings.hideOnCancel : true;
	
	this.ok = 'ok' in settings ? settings.ok : true;
	this.cancel = 'cancel' in settings ? settings.cancel : true;
	this.close = 'close' in settings ? settings.close : true;
	
	var mustacheContent = settings.content instanceof HTMLElement ? null : settings.content;
	
	var template = dia.Dialog.getTemplate();
	var html = Mustache.render(template, {
		title: settings.title || null,
		content: mustacheContent || null,
		cancelLabel: settings.cancelLabel || 'Cancel',
		okLabel: settings.okLabel || 'Ok'
	});
	
	this.root = $(html);
	
	if(!this.ok) this.root.find('.modal-footer .btn-primary').remove();
	if(!this.cancel) this.root.find('.modal-footer .btn-default').remove();
	if(!this.close) this.root.find('.close').remove();
	
	this.root.on('hidden', function () {
        $(this).remove();
    });
	
	if(settings.content instanceof HTMLElement){
		this.root.find('.modal-body').append(settings.content);
	}
	
	var dialog = this;
	this.root.find('.modal-footer .btn-primary').click(function(){
		this.dispatch('clickok');
		if(this.hideOnOk){
			this.hide();
		}
	}.bind(this));
	this.root.find('.modal-footer .btn-default').click(function(){
		this.dispatch('clickcancel');
		if(this.hideOnCancel){
			this.hide();
		}
	}.bind(this));
	this.root.find('.close').click(function(){
		this.hide('clickcancel');
		if(this.hideOnCancel){
			this.hide();
		}
	}.bind(this));
	
	this.visible = false;
};

extend(dia.Dialog, dia.EventDispatcher);

dia.Dialog.prototype.show = function(){
	if(this.visible){
		return;
	}
	
	this.root.appendTo('body');
	this.root.modal({
		show: true,
		backdrop: 'static'
	});
	this.dispatch('show');
	
	this.visible = true;
	dia.Dialog.openCount++;
};

dia.Dialog.prototype.hide = function(){
	if(!this.visible){
		return;
	}
	
	this.root.modal('hide');
	this.dispatch('hide');
	
	this.visible = false;
	dia.Dialog.openCount--;
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

dia.Dialog.openCount = 0;

dia.Dialog.alert = function(title, message){
	var dialog = new dia.Dialog({
		title: title,
		message: message,
		cancel: false
	});
	dialog.show();
};
