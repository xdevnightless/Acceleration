const closeHandler = (e) => { e.preventDefault() }
let handlerAdded = false;
let _blank = false
let _closer = false

Object.defineProperty(window, 'blank', {
    get() {
        return _blank;
    },
    set(nVal) {
        _blank = nVal;
        localStorage.setItem("blank", _blank);
        window.initBlank(nVal);
    },
    configurable: true
});

Object.defineProperty(window, 'closer', {
    get() {
        return _closer;
    },
    set(nVal) {
        _closer = nVal;
        localStorage.setItem("closer", _closer);
        window.initCloser(nVal);
    },
    configurable: true
});

window.initCloser = (v) => {
    if (v && !handlerAdded) { window.addEventListener("beforeunload", closeHandler); handlerAdded = true; }
    else { window.removeEventListener("beforeunload", closeHandler); handlerAdded = false; };
};

window.initBlank = (v) => {
    if (v) {
        console.log("Hi")
        let cUrl = window.location.href;
        if (cUrl !== "about:blank") {
            console.log("ABC")
            if (checkPopups()) {
                var win = window.open("about:blank", "_blank");
                win.document.write(`<html style='height:100%; margin:0; padding:0;'><body style='height:100%; margin:0; padding:0;'><iframe src='${cUrl}' style='width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;'></iframe></body></html>`);
                window.open('','_self').close()
            }
        }
    }
};

function checkPopups() {
    console.log("a")
    var nWin = window.open("", "", "width=100, height=100");
    if (nWin) {
        nWin.close();
        return true;
    } 
    else {
        alert("Please allow popups and redirects. Join the discord discord.gg/acceleration");
        return false;
    }
}