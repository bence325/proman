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
    cursor.execute(
        sql.SQL("UPDATE boards SET title = {new_title} WHERE id = {id}").
            format(id=sql.Literal(board_id), new_title=sql.Literal(new_title))
    )
    return "ok"


@database_connection.connection_handler
def change_card_status(cursor: RealDictCursor, card_id, new_status_id):
    cursor.execute(
        sql.SQL("UPDATE cards SET status_id = {new_status_id} WHERE id = {card_id}").
            format(card_id=sql.Literal(card_id), new_status_id=sql.Literal(new_status_id))
    )


@database_connection.connection_handler
def get_statuses_to_board(cursor: RealDictCursor, board_id):
    cursor.execute(
        sql.SQL("SELECT statuses FROM boards WHERE id = {id}").
            format(id=sql.Literal(board_id))
    )
    status_ids = cursor.fetchone()
    result = []
    for item in status_ids['statuses']:
        cursor.execute(
            sql.SQL("SELECT title FROM statuses WHERE id = {id}").
                format(id=sql.Literal(item))
        )
        result.append(cursor.fetchone()['title'])
    return result


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


@database_connection.connection_handler
def add_new_column(cursor: RealDictCursor, columnData):
    cursor.execute(sql.SQL("SELECT * FROM statuses"))
    existing_statuses = cursor.fetchall()
    for status in existing_statuses:
        if columnData['title'] == status['title']:
            return "Existing column name!"
    else:
        cursor.execute(
            sql.SQL("INSERT INTO statuses (title) VALUES ({new_status})").
                format(new_status=sql.Literal(columnData['title']))
        )
        cursor.execute(
            sql.SQL("SELECT id FROM statuses WHERE title = {new_status}").
                format(new_status=sql.Literal(columnData['title']))
        )
        new_status_id = cursor.fetchone()
        query = """
                UPDATE boards SET statuses = array_append(statuses, %(new_status_id)s) WHERE id = %(board_id)s"""
        params = {'board_id': columnData['board_id'], 'new_status_id': new_status_id['id']}
        cursor.execute(query, params)
    return "ok"