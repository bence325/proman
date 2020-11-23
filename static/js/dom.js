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
            <div id="accordion">
                <div class="card m-2">
                    <div class="card-header justify-content-between" id="heading${board.id}">
                        <h5 class="mb-0">
                        <spa>${board.title}</spa>
                        <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${board.id}" aria-expanded="true" aria-controls="collapse${board.id}">
                            <div class="arrow-down" data-boardId="${board.id}"></div>
                        </button>
                        </h5>
                    </div>
                    <div id="collapse${board.id}" class="collapse" aria-labelledby="heading${board.id}" data-parent="#accordion">
                        <div class="card-body">
                        </div>
                    </div>
                </div>
            </div>
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
