import csv
import database_connection
from psycopg2.extras import RealDictCursor
from psycopg2 import sql

STATUSES_FILE = './data/statuses.csv'
BOARDS_FILE = './data/boards.csv'
CARDS_FILE = './data/cards.csv'

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
    return cursor.fetchone()


def _get_data(data_type, file, force):
    """
    Reads defined type of data from file or cache
    :param data_type: key where the data is stored in cache
    :param file: relative path to data file
    :param force: if set to True, cache will be ignored
    :return: OrderedDict
    """
    if force or data_type not in _cache:
        _cache[data_type] = _read_csv(file)
    return _cache[data_type]


def clear_cache():
    for k in list(_cache.keys()):
        _cache.pop(k)


def get_statuses(force=False):
    return _get_data_from_tables('statuses', STATUSES_FILE, force)


def get_boards(force=False):
    return _get_data_from_tables('boards', BOARDS_FILE, force)


def get_cards(force=False):
    return _get_data_from_tables('cards', CARDS_FILE, force)

