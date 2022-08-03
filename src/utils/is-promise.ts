export function isPromise(p: any) {
    if (typeof p.then === 'function') {
        return true
    }
    return false
}
