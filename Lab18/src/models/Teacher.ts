import { Model } from 'sequelize';

interface TeacherAttributes {
	teacher: number;
	teacher_name: string;
	pulpit: number;
}

export interface Teacher extends Model<TeacherAttributes>, TeacherAttributes {
}