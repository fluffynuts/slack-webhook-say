async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
(async () => {
    for (let i = 0; i < 10; i++) {
        console.log(`test message: ${new Date()}`);
        await sleep(1000);
    }
})();
