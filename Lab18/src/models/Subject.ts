import { Model } from 'sequelize';

interface SubjectAttributes {
	subject: number;
	subject_name: string;
	pulpit: number;
}

export interface Subject extends Model<SubjectAttributes>, SubjectAttributes {
}