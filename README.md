slacksay
---
provides a command-line interface for posting messages to slack via webhooks

usage
---

You'll need to set the environment variable `SLACK_WEBHOOK_URL` to the generated
url of your slack webhook. Then pipe text through this or run with `-m`:

```
echo "some piped message" | npx slack-webhook-say
slack-webhook-say -m "message as an argument"
```
