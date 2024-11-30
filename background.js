document.addEventListener('copy', async (e) => {
    const clipboard = e.clipboardData || window.clipboardData;
    let baseUrl = (await navigator.clipboard.readText()).toString();
    console.log(baseUrl);
    navigator.clipboard.writeText(filterUrl(baseUrl));
    e.preventDefault();
});