document.addEventListener('copy', async (e) => {
    const clipboard = e.clipboardData || window.clipboardData;

    try {
        // Read the text from the clipboard
        let baseUrl = await navigator.clipboard.readText();
        console.log('Original URL:', baseUrl);

        // Wait for the filtered URL from filterUrl to be resolved
        const filteredUrl = await filterUrl(baseUrl);
        
        // Write the filtered URL back to the clipboard
        await navigator.clipboard.writeText(filteredUrl);

        console.log('Filtered URL written to clipboard:', filteredUrl);
    } catch (error) {
        console.error('Error processing the clipboard data:', error);
    }

    e.preventDefault();
});
