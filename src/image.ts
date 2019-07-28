import { Ora } from 'ora';
import { ExifImage } from 'exif';

export interface NoExifDate {
  ok: boolean;
}

export interface ExifDate {
  ok: boolean;
  createDate: string;
  filePath: string;
}

export const readExifDate = (spinner: Ora) => (
  image: string,
): Promise<NoExifDate | ExifDate> => {
  return new Promise((resolve, reject) => {
    // tslint:disable-next-line
    new ExifImage(
      { image },
      (error: { code: string }, exifData: { exif: { CreateDate: string } }) => {
        if (error) {
          if (error.code === 'NO_EXIF_SEGMENT') {
            const spinnerInstance = spinner;
            spinnerInstance.text = `No EXIF data found in ${image}`;
            spinnerInstance.stopAndPersist();
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
};
