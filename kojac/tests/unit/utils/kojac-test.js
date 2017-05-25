import { module, test } from 'qunit';
import Kojac from 'kojac/utils/Kojac';
import Immutable from 'seamless-immutable';

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

test('immutable merge',function(assert) {
	var obj = Immutable({foo: "bar"});
	var obj2 = Immutable.merge(obj,{foo: "me"})
	assert.strictEqual(obj2.foo,'me','can merge');
});

