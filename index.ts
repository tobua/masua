interface State {
  sizes: number[]
  columns: number[]
  container: HTMLElement
  // Number of columns, only used for internal calculations.
  count: number
  width: number
  removeListener?: () => void
  currentGutterX: number
  currentGutterY: number
  resizeTimeout?: ReturnType<typeof setTimeout>
  baseWidth: number
  gutterX: number
  gutterY: number
  gutter: number
  minify: boolean
  singleColumnGutter: number
  surroundingGutter: boolean
  direction: 'ltr' | 'rtl'
  wedge: boolean
}

export interface Configuration {
  baseWidth: number | string
  gutter: number | string
  gutterX: number | string
  gutterY: number | string
  minify: boolean
  surroundingGutter: boolean
  singleColumnGutter: number
  direction: 'ltr' | 'rtl'
  wedge: boolean
}

interface NumberConfiguration extends Configuration {
  baseWidth: number
  gutter: number
  gutterX: number
  gutterY: number
  singleColumnGutter: number
}

const log = (message: string, type: 'log' | 'error' = 'log') => console[type](`masua: ${message}.`)

function getCount(state: State) {
  if (state.surroundingGutter) {
    return Math.floor((state.width - state.currentGutterX) / (state.baseWidth + state.currentGutterX))
  }

  return Math.floor((state.width + state.currentGutterX) / (state.baseWidth + state.currentGutterX))
}

function getLongest(state: State) {
  let longest = 0
  for (let index = 0; index < state.count; index += 1) {
    if ((state.columns[index] ?? 0) > (state.columns[longest] ?? 1)) {
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
    if ((state.columns[index] ?? 1) < (state.columns[shortest] ?? 0)) {
      shortest = index
    }
  }

  return shortest
}

function reset(state: State) {
  state.sizes = []
  state.columns = []
  state.count = 0
  state.width = state.container.clientWidth
  const minWidth = state.baseWidth
  if (state.width < minWidth) {
    state.width = minWidth
    state.container.style.minWidth = `${minWidth}px`
  }

  if (getCount(state) === 1) {
    // Set ultimate gutter when only one column is displayed
    state.currentGutterX = state.singleColumnGutter
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
  let width: number
  if (state.surroundingGutter) {
    width = (state.width - state.currentGutterX) / state.count - state.currentGutterX
  } else {
    width = (state.width + state.currentGutterX) / state.count - state.currentGutterX
  }
  width = Number.parseFloat(width.toFixed(2))

  return width
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO decrease complexity
function layout(state: State) {
  if (!state.container) {
    log('Container not found', 'error')
    return
  }
  reset(state)

  // Computing columns count
  if (state.count === 0) {
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

  let startX: number
  if (state.direction === 'ltr') {
    startX = state.surroundingGutter ? state.currentGutterX : 0
  } else {
    startX = state.width - (state.surroundingGutter ? state.currentGutterX : 0)
  }
  if (state.count > state.sizes.length) {
    // If more columns than children
    const occupiedSpace = state.sizes.length * (colWidth + state.currentGutterX) - state.currentGutterX
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
    const y = state.columns[nextColumn] ?? 0
    const child = children[index] as HTMLElement
    child.style.transform = `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`
    child.style.position = 'absolute'

    state.columns[nextColumn] += (state.sizes[index] ?? 0) + (state.count > 1 ? state.gutterY : state.singleColumnGutter) // margin-bottom
  }

  state.container.style.height = `${(state.columns[getLongest(state)] ?? 0) - state.currentGutterY}px`
}

function resizeThrottler(state: State) {
  // ignore resize events as long as an actualResizeHandler execution is in the queue
  if (!state.resizeTimeout) {
    state.resizeTimeout = setTimeout(() => {
      state.resizeTimeout = undefined
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

  const onResize = resizeThrottler.bind(null, state)
  window.addEventListener('resize', onResize)
  state.removeListener = function removeListener() {
    window.removeEventListener('resize', onResize)
    if (state.resizeTimeout != null) {
      window.clearTimeout(state.resizeTimeout)
      state.resizeTimeout = undefined
    }
  }

  layout(state)
}

function destroy(state: State) {
  if (typeof state.removeListener === 'function') {
    state.removeListener()
  }

  const { children } = state.container
  for (const child of Array.from(children)) {
    const childElement = child as HTMLElement
    childElement.style.removeProperty('width')
    childElement.style.removeProperty('transform')
  }
  state.container.style.removeProperty('height')
  state.container.style.removeProperty('min-width')
}

const sizeCache = new Map<string, number>()

function getSizeInPixels(size: string) {
  const fromCache = sizeCache.get(size)

  if (fromCache) {
    return fromCache
  }

  const tempElement = document.createElement('div')
  tempElement.style.width = size
  document.body.appendChild(tempElement)
  const computedWidth = window.getComputedStyle(tempElement).width
  document.body.removeChild(tempElement)
  const pixels = Number.parseFloat(computedWidth)
  sizeCache.set(size, pixels)
  return pixels
}

const sizeValues: (keyof Configuration)[] = ['baseWidth', 'gutter', 'gutterX', 'gutterY', 'singleColumnGutter']

function convertStringSizesToPixels(configuration: Partial<Configuration>): Partial<NumberConfiguration> {
  for (const property of sizeValues) {
    const value = configuration[property]
    if (typeof value === 'string') {
      // @ts-ignore No idea what's the issue here.
      configuration[property] = getSizeInPixels(value)
    }
  }

  return configuration as Partial<NumberConfiguration>
}

function getContainer(element: HTMLElement | string) {
  if (typeof element === 'string') {
    const foundElementOnPage = document.querySelector(element) as HTMLElement
    if (!foundElementOnPage) {
      log(`element with selector ${element} not found on page`)
      return false
    }
    return foundElementOnPage
  }

  if (element instanceof HTMLElement) {
    return element
  }

  log('first argument invalid, must be HTMLElement or a string')
  return false
}

export function grid(element: HTMLElement | string, configuration: Partial<Configuration> = {}) {
  if (!element && process.env.NODE_ENV !== 'production') {
    throw new Error('masua: "element" parameter is missing or undefined.')
  }

  const container = getContainer(element)

  if (!container) {
    return
  }

  const numberConfiguration = convertStringSizesToPixels(configuration)

  const state: State = {
    sizes: [],
    columns: [],
    container,
    count: 0,
    width: 0,
    baseWidth: 255,
    gutter: 10,
    minify: true,
    surroundingGutter: false,
    direction: 'ltr',
    wedge: false,
    currentGutterX: 0,
    currentGutterY: 0,
    ...numberConfiguration,
    gutterX: numberConfiguration.gutterX || numberConfiguration.gutter || 10,
    gutterY: numberConfiguration.gutterY || numberConfiguration.gutter || 10,
    // One column is theoretically an Y-gutter so that's preferred if available.
    singleColumnGutter: numberConfiguration.singleColumnGutter || numberConfiguration.gutterY || numberConfiguration.gutter || 10,
  }

  init(state)

  return {
    destroy: () => destroy(state),
    update: (changes: Partial<Configuration> = {}) => {
      // TODO animate box and container location/height changes.
      const numberChanges = convertStringSizesToPixels(changes)
      Object.assign(state, numberChanges)
      state.gutterX = numberChanges.gutterX || numberChanges.gutter || state.gutterX
      state.gutterY = numberChanges.gutterY || numberChanges.gutter || state.gutterY
      state.singleColumnGutter =
        numberChanges.singleColumnGutter || numberChanges.gutterY || numberChanges.gutter || state.singleColumnGutter
      layout(state)
    },
  }
}
