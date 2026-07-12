const CACHE_NAME = "matek-muhely-v29";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "./natural-icon.png",
  "./divisibility-icon.png",
  "./fractions-icon.png",
  "./decimals-icon.png",
  "./geometry-icon.png",
  "./school-crest.png",
  "./theory-natural.png",
  "./theory-divisibility.png",
  "./theory-fractions.png",
  "./theory-decimals.png",
  "./theory-geometry.png",
  "./summary-icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
