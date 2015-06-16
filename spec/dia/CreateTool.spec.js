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
	
	it('can be extended', function(){
		var originalDownArgs,
			originalMoveArgs,
			originalUpArgs,
			extendedDownArgs,
			extendedMoveArgs,
			extendedUpArgs;
		
		var originalType = new dia.ElementType({
			id: 'originalType'
		});
		var extendedType = new dia.ElementType({
			id: 'extendedType'
		});
		
		var original = new dia.CreateTool({
			type: originalType,
			mouseDown: function(){
				originalDownArgs = Array.prototype.slice.call(arguments, 0);
			},
			mouseMove: function(){
				originalMoveArgs = Array.prototype.slice.call(arguments, 0)
			},
			mouseUp: function(){
				originalUpArgs = Array.prototype.slice.call(arguments, 0)
			}
		});
		
		var extended = original.extend({
			type: extendedType,
			mouseDown: function(){
				extendedDownArgs = Array.prototype.slice.call(arguments, 0);
			},
			mouseMove: function(){
				extendedMoveArgs = Array.prototype.slice.call(arguments, 0)
			},
			mouseUp: function(){
				extendedUpArgs = Array.prototype.slice.call(arguments, 0)
			}
		});
		
		var sheet = new dia.Sheet();
		
		extended.mouseDown(sheet, 0, 1);
		extended.mouseMove(sheet, 1, 2);
		extended.mouseUp(sheet, 2, 3);
		
		expect(extended.type).toBe(extendedType);
		expect(extended.id).toBe('create-extendedType');
		
		expect(originalDownArgs).toEqual([sheet, 0, 1]);
		expect(extendedDownArgs).toEqual([sheet, 0, 1]);
		
		expect(originalMoveArgs).toEqual([sheet, 1, 2]);
		expect(extendedMoveArgs).toEqual([sheet, 1, 2]);
		
		expect(originalUpArgs).toEqual([sheet, 2, 3]);
		expect(extendedUpArgs).toEqual([sheet, 2, 3]);
	});
});
