import bent from "bent";
export async function sendMessage(
    webhookUrl: string,
    message: string
) {
    const post = bent(webhookUrl, "POST");
    await post("", {
        text: message
    });
}
