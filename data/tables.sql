drop table if exists cards;
create table cards
(
	id serial not null,
	board_id int not null,
	title varchar,
	status_id int,
	order_cards int
);

create unique index cards_id_uindex
	on cards (id);

alter table cards
	add constraint cards_pk
		primary key (id);

INSERT INTO cards(id,board_id,title,status_id,order_cards) VALUES (1,1,'new card 1',0,0);
INSERT INTO cards(id,board_id,title,status_id,order_cards) VALUES (2,1,'new card 2',0,1);
INSERT INTO cards(id,board_id,title,status_id,order_cards) VALUES (3,1,'in progress card',1,0);
INSERT INTO cards(id,board_id,title,status_id,order_cards) VALUES (4,1,'planning',2,0);
INSERT INTO cards(id,board_id,title,status_id,order_cards) VALUES (5,1,'done card 1',3,0);
INSERT INTO cards(id,board_id,title,status_id,order_cards) VALUES (6,1,'done card 1',3,1);
INSERT INTO cards(id,board_id,title,status_id,order_cards) VALUES (7,2,'new card 1',0,0);
INSERT INTO cards(id,board_id,title,status_id,order_cards) VALUES (8,2,'new card 2',0,1);
INSERT INTO cards(id,board_id,title,status_id,order_cards) VALUES (9,2,'in progress card',1,0);
INSERT INTO cards(id,board_id,title,status_id,order_cards) VALUES (10,2,'planning',2,0);
INSERT INTO cards(id,board_id,title,status_id,order_cards) VALUES (11,2,'done card 1',3,0);
INSERT INTO cards(id,board_id,title,status_id,order_cards) VALUES (12,2,'done card 1',3,1);

ALTER SEQUENCE cards_id_seq RESTART WITH 13;


drop table if exists statuses;
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

ALTER SEQUENCE statuses_id_seq RESTART WITH 4;

drop table if exists users;
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

drop table if exists boards;

create table boards
(
    id       serial  not null
        constraint boards_pk
            primary key,
    title    varchar not null,
    statuses integer[] default '{0,1,2,3}'::integer[],
    user_id  integer
        constraint boards_user_id_fkey
            references users
);

create unique index boards_id_uindex
    on boards (id);

ALTER SEQUENCE boards_id_seq RESTART WITH 2

