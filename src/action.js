import Game from './models/game.model';

export function displayNextActionMessage() {
  const gI = Game.getInstance();
  document.querySelector('#bubble')?.remove();
  if (gI.currentLines.length) {
    const message = gI.currentLines.shift();
    const object = gI.sceneObjects[message.p];
    const objectBubbleElement = document.createElement('div');
    objectBubbleElement.innerHTML = message.msg;
    objectBubbleElement.id = 'bubble';
    object.element.appendChild(objectBubbleElement);
  } else {
    gI.currentLines = undefined;
  }
}

export function toggleAction() {
  const gI = Game.getInstance();
  const object = gI.sceneObjects[gI.currentAvailableAction];
  if (object.currentAction >= object.actions.length - 1) {
    gI.actionButton.visible = false;
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
    object.visible = false;
    object.element.remove();
  }
}