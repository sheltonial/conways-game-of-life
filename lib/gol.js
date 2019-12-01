function coordsToKey(x, y) {
    return `${x}_${y}`
}

function keyToCoords(key) {
    const keySplit = key.split('_')
    return { x: parseInt(keySplit[0]), y: parseInt(keySplit[1]) }
}

function isCellAlive(x, y, grid) {
    return grid[coordsToKey(x, y)] || false
}

function setCell(x, y, grid, isAlive) {
    grid[coordsToKey(x, y)] = isAlive
}

function getNeighbourCoords(x, y) {
    const coords = []
    for (let i = x - 1; i <= x + 1; i ++) {
        for (let j = y - 1; j <= y + 1; j ++) {
            if (!(i === x && j === y)) {
                coords.push({ x: i, y: j})
            }
        }
    }
    return coords
}

function countAliveNeighbors(x, y, grid) {
    const neighbourCoords = getNeighbourCoords(x, y)
    return neighbourCoords.reduce((count, {x, y}) => {
        return count + (isCellAlive(x, y, grid) ? 1 : 0)
    }, 0)
}

function removeDeadNeighbors(grid) {
    const newGrid = Object.assign({}, grid)
    for (let key in grid) {
       if (grid[key] === false) {
           delete newGrid[key]
       }
    }
    return newGrid
}

function addDeadNeighbors(grid) {
    let newGrid = Object.assign({}, grid)
    for (let key in grid) {
        const coords = keyToCoords(key)
        const neighbourCoords = getNeighbourCoords(coords.x, coords.y)
        neighbourCoords.forEach(({x, y}) => {
            const cellAlive = isCellAlive(x, y, grid)
            setCell(x, y, newGrid, cellAlive)
        })
    }
    return newGrid
}

function shouldBeAlive(isCurrentlyAlive, aliveNeighbors) {
    if (aliveNeighbors < 2 || aliveNeighbors > 3) {
        return false
    } else if (isCurrentlyAlive) {
        return true
    } else if (aliveNeighbors === 3 && !isCurrentlyAlive) {
        return true
    }
    return false
}

function coordsToGrid(coords) {
    return coords.reduce((acc, cur) => {
        acc[coordsToKey(cur[0], cur[1])] = true
        return acc
    }, {})
}

function gridToCoords(grid) {
    return Object.keys(grid).reduce((acc, key) => {
        const {x, y} = keyToCoords(key)
        acc.push([x ,y])
        return acc
    }, [])
}

function nextGeneration(coords) {
    const grid = coordsToGrid(coords)
    const gridWithDeadNeighbors = addDeadNeighbors(grid)
    let newGrid = {}

    for (let key in gridWithDeadNeighbors) {
        const {x, y} = keyToCoords(key)
        const aliveNeighbors = countAliveNeighbors(x, y, grid)
        const currentlyAlive = isCellAlive(x, y, grid)
        const alive = shouldBeAlive(currentlyAlive, aliveNeighbors)
        setCell(x, y, newGrid, alive)
    }

    return gridToCoords(removeDeadNeighbors(newGrid))
}

function coordsToMatrix(coords, size, activeChar) {
    const centerOffset = Math.floor(size / 2)

    const matrix = []
    for (let i = 0; i < size; i++) {
        matrix[i] = new Array(size);
    }

    coords.forEach(coord => {
        const x = coord[0]
        const y = coord[1]

        const xWithOffset = x + centerOffset
        const yWithOffset = y + centerOffset

        if (yWithOffset >= 0 &&
            xWithOffset >= 0 &&
            yWithOffset < matrix.length &&
            xWithOffset < matrix.length) {
            matrix[yWithOffset][xWithOffset] = activeChar
        }
    })
    return matrix
}

module.exports = {
    coordsToKey,
    keyToCoords,
    isCellAlive,
    setCell,
    getNeighbourCoords,
    countAliveNeighbors,
    removeDeadNeighbors,
    addDeadNeighbors,
    shouldBeAlive,
    coordsToGrid,
    gridToCoords,
    nextGeneration,
    coordsToMatrix
}