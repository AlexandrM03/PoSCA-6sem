import { Sequelize, DataTypes, Model } from 'sequelize';

interface UserAttributes {
	id?: number;
	username: string;
	password: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
	public id!: number;
	public username!: string;
	public password!: string;

	public static initialize(sequelize: Sequelize): void {
		this.init(
			{
				id: {
					type: DataTypes.INTEGER,
					autoIncrement: true,
					primaryKey: true
				},
				username: {
					type: DataTypes.STRING,
					allowNull: false
				},
				password: {
					type: DataTypes.STRING,
					allowNull: false
				}
			},
			{
				tableName: 'User',
				timestamps: false,
				sequelize
			}
		);
	}
}

export default User;