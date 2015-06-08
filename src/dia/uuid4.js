// https://gist.github.com/kaizhu256/2853704
dia.uuid4 = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(cc){
		var rr = Math.random() * 16 | 0; 
		return (cc === 'x' ? rr : (rr & 0x3 | 0x8)).toString(16);
	});
};
