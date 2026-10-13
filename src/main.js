import { RenderPosition, render } from './render.js';
import FilterView from './view/filter.js';
import SortView from './view/sort.js';
import FormNewView from './view/form-new.js';
import FormEditView from './view/form-edit.js';
import RoutePointView from './view/route-point.js';
import EventsListView from './view/events-list.js';
import Model from './model/model.js';

const model = new Model();

const points = model.getPoints();
const destinations = model.getDestinations();
const offers = model.getOffers();

const tripControlsContainer = document.querySelector('.trip-controls__filters');
render(new FilterView(), tripControlsContainer);

const tripEventsContainer = document.querySelector('.trip-events');
render(new SortView(), tripEventsContainer, RenderPosition.AFTERBEGIN);

const eventsList = new EventsListView();
render(eventsList, tripEventsContainer);

render(new FormNewView(), eventsList.getElement());

render(
  new FormEditView(points[0], destinations, offers),
  eventsList.getElement(),
);

points.forEach((point) => {
  render(
    new RoutePointView(point, destinations, offers),
    eventsList.getElement(),
  );
});
