// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
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
            <section class="board">
            <div class="board-header"><span class="board-title">${board.title}</span>
                <button class="board-add">Add Card</button>
                <button class="board-toggle"><i class="fas fa-chevron-down" data-boardId="${board.id}"></i></button>
            </div>
            <div class="board-columns">
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
            document.querySelector(`[data-boardId="${board.id}"]`).addEventListener("click", this.loadCards);
        }
    },
    loadCards: function (e) {
        // retrieves cards and makes showCards called
        console.log(dataHandler.getStatuses());
        dom.showCards(dataHandler.getCardsByBoardId(e.target.dataset.board));
    },
    showCards: function (cards) {
        for(let card of cards) {
            console.log(card)
        }
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
};
