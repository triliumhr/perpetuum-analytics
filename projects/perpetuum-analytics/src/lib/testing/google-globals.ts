/**
 * What the page hands to Google, read back as plain arrays: gtag() pushes `arguments` objects,
 * Google Tag Manager events are plain objects.
 */
export function dataLayerEntries(): unknown[] {
    const dataLayer = (window as { dataLayer?: unknown[] }).dataLayer ?? []
    return dataLayer.map((entry) => (isArguments(entry) ? Array.from(entry) : entry))
}

export function gtagCommands(command: string): unknown[][] {
    return dataLayerEntries().filter((entry): entry is unknown[] => Array.isArray(entry) && entry[0] === command)
}

export function scriptsLoadedFrom(host: string): HTMLScriptElement[] {
    return Array.from(document.querySelectorAll('script')).filter((script) => script.src.includes(host))
}

export function forgetGoogle(): void {
    document.querySelectorAll('script').forEach((script) => script.remove())
    delete (window as { dataLayer?: unknown[] }).dataLayer
    delete (window as { gtag?: unknown }).gtag
}

function isArguments(entry: unknown): entry is IArguments {
    return Object.prototype.toString.call(entry) === '[object Arguments]'
}
