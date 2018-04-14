export default engine => {
  const masterGain = engine.context.createGain();
  masterGain.gain.value = 0.7;
  masterGain.connect(engine.context.destination);
  engine.masterGain = masterGain;
};
