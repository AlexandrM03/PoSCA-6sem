import usersJson from '../data/users.json' assert { type: 'json' };
import { User } from '../models/user.model.js';

const users: User[] = usersJson;

export const checkUser = (login: string, password: string): boolean => {
	return users.some(user => user.login === login && user.password === password);
}

export const getUser = (login: string): User | undefined => {
	return users.find(user => user.login === login);
}