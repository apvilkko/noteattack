export const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];
export const randomRange = (min, max) => (Math.random() * (max - min) + min);
