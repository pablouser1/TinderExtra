import FetchRewriter from './Fetch'
import Helpers from './Helpers'

Helpers.log('STARTING')

const { fetch: origFetch } = window

const rewrite = new FetchRewriter()

// Fetch override
window.fetch = async (input: RequestInfo, init: RequestInit | undefined) => {
    const bypass = rewrite.pass(input)
    if (bypass) {
        return bypass
    } else {
        rewrite.mod(input, init)
        const response = await origFetch(input, init)
        return response
    }
}
