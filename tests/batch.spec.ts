import * as faker from "faker";

const fakeSendMessageModule = {
    sendMessage: function() {
        // intentionally left blank
    }
};
jest.doMock("../src/send-message", () => fakeSendMessageModule);

import "expect-even-more-jest";
import { BatchSender } from "../src/batch-sender";
import { Configuration } from "../src";

describe(`batch`, () => {
    it(`should export the Batch class`, async () => {
        // Arrange
        // Act
        expect(BatchSender)
            .toBeConstructor();
        // Assert
    });


    describe(`when batch size is 1`, () => {
        it(`should send every message immediately`, async () => {
            // Arrange
            const
                config = createRandomConfig({ "batch-size": 1 }),
                sut = create(),
                messages = randomMessages();
            expect(messages.length)
                .toBeGreaterThan(0);
            // Act
            for (let message of messages) {
                await sut.sendMessage(config, message);
                expect(fakeSendMessageModule.sendMessage)
                    .toHaveBeenCalledWith(config, message);
            }
            // Assert
        });
    });

    describe(`when batch size is 2`, () => {
        it(`should batch 2 messages as 2 lines on one sendMessage`, async () => {
            // Arrange
            const
                config = createRandomConfig({ "batch-size": 2 }),
                sut = create(),
                messages = [
                    faker.random.words(),
                    faker.random.words()
                ],
                expected = messages.join("\n");
            // Act
            for (let message of messages) {
                await sut.sendMessage(config, message);
            }
            // Assert
            expect(fakeSendMessageModule.sendMessage)
                .toHaveBeenCalledOnceWith(config, expected);
        });

        it(`should batch the first 2 messages of 3 as 2 lines on one sendMessage`, async () => {
            // Arrange
            const
                config = createRandomConfig({ "batch-size": 2 }),
                sut = create(),
                messages = [
                    faker.random.words(),
                    faker.random.words(),
                    faker.random.words()
                ],
                expected = messages.slice(0, 2).join("\n");
            // Act
            for (let message of messages) {
                await sut.sendMessage(config, message);
            }
            // Assert
            expect(fakeSendMessageModule.sendMessage)
                .toHaveBeenCalledOnceWith(config, expected);
        });
    });

    it(`should flush any outstanding messages as one message`, async () => {
        // Arrange
        const
            config = createRandomConfig({ "batch-size": 3 }),
            sut = create(),
            messages = randomMessages(5, 5),
            expected1 = messages.slice(0, 3).join("\n"),
            expected2 = messages.slice(3, 5).join("\n");
        expect(messages)
            .toHaveLength(5);
        // Act
        for (let message of messages) {
            await sut.sendMessage(config, message);
        }
        await sut.flush();
        // Assert
        expect(fakeSendMessageModule.sendMessage)
            .toHaveBeenCalledWith(config, expected1);
        expect(fakeSendMessageModule.sendMessage)
            .toHaveBeenCalledWith(config, expected2);
    });

    function createRandomConfig(config?: Partial<Configuration>): Configuration {
        return {
            retries: faker.datatype.number(),
            echo: faker.datatype.boolean(),
            "batch-size": faker.datatype.number(),
            "webhook-url": faker.internet.url(),
            ...config
        };
    }

    function randomMessages(min?: number, max?: number): string[] {
        return Array.from(range(0, faker.datatype.number({ min: min ?? 2, max: max ?? 5 })))
            .map(_ => faker.random.words());
    }

    function* range(min: number, max: number) {
        for (let i = min; i < max; i++) {
            yield i;
        }
    }

    function create() {
        return new BatchSender();
    }

    beforeEach(() => {
        spyOn(fakeSendMessageModule, "sendMessage")
            .and.returnValue(Promise.resolve());
    });
});
