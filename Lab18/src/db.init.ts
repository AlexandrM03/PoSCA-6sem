import { DataTypes, Op, Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
import { AuditoriumTypeModel } from './models/AuditoriumType';

dotenv.config();

const sequelize = new Sequelize({
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	dialect: 'mssql',
	port: +process.env.DB_PORT! as number,
	pool: {
		max: 10,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	define: {
		hooks: {
			beforeBulkDestroy: (item: any) => {
				console.log('Bulk destroy');
			}
		}
	}
});

const Faculty = sequelize.define('Faculty', {
	faculty: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	faculty_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
}, {
	hooks: {
		beforeCreate: (faculty: any) => {
			console.log('beforeCreate hook triggered');
		},
		afterCreate: (faculty: any) => {
			console.log('afterCreate hook triggered');
		}
	},
	timestamps: false
});

const Pulpit = sequelize.define('Pulpit', {
	pulpit: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	pulpit_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	faculty: {
		type: DataTypes.STRING,
		allowNull: false,
		references: {
			model: Faculty,
			key: 'faculty',
		},
	},
}, {
	timestamps: false
});

Faculty.hasMany(Pulpit, {
	foreignKey: 'faculty',
	onDelete: 'CASCADE'
});

Pulpit.belongsTo(Faculty, {
	foreignKey: 'faculty',
	onDelete: 'CASCADE'
});

const Teacher = sequelize.define('Teacher', {
	teacher: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	teacher_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	pulpit: {
		type: DataTypes.STRING,
		allowNull: false,
		references: {
			model: Pulpit,
			key: 'pulpit',
		},
	},
}, {
	timestamps: false
});

Pulpit.hasMany(Teacher, {
	foreignKey: 'pulpit',
	onDelete: 'CASCADE'
});

Teacher.belongsTo(Pulpit, {
	foreignKey: 'pulpit',
	onDelete: 'CASCADE'
});

const Subject = sequelize.define('Subject', {
	subject: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	subject_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	pulpit: {
		type: DataTypes.STRING,
		allowNull: false,
		references: {
			model: Pulpit,
			key: 'pulpit',
		},
	}
}, {
	timestamps: false
});

Pulpit.hasMany(Subject, {
	foreignKey: 'pulpit',
	onDelete: 'CASCADE'
});

Subject.belongsTo(Pulpit, {
	foreignKey: 'pulpit',
	onDelete: 'CASCADE'
});

const AuditoriumType = sequelize.define<AuditoriumTypeModel>('Auditorium_type', {
	auditorium_type: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	auditorium_typename: {
		type: DataTypes.STRING,
		allowNull: false,
	},
}, {
	timestamps: false
});

const Auditorium = sequelize.define('Auditorium', {
	auditorium: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	auditorium_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	auditorium_capacity: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	auditorium_type: {
		type: DataTypes.STRING,
		allowNull: false,
		references: {
			model: AuditoriumType,
			key: 'auditorium_type',
		},
	},
}, {
	timestamps: false,
	scopes: {
		smallAuds: {
			where: {
				auditorium_capacity: {
					[Op.between]: [10, 60]
				}
			}
		}
	}
});

AuditoriumType.hasMany(Auditorium, {
	foreignKey: 'auditorium_type',
	onDelete: 'CASCADE'
});

Auditorium.belongsTo(AuditoriumType, {
	foreignKey: 'auditorium_type',
	onDelete: 'CASCADE'
});

export { sequelize, Faculty, Pulpit, Teacher, Subject, Auditorium, AuditoriumType };