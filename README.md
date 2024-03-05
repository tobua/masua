<p align="center">
  <img src="https://github.com/tobua/masua/raw/main/logo.png" alt="masua" width="300">
</p>

# masua

Simple masonry layout library in TypeScript.

## Usage

```ts
import { grid } from 'masua'

grid(document.querySelector('#my-grid'))
```

## React

```tsx
import { Grid } from 'masua'

const MyGrid = () => (
  <Grid>
    <Box />
    <Box size={3} />
    <Box size={2} />
    <Box />
    <Box size={6} />
    <Box size={4} />
  </Grid>
)
```
