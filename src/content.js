document.addEventListener('copy', async (e) => {
    const clipboard = e.clipboardData || window.clipboardData;

    try {
        // Read the text from the clipboard
        let baseUrl = await navigator.clipboard.readText();
        console.log('Original URL:', baseUrl);

        // Wait for the filtered URL from filterUrl to be resolved
        const filteredUrl = await filterUrl(baseUrl);
        
        // Write the filtered URL back to the clipboard
        await navigator.clipboard.writeText(filteredUrl);

        console.log('Filtered URL written to clipboard:', filteredUrl);
    } catch (error) {
        console.error('Error processing the clipboard data:', error);
    }

    e.preventDefault();
});

async function filterUrl(baseUrl) {
    try {
        const url = new URL(baseUrl);

        const domainToProxyMap = {
            'twitter.com': 'fxtwitter.com',
            'x.com': 'fxtwitter.com',
            'instagram.com': 'ddinstagram.com',
            'tumblr.com': 'tpmblr.com',
            'reddit.com': 'rxddit.com'
        };

        // Map known domains to privacy-friendly front-ends (excluding YouTube)
        for (const [domain, proxy] of Object.entries(domainToProxyMap)) {
            if (url.hostname.includes(domain)) {
                url.hostname = proxy;
                break;
            }
        }

        // Remove tracking parameters (including 'si' and others)
        const trackingParams = [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
            'fbclid', 'gclid', 'igshid', 'ref', 'ref_src', 'source', 'si',
            'ab_channel'
        ];

        trackingParams.forEach(param => url.searchParams.delete(param));

        return url.toString();
    } catch (err) {
        console.error('Failed to filter URL:', err);
        return baseUrl;
    }
}
