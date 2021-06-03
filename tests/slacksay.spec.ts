import "expect-even-more-jest";
import { sendMessage } from "../src";

describe(`send-message`, () => {
    it(`should export the sendMessage function`, async () => {
        // Arrange
        // Act
        expect(sendMessage)
            .toBeAsyncFunction();
        // Assert
    });
});
