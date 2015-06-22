describe('an app', function(){
	it('is initialized properly', function(){
		var app = new dia.App();
		
		expect(app.toolbox).not.toBe(null);
		expect(app.sheet).toBe(null);
	});
	
	it('can start', function(){
		$('<div></div>').attr('id', 'toolbox').appendTo('body');
		$('<canvas></canvas>').attr('id', 'canvas').appendTo('body');
		
		var uuid4 = dia.uuid4;
		
		dia.uuid4 = function(){
			return 'uuid';
		};
		
		var type1 = new dia.ElementType({
			id: 'type1234'
		});
		type1.creatorTool = new dia.CreateTool();
		
		var app = new dia.App();
		app.newSheet();
		
		expect(app.toolbox.toolList.indexOf(type1.creatorTool)).not.toEqual(-1);
		expect(app.sheet).not.toBe(null);
		
		dia.uuid4 = uuid4;
		
		$('#toolbox').remove();
		$('#canvas').remove();
	});
	
	it('can open a new sheet', function(){
		var app = new dia.App();
		var sheet = new dia.Sheet();
		
		var event;
		app.listen('newsheet', function(e){
			event = e;
		});
		
		app.openSheet(sheet);
		
		expect(app.sheet).toBe(sheet);
		expect(event.sheet).toBe(sheet);
	});
});
