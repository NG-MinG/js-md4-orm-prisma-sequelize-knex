require('dotenv').config();

const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS || null,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  dialect: 'mysql',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  define: { underscored: true },
};

module.exports = {
  development: base,
  test: { ...base, logging: false },
  production: { ...base, logging: false },
};
