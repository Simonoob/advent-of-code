import { text } from "./text";

const sample = `Time:      7  15   30
Distance:  9  40  200`;

interface IRace {
  availableTime: number;
  minDistance: number;
}

interface IStrategy {
  loadTime: number;
  distance: number;
}

const getNumbersFromString = (string: string) =>
  string.split(/\s+/).map((item) => parseInt(item.trim()));

const parseRaces = (input: string) => {
  const lines = input.split("\n");
  const timeString = lines[0]!.split("Time:")[1].trim();
  const distanceString = lines[1]!.split("Distance:")[1].trim();

  const timeValues = getNumbersFromString(timeString);
  const distanceValues = getNumbersFromString(distanceString);

  const races: IRace[] = timeValues.map((time, i) => ({
    availableTime: time,
    minDistance: distanceValues[i],
  }));
  return races;
};

const getWinningStrategies = (race: IRace) => {
  const winningStrategies: IStrategy[] = [];
  // we must loop though all the possible strategies
  // check all the possible loading times
  for (let loading = 1; loading < race.availableTime; loading++) {
    const remainingTime = race.availableTime - loading;
    const distanceTravelled = remainingTime * loading;
    if (distanceTravelled > race.minDistance)
      winningStrategies.push({
        loadTime: loading,
        distance: distanceTravelled,
      });
  }
  return winningStrategies;
};

const part1 = (input: string) => {
  const races = parseRaces(input);

  // for each race, we need to record the possible winning strategies
  const winningStrategiesByRace: IStrategy[][] = [];
  races.forEach((race) =>
    winningStrategiesByRace.push(getWinningStrategies(race)),
  );

  // calculate the result
  return winningStrategiesByRace.reduce(
    (acc, strategiesList) => acc * strategiesList.length,
    1,
  );
};

console.log("part 1:");
console.log("sample data:", part1(sample));
console.log("-------------------------------");
console.log("input data:", part1(text));
console.log("-------------------------------");

const parseSingleRace = (input: string) => {
  const lines = input.split("\n");
  const timeString = lines[0]!.split("Time:")[1].trim();
  const distanceString = lines[1]!.split("Distance:")[1].trim();

  const timeValue = parseInt(timeString.replace(/\s+/g, ""));
  const distanceValue = parseInt(distanceString.replace(/\s+/g, ""));

  const race: IRace = {
    availableTime: timeValue,
    minDistance: distanceValue,
  };
  return race;
};

const part2 = (input: string) => {
  const race = parseSingleRace(input);
  console.log(race);

  // for each race, we need to record the possible winning strategies
  return getWinningStrategies(race).length;
};

console.log("part 2:");
console.log("sample data:", part2(sample));
console.log("-------------------------------");
console.log("input data:", part2(text));
console.log("-------------------------------");
