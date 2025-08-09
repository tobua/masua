import { scale } from 'optica'
import type { CSSProperties, JSX } from 'react'
import { highlight } from 'sugar-high'
import { Color } from '../style'

const headingSize = { h1: scale(36), h2: scale(26), h3: scale(22) }

const headingStyles = (as: 'h1' | 'h2' | 'h3'): CSSProperties => ({
  margin: 0,
  fontSize: headingSize[as],
})

export function Heading({ as = 'h1', style, ...props }: JSX.IntrinsicElements['h1' | 'h2' | 'h3'] & { as?: 'h1' | 'h2' | 'h3' }) {
  const Component = as
  return <Component {...props} style={{ ...headingStyles(as), ...style }} />
}

const paragraphStyles: CSSProperties = {
  margin: 0,
  fontSize: scale(18),
}

export function Paragraph({ style, ...props }: JSX.IntrinsicElements['p']) {
  return <p {...props} style={{ ...paragraphStyles, ...style }} />
}

const codeStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: scale(20),
  background: Color.blue.ultralight,
  borderRadius: scale(20),
  fontFamily: 'monospace',
}

export function Code({ children }: { children: string }) {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe, as generated from static code on the client.
  return <div style={codeStyles} dangerouslySetInnerHTML={{ __html: highlight(children) }} />
}

let colorIndex = 0

const boxStyles = (size: number, sizeFactor = 40): CSSProperties => {
  const color = Color.boxes[colorIndex++ % 6]

  return {
    width: scale(100),
    height: scale(size * sizeFactor),
    background: 'paintWorklet' in CSS ? 'paint(squircle)' : color,
    borderRadius: 'paintWorklet' in CSS ? 0 : scale(10),
    // @ts-ignore
    '--squircle-radius': sizeFactor / 2,
    '--squircle-fill': color,
  }
}

export function Box({ size = 1 }) {
  return <div style={boxStyles(size)} />
}
