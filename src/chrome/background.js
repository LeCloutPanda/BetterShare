const defaultMappings = `twitter.com:fxtwitter.com:true
x.com:fxtwitter.com:true
instagram.com:ddinstagram.com:true
tumblr.com:tpmblr.com:true
reddit.com:rxddit.com:true
furaffinity.net:true
bsky.app:fxbsky.app:true
tiktok.com:vxtiktok.com:true`;

const defaultParams = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid',
    'gclid', 'igshid', 'ref', 'ref_src', 'source', 'si', 'ab_channel', 'is_from_webapp',
    'sender_device'
];

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "bettershare.copypageurl",
        title: "[Better Share] Copy page url",
        contexts: ["page"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "bettershare.copypageurl" && tab.id && tab.url) {
        try {
            const baseUrl = tab.url;       
            const filteredUrl = await filterUrl(baseUrl);

            chrome.tabs.sendMessage(tab.id, { action: "copyToClipboard", content: filteredUrl }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("[BetterShare] Error: ", chrome.runtime.lastError.message);
                } else {
                    console.error("[BetterShare] Error: ", response?.error);
                }
            });
        } catch (err) {
            console.error("[BetterShare] Error: ", err);
        }
    }
});


chrome.runtime.onInstalled.addListener(() => {
    // Set this up so if the config already exists it doesn't wipe it
    var data = {};
    console.log("[BetterShare] Resetting config data");
    data.mappings = defaultMappings;
    chrome.storage.local.set(data, () => {});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "filterUrl" && request.clipboard) {
        filterUrl(request.clipboard).then((url) => {
            console.log(url);
            sendResponse({ url });
        }).catch((err) => {
            console.error("Error in filterUrl:", err);
            sendResponse({ url: request.clipboard }); 
        });
        return true; 
    }
});


async function filterUrl(baseUrl) {
    try {
        const url = new URL(baseUrl);

        var loadedMappings = [];
        const settings = await new Promise(resolve => {
            chrome.storage.local.get(['mappings'], resolve);
        });
        const mappings = settings.mappings;
        mappings.split("\n").forEach(map => {
            var values = map.split(":");
            var mask = values[0];
            var value = values[1];
            var enabled = values[2];

            if (mask === undefined) return;
            if (mask === undefined) return;
            if (enabled === undefined) return;

            const data = { 
                "mask": mask,
                "value": value,
                "enabled": enabled
            }

            loadedMappings.push(data);
        });

        for (const proxy of loadedMappings) {
            if (proxy.enabled === "true" && url.hostname.includes(proxy.mask)) {
                url.hostname = url.hostname.replace(proxy.mask, proxy.value);
                break;
            }
        }
        
        return url.toString();
    } catch (err) {
        console.error("[BetterShare] Failed to filter Url: ", err);
        return baseUrl;
    }
}