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

console.log("part 1:");
console.log("sample data:", part1(sample));
console.log("-------------------------------");
console.log("input data:", part1(text));
console.log("-------------------------------");

const part2 = (input: string) => {
  const lines = input.split(/\n/);
};

// console.log("part 2:");
// console.log("sample data:", part2(sample));
// console.log("-------------------------------");
// console.log("input data:", part2(text));
// console.log("-------------------------------");
