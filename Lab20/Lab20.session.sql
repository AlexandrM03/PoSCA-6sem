create table user_roles (
	user_role_id int identity,
	user_role varchar(30) not null,
	constraint user_roles_pk primary key (user_role_id)
);
insert into user_roles
values ('manager'),
	('customer');
create table users (
	username varchar(30),
	password_hash varchar(300) not null,
	first_name varchar(30) not null,
	last_name varchar(30) not null,
	telephone varchar(30) not null,
	user_role_id int,
	constraint users_pk primary key (username),
	constraint users_user_role_id_fk foreign key (user_role_id) references user_roles
);
create table drivers (
	id int identity,
	first_name varchar(30) not null,
	last_name varchar(30) not null,
	telephone varchar(30) not null,
	constraint drivers_pk primary key (id)
);
create table orders (
	id int identity,
	customer_username varchar(30) not null,
	driver_id int,
	start_address varchar(30) not null,
	end_address varchar(30) not null,
	constraint orders_pk primary key (id),
	constraint orders_customer_username_fk foreign key (customer_username) references users,
	constraint orders_driver_id_fk foreign key (driver_id) references drivers,
);
create table order_items (
	id int identity,
	order_id int not null,
	name varchar(30) not null,
	weight int not null,
	volume int not null,
	constraint order_items_pk primary key (id),
	constraint order_items_order_id_fk foreign key (order_id) references orders
);