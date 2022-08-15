import { renderScene, renderInventory } from './render';
import { handleMovement, jump } from './movement';
import { bindCommands } from './input';
import { loadLevel, createObject } from './level';
import { FRAME_DURATION, TICK_PER_CYCLE } from './config';
import Game from './models/game.model';
import Audio from './audio';

const Bertrand = {
  id: 'bertrand',
  x: 550,
  y: 0,
  width: 100,
  height: 130,
  visible: true,
  element: document.querySelector('#bertrand'),
  movementAnimation: {
    nbKeyframes: 4,
    currentKeyFrame: 0,
    tickPerFrame: 5,
  },
};

const ActionButton = {
  id: 'action-btn',
  x: 0,
  y: 0,
  width: 44,
  height: 44,
  visible: false,
  element: document.querySelector('#action-btn'),
  hasBubble: false,
};

async function init() {
  const gI = Game.getInstance();
  const audio = Audio.getInstance();
  bindCommands();
  await loadLevel('main');
  gI.actionButton = createObject(ActionButton, gI);
  gI.player = createObject(Bertrand, gI);
  audio.playBgMusic(gI);
  return gI;
}

export async function startGame() {
  document.querySelector('#home-page').style.display = 'none';
  document.querySelector('#canvas').style.display = 'flex';

  const gI = await init();

  // Game loop
  setInterval(() => {
    if (gI.jumpState !== 0) {
      jump();
    }
    handleMovement();

    renderScene();

    renderInventory();

    gI.tick = gI.tick === TICK_PER_CYCLE ? 0 : gI.tick + 1;
  }, FRAME_DURATION);
}
