export const validatePaginationParams = (
  query,
  defaultLimit = 10,
  minLimit = 2,
  maxLimit = 100
) => {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  // Si no se envía, se usa el default
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit)) limit = defaultLimit;

  // Validaciones
  if (limit < minLimit) {
    throw new Error(
      `El límite debe ser un número mayor o igual a ${minLimit}.`
    );
  }

  if (limit > maxLimit) limit = maxLimit;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
