import './style/style.css';
import { startGame, Player } from './src';
import sprites from './src/sprites.json';
import { renderSprite } from './src/sprite';

const startBtn = $('#start-btn');
const home = document.querySelector('#home');

const el = $$('div');
el.id = Player.id;
Player.el = el;
renderSprite(Player, Player.sprite);
home.append(el);

const Deave = {
  id: 'deave',
  ...sprites.deave,
};
const el2 = $$('div');
el2.id = Deave.id;
Deave.el = el2;
home.append(el2);

renderSprite(Deave, Deave.sprite);

startBtn.addEventListener('click', startGame);
