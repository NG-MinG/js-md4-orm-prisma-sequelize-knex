module.exports = {
  create(body) {
    const data = {};
    const errors = [];
    if (typeof body.name !== 'string' || !body.name.trim()) errors.push({ field: 'name', message: 'name là bắt buộc' });
    else data.name = body.name.trim();

    if (typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.push({ field: 'email', message: 'email không đúng định dạng' });
    } else data.email = body.email.toLowerCase();

    if (typeof body.password !== 'string' || body.password.length < 6) {
      errors.push({ field: 'password', message: 'password tối thiểu 6 ký tự' });
    } else data.password = body.password;

    return { data, errors };
  },
};
