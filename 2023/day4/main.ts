import { text } from './text'

const sample = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

interface Card {
  id: number
  winningNumbers: number[]
  playedNumbers: number[]
  instances: number
}
const getCardId = (cardString: string) => parseInt(cardString.match(/\d+/)![0])
const getCardWinningNumbers = (cardString: string) => cardString.slice(cardString.indexOf(':') + 1, cardString.indexOf('|')).trim().split(' ').map((str => parseInt(str.trim())))
const getCardPlayedNumbers = (cardString: string) => cardString.slice(cardString.indexOf('|') + 1, cardString.length).trim().split(' ').map(str => parseInt(str.trim()))
const parseCard = (cardString: string): Card => ({
  id: getCardId(cardString),
  winningNumbers: getCardWinningNumbers(cardString),
  playedNumbers: getCardPlayedNumbers(cardString),
  instances: 1
})

const getCardWorth = (card: Card) => card.playedNumbers.reduce((acc, playedNum) => {
  if (card.winningNumbers.some(winningNum => playedNum === winningNum)) {
    if (acc === 0) {
      acc = 1
    } else acc = acc * 2
  }
  return acc
}, 0)


const part1 = (input: string) => {
  const lines = input.split('\n')
  const cards = lines.map(line => parseCard(line))

  const cardsWithWorth = cards.map(card => ({
    ...card,
    worth: getCardWorth(card)
  }))

  const result = cardsWithWorth.reduce((acc, card) => acc + card.worth, 0)
  return result
}


console.log('part 1:')
console.log('sample data:', part1(sample))
console.log('-------------------------------')
console.log('input data:', part1(text))
console.log('-------------------------------')




const part2 = (input: string) => {
  const lines = input.split('\n')

  const cards = lines.map(line => parseCard(line.replace('  ', ' ')))

  cards.forEach(card => {
    const matchingNumCount = card.playedNumbers.reduce((acc, num) => card.winningNumbers.some(winningNum => num === winningNum) ? acc += 1 : acc, 0)

    for (let i = 1; i <= matchingNumCount; i++) {
      const targetId = card.id + i
      const cardToUpdate = cards.find(j => j.id === targetId)!
      cards[cards.indexOf(cardToUpdate)].instances += card.instances
    }
  })

  return cards.reduce((acc, card) => acc += card.instances, 0)
}


console.log('part 2:')
console.log('sample data:', part2(sample))
console.log('-------------------------------')
console.log('input data:', part2(text))
console.log('-------------------------------')
