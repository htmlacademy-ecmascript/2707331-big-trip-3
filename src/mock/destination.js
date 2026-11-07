const getRandomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const createDestination = () => ({
  id: crypto.randomUUID(),
  name: 'Amsterdam',
  description: 'A beautiful city with picturesque canals.',
  pictures: [
    {
      src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
      description: 'Amsterdam',
    },
  ],
});

export { createDestination };
