import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 8080;
export const LINK_LEN = parseInt(process.env.LINK_LEN) || 6;
export const DB_FILE = process.env.DB_FILE || 'database/database.sqlite';
export const DB_SCHEMA = process.env.DB_SCHEMA || 'database/database.sql';
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';