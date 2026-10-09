import { createElement } from '../render.js';

export default class RoutePointView {
  getTemplate() {
    return /* HTML */ `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18"> MAR 18 </time>
        <div class="event__type">
          <img
            alt="Event type icon"
            class="event__type-icon"
            height="42"
            src="img/icons/taxi.png"
            width="42"
          />
        </div>
        <h3 class="event__title">Taxi Amsterdam</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">
              10:30
            </time>
            —
            <time class="event__end-time" datetime="2019-03-18T11:00">
              11:00
            </time>
          </p>
          <p class="event__duration">30M</p>
        </div>
        <p class="event__price">
          €
          <span class="event__price-value"> 20 </span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          <li class="event__offer">
            <span class="event__offer-title"> Order Uber </span>
            +€
            <span class="event__offer-price"> 20 </span>
          </li>
        </ul>
        <button
          class="event__favorite-btn event__favorite-btn--active"
          type="button"
        >
          <span class="visually-hidden"> Add to favorite </span>
          <svg
            class="event__favorite-icon"
            height="28"
            viewbox="0 0 28 28"
            width="28"
          >
            <path
              d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"
            ></path>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden"> Open event </span>
        </button>
      </div>
    </li> `;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }
}
