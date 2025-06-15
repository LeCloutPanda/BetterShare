document.addEventListener('copy', async (e) => {
    const clipboard = await navigator.clipboard.readText();
    chrome.runtime.sendMessage({ action: "filterUrl", clipboard: clipboard }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("[BetterShare] Error: ", chrome.runtime.lastError.message);
            return;
        }
        try {
            navigator.clipboard.writeText(response.url);
        } catch (err) {
            console.error("[BetterShare] Error: ", err);
        }
    });
    e.preventDefault();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "copyToClipboard" && message.content) {
        navigator.clipboard.writeText(message.content)
            .then(() => {
                console.log("[BetterShare] Content copied to clipboard:", message.content);
                sendResponse({ success: true });
            })
            .catch(err => {
                console.error("[BetterShare] Error: ", err);
                sendResponse({ success: false, error: err.message });
            });
        return true;
    }
});