import test from 'tape';
import { getImages } from '../src/directory';

test('getImages() filters images in directory path', async t => {
  t.plan(1);
  const actual = await getImages('./test');
  const expected = ['test-image-exif.jpg', 'test-image.jpg'];
  t.deepEqual(actual, expected);
});
