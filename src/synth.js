const POLYPHONY = 8;

const midiToFreq = m => {
  const tuning = 440;
  return m === 0 || (m > 0 && m < 128) ?
    Math.pow(2, (m - 69) / 12) * tuning : null;
};

const vco = engine => {
  const oscillator = engine.context.createOscillator();
  oscillator.type = 'triangle';
  oscillator.frequency.value = 1;
  oscillator.start(0);
  return oscillator;
};

const vca = (engine, gainValue = 0) => {
  const gain = engine.context.createGain();
  gain.gain.value = gainValue;
  return gain;
};

const noteOn = engine => note => {
  const {synth} = engine;
  const {index} = synth;
  synth.vcos[index].frequency.setValueAtTime(
    midiToFreq(note), engine.context.currentTime);
  synth.vcas[index].gain.setValueAtTime(0.5, engine.context.currentTime + 0.1);
  synth.current[index] = note;
  synth.index++;
  if (synth.index >= POLYPHONY) {
    synth.index = 0;
  }
};

const noteOff = engine => note => {
  const {synth} = engine;
  const found = synth.current.findIndex(x => x === note);
  if (found > -1) {
    synth.vcas[found].gain.setValueAtTime(0, engine.context.currentTime + 0.2);
    synth.current[found] = null;
  }
};

const init = (engine, actions) => {
  const mixBus = vca(engine, 0.7);
  mixBus.connect(engine.masterGain);

  const vcas = Array.from({length: POLYPHONY}, () => {
    const node = vca(engine);
    node.connect(mixBus);
    return node;
  });
  const vcos = Array.from({length: POLYPHONY}, (_, i) => {
    const node = vco(engine);
    node.connect(vcas[i]);
    return node;
  });

  const synth = {
    vcos,
    vcas,
    mixBus,
    index: 0,
    current: Array.from({length: POLYPHONY}, () => null),
  };
  console.log('synth', synth);
  engine.synth = synth;

  actions.noteOn = noteOn(engine);
  actions.noteOff = noteOff(engine);
};

export default init;
