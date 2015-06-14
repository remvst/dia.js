describe('a toolbox', function(){
	it('can contain tools', function(){
		var tool = new dia.Tool();
		tool.id = 'mytool';
		
		var toolbox = new dia.Toolbox();
		toolbox.addTool(tool);
		
		expect(toolbox.getTool('mytool')).toBe(tool);
	});
});
