const adaptToClient = (point) => {
  const adaptedPoint = {
    ...point,
    dateFrom: point.date_from,
    dateTo: point.date_to,
    basePrice: point.base_price,
    isFavorite: point.is_favorite,
  };

  delete adaptedPoint.date_from;
  delete adaptedPoint.date_to;
  delete adaptedPoint.base_price;
  delete adaptedPoint.is_favorite;

  return adaptedPoint;
};

export { adaptToClient };
