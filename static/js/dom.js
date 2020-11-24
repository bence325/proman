// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        // this.loadStatuses();
        this.addNewBoardEventListener(document.querySelector("#newBoard"));
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let boardsContainer = document.querySelector('#boards');
        boardsContainer.innerHTML = "";
        let boardContainer = document.querySelector('#boards')
        boardContainer.classList.add('board-container', 'p-2')

        for(let board of boards){
            this.appendNewBoard(board);
        }
    },
    loadCards: function () {
        // retrieves cards and makes showCards called
        let boardBody = this.parentNode.parentNode;
        let boardId = boardBody.id.split("-")[1];
        let boardColumns = boardBody.querySelector(".board-columns");
        let arrow = boardBody.querySelector(".fas");
        if (!boardColumns) {
            dom.loadStatusesToBoard(boardBody, boardId);
            dataHandler.getCardsByBoardId(parseInt(boardBody.id.split("-")[1]), function (cards){
                if (cards) {
                    dom.showCards(boardBody, cards);
                }
            });
            arrow.classList.remove("fa-chevron-down");
            arrow.classList.add("fa-chevron-up");
        } else {
            boardColumns.remove();
            arrow.classList.remove("fa-chevron-up");
            arrow.classList.add("fa-chevron-down");
        }
    },
    showCards: function (board, cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        for(let card of cards) {
            let column = board.querySelector(`[data-status="${card["status_id"]}"]`);
            let newCard = "";
            newCard += `
                <div class="card">
                    <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                    <div class="card-title" data-cardId="${card['id']}">${card['title']}</div>
                </div>
                `;
            column.insertAdjacentHTML('beforeend', newCard);
        }
    },
    // here comes more features
    loadStatusesToBoard: function (boardBody, boardId){
        dataHandler.getStatusesToBoard(boardId, function (statuses) {
            dom.addStatusColumns(boardBody, boardId);
        });
    },
    addStatusColumns: function (boardBody, boardId) {
        let columnList = "";
        for(let columnName of dataHandler._data['statuses']) {
            columnList += `
                <div class="board-column">
                    <div class="board-column-title">${columnName}</div>
                    <div class="board-column-content" data-status="${columnName}"></div>
                </div>
                `;
        }
        const outHtml = `
            <div class="board-columns" id="collapse${boardId}" class="collapse" aria-labelledby="heading${boardId}" data-parent="board-#${boardId}">
                ${columnList}
            </div>
            `;
        boardBody.insertAdjacentHTML('beforeend', outHtml);
    },
    addNewBoardEventListener: function (addNewBoarButton) {
        addNewBoarButton.addEventListener("click", this.createNewBoard);
    },
    createNewBoard: function (e) {
        let header = document.querySelector("#header");
        if (e.target.localName === "button") {
            e.target.remove();
        } else {
            e.target.parentNode.remove();
        }
        let submit = `
        <div id="addNewBoard" class="board-toggle">
            <label for="board_title">Board title</label>
            <input type="text" id="board_title" name="board_title">
            <button type="submit" id="newBoardSubmit">Save</button>
        </div>
        `;
        header.insertAdjacentHTML('beforeend', submit);
        document.querySelector('#newBoardSubmit').addEventListener('click', () => {
            dataHandler.createNewBoard(dom.getNewBoard(), (board) => {
                dom.appendNewBoard(board);
                document.querySelector("#addNewBoard").remove();
                let addNewBoardButton = `
                    <button id="newBoard" class="board-toggle data-toggle">Add Board  <i class="fas fa-plus"></i></button>
                `;
                header.insertAdjacentHTML("beforeend", addNewBoardButton);
                dom.addNewBoardEventListener(document.querySelector("#newBoard"));
            })
        })
    },
    getNewBoard: function () {
        const title = document.querySelector('#board_title').value;
        return {title}
    },
    appendNewBoard: function (board) {
        const container = document.querySelector('.board-container');
        let boardList = `
            <section class="board" id="board-${board.id}">
            <div class="board-header" id="heading${board.id}">
                <span class="board-title">${board.title}</span> 
                <button class="board-add">Add Card  <i class="fas fa-plus"></i></button> 
                <button class="board-add">Add Column  <i class="fas fa-plus"></i></button> 
                <button class="data-toggle board-toggle" data-boardContent="${board.id}" data-toggle="collapse" data-target="#collapse${board.id}" aria-expanded="true" aria-controls="collapse${board.id}">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            </section>
            `;
        container.insertAdjacentHTML("beforeend", boardList);
        document.querySelector(`[data-boardContent="${board.id}"]`).addEventListener("click", this.loadCards);
        document.querySelector(`#board-${board.id}`).lastElementChild.firstElementChild.addEventListener("click", this.changeBoardTitle);
    },
    changeBoardTitle: function () {
        let boardId = this.parentNode.parentNode.id.split("-")[1];
        let oldTitle = this.innerHTML;
        let head = this.parentNode;
        this.remove();
        let submit = `
            <div id="addNewBoardTitle" class="board-title">
                <label for="board_title"></label>
                <input type="text" id="board_title" name="board_title" placeholder="${oldTitle}">
                <button type="submit" id="newTitleSubmit">Save</button>
            </div>
            `;
        head.insertAdjacentHTML('afterbegin', submit);
        document.querySelector('#newTitleSubmit').addEventListener('click', (e) => {
            let newTitle = dom.getNewBoard();
            dataHandler.changeBoardTitle(boardId, newTitle, (response) => {
                let newBoardTitle = `
                    <span class="board-title">${newTitle['title']}</span>
                `;
                document.querySelector("#addNewBoardTitle").remove();
                document.querySelector(`#heading${boardId}`).insertAdjacentHTML('afterbegin', newBoardTitle);
                document.querySelector(`#board-${boardId}`).lastElementChild.firstElementChild.addEventListener("click", dom.changeBoardTitle);
                console.log(document.querySelector(`#board-${boardId}`).lastElementChild.firstElementChild);
            });
        })
    }
};
