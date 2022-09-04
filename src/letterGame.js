import { unBindCommands, bindCommands } from './input';
import { pTimeout, defer } from './utils';
import Game from './game';

const letters = $('#letters');
const game = $('#game');
const go = $('#play');

const phrase =
  'My dear Suzy I know we had our differences but I love you please forgive me';
let word;
let p;

const duration = 0.7;
let endPromise;
let i = 0;
let timeout;

function keyListener(event) {
  const key = event.key;
  if (key === word[i]) {
    if (timeout) {
      clearTimeout(timeout);
    }
    const el = $(`.key-${i}`);
    el?.classList.remove('active');
    i++;
    playWord();
  }
}

function createdkey(key, i) {
  const el = document.createElement('div');
  el.classList.add('key', `key-${i}`);
  el.innerText = key;
  letters.appendChild(el);
}

function playWord() {
  if (word.length === i) {
    return p.resolve();
  }
  const el = $(`.key-${i}`);
  el?.classList.add('active');
  timeout = setTimeout(() => {
    p.reject();
  }, duration * 1000);
}

async function playSequence(words) {
  let isGood = true;
  while (isGood && words.length) {
    letters.innerHTML = '';
    word = words.shift();
    word.split('').forEach(createdkey);
    i = 0;
    p = defer();
    playWord();
    try {
      await p.promise;
    } catch (e) {
      isGood = false;
    }
  }
  if (!isGood) {
    letters.innerText = 'You failed !';
    go.innerText = 'Try again !';
    go.style.display = 'block';
  } else {
    letters.innerText = 'Well done !';
    go.innerText = 'Go back';
    go.style.display = 'block';
    go.removeEventListener('click', countdown);
    go.addEventListener('click', endgame);
  }
}

function endgame() {
  bindCommands();
  const gI = Game.getIns();
  game.style.display = 'none';
  gI.levEl.classList.remove('bg');
  document.removeEventListener('keydown', keyListener);
  go.removeEventListener('click', endgame);
  endPromise.resolve();
}

async function countdown() {
  go.style.display = 'none';
  letters.innerHTML = '3';
  await pTimeout(1000);
  letters.innerHTML = '2';
  await pTimeout(1000);
  letters.innerHTML = '1';
  await pTimeout(1000);
  document.addEventListener('keydown', keyListener);
  playSequence(phrase.toLowerCase().split(' '));
}

export function playLetterGame(gI, p) {
  endPromise = p;
  unBindCommands();
  game.style.display = 'flex';
  gI.levEl.classList.add('bg');
  go.addEventListener('click', countdown);
}
