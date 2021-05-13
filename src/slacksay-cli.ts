#!/usr/bin/env node
import { gatherArgs, webhookUrlEnvVar } from "./gather-args";
import { sendMessage } from "./slacksay";

(async function main() {
    const args = gatherArgs({
        "webhook-url": process.env[webhookUrlEnvVar]
    });
    if (!args["webhook-url"]) {
        throw new Error(`webhook-url not specified on the cli or set via env var ${webhookUrlEnvVar}`);
    }
    if (!args.message) {
        throw new Error(`reading from stdin not yet implemented - specify --message`);
    }
    await sendMessage(args["webhook-url"], args.message);
})();
