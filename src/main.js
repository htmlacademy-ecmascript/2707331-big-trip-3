import { render, remove } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import EventsListView from './view/events-list-view.js';
import RoutePresenter from './presenter/route-presenter.js';
import Model from './model/model.js';
import Api from './api.js';
import { adaptToClient as adaptPointToClient } from './adapters/point.js';
import { adaptToClient as adaptOffersToClient } from './adapters/offer.js';
import ListLoadingView from './view/list-loading-view.js';
import ListFailedView from './view/list-failed-view.js';

const AUTHORIZATION = `Basic ${Math.random().toString(36).substring(2)}`;
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const api = new Api(END_POINT, AUTHORIZATION);

const model = new Model(api);
const filterModel = new FilterModel();

const tripControlsContainer = document.querySelector('.trip-controls__filters');
const filterPresenter = new FilterPresenter({
  container: tripControlsContainer,
  model: filterModel,
  pointsModel: model,
});
filterPresenter.init();

const tripEventsContainer = document.querySelector('.trip-events');
const tripInfoContainer = document.querySelector('.trip-main__trip-info');

const loadingView = new ListLoadingView();
render(loadingView, tripEventsContainer);

Promise.all([
  api.getPoints(),
  api.getDestinations(),
  api.getOffers(),
])
  .then(([points, destinations, offers]) => {
    model.setPoints(points.map(adaptPointToClient));
    model.setDestinations(destinations);
    model.setOffers(adaptOffersToClient(offers));

    remove(loadingView);

    const eventsList = new EventsListView();
    render(eventsList, tripEventsContainer);

    const routePresenter = new RoutePresenter({
      container: eventsList.element,
      tripInfoContainer,
      model,
      filterModel,
      destinations: model.getDestinations(),
      offers: model.getOffers(),
      newEventButton: document.querySelector('.trip-main__event-add-btn'),
    });

    routePresenter.init();
  })
  .catch(() => {
    remove(loadingView);

    const failedView = new ListFailedView();
    render(failedView, tripEventsContainer);
  });
