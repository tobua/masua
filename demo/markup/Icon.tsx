import { scale } from 'optica'
import { Color } from '../style'

export const Open = ({ width = 20, height = 20, color = Color.black, style = {} }) => (
  <svg style={{ width: scale(width), height: scale(height), ...style }} viewBox="0 0 50 50">
    <title>Open</title>
    <path
      d="M3 12L23.4986 35.2938C24.295 36.1988 25.705 36.1988 26.5014 35.2938L47 12"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
)

export function Pick({ size = 20, color = Color.black }) {
  return (
    <svg style={{ width: scale(size), height: scale(size) }} viewBox="0 0 50 50">
      <title>Pick</title>
      <path
        d="M2.5 29C2.9 29.8 14 43.6667 17 47.5L47.5 2.5"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function Close({ size = 20, color = Color.black }) {
  return (
    <svg style={{ width: scale(size), height: scale(size) }} viewBox="0 0 50 50">
      <title>Close</title>
      <path d="M2.5 47.5L47.5 2.5" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 2.5L47.5 47.5" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
