import prisma from '../client/prisma.js';
import { users } from '@prisma/client';
import bcrypt from 'bcrypt';

export const register = async (user: users) => {
	try {
		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(user.password_hash, saltRounds);
		const customerRole = await prisma.user_roles.findFirst({
			where: {
				user_role: 'customer'
			}
		});

		if (!customerRole) {
			throw new Error("Could not find 'customer' role in the database");
		}

		const createdUser = await prisma.users.create({
			data: {
				username: user.username,
				password_hash: passwordHash,
				first_name: user.first_name,
				last_name: user.last_name,
				telephone: user.telephone,
				user_role_id: customerRole.user_role_id
			},
		});

		return createdUser;
	} catch (err: any) {
		throw new Error(`Error creating user: ${err.message}`);
	}
}

export const getUsers = async () => {
	const users = await prisma.users.findMany();

	return users;
}

export const getUser = async (username: string) => {
	try {
		const user = await prisma.users.findFirst({
			where: {
				username: username
			}
		});

		return user;
	} catch (err: any) {
		throw new Error(`Error getting user: ${err.message}`);
	}
}

export const updateUserTelephone = async (data: users) => {
	try {
		const user = await prisma.users.update({
			where: {
				username: data.username
			},
			data: {
				telephone: data.telephone
			}
		});

		return user;
	} catch (err: any) {
		throw new Error(`Error updating user telephone: ${err.message}`);
	}
}

export const deleteUser = async (username: string) => {
	try {
		const user = await prisma.users.delete({
			where: {
				username: username
			}
		});

		return user;
	} catch (err: any) {
		throw new Error(`Error deleting user: ${err.message}`);
	}
}