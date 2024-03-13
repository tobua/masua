interface State {
  sizes: number[]
  columns: number[]
  container: HTMLElement
  count: number
  width: number
  removeListener: () => void
  currentGutterX: number | string
  currentGutterY: number | string
  resizeTimeout: NodeJS.Timeout
  baseWidth: number
  gutterX: number | string
  gutterY: number | string
  gutter: number | string
  minify: boolean
  ultimateGutter: number
  surroundingGutter: boolean
  direction: 'ltr' | 'rtl'
  wedge: boolean
}

export interface Configuration {
  baseWidth: number
  gutter: number | string
  gutterX: number | string
  gutterY: number | string
  minify: boolean
  surroundingGutter: boolean
  ultimateGutter: number
  direction: 'ltr' | 'rtl'
  wedge: boolean
}

function getCount(state: State) {
  if (state.surroundingGutter) {
    return Math.floor(
      (state.width - state.currentGutterX) / (state.baseWidth + state.currentGutterX),
    )
  }

  return Math.floor((state.width + state.currentGutterX) / (state.baseWidth + state.currentGutterX))
}

function getLongest(state: State) {
  let longest = 0
  for (let index = 0; index < state.count; index += 1) {
    if (state.columns[index] > state.columns[longest]) {
      longest = index
    }
  }
  return longest
}

function getNextColumn(index: number, state: State) {
  return index % state.columns.length
}

function getShortest(state: State) {
  let shortest = 0
  for (let index = 0; index < state.count; index += 1) {
    if (state.columns[index] < state.columns[shortest]) {
      shortest = index
    }
  }

  return shortest
}

function reset(state: State) {
  state.sizes = []
  state.columns = []
  state.count = null
  state.width = state.container.clientWidth
  const minWidth = state.baseWidth
  if (state.width < minWidth) {
    state.width = minWidth
    state.container.style.minWidth = `${minWidth}px`
  }

  if (getCount(state) === 1) {
    // Set ultimate gutter when only one column is displayed
    state.currentGutterX = state.ultimateGutter
    // As gutters are reduced, two column may fit, forcing to 1
    state.count = 1
  } else if (state.width < state.baseWidth + 2 * state.currentGutterX) {
    // Remove gutter when screen is to low
    state.currentGutterX = 0
  } else {
    state.currentGutterX = state.gutterX
  }
}

function computeWidth(state: State) {
  let width
  if (state.surroundingGutter) {
    width = (state.width - state.currentGutterX) / state.count - state.currentGutterX
  } else {
    width = (state.width + state.currentGutterX) / state.count - state.currentGutterX
  }
  width = Number.parseFloat(width.toFixed(2))

  return width
}

function layout(state: State) {
  if (!state.container) {
    console.error('Container not found')
    return
  }
  reset(state)

  // Computing columns count
  if (state.count == null) {
    state.count = getCount(state)
  }
  // Computing columns width
  const colWidth = computeWidth(state)

  for (let index = 0; index < state.count; index += 1) {
    state.columns[index] = 0
  }

  // Saving children real heights
  const { children } = state.container
  for (let index = 0; index < children.length; index += 1) {
    // Set colWidth before retrieving element height if content is proportional
    const child = children[index] as HTMLElement
    child.style.width = `${colWidth}px`
    state.sizes[index] = child.clientHeight
  }

  let startX
  if (state.direction === 'ltr') {
    startX = state.surroundingGutter ? state.currentGutterX : 0
  } else {
    startX = state.width - (state.surroundingGutter ? state.currentGutterX : 0)
  }
  if (state.count > state.sizes.length) {
    // If more columns than children
    const occupiedSpace =
      state.sizes.length * (colWidth + state.currentGutterX) - state.currentGutterX
    if (state.wedge === false) {
      if (state.direction === 'ltr') {
        startX = (state.width - occupiedSpace) / 2
      } else {
        startX = state.width - (state.width - occupiedSpace) / 2
      }
    } else if (state.direction === 'ltr') {
      //
    } else {
      startX = state.width - state.currentGutterX
    }
  }

  // Computing position of children
  for (let index = 0; index < children.length; index += 1) {
    const nextColumn = state.minify ? getShortest(state) : getNextColumn(index, state)

    let childrenGutter = 0
    if (state.surroundingGutter || nextColumn !== state.columns.length) {
      childrenGutter = state.currentGutterX
    }
    let x: number
    if (state.direction === 'ltr') {
      x = startX + (colWidth + childrenGutter) * nextColumn
    } else {
      x = startX - (colWidth + childrenGutter) * nextColumn - colWidth
    }
    const y = state.columns[nextColumn]
    const child = children[index] as HTMLElement
    child.style.transform = `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`

    state.columns[nextColumn] +=
      state.sizes[index] + (state.count > 1 ? state.gutterY : state.ultimateGutter) // margin-bottom
  }

  state.container.style.height = `${state.columns[getLongest(state)] - state.currentGutterY}px`
}

function resizeThrottler(state: State) {
  // ignore resize events as long as an actualResizeHandler execution is in the queue
  if (!state.resizeTimeout) {
    state.resizeTimeout = setTimeout(() => {
      state.resizeTimeout = null
      // IOS Safari throw random resize event on scroll, call layout only if size has changed
      if (state.container.clientWidth !== state.width) {
        layout(state)
      }
      // The actualResizeHandler will execute at a rate of 30fps
    }, 33)
  }
}

function init(state: State) {
  // TODO what does this do?
  // for (const i in configuration) {
  //   if (configuration[i] !== undefined) {
  //     this.conf[i] = conf[i]
  //   }
  // }

  state.currentGutterX = state.gutterX
  state.currentGutterY = state.gutterY

  const onResize = resizeThrottler.bind(this, state)
  window.addEventListener('resize', onResize)
  state.removeListener = function removeListener() {
    window.removeEventListener('resize', onResize)
    if (state.resizeTimeout != null) {
      window.clearTimeout(state.resizeTimeout)
      state.resizeTimeout = null
    }
  }

  layout(state)
}

function destroy(state: State) {
  if (typeof state.removeListener === 'function') {
    state.removeListener()
  }

  const { children } = state.container
  for (let index = 0; index < children.length; index += 1) {
    const child = children[index] as HTMLElement
    child.style.removeProperty('width')
    child.style.removeProperty('transform')
  }
  state.container.style.removeProperty('height')
  state.container.style.removeProperty('min-width')
}

export function grid(element: HTMLElement | string, configuration: Partial<Configuration> = {}) {
  if (!element && process.env.NODE_ENV !== 'production') {
    throw new Error('masua: "element" parameter is missing or undefined.')
  }

  const state: State = {
    sizes: [],
    columns: [],
    container: typeof element === 'string' ? document.querySelector(element) : element,
    count: null,
    width: 0,
    removeListener: null,
    currentGutterX: null,
    currentGutterY: null,
    resizeTimeout: null,
    baseWidth: 255,
    gutter: 10,
    minify: true,
    ultimateGutter: 5,
    surroundingGutter: false,
    direction: 'ltr',
    wedge: false,
    ...configuration,
    gutterX: configuration.gutterX || configuration.gutter || 10,
    gutterY: configuration.gutterY || configuration.gutter || 10,
  }

  // TODO use calc if gutter is string.

  init(state)

  return {
    destroy: () => destroy(state),
    update: () => layout(state),
  }
}
