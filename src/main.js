import { render } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import EventsListView from './view/events-list-view.js';
import RoutePresenter from './presenter/route-presenter.js';
import Model from './model/model.js';
import Api from './api.js';

const AUTHORIZATION = `Basic ${Math.random().toString(36).substring(2)}`;
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const api = new Api(END_POINT, AUTHORIZATION);

void api;

const model = new Model();
const filterModel = new FilterModel();

const destinations = model.getDestinations();
const offers = model.getOffers();

const tripControlsContainer = document.querySelector('.trip-controls__filters');
const filterPresenter = new FilterPresenter({
  container: tripControlsContainer,
  model: filterModel,
  pointsModel: model,
});
filterPresenter.init();

const tripEventsContainer = document.querySelector('.trip-events');

const eventsList = new EventsListView();
render(eventsList, tripEventsContainer);

const routePresenter = new RoutePresenter({
  container: eventsList.element,
  model,
  filterModel,
  destinations,
  offers,
  newEventButton: document.querySelector('.trip-main__event-add-btn'),
});

routePresenter.init();
