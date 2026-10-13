import { createElement } from '../render.js';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
  })
    .format(new Date(date))
    .toUpperCase();

const formatTime = (date) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(date));

const formatDuration = (dateFrom, dateTo) => {
  const duration = new Date(dateTo) - new Date(dateFrom);
  const minutes = Math.floor(duration / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const remainingMinutes = minutes % 60;

  if (days > 0) {
    return `${days}D ${hours}H ${remainingMinutes}M`;
  }

  if (hours > 0) {
    return `${hours}H ${remainingMinutes}M`;
  }

  return `${remainingMinutes}M`;
};

export default class RoutePointView {
  constructor(point, destinations, offers) {
    this.point = point;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate() {
    const { type, destination, dateFrom, dateTo, basePrice, isFavorite } =
      this.point;

    const destinationData = this.destinations.find(
      (item) => item.id === destination,
    );

    const selectedOffers = this.offers.filter((offer) =>
      this.point.offers.includes(offer.id),
    );

    const eventType = type[0].toUpperCase() + type.slice(1);

    const offersTemplate = selectedOffers
      .map(
        (offer) => `
          <li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            +€
            <span class="event__offer-price">${offer.price}</span>
          </li>
        `,
      )
      .join('');

    return /* HTML */ `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">
          ${formatDate(dateFrom)}
        </time>
        <div class="event__type">
          <img
            alt="Event type icon"
            class="event__type-icon"
            height="42"
            src="img/icons/${type}.png"
            width="42"
          />
        </div>
        <h3 class="event__title">${eventType} ${destinationData.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">
              ${formatTime(dateFrom)}
            </time>
            —
            <time class="event__end-time" datetime="${dateTo}">
              ${formatTime(dateTo)}
            </time>
          </p>
          <p class="event__duration">${formatDuration(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          €
          <span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersTemplate}
        </ul>
        <button
          class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}"
          type="button"
        >
          <span class="visually-hidden">Add to favorite</span>
          <svg
            class="event__favorite-icon"
            height="28"
            viewBox="0 0 28 28"
            width="28"
          >
            <path
              d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"
            ></path>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }
}
