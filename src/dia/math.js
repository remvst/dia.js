dia.distance = function(x1, y1, x2, y2){
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
};

dia.between = function(a, b, c){
	return a <= b && b <= c;
};

dia.limit = function(x, min, max){
	if(x < min){
		return min;
	}else if(x > max){
		return max;
	}else{
		return x;
	}
};

dia.adjustAnchorRatios = function(anchor){
	var factorX = anchor.x - .5;
	var factorY = anchor.y - .5;
	
	if(Math.abs(factorX) > Math.abs(factorY)){
		anchor.x = factorX > 0 ? 1 : 0;
	}else{
		anchor.y = factorY > 0 ? 1 : 0;
	}
};
