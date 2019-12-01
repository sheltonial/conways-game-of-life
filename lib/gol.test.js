const gol = require("./gol");

const CELL_STATE = {
    'DEAD': 0,
    'ALIVE': 1
}

describe("coordsToStateKey()", () => {
  test("convert coordinates to state key", () => {
    expect(gol.coordsToStateKey(-1, 1)).toEqual("-1_1");
  });
});

describe("stateKeyToCoords()", () => {
  test("convert state key to coordinates", () => {
    expect(gol.stateKeyToCoords("-1_1")).toEqual({ x: -1, y: 1 });
  });
});

describe("isCellAlive()", () => {
  test("alive cell", () => {
    const state = {
      "-1_1": CELL_STATE.ALIVE
    };
    const result = gol.isCellAlive(-1, 1, state);
    expect(result).toEqual(true);
  });

  test("dead cell", () => {
    const state = {
      "-1_1": CELL_STATE.DEAD
    };
    const result = gol.isCellAlive(-1, 1, state);
    expect(result).toEqual(false);
  });

  test("missing cell", () => {
    const state = {};
    const result = gol.isCellAlive(0, 1, state);
    expect(result).toEqual(false);
  });
});

describe("setCell()", () => {
  test("adds an alive cell to state", () => {
    const state = {
      "0_0": CELL_STATE.ALIVE
    };
    gol.setCell(-1, -2, state, true);
    expect(state).toEqual({
      "0_0": CELL_STATE.ALIVE,
      "-1_-2": CELL_STATE.ALIVE
    });
  });

  test("adds (tracks) a neighbor cell to state", () => {
    const state = {
      "0_0": CELL_STATE.ALIVE
    };
    gol.setCell(-1, -2, state, false);
    expect(state).toEqual({
      "0_0": CELL_STATE.ALIVE,
      "-1_-2": CELL_STATE.DEAD
    });
  });
});

describe("getNeighbourCoords()", () => {
  test("gets neighbor keys", () => {
    expect(gol.getNeighbourCoords(0, 0)).toEqual([
      { x: -1, y: -1 },
      { x: -1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 }
    ]);
  });
});

describe("countAliveNeighbors()", () => {
  test("empty state", () => {
    const state = {};
    expect(gol.countAliveNeighbors(0, 0, state)).toEqual(0);
  });

  test("does not count self", () => {
    const state = {
      "0_0": CELL_STATE.ALIVE
    };
    expect(gol.countAliveNeighbors(0, 0, state)).toEqual(0);
  });

  test("state with direct neighbours", () => {
    const state = {
      "-1_-1": CELL_STATE.ALIVE,
      "1_1": CELL_STATE.ALIVE
    };
    expect(gol.countAliveNeighbors(0, 0, state)).toEqual(2);
  });

  test("does not count non-neighbors", () => {
    const state = {
      "0_-2": CELL_STATE.ALIVE,
      "-2_0": CELL_STATE.ALIVE
    };
    expect(gol.countAliveNeighbors(0, 0, state)).toEqual(0);
  });

  test("ignore direct dead neighbors being tracked", () => {
    const state = {
      "-1_-1": CELL_STATE.ALIVE,
      "-1_0": CELL_STATE.DEAD,
      "0_-1": CELL_STATE.DEAD,
      "1_1": CELL_STATE.ALIVE
    };
    expect(gol.countAliveNeighbors(0, 0, state)).toEqual(2);
  });
});

describe("removeDeadCells()", () => {
  test("remove dead cells", () => {
    const state = {
      "0_0": CELL_STATE.ALIVE,
      "0_1": CELL_STATE.DEAD
    };

    expect(gol.removeDeadCells(state)).toEqual({
      "0_0": CELL_STATE.ALIVE
    });
  });

  test("does not modify provided state", () => {
    const state = {
      "0_0": CELL_STATE.ALIVE,
      "0_1": CELL_STATE.DEAD
    };

    gol.removeDeadCells(state);

    expect(state).toEqual({
      "0_0": CELL_STATE.ALIVE,
      "0_1": CELL_STATE.DEAD
    });
  });
});

