const gol = require("./lib/gol");
const table = require("table").table;
const term = require("terminal-kit").terminal;
const emoji = require("node-emoji");

const args = process.argv.slice(2);
const maxGenerations = parseInt(args[0]);
const matrixSize = parseInt(args[1]);
const timeoutMs = parseInt(args[2]);
const startingCoords = JSON.parse(args[3]);

function renderMatrix(coords, size) {
  const matrix = gol.coordsToMatrix(coords, size, emoji.get("smile"));
  const tableConfig = {
    columnDefault: {
      width: 3
    }
  };
  term.moveTo(1, 1);
  term(table(matrix, tableConfig));
}

function play(startingCoords) {
  let coords = startingCoords;
  const outputPadding = "    ";

  renderMatrix(coords, matrixSize);

  for (let i = 1; i <= maxGenerations; i++) {
    setTimeout(() => {
      coords = gol.nextGeneration(coords);
      renderMatrix(coords, matrixSize);
      console.log(`Generation: ${i}${outputPadding}`);
      console.log(`Alive nodes: ${coords.length}${outputPadding}`);
    }, timeoutMs * i);
  }
}

play(startingCoords);
