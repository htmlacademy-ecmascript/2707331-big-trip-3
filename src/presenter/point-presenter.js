import { render, replace } from '../framework/render.js';
import FormEditView from '../view/form-edit-view.js';
import PointView from '../view/point-view.js';

export default class PointPresenter {
  #point;
  #destinations;
  #offers;
  #container;
  #pointView = null;
  #formEditView = null;

  constructor({ point, destinations, offers, container }) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#container = container;
  }

  init() {
    this.#pointView = new PointView(
      this.#point,
      this.#destinations,
      this.#offers,
      this.#handleRollupClick,
    );

    this.#formEditView = new FormEditView(
      this.#point,
      this.#destinations,
      this.#offers,
      this.#handleFormSubmit,
      this.#handleEditFormRollupClick,
    );

    render(this.#pointView, this.#container);
  }

  #handleRollupClick = () => {
    replace(this.#formEditView, this.#pointView);
    document.addEventListener('keydown', this.#handleEscKeydown);
  };

  #handleEditFormRollupClick = () => {
    replace(this.#pointView, this.#formEditView);
    document.removeEventListener('keydown', this.#handleEscKeydown);
  };

  #handleFormSubmit = (evt) => {
    evt.preventDefault();
    replace(this.#pointView, this.#formEditView);
    document.removeEventListener('keydown', this.#handleEscKeydown);
  };

  #handleEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      replace(this.#pointView, this.#formEditView);
      document.removeEventListener('keydown', this.#handleEscKeydown);
    }
  };
}
