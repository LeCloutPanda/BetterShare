document.addEventListener('copy', async (e) => {
    const clipboard = e.clipboardData || window.clipboardData;

    try {
        let baseUrl = await navigator.clipboard.readText();
        const filteredUrl = await filterUrl(baseUrl);
        await navigator.clipboard.writeText(filteredUrl);

        console.log("[BetterShare] Parsed Url: ", filteredUrl);
    } catch (error) {
        console.error("[BetterShare] Failed to parse Url: ", err);
    }

    e.preventDefault();
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


/*        const stripParams = (typeof settings.stripParams === 'string' && settings.stripParams.length > 0)
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
            */