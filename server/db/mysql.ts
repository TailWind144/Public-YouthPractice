import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: "your-host",
  user: "user",
  password: "password",
  database: "database",
})

export default async (): Promise<mysql.PoolConnection> => {
  const con = await pool.getConnection()
  return con
}
