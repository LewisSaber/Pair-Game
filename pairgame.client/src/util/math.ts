export function randomizeValues(values: unknown[]) {
    return shuffleArray(values.flatMap( v=> [v,v]))
}

function shuffleArray(array: unknown[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

export function generateUniqueRandomNumbers(count :number)  {
    const max = count * 10;
    const numbers: Set<number> = new Set();

    while (numbers.size < count) {
        const num = Math.floor(Math.random() * max) + 1;
        numbers.add(num);
    }

    return Array.from(numbers);
}