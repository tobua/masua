import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export const rsbuild = defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './index.tsx',
    },
  },
  html: {
    title: 'masua - Masonry Grid',
    favicon: '../logo.png',
  },
  output: {
    assetPrefix: '/masua/',
  },
})

export const gitignore = 'recommended'
export const vscode = 'biome'
export const biome = {
  extends: 'recommended',
  linter: {
    rules: {
      style: {
        useFilenamingConvention: 'off',
      },
      correctness: {
        noUndeclaredDependencies: 'off',
      },
    },
  },
  root: false,
  files: {
    includes: ['**/*', '!public/**'],
  },
}

export const typescript = {
  compilerOptions: {
    skipLibCheck: true,
    baseUrl: '.',
    target: 'ESNext',
    lib: ['DOM', 'ESNext'],
    module: 'Preserve',
    jsx: 'react-jsx',
    noEmit: true,
  },
  include: ['index.tsx'],
}
