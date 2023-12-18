import {text} from "./text";

const input = text


function getNumber(string: string) {
    const digits = string
        .replace(/one/g, 'one1one')
        .replace(/two/g, 'two2two')
        .replace(/three/g, 'three3three')
        .replace(/four/g, 'four4four')
        .replace(/five/g, 'five5five')
        .replace(/six/g, 'six6six')
        .replace(/seven/g, 'seven7seven')
        .replace(/eight/g, 'eight8eight')
        .replace(/nine/g, 'nine9nine')
        .replace(/\D/g, '')
    return Number(digits[0] + digits.slice(-1))
}

function sumNumbers(label: string, numbers: string) {
    let sum = 0
    numbers.split('\n').forEach((element) => {
        sum += getNumber(element)
    })
    console.log(`${label}: ${sum}`)
}

sumNumbers('input', input)