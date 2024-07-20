import { scale } from 'optica'
import type { CSSProperties, JSX } from 'react'
import { Color } from '../style'
import { Close, Pick } from './Icon'

const wrapperStyles: CSSProperties = {
  background: Color.blue.ultralight,
  color: Color.black,
  borderRadius: scale(10),
  height: scale(40),
  display: 'flex',
  justifyContent: 'center',
  paddingLeft: scale(10),
  paddingRight: scale(10),
  gap: scale(10),
  alignItems: 'center',
  cursor: 'pointer',
}

const checkboxLabelStyles: CSSProperties = {
  color: Color.black,
  fontSize: scale(16),
}

export function Checkbox({
  children,
  style,
  onToggle,
  ...props
}: JSX.IntrinsicElements['input'] & { onToggle: (checked: boolean) => void }) {
  return (
    <label style={{ ...wrapperStyles, ...style }}>
      {props.checked ? <Pick /> : <Close />}
      <input type="checkbox" onChange={(event) => onToggle(event.target.checked)} style={{ display: 'none' }} {...props} />
      <span style={checkboxLabelStyles}>{children}</span>
    </label>
  )
}
