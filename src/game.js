import { renderScene, renderInventory } from './render';
import { handleMovement, jump } from './movement';
import { bindCommands } from './input';
import { loadLevel, createObject } from './level';
import { FRAME_DURATION, STEP, TICK_PER_CYCLE } from './config';
import Game from './models/game.model';
import { puddle, actionButton } from './sprites';
import Audio from './audio';
import { displayMessage } from './utils';

const startText = `Puddle has been through tough time these days.
He just lost his best friend Deave in a flight accident.
After a few days of crying and weeping, he comes to his friend grave to say goodbye to him one last time...`;

export const Player = {
  id: 'puddle',
  x: -10,
  y: 0,
  ...puddle,
  movementSprites: [puddle.sprite, ...puddle.movementSprites, puddle.sprite],
};

const ActionButton = {
  id: 'actionButton',
  hidden: true,
  hasBubble: false,
  ...actionButton,
};

function init() {
  document.querySelector('#canvas').style.display = 'flex';
  const gI = Game.getInstance();
  const audio = Audio.getInstance();
  bindCommands();
  loadLevel('level1');
  gI.actionButton = createObject(ActionButton, gI);
  gI.player = createObject(Player, gI);
  gI.player.element.classList.add('player');
  gI.xOffset = STEP;
  gI.autoMove = 500;
  audio.playBgMusic(gI);
  return gI;
}

async function launchStartCinematic() {
  const gI = Game.getInstance();
  const start = document.getElementById('start');
  start.style.visibility = 'visible';
  const startTxt = document.getElementById('start-txt');
  await displayMessage(gI, startTxt, startText.split(''));
  const c = document.getElementById('continue');
  c.style.visibility = 'visible';
  return new Promise((resolve) => {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'e') {
        resolve();
      }
    });
  });
}

export async function startGame() {
  document.querySelector('#home-page').style.display = 'none';

  // await launchStartCinematic();

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
