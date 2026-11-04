import { PageLocation } from './analytics-config'

/** The page address as the app chose to show it to Google, always absolute and on the page's own origin. */
export function cleanedAddress(address: URL, pageLocation: PageLocation): URL {
    const chosen =
        typeof pageLocation === 'function'
            ? pageLocation(new URL(address.href))
            : withOnlyTheseQueryParams(address, pageLocation.keepQueryParams)
    return onTheOriginOf(address, new URL(chosen, address))
}

function withOnlyTheseQueryParams(address: URL, kept: readonly string[]): URL {
    const cleaned = new URL(address.href)
    cleaned.search = ''
    for (const [name, value] of address.searchParams) {
        if (kept.includes(name)) cleaned.searchParams.append(name, value)
    }
    return cleaned
}

// Google would count another origin as a different site, so an address from elsewhere keeps only its path.
function onTheOriginOf(page: URL, chosen: URL): URL {
    if (chosen.origin === page.origin) return chosen
    return new URL(chosen.pathname + chosen.search + chosen.hash, page.origin)
}
