import { Ora } from 'ora';
import pPipe from 'p-pipe';
import fs from 'fs-extra';
import { readExifDate, filterExifDates, renameExifDates } from './image';
import { getAllFiles, filterImages, resolveImagesFullPath } from './directory';

export async function rename(
  dirPath: string,
  spinner: Ora,
): Promise<readonly string[]> {
  const pipeline = pPipe(
    getAllFiles,
    filterImages,
    resolveImagesFullPath(dirPath),
    readExifDate(spinner),
    filterExifDates,
    renameExifDates(dirPath)(fs),
  );
  return pipeline(dirPath);
}
