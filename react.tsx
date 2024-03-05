import { useRef, useEffect } from 'react'
import { grid } from 'masua'

export function Grid({ ...props }: JSX.IntrinsicElements['div']) {
  const gridRef = useRef(null)

  useEffect(() => {
    return grid(gridRef.current).destroy
  }, [])

  return <div ref={gridRef} {...props} />
}
