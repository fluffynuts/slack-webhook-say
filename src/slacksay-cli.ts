#!/usr/bin/env node
import { gatherArgs, webhookUrlEnvVar } from "./gather-args";
import { sendMessage } from "./slacksay";
import readline from "readline";

(async function main() {
    const args = gatherArgs({
        "webhook-url": process.env[webhookUrlEnvVar]
    });
    if (!args["webhook-url"]) {
        throw new Error(`webhook-url not specified on the cli or set via env var ${webhookUrlEnvVar}`);
    }
    const sender = sendMessage.bind(null, args["webhook-url"]);
    if (args.message) {
        await sender(args.message);
        return;
    }
    // try to read from stdin
    const lineReader = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    let lastSend = Promise.resolve();

    await new Promise((resolve, reject) => {
        lineReader.on("close", resolve);
        lineReader.on("line", line => {
            lastSend = lastSend.then(() => sender(line));
        });
    });
})();
