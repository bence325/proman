// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function
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
    init: function () {
    }
    ,
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
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
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    clear_boards: function () {
        this._data = {};
    },
    getStatusesToBoard: function (boardId, callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        this._api_get(`/get-statuses-to-board/${boardId}`, (response) => {
            this._data['statuses'] = response;
            callback(response);
        });
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: function (boardId, callback) {
        this._api_get(`/get-cards/${boardId}`, (response) => {
            this._data['cards'] = response;
            callback(response);
        });
        // the cards are retrieved and then the callback function is called with the cards
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
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
        // creates new card, saves it and calls the callback function with its data
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
