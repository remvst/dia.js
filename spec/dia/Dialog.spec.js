jasmine.getFixtures().fixturesPath = 'spec/html';

describe('a dialog', function(){
	beforeEach(function() {
		$('.modal').remove();
		loadFixtures('dialog.html');
	});
	
	it('does not get added to the body if not shown', function(){
		var dialog = new dia.Dialog();
		
		expect($('.modal').size()).toBe(0);
	});
	
	it('can show', function(){
		var dialog = new dia.Dialog();
		dialog.show();
		
		expect($('.modal').size()).toBe(1);
		expect($('.modal')).toBeVisible();
	});
	
	it('can hide', function(){
		var dialog = new dia.Dialog();
		dialog.show();
		dialog.hide();
		
		expect($('.modal').size()).toBe(0);
		expect($('.modal')).not.toBeVisible();
	});
});
