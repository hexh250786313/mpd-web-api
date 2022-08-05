import MPD from '../providers/MPD'
import { formatSong } from './format-song'

export async function getStoredPlaylist() {
    let data: any[] = []
    const list = await MPD.client?.api.playlists.get()
    if (list) {
        data = await Promise.all(
            list?.map(async (item: any) => {
                const list = await Promise.all(
                    (
                        await MPD.client?.api.playlists.list([item?.playlist])
                    )?.map(async (item: any) => {
                        return (
                            (await MPD.client?.api.db.lsinfo([
                                item?.file,
                            ])) as any
                        )?.file[0]
                    }) ?? []
                )
                const obj = {
                    last_modified: item?.last_modified,
                    name: item?.playlist,
                    list: formatSong(list ?? []),
                }
                return obj
            })
        )
    }
    return data
}
