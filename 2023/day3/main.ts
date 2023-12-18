import { text } from './text'

const sample = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`

const getLineNumbers = (line: string, lineIndex: number) => [...line.matchAll(/\d+/g)].map(match => ({
  value: parseInt(match[0]),
  startIndex: match.index!,
  endIndex: match.index! + match[0].length - 1,
  lineIndex: lineIndex
}))
const getLineSymbols = (line: string) => [...line.matchAll(/[^.\d]/g)].map(match => ({
  value: match[0],
  index: match.index!
}))


const getLinePartNumbers = (prevLine = '', curLine = '', nextLine = '', curLineIndex: number): PartNumber[] => {
  const numbers = getLineNumbers(curLine, curLineIndex)
  const curLineSymbols = getLineSymbols(curLine)
  const prevLineSymbols = getLineSymbols(prevLine)
  const nextLineSymbols = getLineSymbols(nextLine)

  return numbers.filter(number => {
    // it's a part number if
    //  on same, prev or next line:
    //  within the num index positions with 1 padding there is a symbol (not ".")
    const minIndex = number.startIndex - 1
    const maxIndex = number.endIndex + 1

    if (prevLineSymbols.some(symbol => symbol.index >= minIndex && symbol.index <= maxIndex)) return true
    if (curLineSymbols.some(symbol => symbol.index === minIndex || symbol.index === maxIndex)) return true
    if (nextLineSymbols.some(symbol => symbol.index >= minIndex && symbol.index <= maxIndex)) return true
    return false
  })
}

const part1 = (input: string) => {
  const lines = input.split('\n')

  const lineParts: {
    value: number,
    startIndex: number,
    endIndex: number
  }[][] = []

  lines.forEach((line, i) => {
    lineParts.push(getLinePartNumbers(lines[i - 1], line, lines[i + 1], i))
  })

  const result = lineParts.flatMap(array => array).reduce((acc, curr) => acc + curr.value, 0)

  return result
}


console.log('part 1:')
console.log('sample data:', part1(sample))
console.log('-------------------------------')
console.log('input data:', part1(text))
console.log('-------------------------------')



const getLineGearSymbols = (line: string, lineIndex: number): Gear[] => [...line.matchAll(/\*/g)].map(match => ({
  value: match[0],
  index: match.index!,
  lineIndex: lineIndex,
}))


interface Gear {
  value: string,
  index: number,
  lineIndex: number,
}

interface PartNumber {
  value: number
  startIndex: number
  endIndex: number
  lineIndex: number
}

const part2 = (input: string) => {
  const lines = input.split('\n')

  const lineParts: PartNumber[][] = []
  const lineGears: Gear[][] = []

  lines.forEach((line, i) => {
    lineParts.push(getLinePartNumbers(lines[i - 1], line, lines[i + 1], i))
    lineGears.push(getLineGearSymbols(line, i))
  })
  const partsNumbers = lineParts.flat()
  const gears = lineGears.flat()

  //get the valid gears:
  //a gear is valid if on prev + current + next line it has 2 parNumbers

  const validGears = gears.reduce((acc, gear) => {

    const partsOnCurrentLine = partsNumbers.filter(number =>
      number.lineIndex === gear.lineIndex
      &&
      (number.startIndex - 1 === gear.index || number.endIndex + 1 === gear.index)
    )

    const partsOnPrevLine = partsNumbers.filter(number =>
      number.lineIndex === gear.lineIndex - 1
      &&
      (gear.index >= number.startIndex - 1 && gear.index <= number.endIndex + 1)
    )

    const partsOnNextLine = partsNumbers.filter(number =>
      number.lineIndex === gear.lineIndex + 1
      &&
      (gear.index >= number.startIndex - 1 && gear.index <= number.endIndex + 1)
    )

    const adjacentNumbers = [...partsOnPrevLine, ...partsOnCurrentLine, ...partsOnNextLine]

    if (adjacentNumbers.length === 2) {
      acc.push({
        gear,
        number1: adjacentNumbers[0],
        number2: adjacentNumbers[1]
      })
    }


    return acc
  }, [] as {
    gear: Gear
    number1: PartNumber
    number2: PartNumber
  }[])

  const result = validGears.reduce((acc, curr) => {
    const currRatio = curr.number1.value * curr.number2.value
    acc += currRatio
    return acc
  }, 0)

  return result
}


console.log('part 2:')
console.log('sample data:', part2(sample))
console.log('-------------------------------')
console.log('input data:', part2(text))
console.log('-------------------------------')
