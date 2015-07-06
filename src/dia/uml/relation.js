dia.uml = dia.uml || {};

dia.uml.RELATION = dia.generic.RELATION.clone({
	id: 'uml.composition',
	label: 'UML relation',
	layer: 0
});

dia.uml.RELATION.addProperty(new dia.Property({
	id: 'type',
	label: 'Relation type',
	type: new dia.EnumerationDataType([
		'relation',
		'composition',
		'aggregation',
		'implementation',
		'inheritance'
	]),
	default: 'relation'
}));

dia.uml.RELATION.addProperty(new dia.Property({
	id: 'cardinalityFrom',
	label: 'Cardinality from',
	type: dia.DataType.STRING,
	default: ''
}));

dia.uml.RELATION.addProperty(new dia.Property({
	id: 'cardinalityTo',
	label: 'Cardinality to',
	type: dia.DataType.STRING,
	default: ''
}));

dia.uml.RELATION.addProperty(new dia.Property({
	id: 'label',
	label: 'Relation label',
	type: dia.DataType.STRING,
	default: ''
}));

dia.uml.RELATION.extendRepresentationFactory(function(element, repr){
	repr.getPoints = function(){
		return [repr.fromPosition()].concat(element.getProperty('points')).concat([repr.toPosition()]);
	};

	repr.mainHandle.breakOffset = 0;

	repr.addRenderable(new dia.Renderable(function(c){
		var points = repr.getPoints();

		var p1 = points[points.length - 1];
		var p2 = points[points.length - 2];
		var p3 = points[1];
		var p4 = points[0];

		var angleTo = Math.atan2(p2.y - p1.y, p2.x - p1.x);
		var angleFrom = Math.atan2(p4.y - p3.y, p4.x - p3.x);

		c.save();
		c.translate(p1.x, p1.y);
		c.rotate(angleTo);

		switch(element.getProperty('type')){
			case 'composition':
				c.fillStyle = '#000';
				c.beginPath();
				c.moveTo(0, 0);
				c.lineTo(10, 5);
				c.lineTo(20, 0);
				c.lineTo(10, -5);
				c.fill();
			break;
			case 'aggregation':
				c.fillStyle = '#ffffff';
				c.strokeStyle = '#000';
				c.lineWidth = 1;
				c.beginPath();
				c.moveTo(0, 0);
				c.lineTo(10, 5);
				c.lineTo(20, 0);
				c.lineTo(10, -5);
				c.closePath();
				c.fill();
				c.stroke();
			break;
			case 'inheritance':
			case 'implementation':
				c.fillStyle = '#ffffff';
				c.strokeStyle = '#000';
				c.lineWidth = 1;
				c.beginPath();
				c.moveTo(0, 0);
				c.lineTo(10, 5);
				c.lineTo(10, -5);
				c.closePath();
				c.fill();
				c.stroke();
			break;
		}

		c.restore();

		var fromLabelAngle = angleFrom + Math.PI / 2;
		var fromLabelPosition = {
			x: p4.x - Math.cos(angleFrom) * 10 + Math.cos(fromLabelAngle) * 10,
			y: p4.y - Math.sin(angleFrom) * 10 +  Math.sin(fromLabelAngle) * 10
		};

		c.fillStyle = '#000';
		c.font = '10pt Arial';
		c.textAlign = 'center';
		c.textBaseline = 'middle';
		c.fillText(element.getProperty('cardinalityFrom'), fromLabelPosition.x, fromLabelPosition.y);

		var toLabelAngle = angleTo + Math.PI / 2;
		var toLabelPosition = {
			x: p1.x + Math.cos(angleTo) * 10 + Math.cos(toLabelAngle) * 10,
			y: p1.y + Math.sin(angleTo) * 10 +  Math.sin(toLabelAngle) * 10
		};

		c.fillStyle = '#000';
		c.font = '10pt Arial';
		c.textAlign = 'center';
		c.textBaseline = 'middle';
		c.fillText(element.getProperty('cardinalityTo'), toLabelPosition.x, toLabelPosition.y);

		var middlePosition = repr.area.getPositionAtRatio(.5);
		var labelPosition = {
			x: middlePosition.x + Math.cos(middlePosition.angle + Math.PI / 2) * 10,
			y: middlePosition.y + Math.sin(middlePosition.angle + Math.PI / 2) * 10
		}
		c.fillText(element.getProperty('label'), labelPosition.x, labelPosition.y);
	}));

	repr.getLineDash = function(){
		if(element.getProperty('type') === 'implementation'){
			return [10, 10];
		}else{
			return [];
		}
	};
});

dia.uml.RELATION.addTool(dia.generic.RELATION.getTool('generic.relation.create').extend({
	id: 'uml.relation.create-relation',
	type: dia.uml.RELATION,
	label: 'UML relation'
}));

dia.uml.RELATION.addTool(dia.generic.RELATION.getTool('generic.relation.create').extend({
	id: 'uml.relation.create-extend',
	type: dia.uml.RELATION,
	label: 'Inheritance',
	mouseDown: function(){
		if(this.element){
			this.element.setProperty('type', 'inheritance');
		}
	}
}));

dia.uml.RELATION.addTool(dia.generic.RELATION.getTool('generic.relation.create').extend({
	id: 'uml.relation.create-composition',
	type: dia.uml.RELATION,
	label: 'Composition',
	mouseDown: function(){
		if(this.element){
			this.element.setProperty('type', 'composition');
		}
	}
}));

dia.uml.RELATION.addTool(dia.generic.RELATION.getTool('generic.relation.create').extend({
	id: 'uml.relation.create-aggregation',
	type: dia.uml.RELATION,
	label: 'Aggregation',
	mouseDown: function(){
		if(this.element){
			this.element.setProperty('type', 'aggregation');
		}
	}
}));

dia.uml.RELATION.addTool(dia.generic.RELATION.getTool('generic.relation.create').extend({
	id: 'uml.relation.create-implementation',
	type: dia.uml.RELATION,
	label: 'Implementation',
	mouseDown: function(){
		if(this.element){
			this.element.setProperty('type', 'implementation');
		}
	}
}));
