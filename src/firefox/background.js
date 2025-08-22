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
   
browser.contextMenus.create({
        id: "bettershare-copy-page-url",
        title: "[BetterShare] Copy page url"
    },
    () => void browser.runtime.lastError,
);

browser.runtime.onInstalled.addListener((listener) => {
    // Set this up so if the config already exists it doesn't wipe it
    var data = {};
    console.log("[BetterShare] Resetting config data");
    data.mappings = defaultMappings;
    browser.storage.local.set(data, () => {});
});

browser.runtime.onMessage.addListener(async (request, sender) => {
  if (request.action === "filterUrl") {
        try {
            const text = await filterUrl(await navigator.clipboard.readText());
            console.log("[BetterShare] Attempting to modify url: ", text);
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error("[BetterShare] Failed to modify url.", err);
        }
    }
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  switch (info.menuItemId) {
    case "bettershare-copy-page-url":
        try {
            const text = await filterUrl(tab.url);
            console.log("[BetterShare] Fixed Url: ", text);
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error("[BetterShare] Failed to parse url.", err);
        }
      break;
  }
});

async function filterUrl(baseUrl) {
    try {
        const url = new URL(baseUrl);

        var loadedMappings = [];
        const settings = await new Promise(resolve => {
            browser.storage.local.get(['mappings'], resolve);
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
            if (proxy.enabled === "true" && url.hostname == proxy.mask) {
                url.hostname = url.hostname.replace(proxy.mask, proxy.value);
                break;
            }
        }
        
        return url.toString();
    } catch (err) {
        console.log("[BetterShare] Failed to filter Url: ", err);
        return baseUrl;
    }
}

function isValidHttpUrl(url) {
    return /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(url);
}
