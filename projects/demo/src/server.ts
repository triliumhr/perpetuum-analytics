import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node'
import express from 'express'
import { randomBytes } from 'node:crypto'
import { join } from 'node:path'

const browserDistFolder = join(import.meta.dirname, '../browser')

const app = express()
// The demo only ever runs on this machine, for the end-to-end specs.
const angularApp = new AngularNodeAppEngine({ allowedHosts: ['localhost'] })

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
    express.static(browserDistFolder, {
        maxAge: '1y',
        index: false,
        redirect: false,
    })
)

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
    angularApp
        .handle(req)
        .then(async (response) => (response ? writeResponseToNodeResponse(await withNoncePolicy(response), res) : next()))
        .catch(next)
})

/**
 * Every page gets a fresh nonce and a strict Content Security Policy: scripts run only from this origin
 * or with the nonce. index.html carries `ngCspNonce="demo-csp-nonce"`, which Angular reads as CSP_NONCE,
 * so the Google tag loads through the nonce alone, with no Google host in script-src.
 */
async function withNoncePolicy(response: Response): Promise<Response> {
    if (!response.headers.get('content-type')?.includes('text/html')) return response

    const nonce = randomBytes(16).toString('base64')
    const headers = new Headers(response.headers)
    headers.delete('content-length')
    headers.set(
        'content-security-policy',
        [
            `script-src 'self' 'nonce-${nonce}'`,
            `style-src 'self' 'nonce-${nonce}'`,
            'connect-src https://*.google-analytics.com https://*.googletagmanager.com',
            "object-src 'none'",
            "base-uri 'self'",
        ].join('; ')
    )
    const html = (await response.text()).replaceAll('demo-csp-nonce', nonce)
    return new Response(html, { status: response.status, headers })
}

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
    const port = process.env['PORT'] || 4000
    app.listen(port, (error) => {
        if (error) {
            throw error
        }

        console.log(`Node Express server listening on http://localhost:${port}`)
    })
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app)
