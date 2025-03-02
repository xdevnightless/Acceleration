export default class PluginRunner {
    constructor() {
        this.plugins = JSON.parse(localStorage.getItem('plugins') || '[]');
        this.loadPlugins();
    }

    async loadPlugins() {
        for (const plugin of this.plugins) {
            await this.loadPlugin(plugin);
        }
    }

    async loadPlugin(id) {
        console.log("Loading plugin", id);
        navigator.serviceWorker.getRegistration(__uv$config.prefix).then(async (registration) => {
            console.log("Sending message to service worker");
            registration.active.postMessage({
                'reason': 'add-plugin',
                'data': { code: (await this.getPluginCode(id)), ...(await this.getPluginInfo(id)) }
            });
        });
    }

    async unloadPlugin(id) {
        console.log("Unloading plugin", id);
        navigator.serviceWorker.getRegistration(__uv$config.prefix).then((registration) => {
            console.log("Sending message to service worker");
            registration.active.postMessage({
                'reason': 'remove-plugin',
                'data': id
            });
        });
    }

    async getPlugin(id) {
        return (await fetch(`/api/plugins?id=${id}`, {
            headers: {
                'X-Plugin-Type': 'full'
            }
        })).json();
    }

    async getPluginCode(id) {
        return (await fetch(`/api/plugins?id=${id}`, {
            headers: {
                'X-Plugin-Type': 'code'
            }
        })).text();
    }

    async getPluginInfo(id) {
        const info = await fetch(`/api/plugins?id=${id}`, {
            headers: {
                'X-Plugin-Type': 'info'
            }
        }).then(r => r.json());
        console.log(info.hosts);
        info.hosts = new RegExp(info.hosts.replace(/^\/|\/$/g, ''));
        return info;
    }

}