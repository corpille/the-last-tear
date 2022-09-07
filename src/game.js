let instance = null;
export default class Game {
  scene = [];
  jump = 0;
  tick = 0;
  invEl = $('#inv');
  canEl = $('#canvas');
  lev = $('#level');
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
