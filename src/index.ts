/// <reference path="types/GM_Config.ts" />
/// <reference path="types/tampermonkey-reference.d.ts" />

import FetchRewriter from './Fetch'
import Helpers from './Helpers'

// GM Config
GM_config.init({
    id: 'tinderextra',
    fields: {
        debug: {
            type: 'checkbox',
            label: 'Enable development mode',
            default: false
        },
        
    }
})

Helpers.log('STARTING')
const { fetch: origFetch } = unsafeWindow

const rewrite = new FetchRewriter()

// Fetch override
unsafeWindow.fetch = async (input: RequestInfo, init: RequestInit | undefined) => {
    const bypass = rewrite.pass(input)
    if (bypass) {
        return bypass
    } else {
        rewrite.mod(input, init)
        const response = await origFetch(input, init)
        return response
    }
}

// Adding config button
const config = document.createElement('button')
config.setAttribute('style', 'position: absolute;bottom: 0;')
config.onclick = () => GM_config.open()
config.innerText = 'TinderExtra Config'
document.body.appendChild(config)
