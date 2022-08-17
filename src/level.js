import Game from './models/game.model';
import { DEFAULT_PIXEL_SIZE } from './config';
import { renderSprite } from './sprite';
import level1 from './levels/level1.json';
import * as sprites from './sprites';

const levels = {
  level1,
};

export function createObject(object, gI) {
  const objectElement = document.createElement('div');
  objectElement.id = object.id;
  object.currentAction = -1;
  object.height =
    object.sprite.length * (object.spriteScale || DEFAULT_PIXEL_SIZE);
  object.width =
    object.sprite[0].length * (object.spriteScale || DEFAULT_PIXEL_SIZE);
  object.element = objectElement;
  renderSprite(object, object.sprite);
  gI.levelElement.appendChild(objectElement);
  gI.sceneObjects[object.id] = object;
  return object;
}

export async function loadLevel(name) {
  const gI = Game.getInstance();
  const level = levels[name];
  gI.levelElement.innerHTML = '';
  gI.levelElement.style.width = `${level.width}px`;
  gI.delta = gI.levelElement.offsetWidth - gI.canvasElement.offsetWidth;
  level.objects.forEach((object) =>
    createObject(
      {
        ...object,
        ...sprites[object.id],
      },
      gI
    )
  );
}
