const POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const createPoint = (destination, offers) => ({
  id: crypto.randomUUID(),
  type: POINT_TYPES[5],
  destination: destination.id,
  dateFrom: '2026-10-15T10:30',
  dateTo: '2026-10-15T11:00',
  basePrice: 160,
  offers: offers.map((offer) => offer.id),
  isFavorite: false,
});

export { POINT_TYPES, createPoint };
