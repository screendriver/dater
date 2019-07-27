import fs from 'fs-extra';
import moment from 'moment';
import path from 'path';
import { Ora } from 'ora';
import { readExifDate, NoExifDate, ExifDate } from './image';
import { getImages } from './directory';

export async function rename(dirPath: string, spinner: Ora) {
  const exifReads: Array<Promise<NoExifDate | ExifDate>> = [];
  const files = await getImages(dirPath);
  for (const file of files) {
    const filePath = path.resolve(dirPath, file);
    exifReads.push(readExifDate(filePath, spinner));
  }
  const renames: Array<Promise<unknown>> = [];
  const photos = (await Promise.all(exifReads)).filter(
    (date): date is ExifDate => date.ok,
  );
  for (const { filePath, createDate } of photos) {
    const extName = path.extname(filePath);
    const date = moment(createDate, 'YYYY:MM:DD HH:mm:ss');
    const newFileName = `${date.format('YYYYMMDD_HHmmss')}${extName}`;
    const newFilePath = path.resolve(dirPath, newFileName);
    const promise = new Promise((resolve, reject) => {
      fs.rename(filePath, newFilePath, (err: NodeJS.ErrnoException) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    renames.push(promise);
  }
  await Promise.all(renames);
}
