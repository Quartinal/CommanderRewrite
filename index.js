import { createServer } from "node:http";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import createRammerhead from "rammerhead/src/server/index.js";
import { createBareServer } from "@tomphttp/bare-server-node";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import serveStatic from "serve-static";
import express from "express";
import compression from "compression";
import pugStatic from "express-pug-static";
import stylus from "stylus";
import { build } from "astro";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { scramjetPath } from "@mercuryworkshop/scramjet";
import { uvPath as ultravioletPath } from "@titaniumnetwork-dev/ultraviolet";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
import chalk from "chalk";
import boxen from "boxen";
import terminalLink from "terminal-link";
import isDocker from "is-docker";

if (!existsSync("dist")) build({});

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

const bare = createBareServer("/bare/");
const rammerhead = createRammerhead();

const rammerheadScopes = [
    "/rammerhead.js",
    "/hammerhead.js",
    "/transport-worker.js",
    "/task.js",
    "/iframe-task.js",
    "/worker-hammerhead.js",
    "/messaging",
    "/sessionexists",
    "/deletesession",
    "/newsession",
    "/editsession",
    "/needpassword",
    "/syncLocalStorage",
    "/api/shuffleDict"
];

const rammerheadSession = /^\/[a-z0-9]{32}/;

const shouldRouteRammerhead = req => {
    const url = new URL(req.url, "http://0.0.0.0");
    return (
        rammerheadScopes.includes(url.pathname) ||
        rammerheadSession.test(url.pathname)
    );
};

const routeRammerheadRequest = (req, res) => {
    rammerhead.emit("request", req, res);
};

const routeRammerheadUpgrade = (req, socket, head) => {
    rammerhead.emit("upgrade", req, socket, head);
};

const staticOptions = {
    setHeaders: (res, path) => {
        if (path.endsWith(".cjs")) {
            res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        }
    }
};

app.use(pugStatic({
    baseDir: join(__dirname, "/dist/views"),
    baseUrl: "/views"
}));

app.use(stylus.middleware({
    src: __dirname + "/dist/stylus",
    dest: __dirname + "/dist/stylus",
    compile: (str, path) => {
        return stylus(str)
            .set("filename", path)
            .set("compress", true);
    }
}));

app.use(serveStatic(join(__dirname, "dist")));
app.use(compression());

app.use("/libcurl", serveStatic(libcurlPath, staticOptions));
app.use("/epoxy", serveStatic(epoxyPath, staticOptions));
app.use("/baremux", serveStatic(baremuxPath, staticOptions));

app.use("/baremodule", serveStatic(bareModulePath, staticOptions));

app.use("/scramjet", serveStatic(scramjetPath, staticOptions));
app.use("/ultraviolet", serveStatic(ultravioletPath, staticOptions));

app.use((req, res, next) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else if (shouldRouteRammerhead(req)) {
        routeRammerheadRequest(req, res);
    } else next();
});

server.on("upgrade", (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else if (req.url && req.url?.endsWith("/wisp/")) {
        wisp.routeRequest(req, socket, head);
    } else if (shouldRouteRammerhead(req)) {
        routeRammerheadUpgrade(req, socket, head);
    } else socket.end();
});

server.listen({ port: PORT }, () => {
    if (!isDocker()) {
        console.log(
            "\n\n" +
            chalk.whiteBright("Server listening on port ") + 
            chalk.green(String(PORT)) + "\n\n" +
            boxen(
                chalk.bold.gray("INFO"),
                {
                    backgroundColor: "blue",
                    borderColor: "blueBright",
                    width: 12,
                    height: 5,
                    padding: 1,
                    textAlignment: "center"
                }
            ) + "\n\n" +
            chalk.redBright(`Directory: ${__dirname}`) + "\n\n" +
            chalk.blueBright("Framework: Astro " + chalk.bold.yellow(":3")) + "\n\n" +
            chalk.hex("#f1f1f1").bold("Credits") + "\n\n" +
            terminalLink("mercury workshop", "https://github.com/MercuryWorkshop") + "\n" +
            terminalLink("titanium network", "https://github.com/titaniumnetwork-dev") + "\n"
        );
    }
});