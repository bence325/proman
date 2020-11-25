import persistence


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


def change_board_title(board_id, new_title):
    return persistence.change_board_title(board_id, new_title)


def add_new_column(columnData):
    return persistence.add_new_column(columnData)