describe('an interaction manager', function(){
	it('is initialized properly', function(){
		var im = new dia.InteractionManager();
		
		expect(im.sheet).toBe(null);
		expect(im.tool).toBe(null);
		expect(im.currentPosition).toEqual({ x: 0, y: 0, absoluteX: 0, absoluteY: 0 });
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
		
		im.mouseMove(100, 20, 50, 70);
		
		expect(im.currentPosition).toEqual({x: 100, y: 20, absoluteX: 50, absoluteY: 70 });
	});
	
	it('does not crash if no tool is specified', function(){
		var im = new dia.InteractionManager();
		
		expect(function(){
			im.mouseDown(0,0);
			im.mouseMove(1,1);
			im.mouseUp();

			im.keyDown(32);
			im.keyUp(32);
		}).not.toThrow();
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
	
	it('can move the canvas offset using the space bar', function(){
		$('<div></div>').attr('id', 'toolbox').appendTo('body');
		$('<canvas></canvas>').attr('id', 'canvas').appendTo('body');
		
		var app = new dia.App();
		var gui = new dia.GUI(app);
		var im = gui.interactionManager;
		
		app.newSheet();
		
		im.keyDown(32);
		im.mouseMove(10, 20, 10, 20);
		
		var canvas = gui.getSheetCanvas(app.sheet);
		expect(canvas.scrollX).toBe(-10);
		expect(canvas.scrollY).toBe(-20);
		
		im.keyUp(32);
		im.mouseMove(20, 30, 20, 30);
		
		expect(canvas.scrollX).toBe(-10);
		expect(canvas.scrollY).toBe(-20);
		
		$('#toolbox').remove();
		$('#canvas').remove();
	});
});
