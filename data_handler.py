import persistence
import werkzeug.security


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == status_id), 'Unknown')


def get_boards():
    """
    Gather all boards
    :return:
    """
    return persistence.get_boards(force=True)


def get_cards_for_board(board_id):
    persistence.clear_cache()
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == board_id:
            card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards


def get_statuses_to_board(board_id):
    return persistence.get_statuses_to_board(board_id)


def write_new_board(title):
    return persistence.write_data_to_boards(title)


def register_new_user(data):
    username = data['username']
    password_hash = werkzeug.security.generate_password_hash(data['password'])
    return persistence.add_new_user(username, password_hash)

def change_board_title(board_id, new_title):
    return persistence.change_board_title(board_id, new_title)


def change_card_status(card_id, new_card_status):
    statuses = persistence.get_statuses()
    new_status = None
    for status in statuses:
        if status['title'] == new_card_status:
            new_status = status['id']
    return persistence.change_card_status(card_id, new_status)


def add_new_card(board_id, title):
    return persistence.add_new_card(board_id, title)


def add_new_column(columnData):
    existing_statuses = persistence.get_data_from_table("statuses", "title")
    for status in existing_statuses:
        if columnData['title'] == status['title']:
            status_id = persistence.get_status_id(columnData['title'])['id']
            board_statuses = persistence.get_specdata_from_table("boards", "statuses", columnData['board_id'])
            if status_id in board_statuses['statuses']:
                return "Existing column in this board!"
            else:
                persistence.update_boards_statuses(columnData['board_id'], status_id)
                return "ok"
    status_id = persistence.add_new_status(columnData['title'])['id']
    persistence.update_boards_statuses(columnData['board_id'], status_id)
    return "ok"


def change_column_title(data):
    existing_titles = persistence.get_data_from_table("statuses", "title")
    old_status_id = persistence.get_status_id(data['old_title'])['id']
    for title in existing_titles:
        if data['new_title'] == title['title']:
            new_status_id = persistence.get_status_id(data['new_title'])['id']
            board_statuses = persistence.get_specdata_from_table("boards", "statuses", data['board_id'])['statuses']
            if new_status_id in board_statuses:
                return "Existing column in this table!"
            else:
                board_statuses[board_statuses.index(old_status_id)] = new_status_id
                persistence.update_boards_statuses(data['board_id'], board_statuses, change=True)
                persistence.update_cards_statusid(data['board_id'], old_status_id, new_status_id)
                return "update"
    new_status_id = persistence.add_new_status(data['new_title'])['id']
    board_statuses = persistence.get_specdata_from_table("boards", "statuses", data['board_id'])['statuses']
    board_statuses[board_statuses.index(old_status_id)] = new_status_id
    persistence.update_boards_statuses(data['board_id'], board_statuses, change=True)
    persistence.update_cards_statusid(data['board_id'], old_status_id, new_status_id)
    return "update"


def login(credentials):
    username = credentials['username']
    password = credentials['password']
    usernames = persistence.get_all_usernames()
    if username in usernames:
        hashed_password = persistence.get_password_hash(username)
        return werkzeug.security.check_password_hash(hashed_password, password)
    else:
        return False
