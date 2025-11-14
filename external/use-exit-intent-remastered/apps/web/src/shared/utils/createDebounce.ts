export function createDebounce(fn: (...args: unknown[]) => unknown, delay = 200) {
  let timer: ReturnType<typeof setTimeout>

  return {
    execute(args?: unknown[]) {
      clearTimeout(timer)

      timer = setTimeout(() => fn(args), delay)
    },

    abort() {
      clearTimeout(timer)
    },
  }
}
