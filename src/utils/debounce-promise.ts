export function debouncePromise(delay: number) {
    let timer: NodeJS.Timeout | null = null

    return (callback: () => void) => {
        return new Promise((resolve) => {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                timer = null
                resolve(callback())
            }, delay)
        })
    }
}
