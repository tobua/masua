import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { highlight } from 'sugar-high'
import { scale } from 'optica'
import { grid } from 'masua'
import { Grid } from 'masua/react'
import logo from './logo.png'

const Color = {
  blue: {
    ultralight: '#c3deff',
    light: '#77b5ff',
    regular: '#0075ff',
    dark: '#0075ff',
  },
  boxes: ['#0075ff', '#ff002e', '#00ba6c', '#eb00ff', '#ffb800', '#09d3c7'],
}

function Code({ children }: { children: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: scale(20),
        background: Color.blue.ultralight,
        borderRadius: scale(20),
        fontFamily: 'monospace',
      }}
      dangerouslySetInnerHTML={{ __html: highlight(children) }}
    />
  )
}

let colorIndex = 0

function Box({ size = 1 }) {
  return (
    <div
      style={{
        position: 'absolute',
        background: Color.boxes[colorIndex++ % 6],
        width: scale(100),
        height: scale(size * 20),
      }}
    />
  )
}

function App() {
  const gridRef = useRef(null)

  useEffect(() => grid(gridRef.current), [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'normal',
        fontFamily: 'sans-serif',
        gap: scale(20),
      }}
    >
      <style>{`.sh__line {
    display: block;
    min-height: 20px;
}

.sh__token--space {
  min-width: 10px;
}

:root {
  --sh-class: #2d5e9d;
  --sh-identifier: #354150;
  --sh-sign: #8996a3;
  --sh-property: #0550ae;
  --sh-entity: #249a97;
  --sh-jsxliterals: #6266d1;
  --sh-string: #00a99a;
  --sh-keyword: #f47067;
  --sh-comment: #a19595;
}`}</style>
      <img style={{ width: scale(200), alignSelf: 'center' }} src={logo} alt="masua Logo" />
      <h1>masua</h1>
      <p>
        Masua is a <b>simple</b> and <b>small</b>{' '}
        <span style={{ color: Color.middle }}>Masonry</span> layout grid component in TypeScript for
        the browser. It comes with a vanilla JavaScript and a React JSX version.
      </p>
      <h2>Usage</h2>
      <Code>{`import { grid } from 'masua'

grid(document.querySelector('#my-grid'))`}</Code>
      <div ref={gridRef} style={{ position: 'relative', display: 'flex' }}>
        <Box />
        <Box size={3} />
        <Box size={2} />
        <Box />
        <Box size={6} />
        <Box size={4} />
      </div>
      <h2>React</h2>
      <Code>{`import { Grid } from 'masua'

const MyGrid = () => (
  <Grid>
    <Box />
    <Box size={3} />
    <Box size={2} />
    <Box />
    <Box size={6} />
    <Box size={4} />
  </Grid>
)`}</Code>
      <Grid>
        <Box />
        <Box size={3} />
        <Box size={2} />
        <Box />
        <Box size={6} />
        <Box size={4} />
      </Grid>
    </div>
  )
}

createRoot(document.body as HTMLElement).render(<App />)
