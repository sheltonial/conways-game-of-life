var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var CellState;
(function (CellState) {
    CellState[CellState["Dead"] = 0] = "Dead";
    CellState[CellState["Alive"] = 1] = "Alive";
})(CellState || (CellState = {}));
function coordsToStateKey(x, y) {
    return x + "_" + y;
}
function stateKeyToCoords(key) {
    var _a = key.split("_").map(function (i) { return parseInt(i); }), x = _a[0], y = _a[1];
    return { x: x, y: y };
}
function isCellAlive(x, y, state) {
    return state[coordsToStateKey(x, y)] === CellState.Alive;
}
function trackCell(x, y, state, isAlive) {
    state[coordsToStateKey(x, y)] = isAlive ? CellState.Alive : CellState.Dead;
}
function getNeighborCoords(x, y) {
    var coords = [];
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (!(i === x && j === y)) {
                coords.push({ x: i, y: j });
            }
        }
    }
    return coords;
}
function countAliveNeighbors(x, y, state) {
    var neighborCoords = getNeighborCoords(x, y);
    return neighborCoords.reduce(function (count, _a) {
        var x = _a.x, y = _a.y;
        return count + (isCellAlive(x, y, state) ? 1 : 0);
    }, 0);
}
function removeDeadCells(state) {
    var newState = __assign({}, state);
    for (var key in state) {
        var a = state[0];
        if (state[key] === CellState.Dead) {
            delete newState[key];
        }
    }
    return newState;
}
function trackNeighborsOfAliveCells(state) {
    var newState = __assign({}, state);
    for (var key in state) {
        var coords = stateKeyToCoords(key);
        var neighborCoords = getNeighborCoords(coords.x, coords.y);
        neighborCoords.forEach(function (_a) {
            var x = _a.x, y = _a.y;
            var cellAlive = isCellAlive(x, y, state);
            trackCell(x, y, newState, cellAlive);
        });
    }
    return newState;
}
function shouldBeAlive(isCurrentlyAlive, aliveNeighbors) {
    if (aliveNeighbors < 2 || aliveNeighbors > 3) {
        return false;
    }
    else if (isCurrentlyAlive) {
        return true;
    }
    else if (aliveNeighbors === 3 && !isCurrentlyAlive) {
        return true;
    }
    return false;
}
function coordsToState(coords) {
    return coords.reduce(function (acc, cur) {
        acc[coordsToStateKey(cur[0], cur[1])] = CellState.Alive;
        return acc;
    }, {});
}
function stateToCoords(state) {
    return Object.keys(state).reduce(function (acc, key) {
        var _a = stateKeyToCoords(key), x = _a.x, y = _a.y;
        acc.push([x, y]);
        return acc;
    }, []);
}
if (typeof self !== "undefined") {
    self.addEventListener("message", nextGenerationAndFilterViewportMessage);
}
function nextGenerationAndFilterViewportMessage(message) {
    var coords = message.data.coords;
    var x = message.data.x;
    var y = message.data.y;
    var width = message.data.width;
    var height = message.data.height;
    var newCoords = nextGeneration(coords);
    var viewportCoords = filterCoordsInViewport(newCoords, x, y, width, height);
    if (typeof self !== "undefined") {
        self.postMessage({
            "command": "update",
            "coords": newCoords,
            "viewportCoords": viewportCoords
        });
    }
}
function nextGeneration(coords) {
    var state = coordsToState(coords);
    var stateTrackingNeighbors = trackNeighborsOfAliveCells(state);
    var newState = {};
    for (var key in stateTrackingNeighbors) {
        var _a = stateKeyToCoords(key), x = _a.x, y = _a.y;
        var aliveNeighbors = countAliveNeighbors(x, y, state);
        var currentlyAlive = isCellAlive(x, y, state);
        var alive = shouldBeAlive(currentlyAlive, aliveNeighbors);
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
function filterCoordsInViewport(coords, x, y, width, height) {
    var result = [];
    var zeroOffsetX = x * -1;
    var zeroOffsetY = y * -1;
    coords.forEach(function (coord) {
        var x1 = coord[0];
        var y1 = coord[1];
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
    var coordsInViewport = filterCoordsInViewport(coords, x, y, width, height);
    var matrix = [];
    for (var y_1 = 0; y_1 < height; y_1++) {
        matrix[y_1] = new Array(width);
    }
    coordsInViewport.forEach(function (coord) {
        var x1 = coord[0];
        var y1 = coord[1];
        matrix[y1][x1] = activeChar;
    });
    return matrix;
}
var golExports = {
    coordsToStateKey: coordsToStateKey,
    stateKeyToCoords: stateKeyToCoords,
    isCellAlive: isCellAlive,
    trackCell: trackCell,
    getNeighborCoords: getNeighborCoords,
    countAliveNeighbors: countAliveNeighbors,
    removeDeadCells: removeDeadCells,
    trackNeighborsOfAliveCells: trackNeighborsOfAliveCells,
    shouldBeAlive: shouldBeAlive,
    coordsToState: coordsToState,
    stateToCoords: stateToCoords,
    nextGeneration: nextGeneration,
    filterCoordsInViewport: filterCoordsInViewport,
    coordsToMatrix: coordsToMatrix
};
if (typeof module !== "undefined" && typeof module.exports !== "undefined")
    module.exports = golExports;
else if (typeof window !== "undefined")
    window["gol"] = golExports;
