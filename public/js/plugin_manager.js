let plugins = JSON.parse(localStorage.getItem('plugins') || '[]');
console.log(plugins)

function enablePlugin(id) {
    plugins.push(id);
    console.log(plugins)
    localStorage.setItem('plugins', JSON.stringify(plugins));
}

function disablePlugin(id) {
    plugins = plugins.filter(plugin => plugin !== id);
    console.log(plugins)
    localStorage.setItem('plugins', JSON.stringify(plugins));
}

async function getPluginObjects() {
    const pluginsList = await getPlugins();
    const pluginObjects = [];
    for (const plugin of pluginsList) {
        const pluginInfo = await getPluginInfo(plugin);
        pluginObjects.push({
            ...pluginInfo,
            enabled: plugins.includes(plugin),
            id: plugin,
        });
    }
    return pluginObjects;
}

async function getPlugins() {
    return (await fetch('/api/plugins')).json();
}

async function getPlugin(id) {
    return (await fetch(`/api/plugins?id=${id}`, {
        headers: {
            'X-Plugin-Type': 'code'
        }
    })).json();
}

async function getPluginInfo(id) {
    return (await fetch(`/api/plugins?id=${id}`, {
        headers: {
            'X-Plugin-Type': 'info'
        }
    })).json();
}

export { getPluginObjects, getPlugins, getPlugin, getPluginInfo, enablePlugin, disablePlugin }