describe("trackNeighborsOfAliveCells()", () => {
  test("do nothing if state empty", () => {
    const state = {};
    expect(gol.trackNeighborsOfAliveCells(state)).toEqual({});
  });

  test("add dead neighbors", () => {
    const state = {
      "0_0": CELL_STATE.ALIVE
    };
    expect(gol.trackNeighborsOfAliveCells(state)).toEqual({
      "-1_-1": CELL_STATE.DEAD,
      "-1_0": CELL_STATE.DEAD,
      "-1_1": CELL_STATE.DEAD,
      "0_-1": CELL_STATE.DEAD,
      "0_0": CELL_STATE.ALIVE,
      "0_1": CELL_STATE.DEAD,
      "1_-1": CELL_STATE.DEAD,
      "1_0": CELL_STATE.DEAD,
      "1_1": CELL_STATE.DEAD
    });
  });

  test("add dead neighbors, alive neighbors stay alive", () => {
    const state = {
      "0_0": CELL_STATE.ALIVE,
      "0_1": CELL_STATE.ALIVE
    };
    expect(gol.trackNeighborsOfAliveCells(state)).toEqual({
      "-1_-1": CELL_STATE.DEAD,
      "-1_0": CELL_STATE.DEAD,
      "-1_1": CELL_STATE.DEAD,
      "-1_2": CELL_STATE.DEAD,
      "0_-1": CELL_STATE.DEAD,
      "0_0": CELL_STATE.ALIVE,
      "0_1": CELL_STATE.ALIVE,
      "0_2": CELL_STATE.DEAD,
      "1_-1": CELL_STATE.DEAD,
      "1_0": CELL_STATE.DEAD,
      "1_1": CELL_STATE.DEAD,
      "1_2": CELL_STATE.DEAD
    });
  });

  test("do not modify provided state", () => {
    const state = {
      "0_0": CELL_STATE.ALIVE
    };

    gol.trackNeighborsOfAliveCells(state);

    expect(state).toEqual({
      "0_0": CELL_STATE.ALIVE
    });
  });
});

describe("shouldBeAlive()", () => {
  test("currently alive with < 2 neighbors = under population & dead", () => {
    expect(gol.shouldBeAlive(true, 1)).toEqual(false);
  });

  test("currently dead with < 2 neighbors = under population & dead", () => {
    expect(gol.shouldBeAlive(false, 1)).toEqual(false);
  });

  test("currently alive with 2 neighbors = survival & alive", () => {
    expect(gol.shouldBeAlive(true, 2)).toEqual(true);
  });

  test("currently dead with 2 neighbors = stay dead", () => {
    expect(gol.shouldBeAlive(false, 2)).toEqual(false);
  });

  test("currently alive with 3 neighbors = survival & alive", () => {
    expect(gol.shouldBeAlive(true, 3)).toEqual(true);
  });

  test("currently dead with 3 neighbors = reproduction & alive", () => {
    expect(gol.shouldBeAlive(false, 3)).toEqual(true);
  });

  test("currently alive with 4 neighbors = overcrowding & dead", () => {
    expect(gol.shouldBeAlive(true, 4)).toEqual(false);
  });

  test("currently dead with 4 neighbors = overcrowding & dead", () => {
    expect(gol.shouldBeAlive(false, 4)).toEqual(false);
  });
});

describe("coordsToState()", () => {
  test("convert coords to state", () => {
    const input = [
      [0, 0],
      [-1, 1]
    ];
    const expected = {
      "0_0": CELL_STATE.ALIVE,
      "-1_1": CELL_STATE.ALIVE
    };
    expect(gol.coordsToState(input)).toEqual(expected);
  });
});

describe("stateToCoords()", () => {
  test("convert state to coords", () => {
    const input = {
      "0_0": CELL_STATE.ALIVE,
      "-1_1": CELL_STATE.ALIVE
    };
    const expected = [
      [0, 0],
      [-1, 1]
    ];
    expect(gol.stateToCoords(input)).toEqual(expected);
  });
});

describe("nextGeneration()", () => {
  test("under population", () => {
    const input = [
      [0, 0],
      [0, 1]
    ];
    const expected = [];

    expect(gol.nextGeneration(input)).toEqual(expected);
  });

  test("survival", () => {
    const input = [
      [-1, -1],
      [0, 0],
      [1, 1]
    ];
    const expected = [[0, 0]];
    expect(gol.nextGeneration(input)).toEqual(expected);
  });

  test("reproduction", () => {
    const input = [
      [-1, -1],
      [-1, 1],
      [1, 1]
    ];
    const expected = [[0, 0]];
    expect(gol.nextGeneration(input)).toEqual(expected);
  });

  test("overcrowding & reproduction", () => {
    const input = [
      [-1, -1],
      [-1, 1],
      [0, 0],
      [1, -1],
      [1, 1]
    ];
    const expected = [
      [-1, 0],
      [0, -1],
      [0, 1],
      [1, 0]
    ];
    expect(gol.nextGeneration(input)).toEqual(expected);
  });
});

describe("coordsToMatrix()", () => {
  it("empty coords", () => {
    const coords = [];
    const expected = [
      [undefined, undefined],
      [undefined, undefined]
    ];
    expect(gol.coordsToMatrix(coords, 2, "x")).toEqual(expected);
  });

  it("coords within matrix bounds", () => {
    const coords = [
      [-1, -1],
      [0, 0],
      [1, 1]
    ];
    const expected = [
      ["x", undefined, undefined],
      [undefined, "x", undefined],
      [undefined, undefined, "x"]
    ];
    expect(gol.coordsToMatrix(coords, 3, "x")).toEqual(expected);
  });

  it("coords outside matrix bounds", () => {
    const coords = [
      [-4, 0],
      [0, -4],
      [0, 4],
      [4, 0]
    ];
    const expected = [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined]
    ];
    expect(gol.coordsToMatrix(coords, 3, "x")).toEqual(expected);
  });
});
