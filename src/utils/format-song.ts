export type RawSong = {
    file: string
    last_modified: string
    format: {
        sample_rate: number
        bits: number
        channels: number
        sample_rate_short: {
            value: number
            unit: string
        }
        original_value: string
    }
    album: string
    artist: string[] | string
    date: string
    title: string
    track: number
    genre: string
    time: number
    duration: number
}

export type Song = Partial<{
    file: string
    last_modified: string
    format: Partial<{
        sample_rate: number
        bits: number
        channels: number
        sample_rate_short: Partial<{
            value: number
            unit: string
        }>
        original_value: string
    }>
    album: string
    artist: string[]
    date: string
    title: string
    track: number
    genre: string
    time: number
    duration: number
}>

export function formatSong(songs: RawSong[]): Song[] {
    return songs.map((song: RawSong) => {
        const next: Song = { ...song, artist: [] }

        if (Array.isArray(song.artist)) {
            next.artist = song.artist
        } else if (typeof song.artist === 'string') {
            next.artist = [song.artist]
        }

        return next
    })
}
