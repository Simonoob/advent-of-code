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
interface IRange {
  srcStart: number;
  dstStart: number;
  rangeLength: number;
}
interface IMap {
  from: string;
  to: string;
  entries: IRange[];
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
  const dstStart = parseInt(numbers[0]);
  const srcStart = parseInt(numbers[1]);
  const rangeLength = parseInt(numbers[2]);
  return {
    srcStart,
    dstStart,
    rangeLength,
  };
};

const parseMapString = (mapStrings: string) => {
  const lines = mapStrings.split(/\n/);
  const res: IMap = {
    from: "",
    to: "",
    entries: [],
  };

  //parse title
  const title = lines[0].split(/\s+/)[0].split("-");
  res.from = title[0];
  res.to = title[2];

  //parse ranges
  lines.splice(0, 1);
  const ranges = lines.map((line) => parseRange(line));
  res.entries = ranges.flat();

  return res;
};

const getValueFromMap = (value: number, map: IMap) => {
  const mapEntry = map.entries.find(
    (entry) =>
      value >= entry.srcStart && value <= entry.srcStart + entry.rangeLength,
  );

  if (!mapEntry) return value;
  const offset = value - mapEntry.srcStart;
  const dst = mapEntry.dstStart + offset;
  return dst;
};

const getLocationFromSeed = (seed: number, maps: IMap[]) => {
  const initialMap = maps.find((map) => map.from === "seed")!;

  let currentMap = initialMap;
  let currentValue = seed;
  while (currentMap.to !== "location") {
    currentValue = getValueFromMap(currentValue, currentMap);
    currentMap = maps.find((map) => map.from === currentMap.to)!;
  }

  return { seed, location: currentValue };
};

const part1 = (input: string) => {
  // lets split the text in the different inputs
  const sections = splitOnEmptyLines(input);
  // get seeds starting point
  const seeds = parseSeedsString(sections[0]);
  sections.splice(0, 1);
  // parse all the maps
  const maps: IMap[] = sections.map((sect) => parseMapString(sect));

  // make a new map: seed to location
  const seedToLocation: { seed: number; location: number }[] = seeds.map(
    (seed) => getLocationFromSeed(seed, maps),
  );
  console.log(seedToLocation);

  return Math.min(...seedToLocation.map((val) => val.location));
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
