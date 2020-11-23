create table boards
(
	id serial not null,
	title varchar not null
);

create unique index boards_id_uindex
	on boards (id);

alter table boards
	add constraint boards_pk
		primary key (id);

INSERT INTO boards(id,title) VALUES (1,'Board 1');
INSERT INTO boards(id,title) VALUES (2,'Board 2');
