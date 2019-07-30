import { ExifImage } from 'exif';
import path from 'path';
import fse from 'fs-extra';
import { parse, format } from 'date-fns/fp';

export interface NoExifDate {
  ok: false;
  filePath: string;
}

export interface ExifDate {
  ok: true;
  createDate: string;
  filePath: string;
}

export const readExifDate = (setSpinnerText: (text: string) => void) => (
  imagePaths: readonly string[],
): Promise<ReadonlyArray<NoExifDate | ExifDate>> => {
  const exifDates = imagePaths.map(image => {
    return new Promise<NoExifDate | ExifDate>((resolve, reject) => {
      // tslint:disable-next-line
      new ExifImage(
        { image },
        (
          error: { code: string },
          exifData: { exif: { CreateDate: string } },
        ) => {
          if (error) {
            if (error.code === 'NO_EXIF_SEGMENT') {
              setSpinnerText(`No EXIF data found in ${image}`);
              resolve({ ok: false, filePath: image });
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
  });
  return Promise.all(exifDates);
};

export function filterExifDates(
  exifDates: ReadonlyArray<NoExifDate | ExifDate>,
): readonly ExifDate[] {
  return exifDates.filter((exifDate): exifDate is ExifDate => exifDate.ok);
}

export const renameExifDates = (dirPath: string) => (fs: typeof fse) => (
  exifDates: readonly ExifDate[],
): Promise<readonly string[]> => {
  const renames = exifDates.map(async ({ filePath, createDate }) => {
    const extName = path.extname(filePath);
    const parseCreateDate = parse(new Date(), 'yyyy:MM:dd HH:mm:ss');
    const formatCreateDate = format('yyyyMMdd_HHmmss');
    const newFileName = formatCreateDate(parseCreateDate(createDate));
    const newFilePath = path.resolve(dirPath, `${newFileName}${extName}`);
    await fs.rename(filePath, newFilePath);
    return newFilePath;
  });
  return Promise.all(renames);
};
