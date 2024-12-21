import { TabManager } from "./tabs_manager.js";

window.tabs = new TabManager();
//Todo fix icon and name
document.querySelector('.add-tab').onclick = () => tabs.createTab();
await tabs.setTransport();
tabs.createTab();
