export function extractHostAndPort(url: string) {
    return {
        port: url ? parseInt(url?.replace(/(^.*:)/g, '')) : undefined,
        host: url.replace(/(^https?:\/\/|:\d*$)/g, '') ?? undefined,
    }
}
