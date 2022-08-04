import { $fetch as fetch, FetchOptions } from 'ohmyfetch'

const mock = function (url: string) {
    if (!url) {
        throw new Error('Url required!')
    }

    const _fetch = async (commandArgs?: any) => {
        const rawBody = { commandArgs }
        const opts: FetchOptions = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            // credentials: 'include',
            // mode: 'cors',
            // cache: 'no-cache',
            body: rawBody,
            async onResponse({ request, response }) {
                // Log response
                console.log('[fetch response]', response)
            },
        } as FetchOptions

        return fetch(url, opts).then((res) => {
            console.log(res)
            // console.log(res.data.directory[0])
        })
    }

    return _fetch
}

/** 添加某个歌曲到播放列表并播放 */
// mock("http://127.0.0.1:8080/queue/search")([
// '((album == "叶惠美") AND (title == "懦夫"))',
// ]);
// 如果存在要找的歌, 全部删除, 然后从当前位置插入到下一首然后播放
// mock("http://127.0.0.1:8080/queue/deleteid")([6]);
// mock("http://127.0.0.1:8080/db/searchadd")([
// '((album == "叶惠美") AND (title == "懦夫"))',
// "position",
// "+0",
// ]);
// mock("http://127.0.0.1:8080/playback/next")();

/** 添加某个歌曲到播放列表(放最后) */
// mock("http://127.0.0.1:8080/queue/search")([
// '((album == "叶惠美") AND (title == "懦夫"))',
// ]);
// 如果存在要找的歌, 删除全部, 然后插入到最后一位
// mock("http://127.0.0.1:8080/queue/deleteid")([6]);
// mock("http://127.0.0.1:8080/queue/info")(); // 知道最后一个的 pos
// mock("http://127.0.0.1:8080/db/searchadd")([
// '((album == "叶惠美") AND (title == "懦夫"))',
// "position",
// "8", // post + 1
// ]);

/** 查询 playlist / file / directory 信息, 只接受一个参数, 可以用来查一个歌的全部信息 */
// mock("http://127.0.0.1:8080/db/lsinfo")([
// "[2003] 叶惠美 - 01 - 以父之名 - 周杰伦.flac",
// ]);
