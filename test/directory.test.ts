import test from 'tape';
import path from 'path';
import {
  getAllFiles,
  filterImages,
  resolveImageFullPath,
} from '../src/directory';

test('getAllFiles() returns all files from given directory path', async t => {
  t.plan(1);
  const actual = await getAllFiles('./test/assets');
  const expected = ['test-image-exif.jpg', 'test-image.jpg', 'text-only.txt'];
  t.deepEqual(actual, expected);
});

test('filterImages() filters all images from given files', t => {
  t.plan(1);
  const files = ['./test/assets/test-image.jpg', './test/assets/text-only.txt'];
  const actual = filterImages(files);
  const expected = ['./test/assets/test-image.jpg'];
  t.deepEqual(actual, expected);
});

test('resolveImageFullPath() returns the absolute path of the given image', t => {
  t.plan(1);
  const actual = resolveImageFullPath('./test/assets', 'test-image.jpg');
  const expected = path.resolve('./test/assets', 'test-image.jpg');
  t.equal(actual, expected);
});
