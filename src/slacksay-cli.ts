#!/usr/bin/env node
import { Configuration, gatherArgs, webhookUrlEnvVar } from "./gather-args";
import { sendMessage } from "./send-message";
import readline from "readline";
import { BatchSender } from "./batch-sender";

(async function main() {
    const args = gatherArgs({
        "webhook-url": process.env[webhookUrlEnvVar],
        echo: false,
        retries: 5,
        "batch-size": 1
    });
    if (!args["webhook-url"]) {
        throw new Error(`webhook-url not specified on the cli or set via env var ${ webhookUrlEnvVar }`);
    }
    const config = args as unknown as Configuration;
    if (args.message) {
        await sendMessage(
            config,
            args.message
        );
        return;
    }
    // try to read from stdin
    const lineReader = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    let lastSend = Promise.resolve();

    const batch = new BatchSender();
    await new Promise<void>((resolve, reject) => {
        lineReader.on("close", async () => {
            try {
                await batch.flush();
                resolve();
            } catch (e) {
                console.error(`Unable to flush: ${e}`);
                reject();
            }
        });
        lineReader.on("line", line => {
            lastSend = lastSend.then(
                () => batch.sendMessage(config, line)
            );
        });
    });
})();
