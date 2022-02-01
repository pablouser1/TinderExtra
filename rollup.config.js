import metablock from 'rollup-plugin-userscript-metablock'
import typescript from '@rollup/plugin-typescript'
import serve from 'rollup-plugin-serve'
import pkg from './package.json'

const plugins = [
  metablock({
    file: './meta.json',
    override: {
      name: 'TinderExtra',
      version: pkg.version,
      description: pkg.description,
      homepage: pkg.homepage,
      author: pkg.author,
      license: pkg.license,
    }
  }),
  typescript()
]

if (process.env.MODE === 'development') {
  plugins.push(serve({
    contentBase: ['dist'],
    headers: {
      'Cache-Control': 'public, max-age=10'
    }
  }))
}

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/TinderExtra.user.js',
    format: 'esm'
  },
  plugins: plugins
};
