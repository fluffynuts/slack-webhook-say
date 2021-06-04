import { sendMessage, SendMessageFunction } from "./send-message";
import { Configuration } from "./gather-args";

type Optional<T> = T | undefined;

export interface IBatchSender {
    sendMessage: SendMessageFunction;
}

export class BatchSender {
    private _buffer: string[] = [];
    private _lastConfig: Optional<Configuration>;

    public async sendMessage(
        config: Configuration,
        message: string
    ): Promise<void> {
        this._buffer.push(message);
        this._lastConfig = config;
        if (config["batch-size"] > this._buffer.length) {
            return;
        }
        await this.flush();
    }

    public async flush(): Promise<void> {
        if (!this._lastConfig) {
            if (this._buffer.length === 0) {
                return; // not a real fail
            }
            throw new Error("No stored configuration to flush with");
        }
        const
            config = this._lastConfig,
            lines = this._buffer.splice(0, this._buffer.length).join("\n");
        this._lastConfig = undefined;
        await sendMessage(
            config,
            lines
        )
    }
}
