describe('a dialog', function(){
	beforeEach(function(){
		$('.modal').remove();
	});
	
	it('does not get added to the body if not shown', function(){
		var dialog = new dia.Dialog();
		
		expect($('.modal').size()).toBe(0);
	});
	
	it('can show', function(){
		var dialog = new dia.Dialog({
			title: 'show'
		});
		dialog.show();
		
		expect($('.modal').size()).toBe(1);
		expect($('.modal')).toBeVisible();
	});
	
	it('can confirm', function(done){
		var dialog = new dia.Dialog();
		
		var param;
		dialog.listen('hide', function(e){
			param = e;
		});
		
		dialog.show();
		dialog.hide(true);
		
		expect(param.confirmed).toBe(true);
		
		setTimeout(function(){
			expect(dialog.root).not.toBeVisible();
			done();
		}, 500);
	});
	
	it('can cancel', function(done){
		var dialog = new dia.Dialog();
		
		var param;
		dialog.listen('hide', function(e){
			param = e;
		});
		
		dialog.show();
		dialog.hide(false);
		
		expect(param.confirmed).toBe(false);
		
		setTimeout(function(){
			expect(dialog.root).not.toBeVisible();
			done();
		}, 500);
	});
	
	it('sets title and content correctly', function(){
		var dialog = new dia.Dialog({
			title: 'my title',
			content: 'my content'
		});
		
		dialog.show();
		
		expect($('.modal-title').html()).toContain('my title');
		expect($('.modal-body').html()).toContain('my content');
	});
	
	it('can set the content to be a DOM node', function(){
		var content = document.createElement('div');
		content.innerHTML = 'my content';
		
		var dialog = new dia.Dialog({
			content: content
		});
		
		dialog.show();
		
		expect($('.modal-body').html()).toContain('my content');
	});
	
	it('can have custom ok/cancel buttons', function(){
		var dialog = new dia.Dialog({
			okLabel: 'myok',
			cancelLabel: 'mycancel'
		});
		
		dialog.show();
		
		expect($('.btn-primary').html()).toContain('myok');
		expect($('.btn-default').html()).toContain('mycancel');
	});
});
