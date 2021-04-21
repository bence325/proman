// this object contains the functions which handle the data and its reading/writing

export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.

    _api_get: function (url, callback) {
        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },

    _api_post: function (url, data, callback) {
        fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
            })
        })
            .then(response => response.json())
            .then(json_response => callback(json_response))
            .catch((error) => {
                console.log("Fetch error: " + error);
            });
    },

    _api_delete: function (url, callback) {
        fetch(url, {
            method: 'DELETE'
        })
            .then(response => callback(response))
    },

    getBoards: function (callback) {
        this._api_get('/get-boards', (response) => {
            this._data['boards'] = response;
            callback(response);
        });
    },

    get_privateBoards: function (username, callback) {
        this._api_post('/get-private-boards', username, (response) => {
            this._data['boards'] = response;
            callback(response);
        })
    },

    clear_boards: function () {
        this._data = {};
    },

    getStatusesToBoard: function (boardId, callback) {
        this._api_get(`/get-statuses-to-board/${boardId}`, (response) => {
            this._data['statuses'] = response;
            callback(response);
        });
    },

    getCardsByBoardId: function (boardId, callback) {
        this._api_get(`/get-cards/${boardId}`, (response) => {
            this._data['cards'] = response;
            callback(response);
        });
    },

    createNewBoard: function (boardTitle, callback) {
        this._api_post('/write-new-board', boardTitle, (response) => {
            this._data['boards'] = response;
            callback(response)
        });
    },

    createNewPrivateBoard: function (privateBoardData, callback) {
        this._api_post('/new-private-board', privateBoardData, (response) => {
            this._data['boards'] = response;
            callback(response)
        });
    },

    createNewCard: function (cardData, boardId, callback) {
        this._api_post(`/add-new-card/${boardId}`, cardData, (response) => {
            callback(response);
        })
    },

    changeBoardTitle:function (boardId, boardTitle, callback) {
        this._api_post(`/change-board-title/${boardId}`, boardTitle, (response) => {
            callback(response);
        });
    },

    addColumnToBoard: function (boardData, callback) {
        this._api_post('/add-new-column', boardData, (response) => {
            callback(response);
        });
    },

    changeCardTitle: function (cardId, newStatus, callback) {
        this._api_post(`/change-card-status/${cardId}`, newStatus, (response) => {
            callback(response)
        })
    },

    changeColumnTitle: function (data, callback) {
        this._api_post('/change-column-title', data, (response) => {
            callback(response);
        });
    },

    removeCard: function (card_id, callback) {
        this._api_delete(`/remove-card/${card_id}`, (response) => {
            callback(response)
        })
    },

    removeBoard: function (board_id, callback) {
        this._api_delete(`/remove-board/${board_id}`, (response) => {
            callback(response)
        })
    },

    removeColumn: function (columnName, boardId, callback) {
        this._api_delete(`/remove-column/${boardId}/${columnName}`, (response) => {
            callback(response)
        })
    }
};
