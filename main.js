document.addEventListener('DOMContentLoaded', () => {
  //step 1 - register the service worker
  navigator.serviceWorker.register('./sw.js');

  //phase 2 - for message event
  navigator.serviceWorker.ready.then((reg) => {
    //reg. - is the registration object
    //reg. active - is the current active sw
    reg.active.postMessage({ name: 'liz', food: 'apple' });
    //JS file send this script to service worker, it is a communication between user to service worker
    //for example, "user now finish login, or user agree to accept cookies"
  });
  window.onmessage = function (ev) {
    //ev.data - message back from the service worker
  };

  //feature detection
  if ('geolocation' in navigator) {
    //testing - would this work?
    //would this work => navigation.geolocation
  }
  if ('serviceWorker' in navigator) {
  }
  if ('ready' in navigator.serviceWorker) {
    //navigation.serviceWorker.ready
  }
});
