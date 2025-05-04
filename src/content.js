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

        const settings = await new Promise(resolve => {
            chrome.storage.local.get(['twitter', 'instagram', 'tumblr', 'reddit', 'furaffinity', 'bsky', 'stripTracking', 'stripParams'], resolve);
        });

        // Fallback defaults for domains
        const domainToProxyMap = {
            'twitter.com': settings.twitter || 'fxtwitter.com',
            'x.com': settings.twitter || 'fxtwitter.com',
            'instagram.com': settings.instagram || 'ddinstagram.com',
            'tumblr.com': settings.tumblr || 'tpmblr.com',
            'reddit.com': settings.reddit || 'rxddit.com',
            'furaffinity.net': settings.furaffinity || 'fxfuraffinity.net',
            'bsky.app': settings.bsky || 'fxbsky.app',
            'tiktok.com': settings.tiktok || 'vxtiktok.com'
        };

        for (const [domain, proxy] of Object.entries(domainToProxyMap)) {
            if (url.hostname.includes(domain)) {
                url.hostname = proxy;
                break;
            }
        }

        const stripParams = (typeof settings.stripParams === 'string' && settings.stripParams.length > 0)
            ? settings.stripParams.split(',').map(param => param.trim())  
            : [
                'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid',
                'gclid', 'igshid', 'ref', 'ref_src', 'source', 'si', 'ab_channel', 'is_from_webapp',
                'sender_device'
            ];

        if (settings.stripTracking) {
            stripParams.forEach(param => {
                if (param) {
                    url.searchParams.delete(param);
                }
            });
        }

        return url.toString();
    } catch (err) {
        console.error('Failed to filter URL:', err);
        return baseUrl;
    }
}
