import { isPromise } from './is-promise'

export function throttlePromise(delay: number) {
    let waiting = false
    function _setWaiting() {
        setTimeout(() => {
            waiting = false
        }, delay)
    }

    return (callback: any) => {
        return new Promise((resolve) => {
            if (!waiting) {
                waiting = true
                const res = callback()
                if (isPromise(res)) {
                    res.then(_setWaiting)
                    resolve(res)
                } else {
                    _setWaiting()
                    resolve(res)
                }
            }
        })
    }
}
