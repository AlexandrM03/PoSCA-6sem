import { Model } from 'sequelize';

interface FacultyAttributes {
	faculty: number;
	faculty_name: string;
}

export interface Faculty extends Model<FacultyAttributes>, FacultyAttributes {
}