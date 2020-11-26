create table users
(
	id serial not null,
	username varchar not null,
	password varchar not null
);

create unique index users_id_uindex
	on users (id);

create unique index users_username_uindex
	on users (username);

alter table users
	add constraint users_pk
		primary key (id);