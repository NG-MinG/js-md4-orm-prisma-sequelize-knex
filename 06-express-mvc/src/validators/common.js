const isPositiveInt = (v) => String(v ?? '').trim() !== '' && Number.isInteger(Number(v)) && Number(v) > 0;
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

// /:id
const idParam = ({ id }) =>
  isPositiveInt(id)
    ? { data: { id: Number(id) }, errors: [] }
    : { data: {}, errors: [{ field: 'id', message: 'id phải là số nguyên dương' }] };

// ?page=&limit=
function pagination(query, errors) {
  const page = query.page ?? '1';
  const limit = query.limit ?? '10';
  if (!isPositiveInt(page)) errors.push({ field: 'page', message: 'page phải là số nguyên dương' });
  if (!isPositiveInt(limit) || Number(limit) > 100) errors.push({ field: 'limit', message: 'limit từ 1 đến 100' });
  return { page: Number(page), limit: Number(limit) };
}

module.exports = { isPositiveInt, isDate, idParam, pagination };
