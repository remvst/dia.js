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

	it('can remove listeners while running event', function(){
		var dispatcher = new dia.EventDispatcher();

		var called1 = false;
		var listener1 = function(){
			dispatcher.ignore('foo', listener1);
			called1 = true;
		};

		var called2 = false;
		var listener2 = function(){
			called2 = true;
		}

		var called3 = false;
		var listener3 = function(){
			called3 = true;
		}

		dispatcher.listen('foo', listener1);
		dispatcher.listen('foo', listener2);
		dispatcher.listen('foo', listener3);

		dispatcher.dispatch('foo');

		expect(called1).toBe(true);
		expect(called2).toBe(true);
		expect(called3).toBe(true);
	});
});
