dia.Area = function(){
	this.type = null;
};

dia.Area.prototype.contains = function(x, y){
	return false;	
};

dia.Area.prototype.intersectsWith = function(otherArea){
	return dia.Area.intersect(this, otherArea);
};

dia.Area.prototype.render = function(c){
	
};

dia.Area.prototype.surface = function(){
	return 0;
};

dia.Area.prototype.bindAnchorToBounds = function(anchor){
	
};

dia.Area.prototype.getRelativeCenter = function(){
	return {
		x: 0,
		y: 0
	};
};

dia.Area.prototype.getAbsolutePositionFromRelative = function(x, y){
	return null;
};

dia.Area.intersectionMap = {};

dia.Area.defineIntersection = function(type1, type2, func){
	dia.Area.intersectionMap[type1 + '-' + type2] = func;
	
	if(type1 !== type2){
		// Let's add it for both ways
		dia.Area.intersectionMap[type2 + '-' + type1] = function(a, b){
			return func(b, a);
		};
	}
};

dia.Area.intersect = function(area1, area2){
	var func = dia.Area.intersectionMap[area1.type + '-' + area2.type];
	if(!func){
		return false;
	}else{
		return func(area1, area2);
	}
};
