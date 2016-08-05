import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/dater.js',
  format: 'cjs',
  plugins: [ babel(), uglify() ],
  dest: 'dist/bundle.js'
};
