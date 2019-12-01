function coordsToKey(x, y) {
  return `${x}_${y}`;
}

function keyToCoords(key) {
  const keySplit = key.split("_");
  return { x: parseInt(keySplit[0]), y: parseInt(keySplit[1]) };
}

function isCellAlive(x, y, state) {
  return state[coordsToKey(x, y)] || false;
}

function setCell(x, y, state, isAlive) {
  state[coordsToKey(x, y)] = isAlive;
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
    if (state[key] === false) {
      delete newState[key];
    }
  }
  return newState;
}

function trackNeighborsOfAliveCells(state) {
  let newState = Object.assign({}, state);
  for (let key in state) {
    const coords = keyToCoords(key);
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
    acc[coordsToKey(cur[0], cur[1])] = true;
    return acc;
  }, {});
}

function stateToCoords(state) {
  return Object.keys(state).reduce((acc, key) => {
    const { x, y } = keyToCoords(key);
    acc.push([x, y]);
    return acc;
  }, []);
}

function nextGeneration(coords) {
  const state = coordsToState(coords);
  const stateTrackingNeighbors = trackNeighborsOfAliveCells(state);
  let newState = {};

  for (let key in stateTrackingNeighbors) {
    const { x, y } = keyToCoords(key);
    const aliveNeighbors = countAliveNeighbors(x, y, state);
    const currentlyAlive = isCellAlive(x, y, state);
    const alive = shouldBeAlive(currentlyAlive, aliveNeighbors);
    setCell(x, y, newState, alive);
  }

  return stateToCoords(removeDeadCells(newState));
}

function coordsToMatrix(coords, size, activeChar) {
  const centerOffset = Math.floor(size / 2);

  const matrix = [];
  for (let i = 0; i < size; i++) {
    matrix[i] = new Array(size);
  }

  coords.forEach(coord => {
    const x = coord[0];
    const y = coord[1];

    const xWithOffset = x + centerOffset;
    const yWithOffset = y + centerOffset;

    if (
      yWithOffset >= 0 &&
      xWithOffset >= 0 &&
      yWithOffset < matrix.length &&
      xWithOffset < matrix.length
    ) {
      matrix[yWithOffset][xWithOffset] = activeChar;
    }
  });
  return matrix;
}

module.exports = {
  coordsToKey,
  keyToCoords,
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
  coordsToMatrix
};
