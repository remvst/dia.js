describe('an app', function(){
	it('is initialized properly', function(){
		var uuid4 = dia.uuid4;
		
		dia.uuid4 = function(){
			return 'uuid';
		};
		
		var app = new dia.App();
		
		expect(app.toolbox).toEqual(new dia.Toolbox());
		expect(app.sheet).toEqual(new dia.Sheet());
		
		dia.uuid4 = uuid4;
	});
});
