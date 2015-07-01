describe('an element type function', function(){
	it('is instantiated correctly', function(){
		var f = new dia.ElementTypeFunction({
			id: 'myid',
			label: 'mylabel',
			apply: new Function()
		});

		expect(f.id).toBe('myid');
		expect(f.label).toBe('mylabel');
	});

	it('can be applied', function(){
		var param;
		var f = new dia.ElementTypeFunction({
			apply: function(p){
				param = p;
			}
		});

		var element = new dia.ElementType().emptyElement();
		f.apply(element);
		
		expect(param).toBe(element);
	});
});
