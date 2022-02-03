export default class Helpers {
    static log(msg: string) {
        if (GM_config.get('debug')) {
            console.log(`[TinderExtra] ${msg}`)
        }
    }

    static getPath(url_str: string) {
        const url = new URL(url_str)
        const path = url.pathname
        return path
    }
}
