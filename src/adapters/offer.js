const adaptToClient = (offers) =>
  offers.flatMap(({ type, offers: typeOffers }) =>
    typeOffers.map((offer) => ({
      ...offer,
      type,
    })),
  );

export { adaptToClient };
