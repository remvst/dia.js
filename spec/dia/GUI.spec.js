describe('a GUI', function(){
	it('is initialized properly', function(){
		var app = new dia.App();
		var gui = new dia.GUI(app);
		
		expect(gui.app).toBe(app);
	});
	
	it('cannot be initialized without an app', function(){
		expect(function(){
			new dia.GUI();
		}).toThrow();
	});
});
