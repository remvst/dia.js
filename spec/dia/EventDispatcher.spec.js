describe('an event dispatcher', function(){
	it('is initialized properly', function(){
		var dispatcher = new dia.EventDispatcher();
		
		expect(dispatcher.listeners).toEqual({});
	});
	
	it('can listen to events', function(){
		var dispatcher = new dia.EventDispatcher();
		
		var called = false,
			data,
			scope;
		
		dispatcher.listen('foo', function(p){
			called = true;
			data = p;
			scope = this;
		});
		
		dispatcher.dispatch('foo', 'yoyo');
		
		expect(called).toBe(true);
		expect(data).toEqual('yoyo');
		expect(scope).toBe(dispatcher);
	});
	
	it('can stop listening to events', function(){
		var dispatcher = new dia.EventDispatcher();
		
		var called = false,
			callback = function(p){
				called = true;
			};
		
		dispatcher.listen('foo', callback);
		dispatcher.ignore('foo', callback);
		dispatcher.dispatch('foo');
		
		expect(called).toBe(false);
	});
});