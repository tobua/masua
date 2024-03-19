import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { highlight } from 'sugar-high'
import { scale } from 'optica'
import { grid } from 'masua'
import { Grid } from 'masua/react'
import logo from './logo.png'
import { Color } from './style'
import { Configuration, ConfigurationReact } from './ConfigurationTable'
import { Input } from './markup/Input'
import { Select } from './markup/Select'
import { Checkbox } from './markup/Checkbox'

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

const headingSize = { h1: scale(36), h2: scale(26), h3: scale(22) }

const headingStyles = (as: 'h1' | 'h2' | 'h3'): CSSProperties => ({
  margin: 0,
  fontSize: headingSize[as],
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

const rowStyles: CSSProperties = {
  display: 'flex',
  gap: scale(20),
  alignItems: 'flex-end',
  flexWrap: 'wrap',
}

const codeStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: scale(20),
  background: Color.blue.ultralight,
  borderRadius: scale(20),
  fontFamily: 'monospace',
}

function Code({ children }: { children: string }) {
  return <div style={codeStyles} dangerouslySetInnerHTML={{ __html: highlight(children) }} />
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
  const gridInstance = useRef<ReturnType<typeof grid>>(null)
  const [gutter, setGutter] = useState(10)
  const [baseWidth, setBaseWidth] = useState(255)
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr')
  const [minify, setMinify] = useState(true)
  const [surroundingGutter, setSurroundingGutter] = useState(false)
  const [wedge, setWedge] = useState(false)

  useEffect(() => {
    console.log('gutter', gridInstance.current, gutter)
    if (gridInstance.current) {
      gridInstance.current.update({
        gutter,
        baseWidth,
        direction,
        minify,
        surroundingGutter,
        wedge,
      })
      return gridInstance.current.destroy
    }
    gridInstance.current = grid(gridRef.current, {
      gutter,
      baseWidth,
      direction,
      minify,
      surroundingGutter,
      wedge,
    })
    return gridInstance.current.destroy
  }, [gutter, baseWidth, direction, minify, surroundingGutter, wedge])

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
      <Heading as="h3">Configuration</Heading>
      <div style={rowStyles}>
        <Input placeholder="Gutter" value={gutter} onValue={setGutter} />
        <Input placeholder="Base Width" value={baseWidth} onValue={setBaseWidth} />
        <Checkbox checked={minify} onToggle={setMinify}>
          Minify
        </Checkbox>
        <Checkbox checked={surroundingGutter} onToggle={setSurroundingGutter}>
          Surrounding Gutter
        </Checkbox>
        <Select
          placeholder="Direction"
          onOption={(option: 'ltr' | 'rtl') => setDirection(option)}
          options={[
            { label: 'Left to Right', value: 'ltr' },
            { label: 'Right to Left', value: 'rtl' },
          ]}
        />
        <Checkbox checked={wedge} onToggle={setWedge}>
          Wedge
        </Checkbox>
      </div>
      <Configuration />
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
      <Grid gutter={20}>
        <Box />
        <Box size={3} />
        <Box size={2} />
        <Box />
        <Box size={6} />
        <Box size={4} />
      </Grid>
      <Heading as="h3">Configuration</Heading>
      <Paragraph>
        The React plugin inherits all the regular configuration above and adds the following
        properties.
      </Paragraph>
      <ConfigurationReact />
    </div>
  )
}

createRoot(document.body as HTMLElement).render(<App />)
