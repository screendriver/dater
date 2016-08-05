import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/dater.js',
  format: 'cjs',
  plugins: [ babel() ],
  dest: 'dist/bundle.js'
};
