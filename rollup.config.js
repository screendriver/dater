import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import json from 'rollup-plugin-json';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/dater.js',
  format: 'cjs',
  plugins: [ json(), babel(), uglify(), filesize() ],
  dest: 'dist/bundle.js'
};
