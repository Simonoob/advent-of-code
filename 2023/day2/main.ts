import { text } from "./text";
const sample = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`

interface Round {
  r: number
  g: number
  b: number
}

interface Game {
  id: number
  rounds: Round[]
}


const parseRound = (round: string) => {
  const r = { r: 0, b: 0, g: 0 }
  round.split(',')
    .map(pair => pair.trim().split(' '))
    .forEach(([num, color]) => {
      switch (color.trim()) {
        case 'red':
          r.r = parseInt(num)
          break
        case 'green':
          r.g = parseInt(num)
          break
        case 'blue':
          r.b = parseInt(num)
          break
      }
    })
  return r
}

const gameIdRx = /Game (\d+): (.*)/
const parseGame = (line: string): Game => {
  const [, id, rounds] = gameIdRx.exec(line)!
  return { id: parseInt(id), rounds: rounds.split(';').map(r => parseRound(r.trim())) }
}




const part1 = (input: string) => {

  const limits = {
    r: 12,
    g: 13,
    b: 14
  }
  const lines = input.split('\n')
  let result = lines.map(parseGame)
    .filter(g => !g.rounds.find(r => r.r > limits.r || r.g > limits.g || r.b > limits.b))
    .reduce((acc, cur) => acc + cur.id, 0)
  console.log('part 1:', result)

}

console.log('----------------------------------------')
console.log('sample data:')
part1(sample)

console.log('----------------------------------------')
console.log('input data:')
part1(text)

const part2 = (input: string) => {

  const lines = input.split('\n')
  let result = lines.map(parseGame)
    .map(g => g.rounds.reduce((acc, cur) => {
      acc.r = Math.max(cur.r, acc.r)
      acc.g = Math.max(cur.g, acc.g)
      acc.b = Math.max(cur.b, acc.b)
      return acc
    }, { r: 0, g: 0, b: 0 }))
    .reduce((acc, cur) => acc + cur.r * cur.b * cur.g, 0)
  console.log('part 2:', result)
}



console.log('----------------------------------------')
console.log('sample data:')
part2(sample)

console.log('----------------------------------------')
console.log('input data:')
part2(text)
