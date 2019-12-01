const gol = require('./gol')

describe('coordsToKey()', () => {
    test('convert coordinates to grid key', () => {
        expect(gol.coordsToKey(-1, 1)).toEqual('-1_1')
    })
})

describe('keyToCoords()', () => {
    test('convert grid key to coordinates', () => {
        expect(gol.keyToCoords('-1_1')).toEqual({ x: -1, y: 1})
    })
})

describe('isCellAlive()', () => {
    test('return active cell', () => {
        const grid = {
            '-1_1': true
        }
        const result = gol.isCellAlive(-1, 1, grid)
        expect(result).toEqual(true)
    })

    test('return inactive cell', () => {
        const grid = {}
        const result = gol.isCellAlive(0, 1, grid)
        expect(result).toEqual(false)
    })
})

describe('setCell()', () => {
    test('adds an alive cell to grid', () => {
        const grid = {
            '0_0': true
        }
        gol.setCell(-1, -2, grid, true)
        expect(grid).toEqual({
            '0_0': true,
            '-1_-2': true
        })
    })

    test('adds (tracks) a neighbor cell to grid', () => {
        const grid = {
            '0_0': true
        }
        gol.setCell(-1, -2, grid, false)
        expect(grid).toEqual({
            '0_0': true,
            '-1_-2': false
        })
    })
})

describe('getNeighbourCoords()', () => {
    test('gets neighbor keys', () => {
        expect(gol.getNeighbourCoords(0, 0)).toEqual([
            { x: -1, y: -1 },
            { x: -1, y: 0 },
            { x: -1, y: 1 },
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: 1, y: -1 },
            { x: 1, y: 0 },
            { x: 1, y: 1 }
        ])
    })
})

describe('countAliveNeighbors()', () => {
    test('empty grid', () => {
        const grid = {}
        expect(gol.countAliveNeighbors(0, 0, grid)).toEqual(0)
    })

    test('does not count self', () => {
        const grid = {
            '0_0': true
        }
        expect(gol.countAliveNeighbors(0, 0, grid)).toEqual(0)
    })

    test('grid with direct neighbours', () => {
        const grid = {
            '-1_-1': true,
            '1_1': true
        }
        expect(gol.countAliveNeighbors(0, 0, grid)).toEqual(2)
    })

    test('does not count non-neighbors', () => {
        const grid = {
            '0_-2': true,
            '-2_0': true
        }
        expect(gol.countAliveNeighbors(0, 0, grid)).toEqual(0)
    })

    test('ignore direct dead neighbors being tracked', () => {
        const grid = {
            '-1_-1': true,
            '-1_0': false,
            '0_-1': false,
            '1_1': true
        }
        expect(gol.countAliveNeighbors(0, 0, grid)).toEqual(2)
    })
})

describe('removeDeadNeighbors()', () => {
    test('remove dead neighbors', () => {
        const grid = {
            '0_0': true,
            '0_1': false
        }

        expect(gol.removeDeadNeighbors(grid)).toEqual({
            '0_0': true
        })
    })

    test('does not modify provided grid', () => {
        const grid = {
            '0_0': true,
            '0_1': false
        }

        gol.removeDeadNeighbors(grid)

        expect(grid).toEqual({
            '0_0': true,
            '0_1': false
        })
    })
})

describe('addDeadNeighbors()', () => {
    test('do nothing if grid empty', () => {
       const grid = {}
       expect(gol.addDeadNeighbors(grid)).toEqual({})
    })

    test('add dead neighbors', () => {
        const grid = {
            '0_0': true
        }
        expect(gol.addDeadNeighbors(grid)).toEqual({
            '-1_-1': false,
            '-1_0': false,
            '-1_1': false,
            '0_-1': false,
            '0_0': true,
            '0_1': false,
            '1_-1': false,
            '1_0': false,
            '1_1': false
        })
    })

    test('add dead neighbors, alive neighbors stay alive', () => {
        const grid = {
            '0_0': true,
            '0_1': true
        }
        expect(gol.addDeadNeighbors(grid)).toEqual({
            '-1_-1': false,
            '-1_0': false,
            '-1_1': false,
            '-1_2': false,
            '0_-1': false,
            '0_0': true,
            '0_1': true,
            '0_2': false,
            '1_-1': false,
            '1_0': false,
            '1_1': false,
            '1_2': false
        })
    })

    test('do not modify provided grid', () => {
        const grid = {
            '0_0': true
        }

        gol.addDeadNeighbors(grid)

        expect(grid).toEqual({
            '0_0': true
        })
    })
})

