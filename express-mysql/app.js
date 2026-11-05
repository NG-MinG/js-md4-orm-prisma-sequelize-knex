import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config()

const conn = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

const app = express()

app.listen(3000, async () => {
  const username = 'Nguyễn Văn A'
  u.save()
  User.findAll() -> SELECT * FROM "users"
  const row = await conn.query("SELECT * FROM `users` WHERE name = ?", username)
  console.log(row[0])
  console.log("Server is running on port 3000")
})
