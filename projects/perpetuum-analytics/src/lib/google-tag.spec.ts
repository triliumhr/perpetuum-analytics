import { installGoogleTag } from './google-tag'

describe('installGoogleTag', () => {
    it('explains that it needs a browser window', () => {
        const documentWithoutWindow = document.implementation.createHTMLDocument()

        expect(() => installGoogleTag(documentWithoutWindow, { tag: 'gtag', measurementId: 'G-TEST123' }, null)).toThrow(
            'perpetuum-analytics needs a browser window to load the Google tag.'
        )
    })
})
