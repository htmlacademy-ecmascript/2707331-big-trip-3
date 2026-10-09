import { RenderPosition, render } from './render.js';
import FilterView from './view/filter.js';
import SortView from './view/sort.js';
import FormNewView from './view/form-new.js';
import FormEditView from './view/form-edit.js';
import RoutePointView from './view/route-point.js';
import EventsListView from './view/events-list.js';

const tripControlsContainer = document.querySelector('.trip-controls__filters');
render(new FilterView(), tripControlsContainer);

const tripEventsContainer = document.querySelector('.trip-events');
render(new SortView(), tripEventsContainer, RenderPosition.AFTERBEGIN);

const eventsList = new EventsListView();
render(eventsList, tripEventsContainer);

render(new FormEditView(), eventsList.getElement());
render(new FormNewView(), eventsList.getElement());

for (let i = 0; i < 3; i++) {
  render(new RoutePointView(), eventsList.getElement());
}
