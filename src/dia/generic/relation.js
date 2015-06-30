dia.generic = dia.generic || {};

dia.generic.RELATION = new dia.ElementType({
	id: 'generic.relation',
	label: 'Generic relation',
	anchorable: false
});
dia.generic.RELATION.addProperty(new dia.Property({
	id: 'from',
	type: dia.DataType.ANCHOR,
	private: true,
	onChange: function(element, fromValue, toValue){
		if(fromValue && fromValue.element !== toValue.element){
			element.installDependencies();
		}
	}
}));
dia.generic.RELATION.addProperty(new dia.Property({
	id: 'to',
	type: dia.DataType.ANCHOR,
	private: true,
	onChange: function(element, fromValue, toValue){
		if(fromValue && fromValue.element !== toValue.element){
			element.installDependencies();
		}
	}
}));
dia.generic.RELATION.addProperty(new dia.Property({
	id: 'points',
	type: dia.DataType.POINT_ARRAY,
	private: true,
	default: []
}));

dia.generic.RELATION.addElementDependencies(function(element){
	return [
		element.getProperty('from').element,
	   	element.getProperty('to').element
	];
});

dia.generic.RELATION.setRepresentationFactory(function(element, repr){
	repr.fromPosition = function(){
		var from = element.getProperty('from');
		var fromRepr = element.sheet.getElement(from.element).getRepresentation();

		return {
			x: fromRepr.area.getX() + from.x,
			y: fromRepr.area.getY() + from.y,
			angle: from.angle
		};
	};

	repr.toPosition = function(){
		var to = element.getProperty('to');
		var toRepr = element.sheet.getElement(to.element).getRepresentation();

		return {
			x: toRepr.area.getX() + to.x,
			y: toRepr.area.getY() + to.y,
			angle: to.angle
		};
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
		points: repr.getPoints
	});

	var handle = new dia.BrokenLineDragHandle(element, repr.area, 'points');
	repr.addHandle(handle);

	var fromHandle = new dia.MoveAnchorDragHandle(element, repr.areaFrom, 'from');
	repr.addHandle(fromHandle);

	var toHandle = new dia.MoveAnchorDragHandle(element, repr.areaTo, 'to');
	repr.addHandle(toHandle);

	repr.moveHandle = new dia.MoveRelationDragHandle(element, repr.area, 'points');
});

dia.generic.RELATION.creatorTool = new dia.CreateTool({
	type: dia.generic.RELATION,
	mouseDown: function(sheet, x, y){
		this.from = sheet.findElementContaining(x, y);
		this.fromPosition = { x: x, y: y };
	},
	mouseMove: function(sheet, x, y){
		if(this.from){
			this.to = sheet.findElementContaining(x, y);
			this.toPosition = { x: x, y: y };
		}
	},
	mouseUp: function(sheet, x, y){
		if(this.to && this.from && this.to !== this.from){
			var fromArea = this.from.getRepresentation().area;
			var toArea = this.to.getRepresentation().area;

			var fromRelativePosition = fromArea.getRelativePositionFromAbsolute(
				this.fromPosition.x,
				this.fromPosition.y
			);
			var toRelativePosition = toArea.getRelativePositionFromAbsolute(
				this.toPosition.x,
				this.toPosition.y
			);

			var fromAnchor = {
				element: this.from.id,
				x: fromRelativePosition.x,
				y: fromRelativePosition.y,
				angle: 0
			};
			var toAnchor = {
				element: this.to.id,
				x: toRelativePosition.x,
				y: toRelativePosition.y,
				angle: 0
			};

			// Let's bind those anchors
			fromArea.bindAnchorToBounds(fromAnchor);
			toArea.bindAnchorToBounds(toAnchor);

			var element = this.type.create({
				from: fromAnchor,
				to: toAnchor
			});

			sheet.addElement(element);

			this.dispatch('elementcreated');
		}

		this.from = null;
	}
});
