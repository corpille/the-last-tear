import Game from './models/game.model';

export function displayNextActionMessage() {
  const gI = Game.getInstance();
  document.querySelector('#bubble')?.remove();
  if (gI.currentAction.length) {
    const message = gI.currentAction.shift();
    const object = gI.sceneObjects[message.p];
    const objectBubbleElement = document.createElement('div');
    objectBubbleElement.innerHTML = message.msg;
    objectBubbleElement.id = 'bubble';
    object.element.appendChild(objectBubbleElement);
  } else {
    gI.currentAction = undefined;
  }
}

export function toggleAction() {
  const gI = Game.getInstance();
  const object = gI.sceneObjects[gI.currentAvailableAction];
  object.currentAction++;
  if (object.currentAction >= object.actions.length - 1) {
    gI.actionButton.visible = false;
  }
  gI.currentAvailableAction = undefined;
  if (object.actions[object.currentAction].type === 'msg') {
    gI.currentAction = object.actions[object.currentAction].lines;
    displayNextActionMessage();
  } else if (object.actions[object.currentAction].type === 'pickup') {
    gI.inventory.push(object);
    object.visible = false;
    object.element.remove();
  }
}
