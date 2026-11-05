// V – "khuôn" chung cho mọi response JSON. Đây là nơi DUY NHẤT gọi res.json().
//   Thành công: { success: true, data, meta? }
//   Thất bại:   { success: false, message, errors? }

function render(res, status, body) {
  return res.status(status).json(body);
}

function success(res, data, { status = 200, meta } = {}) {
  return render(res, status, meta ? { success: true, data, meta } : { success: true, data });
}

function failure(res, status, message, errors) {
  return render(res, status, errors?.length ? { success: false, message, errors } : { success: false, message });
}

function noContent(res) {
  return res.status(204).end();
}

function paginationMeta({ page, limit, total }) {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}

module.exports = { success, failure, noContent, paginationMeta };
