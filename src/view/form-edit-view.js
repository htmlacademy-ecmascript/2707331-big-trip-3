import AbstractView from '../framework/view/abstract-view.js';
import { POINT_TYPES } from '../mock/point.js';

const formatDateTime = (date) => {
  if (!date) {
    return '';
  }

  const value = new Date(date);
  const pad = (number) => String(number).padStart(2, '0');

  return `${pad(value.getDate())}/${pad(value.getMonth() + 1)}/${String(
    value.getFullYear(),
  ).slice(-2)} ${pad(value.getHours())}:${pad(value.getMinutes())}`;
};

export default class FormEditView extends AbstractView {
  #point;
  #destinations;
  #offers;

  constructor(point = null, destinations = [], offers = []) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    const point = this.#point ?? {
      type: 'flight',
      destination: '',
      dateFrom: '',
      dateTo: '',
      basePrice: '',
      offers: [],
      isFavorite: false,
    };

    const destination = this.#destinations.find(
      (item) => item.id === point.destination,
    );

    const availableOffers = this.#offers.filter(
      (offer) => offer.type === point.type,
    );

    const typeOptions = POINT_TYPES.map(
      (type) => `
        <div class="event__type-item">
          <input
            class="event__type-input visually-hidden"
            id="event-type-${type}-1"
            name="event-type"
            type="radio"
            value="${type}"
            ${point.type === type ? 'checked' : ''}
          />
          <label
            class="event__type-label event__type-label--${type}"
            for="event-type-${type}-1"
          >
            ${type[0].toUpperCase() + type.slice(1)}
          </label>
        </div>
      `,
    ).join('');

    const destinationOptions = this.#destinations
      .map((item) => `<option value="${item.name}"></option>`)
      .join('');

    const offersTemplate = availableOffers
      .map(
        (offer) => `
        <div class="event__offer-selector">
          <input
            class="event__offer-checkbox visually-hidden"
            id="event-offer-${offer.id}"
            name="event-offer-${offer.id}"
            type="checkbox"
            ${point.offers.includes(offer.id) ? 'checked' : ''}
          />
          <label
            class="event__offer-label"
            for="event-offer-${offer.id}"
          >
            <span class="event__offer-title">${offer.title}</span>
            +€
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
      `,
      )
      .join('');

    return /* HTML */ `<li class="trip-events__item">
      <form action="#" class="event event--edit" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label
              class="event__type event__type-btn"
              for="event-type-toggle-1"
            >
              <span class="visually-hidden">Choose event type</span>
              <img
                alt="Event type icon"
                class="event__type-icon"
                height="17"
                src="img/icons/${point.type}.png"
                width="17"
              />
            </label>
            <input
              class="event__type-toggle visually-hidden"
              id="event-type-toggle-1"
              type="checkbox"
            />
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${typeOptions}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label
              class="event__label event__type-output"
              for="event-destination-1"
            >
              ${point.type[0].toUpperCase() + point.type.slice(1)}
            </label>
            <input
              class="event__input event__input--destination"
              id="event-destination-1"
              list="destination-list-1"
              name="event-destination"
              type="text"
              value="${destination?.name ?? ''}"
            />
            <datalist id="destination-list-1">${destinationOptions}</datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input
              class="event__input event__input--time"
              id="event-start-time-1"
              name="event-start-time"
              type="text"
              value="${formatDateTime(point.dateFrom)}"
            />
            —
            <label class="visually-hidden" for="event-end-time-1"> To </label>
            <input
              class="event__input event__input--time"
              id="event-end-time-1"
              name="event-end-time"
              type="text"
              value="${formatDateTime(point.dateTo)}"
            />
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input
              class="event__input event__input--price"
              id="event-price-1"
              name="event-price"
              type="text"
              value="${point.basePrice}"
            />
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">
            Save
          </button>
          <button class="event__reset-btn" type="reset">
            ${this.#point ? 'Delete' : 'Cancel'}
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Close event</span>
          </button>
        </header>

        <section class="event__details">
          <section class="event__section event__section--offers">
            <h3 class="event__section-title event__section-title--offers">
              Offers
            </h3>
            <div class="event__available-offers">${offersTemplate}</div>
          </section>

          <section class="event__section event__section--destination">
            <h3 class="event__section-title event__section-title--destination">
              Destination
            </h3>
            <p class="event__destination-description">
              ${destination?.description ?? ''}
            </p>
          </section>
        </section>
      </form>
    </li>`;
  }
}
