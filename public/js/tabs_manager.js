

import { BareMuxConnection } from "/baremux/index.mjs"

export class TabManager {
    constructor() {
        navigator.serviceWorker.register("/uv/sw.js");
        this.connection = new BareMuxConnection("/baremux/worker.js")
        this.tabsArr = [];
        this.activeTabIndex = -1;
        this.encode = (str) => { return __uv$config.encodeUrl(str) };
        this.decode = (str) => { return __uv$config.decodeUrl(str) };
        document.querySelector('#url-input').onkeydown = (e) => { if (e.key == "Enter") { this.load(e.target.value); }; };
    }

    fullscreen() {
        const iframe = this.tabsArr[this.activeTabIndex].iframe;
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
          } else if (iframe.mozRequestFullScreen) {
            iframe.mozRequestFullScreen();
          } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen();
          } else if (iframe.msRequestFullscreen) {
            iframe.msRequestFullscreen();
          }
    }

    forward(i = this.activeTabIndex) {
        this.tabsArr[i].iframe.contentWindow.history.forward();
    }

    backward(i = this.activeTabIndex) {
        this.tabsArr[i].iframe.contentWindow.history.back();
    }

    reload(i = this.activeTabIndex) {
        this.tabsArr[i].iframe.contentWindow.location.reload();
    }

    load(url, i = this.activeTabIndex) {
        this.tabsArr[i].iframe.src = this.search(url);
        if (url.startsWith("acceleration://")) this.tabsArr[i].img.src = '/icons/' + url.replace("acceleration://", '') + '.png';
        else this.tabsArr[i].img.src = `https://www.google.com/s2/favicons?domain=${url.replace("https://", '')}&sz=16`;
        this.updateOmni();
        this.tabsArr[i].iframe.focus();
    }

    search(input) {
        const template = "https://google.com/search?q=%s";
        let url;

        try {
            if (input.includes("acceleration://")) {
                url = "/" + input.replace("acceleration://", "") + ".html";
                return url;
            }
        } catch (err) { }

        try {
            url = new URL(input);
            if (url.hostname.includes(".")) {
                return (
                    '/uv/service/' + self.__uv$config.encodeUrl(url.toString())
                );
            }
        } catch (err) { }

        try {
            url = new URL(`https://${input}`);
            if (url.hostname.includes(".")) {
                return (
                    'uv/service/' + self.__uv$config.encodeUrl(url.toString())
                );
            }
        } catch (err) { }
        return (
            '/uv/service/' +
            self.__uv$config.encodeUrl(
                template.replace("%s", encodeURIComponent(input)),
            )
        );
    }

    createTab(url = 'acceleration://home' /*will add when done with new tab page (this.tabsArr.length === 0 ? 'acceleration://home' : 'acceleration://new')*/) {
        const obj = this.createTabObject(url);
        this.tabsArr.push(obj);
        this.switchTab(this.tabsArr.length - 1);
        this.load(url);
    }

    createTabObject(url) {
        const tabElem = document.createElement('div');
        tabElem.classList.add('tab');
        const titleElem = document.createElement('span');
        titleElem.innerText = 'Loading..';
        tabElem.prepend(titleElem);
        const imgElem = document.createElement('img');
        imgElem.classList.add('tab-icon');
        imgElem.src = `https://www.google.com/s2/favicons?domain=${url}&sz=16`;
        tabElem.prepend(imgElem);
        const closeBtn = document.createElement('span');
        closeBtn.innerText = '×';
        closeBtn.classList.add('close-tab');
        tabElem.appendChild(closeBtn);
        const iframeElem = document.createElement('iframe');
        iframeElem.classList.add('browser-frame');
        document.querySelector('.tab-bar').insertBefore(tabElem, document.querySelector('.add-tab'));
        document.querySelector('.iframe-container').appendChild(iframeElem);
        tabElem.onclick = (e) => {
            if (e.target != closeBtn) {
                this.switchTab(this.tabsArr.findIndex((obj) => obj.tab === tabElem));
            }
            else {
                this.closeTab(this.tabsArr.findIndex((obj) => obj.tab === tabElem));
            }
        }

        return {
            tab: tabElem,
            iframe: iframeElem,
            img: imgElem,
            title: titleElem
        };
    }

    switchTab(index) {
        document.querySelectorAll('.active').forEach(elem => elem.classList.remove('active'));
        this.tabsArr[index].tab.classList.add('active');
        this.tabsArr[index].iframe.classList.add('active');
        this.activeTabIndex = index;
        this.updateOmni();
    }

    closeTab(index) {
        let newIndex;
        if (index === this.activeTabIndex) {
            newIndex = this.tabsArr.length - 1 === index ? index - 1 : index;
        }
        this.tabsArr[index].tab.remove();
        this.tabsArr[index].iframe.remove();
        this.tabsArr.splice(index, 1);
        if (this.tabsArr.length == 0) this.createTab();
        if(newIndex) this.switchTab(newIndex);
    }

    updateOmni() {
        if (document.activeElement != document.querySelector('.url-input')) {
            let url = this.tabsArr[this.activeTabIndex].iframe.src.replace(location.origin, '');
            if (url.startsWith("/uv/service/")) {
                url = this.decode(url.replace('/uv/service/', ''))
            } else {
                url = 'acceleration:/' + url.replace('.html', '');
            }
            document.querySelector('#url-input').value = url;
        }

    }

    updateTabTitle(title, index = this.activeTabIndex) {
        this.tabsArr[index].tab.children[1].innerText = title;
    }

    async setTransport(transport = '/epoxy/index.mjs', url = `wss://${location.host}/wisp/`) {
        await this.connection.setTransport(transport, [{ wisp: url }]);
        return true;
    }
}
