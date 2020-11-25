import csv
import database_connection
from psycopg2.extras import RealDictCursor
from psycopg2 import sql


_cache = {}  # We store cached data in this dict to avoid multiple file readings


def _read_csv(file_name):
    """
    Reads content of a .csv file
    :param file_name: relative path to data file
    :return: OrderedDict
    """
    with open(file_name) as boards:
        rows = csv.DictReader(boards, delimiter=',', quotechar='"')
        formatted_data = []
        for row in rows:
            formatted_data.append(dict(row))
        return formatted_data


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
def add_new_user(cursor: RealDictCursor, username, password_hash):
    query = """
    INSERT INTO users (username, password)
    VALUES (%(username)s, %(password_hash)s)
    """
    params = {'username': username, 'password_hash': password_hash}
    cursor.execute(query, params)
    return f"Successful registration as {username}"

