# Conway's Game of Life

Visualise GoL in the terminal or browser.

## Setup

```
npm install
```

## CLI runner

### Usage

```
npm run start-cli max_generations output_matrix_size timeout_between_generations starting_coordinates run_mode
```

### Examples

```
# small exploder
npm run start 99 17 250 "[[-1,0],[0,-1],[0,0],[0,1],[1,-1],[1,1],[2,0]]"

# glider - infinate
npm run start 99 23 250 "[[0,0],[1,1],[2,-1],[2,0],[2,1]]"

# 10 cell row - infinate
npm run start 100000 13 250 "[[0,-5],[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]]"

# gosper glider gun - infinite & grows
npm run start 100000 37 0 "[[-17,0],[-17,1],[-16,0],[-16,1],[-7,0],[-7,1],[-7,2],[-6,-1],[-6,3],[-5,-2],[-5,4],[-4,-2],[-4,4],[-3,1],[-2,-1],[-2,3],[-1,0],[-1,1],[-1,2],[0,1],[3,-2],[3,-1],[3,0],[4,-2],[4,-1],[4,0],[5,-3],[5,1],[7,-4],[7,-3],[7,1],[7,2],[17,-2],[17,-1],[18,-2],[18,-1]]"

# stats only mode of gosper glider gun - no visual render, just the stats
npm run start 100000 37 0 "[[-17,0],[-17,1],[-16,0],[-16,1],[-7,0],[-7,1],[-7,2],[-6,-1],[-6,3],[-5,-2],[-5,4],[-4,-2],[-4,4],[-3,1],[-2,-1],[-2,3],[-1,0],[-1,1],[-1,2],[0,1],[3,-2],[3,-1],[3,0],[4,-2],[4,-1],[4,0],[5,-3],[5,1],[7,-4],[7,-3],[7,1],[7,2],[17,-2],[17,-1],[18,-2],[18,-1]]" stats-only
```

## Browser runner

### Usage

```
# start web server, runs on localhost port 3000
npm run start-browser
```

### Examples

```
# small exploder
http://localhost:3000?coords=[-1,0],[0,-1],[0,0],[0,1],[1,-1],[1,1],[2,0]

# glider - infinate
http://localhost:3000?coords=[0,0],[1,1],[2,-1],[2,0],[2,1]

# 10 cell row - infinate
http://localhost:3000?coords=[0,-5],[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]

# gosper glider gun - infinite & grows
http://localhost:3000?coords=[-17,0],[-17,1],[-16,0],[-16,1],[-7,0],[-7,1],[-7,2],[-6,-1],[-6,3],[-5,-2],[-5,4],[-4,-2],[-4,4],[-3,1],[-2,-1],[-2,3],[-1,0],[-1,1],[-1,2],[0,1],[3,-2],[3,-1],[3,0],[4,-2],[4,-1],[4,0],[5,-3],[5,1],[7,-4],[7,-3],[7,1],[7,2],[17,-2],[17,-1],[18,-2],[18,-1]
```
