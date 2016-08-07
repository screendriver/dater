/* eslint no-new: "off" */

import 'babel-polyfill';

import fs from 'fs';
import mime from 'mime';
import moment from 'moment';
import path from 'path';
import url from 'url';
import { ExifImage } from 'exif';

function getImages(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const images = files.filter((file) =>
          mime.lookup(file).startsWith('image')
        );
        resolve(images);
      }
    });
  });
}

function readDate(image) {
  return new Promise((resolve, reject) => {
    new ExifImage({ image }, (error, exifData) => {
      if (error) {
        reject(error);
      } else {
        resolve(exifData.exif.CreateDate);
      }
    });
  });
}

async function rename(dirPath) {
  const filePaths = [];
  const files = await getImages(dirPath);
  for (const file of files) {
    const filePath = url.resolve(dirPath, file);
    const promise = readDate(filePath).then((rawDate) => {
      const extName = path.extname(file);
      const date = moment(rawDate, 'YYYY:MM:DD HH:mm:ss');
      const newFileName = `${date.format('YYYYMMDD_HHmmss')}.${extName}`;
      const newFilePath = url.resolve(dirPath, newFileName);
      return {
        filePath,
        newFilePath,
      };
    });
    filePaths.push(promise);
  }
  const renames = [];
  for (const { filePath, newFilePath } of await Promise.all(filePaths)) {
    const promise = new Promise((resolve, reject) => {
      fs.rename(filePath, newFilePath, (err) => {
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

export default rename;
