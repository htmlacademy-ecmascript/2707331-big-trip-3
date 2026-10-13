import { createElement } from '../render.js';

export default class EventsListView {
  getTemplate() {
    return /* HTML */ ` <ul class="trip-events__list"></ul> `;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
