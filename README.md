# mpd-web-api

It exposes REST API for web-based mpd client.

Most codes are from [andersevenrud/mycardashpoc](https://github.com/andersevenrud/mycardashpoc/tree/main/packages/api)

## Usage

```shell
git clone https://github.com/hexh250786313/mpd-web-api
cd mpd-web-api
yarn start # http://localhost:8080 or "PORT=8980 yarn start" to use port 8980
```

## Http API

All http APIs are listed [below](#apis).

### Request & Response

#### Request

- Method: **POST**
- URL: `/db/search`
- Body:
  - `fnArgs`: it means the arguments of mpd-api function
    ```
    {
      fnArgs: ["(artist contains 'Empire')"]
    }
    ```

#### Response

- Body
  ```
  {
    "code": 200,
    "message": "OK",
    "data": [
      {
        file: 'sone.ape',
        last_modified: '2017-01-04T17:39:57Z',
        format: {
          sample_rate: 44100,
          bits: 16,
          channels: 2,
          original_value: '44100:16:2'
        },
        artist: 'Empire',
        album: 'album',
        title: 'title',
        track: 5,
        genre: 'Pop',
        time: 290,
        duration: 289.96
      }
    ]
  }
  ```

### API calls example

Every API corresponds to one of mpd-api function, see this: https://github.com/cotko/mpd-api#api

1. Find the corresponding function in [mpd-api](https://github.com/cotko/mpd-api#api), for example `/db/search`, the corresponding function is `db.search`
2. Pass parameters. `db.search` accepts a string parameter, for example `db.search('(artist contains "Empire")')`, the API request would be:

   ```javascript
   const { $fetch } = require('ohmyfetch')

   const mock = function (url) {
     if (!url) {
       throw new Error('Url required!')
     }

     const _fetch = async (fnArgs) => {
       const rawBody = { fnArgs }
       const opts = {
         method: 'post',
         headers: {
           'Content-Type': 'application/json',
           Accept: 'application/json, text/plain, */*',
         },
         credentials: 'include',
         mode: 'cors',
         cache: 'no-cache',
         body: JSON.stringify(rawBody),
       }

       return $fetch(url, opts).then((res) => {
         console.log(res)
       })
     }

     return _fetch
   }

   mock('http://127.0.0.1:8080/db/search')(['(artist contains "Empire")'])
   ```

## WebSocket

Connect to websocket server: `ws://localhost:8080/status`

### status

Use below message to fire `status` event.

```typescript
wsConn.send(JSON.stringify({ channel: 'mpd', packet: 'report' }))
```

It sends current mpd status data every 1 second.

And use `deport` to stop sending.

```typescript
wsConn.send(JSON.stringify({ channel: 'mpd', packet: 'deport' }))
```

You can get message like this:

```typescript
const message = {
  channel: 'mpd',
  packet: 'status',
  data: MpdStatusObj,
}
```

## APIs

| POST API                                |
| --------------------------------------- |
| /c2c/list                               |
| /c2c/subscribe                          |
| /c2c/unsubscribe                        |
| /c2c/sendMessage                        |
| /c2c/readMessages                       |
| /connection/close                       |
| /connection/kill                        |
| /connection/ping                        |
| /connection/getTagTypes                 |
| /connection/enableTagTypes              |
| /connection/disableTagTypes             |
| /connection/clearTagTypes               |
| /connection/enableAllTagTypes           |
| /connection/binarylimit                 |
| /db/listall                             |
| /db/listallinfo                         |
| /db/list                                |
| /db/count                               |
| /db/find                                |
| /db/findadd                             |
| /db/search                              |
| /db/searchadd                           |
| /db/searchaddpl                         |
| /db/lsinfo                              |
| /db/songinfo                            |
| /db/listfiles                           |
| /db/readcomments                        |
| /db/rescan                              |
| /db/update                              |
| /db/getfingerprint                      |
| /db/albumart                            |
| /db/albumartWhole                       |
| /db/readpicture                         |
| /db/readpictureWhole                    |
| /mounts/list                            |
| /mounts/listNeighbors                   |
| /mounts/mount                           |
| /mounts/unmount                         |
| /outputs/list                           |
| /outputs/enable                         |
| /outputs/disable                        |
| /outputs/toggle                         |
| /outputs/set                            |
| /partition/list                         |
| /partition/create                       |
| /partition/switchTo                     |
| /partition/delete                       |
| /partition/moveOutputToCurrentPartition |
| /playback/next                          |
| /playback/prev                          |
| /playback/pause                         |
| /playback/resume                        |
| /playback/toggle                        |
| /playback/play                          |
| /playback/playid                        |
| /playback/stop                          |
| /playback/seekcur                       |
| /playback/seek                          |
| /playback/seekid                        |
| /playback/getvol                        |
| /playback/consume                       |
| /playback/crossfade                     |
| /playback/mixrampdb                     |
| /playback/mixrampdelay                  |
| /playback/random                        |
| /playback/repeat                        |
| /playback/single                        |
| /playback/setvol                        |
| /playback/setReplayGain                 |
| /playback/getReplayGain                 |
| /playlists/get                          |
| /playlists/list                         |
| /playlists/listinfo                     |
| /playlists/load                         |
| /playlists/add                          |
| /playlists/clear                        |
| /playlists/deleteAt                     |
| /playlists/move                         |
| /playlists/rename                       |
| /playlists/remove                       |
| /playlists/save                         |
| /queue/add                              |
| /queue/addid                            |
| /queue/clear                            |
| /queue/info                             |
| /queue/id                               |
| /queue/delete                           |
| /queue/deleteid                         |
| /queue/move                             |
| /queue/moveid                           |
| /queue/find                             |
| /queue/search                           |
| /queue/prio                             |
| /queue/prioid                           |
| /queue/shuffle                          |
| /queue/swap                             |
| /queue/swapid                           |
| /queue/addtagid                         |
| /queue/cleartagid                       |
| /queue/getChanges                       |
| /queue/getChangesPosId                  |
| /queue/rangeid                          |
| /reflection/config                      |
| /reflection/commands                    |
| /reflection/notcommands                 |
| /reflection/urlhandlers                 |
| /reflection/decoders                    |
| /status/get                             |
| /status/clearerror                      |
| /status/currentsong                     |
| /status/stats                           |
| /sticker/list                           |
| /sticker/set                            |
| /sticker/get                            |
| /sticker/delete                         |
| /sticker/deleteAll                      |
| /sticker/find                           |
| /sticker/search                         |
