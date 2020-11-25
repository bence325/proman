from flask import Flask, render_template, url_for, make_response, request, jsonify
from util import json_response

import data_handler

app = Flask(__name__)


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


@app.route("/get-statuses")
@json_response
def get_statuses():
    return data_handler.get_statuses()


@app.route("/write-new-board", methods=['POST', 'GET'])
@json_response
def write_new_board():
    req = request.get_json()
    return data_handler.write_new_board(req['title'])


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


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
