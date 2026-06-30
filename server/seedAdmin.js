import bcrypt from 'bcryptjs'
import 'dotenv/config'
import { pool } from './db.js'

const adminName = process.env.ADMIN_NAME
const adminEmail = process.env.ADMIN_EMAIL
const adminPassword = process.env.ADMIN_PASSWORD

if (!adminName || !adminEmail || !adminPassword) {
  console.error('Please set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in server/.env.')
  process.exit(1)
}

try {
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  const result = await pool.query(
    `INSERT INTO admin_users (name, email, password_hash, role)
     VALUES ($1, LOWER($2), $3, 'admin')
     ON CONFLICT (email)
     DO UPDATE SET
       name = EXCLUDED.name,
       password_hash = EXCLUDED.password_hash,
       updated_at = NOW()
     RETURNING id, name, email, role`,
    [adminName, adminEmail, passwordHash],
  )

  console.log(`Admin user ready: ${result.rows[0].email}`)
} catch (error) {
  console.error('Unable to seed admin user:', error)
  process.exitCode = 1
} finally {
  await pool.end()
}
