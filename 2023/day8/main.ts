import { text } from "./text";

const sample = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

interface INode {
  id: string;
  left: string;
  right: string;
}

const parseNode = (nodeLine: string): INode => {
  const parts = nodeLine.split(/=/);
  const id = parts[0].trim();
  const leftRight = parts[1]
    .trim()
    .replace(/\(|\)|,/g, "")
    .split(/\s+/);
  const left = leftRight[0];
  const right = leftRight[1];
  return {
    id,
    left,
    right,
  };
};

const walk = (instructions: string, nodes: INode[]) => {
  let currentIndex = 0;
  let walkedSteps = 0;
  const startingNode = nodes.find((node) => node.id === "AAA")!;
  let currentNode = startingNode;
  // console.log({ instructions });

  while (currentNode.id !== "ZZZ") {
    const direction = instructions[currentIndex] === "L" ? "left" : "right";
    // console.log(
    //   { walkedSteps },
    //   { currentIndex },
    //   { direction },
    //   { currentNode },
    // );
    currentNode = nodes.find((node) => node.id === currentNode[direction])!;

    walkedSteps += 1;
    currentIndex = (currentIndex + 1) % instructions.length;
  }
  return walkedSteps;
};

const part1 = (input: string) => {
  const lines = input.split(/\n/);
  const instructions = lines[0];
  lines.splice(0, 2);

  const nodes = lines.map((line) => parseNode(line));

  return walk(instructions, nodes);
};

// console.log("part 1:");
// console.log("sample data:", part1(sample));
// console.log("-------------------------------");
// console.log("input data:", part1(text));
// console.log("-------------------------------");

const sample2 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

const walk2 = (instructions: string, nodes: INode[]) => {
  const startTime = Date.now();

  let currentIndex = 0;
  let walkedSteps = 0;
  const startingNodes = nodes.filter((node) => node.id.endsWith("A"))!;
  let currentNodes = startingNodes;
  // console.log({ instructions });

  while (currentNodes.some((node) => !node.id.endsWith("Z"))) {
    const direction = instructions[currentIndex] === "L" ? "left" : "right";
    // console.log(
    //   { walkedSteps },
    //   { currentIndex },
    //   { direction },
    //   { currentNode },
    // );

    if ((startTime - Date.now()) % (1000 * 5) === 0)
      console.log("walked", walkedSteps, "steps");

    currentNodes = currentNodes.map(
      (currentNode) =>
        nodes.find((node) => node.id === currentNode[direction])!,
    );

    walkedSteps += 1;
    currentIndex = (currentIndex + 1) % instructions.length;
  }
  return walkedSteps;
};

const part2 = (input: string) => {
  const lines = input.split(/\n/);
  const instructions = lines[0];
  lines.splice(0, 2);

  const nodes = lines.map((line) => parseNode(line));

  return walk2(instructions, nodes);
};

console.log("part 2:");
console.log("sample data:", part2(sample2));
console.log("-------------------------------");
console.log("input data:", part2(text));
console.log("-------------------------------");
