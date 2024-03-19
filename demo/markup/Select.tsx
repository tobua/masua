import { scale } from 'optica'
import type { CSSProperties, JSX } from 'react'
import { Color } from '../style'
import { Open } from './Icon'

const inputWrapperStyles: CSSProperties = {
  position: 'relative',
  marginTop: 20,
}

const descriptionLabelStyles: CSSProperties = {
  position: 'absolute',
  left: scale(10),
  top: scale(-18),
  background: Color.gray[400],
  padding: scale(5),
  borderRadius: scale(8),
  color: 'black',
  fontSize: scale(14),
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
}

const selectStyles: CSSProperties = {
  border: 'none',
  background: Color.blue.ultralight,
  color: Color.black,
  outline: 'none',
  borderRadius: scale(10),
  height: scale(40),
  paddingLeft: scale(10),
  paddingRight: scale(35),
  cursor: 'pointer',
  minWidth: scale(140),
  appearance: 'none',
  fontSize: scale(16),
}

const openStyles: CSSProperties = {
  position: 'absolute',
  right: scale(10),
  height: scale(40),
  pointerEvents: 'none',
}

export function Select({
  style,
  onOption,
  options,
  placeholder,
  ...props
}: JSX.IntrinsicElements['select'] & {
  options: { label: string; value: string }[]
  onOption: (option: string) => void
  placeholder: string
}) {
  return (
    <div style={inputWrapperStyles}>
      <label style={descriptionLabelStyles}>{placeholder}</label>
      <select
        onChange={(event) => onOption(event.target.value)}
        {...props}
        style={{ ...selectStyles, ...style }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Open style={openStyles} color={Color.black} />
    </div>
  )
}
