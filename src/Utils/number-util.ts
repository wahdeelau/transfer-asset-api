/**
 * Get random integer within a range
 * @param min Minimum number range
 * @param max Maximum number range
 */
export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min
}

/**
 * Sort array of numbers in descending order
 * @param array Array of numbers
 */
export function sortArrayByDescendingOrder(array: number[]): number[] {
    return array.sort((a, b) => b - a)
}

export function leadZeroPad(intN : number) : string
{ 
    let intNum = intN < 10 ? '0' + intN : intN
    return String(intNum);
}
