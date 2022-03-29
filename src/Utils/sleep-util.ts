/**
 * Sleep for a given number of seconds
 * @param seconds Number of seconds to sleep
 */
export function sleep(seconds: number): Promise<null> {
    const milliseconds = seconds * 1000
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

/**
 * Sleep for a given number of milliseconds
 * @param milliseconds Number of milliseconds to sleep
 */
export function sleepMilliSec(milliseconds: number): Promise<null> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
