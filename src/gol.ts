enum CellState {
  Dead = 0,
  Alive = 1,
}

interface State {
  [name: string]: CellState;
}

interface Coordinate {
  [0]: number;
  [1]: number;
}
function coordsToStateKey(x: number, y: number) {
  return `${x}_${y}`;
}

function stateKeyToCoords(key: string) {
  const [x, y] = key.split("_").map((i) => parseInt(i));
  return { x, y };
}

function isCellAlive(x: number, y: number, state: State) {
  return state[coordsToStateKey(x, y)] === CellState.Alive;
}

function trackCell(x: number, y: number, state, isAlive: boolean) {
  state[coordsToStateKey(x, y)] = isAlive ? CellState.Alive : CellState.Dead;
}

function getNeighborCoords(x: number, y: number) {
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

function countAliveNeighbors(x: number, y: number, state: State) {
  const neighborCoords = getNeighborCoords(x, y);
  return neighborCoords.reduce((count, { x, y }) => {
    return count + (isCellAlive(x, y, state) ? 1 : 0);
  }, 0);
}

function removeDeadCells(state: State) {
  const newState = { ...state };
  for (let key in state) {
    let a = state[0];
    if (state[key] === CellState.Dead) {
      delete newState[key];
    }
  }
  return newState;
}

function trackNeighborsOfAliveCells(state: State) {
  const newState = { ...state };
  for (let key in state) {
    const coords = stateKeyToCoords(key);
    const neighborCoords = getNeighborCoords(coords.x, coords.y);
    neighborCoords.forEach(({ x, y }) => {
      const cellAlive = isCellAlive(x, y, state);
      trackCell(x, y, newState, cellAlive);
    });
  }
  return newState;
}

function shouldBeAlive(isCurrentlyAlive: boolean, aliveNeighbors: number) {
  if (aliveNeighbors < 2 || aliveNeighbors > 3) {
    return false;
  } else if (isCurrentlyAlive) {
    return true;
  } else if (aliveNeighbors === 3 && !isCurrentlyAlive) {
    return true;
  }
  return false;
}

function coordsToState(coords: Array<Coordinate>): State {
  return coords.reduce((acc, cur) => {
    acc[coordsToStateKey(cur[0], cur[1])] = CellState.Alive;
    return acc;
  }, {});
}

function stateToCoords(state: State): Array<Coordinate> {
  return Object.keys(state).reduce((acc, key) => {
    const { x, y } = stateKeyToCoords(key);
    acc.push([x, y]);
    return acc;
  }, []);
}

function nextGeneration(coords: Array<Coordinate>) {
  const state = coordsToState(coords);
  const stateTrackingNeighbors = trackNeighborsOfAliveCells(state);
  let newState = {};

  for (let key in stateTrackingNeighbors) {
    const { x, y } = stateKeyToCoords(key);
    const aliveNeighbors = countAliveNeighbors(x, y, state);
    const currentlyAlive = isCellAlive(x, y, state);
    const alive = shouldBeAlive(currentlyAlive, aliveNeighbors);
    trackCell(x, y, newState, alive);
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
function filterCoordsInViewport(
  coords: Array<Coordinate>,
  x: number,
  y: number,
  width: number,
  height: number
) {
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
function coordsToMatrix(
  coords: Array<Coordinate>,
  x: number,
  y: number,
  width: number,
  height: number,
  activeChar: string
) {
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

const golExports = {
  coordsToStateKey,
  stateKeyToCoords,
  isCellAlive,
  trackCell,
  getNeighborCoords,
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
else window["gol"] = golExports;
