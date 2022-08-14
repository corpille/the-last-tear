import Game from './models/game.model';

function loadLevelFile(file) {
  return new Promise((resolve) => {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType('application/json');
    rawFile.open('GET', file, true);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4 && rawFile.status == '200') {
        resolve(JSON.parse(rawFile.responseText));
      }
    };
    rawFile.send(null);
  });
}

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
  const level = await loadLevelFile(`/levels/${name}.json`);
  gI.levelElement.innerHTML = '';
  gI.levelElement.style.width = `${level.width}px`;
  gI.delta = gI.levelElement.offsetWidth - gI.canvasElement.offsetWidth;
  level.objects.forEach((e) => createObject(e, gI));
}
