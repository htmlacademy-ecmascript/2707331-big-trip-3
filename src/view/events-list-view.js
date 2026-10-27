import AbstractView from '../framework/view/abstract-view.js';

export default class EventsListView extends AbstractView {
  get template() {
    return /* HTML */ ` <ul class="trip-events__list"></ul> `;
  }
}
