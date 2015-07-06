dia.generic = dia.generic || {};

dia.generic.RELATION = new dia.ElementType({
	id: 'generic.relation',
	label: 'Generic relation',
	anchorable: false
});
dia.generic.RELATION.addProperty(new dia.Property({
	id: 'from',
	type: dia.DataType.ANCHOR,
	private: true
}));
dia.generic.RELATION.addProperty(new dia.Property({
	id: 'to',
	type: dia.DataType.ANCHOR,
	private: true
}));
dia.generic.RELATION.addProperty(new dia.Property({
	id: 'points',
	type: dia.DataType.POINT_ARRAY,
	private: true,
	default: []
}));

dia.generic.RELATION.setRepresentationFactory(function(element, repr){
	repr.fromPosition = function(){
		var from = element.getProperty('from');
		var fromRepr = element.sheet.getElement(from.element).getRepresentation();

		var position = fromRepr.area.getAbsolutePositionFromRelative(from.x, from.y);
		position.angle = from.angle;

		return position;
	};

	repr.toPosition = function(){
		var to = element.getProperty('to');
		var toRepr = element.sheet.getElement(to.element).getRepresentation();

		var position = toRepr.area.getAbsolutePositionFromRelative(to.x, to.y);
		position.angle = to.angle;

		return position;
	};

	repr.areaFrom = new dia.RectangleArea({
		x: function(){ return repr.fromPosition().x - 5 },
		y: function(){ return repr.fromPosition().y - 5 },
		width: function(){ return 10; },
		height: function(){ return 10; }
	});

	repr.areaTo = new dia.RectangleArea({
		x: function(){ return repr.toPosition().x - 5 },
		y: function(){ return repr.toPosition().y - 5 },
		width: function(){ return 10; },
		height: function(){ return 10; }
	});

	repr.getPoints = function(){
		var from = repr.fromPosition();
		var to = repr.toPosition();

		var fromExtension = {
			x: from.x + Math.cos(from.angle) * repr.extension,
			y: from.y + Math.sin(from.angle) * repr.extension
		};
		var toExtension = {
			x: to.x + Math.cos(to.angle) * repr.extension,
			y: to.y + Math.sin(to.angle) * repr.extension
		};

		if(repr.extension > 0){
			return [from, fromExtension].concat(element.getProperty('points')).concat([toExtension, to]);
		}else{
			return [from].concat(element.getProperty('points')).concat([to]);
		}
	};

	repr.addRenderable(new dia.Renderable(function(c){
		var fromPos = repr.fromPosition();
		var toPos = repr.toPosition();

		c.strokeStyle = '#000';
		c.fillStyle = '#000';

		var points = repr.getPoints();

		c.setLineDash(repr.getLineDash());

		c.beginPath();
		c.moveTo(points[0].x, points[0].y);
		for(var i = 1 ; i < points.length ; i++){
			c.lineTo(points[i].x, points[i].y);
		}
		c.stroke();

		for(var i = 1 ; i < points.length - 1 ; i++){
			c.fillRect(points[i].x - 2, points[i].y - 2, 4, 4);
		}
	}));

	repr.extension = 10;

	repr.area = new dia.BrokenLineArea({
		points: function(){
			// No direct call, in case a subclass needs to override getPoints()
			return repr.getPoints();
		}
	});

	repr.mainHandle = new dia.BrokenLineDragHandle(element, repr.area, 'points');
	repr.mainHandle.breakOffset = -1;
	repr.addHandle(repr.mainHandle);

	repr.fromHandle = new dia.MoveAnchorDragHandle(element, repr.areaFrom, 'from');
	repr.addHandle(repr.fromHandle);

	repr.toHandle = new dia.MoveAnchorDragHandle(element, repr.areaTo, 'to');
	repr.addHandle(repr.toHandle);

	repr.moveHandle = new dia.MoveRelationDragHandle(element, repr.area, 'points');

	repr.getLineDash = function(){
		return [];
	};
});

