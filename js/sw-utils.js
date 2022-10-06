const  clearCache = (cacheName, itemsLimit)  => {


    caches.open(cacheName)
        .then( cache => {

            return cache.keys()
                .then(keys => {

                    if (keys.length > itemsLimit) {
                        cache.delete(keys[0])
                            .then(clearCache(cacheName, itemsLimit));
                    }
                });


        });
}


const saveDynamicCache = (dynamicCache, req, res) =>{

    if(res.ok){

        return caches.open(dynamicCache)
            .then( cache => {

                cache.put( req , res.clone());

                clearCache(dynamicCache,50);

                return res.clone();
            })
    }else{
        return res;
    }
}

