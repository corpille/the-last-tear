let instance = null;
export default class Game {
  scene = [];
  jump = 0;
  tick = 0;
  invEl = $('#inventory');
  canEl = $('#canvas');
  levEl = $('#level');
  levW = this.levEl.offsetWidth;
  canW = this.canEl.offsetWidth;
  canH = this.canEl.offsetHeight;
  levElPos = 0;
  xOffset = 0;
  keys = {};
  colliders = [];
  inventory = {};
  audioCtx = new AudioContext();

  static getIns() {
    if (instance == null) {
      instance = new Game();
    }
    return instance;
  }
}
