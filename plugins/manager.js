import fs from 'fs';
import path from 'path';

const pluginList = (() => {
    try {
      return fs.readdirSync(path.dirname(new URL(import.meta.url).pathname))
        .filter(file => file !== path.basename(new URL(import.meta.url).pathname) && file !== 'example.js')
        .map(file => path.parse(file).name);
    } catch (err) {
      console.error('Error reading the directory:', err);
    }
  })();  

async function getPluginCode(id) {
    const extension = await import(path.resolve(`./plugins/${id}.js`));
    return extension.default.code;
}

async function getPluginInfo(id) {
    const extension = await import(path.resolve(`./plugins/${id}.js`));
    console.log(extension.default.info);
    return {...extension.default.info, id};
}



export { pluginList, getPluginCode, getPluginInfo }