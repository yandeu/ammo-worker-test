export const createObjects = (fnc: Function) => {
  // add sphere rain
  fnc(5)
  const handle = setInterval(() => {
    fnc(5)
  }, 100)

  setTimeout(() => {
    clearInterval(handle)
  }, 15000)
}

export const DPI = 1
