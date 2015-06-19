describe('a GUI', function(){
	beforeEach(function(){
		$('<div></div>').attr('id', 'toolbox').appendTo('body');
		$('<canvas></canvas>').attr('id', 'canvas').appendTo('body');
	});
	
	afterEach(function(){
		$('#toolbox').remove();
		$('#canvas').remove();
	});
	
	it('is initialized properly', function(){
		var app = new dia.App();
		var gui = new dia.GUI(app);
		
		expect(gui.app).toBe(app);
	});
	
	it('watches already existing elements', function(){
		var app = new dia.App();
		app.sheet = new dia.Sheet();
		
		var type = new dia.ElementType();
		type.addProperty(new dia.Property({
			id: 'prop'
		}));
		
		var element = type.emptyElement();
		app.sheet.addElement(element);
		
		var gui = new dia.GUI(app);
		var notified = false;
		gui.renderSheet = function(){
			notified = true;
		};
		
		element.setProperty('prop', 123);
		
		expect(notified).toBe(true);
	});
	
	it('cannot be initialized without an app', function(){
		expect(function(){
			new dia.GUI();
		}).toThrow();
	});
	
	it('renders the toolbox', function(){
		var app = new dia.App();
		var gui = new dia.GUI(app);
		
		var tool1 = new dia.Tool();
		tool1.id = 'mytool1';
		app.toolbox.addTool(tool1);
		
		var tool2 = new dia.Tool();
		tool2.id = 'mytool2';
		app.toolbox.addTool(tool2);
		
		gui.renderToolbox();
		
		expect($('#toolbox button').size()).toEqual(2);
	});
	
	it('cannot setup its interaction manager twice', function(){
		var app = new dia.App();
		var gui = new dia.GUI(app);
		
		gui.setupInteractionManager();
		
		var im = gui.interactionManager;
		
		gui.setupInteractionManager();
		
		expect(im).toBe(gui.interactionManager);
	});
});
