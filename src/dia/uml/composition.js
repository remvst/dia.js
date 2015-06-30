dia.uml = dia.uml || {};

dia.uml.COMPOSITION = dia.generic.RELATION.clone({
	id: 'uml.composition',
	label: 'Composition relation'
});

dia.uml.COMPOSITION.extendRepresentationFactory(function(element, repr){
	repr.getPoints = function(){
		return [repr.fromPosition()].concat(element.getProperty('points')).concat([repr.toPosition()]);
	};

	repr.mainHandle.breakOffset = 0;

	repr.addRenderable(new dia.Renderable(function(c){
		var points = repr.getPoints();

		var p1 = points[points.length - 1];
		var p2 = points[points.length - 2];

		var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

		c.translate(p1.x, p1.y);
		c.rotate(angle);

		c.fillStyle = '#000';
		c.beginPath();
		c.moveTo(0, 0);
		c.lineTo(20, 10);
		c.lineTo(40, 0);
		c.lineTo(20, -10);
		c.fill();
	}));
});
