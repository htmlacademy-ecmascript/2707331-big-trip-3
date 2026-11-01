import PointPresenter from './point-presenter.js';

export default class RoutePresenter {
  #container;
  #points;
  #destinations;
  #offers;
  #pointPresenters = [];

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
        onDataChange: this.#handlePointChange,
      });

      this.#pointPresenters.push(pointPresenter);
      pointPresenter.init();
    });
  }

  #handlePointChange = (updatedPoint) => {
    const pointIndex = this.#points.findIndex(
      (point) => point.id === updatedPoint.id,
    );

    if (pointIndex === -1) {
      return;
    }

    Object.assign(this.#points[pointIndex], updatedPoint);
    this.#pointPresenters[pointIndex].update(this.#points[pointIndex]);
  };
}
