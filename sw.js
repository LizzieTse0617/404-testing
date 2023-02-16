const version = 9;
const cacheName = `The Cake is a lie ${version}`;
const cacheList = ['./', './index.html', './404.html', './main.js'];

//four of the primary fetch strategy

self.addEventListener('install', (ev) => {
  //step 2 - add files to the cache
  ev.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        cache.addAll(cacheList);
      })
      .catch((err) => {
        //usually you don't output this part. it is an error message if you have bug from deploy
        console.warn('DID NOT save everything in the cache');
      })
  );
});
self.addEventListener('activate', (ev) => {
  //step 3 -
  //take over from the old service worker
  //delete the old caches

  ev.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((nm) => nm != cacheName).map((nm) => caches.delete(nm))
      );
    })
  );
  //this part meaning Promise is now wrap around only the key(name) we have, and return to promise.all
});

self.addEventListener('fetch', (ev) => {
  //EVERY HTTP request from the browser
  /*
  Cache FIRST - check the cache then attempt a fetch
  Network FIRST - attempt a fetch and check the cache if that fails
  Stale While Revalidate - send the copy from cache before doing a fetch to update the cache with the new copy
  Network ONLY - only attempt to fetch
  Cache ONLY - only return cache the cached file if it exists
  */
  let isOnline = navigator.onLine;
  let mode = ev.request.mode; //`navigate` or something else
  let method = ev.request.method; // Post, get, put, patch, delete, head, options
  let url = new URL(ev.request.url);
  let pathname = url.pathname; //folder and filename (String)
  let port = url.port;
  let protocol = url.protocol;
  let querystring = url.search;
  console.log(mode, pathname, isOnline);

  if (isOnline) {
    ev.respondWith(staleWhileRevalidate(ev));
  } else {
    //not currently online
    if (mode === 'navigate') {
      ev.respondWith(caches.match('./404.html'));
    } else {
      ev.respondWith(cacheOnly(ev));
    }
  }
  // ev.respondWith(cacheFirst(ev));
  // ev.respondWith(networkFirst(ev));
  // ev.respondWith(networkOnly(ev));
  // ev.respondWith(cacheOnly(ev));
});

self.addEventListener('message', (ev) => {
  console.log(ev.data);
  if ('name' in ev.data) {
    console.log('hello', ev.data.name);
    //ev.data is the object being passed from the script
  }
});

//putting the fetch strategy inside a function and able to reuse it

//adding update cache and also do
function staleWhileRevalidate(ev) {
  console.log('staleWhileRevalidate');
  return caches.match(ev.request).then((cacheMatch) => {
    //try to overwrite the cache, if the request
    let fetchResponse = fetch(ev.request).then((response) => {
      caches.open(cacheName).then((cache) => {
        cache.put(ev.request, response);
      });
      return response.clone();
    });
    return cacheMatch || fetchResponse;
  });
}

function cacheOnly(ev) {
  return caches.match(ev.request);
}
//always give them a copy first
function cacheFirst(ev) {
  return caches.match(ev.request).then((cacheMatch) => {
    //we use promise to return cacheMatch (if it is true and passed from ev.request, if NOT, then return ev.request)
    if (cacheMatch) return cacheMatch;
    return fetch(ev.request);
  });
}
function networkOnly(ev) {
  return fetch(ev.request);
}
function networkFirst(ev) {
  return fetch(ev.request).then((fetchResponse) => {
    if (fetchResponse.ok) return fetchResponse;
    return caches.match(ev.request);
  });
}
