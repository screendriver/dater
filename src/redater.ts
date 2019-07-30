import pPipe from 'p-pipe';
import fs from 'fs-extra';
import { readExifDate, filterExifDates, renameExifDates } from './image';
import { getAllFiles, filterImages, resolveImagesFullPath } from './directory';

export async function rename(
  dirPath: string,
  setSpinnerText: (text: string) => void,
): Promise<readonly string[]> {
  const pipeline = pPipe(
    getAllFiles,
    filterImages,
    resolveImagesFullPath(dirPath),
    readExifDate(setSpinnerText),
    filterExifDates,
    renameExifDates(dirPath)(fs),
  );
  return pipeline(dirPath);
}
