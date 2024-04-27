import { scale } from 'optica'
import { type CSSProperties, type HTMLInputTypeAttribute, type JSX, useState } from 'react'
import { Color } from '../style'

const inputWrapperStyles: CSSProperties = {
  position: 'relative',
  marginTop: 20,
}

const inputStyles = (valid: boolean): CSSProperties => ({
  display: 'flex',
  border: 'none',
  background: valid ? Color.blue.ultralight : Color.error,
  color: Color.black,
  outline: 'none',
  borderRadius: scale(10),
  height: scale(40),
  paddingLeft: scale(10),
  fontSize: scale(16),
})

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

function validateValue(value: number | string, type: HTMLInputTypeAttribute) {
  if (typeof value === 'string') {
    const parsedValue = Number(value)
    if (!Number.isNaN(parsedValue)) {
      return parsedValue
    }
    if (type !== 'text') {
      return false
    }
    const tempElement = document.createElement('div')
    tempElement.style.width = value
    document.body.appendChild(tempElement)
    const computedWidth = window.getComputedStyle(tempElement).width
    document.body.removeChild(tempElement)
    if (computedWidth !== '0px') {
      return value
    }
  }
  return false
}

let timeoutId: ReturnType<typeof setTimeout>

function customDebounce(callback: (value: number | string) => void, delay: number) {
  return (value: number | string) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      callback(value)
    }, delay)
  }
}

export function Input({
  style,
  value,
  onValue,
  placeholder,
  ...props
}: JSX.IntrinsicElements['input'] & { onValue: ((value: number) => void) | ((value: number | string) => void) }) {
  const [displayValue, setDisplayValue] = useState(value)
  const [valid, setValid] = useState(true)
  const debouncedOnValue = customDebounce(onValue, 500)

  return (
    <div style={inputWrapperStyles}>
      <label style={descriptionLabelStyles}>{placeholder}</label>
      <input
        type="number"
        value={displayValue}
        onChange={(event) => {
          const newValue = event.target.value
          setDisplayValue(newValue)
          const validValue = validateValue(newValue, props.type)
          if (!validValue) {
            setValid(false)
            return
          }
          setValid(true)
          debouncedOnValue(validValue)
        }}
        {...props}
        style={{ ...inputStyles(valid), ...style }}
      />
    </div>
  )
}
