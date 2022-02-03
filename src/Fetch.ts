import Helpers from './Helpers'

export default class FetchRewriter {
    private bypass = [
        {
            'endpoint': '/pass',
            'action': this.mockReq
        },
        {
            'endpoint': '/v2/batch/event',
            'action': this.mockReq
        }
    ]
    private before = [
        {
            'endpoint': '/v2/fast-match/teasers',
            'action': this.unblurLikes
        }
    ]

    pass(input: RequestInfo) {
        const path = Helpers.getPath(input.toString())
        const index = this.bypass.findIndex(item => path.includes(item.endpoint))
        if (index !== -1) {
            return this.bypass[index].action(input)
        }
        return undefined
    }

    mod (input: RequestInfo, init: RequestInit | undefined) {
        const path = Helpers.getPath(input.toString())
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

    // -- Bypass -- //
    /**
     * Skips request and mocks response
     */
    mockReq(input: RequestInfo): Response {
        Helpers.log(`Bypassing request from ${input.toString()}`)
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
}
