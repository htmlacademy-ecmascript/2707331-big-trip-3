import {
  render,
  remove,
  replace,
  RenderPosition,
} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import PointPresenter, { UserAction } from './point-presenter.js';
import ListEmptyView from '../view/list-empty-view.js';
import FormNewView from '../view/form-new-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import TripInfoView from '../view/trip-info-view.js';

const parseDateTime = (value) => {
  const [date, time] = value.split(' ');
  const [day, month, year] = date.split('/');
  const [hours, minutes] = time.split(':');

  return new Date(
    2000 + Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
  );
};

export default class RoutePresenter {
  #container;
  #tripInfoContainer;
  #tripInfoView = null;
  #model;
  #filterModel;
  #sortComponent = null;
  #sortType = 'day';
  #destinations;
  #offers;
  #newEventButton;
  #pointPresenters = [];
  #emptyView = null;
  #newPointView = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: 0,
    upperLimit: 0,
  });

  constructor({
    container,
    tripInfoContainer,
    model,
    filterModel,
    destinations,
    offers,
    newEventButton,
  }) {
    this.#container = container;
    this.#tripInfoContainer = tripInfoContainer;
    this.#model = model;
    this.#filterModel = filterModel;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#newEventButton = newEventButton;
  }

  init() {
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#model.addObserver(this.#handleModelEvent);

    this.#sortComponent = new SortView(this.#handleSortChange);

    render(
      this.#sortComponent,
      this.#container.parentElement,
      RenderPosition.AFTERBEGIN,
    );

    this.#newEventButton.addEventListener('click', this.#handleNewEventClick);
    this.#renderTripInfo();
    this.#renderPoints();
  }

  #renderTripInfo() {
    const tripInfoView = new TripInfoView(
      this.#model.getPoints(),
      this.#destinations,
      this.#offers,
    );

    if (this.#tripInfoView) {
      replace(tripInfoView, this.#tripInfoView);
    } else {
      render(tripInfoView, this.#tripInfoContainer);
    }

    this.#tripInfoView = tripInfoView;
  }

  #getPoints() {
    const points = this.#model.getPoints();
    const filter = this.#filterModel.getFilter();
    const now = new Date();

    let filteredPoints = points;

    switch (filter) {
      case 'future':
        filteredPoints = points.filter(
          (point) => new Date(point.dateFrom) > now,
        );
        break;
      case 'present':
        filteredPoints = points.filter(
          (point) =>
            new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now,
        );
        break;
      case 'past':
        filteredPoints = points.filter((point) => new Date(point.dateTo) < now);
        break;
      case 'everything':
      default:
        break;
    }

    return this.#sortPoints(filteredPoints);
  }

  #sortPoints(points) {
    const sortedPoints = [...points];

    switch (this.#sortType) {
      case 'time':
        return sortedPoints.sort((firstPoint, secondPoint) => {
          const firstDuration =
            new Date(firstPoint.dateTo) - new Date(firstPoint.dateFrom);
          const secondDuration =
            new Date(secondPoint.dateTo) - new Date(secondPoint.dateFrom);

          return secondDuration - firstDuration;
        });
      case 'price':
        return sortedPoints.sort(
          (firstPoint, secondPoint) =>
            secondPoint.basePrice - firstPoint.basePrice,
        );
      case 'day':
      default:
        return sortedPoints.sort(
          (firstPoint, secondPoint) =>
            new Date(firstPoint.dateFrom) - new Date(secondPoint.dateFrom),
        );
    }
  }

  #handleSortChange = (sortType) => {
    if (this.#sortType === sortType) {
      return;
    }

    this.#sortType = sortType;
    this.#renderPoints();
  };

  #renderPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#pointPresenters = [];

    this.#container
      .querySelectorAll('.event:not(.event--edit)')
      .forEach((element) => element.closest('.trip-events__item')?.remove());

    const points = this.#getPoints();

    if (points.length === 0) {
      this.#container.hidden = true;

      if (this.#emptyView) {
        remove(this.#emptyView);
      }

      this.#emptyView = new ListEmptyView(this.#filterModel.getFilter());
      render(this.#emptyView, this.#container.parentElement);
      return;
    }

    this.#container.hidden = false;

    if (this.#emptyView) {
      remove(this.#emptyView);
      this.#emptyView = null;
    }

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        point,
        destinations: this.#destinations,
        offers: this.#offers,
        container: this.#container,
        onDataChange: this.#handlePointChange,
        onEditStart: this.#resetAllPointPresenters,
      });

      this.#pointPresenters.push(pointPresenter);
      pointPresenter.init();
    });
  }

  #resetAllPointPresenters = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (action, point) => {
    this.#uiBlocker.block();

    let request;

    switch (action) {
      case UserAction.UPDATE:
        request = this.#model.updatePoint(point);
        break;
      case UserAction.ADD:
        request = this.#model.addPoint(point);
        break;
      case UserAction.DELETE:
        request = this.#model.deletePoint(point.id);
        break;
      default:
        request = Promise.resolve();
    }

    return request.finally(() => this.#uiBlocker.unblock());
  };

  #handleModelEvent = () => {
    this.#resetSort();
    this.#renderTripInfo();
    this.#renderPoints();
  };

  #resetSort() {
    this.#sortType = 'day';
    const daySort = this.#sortComponent.element.querySelector('#sort-day');

    if (daySort) {
      daySort.checked = true;
    }
  }

  #handleNewEventClick = () => {
    if (this.#newPointView) {
      return;
    }

    this.#resetAllPointPresenters();
    this.#filterModel.setFilter('everything');
    this.#resetSort();

    if (this.#emptyView) {
      remove(this.#emptyView);
      this.#emptyView = null;
    }
    this.#container.hidden = false;

    this.#newPointView = new FormNewView(
      this.#destinations,
      this.#offers,
      this.#handleNewPointSubmit,
      this.#closeNewPointForm,
    );

    render(this.#newPointView, this.#container, 'afterbegin');
    this.#newEventButton.disabled = true;
    document.addEventListener('keydown', this.#handleEscKeydown);
  };

  #handleNewPointSubmit = (formData, state) => {
    const destination = this.#destinations.find(
      (item) => item.name === formData.get('event-destination'),
    );

    if (!destination) {
      return;
    }

    const point = {
      type: formData.get('event-type'),
      destination: destination.id,
      dateFrom: parseDateTime(formData.get('event-start-time')),
      dateTo: parseDateTime(formData.get('event-end-time')),
      basePrice: Number(formData.get('event-price')),
      offers: state.offers,
      isFavorite: false,
    };

    return this.#handlePointChange(UserAction.ADD, point).then(() =>
      this.#closeNewPointForm(),
    );
  };

  #closeNewPointForm = () => {
    if (!this.#newPointView) {
      return;
    }

    remove(this.#newPointView);
    this.#newPointView = null;
    this.#newEventButton.disabled = false;
    document.removeEventListener('keydown', this.#handleEscKeydown);
    this.#renderPoints();
  };

  #handleEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      this.#closeNewPointForm();
    }
  };
}
