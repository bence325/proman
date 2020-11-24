import database_connection
from psycopg2.extras import RealDictCursor
from psycopg2 import sql


_cache = {}  # We store cached data in this dict to avoid multiple file readings


@database_connection.connection_handler
def _get_data_from_tables(cursor: RealDictCursor, table):
    cursor.execute(
        sql.SQL("SELECT * FROM {table}").
            format(table=sql.Identifier(table))
    )
    return cursor.fetchall()


@database_connection.connection_handler
def write_data_to_boards(cursor: RealDictCursor, title):
    query = """
        INSERT INTO boards (title)
        VALUES (%(title)s)
        RETURNING id, title"""
    params = {'title': title}
    cursor.execute(query, params)
    return cursor.fetchone()


@database_connection.connection_handler
def change_board_title(cursor: RealDictCursor, board_id, new_title):
    print(board_id, new_title)
    cursor.execute(
        sql.SQL("UPDATE boards SET title = {new_title} WHERE id = {id}").
            format(id=sql.Literal(board_id), new_title=sql.Literal(new_title))
    )
    return "ok"


def _get_data(table, force):
    """
    Reads defined type of data from file or cache
    :param data_type: key where the data is stored in cache
    :param file: relative path to data file
    :param force: if set to True, cache will be ignored
    :return: OrderedDict
    """
    if force or table not in _cache:
        _cache[table] = _get_data_from_tables(table)
    return _cache[table]


def clear_cache():
    for k in list(_cache.keys()):
        _cache.pop(k)


def get_statuses(force=False):
    return _get_data('statuses', force)


def get_boards(force=False):
    return _get_data('boards', force)


def get_cards(force=False):
    return _get_data('cards', force)