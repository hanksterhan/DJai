/**
 * Generates a random string of specified length
 * @param length The length of the random string to generate
 * @returns A random string containing letters and numbers
 */
export function generateRandomString(length: number): string {
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);
    return Array.from(values)
        .map((x) => possible[x % possible.length])
        .join("");
}
