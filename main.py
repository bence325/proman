from flask import Flask, render_template, url_for, make_response, request, jsonify
from util import json_response

import data_handler

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


@app.route("/get-statuses-to-board/<int:board_id>")
@json_response
def get_statuses_to_board(board_id):
    return data_handler.get_statuses_to_board(board_id)


@app.route("/write-new-board", methods=['POST', 'GET'])
@json_response
def write_new_board():
    req = request.get_json()
    return data_handler.write_new_board(req['title'])


@app.route("/registration", methods=['POST'])
@json_response
def register_new_user():
    registration = request.get_json()
    return data_handler.register_new_user(registration)


@app.route("/login", methods=['POST'])
@json_response
def login():
    credentials = request.get_json()
    if data_handler.login(credentials):
        return True
    return False


@app.route("/logout", methods=['GET'])
@json_response
def logout():
    return True


@app.route("/change-board-title/<int:board_id>", methods=['POST', 'GET'])
@json_response
def change_board_title(board_id):
    req = request.get_json()
    return data_handler.change_board_title(board_id, req["title"])


@app.route("/change-card-status/<int:card_id>", methods=['POST', 'GET'])
@json_response
def change_card_status(card_id):
    req = request.get_json()
    return data_handler.change_card_status(card_id, req)


@app.route("/add-new-column", methods=['POST', 'GET'])
@json_response
def add_new_column():
    columnData = request.get_json()
    return data_handler.add_new_column(columnData)


@app.route("/add-new-card/<int:board_id>", methods=['POST', 'GET'])
@json_response
def add_new_card(board_id):
    card_data = request.get_json()
    print(card_data)
    return data_handler.add_new_card(board_id, card_data['title'])


@app.route("/change-column-title", methods=['POST', 'GET'])
@json_response
def change_column_title():
    data = request.get_json()
    return data_handler.change_column_title(data)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
