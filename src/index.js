import { renderScene, renderInventory } from './render';
import { updatePlayer } from './move';
import { bindCommands } from './input';
import { loadLevel, createObject } from './level';
import Game from './game';
import sprites from './sprites.json';
import Audio from './audio';
import { displayMessage, pTimeout } from './utils';

const startText =
  "Puddle has been through a tough time these days.\nHe just lost his best friend Deave in a flight accident.\nAfter a few days of crying and mourning, he comes to his friend's grave to say goodbye to him one last time...";
const endText =
  "After their last encounter Puddle never went to his friend grave.\nHe followed his friend's advice and try to lived his life to the fullest.\nEven though he made some new friend along the way, he never forgot Deave, the friend that reminded him who he was.\n\nThe End";
let lastFrame;

export const Player = {
  id: 'puddle',
  ...sprites.puddle,
  y: 0,
  vx: 0,
  vy: 0,
  movS: [sprites.puddle.sprite, ...sprites.puddle.movS, sprites.puddle.sprite],
};

const ActionButton = {
  id: 'actionButton',
  hidden: true,
  hasBubble: false,
  ...sprites.actionButton,
};

async function init() {
  await launchStartCinematic();
  $('#canvas').style.display = 'flex';
  const gI = Game.getIns();
  gI.canW = gI.canEl.offsetWidth;
  gI.canH = gI.canEl.offsetHeight;
  bindCommands();
  loadLevel();
  gI.actionButton = createObject(ActionButton, gI);
  gI.p = createObject(Player, gI);
  gI.p.x = 4800;
  gI.p.el.classList.add('p');
  gI.xOffset = 100;
  gI.autoX = 500;
  Audio.getIns().playBgMusic(gI);
}

export async function launchEndCinematic() {
  const gI = Game.getIns();
  const startTxt = $('.fs-txt');
  startTxt.innerHTML = '';
  const deave = gI.scene.deave;
  deave.el.style.transition = 'opacity 2s';
  deave.hidden = true;
  await pTimeout(2000);
  gI.p.el.classList.add('flipped');
  gI.xOffset = -100;
  gI.autoX = -120;
  const el = $('.fs');
  el.style.cssText = 'visibility: visible; z-index: 3';
  await pTimeout(3000);
  el.style.opacity = 1;
  await pTimeout(2000);
  await displayMessage(gI, startTxt, endText.split(''));
}

async function launchStartCinematic() {
  return new Promise(async (resolve) => {
    const gI = Game.getIns();
    const start = $('.fs');
    const c = $('#continue');
    start.style.cssText = 'visibility: visible; transition: none; opacity: 1';
    const startTxt = $('.fs-txt');
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

function gameLoop(timestamp) {
  window.requestAnimationFrame(gameLoop);

  if (timestamp < lastFrame + 1000 / 60) {
    return;
  }
  var dt = (timestamp - lastFrame) / 1000;
  lastFrame = timestamp;
  updatePlayer(dt);
  renderScene();
  renderInventory();
}

export async function startGame() {
  $('#home').style.display = 'none';
  await init();
  lastFrame = performance.now();
  window.requestAnimationFrame(gameLoop);
}
