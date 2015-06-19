describe('a toolbox', function(){
	it('can contain tools', function(){
		var tool = new dia.Tool();
		tool.id = 'mytool';
		
		var toolbox = new dia.Toolbox();
		toolbox.addTool(tool);
		
		expect(toolbox.getTool('mytool')).toBe(tool);
		expect(toolbox.toolList).toEqual([tool]);
	});
	
	it('does not add the same tool twice', function(){
		var tool = new dia.Tool();
		tool.id = 'mytool';
		
		var toolbox = new dia.Toolbox();
		toolbox.addTool(tool);
		toolbox.addTool(tool);
		
		expect(toolbox.getTool('mytool')).toBe(tool);
		expect(toolbox.toolList).toEqual([tool]);
	});
});
