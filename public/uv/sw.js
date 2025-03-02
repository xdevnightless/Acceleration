importScripts('uv.bundle.js');
importScripts('uv.config.js');
importScripts(__uv$config.sw || 'uv.sw.js');
self.decode = __uv$config.decodeUrl;
const uv = new UVServiceWorker();

let plugins = [];
let userAgent;

function loadPlugin(plugin) {
    if(plugins.find(p => p.id === plugin.id)) return;
    plugins.push(plugin);
    const { code, ...info } = plugin;
    console.log(plugin);
    console.log({
        host: info.hosts,
        injectTo: info.when || 'head',
        html: code,
        id: info.id
    });
    if(info.type === 'tag') {
        uv.config.inject.push({
            host: info.hosts,
            injectTo: info.when || 'head',
            html: `<script>${code}</script>`,
            id: info.id
        });
    } else if(info.type === 'eval') {
        uv.config.inject.push({
            host: info.hosts,
            injectTo: 'head',
            html: `<script>eval(${userCode})</script>`,
            id: info.id
        });
    } else {
        console.warn(`Unknown plugin type for ${info.id}: ${info.type}`);
    }
}

function removePlugin(id) {
    console.log(id);
    plugins = plugins.filter(p => p.id !== id);
    uv.config.inject = uv.config.inject.filter(p =>  p.id !== id);
}

self.addEventListener('message', (e) => {
    console.log(e);
    if(location.origin != e.origin) return;
    const { reason, data } = e.data;
    switch(reason) {
        case 'add-plugin':
            loadPlugin(data);
            break;
        case 'remove-plugin':
            removePlugin(data);
            break;
        case 'user-agent':
            userAgent = data;
        default:
            console.warn(`Received unknown message reason: ${reason}`);
            break;
    }
})

uv.on("request", async (event) => {
    event.data.headers["user-agent"] = userAgent ?? event.data.headers["user-agent"];
  });

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