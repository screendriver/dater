import test from 'tape';
import { Ora } from 'ora';
import sinon from 'sinon';
import { readExifDate, NoExifDate, ExifDate } from '../src/image';

test('returns "not ok" when image has no exif data', async t => {
  t.plan(1);
  const image = './test/assets/test-image.jpg';
  const stopAndPersist = sinon.fake();
  const spinner: Partial<Ora> = { stopAndPersist };
  const actual = await readExifDate(image, spinner as Ora);
  const expected: NoExifDate = { ok: false };
  t.deepEqual(actual, expected);
});

test('stops spinner and sets a text on it when image has no exif data', async t => {
  t.plan(2);
  const image = './test/assets/test-image.jpg';
  const stopAndPersist = sinon.fake();
  const spinner: Partial<Ora> = { stopAndPersist };
  await readExifDate(image, spinner as Ora);
  t.equal(spinner.text, 'No EXIF data found in ./test/assets/test-image.jpg');
  t.equal(stopAndPersist.callCount, 1);
});

test('returns "ok" when image has exif data', async t => {
  t.plan(1);
  const image = './test/assets/test-image-exif.jpg';
  const stopAndPersist = sinon.fake();
  const spinner: Partial<Ora> = { stopAndPersist };
  const actual = await readExifDate(image, spinner as Ora);
  const expected: ExifDate = {
    ok: true,
    createDate: '2006:08:19 17:39:00',
    filePath: './test/assets/test-image-exif.jpg',
  };
  t.deepEqual(actual, expected);
});

test('rejecets when image could not be found', async t => {
  t.plan(1);
  const image = './non-existing-image.jpg';
  const stopAndPersist = sinon.fake();
  const spinner: Partial<Ora> = { stopAndPersist };
  try {
    await readExifDate(image, spinner as Ora);
  } catch (e) {
    const expected = e.message.includes(
      "ENOENT: no such file or directory, open './non-existing-image.jpg",
    );
    t.true(expected);
  }
});
