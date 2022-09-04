let instance = null;
export default class Game {
  scene = [];
  jump = 0;
  tick = 0;
  invEl = $('#inventory');
  canEl = $('#canvas');
  levEl = $('#level');
  levElPos = 0;
  inventory = {};
  audioCtx = new AudioContext();

  static getIns() {
    if (instance == null) {
      instance = new Game();
    }
    return instance;
  }
}
