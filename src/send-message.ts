import bent, { RequestFunction, ValidResponse } from "bent";
type Dictionary<T> = {
    [key: string]: T;
}
const bentCache: Dictionary<RequestFunction<ValidResponse>> = {
};

export async function sendMessage(
    webhookUrl: string,
    echo: boolean,
    message: string
) {
    const post = postFunctionFor(webhookUrl);
    await post("", {
        text: message
    });
    if (echo) {
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
