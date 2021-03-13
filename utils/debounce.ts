export const debounce = (fn: Function, ms: number) => {
  let timeout: number

  clearTimeout(timeout)

  timeout = setTimeout(fn, ms)
}
