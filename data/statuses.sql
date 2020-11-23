create table statuses
(
	id serial not null,
	title varchar
);

create unique index statuses_id_uindex
	on statuses (id);

alter table statuses
	add constraint statuses_pk
		primary key (id);

INSERT INTO statuses(id,title) VALUES (0,'new');
INSERT INTO statuses(id,title) VALUES (1,'in progress');
INSERT INTO statuses(id,title) VALUES (2,'testing');
INSERT INTO statuses(id,title) VALUES (3,'done');

