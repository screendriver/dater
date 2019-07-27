import fs from 'fs-extra';
import mime from 'mime';
import moment from 'moment';
import path from 'path';
import { ExifImage } from 'exif';
import { Ora } from 'ora';

interface NoExifDate {
  ok: boolean;
}

interface ExifDate {
  ok: boolean;
  createDate: string;
  filePath: string;
}

function getImages(dirPath: string): Promise<readonly string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const images = files.filter(file => {
          const type = mime.getType(file);
          if (!type) {
            return false;
          }
          return type.startsWith('image');
        });
        resolve(images);
      }
    });
  });
}

function readExifDate(image: string, spinner?: Ora) {
  return new Promise<NoExifDate | ExifDate>((resolve, reject) => {
    // tslint:disable-next-line
    new ExifImage(
      { image },
      (error: { code: string }, exifData: { exif: { CreateDate: string } }) => {
        if (error) {
          if (error.code === 'NO_EXIF_SEGMENT') {
            if (spinner) {
              const spinnerInstance = spinner;
              spinnerInstance.text = `No EXIF data found in ${image}`;
              spinnerInstance.stopAndPersist();
            }
            resolve({ ok: false });
          } else {
            reject(error);
          }
        } else {
          resolve({
            ok: true,
            createDate: exifData.exif.CreateDate,
            filePath: image,
          });
        }
      },
    );
  });
}

export async function rename(dirPath: string, spinner?: Ora) {
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
