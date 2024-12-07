export default function chance(x) {
    const randomNumber = Math.floor(Math.random() * x) + 1
    return randomNumber === 1
}