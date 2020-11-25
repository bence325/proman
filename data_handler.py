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
    for status in statuses:
        if status['title'] == new_card_status:
            new_status = status['id']
    return persistence.change_card_status(card_id, new_status)



def add_new_column(columnData):
    return persistence.add_new_column(columnData)


def login(credentials):
    username = credentials['username']
    password = credentials['password']
    usernames = persistence.get_all_usernames()
    if username in usernames:
        hashed_password = persistence.get_password_hash(username)
        return werkzeug.security.check_password_hash(hashed_password, password)
    else:
        return False
