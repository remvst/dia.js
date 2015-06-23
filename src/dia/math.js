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

dia.snap = function(x, gridSize){
	gridSize = Math.abs(gridSize) || 1;
	return Math.round(x / gridSize) * gridSize;
};
