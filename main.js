import './style/style.css';
import { startGame } from './src/game';

window.audio = new AudioContext();

const startBtn = document.querySelector('#start-btn');

startBtn.addEventListener('click', startGame);
