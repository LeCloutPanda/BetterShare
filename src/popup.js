document.getElementById('copyUrlButton').addEventListener('click', async function() {
  chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
    await navigator.clipboard.writeText(await filterUrl(tabs[0].url));
    window.close();
  });
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settingsForm');
    const twitterProxyUrl = document.getElementById('twitterProxyUrl');
    const tumblrProxyUrl = document.getElementById('tumblrProxyUrl');
    const instagramProxyUrl = document.getElementById('instagramProxyUrl');
    const stripTrackingData = document.getElementById('stripTrackingData');

    chrome.storage.sync.get(['twitterProxyUrl', 'tumblrProxyUrl', 'instagramProxyUrl', 'stripTrackingData'], (data) => {
        if (data.twitterProxyUrl) twitterProxyUrl.value = data.twitterProxyUrl;
        if (data.tumblrProxyUrl) tumblrProxyUrl.value = data.tumblrProxyUrl;
        if (data.instagramProxyUrl) instagramProxyUrl.value = data.instagramProxyUrl;
        if (data.stripTrackingData !== undefined) stripTrackingData.checked = data.stripTrackingData;
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const settings = {
            twitterProxyUrl: twitterProxyUrl.value,
            tumblrProxyUrl: tumblrProxyUrl.value,
            instagramProxyUrl: instagramProxyUrl.value,
            stripTrackingData: stripTrackingData.checked,
        };

        chrome.storage.sync.set(settings, () => {
            alert('Settings saved!');
        });
    });

    resetButton.addEventListener('click', () => {
        const defaultSettings = {
            twitterProxyUrl: 'fxtwitter.com',
            tumblrProxyUrl: 'tpmblr.com',
            instagramProxyUrl: 'ddinstagram.com',
            stripTrackingData: true,
        };

        twitterProxyUrl.value = defaultSettings.twitterProxyUrl;
        tumblrProxyUrl.value = defaultSettings.tumblrProxyUrl;
        instagramProxyUrl.value = defaultSettings.instagramProxyUrl;
        stripTrackingData.checked = defaultSettings.stripTrackingData;

        chrome.storage.sync.set(defaultSettings, () => {
            alert('Settings have been reset to default.');
        });
    });
});
