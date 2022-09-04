import Game from './game';
import { displayNextActionMessage, toggleAction } from './action';
import { STEP } from './config';

function keyUp(event) {
  const gI = Game.getIns();
  const key = event.key;
  if (!gI.autoMove && (key === 'ArrowLeft' || key === 'ArrowRight')) {
    gI.xOffset = 0;
    gI.player.el.classList.remove(`key-${gI.player.currKF}`);
    gI.player.currKF = 0;
  }
}

function keyDown(event) {
  const gI = Game.getIns();
  const key = event.key;
  if (gI.autoMove) {
    return;
  }
  if (!gI.currentLines) {
    if (key === 'ArrowLeft') {
      gI.player.el.classList.add('flipped');
      gI.xOffset = -STEP;
    } else if (key === 'ArrowRight') {
      gI.player.el.classList.remove('flipped');
      gI.xOffset = STEP;
    } else if (key === ' ' && gI.jump === 0) {
      gI.jump = 1;
    }
  }
  if (key === 'e') {
    if (gI.currAvailAct && !gI.currentLines) {
      gI.xOffset = 0;
      toggleAction();
    } else if (gI.currentLines && !gI.isInAction) {
      clearTimeout(0);
      displayNextActionMessage();
    }
  }
}

export function bindCommands() {
  document.addEventListener('keyup', keyUp);
  document.addEventListener('keydown', keyDown);
}

export function unBindCommands() {
  document.removeEventListener('keyup', keyUp);
  document.removeEventListener('keydown', keyDown);
}
