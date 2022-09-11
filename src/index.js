import { renderScene, renderInventory } from './render';
import { updatePlayer } from './move';
import { bindCommands, unBindCommands } from './input';
import { loadLevel, createObject } from './level';
import Game from './game';
import sprites from './sprites.json';
import Audio from './audio';
import { displayMessage, pTimeout, defer } from './utils';

const startText =
  "Puddle has been through a tough time these days.\nHe has recently lost his best friend Deave in a flight accident.\nAfter a few days of crying and mourning, he goes to his friend's grave to say goodbye to him one last time...";
const endText =
  "After their last encounter Puddle never went to his friend's grave.\nHe followed his friend's advice and tried to live his life to the fullest.\nEven though he made some new friends along the way, he never forgot Deave, the friend that reminded him who he was.\n\nThe End";
let lastFrame;
let startDeferer;

export const Player = {
  id: 'puddle',
  ...sprites.puddle,
  y: 0,
  vx: 0,
  vy: 0,
  movS: [sprites.puddle.sprite, ...sprites.puddle.movS, sprites.puddle.sprite],
};
const start = $('.fs');
const c = $('#continue');

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
  gI.p.x = 0;
  gI.p.el.classList.add('p');
  gI.xOffset = 100;
  gI.autoX = 500;
  Audio.getIns().playBgMusic(gI);
}

export async function launchEndCinematic() {
  unBindCommands();
  Audio.getIns().stopBgMusic();
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

function firstListener(event) {
  if (event.key === 'e') {
    const gI = Game.getIns();
    document.removeEventListener('keydown', firstListener);
    clearTimeout(gI.textTimeout);
    start.style.opacity = 0;
    c.style.visibility = 'hidden';
    startDeferer.resolve();
  }
}

function launchStartCinematic() {
  startDeferer = defer();
  const gI = Game.getIns();
  start.style.cssText = 'visibility: visible; transition: none; opacity: 1';
  const startTxt = $('.fs-txt');
  document.addEventListener('keydown', firstListener);
  displayMessage(gI, startTxt, startText.split('')).then(
    () => (c.style.visibility = 'visible')
  );
  return startDeferer.promise;
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
