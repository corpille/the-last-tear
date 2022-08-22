import './style/style.css';
import { startGame, Player } from './src/game';
import { deave } from './src/sprites';
import { renderSprite } from './src/sprite';

window.audio = new AudioContext();

const startBtn = document.querySelector('#start-btn');
const home = document.querySelector('#home-page');

const el = document.createElement('div');
el.id = Player.id;
Player.element = el;
renderSprite(Player, Player.sprite);
home.append(el);

const Deave = {
  id: 'deave',
  ...deave,
};
const el2 = document.createElement('div');
el2.id = Deave.id;
Deave.element = el2;
home.append(el2);
renderSprite(Deave, Deave.sprite);

startBtn.addEventListener('click', startGame);
startGame();
