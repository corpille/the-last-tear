import Game from './models/game.model';

import level1 from './levels/level1.json';

const levels = {
  level1,
};

export function createObject(object, gI) {
  const objectElement = document.createElement('div');
  objectElement.id = object.id;
  object.currentAction = -1;
  gI.levelElement.appendChild(objectElement);
  object.element = objectElement;
  gI.sceneObjects[object.id] = object;
  return object;
}

export async function loadLevel(name) {
  const gI = Game.getInstance();
  const level = levels[name];
  gI.levelElement.innerHTML = '';
  gI.levelElement.style.width = `${level.width}px`;
  gI.delta = gI.levelElement.offsetWidth - gI.canvasElement.offsetWidth;
  level.objects.forEach((e) => createObject(e, gI));
}
