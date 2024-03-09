import type { CSSProperties } from 'react'
import { scale } from 'optica'
import { Color } from './style'

const wrapperStyles: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto auto auto auto',
  gap: scale(10),
  fontSize: scale(18),
  alignItems: 'center',
  background: Color.blue.ultralight,
  padding: scale(20),
  borderRadius: scale(20),
}

const headerStyles: CSSProperties = { fontWeight: 'bold' }

const Header = ({ children }: { children: string }) => <span style={headerStyles}>{children}</span>

const valueStyles: CSSProperties = { fontFamily: 'monospace', fontSize: scale(16) }

const Code = ({ children }: { children: string }) => <span style={valueStyles}>{children}</span>

export function Configuration() {
  return (
    <div style={wrapperStyles}>
      <Header>Property</Header>
      <Header>Default value</Header>
      <Header>Type</Header>
      <Header>Description</Header>
      <span>gutter</span>
      <Code>10</Code>
      <Code>number | string</Code>
      <span>Space between elements.</span>
      <span>gutterX | gutterY</span>
      <Code>gutter</Code>
      <Code>number | string</Code>
      <span>Horizonal and vertical space between elements.</span>
      <span>baseWidth</span>
      <Code>255</Code>
      <Code>number | string</Code>
      <span>Target width of elements.</span>
      <span>minify</span>
      <Code>true</Code>
      <Code>boolean</Code>
      <span>Use less space but don't keep existing element order.</span>
      <span>surroundingGutter</span>
      <Code>false</Code>
      <Code>boolean</Code>
      <span>Add gutter around the whole grid.</span>
      <span>ultimateGutter</span>
      <Code>5</Code>
      <Code>number | string</Code>
      <span>Gutter when only one column is displayed.</span>
      <span>direction</span>
      <Code>'ltr'</Code>
      <Code>'ltr' | 'rtl'</Code>
      <span>Sorting direction.</span>
      <span>wedge</span>
      <Code>false</Code>
      <Code>boolean</Code>
      <span>Sort from center or start from outside.</span>
    </div>
  )
}

export function ConfigurationReact() {
  return (
    <div style={wrapperStyles}>
      <Header>Property</Header>
      <Header>Default value</Header>
      <Header>Type</Header>
      <Header>Description</Header>
      <span>disabled</span>
      <Code>false</Code>
      <Code>boolean</Code>
      <span>Disable grid initialization, useful when on mobile.</span>
    </div>
  )
}
