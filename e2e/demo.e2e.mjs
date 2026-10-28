// The demo app, built with real server-side rendering, driven in Chromium.
// Google is never contacted: gtag.js is answered with an empty script and every request to it is recorded.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { after, before, describe, it } from 'node:test'
import { chromium } from 'playwright'

const port = 4321
const origin = `http://localhost:${port}`

let server
let browser

before(async () => {
    server = spawn('node', ['dist/demo/server/server.mjs'], { env: { ...process.env, PORT: String(port) }, stdio: 'pipe' })
    await new Promise((resolve, reject) => {
        server.stdout.on('data', (chunk) => String(chunk).includes('listening') && resolve())
        server.on('exit', (code) => reject(new Error(`The demo server stopped with code ${code}`)))
    })
    browser = await chromium.launch()
})

after(async () => {
    await browser?.close()
    server?.kill()
})

async function openApp(path) {
    const page = await browser.newPage()
    const googleRequests = []
    const problems = []
    page.on('console', (message) => message.type() === 'error' && problems.push(message.text()))
    page.on('pageerror', (error) => problems.push(error.message))
    await page.route(/google(tagmanager|-analytics)\.com/, (route) => {
        googleRequests.push(route.request().url())
        return route.fulfill({ contentType: 'text/javascript', body: '' })
    })
    const response = await page.goto(origin + path)
    await page.waitForFunction(() => Array.isArray(window.dataLayer) && window.dataLayer.length > 3)
    return { page, response, googleRequests, problems }
}

function dataLayerOf(page) {
    return page.evaluate(() =>
        window.dataLayer.map((entry) => (Object.prototype.toString.call(entry) === '[object Arguments]' ? Array.from(entry) : entry))
    )
}

const directive = (policy, name) =>
    policy
        .split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name} `))

const events = (dataLayer, name) => dataLayer.filter((entry) => entry[0] === 'event' && entry[1] === name)

describe('demo app with server-side rendering', () => {
    it('serves complete HTML from the server, without Google', async () => {
        const html = await (await fetch(`${origin}/shop`)).text()

        assert.match(html, /Kenya AA/)
        assert.match(html, /<title>Shop<\/title>/)
        assert.match(html, /ng-server-context="ssr"/)
        assert.match(html, /ngh="/, 'the page carries hydration data, so the browser hydrates instead of rendering again')
        assert.doesNotMatch(html, /googletagmanager|dataLayer|gtag/)
    })

    it('loads gtag.js once in the browser and sets consent before anything else', async () => {
        const { page, googleRequests, problems } = await openApp('/shop')
        const dataLayer = await dataLayerOf(page)

        assert.deepEqual(googleRequests, ['https://www.googletagmanager.com/gtag/js?id=G-DEMO000000'])
        assert.deepEqual(dataLayer[0], [
            'consent',
            'default',
            { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' },
        ])
        assert.deepEqual(events(dataLayer, 'page_view'), [['event', 'page_view', { page_location: `${origin}/shop`, page_title: 'Shop' }]])
        assert.deepEqual(problems, [])
        await page.close()
    })

    it('sends one page view per navigation, with the new title', async () => {
        const { page, problems } = await openApp('/shop')

        await page.getByRole('link', { name: 'Home' }).click()
        await page.waitForFunction(() => document.title === 'Home')
        await page.waitForFunction(() => window.dataLayer.filter((entry) => entry[1] === 'page_view').length === 2)
        await page.getByRole('link', { name: 'Shop' }).click()
        await page.waitForFunction(() => window.dataLayer.filter((entry) => entry[1] === 'page_view').length === 3)

        const pageViews = events(await dataLayerOf(page), 'page_view').map((entry) => entry[2])
        assert.deepEqual(pageViews, [
            { page_location: `${origin}/shop`, page_title: 'Shop' },
            { page_location: `${origin}/`, page_title: 'Home' },
            { page_location: `${origin}/shop`, page_title: 'Shop' },
        ])
        assert.deepEqual(problems, [])
        await page.close()
    })

    it('sends the event of a perpetuumTrack button and passes on a consent choice', async () => {
        const { page, problems } = await openApp('/shop')

        await page.getByRole('button', { name: 'Add to cart' }).click()
        await page.getByRole('button', { name: 'Allow statistics' }).click()

        const dataLayer = await dataLayerOf(page)
        assert.deepEqual(events(dataLayer, 'add_to_cart'), [['event', 'add_to_cart', { currency: 'EUR', value: 12.5 }]])
        assert.deepEqual(dataLayer.at(-1), ['consent', 'update', { analytics_storage: 'granted' }])
        assert.deepEqual(problems, [])
        await page.close()
    })

    it('loads gtag.js under a nonce-based Content Security Policy, without a Google host in script-src', async () => {
        const { page, response, googleRequests, problems } = await openApp('/shop')
        const scriptPolicy = directive(response.headers()['content-security-policy'] ?? '', 'script-src') ?? ''
        const [, nonce] = scriptPolicy.match(/'nonce-([^']+)'/) ?? []

        assert.ok(nonce, `script-src carries a nonce: ${scriptPolicy}`)
        assert.doesNotMatch(scriptPolicy, /google/)
        const tagNonce = await page.evaluate(() => document.querySelector('script[src*="googletagmanager.com"]')?.nonce)
        assert.equal(tagNonce, nonce)
        assert.deepEqual(googleRequests, ['https://www.googletagmanager.com/gtag/js?id=G-DEMO000000'])
        assert.deepEqual(problems, [], 'the browser reports no Content Security Policy violation')
        await page.close()
    })
})
