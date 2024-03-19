import { scale } from 'optica'
import type { CSSProperties, JSX } from 'react'
import { Color } from '../style'

const inputWrapperStyles: CSSProperties = {
  position: 'relative',
  marginTop: 20,
}

const inputStyles: CSSProperties = {
  display: 'flex',
  border: 'none',
  background: Color.blue.ultralight,
  color: Color.black,
  outline: 'none',
  borderRadius: scale(10),
  height: scale(40),
  paddingLeft: scale(10),
  fontSize: scale(16),
}

const descriptionLabelStyles: CSSProperties = {
  position: 'absolute',
  left: scale(10),
  top: scale(-18),
  background: Color.gray[400],
  padding: scale(5),
  borderRadius: scale(8),
  color: Color.black,
  fontSize: scale(14),
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
}

export function Input({
  style,
  onValue,
  placeholder,
  ...props
}: JSX.IntrinsicElements['input'] & { onValue: (value: number) => void }) {
  return (
    <div style={inputWrapperStyles}>
      <label style={descriptionLabelStyles}>{placeholder}</label>
      <input
        type="number"
        onChange={(event) => onValue(Number(event.target.value))}
        {...props}
        style={{ ...inputStyles, ...style }}
      />
    </div>
  )
}
