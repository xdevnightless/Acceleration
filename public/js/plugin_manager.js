import PluginRunner from "./plugin_runner.js";

export default class PluginManager extends PluginRunner {
    constructor() {
        super();
        console.log(this.plugins);
    }

    enablePlugin(id) {
        this.plugins.push(id);
        console.log(this.plugins)
        localStorage.setItem('plugins', JSON.stringify(this.plugins));
        super.loadPlugin(id);
    }

    disablePlugin(id) {
        this.plugins = this.plugins.filter(plugin => plugin !== id);
        console.log(this.plugins)
        localStorage.setItem('plugins', JSON.stringify(this.plugins));
        super.unloadPlugin(id);
    }

    async getPluginObjects() {
        const pluginsList = await this.getPlugins();
        const pluginObjects = [];
        for (const plugin of pluginsList) {
            const pluginInfo = await super.getPluginInfo(plugin);
            pluginObjects.push({
                ...pluginInfo,
                enabled: this.plugins.includes(plugin),
                id: plugin,
            });
        }
        return pluginObjects;
    }

    async getPlugins() {
        return (await fetch('/api/plugins')).json();
    }
}