<!-- Service Worker Caching Strategies:
//in SW.js

//steps//
Cache FIRST - check the cache then attempt a fetch
Network FIRST - attempt a fetch and check the cache if that fails
Stale While Revalidate - send the copy from cache before doing a fetch to update the cache with the new copy
(go to the cache first, )
Network ONLY - only attempt to fetch
Cache ONLY - only return cache the cached file if it exists


You can use the same strategy for all files on a site, but more likely you will use different strategies based on the type of file or whether you are currently online or offline.
You can put all your code inside the fetch event listener's ev.respondWith() with if statements. Or you can build a function for each strategy and call the function from inside those if statements.
window.navigator.onLine is a boolean that indicates if the browser has an active internet connection. It can be called from app.js or from inside your Service Worker. -->
