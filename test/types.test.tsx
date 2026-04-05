import './setup-dom'
import { expect, test } from 'bun:test'
import { grid } from 'masua'
import { Grid } from 'masua/react'

test('JavaScript types are ok.', () => {
  expect(grid(document.createElement('div'))).toBeDefined()
  expect(grid(document.createElement('div'), { gutter: 10 })).toBeDefined()
})

test('React types are ok.', () => {
  expect(<Grid />).toBeDefined()
  expect(
    <Grid>
      <p>1</p>
      <p>2</p>
    </Grid>,
  ).toBeDefined()
})
