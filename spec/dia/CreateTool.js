describe('an create tool', function(){
	it('is initialized correctly', function(){
		var type = new dia.ElementType({
			id: 'myid'
		});
		var creator = new dia.CreateTool({
			type: type
		});
		
		expect(creator.currentElement).toBe(null);
		expect(creator.id).toBe('create-myid');
	});
	
	it('calls the functions correctly', function(){
		var downArgs, moveArgs, upArgs;
		
		var sheet = new dia.Sheet();
		var creator = new dia.CreateTool({
			mouseDown: function(){
				downArgs = Array.prototype.slice.call(arguments, 0);
			},
			mouseMove: function(){
				moveArgs = Array.prototype.slice.call(arguments, 0);
			},
			mouseUp: function(){
				upArgs = Array.prototype.slice.call(arguments, 0);
			}
		});
		
		creator.mouseDown(sheet, 0, 1);
		creator.mouseMove(sheet, 1, 2);
		creator.mouseUp(sheet, 2, 3);
		
		expect(downArgs).toEqual([sheet, 0, 1]);
		expect(moveArgs).toEqual([sheet, 1, 2]);
		expect(upArgs).toEqual([sheet, 2, 3]);
	});
	
	it('resets the current element on mouse up', function(){
		var element = new dia.Element(new dia.ElementType());
		
		var creator = new dia.CreateTool({
			mouseDown: function(){
				this.currentElement = element;
			}
		});
		var sheet = new dia.Sheet();
		
		creator.mouseDown(sheet, 0, 0);
		expect(creator.currentElement).toBe(element);
		
		creator.mouseUp(sheet, 0, 0);
		expect(creator.currentElement).toBe(null);
	});
});
