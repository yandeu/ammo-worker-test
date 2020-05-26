export const createObjects = (fnc: Function) => {
  // add sphere rain
  fnc(50)
  const handle = setInterval(() => {
    fnc(50)
  }, 500)

  setTimeout(() => {
    clearInterval(handle)
  }, 10000)
}

export const DPI = 0.5
