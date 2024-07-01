export function debounce<T extends any[]>(callback: (...args: T) => void, wait: number) {
  let timeoutId: number | null = null
  return (...args: T) => {
    window.clearTimeout(timeoutId!)
    timeoutId = window.setTimeout(() => {
      callback(...args)
    }, wait)
  }
}
