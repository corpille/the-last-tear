import { renderScene, renderInventory } from './render';
import { handleMovement, jump } from './movement';
import { bindCommands } from './input';
import { loadLevel, createObject } from './level';
import { FRAME_DURATION, TICK_PER_CYCLE } from './config';
import Game from './game';
import { puddle, actionButton } from './sprites';
import Audio from './audio';
import { displayMessage, pTimeout } from './utils';

const startText =
  "Puddle has been through a tough time these days.\nHe just lost his best friend Deave in a flight accident.\nAfter a few days of crying and mourning, he comes to his friend's grave to say goodbye to him one last time…";

const endText =
  "After their last encounter Puddle never went to his friend grave.\nHe followed his friend's advice and try to lived his life to the fullest.\nEven though he made some new friend along the way, he never forgot Deave, the friend that reminded him who he was.\n\nThe End";

export const Player = {
  id: 'puddle',
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
  loadLevel();
  gI.actionButton = createObject(ActionButton, gI);
  Player.x = -gI.levelElementPos - 10;
  gI.player = createObject(Player, gI);
  gI.player.element.classList.add('player');
  gI.xOffset = 3;
  gI.autoMove = 500;
  audio.playBgMusic(gI);
  return gI;
}

export async function launchEndCinematic() {
  const gI = Game.getInstance();
  const startTxt = document.querySelector('.fullscreen-txt');
  startTxt.innerHTML = '';
  const deave = gI.sceneObjects['deave'];
  deave.element.style.transition = 'opacity 2s';
  gI.sceneObjects['deave'].hidden = true;
  await pTimeout(2000);
  gI.player.element.classList.add('flipped');
  gI.xOffset = -3;
  gI.autoMove = -120;
  const el = document.querySelector('.fullscreen');
  el.style.cssText = 'visibility: visible; z-index: 3';
  await pTimeout(3000);
  el.style.opacity = 1;
  await pTimeout(2000);
  await displayMessage(gI, startTxt, endText.split(''));
}

async function launchStartCinematic() {
  return new Promise(async (resolve) => {
    const gI = Game.getInstance();
    const start = document.querySelector('.fullscreen');
    const c = document.getElementById('continue');
    start.style.cssText = 'visibility: visible; transition: none; opacity: 1';
    const startTxt = document.querySelector('.fullscreen-txt');
    document.addEventListener('keydown', (event) => {
      if (event.key === 'e') {
        clearTimeout(gI.textTimeout);
        start.style.opacity = 0;
        c.style.visibility = 'hidden';
        resolve();
      }
    });
    await displayMessage(gI, startTxt, startText.split(''));
    c.style.visibility = 'visible';
  });
}

export async function startGame() {
  document.querySelector('#home-page').style.display = 'none';
  await launchStartCinematic();
  const gI = await init();
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
