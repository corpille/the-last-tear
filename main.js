import './style/style.css';
import { startGame } from './src/game';

const startBtn = document.querySelector('#start-btn');

startBtn.addEventListener('click', startGame);
