import { points, destinations, offers } from '../mock/mock.js';

class Model {
  #points = points;
  #destinations = destinations;
  #offers = offers;

  getPoints() {
    return this.#points;
  }

  getDestinations() {
    return this.#destinations;
  }

  getOffers() {
    return this.#offers;
  }
}

export default Model;
