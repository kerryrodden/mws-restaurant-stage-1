// Service worker. Written with reference to:
// https://developers.google.com/web/fundamentals/primers/service-workers/
// https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker

const currentCacheName = 'restaurant-reviews-20180622';

// Cache page content on install.
self.addEventListener('install', function (event) {
  var urlsToCache = [
    '/',
    'index.html',
    'restaurant.html',
    'js/main.js',
    'js/dbhelper.js',
    'js/restaurant_info.js',
    'css/styles.css',
    'data/restaurants.json',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/7.jpg',
    'img/8.jpg',
    'img/9.jpg',
    'img/10.jpg'
  ];

  event.waitUntil(
    caches.open(currentCacheName).then(function (cache) {
      return cache.addAll(urlsToCache);
    }).catch(function (error) {
      console.log('Service worker error when adding URLs to cache:', error);
    }));
});

// Invalidate any old caches as needed.
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== currentCacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    }).catch(function (error) {
      console.log('Service worker error when deleting old caches:', error);
    })
  );
});

// Serve requests from the cache first, then from the network.
self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);
  // Don't try to intercept anything dynamic from the Google Maps API.
  if (url.hostname !== 'maps.googleapis.com') {
    event.respondWith(
      caches.match(event.request, {ignoreSearch: true}).then(function (response) {
        return response || fetch(event.request);
      }).catch(function (error) {
        console.log('Service worker error when fetching:', error);
      })
    );
  }
});