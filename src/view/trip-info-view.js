import AbstractView from '../framework/view/abstract-view.js';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date)).toUpperCase();

const getRoute = (points, destinations) => {
  const destinationNames = points
    .map((point) =>
      destinations.find(
        (destination) => destination.id === point.destination,
      )?.name,
    )
    .filter(Boolean);

  if (destinationNames.length > 3) {
    return `${destinationNames[0]} — ... — ${destinationNames[destinationNames.length - 1]}`;
  }

  return destinationNames.join(' — ');
};

const getTotalPrice = (points, offers) =>
  points.reduce((total, point) => {
    const offersPrice = offers
      .filter(
        (offer) =>
          offer.type === point.type &&
          point.offers.some((id) => String(id) === String(offer.id)),
      )
      .reduce((sum, offer) => sum + offer.price, 0);

    return total + point.basePrice + offersPrice;
  }, 0);

export default class TripInfoView extends AbstractView {
  #points;
  #destinations;
  #offers;

  constructor(points, destinations, offers) {
    super();
    this.#points = [...points].sort(
      (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom),
    );
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    const route = getRoute(this.#points, this.#destinations);
    const totalPrice = getTotalPrice(this.#points, this.#offers);

    const dates = this.#points.length
      ? `${formatDate(this.#points[0].dateFrom)} — ${formatDate(this.#points[this.#points.length - 1].dateTo)}`
      : '';

    return `
      <section class="trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${route || 'Your trip'}</h1>
          <p class="trip-info__dates">${dates}</p>
        </div>
        <p class="trip-info__cost">Total: € ${totalPrice.toLocaleString('en-GB')}</p>
      </section>
    `;
  }
}
