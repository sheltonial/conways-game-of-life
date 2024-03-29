# Conway's Game of Life

Visualise the Game of Life in the browser.

## Live demo

Pan & zoom on click or touch devices.

- [Gosper glider gun](https://sheltonial.github.io/conways-game-of-life/master/index.html?coords=[-17,0],[-17,1],[-16,0],[-16,1],[-7,0],[-7,1],[-7,2],[-6,-1],[-6,3],[-5,-2],[-5,4],[-4,-2],[-4,4],[-3,1],[-2,-1],[-2,3],[-1,0],[-1,1],[-1,2],[0,1],[3,-2],[3,-1],[3,0],[4,-2],[4,-1],[4,0],[5,-3],[5,1],[7,-4],[7,-3],[7,1],[7,2],[17,-2],[17,-1],[18,-2],[18,-1]&speed=100)
- [Gosper glider gun (fast)](https://sheltonial.github.io/conways-game-of-life/master/index.html?coords=[-17,0],[-17,1],[-16,0],[-16,1],[-7,0],[-7,1],[-7,2],[-6,-1],[-6,3],[-5,-2],[-5,4],[-4,-2],[-4,4],[-3,1],[-2,-1],[-2,3],[-1,0],[-1,1],[-1,2],[0,1],[3,-2],[3,-1],[3,0],[4,-2],[4,-1],[4,0],[5,-3],[5,1],[7,-4],[7,-3],[7,1],[7,2],[17,-2],[17,-1],[18,-2],[18,-1]&speed=10)
- [Infinite glider](https://sheltonial.github.io/conways-game-of-life/master/index.html?coords=[0,0],[1,1],[2,-1],[2,0],[2,1]&speed=100)
- [Small exploder](https://sheltonial.github.io/conways-game-of-life/master/index.html?coords=[-1,0],[0,-1],[0,0],[0,1],[1,-1],[1,1],[2,0]&speed=1000)

## Setup

```
npm install
```

## Build project

```
# start web server, runs on localhost port 3000
npm run start
```

## Examples

```
# small exploder
index.html?coords=[-1,0],[0,-1],[0,0],[0,1],[1,-1],[1,1],[2,0]

# glider - infinate
index.html?coords=[0,0],[1,1],[2,-1],[2,0],[2,1]

# 10 cell row - infinate
index.html?coords=[0,-5],[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]

# gosper glider gun - infinite & grows
index.html?coords=[-17,0],[-17,1],[-16,0],[-16,1],[-7,0],[-7,1],[-7,2],[-6,-1],[-6,3],[-5,-2],[-5,4],[-4,-2],[-4,4],[-3,1],[-2,-1],[-2,3],[-1,0],[-1,1],[-1,2],[0,1],[3,-2],[3,-1],[3,0],[4,-2],[4,-1],[4,0],[5,-3],[5,1],[7,-4],[7,-3],[7,1],[7,2],[17,-2],[17,-1],[18,-2],[18,-1]
```
