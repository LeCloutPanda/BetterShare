document.addEventListener('DOMContentLoaded', () => {
    const fields = ['twitter', 'instagram', 'tumblr', 'reddit', 'furaffinity', 'bsky', 'tiktok'];
    const defaultValues = {
        twitter: 'fxtwitter.com',
        instagram: 'ddinstagram.com',
        tumblr: 'tpmblr.com',
        reddit: 'rxddit.com',
        furaffinity: 'fxfuraffinity.net',
        bsky: 'fxbsky.app',
        tiktok: 'vxtiktok.com'
    };

    // Load saved values
    chrome.storage.local.get(fields, (result) => {
        fields.forEach(field => {
            document.getElementById(field).value = result[field] || '';
        });
    });
  
    // Save values
    document.getElementById('saveBtn').addEventListener('click', () => {
        const data = {};
        fields.forEach(field => {
            data[field] = document.getElementById(field).value;
        });
        chrome.storage.local.set(data, () => {});
    });
  
    // Reset
    document.getElementById('resetBtn').addEventListener('click', () => {
        fields.forEach(field => {
            const defaultValue = defaultValues[field];
            document.getElementById(field).value = defaultValue;
        });
        chrome.storage.local.set(defaultValues, () => {});
    });
});