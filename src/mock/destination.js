const getRandomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const createDestination = () => ({
  id: crypto.randomUUID(),
  name: 'Amsterdam',
  description: 'A beautiful city with picturesque canals.',
  pictures: [
    {
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 1000)}`,
      description: 'Amsterdam',
    },
  ],
});

export { createDestination };
