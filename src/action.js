import Game from './models/game.model';
import { displayMessage } from './utils';
import * as sprites from './sprites';
import { launchEndCinematic } from './game';

function handleEndAction(gI) {
  if (!gI.extraAction) return;
  switch (gI.extraAction.type) {
    case 'show':
      gI.sceneObjects[gI.extraAction.p].hidden = false;
      return;
    case 'canAction':
      gI.canAction = true;
      return;
    case 'give':
      const object = {
        id: gI.extraAction.p,
        ...sprites[gI.extraAction.p],
      };
      gI.inventory[object.id] = object;
      console.log('give', gI.extraAction.p, gI.inventory);
      return;
    case 'end':
      return launchEndCinematic();
    case 'start':
      gI.canAction = true;
  }
  delete gI.extraAction;
}

export async function displayNextActionMessage() {
  const gI = Game.getInstance();
  document.querySelector('#bubble')?.remove();
  clearTimeout(gI.textTimeout);
  if (gI.extraAction) {
    handleEndAction(gI);
  }
  if (gI.currentLines.length) {
    const [message, author, action] = gI.currentLines.shift().split(':');
    if (author) {
      gI.currentAuthor = author;
    }
    const o = gI.sceneObjects[gI.currentAuthor];
    const bEl = document.createElement('div');
    bEl.id = 'bubble';
    let posX = gI.levelElementPos + o.x + o.width / 2 + (o.bubbleShift ?? 0);
    if (posX + 300 > window.innerWidth) {
      bEl.classList.add('reverse');
      posX -= 300;
    }
    bEl.style.cssText = `bottom: ${o.y + o.height + 25}px; left: ${posX}px;`;
    const txt = document.createElement('div');
    bEl.appendChild(txt);
    gI.canvasElement.appendChild(bEl);
    if (action) {
      const [type, p] = gI.currentDiag.actions[parseInt(action)].split(':');
      gI.extraAction = { type, p };
    }
    await displayMessage(gI, txt, message.split(''));
    return bEl.classList.add('continue');
  } else {
    delete gI.currentLines;
  }
}

export function toggleAction() {
  const gI = Game.getInstance();
  const object = gI.sceneObjects[gI.currentAvailableAction];
  if (object.currentAction >= object.actions.length - 1) {
    gI.actionButton.hidden = true;
  }
  const actionIndex = object.currentAction + 1;
  let action = object.actions[actionIndex];
  gI.currentAvailableAction = undefined;
  let diag;
  switch (action.type) {
    case 'cond':
      if (gI.inventory[action.condition]) {
        delete gI.inventory[action.condition];
        diag = gI.diag[action.good];
      } else {
        diag = gI.diag[action.bad];
      }
      gI.currentLines = [...diag.lines];
      gI.currentDiag = diag;
      return displayNextActionMessage();
    case 'msg':
      if (!action.repeat) {
        object.currentAction = actionIndex;
      }
      diag = gI.diag[action.diag];
      gI.currentLines = [...diag.lines];
      gI.currentDiag = diag;
      if (gI.inventory[action.condition]) {
        delete gI.inventory[action.condition];
      }
      return displayNextActionMessage();
    case 'pickup':
      object.currentAction = actionIndex;
      gI.inventory[object.id] = object;
      object.hidden = true;
      object.element.remove();
  }
}
