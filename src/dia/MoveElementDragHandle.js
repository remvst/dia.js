dia.MoveElementDragHandle = function(element, area){
	dia.DragHandle.call(this, element, area);
	
	if(!this.element.type.hasPropertyId('x') || !this.element.type.hasPropertyId('y')){
		throw new Error('Cannot bind a MoveElementDragHandle to an element that has no x or y');
	}
	
	this.start = null;
	
	this.currentSnap = null;
};

extend(dia.MoveElementDragHandle, dia.DragHandle);

dia.MoveElementDragHandle.prototype.dragStart = function(x, y){
	this.currentSnap = null;
	
	this.lastPosition = {
		x: this.element.getProperty('x'),
		y: this.element.getProperty('y')
	};
};

dia.MoveElementDragHandle.prototype.dragMove = function(dx, dy){
	var expectedX = this.lastPosition.x + dx;
	var expectedY = this.lastPosition.y + dy;

	this.element.setProperty('x', expectedX);
	this.element.setProperty('y', expectedY);
	
	// Snap to guides
	var repr = this.element.getRepresentation();
	
	this.currentSnap = null;
	for(var i = 0 ; !this.currentSnap && repr && i < repr.guides.length ; i++){
		this.trySnap(repr.guides[i]);
	}
	
	// Snapping to grid
	var gs = this.element.sheet.gridSize;
	if(this.element.getProperty('x') === expectedX){
		this.element.setProperty('x', Math.round((expectedX) / gs) * gs);
	}
	if(this.element.getProperty('y') === expectedY){
		this.element.setProperty('y', Math.round((expectedY) / gs) * gs);
	}

	this.lastPosition = {
		x: expectedX,
		y: expectedY
	};
};

dia.MoveElementDragHandle.prototype.dragDrop = function(){
	this.currentSnap = null;
};

dia.MoveElementDragHandle.prototype.render = function(c){
	dia.DragHandle.prototype.render.call(this, c);
	
	if(this.currentSnap){
		this.currentSnap.elementGuide.render(c, this.currentSnap.otherGuide);
	}
};

dia.MoveElementDragHandle.prototype.trySnap = function(guide){
	this.currentSnap = null;
	
	var handle = this;
	this.element.sheet.elements.forEach(function(element){
		if(handle.element === element || handle.currentSnap){
			// No need to snap with self
			return;
		}
		
		var repr = element.getRepresentation();
		
		for(var i = 0 ; repr && i < repr.guides.length ; i++){
			if(guide.shouldSnap(repr.guides[i], 10)){
			  	guide.snap(repr.guides[i]);
				handle.currentSnap = {
					elementGuide: guide,
					otherGuide: repr.guides[i]
				};
				
				break; // Let's snap to only one guide
			}
		}
	});
};
