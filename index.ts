interface Configuration {
  sizes: number[]
  columns: number[]
  container: HTMLElement
  count: number
  width: number
  removeListener: () => void
  currentGutterX: number
  currentGutterY: number
  resizeTimeout: NodeJS.Timeout
  baseWidth: number
  gutterX: number
  gutterY: number
  gutter: number
  minify: boolean
  ultimateGutter: number
  surroundingGutter: boolean
  direction: 'ltr' | 'rtl'
  wedge: boolean
}

function getCount(configuration: Configuration) {
  if (configuration.surroundingGutter) {
    return Math.floor(
      (configuration.width - configuration.currentGutterX) /
        (configuration.baseWidth + configuration.currentGutterX),
    )
  }

  return Math.floor(
    (configuration.width + configuration.currentGutterX) /
      (configuration.baseWidth + configuration.currentGutterX),
  )
}

function getLongest(configuration: Configuration) {
  let longest = 0
  for (let index = 0; index < configuration.count; index += 1) {
    if (configuration.columns[index] > configuration.columns[longest]) {
      longest = index
    }
  }
  return longest
}

function getNextColumn(index: number, configuration: Configuration) {
  return index % configuration.columns.length
}

function getShortest(configuration: Configuration) {
  let shortest = 0
  for (let index = 0; index < configuration.count; index += 1) {
    if (configuration.columns[index] < configuration.columns[shortest]) {
      shortest = index
    }
  }

  return shortest
}

function reset(configuration: Configuration) {
  configuration.sizes = []
  configuration.columns = []
  configuration.count = null
  configuration.width = configuration.container.clientWidth
  const minWidth = configuration.baseWidth
  if (configuration.width < minWidth) {
    configuration.width = minWidth
    configuration.container.style.minWidth = `${minWidth}px`
  }

  if (getCount(configuration) === 1) {
    // Set ultimate gutter when only one column is displayed
    configuration.currentGutterX = configuration.ultimateGutter
    // As gutters are reduced, two column may fit, forcing to 1
    configuration.count = 1
  } else if (configuration.width < configuration.baseWidth + 2 * configuration.currentGutterX) {
    // Remove gutter when screen is to low
    configuration.currentGutterX = 0
  } else {
    configuration.currentGutterX = configuration.gutterX
  }
}

function computeWidth(configuration: Configuration) {
  let width
  if (configuration.surroundingGutter) {
    width =
      (configuration.width - configuration.currentGutterX) / configuration.count -
      configuration.currentGutterX
  } else {
    width =
      (configuration.width + configuration.currentGutterX) / configuration.count -
      configuration.currentGutterX
  }
  width = Number.parseFloat(width.toFixed(2))

  return width
}

function layout(configuration: Configuration) {
  if (!configuration.container) {
    console.error('Container not found')
    return
  }
  reset(configuration)

  // Computing columns count
  if (configuration.count == null) {
    configuration.count = getCount(configuration)
  }
  // Computing columns width
  const colWidth = computeWidth(configuration)

  for (let index = 0; index < configuration.count; index += 1) {
    configuration.columns[index] = 0
  }

  // Saving children real heights
  const { children } = configuration.container
  for (let index = 0; index < children.length; index += 1) {
    // Set colWidth before retrieving element height if content is proportional
    const child = children[index] as HTMLElement
    child.style.width = `${colWidth}px`
    configuration.sizes[index] = child.clientHeight
  }

  let startX
  if (configuration.direction === 'ltr') {
    startX = configuration.surroundingGutter ? configuration.currentGutterX : 0
  } else {
    startX =
      configuration.width - (configuration.surroundingGutter ? configuration.currentGutterX : 0)
  }
  if (configuration.count > configuration.sizes.length) {
    // If more columns than children
    const occupiedSpace =
      configuration.sizes.length * (colWidth + configuration.currentGutterX) -
      configuration.currentGutterX
    if (configuration.wedge === false) {
      if (configuration.direction === 'ltr') {
        startX = (configuration.width - occupiedSpace) / 2
      } else {
        startX = configuration.width - (configuration.width - occupiedSpace) / 2
      }
    } else if (configuration.direction === 'ltr') {
      //
    } else {
      startX = configuration.width - configuration.currentGutterX
    }
  }

  // Computing position of children
  for (let index = 0; index < children.length; index += 1) {
    const nextColumn = configuration.minify
      ? getShortest(configuration)
      : getNextColumn(index, configuration)

    let childrenGutter = 0
    if (configuration.surroundingGutter || nextColumn !== configuration.columns.length) {
      childrenGutter = configuration.currentGutterX
    }
    let x: number
    if (configuration.direction === 'ltr') {
      x = startX + (colWidth + childrenGutter) * nextColumn
    } else {
      x = startX - (colWidth + childrenGutter) * nextColumn - colWidth
    }
    const y = configuration.columns[nextColumn]
    const child = children[index] as HTMLElement
    child.style.transform = `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`

    configuration.columns[nextColumn] +=
      configuration.sizes[index] +
      (configuration.count > 1 ? configuration.gutterY : configuration.ultimateGutter) // margin-bottom
  }

  configuration.container.style.height = `${configuration.columns[getLongest(configuration)] - configuration.currentGutterY}px`
}

function resizeThrottler(configuration: Configuration) {
  // ignore resize events as long as an actualResizeHandler execution is in the queue
  if (!configuration.resizeTimeout) {
    configuration.resizeTimeout = setTimeout(() => {
      configuration.resizeTimeout = null
      // IOS Safari throw random resize event on scroll, call layout only if size has changed
      if (configuration.container.clientWidth !== configuration.width) {
        layout(configuration)
      }
      // The actualResizeHandler will execute at a rate of 30fps
    }, 33)
  }
}

function init(configuration: Configuration) {
  // TODO what does this do?
  // for (const i in configuration) {
  //   if (configuration[i] !== undefined) {
  //     this.conf[i] = conf[i]
  //   }
  // }

  if (configuration.gutterX == null || configuration.gutterY == null) {
    // eslint-disable-next-line no-multi-assign
    configuration.gutterX = configuration.gutterY = configuration.gutter
  }
  configuration.currentGutterX = configuration.gutterX
  configuration.currentGutterY = configuration.gutterY

  const onResize = resizeThrottler.bind(this, configuration)
  window.addEventListener('resize', onResize)
  configuration.removeListener = function removeListener() {
    window.removeEventListener('resize', onResize)
    if (configuration.resizeTimeout != null) {
      window.clearTimeout(configuration.resizeTimeout)
      configuration.resizeTimeout = null
    }
  }

  layout(configuration)
}

function destroy(configuration: Configuration) {
  if (typeof configuration.removeListener === 'function') {
    configuration.removeListener()
  }

  const { children } = configuration.container
  for (let index = 0; index < children.length; index += 1) {
    const child = children[index] as HTMLElement
    child.style.removeProperty('width')
    child.style.removeProperty('transform')
  }
  configuration.container.style.removeProperty('height')
  configuration.container.style.removeProperty('min-width')
}

export function grid(element: HTMLElement | string) {
  if (!element && process.env.NODE_ENV !== 'production') {
    throw new Error('masua: "element" parameter is missing or undefined.')
  }

  const configuration: Configuration = {
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
    gutterX: null,
    gutterY: null,
    gutter: 10,
    minify: true,
    ultimateGutter: 5,
    surroundingGutter: true,
    direction: 'ltr',
    wedge: false,
  }

  init(configuration)

  return {
    destroy: () => destroy(configuration),
  }
}
