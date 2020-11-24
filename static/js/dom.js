// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        this.loadStatuses();
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

        let boardList = '';

        for(let board of boards){

            boardList += `
            <section class="board" id="board-${board.id}">
            <div class="board-header justify-content-between" id="heading${board.id}">
                <span class="board-title">${board.title}</span>
                <button class="board-add">Add Card</button>
                <button class="data-toggle" data-boardContent="${board.id}" data-toggle="collapse" data-target="#collapse${board.id}" aria-expanded="true" aria-controls="collapse${board.id}">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            </section>
            `;
        }

        const outerHtml = `
            <div class="board-container p-2">
                ${boardList}
            </div>
        `;

        let boardsContainer = document.querySelector('#boards');
        boardsContainer.innerHTML = "";
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
        for(let board of boards) {
            document.querySelector(`[data-boardContent="${board.id}"]`).addEventListener("click", this.loadCards);
            document.querySelector(".board-title").addEventListener("click", this.changeBoardTitle)
        }
    },
    loadCards: function () {
        // retrieves cards and makes showCards called
        let boardBody = this.parentNode.parentNode;
        let boardColumns = boardBody.querySelector(".board-columns");
        let arrow = boardBody.querySelector(".fas");
        if (!boardColumns) {
            dom.addStatusColumns(boardBody);
            dataHandler.getCardsByBoardId(parseInt(boardBody.id.split("-")[1]), function (cards){
                dom.showCards(boardBody, cards);
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
    loadStatuses: function (){
        dataHandler.getStatuses(function (statuses) {
        });
    },
    addStatusColumns: function (boardBody) {
        let columnList = "";
        for(let column of dataHandler._data['statuses']) {
            columnList += `
                <div class="board-column">
                    <div class="board-column-title" data-status="${column['title']}">${column['title']}</div>
                    <div class="board-column-content">
                    </div>
                </div>
                `;
        };
        let boardId = boardBody.id;
        const outHtml = `
            <div class="board-columns" id="collapse${boardId}" class="collapse" aria-labelledby="heading${boardId}" data-parent="board-#${boardId}">
                ${columnList}
            </div>
            `;
        boardBody.insertAdjacentHTML('beforeend', outHtml);
    },
    changeBoardTitle: function () {
        console.log(this.parentNode);
        let oldTitle = this.innerHTML;
        let head = this.parentNode;
        this.remove();
        let input = document.createElement("input");
        input.classList.add("board-title");
        head.insertAdjacentElement('beforebegin', input);
    }
};
