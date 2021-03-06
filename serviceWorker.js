const cacheID = "syncboard4js-pwa-234"
const assets = [
    ".",
    "index.html",
    "css/halfmoon-variables.min.css",
    "js/halfmoon.min.js",
    "js/socket.io.min.js",
    "js/socket.io.min.js.map",
    "js/app.js",
    "js/socket.js",
    "js/sync.js",
    "images/icons/internet.svg",
    "images/icons/icon-512x512.png"
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(cacheID).then(cache => {
            cache.addAll(assets).then();
        })
    )
});

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(async function() {
        try {
            return await fetch(fetchEvent.request);
        } catch (err) {
            return caches.match(fetchEvent.request);
        }
    }());
});

self.addEventListener("message", messageEvent => {
    if (messageEvent.data === "clear-cache") {
        caches.keys().then(function (names) {
            for (let name of names)
                caches.delete(name).then();
        });
    }
});