describe('shouldBeAlive()', () => {
    test('currently alive with < 2 neighbors = under population & dead', () => {
        expect(gol.shouldBeAlive(true, 1)).toEqual(false)
    })

    test('currently dead with < 2 neighbors = under population & dead', () => {
        expect(gol.shouldBeAlive(false, 1)).toEqual(false)
    })

    test('currently alive with 2 neighbors = survival & alive', () => {
        expect(gol.shouldBeAlive(true, 2)).toEqual(true)
    })

    test('currently dead with 2 neighbors = stay dead', () => {
        expect(gol.shouldBeAlive(false, 2)).toEqual(false)
    })

    test('currently alive with 3 neighbors = survival & alive', () => {
        expect(gol.shouldBeAlive(true, 3)).toEqual(true)
    })

    test('currently dead with 3 neighbors = reproduction & alive', () => {
        expect(gol.shouldBeAlive(false, 3)).toEqual(true)
    })

    test('currently alive with 4 neighbors = overcrowding & dead', () => {
        expect(gol.shouldBeAlive(true, 4)).toEqual(false)
    })

    test('currently dead with 4 neighbors = overcrowding & dead', () => {
        expect(gol.shouldBeAlive(false, 4)).toEqual(false)
    })
})

describe('coordsToGrid()', () => {
    test('convert coords to grid', () => {
        const input = [[0, 0], [-1, 1]]
        const expected = {
            '0_0': true,
            '-1_1': true
        }
        expect(gol.coordsToGrid(input)).toEqual(expected)
    })
})

describe('gridToCoords()', () => {
    test('convert grid to coords', () => {
        const input = {
            '0_0': true,
            '-1_1': true
        }
        const expected = [[0, 0], [-1, 1]]
        expect(gol.gridToCoords(input)).toEqual(expected)
    })
})

describe('nextGeneration()', () => {
    test('under population', () => {
        const input = [[0, 0], [0, 1]]
        const expected = []

        expect(gol.nextGeneration(input)).toEqual(expected)
    })

    test('survival', () => {
        const input = [[-1,-1],[0,0],[1,1]]
        const expected = [[0, 0]]
        expect(gol.nextGeneration(input)).toEqual(expected)
    })

    test('reproduction', () => {
        const input = [[-1,-1],[-1,1],[1,1]]
        const expected = [[0,0]]
        expect(gol.nextGeneration(input)).toEqual(expected)
    })

    test('overcrowding & reproduction', () => {
        const input = [[-1,-1], [-1,1], [0,0], [1,-1], [1,1]]
        const expected = [[-1,0], [0,-1], [0,1],[1,0]]
        expect(gol.nextGeneration(input)).toEqual(expected)
    })
})

describe('coordsToMatrix()', () => {
    it('empty coords', () => {
        const coords = []
        const expected = [[undefined, undefined], [undefined, undefined]]
        expect(gol.coordsToMatrix(coords, 2, 'x')).toEqual(expected)
    })

    it('coords within matrix bounds', () => {
        const coords = [[-1,-1],[0,0],[1,1]]
        const expected = [['x', undefined, undefined], [undefined, 'x', undefined], [undefined, undefined, 'x']]
        expect(gol.coordsToMatrix(coords, 3, 'x')).toEqual(expected)
    })

    it('coords outside matrix bounds', () => {
        const coords = [[-4, 0], [0,-4], [0,4], [4, 0]]
        const expected = [[undefined, undefined, undefined], [undefined, undefined, undefined], [undefined, undefined, undefined]]
        expect(gol.coordsToMatrix(coords, 3, 'x')).toEqual(expected)
    })
})