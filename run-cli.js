const gol = require("./lib/gol");
const table = require("table").table;
const term = require("terminal-kit").terminal;

const args = process.argv.slice(2);
const maxGenerations = parseInt(args[0]);
const matrixSize = parseInt(args[1]);
const timeoutMs = parseInt(args[2]);
const startingCoords = JSON.parse(args[3]);
const mode = (args[4] || '').toLowerCase()

function renderMatrix(coords, size) {
  const matrix = gol.coordsToMatrix(coords, 0, 0, size, size, "😄")
  const tableConfig = {
    columnDefault: {
      width: 3
    }
  };
  term(table(matrix, tableConfig));
}

function play(startingCoords) {
  let coords = startingCoords;
  const outputPadding = "    ";

  let generationsInThisSecond = 0
  let oneSecondInFuture = null;

  for (let i = 0; i <= maxGenerations; i++) {
    setTimeout(() => {
      coords = gol.nextGeneration(coords);

      term.moveTo(1, 1);
      if (mode !== 'stats-only') {
        renderMatrix(coords, matrixSize);
      }

      if (oneSecondInFuture === null ||
          new Date().getTime() > oneSecondInFuture.getTime()) {
        oneSecondInFuture = new Date()
        oneSecondInFuture.setSeconds(oneSecondInFuture.getSeconds() + 1);

        console.log(`Generation: ${i}${outputPadding}`);
        console.log(`Cells alive: ${coords.length}${outputPadding}`);
        console.log(`Generations per sec: ${generationsInThisSecond}${outputPadding}`)

        generationsInThisSecond = 0
      } else {
        generationsInThisSecond ++
      }

    }, timeoutMs * i);
  }
}

play(startingCoords);
