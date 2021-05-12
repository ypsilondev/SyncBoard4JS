const cacheID = "syncboard4js-pwa-234"
const assets = [
    ".",
    "index.html",
    "css/halfmoon-variables.min.css",
    "js/res/halfmoon.min.js",
    "js/res/socket.io.min.js",
    "js/res/socket.io.min.js.map",
    "js/app/app.js",
    "js/app/socket.js",
    "js/app/sync.js",
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
