<p align="center">
  <img src="https://github.com/tobua/masua/raw/main/logo.png" alt="masua" width="300">
</p>

# masua

Simple masonry layout library in TypeScript. Initially forked from [minimasonry](https://github.com/Spope/MiniMasonry.js) by Spope.

- ❗ Check out the [interactive demo and documentation](https://tobua.github.io/masua)
- ⚛️ JavaScript and React support
- ⚠️ Published as TypeScript and JSX (for the React plugin) see [this post on 𝕏](https://twitter.com/matthiasgiger/status/1766443368567971946) for the reasoning

## Usage

```ts
import { grid } from 'masua'

grid(document.querySelector('#my-grid'))
// With configuration options.
grid(document.querySelector('#my-custom-grid'), {
  gutter: 20,
  baseWidth: 300,
  minify: false,
  surroundingGutter: true,
  singleColumnGutter: 10,
  direction: 'rtl',
  wedge: true,
})
```

## React

```tsx
import { Grid } from 'masua'

const MyGrid = () => (
  <Grid disabled={window.innerWidth < 501}>
    <Box />
    <Box size={3} />
    <Box size={2} />
    <Box />
    <Box size={6} />
    <Box size={4} />
  </Grid>
)
```
