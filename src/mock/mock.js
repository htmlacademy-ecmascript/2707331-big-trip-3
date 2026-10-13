import { createPoint } from './point.js';
import { createDestination } from './destination.js';
import { createOffer } from './offer.js';

const destinations = [createDestination()];

const offers = [
  createOffer('flight', 'Add breakfast', 20),
  createOffer('flight', 'Choose seats', 15),
];

const points = [
  createPoint(destinations[0], offers),
  createPoint(destinations[0], offers),
  createPoint(destinations[0], offers),
];

export { points, destinations, offers };
