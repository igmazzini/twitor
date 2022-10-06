importScripts('js/sw-utils.js');

const STATIC_CACHE      = 'static-v3';
const DYNAMIC_CACHE     = 'dynamic-v1';
const INMUTABLE_CACHE   = 'inmutable-v1';
//'/',
const APP_SHELL = [
    
    '/twittor/index.html',
    'css/style.css',    
    'img/favicon.ico',
    'js/app.js',
    'img/avatars/hulk.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/sw-utils.js',      
];

const APP_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',   
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',   
    'css/animate.css',
    'js/libs/jquery.js',    
    
];


self.addEventListener('install', evt =>{

    const inmutableCache = caches.open(INMUTABLE_CACHE)
        .then( cache => cache.addAll(APP_INMUTABLE));

    const staticCache = caches.open(STATIC_CACHE)
        .then( cache => cache.addAll(APP_SHELL));


    evt.waitUntil( Promise.all([ inmutableCache, staticCache ]) );    
});


self.addEventListener('activate', evt => {

    caches.keys()
        .then( keys => {

            keys.forEach(key => {
                
                if(key.includes('static') && key != STATIC_CACHE){
                    return caches.delete(key);
                }
            });
        });
});


self.addEventListener('fetch', evt => {


    const response = caches.match( evt.request )
        .then( resp => {

            if(resp){

                return resp;

            }else{

               return fetch( evt.request )
                    .then( resp => {
                        return saveDynamicCache(DYNAMIC_CACHE, evt.request , resp);
                    })
            }
        })

    evt.respondWith( response );
});