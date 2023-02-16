import { Model } from 'sequelize';

interface AuditoriumAttributes {
	auditorium: number;
	auditorium_name: string;
	auditorium_capacity: number;
	auditorium_type: string;
}

export interface Auditorium extends Model<AuditoriumAttributes>, AuditoriumAttributes {
}