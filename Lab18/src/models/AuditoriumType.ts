import { Model } from 'sequelize';

interface AuditoriumTypeAttributes {
	auditorium_type: number;
	auditorium_typename: string;
}

export interface AuditoriumTypeModel extends Model<AuditoriumTypeAttributes>, AuditoriumTypeAttributes {
}

