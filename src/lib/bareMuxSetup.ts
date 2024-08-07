import storage from "./localStorage.ts";
import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

export default async function setupBareMux() {
    const wispUrl = 
        (location.protocol === "https:" ? "wss" : "ws") + "://" + origin.replace(
            (location.protocol === "https:" ? "https" : "http") + "://",
            ""
        ) + "/wisp/";

    const transport = storage.get("transport") || "epoxy";

    // @ts-ignore
    const connection = new BareMuxConnection("/baremux/worker.js");

    await connection.setTransport(
        (
            transport === "epoxy" ?
            "/epoxy/index.mjs" :
            transport === "libcurl" ?
            "/libcurl/index.mjs" :
            "/epoxy/index.mjs"
        ), [{ wisp: wispUrl }]
    );

    console.log(`Set transport to "/${transport}/index.mjs"`);
};