dia.generic.RELATION.creatorTool = new dia.CreateTool({
	type: dia.generic.RELATION,
	mouseDown: function(sheet, x, y){
		this.from = sheet.findElementContaining(x, y, function(element){
			return element.type.isAnchorable();
		});

		if(this.from){
			var fromArea = this.from.getRepresentation().area;
			var fromRelativePosition = fromArea.getRelativePositionFromAbsolute(x, y);

			this.fromAnchor = {
				element: this.from.id,
				x: fromRelativePosition.x,
				y: fromRelativePosition.y
			};
			this.toAnchor = {
				element: this.from.id,
				x: fromRelativePosition.x,
				y: fromRelativePosition.y
			};

			fromArea.bindAnchorToBounds(this.fromAnchor);
			fromArea.bindAnchorToBounds(this.toAnchor);

			this.element = this.type.create({
				from: this.fromAnchor,
				to: this.toAnchor
			});
			sheet.addElement(this.element);
		}
	},
	mouseMove: function(sheet, x, y){
		if(!this.from) return;

		this.to = sheet.findElementContaining(x, y, function(element){
			return element.type.isAnchorable();
		});

		if(this.to){
			var toArea = this.to.getRepresentation().area;
			var toRelativePosition = toArea.getRelativePositionFromAbsolute(x, y);

			this.toAnchor = {
				element: this.to.id,
				x: toRelativePosition.x,
				y: toRelativePosition.y,
				angle: 0
			};
			toArea.bindAnchorToBounds(this.toAnchor);
		}else{
			var fromArea = this.from.getRepresentation().area;
			var fromRelativePosition = fromArea.getRelativePositionFromAbsolute(x, y);

			this.toAnchor = {
				element: this.from.id,
				x: fromRelativePosition.x,
				y: fromRelativePosition.y,
				angle: this.toAnchor.angle
			};
		}

		this.element.setProperty('to', this.toAnchor);
	},
	mouseUp: function(sheet, x, y){
		if(this.element && this.from === this.to){
			this.element.remove();
		}

		this.element = null;
		this.from = null;
		this.to = null;
		this.dispatch('elementcreated');
	}
});

dia.generic.RELATION.addFunction(new dia.ElementTypeFunction({
	id: 'invert',
	label: 'Invert relation',
	apply: function(element){
		var fromProp = element.getProperty('from');
		var toProp = element.getProperty('to');

		element.setProperty('from', toProp);
		element.setProperty('to', fromProp);
		element.setProperty('points', element.getProperty('points').slice(0).reverse())
	}
}));

dia.generic.RELATION.addFunction(new dia.ElementTypeFunction({
	id: 'removepoints',
	label: 'Remove all points',
	apply: function(element){
		element.setProperty('points', []);
	}
}));

dia.generic.RELATION.addFunction(new dia.ElementTypeFunction({
	id: 'reanchor',
	label: 'Readapt anchors',
	apply: function(element){
		var anchorFrom = element.getProperty('from');
		var anchorTo = element.getProperty('to');

		var fromElementId = element.getProperty('from').element;
		var toElementId = element.getProperty('to').element;

		var fromElement = element.sheet.getElement(fromElementId);
		var toElement = element.sheet.getElement(toElementId);

		var fromElementRepr = fromElement.getRepresentation();
		var toElementRepr = toElement.getRepresentation();

		var newAnchorFrom = {
			element: anchorFrom.element,
			x: anchorFrom.x,
			y: anchorFrom.y,
			angle: anchorFrom.angle
		};
		var newAnchorTo = {
			element: anchorTo.element,
			x: anchorTo.x,
			y: anchorTo.y,
			angle: anchorTo.angle
		};

		fromElementRepr.area.bindAnchorToBounds(newAnchorFrom);
		toElementRepr.area.bindAnchorToBounds(newAnchorTo);

		element.setProperty('from', newAnchorFrom);
		element.setProperty('to', newAnchorTo);
	}
}));

dia.generic.RELATION.addSetupFunction(function(element){
	var onDependencyRemoved = function(e){
		element.remove();
		ignore();
	}.bind(element);

	var onAnchoredElementChange = function(){
		element.execute('reanchor');
	}.bind(element);

	var currentFrom = null,
		currentTo = null;

	var listen = function(){
		var newFrom = findElement('from');
		var newTo = findElement('to');

		if(newFrom !== currentFrom || newTo !== currentTo){
			ignore();

			if(newFrom){
				newFrom.listen('removedfromsheet', onDependencyRemoved);
				newFrom.listen('propertychange', onAnchoredElementChange);
			}
			if(newTo){
				newTo.listen('removedfromsheet', onDependencyRemoved);
				newTo.listen('propertychange', onAnchoredElementChange);
			}

			currentFrom = newFrom;
			currentTo = newTo;
		}
	};

	var findElement = function(property){
		var anchor = element.getProperty(property);
		if(anchor && anchor.element && element.sheet){
			return element.sheet.getElement(anchor.element);
		}
	};

	var ignore = function(){
		if(currentFrom){
			currentFrom.ignore('removedfromsheet', onDependencyRemoved);
			currentFrom.ignore('propertychange', onAnchoredElementChange);
		}
		if(currentTo){
			currentTo.ignore('removedfromsheet', onDependencyRemoved);
			currentTo.ignore('propertychange', onAnchoredElementChange);
		}

		currentFrom = null;
		currentTo = null;
	};

	element.listen('propertychange', function(e){
		if(e.property.id === 'to' || e.property.id === 'from'){
			listen();
		}
	});

	element.listen('addedtosheet', listen);
	element.listen('removedfromsheet', ignore);
});
