export default function sleep(ms: number): Promise<void> {
    // eslint-disable-next-line compat/compat, no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
}
