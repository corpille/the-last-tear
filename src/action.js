import Game from './models/game.model';
import { displayMessage } from './utils';

export async function displayNextActionMessage() {
  const gI = Game.getInstance();
  document.querySelector('#bubble')?.remove();
  if (gI.currentLines.length) {
    const message = gI.currentLines.shift();
    const object = gI.sceneObjects[message.p];
    const objectBubbleElement = document.createElement('div');
    objectBubbleElement.id = 'bubble';
    objectBubbleElement.style.bottom = `${object.height + 15}px`;
    objectBubbleElement.style.left = `${
      object.width / 2 + (object.bubbleShift ?? 0)
    }px`;
    object.element.appendChild(objectBubbleElement);
    gI.extraAction = message.action;
    await displayMessage(gI, objectBubbleElement, message.msg.split(''));
    objectBubbleElement.classList.add('continue');
  } else {
    delete gI.currentLines;
    if (gI.extraAction) {
      if (gI.extraAction.type == 'show') {
        gI.sceneObjects[gI.extraAction.p].hidden = false;
        if (gI.extraAction.toggleAction) {
          gI.currentAvailableAction = gI.extraAction.p;
          toggleAction();
        }
      }
    }
  }
}

export function toggleAction() {
  const gI = Game.getInstance();
  const object = gI.sceneObjects[gI.currentAvailableAction];
  if (object.currentAction >= object.actions.length - 1) {
    gI.actionButton.hidden = true;
  }
  const nextActionIndex = object.currentAction + 1;
  const nextAction = object.actions[nextActionIndex];
  gI.currentAvailableAction = undefined;
  if (nextAction.type === 'msg') {
    if (
      !nextAction.condition ||
      (nextAction.condition && gI.inventory[nextAction.condition])
    ) {
      if (!nextAction.repeat) {
        object.currentAction = nextActionIndex;
      }
      gI.currentLines = [...nextAction.lines];
      if (gI.inventory[nextAction.condition]) {
        delete gI.inventory[nextAction.condition];
      }
      return displayNextActionMessage();
    }
  } else if (nextAction.type === 'pickup') {
    object.currentAction = nextActionIndex;
    gI.inventory[object.id] = object;
    object.hidden = true;
    object.element.remove();
  }
}
