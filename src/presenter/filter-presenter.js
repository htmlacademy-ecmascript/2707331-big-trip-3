
import { render, remove } from '../framework/render.js';
import FilterView from '../view/filter-view.js';

export default class FilterPresenter {
  #container;
  #filterModel;
  #pointsModel;
  #filterView = null;

  constructor({ container, model, pointsModel }) {
    this.#container = container;
    this.#filterModel = model;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointsModel.addObserver(this.#handlePointsChange);
    this.#renderFilter();
  }

  #renderFilter() {
    if (this.#filterView) {
      remove(this.#filterView);
    }

    const points = this.#pointsModel.getPoints();
    const now = new Date();

    const availableFilters = {
      everything: true,
      future: points.some((point) => new Date(point.dateFrom) > now),
      present: points.some(
        (point) =>
          new Date(point.dateFrom) <= now &&
          new Date(point.dateTo) >= now,
      ),
      past: points.some((point) => new Date(point.dateTo) < now),
    };

    this.#filterView = new FilterView(
      this.#handleFilterChange,
      this.#filterModel.getFilter(),
      availableFilters,
    );

    render(this.#filterView, this.#container);
  }

  #handlePointsChange = () => {
    this.#renderFilter();
  };

  #handleFilterChange = (filter) => {
    this.#filterModel.setFilter(filter);
  };
}

