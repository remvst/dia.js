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
		app.start();
		
		expect(app.toolbox.toolList.indexOf(type1.creatorTool)).not.toEqual(-1);
		
		dia.uuid4 = uuid4;
		
		$('#toolbox').remove();
		$('#canvas').remove();
	});
});
