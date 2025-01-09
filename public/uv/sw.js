importScripts('uv.bundle.js');
importScripts('uv.config.js');
importScripts(__uv$config.sw || 'uv.sw.js');
self.decode = __uv$config.decodeUrl;
let plugins = [];

function loadPlugin(plugin) {
    const { userCode, ...info } = plugin;
    if(info.type === 'tag') {
        const finalCode = `<script>(${userCode})()</script>`;
        __uv$config.inject = {
            host: info.hosts,
            injectTo: info.when || 'head',
            html: finalCode
        };
    } else if(info.type === 'eval') {
        
    }
}

self.addEventListener('message', (e) => {
    const { reason, data } = e;
    switch(reason) {
        case 'add-plugin':
            plugins.push(data);
            loadPlugin(data);
            break;
        case 'remove-plugin':
            plugins = plugins.filter(p => p.id !== data.id);
            break;
        default:
            console.warn(`Received unknown message reason: ${data}`);
            break;
    }
})

const uv = new UVServiceWorker();

async function handleRequest(event) {
    if (!uv.route(event)) {
        return await fetch(event.request);
    }

    let modifiedEvent = event;
    const hostname = decode(event.request.referrer.replace(`${location.origin}/uv/service/`, ''));    

    const matchingPlugins = plugins.filter(p => p.hosts?.test(hostname) &&  p.type === 'network');;

    for (const plugin of matchingPlugins.filter(p => p.when === 'before')) {
        modifiedEvent = await plugin.code(modifiedEvent);
    }

    let response = await uv.fetch(modifiedEvent);

    for (const plugin of matchingPlugins.filter(p => p.when === 'after')) {
        response = await plugin.code(response);
    }

    return response;
}

self.addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event));
});