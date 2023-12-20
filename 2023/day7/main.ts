import { text } from "./text";

const sample = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const HAND_TYPES_RANK = {
  highCard: 1,
  onePair: 2,
  twoPair: 3,
  threeOfAKind: 4,
  fullHouse: 5,
  fourOfAKind: 6,
  fiveOfAKind: 7,
};

const CARD_TYPES_RANK = "23456789TJQKA";

interface Hand {
  cards: string;
  bid: number;
}

const parseHand = (line: string): Hand => {
  const [handString, bidString] = line.split(/\s+/);
  return {
    cards: handString,
    bid: parseInt(bidString),
  };
};

const getMatchingDistribution = (string: string): number[] => {
  const matching: {
    [id: string]: number;
  } = {};
  Array.from(string).forEach(
    (char: string) => (matching[char] = (matching[char] ?? 0) + 1),
  );
  return Object.values(matching);
};

const getHandRank = (
  hand: string,
  getMatchingDistribution: (hand: string) => number[],
) => {
  const matching = getMatchingDistribution(hand);
  const uniqueCount = matching.length;
  switch (true) {
    case uniqueCount === 1:
      return HAND_TYPES_RANK.fiveOfAKind;
    case uniqueCount === 2 && matching.some((amount) => amount === 4):
      return HAND_TYPES_RANK.fourOfAKind;
    case uniqueCount === 2:
      return HAND_TYPES_RANK.fullHouse;
    case uniqueCount === 3 && matching.some((amout) => amout === 3):
      return HAND_TYPES_RANK.threeOfAKind;
    case uniqueCount === 3:
      return HAND_TYPES_RANK.twoPair;
    case uniqueCount === 4:
      return HAND_TYPES_RANK.onePair;
    default:
      return HAND_TYPES_RANK.highCard;
  }
};

const sortHandsByLowerCard = (
  cardsA: string,
  cardsB: string,
  CARD_TYPES_RANK: string,
) => {
  for (let i = 0; i < 5; i++) {
    if (cardsA[i] === cardsB[i]) continue;
    return (
      CARD_TYPES_RANK.indexOf(cardsA[i]) - CARD_TYPES_RANK.indexOf(cardsB[i])
    );
  }
  return 0;
};

const part1 = (input: string) => {
  const lines = input.split(/\n/);
  const hands = lines.map((line) => parseHand(line));

  const sortedHands = hands.sort((a, b) => {
    const rankA = getHandRank(a.cards, getMatchingDistribution);
    const rankB = getHandRank(b.cards, getMatchingDistribution);

    if (rankA !== rankB) return rankA - rankB;

    return sortHandsByLowerCard(a.cards, b.cards, CARD_TYPES_RANK);
  });

  return sortedHands.reduce((acc, hand, i) => acc + hand.bid * (i + 1), 0);
};

console.log("part 1:");
console.log("sample data:", part1(sample));
console.log("-------------------------------");
console.log("input data:", part1(text));
console.log("-------------------------------");

const CARD_TYPES_RANK_2 = "J23456789TQKA";
const getMatchingDistribution_2 = (string: string): number[] => {
  const matching: {
    [id: string]: number;
  } = {};
  Array.from(string).forEach(
    (char: string) => (matching[char] = (matching[char] ?? 0) + 1),
  );

  if ("J" in matching && Object.values(matching).length > 1) {
    const jokersCount = matching.J;
    delete matching.J;
    let highest = {
      char: "",
      count: 0,
    };

    Array.from(string).forEach((char: string) => {
      if (matching[char] > highest.count)
        highest = {
          char,
          count: matching[char],
        };
    });

    matching[highest.char] += jokersCount;
  }

  return Object.values(matching);
};

const part2 = (input: string) => {
  const lines = input.split(/\n/);
  const hands = lines.map((line) => parseHand(line));

  const sortedHands = hands.sort((a, b) => {
    const rankA = getHandRank(a.cards, getMatchingDistribution_2);
    const rankB = getHandRank(b.cards, getMatchingDistribution_2);

    if (rankA !== rankB) return rankA - rankB;

    return sortHandsByLowerCard(a.cards, b.cards, CARD_TYPES_RANK_2);
  });

  return sortedHands.reduce((acc, hand, i) => acc + hand.bid * (i + 1), 0);
};

console.log("part 2:");
console.log("sample data:", part2(sample));
console.log("-------------------------------");
console.log("input data:", part2(text));
console.log("-------------------------------");
