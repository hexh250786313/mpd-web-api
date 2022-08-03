[toc]

It exposes REST API for web-based MPD client.

It was inspired by [mpd-api](https://github.com/cotko/mpd-api#api) and [andersevenrud/mycardashpoc](https://github.com/andersevenrud/mycardashpoc/tree/main/packages/api)

## Usage

```shell
git clone https://github.com/hexh250786313/mpd-web-api
cd mpd-web-api
yarn start # http://localhost:8080 or "PORT=8980 yarn start" to use port 8980
```

## Http API

### Native APIs

The "native" means that they are implemented for [mpd-api](https://github.com/cotko/mpd-api#api)

Every native API is prefixed with `/mpd/native/` and corresponds to one of mpd-api function, see this: https://github.com/cotko/mpd-api#api

Native APIs are listed [below](#native-apis-list).

Method of every native API is `POST`

#### Request Example

- Method: **POST**
- URL: `/mpd/native/db/list`
- Body:
  - `commandArgs`: it means the arguments of mpd-api function. type: `undefined | Array<string | boolean | number>`
    ```json
    {
      "commandArgs": ["date", "(artist contains 'Empire')", ["album"]] // then you get the result of mpd-api function: client.db.list("date", "(artist contains 'Empire')", ["album"])
    }
    ```

#### Response Example

- Body
  ```json
  {
    "code": 200, // 400 if got error from mpd-api function
    "message": "OK", // error message if got error from mpd-api function
    "data": [ // result from client.db.list("date", "(artist contains 'Empire')", ["album"])
      {
        "file": "song.ape",
        "last_modified": "2017-01-04T17:39:57Z",
        "format": {
          "sample_rate": 44100,
          "bits": 16,
          "channels": 2,
          "original_value": "44100:16:2"
        },
        "artist": "Empire",
        "album": "album",
        "title": "title",
        "track": 5,
        "genre": "Pop",
        "time": 290,
        "duration": 289.96
      }
    ]
  }
  ```

#### API calls example

1. Find the corresponding function in [mpd-api](https://github.com/cotko/mpd-api#api), for example `db.search`, the corresponding API is `/mpd/native/db/search`
2. Pass parameters. `db.search` accepts a string parameter, for example `db.search('(artist contains "Empire")')`, the API request would be:

   ```javascript
   const { $fetch } = require('ohmyfetch')

   const mock = function (url) {
     if (!url) {
       throw new Error('Url required!')
     }

     const _fetch = async (commandArgs) => {
       const rawBody = { commandArgs }
       const opts = {
         method: 'post',
         headers: {
           'Content-Type': 'application/json',
           Accept: 'application/json, text/plain, */*',
         },
         credentials: 'include',
         mode: 'cors',
         cache: 'no-cache',
         body: JSON.parse(JSON.stringify(rawBody)),
       }

       return $fetch(url, opts).then((res) => {
         console.log(res)
       })
     }

     return _fetch
   }

   mock('http://127.0.0.1:8080/mpd/native/db/search')(['(artist contains "Empire")'])
   ```

### Web APIs

TODO

### Client APIs

Only one api: `/mpd/client/connect`, it is used to change the `host` / `port` / `password` of a MPD client connection and it will not do anything if the connection is already established

#### Request Example

- Method: **POST**
- URL: `/mpd/client/connect`
- Body:
  - `url`: type: `string`
  - `password`: type: `string`
    ```json
    {
      "url": "http://localhost:6600", // or "localhost:6600"
      "password": "123456"
    }
    ```

#### Response Example

- Body
  ```json
  {
    "code": 200, // 400 if MPD client has been connected
    "message": "MPD client is now listening on 'localhost:6600'",
    "data": null // { host: 'localhost', port: 6600, disconnected: false } if MPD client has been connected
  }
  ```


## WebSocket

Connect to websocket server: `ws://localhost:8080/`

### Send Message

TODO

## APIs List

### Native APIs List

All `POST`

| Native API                                |
| --------------------------------------- |
| /mpd/native/c2c/list                               |
| /mpd/native/c2c/subscribe                          |
| /mpd/native/c2c/unsubscribe                        |
| /mpd/native/c2c/sendMessage                        |
| /mpd/native/c2c/readMessages                       |
| /mpd/native/connection/close                       |
| /mpd/native/connection/kill                        |
| /mpd/native/connection/ping                        |
| /mpd/native/connection/getTagTypes                 |
| /mpd/native/connection/enableTagTypes              |
| /mpd/native/connection/disableTagTypes             |
| /mpd/native/connection/clearTagTypes               |
| /mpd/native/connection/enableAllTagTypes           |
| /mpd/native/connection/binarylimit                 |
| /mpd/native/db/listall                             |
| /mpd/native/db/listallinfo                         |
| /mpd/native/db/list                                |
| /mpd/native/db/count                               |
| /mpd/native/db/find                                |
| /mpd/native/db/findadd                             |
| /mpd/native/db/search                              |
| /mpd/native/db/searchadd                           |
| /mpd/native/db/searchaddpl                         |
| /mpd/native/db/lsinfo                              |
| /mpd/native/db/songinfo                            |
| /mpd/native/db/listfiles                           |
| /mpd/native/db/readcomments                        |
| /mpd/native/db/rescan                              |
| /mpd/native/db/update                              |
| /mpd/native/db/getfingerprint                      |
| /mpd/native/db/albumart                            |
| /mpd/native/db/albumartWhole                       |
| /mpd/native/db/readpicture                         |
| /mpd/native/db/readpictureWhole                    |
| /mpd/native/mounts/list                            |
| /mpd/native/mounts/listNeighbors                   |
| /mpd/native/mounts/mount                           |
| /mpd/native/mounts/unmount                         |
| /mpd/native/outputs/list                           |
| /mpd/native/outputs/enable                         |
| /mpd/native/outputs/disable                        |
| /mpd/native/outputs/toggle                         |
| /mpd/native/outputs/set                            |
| /mpd/native/partition/list                         |
| /mpd/native/partition/create                       |
| /mpd/native/partition/switchTo                     |
| /mpd/native/partition/delete                       |
| /mpd/native/partition/moveOutputToCurrentPartition |
| /mpd/native/playback/next                          |
| /mpd/native/playback/prev                          |
| /mpd/native/playback/pause                         |
| /mpd/native/playback/resume                        |
| /mpd/native/playback/toggle                        |
| /mpd/native/playback/play                          |
| /mpd/native/playback/playid                        |
| /mpd/native/playback/stop                          |
| /mpd/native/playback/seekcur                       |
| /mpd/native/playback/seek                          |
| /mpd/native/playback/seekid                        |
| /mpd/native/playback/getvol                        |
| /mpd/native/playback/consume                       |
| /mpd/native/playback/crossfade                     |
| /mpd/native/playback/mixrampdb                     |
| /mpd/native/playback/mixrampdelay                  |
| /mpd/native/playback/random                        |
| /mpd/native/playback/repeat                        |
| /mpd/native/playback/single                        |
| /mpd/native/playback/setvol                        |
| /mpd/native/playback/setReplayGain                 |
| /mpd/native/playback/getReplayGain                 |
| /mpd/native/playlists/get                          |
| /mpd/native/playlists/list                         |
| /mpd/native/playlists/listinfo                     |
| /mpd/native/playlists/load                         |
| /mpd/native/playlists/add                          |
| /mpd/native/playlists/clear                        |
| /mpd/native/playlists/deleteAt                     |
| /mpd/native/playlists/move                         |
| /mpd/native/playlists/rename                       |
| /mpd/native/playlists/remove                       |
| /mpd/native/playlists/save                         |
| /mpd/native/queue/add                              |
| /mpd/native/queue/addid                            |
| /mpd/native/queue/clear                            |
| /mpd/native/queue/info                             |
| /mpd/native/queue/id                               |
| /mpd/native/queue/delete                           |
| /mpd/native/queue/deleteid                         |
| /mpd/native/queue/move                             |
| /mpd/native/queue/moveid                           |
| /mpd/native/queue/find                             |
| /mpd/native/queue/search                           |
| /mpd/native/queue/prio                             |
| /mpd/native/queue/prioid                           |
| /mpd/native/queue/shuffle                          |
| /mpd/native/queue/swap                             |
| /mpd/native/queue/swapid                           |
| /mpd/native/queue/addtagid                         |
| /mpd/native/queue/cleartagid                       |
| /mpd/native/queue/getChanges                       |
| /mpd/native/queue/getChangesPosId                  |
| /mpd/native/queue/rangeid                          |
| /mpd/native/reflection/config                      |
| /mpd/native/reflection/commands                    |
| /mpd/native/reflection/notcommands                 |
| /mpd/native/reflection/urlhandlers                 |
| /mpd/native/reflection/decoders                    |
| /mpd/native/status/get                             |
| /mpd/native/status/clearerror                      |
| /mpd/native/status/currentsong                     |
| /mpd/native/status/stats                           |
| /mpd/native/sticker/list                           |
| /mpd/native/sticker/set                            |
| /mpd/native/sticker/get                            |
| /mpd/native/sticker/delete                         |
| /mpd/native/sticker/deleteAll                      |
| /mpd/native/sticker/find                           |
| /mpd/native/sticker/search                         |

### Web APIs List

| Web APIs                                |
| --------------------------------------- |
| TODO                               |

### Client APIs List

`POST`

| Client APIs                                |
| --------------------------------------- |
| /mpd/client/connect                               |
