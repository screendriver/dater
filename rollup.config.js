import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';

export default {
  entry: 'src/dater.js',
  format: 'cjs',
  plugins: [ json(), babel(), uglify() ],
  dest: 'dist/bundle.js'
};
