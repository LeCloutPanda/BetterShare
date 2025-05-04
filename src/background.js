chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "bettershare.copypageurl",
        title: "[Better Share] Copy page url",
        contexts: ["page"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "bettershare.copypageurl") {
        const baseUrl = tab.url;
        console.log('Original URL:', baseUrl);
        
        const filteredUrl = await filterUrl(baseUrl).then(filtered => {
            // Inject clipboard writing code into the page context
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (text) => {
                    navigator.clipboard.writeText(text).then(() => {
                        console.log("Copied to clipboard:", text);
                    }).catch(err => {
                        console.error("Clipboard write failed:", err);
                    });
                },
                args: [filtered]
            });
        });
    }
});

async function filterUrl(baseUrl) {
    try {
        const url = new URL(baseUrl);

        // Get user-defined proxies from chrome.storage
        const settings = await new Promise(resolve => {
            chrome.storage.local.get(['twitter', 'instagram', 'tumblr', 'reddit', 'furaffinity', 'bsky'], resolve);
        });

        // Fallback defaults if not configured
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

        // Replace known domains
        for (const [domain, proxy] of Object.entries(domainToProxyMap)) {
            if (url.hostname.includes(domain)) {
                url.hostname = proxy;
                break;
            }
        }

        // Clean common tracking parameters
        const trackingParams = [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid',
            'gclid', 'igshid', 'ref', 'ref_src', 'source', 'si', 'ab_channel', 'is_from_webapp',
            'sender_device'
        ];

        trackingParams.forEach(param => url.searchParams.delete(param));

        return url.toString();
    } catch (err) {
        console.error('Failed to filter URL:', err);
        return baseUrl;
    }
}