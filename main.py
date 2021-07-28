from flask import Flask, render_template, url_for, request
from util import json_response

import data_handler

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    return data_handler.get_public_boards()


@app.route('/get-private-boards', methods=['POST'])
@json_response
def get_private_boards():
    user = request.get_json()
    return data_handler.get_private_boards(user)


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
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


@app.route('/new-private-board', methods=['POST'])
@json_response
def add_private_board():
    new_board = request.get_json()
    return data_handler.add_private_board(new_board['title'], new_board['username'])


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
    return data_handler.add_new_card(board_id, card_data['title'], card_data['status'])


@app.route("/change-column-title", methods=['POST', 'GET'])
@json_response
def change_column_title():
    data = request.get_json()
    return data_handler.change_column_title(data)


@app.route("/remove-card/<int:card_id>", methods=['DELETE'])
@json_response
def remove_card(card_id):
    return data_handler.remove_card(card_id)


@app.route("/remove-board/<int:board_id>", methods=['DELETE'])
@json_response
def remove_board(board_id):
    return data_handler.remove_board(board_id)


@app.route('/remove-column/<int:board_id>/<column_name>', methods=['DELETE'])
@json_response
def remove_column(board_id, column_name):
    return data_handler.remove_column(board_id, column_name)


def main():
    app.run(debug=True)
    app.run(host='0.0.0.0')

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
