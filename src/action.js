import Game from './models/game.model';
import { displayMessage } from './utils';
import * as sprites from './sprites';
import { launchEndCinematic } from './game';

function handleEndAction(gI) {
  if (!gI.extraAction) return;
  switch (gI.extraAction.type) {
    case 'show':
      gI.sceneObjects[gI.extraAction.p].hidden = false;
      if (gI.extraAction.toggleAction) {
        gI.currentAvailableAction = gI.extraAction.p;
        toggleAction();
      }
      return;
    case 'give':
      const object = {
        id: gI.extraAction.p,
        ...sprites[gI.extraAction.p],
      };
      gI.inventory[object.id] = object;
      return;
    case 'end':
      launchEndCinematic();
      return;
  }
}

export async function displayNextActionMessage() {
  const gI = Game.getInstance();
  document.querySelector('#bubble')?.remove();
  clearTimeout(gI.textTimeout);
  if (gI.currentLines.length) {
    const message = gI.currentLines.shift();
    const object = gI.sceneObjects[message.p];
    const objectBubbleElement = document.createElement('div');
    objectBubbleElement.id = 'bubble';
    let posX =
      gI.levelElementPos +
      object.x +
      object.width / 2 +
      (object.bubbleShift ?? 0);
    if (posX + 300 > window.innerWidth) {
      objectBubbleElement.classList.add('reverse');
      posX -= 300;
    }
    objectBubbleElement.style.bottom = `${object.y + object.height + 25}px`;
    objectBubbleElement.style.left = `${posX}px`;
    const txt = document.createElement('div');
    objectBubbleElement.appendChild(txt);
    gI.canvasElement.appendChild(objectBubbleElement);
    gI.extraAction = message.action;
    await displayMessage(gI, txt, message.msg.split(''));
    objectBubbleElement.classList.add('continue');
  } else {
    delete gI.currentLines;
    handleEndAction(gI);
  }
}

export function toggleAction() {
  const gI = Game.getInstance();
  const object = gI.sceneObjects[gI.currentAvailableAction];
  if (object.currentAction >= object.actions.length - 1) {
    gI.actionButton.hidden = true;
  }
  const nextActionIndex = object.currentAction + 1;
  let nextAction = object.actions[nextActionIndex];
  gI.currentAvailableAction = undefined;
  switch (nextAction.type) {
    case 'cond':
      if (gI.inventory[nextAction.condition]) {
        delete gI.inventory[nextAction.condition];
        gI.currentLines = [...object.actions[nextAction.good].lines];
      } else {
        gI.currentLines = [...object.actions[nextAction.bad].lines];
      }
      return displayNextActionMessage();
    case 'msg':
      if (!nextAction.repeat) {
        object.currentAction = nextActionIndex;
      }
      gI.currentLines = [...nextAction.lines];
      if (gI.inventory[nextAction.condition]) {
        delete gI.inventory[nextAction.condition];
      }
      return displayNextActionMessage();
    case 'pickup':
      object.currentAction = nextActionIndex;
      gI.inventory[object.id] = object;
      object.hidden = true;
      object.element.remove();
      return;
  }
}
