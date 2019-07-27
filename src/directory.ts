import fs from 'fs-extra';
import mime from 'mime';

type Path = string;

export async function getImages(dirPath: string): Promise<readonly Path[]> {
  const files = await fs.readdir(dirPath);
  return files.filter(file => {
    const type = mime.getType(file);
    return type && type.startsWith('image');
  });
}
