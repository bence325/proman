drop table boards;

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

alter table boards
    owner to kisstamas86;

create unique index boards_id_uindex
    on boards (id);


