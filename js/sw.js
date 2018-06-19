self.addEventListener('install', function(event) {
  var urlsToCache = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/js/main.js',
    '/js/dbhelper.js',
    '/js/restaurant_info.js',
    '/css/styles.css',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg'
  ];

  event.waitUntil(
    caches.open('mws-restaurant-v1').then(function(cache) {
      return cache.addAll(urlsToCache);
    }));
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});