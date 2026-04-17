import { sql } from '../config/db.js';
export const findByEmail = async (email) => {
    const result = await sql.query('SELECT * FROM users WHERE email = $1', [email]);
    return result[0];
};
