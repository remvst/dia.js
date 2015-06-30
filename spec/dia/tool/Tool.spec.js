describe('a tool', function(){
	it('is initialized properly', function(){
		var tool = new dia.Tool();
		
		expect(tool.id).toBe(null);
		expect(tool.label).toBe(null);
	});
	
	it('has default empty behaviour', function(){
		var tool = new dia.Tool();
		
		expect(function(){
			tool.mouseDown();
			tool.mouseMove();
			tool.mouseUp();
			tool.keyDown();
			tool.keyUp();
		}).not.toThrow();
	});
});
