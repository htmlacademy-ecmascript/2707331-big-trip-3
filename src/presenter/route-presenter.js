import PointPresenter from './point-presenter.js';

export default class RoutePresenter {
  #container;
  #points;
  #destinations;
  #offers;

  constructor({ container, points, destinations, offers }) {
    this.#container = container;
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init() {
    this.#points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        point,
        destinations: this.#destinations,
        offers: this.#offers,
        container: this.#container,
      });

      pointPresenter.init();
    });
  }
}
