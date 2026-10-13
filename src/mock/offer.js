const createOffer = (type, title, price) => ({
  id: crypto.randomUUID(),
  type,
  title,
  price,
});

export { createOffer };
