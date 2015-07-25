describe('a clipboard', function(){
	it('has a default constructor', function(){
		var clip = new dia.Clipboard();

		expect(clip.elements.length).toBe(0);
	});

	it('copies elements locally', function(){
		var type = new dia.ElementType();
		var elements = [
			type.emptyElement(),
			type.emptyElement()
		];

		var clip = new dia.Clipboard(elements);
		expect(clip.elements.length).toBe(2);
		expect(clip.elements).not.toEqual(elements);
	});

	it('can paste the elements', function(){
		var type = new dia.ElementType();
		var elements = [
			type.emptyElement(),
			type.emptyElement()
		];

		var clip = new dia.Clipboard(elements);

		var pastable = clip.getPastableElements();
		expect(pastable).not.toEqual(elements);
		expect(pastable).not.toEqual(clip.elements);
	});
});
