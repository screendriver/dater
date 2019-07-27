import test from 'tape';

import { rename } from '../src/redater';

test('should fail on invalid path', async t => {
  t.plan(1);
  try {
    await rename('./foo');
  } catch (e) {
    t.is(e.code, 'ENOENT', 'e.code equals "ENOENT"');
  }
});
