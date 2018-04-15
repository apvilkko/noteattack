import midiHandler from './midiHandler';
import initSynth from './synth';
import initAudio from './audio';
import createGame, {showNote} from './game';

let context;

const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const initMidi = actions => {
  navigator.requestMIDIAccess()
  .then(access => {
    // Get lists of available MIDI controllers
    const inputs = access.inputs.values();

    let inputDevice;
    let device = inputs.next();
    const deviceIndex = Number(getParameterByName('device')) || 0;
    let index = 0;
    while (!device.done) {
      // if (device.value.manufacturer.indexOf('KORG') > -1) {
      if (index === deviceIndex) {
        inputDevice = device.value;
      }
      index++;
      device = inputs.next();
    }
    console.log('input midi device', inputDevice);
    actions.debug(`MIDI input: ${inputDevice ? inputDevice.name : '-'}`);
    access.onstatechange = e => {
      console.log(e, e.port.name, e.port.manufacturer, e.port.state);
      console.log(inputDevice);
    };

    if (inputDevice) {
      inputDevice.onmidimessage = midiHandler(actions);
    }
  });
};

const init = actions => {
  context = new AudioContext();
  const engine = {
    context,
    game: {},
  };

  initAudio(engine);
  initSynth(engine, actions);
  initMidi(actions);

  document.addEventListener('keydown', e => {
    const keyName = e.key;
    actions.keyEvent('keydown', keyName);
  });

  actions.newGame = mode => {
    engine.game = createGame(mode);
    const index = 0;
    showNote(actions, engine.game.notes, index);
  };
};

export default init;
