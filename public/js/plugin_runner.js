export default class PluginRunner {
    constructor() {

    }

    async loadPlugin(id) {
        navigator.serviceWorker.ready.then((registration) => {
            registration.active.postMessage({
                'reason': 'add-plugin',
                'data': { code: this.getPlugin(id), ...this.getPluginInfo(id) }
            });
        });
    }

    async unloadPlugin(id) {
        navigator.serviceWorker.ready.then((registration) => {
            registration.active.postMessage({
                'reason': 'remove-plugin',
                'data': { id: id }
            });
        });
    }

    async getPluginInfo(id) {
        return (await fetch(`/api/plugins?id=${id}`), {}).json();
    }

    async getPlugin() {
        return (await fetch(`/api/plugins?id=${id}`)).json();
    }


}