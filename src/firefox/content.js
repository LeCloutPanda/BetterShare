document.addEventListener('copy', async (e) => {
    await browser.runtime.sendMessage({ action: "filterUrl" });
    e.preventDefault();
});