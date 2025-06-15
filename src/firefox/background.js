browser.runtime.onMessage.addListener(async (request, sender) => {
  if (request.action === "filterUrl") {
        try {
            const text = await filterUrl(await navigator.clipboard.readText());
            console.log("[BetterShare] Fixed Url: ", text);
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error("[BetterShare] Failed to parse url.", err);
        }
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