import fs from 'fs-extra';
import mime from 'mime';
import path from 'path';

type Path = string;

export function getAllFiles(dirPath: Path): Promise<readonly Path[]> {
  return fs.readdir(dirPath);
}

export function filterImages(files: readonly Path[]): readonly Path[] {
  return files.filter(file => {
    const type = mime.getType(file);
    return type && type.startsWith('image');
  });
}

export function resolveImageFullPath(dirPath: Path, imageName: string): Path {
  return path.resolve(dirPath, imageName);
}
