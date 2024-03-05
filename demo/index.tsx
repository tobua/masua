import { type CSSProperties, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { highlight } from 'sugar-high'
import { scale } from 'optica'
import { grid } from 'masua'
import { Grid } from 'masua/react'
import logo from './logo.png'

if ('paintWorklet' in CSS) {
  // Script loaded separately from /public folder after initial load.
  ;(CSS as any).paintWorklet.addModule('squircle.min.js')
}

document.body.style.display = 'flex'
document.body.style.justifyContent = 'center'
document.body.style.margin = '0'
document.body.style.padding = '5vmin'

const appStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'normal',
  width: '100%',
  fontFamily: 'sans-serif',
  maxWidth: 1000,
  justifyContent: 'space-between',
  gap: scale(20),
}

const Color = {
  blue: {
    ultralight: '#c3deff',
    light: '#77b5ff',
    regular: '#0075ff',
    dark: '#0075ff',
  },
  boxes: ['#0075ff', '#ff002e', '#00ba6c', '#eb00ff', '#ffb800', '#09d3c7'],
}

const headingStyles = (as: 'h1' | 'h2' | 'h3'): CSSProperties => ({
  margin: 0,
  fontSize: as === 'h1' ? scale(36) : scale(24),
})

function Heading({
  as = 'h1',
  style,
  ...props
}: JSX.IntrinsicElements['h1' | 'h2' | 'h3'] & { as?: 'h1' | 'h2' | 'h3' }) {
  const Component = as
  return <Component {...props} style={{ ...headingStyles(as), ...style }} />
}

const paragraphStyles: CSSProperties = {
  margin: 0,
  fontSize: scale(18),
}

function Paragraph({ style, ...props }: JSX.IntrinsicElements['p']) {
  return <p {...props} style={{ ...paragraphStyles, ...style }} />
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

const boxStyles = (size: number, sizeFactor = 40): CSSProperties => {
  const color = Color.boxes[colorIndex++ % 6]

  return {
    position: 'absolute',
    width: scale(100),
    height: scale(size * sizeFactor),
    background: 'paintWorklet' in CSS ? 'paint(squircle)' : color,
    borderRadius: 'paintWorklet' in CSS ? 0 : scale(10),
    // @ts-ignore
    '--squircle-radius': sizeFactor / 2,
    '--squircle-fill': color,
  }
}

function Box({ size = 1 }) {
  return <div style={boxStyles(size)} />
}

function App() {
  const gridRef = useRef(null)

  useEffect(() => grid(gridRef.current).destroy, [])

  return (
    <div style={appStyles}>
      <style>{`.sh__line {
    display: block;
    min-height: 20px;
}

.sh__token--space {
  display: inline-block;
  width: 10px;
}

.sh__token--jsxliterals {
  display: inline-block;
  width: 10px;
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
      <Heading>masua</Heading>
      <Paragraph>
        Masua is a <b>simple</b> and <b>small</b>{' '}
        <span style={{ color: Color.blue.regular }}>Masonry</span> layout grid component in
        TypeScript for the browser. It comes with a vanilla JavaScript and a React JSX version.
      </Paragraph>
      <Heading as="h2">Usage</Heading>
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
      <Heading as="h2">React</Heading>
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
