import { render, replace } from '../framework/render.js';
import FormEditView from '../view/form-edit-view.js';
import PointView from '../view/point-view.js';

export default class PointPresenter {
  #point;
  #destinations;
  #offers;
  #container;
  #onDataChange;
  #pointView = null;
  #formEditView = null;
  #onEditStart;
  #isEditing = false;

  constructor({
    point,
    destinations,
    offers,
    container,
    onDataChange,
    onEditStart,
  }) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#container = container;
    this.#onDataChange = onDataChange;
    this.#onEditStart = onEditStart;
  }

  init() {
    this.#pointView = this.#createPointView();

    this.#formEditView = new FormEditView(
      this.#point,
      this.#destinations,
      this.#offers,
      this.#handleFormSubmit,
      this.#handleEditFormRollupClick,
    );

    render(this.#pointView, this.#container);
  }

  #createPointView() {
    return new PointView(
      this.#point,
      this.#destinations,
      this.#offers,
      this.#handleRollupClick,
      this.#handleFavoriteClick,
    );
  }

  update(point) {
    this.#point = point;

    const previousPointView = this.#pointView;
    this.#pointView = this.#createPointView();

    replace(this.#pointView, previousPointView);
  }

  resetView() {
    if (!this.#isEditing) {
      return;
    }

    replace(this.#pointView, this.#formEditView);
    document.removeEventListener('keydown', this.#handleEscKeydown);
    this.#isEditing = false;
  }

  #handleFavoriteClick = (updatedPoint) => {
    this.#onDataChange(updatedPoint);
  };

  #handleRollupClick = () => {
    this.#onEditStart();

    replace(this.#formEditView, this.#pointView);
    this.#isEditing = true;

    document.addEventListener('keydown', this.#handleEscKeydown);
  };

  #handleEditFormRollupClick = () => {
    replace(this.#pointView, this.#formEditView);
    document.removeEventListener('keydown', this.#handleEscKeydown);
    this.#isEditing = false;
  };

  #handleFormSubmit = (evt) => {
    evt.preventDefault();
    replace(this.#pointView, this.#formEditView);
    document.removeEventListener('keydown', this.#handleEscKeydown);
    this.#isEditing = false;
  };

  #handleEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      replace(this.#pointView, this.#formEditView);
      document.removeEventListener('keydown', this.#handleEscKeydown);
      this.#isEditing = false;
    }
  };
}
