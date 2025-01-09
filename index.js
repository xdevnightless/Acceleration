import express from "express";
import wisp from "wisp-server-node";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { join } from "path";
import { pluginList, getPlugin, getPluginInfo } from "./plugins/manager.js"
import httpProxy from 'http-proxy';

const port = 8080;
const publicPath = fileURLToPath(new URL("./public/", import.meta.url));
const app = express();
const server = createServer();

app.use(express.static(publicPath, { maxAge: 604800000 })); //1 week
app.use("/epoxy/", express.static(epoxyPath));
app.use("/libcurl/", express.static(libcurlPath));
app.use("/baremux/", express.static(baremuxPath));
app.use("/uv/", express.static(uvPath));
app.use("/api/plugins", async (req, res) => {
    const id = req.query.id || 0;
    if (id && pluginList.includes(id)) {
        switch (req.headers['x-plugin-type']) {
            case 'code':
                res.status(200).send((await getPlugin(id)).toString());
                break;
            case 'info':
                res.status(200).send(await getPluginInfo(id));
                break;
            case 'full':
                res.status(200).send({
                    code: (await getPlugin(id)).toString(),
                    info: await getPluginInfo(id)
                });
                break;
            default:
                res.status(500).send(`Unknown type requested: ${req.headers['type']}`);
                break;
        }
    } else {
        if(!id) res.status(200).send(pluginList);
        else res.status(404).send(`Can't find plugin ${id}`);
    }
})

const proxy = httpProxy.createProxyServer();

app.use('/books/files', (req, res) => {
    const targetUrl = `https://phantom.lol/books/files/`;
    proxy.web(req, res, { target: targetUrl, changeOrigin: true }, (err) => {
        console.error('Proxy error:', err);
        res.status(500).send('Error while proxying the request.');
    });
});

app.use((req, res) => {
    res.status(404);
    res.sendFile(join(publicPath, "404.html"));
});

server.on("request", (req, res) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    app(req, res);
});

server.on("upgrade", (req, socket, head) => {
    if (req.url.endsWith("/wisp/"))
        wisp.routeRequest(req, socket, head);
    else socket.end();
});

server.on("listening", () => {
    const address = server.address();
    console.log(
        "\n\n\n\x1b[35m\x1b[2m\x1b[1m%s\x1b[0m",
        `Acceleration has started!\nRunning on port ${address.port}\nThe following extensions are available:`,
    );
    console.log(pluginList);
});

server.listen(port);
