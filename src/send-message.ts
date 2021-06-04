import bent, { RequestFunction, ValidResponse } from "bent";
import { ErrorHandlingStrategies, eventually } from "@codeo/eventually";
import { Configuration } from "./gather-args";

type Dictionary<T> = {
    [key: string]: T;
}
const bentCache: Dictionary<RequestFunction<ValidResponse>> = {
};

export type SendMessageFunction = (config: Configuration, message: string) => Promise<void>;

export async function sendMessage(
    config: Configuration,
    message: string
): Promise<void> {
    const post = postFunctionFor(config["webhook-url"]);
    let failed = false;
    await eventually(() => post("", {
        text: message
    }), {
        retries: config.retries,
        backoff: [ 250, 500, 1000, 2000 ],
        fail: async (e: Error) => {
            failed = true;
            console.error(`Unable to send message:\n"${message}"\n${e}`);
            return ErrorHandlingStrategies.suppress;
        }
    });
    if (!failed && config.echo) {
        console.log(message);
    }
}

function postFunctionFor(url: string) {
    if (bentCache[url]) {
        return bentCache[url];
    }

    const post = bent(url, "POST");
    bentCache[url] = post;
    return post;
}
