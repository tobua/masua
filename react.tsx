import { type Configuration, grid } from 'masua'
import { type JSX, useEffect, useRef } from 'react'

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

export function Grid({ disabled = false, children, ...props }: JSX.IntrinsicElements['div'] & Partial<ReactConfiguration>) {
  const gridRef = useRef(null)
  const instance = useRef<ReturnType<typeof grid> | null>(null)
  // TODO props changes on every render, cannot be memoized, should do deep compare.
  const configurationProps = Object.entries(props).reduce((result: { [key: string]: string }, [key, value]) => {
    if (configurationProperties.includes(key)) {
      result[key] = value
      // @ts-ignore
      delete props[key]
    }
    return result
  }, {})

  useEffect(() => {
    if (disabled) {
      return
    }
    if (instance.current) {
      instance.current.update()
      return instance.current.destroy
    }
    if (!gridRef.current) {
      return
    }

    instance.current = grid(gridRef.current, configurationProps)
    return instance.current?.destroy
  }, [configurationProps, disabled])

  return (
    <div ref={gridRef} {...props}>
      {children}
    </div>
  )
}
