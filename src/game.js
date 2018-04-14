import NOTES from './notes';

const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];
const randomRange = (min, max) => (Math.random() * (max - min) + min);

const STEP_MS = 50;

const tweenProgress = (start, delay) => {
  if (start < delay) {
    let percentage = start / delay * 100;
    const el = document.querySelector('.progress-inner');
    if (el) {
      el.style.width = `${percentage}%`;
    }
  }
  setTimeout(() => {
    tweenProgress(start + STEP_MS, delay);
  }, STEP_MS);
};

export const showNote = (actions, notes, index) => {
  if (index < notes.length) {
    actions.changeNote({note: notes[index].note, index});
    const delay = notes[index].time * 1000;
    tweenProgress(0, delay);
    setTimeout(() => {
      showNote(actions, notes, index + 1);
    }, delay);
  } else {
    actions.endGame('');
  }
};

export default () => {
  const gameLength = 10;
  const notes = [];
  for (let i = 0; i < gameLength; ++i) {
    notes.push({note: getRandom(NOTES), time: randomRange(0.8, 2.5)});
  }
  return {
    notes,
  };
};
