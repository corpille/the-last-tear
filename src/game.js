let instance = null;
export default class Game {
  scene = [];
  invEl = $('#inv');
  canEl = $('#canvas');
  lev = $('#level');
  lOff = 0;
  levPos = 0;
  xOffset = 0;
  keys = {};
  col = [];
  inv = {};
  aCtx = new AudioContext();

  static getIns() {
    if (instance == null) {
      instance = new Game();
    }
    return instance;
  }
}
