import midiHandler from './midiHandler';
import initSynth from './synth';
import initAudio from './audio';
import createGame, {showNote} from './game';

let context;

const initMidi = actions => {
  navigator.requestMIDIAccess()
  .then(access => {
    // Get lists of available MIDI controllers
    const inputs = access.inputs.values();

    let inputDevice;
    let device = inputs.next();
    while (!device.done) {
      if (device.value.manufacturer.indexOf('KORG') > -1) {
        inputDevice = device.value;
      }
      device = inputs.next();
    }
    console.log('input midi device', inputDevice);
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
