import { Model } from 'sequelize';

interface PulpitAttributes {
	pulpit: number;
	pulpit_name: string;
	faculty: number;
}

export interface Pulpit extends Model<PulpitAttributes>, PulpitAttributes {
}