function filterUrl(baseUrl) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['twitterProxyUrl', 'tumblrProxyUrl', 'instagramProxyUrl', 'stripTrackingData'], (data) => {
            if (chrome.runtime.lastError) {
                console.error('Error reading storage:', chrome.runtime.lastError);
                reject('Failed to read storage');
                return;
            }

            let url = baseUrl;

            const domainToProxyMap = {
                'x.com': data.twitterProxyUrl,
                'instagram.com': data.instagramProxyUrl,
                'tumblr.com': data.tumblrProxyUrl
            };

            for (const [domain, proxyUrl] of Object.entries(domainToProxyMap)) {
                if (baseUrl.includes(domain) && proxyUrl) {
                    url = url.replace(domain, proxyUrl);
                    break;
                }
            }

            if (data.stripTrackingData) {
                url = url.replace(/(\?source=.*|(\?utm_source=.*)|(\?si=.*))$/, '');
            }

            console.log("Filtered URL:", url);
            resolve(url);
        });
    });
}
