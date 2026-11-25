import Observable from '../framework/observable.js';
import { adaptToClient, adaptToServer } from '../adapters/point.js';

class Model extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];
  #api;

  constructor(api) {
    super();
    this.#api = api;
  }

  getPoints() {
    return this.#points;
  }

  setPoints(newPoints) {
    this.#points = newPoints;
    this._notify('change');
  }

  addPoint(point) {
    this.#points = [...this.#points, point].sort(
      (firstPoint, secondPoint) =>
        new Date(firstPoint.dateFrom) - new Date(secondPoint.dateFrom),
    );

    this._notify('change');
  }

  deletePoint(pointId) {
    const newPoints = this.#points.filter((point) => point.id !== pointId);

    if (newPoints.length === this.#points.length) {
      return;
    }

    this.#points = newPoints;
    this._notify('change');
  }

  updatePoint(updatedPoint) {
    return this.#api.updatePoint(adaptToServer(updatedPoint))
      .then((response) => {
        const adaptedPoint = adaptToClient(response);

        const pointIndex = this.#points.findIndex(
          (point) => point.id === adaptedPoint.id,
        );

        if (pointIndex === -1) {
          return;
        }

        this.#points = [
          ...this.#points.slice(0, pointIndex),
          adaptedPoint,
          ...this.#points.slice(pointIndex + 1),
        ];

        this._notify('change');
      });
  }

  getDestinations() {
    return this.#destinations;
  }

  getOffers() {
    return this.#offers;
  }

  setDestinations(newDestinations) {
    this.#destinations = newDestinations;
  }

  setOffers(newOffers) {
    this.#offers = newOffers;
  }
}

export default Model;
