const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v1');
  for(let i=0;i<resources.length;i++){
    if((await cache.match(resources[i]))===undefined){
      await cache.add(resources[i]);
    }
  }
};

const reAddResourcesToCache = async (resources) => {
  const cache = await caches.open('v1');
  await cache.addAll(resources);
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
      '/',
      '/index.html',
      '/index.bundle.css',
      '/index.bundle.js',
      'https://cdn.bootcdn.net/ajax/libs/localforage/1.10.0/localforage.min.js',
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
      'https://www.baidu.com/favicon.ico',
      'https://so.com/favicon.ico',
      'https://sogou.com/favicon.ico',
      'https://api.iowen.cn/favicon/google.com.png'
    ])
  );
});


const cacheFirst = async ({ request, preloadResponsePromise}) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to get the resource from the network
    return fetch(request);
};

self.addEventListener('fetch',(event)=>{
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
    })
  );
})

self.addEventListener('message',function(ev){
  if(ev.data=='update'){
    reAddResourcesToCache([
      '/',
      '/index.html',
      '/index.bundle.css',
      '/index.bundle.js'
    ]).then(function(){
      ev.source.postMessage('updated')
    })
  }
})