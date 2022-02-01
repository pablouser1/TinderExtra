import Helpers from './Helpers'

export default class FetchRewriter {
    path = ''
    bypass = [
        {
            'endpoint': '/pass',
            'action': this.mockPass
        }
    ]
    before = [
        {
            'endpoint': '/v2/fast-match/teasers',
            'action': this.unblurLikes
        }
    ]

    pass(input: RequestInfo) {
        const path = this.getPath(input.toString())
        const index = this.bypass.findIndex(item => path.includes(item.endpoint))
        if (index !== -1) {
            return this.bypass[index].action(input)
        }
        return undefined
    }

    mod (input: RequestInfo, init: RequestInit | undefined) {
        const path = this.getPath(input.toString())
        const index = this.before.findIndex(item => path.includes(item.endpoint))
        if (index !== -1) {
            this.before[index].action(init)
        }
    }

    // -- Before -- //
    unblurLikes (init: RequestInit | undefined) {
        Helpers.log('Unbluring likes')
        if (init) {
            // Overwrite headers, this will make the response contain unblured images
            init.headers = {
                "X-Auth-Token": localStorage.getItem('TinderWeb/APIToken') as string
            }
        }
    }

    mockPass(input: RequestInfo): Response {
        Helpers.log('Bypassing pass request')
        return {
            headers: {} as Headers,
            ok: true,
            redirected: false,
            status: 200,
            statusText: 'OK',
            type: 'cors',
            url: input.toString(),
            clone: function (): Response {
                throw new Error('Function not implemented.')
            },
            body: null,
            bodyUsed: false,
            arrayBuffer: function (): Promise<ArrayBuffer> {
                throw new Error('Function not implemented.')
            },
            blob: function (): Promise<Blob> {
                throw new Error('Function not implemented.')
            },
            formData: function (): Promise<FormData> {
                throw new Error('Function not implemented.')
            },
            json: async () => ({
                status: 200
            }),
            text: function (): Promise<string> {
                throw new Error('Function not implemented.')
            }
        }
    }

    // -- Helpers -- //
    getPath(url_str: string) {
        const url = new URL(url_str)
        const path = url.pathname
        return path
    }
}
