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
  'singleColumnGutter',
  'direction',
  'wedge',
]

export function Grid({
  disabled = false,
  children,
  ...props
}: JSX.IntrinsicElements['div'] & Partial<ReactConfiguration>) {
  const gridRef = useRef(null)
  const instance = useRef<ReturnType<typeof grid>>(null)
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
    if (instance.current) {
      instance.current.update()
      return instance.current.destroy
    }
    instance.current = grid(gridRef.current, configurationProps)
    return instance.current.destroy
  }, [children])

  return (
    <div ref={gridRef} {...props}>
      {children}
    </div>
  )
}
