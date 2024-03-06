import { useRef, useEffect, useMemo } from 'react'
import { grid, type Configuration } from 'masua'

interface ReactConfiguration extends Configuration {
  disabled: boolean
}

const configurationProperties = [
  'baseWidth',
  'gutter',
  'gutterX',
  'gutterY',
  'minify',
  'surroundingGutter',
  'ultimateGutter',
  'direction',
  'wedge',
]

export function Grid({
  disabled = false,
  ...props
}: JSX.IntrinsicElements['div'] & Partial<ReactConfiguration>) {
  const gridRef = useRef(null)
  const configurationProps = useMemo(
    () =>
      Object.entries(props).reduce((result, [key, value]) => {
        if (configurationProperties.includes(key)) {
          result[key] = value
          delete props[key]
        }
        return result
      }, {}),
    [props],
  )

  useEffect(() => {
    if (disabled) return () => {}
    return grid(gridRef.current, configurationProps).destroy
  }, [])

  return <div ref={gridRef} {...props} />
}
