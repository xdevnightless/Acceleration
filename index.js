import express from "express";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { join } from "path";

const port = 8080;
const publicPath = fileURLToPath(new URL("./public/", import.meta.url));
const app = express();
const server = createServer();

app.use(express.static(publicPath, { maxAge: 604800000 })); //1 week
app.use("/epoxy/", express.static(epoxyPath));
app.use("/libcurl/", express.static(libcurlPath));
app.use("/baremux/", express.static(baremuxPath));
app.use("/uv/", express.static(uvPath));

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
        "\n\n\n\x1b[35m\x1b[2m\x1b[1m%s\x1b[0m\n",
        `Acceleration has started!\nRunning on port ${address.port}`,
    );
});

server.listen(port);
