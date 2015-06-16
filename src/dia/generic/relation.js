dia.generic = dia.generic || {};

dia.generic.RELATION = new dia.ElementType({
	id: 'generic.relation',
	label: 'Relation'
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
	type: dia.DataType.ANY,
	private: true,
	default: []
}));

dia.generic.RELATION.setRepresentationFactory(function(element, repr){
	var areaFrom = new dia.RectangleArea({
		x: function(){ return fromPosition().x - 5 },
		y: function(){ return fromPosition().y - 5 },
		width: function(){ return 10; },
		height: function(){ return 10; }
	});

	var areaTo = new dia.RectangleArea({
		x: function(){ return toPosition().x - 5 },
		y: function(){ return toPosition().y - 5 },
		width: function(){ return 10; },
		height: function(){ return 10; }
	});

	var fromPosition = function(){
		var from = element.getProperty('from');
		var fromRepr = element.sheet.getElement(from.element).getRepresentation();

		return {
			x: fromRepr.area.getX() + fromRepr.area.getWidth() * from.x,
			y: fromRepr.area.getY() + fromRepr.area.getHeight() * from.y
		};
	};

	var toPosition = function(){
		var to = element.getProperty('to');
		var toRepr = element.sheet.getElement(to.element).getRepresentation();

		return {
			x: toRepr.area.getX() + toRepr.area.getWidth() * to.x,
			y: toRepr.area.getY() + toRepr.area.getHeight() * to.y
		};
	};

	repr.addRenderable(new dia.Renderable(function(c){
		var fromPos = fromPosition();
		var toPos = toPosition();

		c.strokeStyle = '#000';
		c.fillStyle = '#000';

		c.beginPath();
		c.moveTo(fromPos.x, fromPos.y);

		var points = element.getProperty('points');
		for(var i = 0 ; i < points.length ; i++){
			c.lineTo(points[i].x, points[i].y);
			c.fillRect(points[i].x - 2, points[i].y - 2, 4, 4);
		}

		c.lineTo(toPos.x, toPos.y);
		c.stroke();
	}));

	repr.area = new dia.BrokenLineArea({
		points: function(){
			var from = fromPosition();
			var to = toPosition();

			return [from].concat(element.getProperty('points')).concat([to]);
		}
	});

	var handle = new dia.BrokenLineDragHandle(element, repr.area, 'points');
	repr.addHandle(handle);

	var fromHandle = new dia.MoveAnchorDragHandle(element, areaFrom, 'from');
	repr.addHandle(fromHandle);

	var toHandle = new dia.MoveAnchorDragHandle(element, areaTo, 'to');
	repr.addHandle(toHandle);
});

dia.generic.RELATION.creatorTool = new dia.CreateTool({
	type: dia.generic.RELATION,
	mouseDown: function(sheet, x, y){
		this.from = sheet.findElementContaining(x, y);
	},
	mouseUp: function(sheet, x, y){
		var to = sheet.findElementContaining(x, y);
		if(to && this.from && to !== this.from){
			var fromArea = this.from.getRepresentation().area;
			var toArea = to.getRepresentation().area;

			var fromPosition = {
				x: fromArea.getX() + fromArea.getWidth() / 2,
				y: fromArea.getY() + fromArea.getHeight() / 2,
			};
			var toPosition = {
				x: toArea.getX() + toArea.getWidth() / 2,
				y: toArea.getY() + toArea.getHeight() / 2,
			};

			var angle = Math.atan2(toPosition.y - fromPosition.y, toPosition.x - fromPosition.x);

			var fromAnchor = {
				element: this.from.id,
				x: Math.cos(angle) / 2 + .5,
				y: Math.sin(angle) / 2 + .5
			};
			var toAnchor = {
				element: to.id,
				x: -Math.cos(angle) / 2 + .5,
				y: -Math.sin(angle) / 2 + .5
			};

			dia.adjustAnchorRatios(fromAnchor, this.from);
			dia.adjustAnchorRatios(toAnchor, to);

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
