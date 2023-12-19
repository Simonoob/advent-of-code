import { text } from "./text";

const sample = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

interface IMapValue {
  source: {
    min: number;
    max: number;
  };
  destination: {
    min: number;
    max: number;
  };
}

interface IMap {
  from: string;
  to: string;
  values: IMapValue[];
}

const splitOnEmptyLines = (input: string) => input.split(/\n\n/);

const parseSeedsString = (line: string) =>
  line
    .replace(new RegExp(/\w+:/), "")
    .trim()
    .split(/\s+/)
    .map((str) => parseInt(str.trim()));

const parseRange = (line: string) => {
  const numbers = line.trim().split(/\s+/);
  const destStart = parseInt(numbers[0]);
  const sourceStart = parseInt(numbers[1]);
  const length = parseInt(numbers[2]);
  const range: IMapValue = {
    source: {
      min: sourceStart,
      max: sourceStart + length - 1,
    },
    destination: {
      min: destStart,
      max: destStart + length - 1,
    },
  };

  return range;
};

const parseMapString = (mapStrings: string) => {
  const lines = mapStrings.split(/\n/);
  const res: IMap = {
    from: "",
    to: "",
    values: [],
  };

  //parse title
  const title = lines[0].split(/\s+/)[0].split("-");
  res.from = title[0];
  res.to = title[2];

  //parse ranges
  lines.splice(0, 1);
  const ranges = lines.map((line) => parseRange(line));
  res.values = ranges.flat();

  return res;
};

const isValueWithinRange = (
  value: number,
  range: { min: number; max: number },
) => range.min <= value && value <= range.max;

const getValueInDestinationRange = (value: number, range?: IMapValue) => {
  if (!range) return value;

  const diff = value - range.source.min;
  return range.destination.min + diff;
};

const parseLocationValue = (seed: number, maps: { [source: string]: IMap }) => {
  let currentMap: IMap = maps["seed"];
  let currentValue = seed;

  while (currentMap.to !== "location") {
    const destinationRange = currentMap.values.find((value) =>
      isValueWithinRange(currentValue, value.source),
    );

    // console.log(
    //   currentMap.from,
    //   currentValue,
    //   " corresponds to ",
    //   currentMap.to,
    //   getValueInDestinationRange(currentValue, destinationRange),
    // );
    currentValue = getValueInDestinationRange(currentValue, destinationRange);
    currentMap = maps[currentMap.to];
  }

  // we reached the location map

  const finalDestinationRange = currentMap.values.find((value) =>
    isValueWithinRange(currentValue, value.source),
  );

  const finalValueDestination = getValueInDestinationRange(
    currentValue,
    finalDestinationRange,
  );
  return {
    source: seed,
    destination: finalValueDestination ?? currentValue,
  };
};

const part1 = (input: string) => {
  // lets split the text in the different inputs
  const sections = splitOnEmptyLines(input);
  console.log("sections splitted");

  // get seeds starting point
  const seeds = parseSeedsString(sections[0]);
  sections.splice(0, 1);

  // parse all the maps
  const maps: { [source: string]: IMap } = {};
  console.log("about to pase maps");
  sections.forEach((sect) => {
    const parsed = parseMapString(sect);
    maps[parsed.from] = parsed;
  });

  console.log("maps parsed");

  // make a new map: seed to location
  // to do this, we need to chain through the other maps in sequence
  const seedToLocation: { source: number; destination: number }[] = [];
  seeds.forEach((seed) => seedToLocation.push(parseLocationValue(seed, maps)));
  console.log(seedToLocation);

  return seedToLocation.map((val) => val.destination).sort()[0];
};

console.log("part 1:");
console.log("sample data:", part1(sample));
console.log("-------------------------------");
console.log("input data:", part1(text));
console.log("-------------------------------");

// const part2 = (input: string) => {
//   const lines = input.split("\n");
// };

// console.log("part 2:");
// console.log("sample data:", part2(sample));
// console.log("-------------------------------");
// console.log("input data:", part2(text));
// console.log("-------------------------------");
