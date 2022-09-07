import Game from './game';
import { displayNextActionMessage, toggleAction } from './action';

function keyUp(event) {
  const gI = Game.getIns();
  const key = event.key;
  gI.keys[key] = false;
  if (!gI.autoX && (key === 'ArrowLeft' || key === 'ArrowRight')) {
    gI.p.el.classList.remove(`key-${gI.p.currKF}`);
    gI.p.currKF = 0;
  }
}

function keyDown(event) {
  const gI = Game.getIns();
  const key = event.key;
  if (gI.autoX) {
    return;
  }
  if (!gI.currentLines) {
    gI.keys[key] = true;
    if (key === 'ArrowLeft') {
      gI.p.el.classList.add('flipped');
    } else if (key === 'ArrowRight') {
      gI.p.el.classList.remove('flipped');
    }
  }
  if (key === 'e') {
    if (gI.currAvailAct && !gI.currentLines) {
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
