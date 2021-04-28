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
