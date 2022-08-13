const FPS = 60;
const FrameDuration = 1000 / FPS;
const STEP = 5;
const TICK_PER_ANIMATION_KEYFRAME = 5;
const HITBOX_RADIUS = 100;

const canvas = document.querySelector('#canvas');
const levelElement = document.querySelector('#level');
const inventoryElement = document.querySelector('#inventory');
const delta = levelElement.offsetWidth - canvas.offsetWidth;

const Bertrand = {
  id: 'bertrand',
  x: 50,
  y: 0,
  width: 100,
  height: 130,
  visible: true,
  element: document.querySelector('#bertrand'),
  hasAnimation: true,
  nbKeyframes: 4,
  currentKeyFrame: 0,
};

const Deave = {
  id: 'deave',
  x: 500,
  y: 0,
  width: 110,
  height: 100,
  visible: true,
  element: document.querySelector('#deave'),
  hasAnimation: false,
  hasAction: true,
};

const ActionButton = {
  id: 'action-btn',
  x: 0,
  y: 0,
  width: 44,
  height: 44,
  visible: false,
  element: document.querySelector('#action-btn'),
  hasAnimation: false,
  hasBubble: false,
};

let sceneObjects = {};

let levelElementPos = { x: 0, y: 0 };
let xOffset = 0;
let jumpState = 0;
let currentAction;
let inventory = [];

let currentAvailableAction;

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

function createObject(object) {
  const objectElement = document.createElement('div');
  objectElement.id = object.id;
  object.currentAction = -1;
  levelElement.appendChild(objectElement);
  object.element = objectElement;
  sceneObjects[object.id] = object;
}

async function loadLevel(name) {
  const level = await loadLevelFile(`/levels/${name}.json`);
  levelElement.innerHTML = '';
  level.objects.forEach(createObject);
}

async function init() {
  await loadLevel('main');
  createObject(ActionButton);
  createObject(Bertrand);
}

function jump() {
  if (jumpState === 1) {
    Bertrand.y += STEP;
    if (Bertrand.y === 100) {
      jumpState = 2;
    }
  } else if (jumpState === 2) {
    Bertrand.y -= STEP;
    if (Bertrand.y === 0) {
      jumpState = 0;
    }
  }
}

function displayNextActionMessage() {
  console.log('displayNextActionMessage');
  document.querySelector('#bubble')?.remove();
  console.log(currentAction);
  if (currentAction.length) {
    const message = currentAction.shift();
    const object = sceneObjects[message.p];
    const objectBubbleElement = document.createElement('div');
    objectBubbleElement.innerHTML = message.msg;
    objectBubbleElement.id = 'bubble';
    object.element.appendChild(objectBubbleElement);
  } else {
    currentAction = undefined;
  }
}

function toggleAction() {
  const object = sceneObjects[currentAvailableAction];
  object.currentAction++;
  if (object.currentAction >= object.actions.length - 1) {
    ActionButton.visible = false;
  }
  console.log(object.actions[object.currentAction].type);
  currentAvailableAction = undefined;
  if (object.actions[object.currentAction].type === 'msg') {
    currentAction = object.actions[object.currentAction].lines;
    displayNextActionMessage();
  } else if (object.actions[object.currentAction].type === 'pickup') {
    inventory.push(object);
    object.visible = false;
    object.element.remove();
  }
}

(async function () {
  document.addEventListener('keyup', function (event) {
    const key = event.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      xOffset = 0;
      Bertrand.element.classList.remove(`key-${Bertrand.currentKeyFrame}`);
      Bertrand.currentKeyFrame = 0;
    }
  });

  document.addEventListener('keydown', function (event) {
    const key = event.key;
    if (!currentAction) {
      if (key === 'ArrowLeft') {
        bertrand.classList.add('left');
        xOffset = -STEP;
      } else if (key === 'ArrowRight') {
        bertrand.classList.remove('left');
        xOffset = STEP;
      } else if (key === ' ' && jumpState === 0) {
        jumpState = 1;
      }
    }
    if (key === 'e') {
      if (currentAvailableAction && !currentAction) {
        toggleAction();
      } else if (currentAction) {
        displayNextActionMessage();
      }
    }
  });

  function renderInventory() {
    if (inventoryElement.children.length != inventory.length) {
      inventory.innerHTML = '';
      inventory.forEach((object) => {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        const item = document.createElement('div');
        item.id = object.id;
        slot.appendChild(item);
        inventoryElement.appendChild(slot);
      });
    }
  }

  function renderScene() {
    Object.values(sceneObjects).forEach((object) => {
      if (
        object.visible &&
        object.actions &&
        object.actions.length > 0 &&
        object.currentAction < object.actions.length - 1
      ) {
        if (
          Bertrand.x + Bertrand.width > object.x - HITBOX_RADIUS &&
          Bertrand.x + Bertrand.width <
            object.x + object.width + HITBOX_RADIUS &&
          !currentAction
        ) {
          currentAvailableAction = object.id;
        } else if (currentAvailableAction === object.id) {
          currentAvailableAction = undefined;
        }
      }

      if (object.visible) {
        object.element.style.display = 'block';
        object.element.style.left = `${object.x}px`;
        object.element.style.bottom = `${object.y}px`;
      } else {
        object.element.style.display = 'none';
      }
    });

    if (currentAvailableAction) {
      const object = sceneObjects[currentAvailableAction];
      ActionButton.visible = true;
      ActionButton.x = object.x - HITBOX_RADIUS / 2;
      ActionButton.y = object.y + object.height + ActionButton.height;
      currentAvailableAction = object.id;
    } else {
      ActionButton.visible = false;
    }
  }

  function handleMovement() {
    // Movement
    if (xOffset) {
      if (
        Bertrand.x + xOffset > 0 &&
        Bertrand.x + xOffset < canvas.offsetWidth + delta - Bertrand.width
      ) {
        Bertrand.x += xOffset;

        // Animation
        if (tick === TICK_PER_ANIMATION_KEYFRAME) {
          Bertrand.element.classList.remove(`key-${Bertrand.currentKeyFrame}`);
          Bertrand.currentKeyFrame++;
          if (Bertrand.currentKeyFrame > Bertrand.nbKeyframes) {
            Bertrand.currentKeyFrame = 0;
          }
          Bertrand.element.classList.add(`key-${Bertrand.currentKeyFrame}`);
        }
        console.log(
          Bertrand.x,
          canvas.offsetWidth / 2 + -Bertrand.width,
          levelElement.offsetWidth - canvas.offsetWidth / 2
        );
        if (
          Bertrand.x >= canvas.offsetWidth / 2 + -Bertrand.width &&
          Bertrand.x <= levelElement.offsetWidth - canvas.offsetWidth / 2 &&
          levelElementPos.x - xOffset > -delta &&
          levelElementPos.x - xOffset < 0
        ) {
          levelElementPos.x -= xOffset;
        }
      }
      levelElement.style.left = `${levelElementPos.x}px`;
      levelElement.style.bottom = `${levelElementPos.y}px`;
    }
  }

  let tick = 0;
  await init();

  // Game loop
  setInterval(() => {
    if (jumpState !== 0) {
      jump();
    }
    handleMovement();

    renderScene();

    renderInventory();

    tick = tick === TICK_PER_ANIMATION_KEYFRAME ? 0 : tick + 1;
  }, FrameDuration);
})();
