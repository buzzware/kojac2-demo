import { module, test } from 'qunit';
import Kojac from 'kojac/utils/Kojac';
import KojacModel from 'kojac/utils/KojacModel';
import Immutable from 'seamless-immutable';
import Ember from 'ember';

module('Unit | Utility | Kojac');

// Replace this with your real tests.
test('it works', function(assert) {
  let kojac = new Kojac();
	kojac.bang();
  assert.ok(kojac);
});

test('immutable',function(assert) {
	var obj = Immutable({foo: "bar"});
	assert.throws(
		function() {
			obj.foo = 'me';
		},
		TypeError,
		"can't mutate"
	);
	assert.strictEqual(obj.foo,'bar','should not change');
});

test('immutable via Ember',function(assert) {
	var obj = Immutable({foo: "bar"});
	assert.throws(
		function() {
			Ember.set(obj,'foo','me');
		},
		TypeError,
		"can't mutate"
	);
	assert.strictEqual(obj.foo,'bar','should not change');
});

test('Ember can get',function(assert) {
	var obj = Immutable({foo: "bar"});
	assert.throws(
		function() {
			Ember.set(obj,'foo','me');
		},
		TypeError,
		"can't mutate"
	);
	assert.strictEqual(obj.foo,'bar','should not change');
});


test('immutable merge',function(assert) {
	var obj = Immutable({foo: "bar"});
	var obj2 = Immutable.merge(obj,{foo: "me"})
	assert.strictEqual(obj2.foo,'me','can merge');
});

test('defineProperty test',function(assert) {

	function Sprite() {
		// Constructor code ...
	}

	Object.defineProperty(Sprite.prototype, "y", {
		set: function (val) {
			if (typeof val !== "number" || isNaN(val)) {
				throw "Sprite.y must be a valid number and not NaN";
			}
			this.__y = val;
		},
		get: function () {
			return this.__y;
		}
	})

	Sprite.prototype.y = 0;
	Sprite.prototype.x = 0;

// Instantiate

	var sprite = new Sprite();
	sprite.x = "Hello, world!"; // Passed without complaints

	assert.throws(
		function() {
			sprite.y = sprite.somethingUndefined / 10; // Exception is thrown
		},
		function(e){
			console.log("error::"+e);
			return true;
		},
		"must be a number"
	);
	sprite.y = 10;  // no problem
});

test('KojacModel test',function(assert) {

	var Thing = KojacModel.extend({
		name: String,
		height: KojacModel.Int
	});

	var thing = new Thing({
		name: 'Fred',
		size: 180
	});

	assert.strictEqual(thing.name,'Fred','should exist and be gettable');

	thing = Immutable(thing);

	assert.strictEqual(thing.name,'Fred','should exist and be gettable');


});
