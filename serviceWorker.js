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
            cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})
