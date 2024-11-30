function filterUrl(baseUrl) {
    let url = "";
    if (baseUrl.includes("youtu.be")) {
        url = baseUrl.replace(/\?.*$/, "");
    } else if (baseUrl.includes("x.com")) {
        url = baseUrl.replace("x.com", "fxtwitter.com");
    } else if (baseUrl.includes("instagram.com")) {
        url = baseUrl.replace("instagram.com", "ddinstagram.com").replace("/\?source=.*$/", "");
    } else if (baseUrl.includes("tumblr.com")) {
        url = baseUrl.replace("tumblr.com", "tpmblr.com").replace("/\?source.*$/", "");
    } else {
        url = baseUrl;
    }

    console.log("Filtered url: " + url);
    return url;
}