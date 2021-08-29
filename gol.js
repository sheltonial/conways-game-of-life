const CELL_STATE = {
  DEAD: 0,
  ALIVE: 1,
};

function coordsToStateKey(x, y) {
  return `${x}_${y}`;
}

function stateKeyToCoords(key) {
  const keySplit = key.split("_");
  return { x: parseInt(keySplit[0]), y: parseInt(keySplit[1]) };
}

function isCellAlive(x, y, state) {
  return state[coordsToStateKey(x, y)] === CELL_STATE.ALIVE;
}

function setCell(x, y, state, isAlive) {
  state[coordsToStateKey(x, y)] = isAlive ? CELL_STATE.ALIVE : CELL_STATE.DEAD;
}

function getNeighbourCoords(x, y) {
  const coords = [];
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (!(i === x && j === y)) {
        coords.push({ x: i, y: j });
      }
    }
  }
  return coords;
}

function countAliveNeighbors(x, y, state) {
  const neighbourCoords = getNeighbourCoords(x, y);
  return neighbourCoords.reduce((count, { x, y }) => {
    return count + (isCellAlive(x, y, state) ? 1 : 0);
  }, 0);
}

function removeDeadCells(state) {
  const newState = Object.assign({}, state);
  for (let key in state) {
    if (state[key] === CELL_STATE.DEAD) {
      delete newState[key];
    }
  }
  return newState;
}

function trackNeighborsOfAliveCells(state) {
  let newState = Object.assign({}, state);
  for (let key in state) {
    const coords = stateKeyToCoords(key);
    const neighbourCoords = getNeighbourCoords(coords.x, coords.y);
    neighbourCoords.forEach(({ x, y }) => {
      const cellAlive = isCellAlive(x, y, state);
      setCell(x, y, newState, cellAlive);
    });
  }
  return newState;
}

function shouldBeAlive(isCurrentlyAlive, aliveNeighbors) {
  if (aliveNeighbors < 2 || aliveNeighbors > 3) {
    return false;
  } else if (isCurrentlyAlive) {
    return true;
  } else if (aliveNeighbors === 3 && !isCurrentlyAlive) {
    return true;
  }
  return false;
}

function coordsToState(coords) {
  return coords.reduce((acc, cur) => {
    acc[coordsToStateKey(cur[0], cur[1])] = CELL_STATE.ALIVE;
    return acc;
  }, {});
}

function stateToCoords(state) {
  return Object.keys(state).reduce((acc, key) => {
    const { x, y } = stateKeyToCoords(key);
    acc.push([x, y]);
    return acc;
  }, []);
}

function nextGeneration(coords) {
  const state = coordsToState(coords);
  const stateTrackingNeighbors = trackNeighborsOfAliveCells(state);
  let newState = {};

  for (let key in stateTrackingNeighbors) {
    const { x, y } = stateKeyToCoords(key);
    const aliveNeighbors = countAliveNeighbors(x, y, state);
    const currentlyAlive = isCellAlive(x, y, state);
    const alive = shouldBeAlive(currentlyAlive, aliveNeighbors);
    setCell(x, y, newState, alive);
  }

  return stateToCoords(removeDeadCells(newState));
}

/**
 * Filters coordinates to a specified viewport.
 * @param {int} x - Starting x position of the viewport.
 * @param {int} y - Starting y position of the viewport.
 * @param {int} width - Width of viewport.
 * @param {int} height - Height of viewport.
 */
function filterCoordsInViewport(coords, x, y, width, height) {
  const result = [];

  let zeroOffsetX = x * -1;
  let zeroOffsetY = y * -1;

  coords.forEach((coord) => {
    const x1 = coord[0];
    const y1 = coord[1];

    if (x1 >= x && y1 >= y && x1 < width + x && y1 < height + y) {
      result.push([x1 + zeroOffsetX, y1 + zeroOffsetY]);
    }
  });
  return result;
}

/**
 * Creates a matrix for coordinates within a given viewport
 * @param {int} x - Starting x position of coordinates to include.
 * @param {int} y - Starting y position of coordinates to include.
 * @param {int} width - Width of matrix.
 * @param {int} height - Height of matrix.
 */
function coordsToMatrix(coords, x, y, width, height, activeChar) {
  const coordsInViewport = filterCoordsInViewport(coords, x, y, width, height);

  const matrix = [];
  for (let y = 0; y < height; y++) {
    matrix[y] = new Array(width);
  }

  coordsInViewport.forEach((coord) => {
    const x1 = coord[0];
    const y1 = coord[1];

    matrix[y1][x1] = activeChar;
  });

  return matrix;
}

golExports = {
  coordsToStateKey,
  stateKeyToCoords,
  isCellAlive,
  setCell,
  getNeighbourCoords,
  countAliveNeighbors,
  removeDeadCells,
  trackNeighborsOfAliveCells,
  shouldBeAlive,
  coordsToState,
  stateToCoords,
  nextGeneration,
  filterCoordsInViewport,
  coordsToMatrix,
};

if (typeof module !== "undefined" && typeof module.exports !== "undefined")
  module.exports = golExports;
else window.gol = golExports;
