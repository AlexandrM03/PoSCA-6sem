import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

export const db = new Sequelize({
	dialect: 'mssql',
	host: 'localhost',
	port: 1433,
	database: DB_NAME,
	username: DB_USER,
	password: DB_PASSPORT,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});