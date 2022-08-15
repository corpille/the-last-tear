import { renderScene, renderInventory } from './render';
import { handleMovement, jump } from './movement';
import { bindCommands } from './input';
import { loadLevel, createObject } from './level';
import { FRAME_DURATION, TICK_PER_CYCLE } from './config';
import Game from './models/game.model';

const Bertrand = {
  id: 'bertrand',
  x: 50,
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
  const game = Game.getInstance();
  bindCommands();
  await loadLevel('main');
  game.actionButton = createObject(ActionButton, game);
  game.player = createObject(Bertrand, game);
  return game;
}

export async function startGame() {
  document.querySelector('#home-page').style.display = 'none';
  document.querySelector('#canvas').style.display = 'flex';

  const game = await init();

  // Game loop
  setInterval(() => {
    if (game.jumpState !== 0) {
      jump();
    }
    handleMovement();

    renderScene();

    renderInventory();

    game.tick = game.tick === TICK_PER_CYCLE ? 0 : game.tick + 1;
  }, FRAME_DURATION);
}
