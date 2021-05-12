const staticDevCoffee = "syncboard4js-pwa-57483925"
const assets = [
    ".",
    "index.html",
    "css/halfmoon-variables.min.css",
    "js/halfmoon.min.js",
    "js/socket.io.min.js",
    "js/socket.io.min.js.map",
    "sync.js"
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticDevCoffee).then(cache => {
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
