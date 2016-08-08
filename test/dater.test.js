import test from 'ava';

import rename from '../src/redater';

test('should fail on invalid path', async (t) => {
  const { code } = await t.throws(rename('./foo'));
  t.is(code, 'ENOENT');
});
