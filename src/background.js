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
        const filteredUrl = await filterUrl(baseUrl).then(filtered => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (text) => {
                    navigator.clipboard.writeText(text).then(() => {
                        console.log("[BetterShare] Parsed Url: ", text);
                    }).catch(err => {
                        console.error("[BetterShare] Failed to parse Url: ", err);
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