var instance = null;
export default class Game {
  sceneObjects = [];
  jumpState = 0;
  tick = 0;
  inventoryElement = document.querySelector('#inventory');
  canvasElement = document.querySelector('#canvas');
  levelElement = document.querySelector('#level');
  levelElementPos = 0;
  inventory = {};
  audioCtx = new AudioContext();

  static getInstance() {
    if (instance == null) {
      instance = new Game();
      instance.constructeur = null;
    }

    return instance;
  }
}
