import yargs from "yargs";

export interface CliOptions {
    "webhook-url"?: string;
    message?: string;
    echo: boolean;
}

export const webhookUrlEnvVar = "SLACK_WEBHOOK_URL";

export function gatherArgs(
    defaults: Partial<CliOptions>
): CliOptions {
    return yargs.usage(`Usage: $0 [options]
or
echo "some message" | $0 [options]

see https://api.slack.com/messaging/webhooks#enable_webhooks for information on how to get started with webhook messaging`
    ).option("webhook-url", {
        alias: "u",
        type: "string",
        default: defaults["webhook-url"],
        description: `set the webhook url to use, can be set by environment variable ${webhookUrlEnvVar}`
    }).option("message", {
        alias: "m",
        type: "string",
        description: "provide the message to send when omitted, will be read from stdin"
    }).option("echo", {
        type: "boolean",
        default: false,
        description: "echo input to stdout - useful if run within automated processes with logging"
    }).argv;
}
