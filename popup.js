document.getElementById('copyUrlBtn').addEventListener('click', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentUrl = tabs[0].url;    
    navigator.clipboard.writeText(filterUrl(currentUrl));
    window.close();
  });
});
