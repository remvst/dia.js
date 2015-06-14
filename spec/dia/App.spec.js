describe('an app', function(){
	it('is initialized properly', function(){
		var app = new dia.App();
		
		expect(app.toolbox).toEqual(new dia.Toolbox());
		expect(app.sheet).toEqual(new dia.Sheet());
	});
});
