import fse from 'fs-extra';
import path from 'path';
import {
  readExifDate,
  NoExifDate,
  ExifDate,
  filterExifDates,
  renameExifDates,
} from '../src/image';

test('readExifDate() returns "not ok" when image has no exif data', async () => {
  const images = ['./test/assets/test-image.jpg'];
  const actual = await readExifDate(jest.fn())(images);
  const expected: [NoExifDate] = [
    { ok: false, filePath: './test/assets/test-image.jpg' },
  ];
  expect(actual).toEqual(expected);
});

test('readExifDate() sets spinner text when image has no exif data', async () => {
  const images = ['./test/assets/test-image.jpg'];
  const setSpinnerText = jest.fn();
  await readExifDate(setSpinnerText)(images);
  expect(setSpinnerText).toHaveBeenCalledWith(
    'No EXIF data found in ./test/assets/test-image.jpg',
  );
});

test('readExifDate() returns "ok" when image has exif data', async () => {
  const images = ['./test/assets/test-image-exif.jpg'];
  const actual = await readExifDate(jest.fn())(images);
  const expected: ExifDate[] = [
    {
      ok: true,
      createDate: '2006:08:19 17:39:00',
      filePath: './test/assets/test-image-exif.jpg',
    },
  ];
  expect(actual).toEqual(expected);
});

test('readExifDate() rejecets when image could not be found', async () => {
  const images = ['./non-existing-image.jpg'];
  try {
    await readExifDate(jest.fn())(images);
  } catch (e) {
    const expected = e.message.includes(
      "ENOENT: no such file or directory, open './non-existing-image.jpg",
    );
    expect(expected).toBe(true);
  }
});

test('filterExifDates() filters given elements with ExifDate', () => {
  const exifDates: Array<NoExifDate | ExifDate> = [
    { ok: false, filePath: '' },
    { ok: true, createDate: '', filePath: '' },
  ];
  const actual = filterExifDates(exifDates);
  const expected = [{ ok: true, createDate: '', filePath: '' }];
  expect(actual).toEqual(expected);
});

test('renameExifDates() should set filenames with the patttern "yyyyMMdd_HHmmss"', async () => {
  const fs: Partial<typeof fse> = {
    rename: jest.fn().mockResolvedValue(undefined),
  };
  const exifDates: ExifDate[] = [
    {
      ok: true,
      createDate: '2019:07:29 09:25:00',
      filePath: './test/test-image.jpg',
    },
  ];
  const actual = await renameExifDates('./test/assets')(fs as typeof fse)(
    exifDates,
  );
  const expected = [path.resolve('./test/assets/20190729_092500.jpg')];
  expect(actual).toEqual(expected);
});
