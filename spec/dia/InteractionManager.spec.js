describe('an interaction manager', function(){
	it('is initialized properly', function(){
		var im = new dia.InteractionManager();
		
		expect(im.sheet).toBe(null);
		expect(im.tool).toBe(null);
		expect(im.currentPosition).toEqual({ x: 0, y: 0 });
	});
	
	it('can be set a sheet', function(){
		var sheet = new dia.Sheet();
		var im = new dia.InteractionManager();
		
		im.setSheet(sheet);
		
		expect(im.sheet).toBe(sheet);
	});
	
	it('updates the current position even when not dragging', function(){
		var im = new dia.InteractionManager();
		im.setSheet(new dia.Sheet());
		
		expect(im.currentPosition).toEqual({x: 0, y: 0});
		
		im.mouseMove(100, 20);
		
		expect(im.currentPosition).toEqual({x: 100, y: 20});
	});
	
	it('can use tools', function(){
		var down = false,
			move = false,
			up = false;
		
		var tool = new dia.CreateTool({
			mouseDown: function(){ down = true; },
			mouseMove: function(){ move = true; },
			mouseUp: function(){ up = true; }
		});
		
		var im = new dia.InteractionManager();
		
		im.setTool(tool);
		
		im.mouseDown(0,0);
		im.mouseMove(1,1);
		im.mouseUp();
		
		expect(down).toBe(true);
		expect(move).toBe(true);
		expect(up).toBe(true);
	});
});
