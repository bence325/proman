// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        if (sessionStorage.getItem('username')) {
            dom.user_in();
        } else {
            // This function should run once, when the page is loaded.
            this.addNewBoardEventListener(document.querySelector("#newBoard"));
            this.addRegisterEventListeners();
        }
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let boardsContainer = document.querySelector('#boards');
        boardsContainer.innerHTML = "";
        let boardContainer = document.querySelector('#boards');
        boardContainer.classList.add('board-container', 'p-2');

        for (let board of boards) {
            this.appendNewBoard(board)
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
        for (let card of cards) {
            let jsonData = JSON.stringify(card)
            let column = board.querySelector(`[data-status="${card["status_id"]}"]`);
            let newCard = "";
            newCard += `
                <div class="card" draggable="true" data-json='${jsonData}'>
                    <div class="card-remove">
                        <i class="fas fa-trash-alt"></i>
                    </div>
                    <div class="card-title" data-cardId="${card['id']}">${card['title']}</div>
                </div>
                `;
            column.insertAdjacentHTML('beforeend', newCard);
        }
        dom.addEventListenerToCards();
    },
    // here comes more features
    loadStatusesToBoard: function (boardBody, boardId){
        dataHandler.getStatusesToBoard(boardId, function (statuses) {
            dom.addStatusColumns(boardBody, boardId);
        });
    },
    addStatusColumns: function (boardBody, boardId) {
        let columnList = "";
        for (let columnName of dataHandler._data['statuses']) {
            columnList += `
                <div class="board-column">
                    <div class="board-column-title">${columnName}</div>
                    <div class="board-column-content" data-status="${columnName}"></div>
                </div>
                `;
        }
        const outHtml = `
            <div class="board-columns" id="collapse${boardId}" class="collapse" aria-labelledby="heading${boardId}" data-parent="${boardId}">
                ${columnList}
            </div>
            `;
        boardBody.insertAdjacentHTML('beforeend', outHtml);
        dom.addEventListenerToContainer();
        let columnTitles = document.querySelectorAll('.board-column-title');
        for (let columnTitle of columnTitles) {
            columnTitle.addEventListener("click", dom.changeColumnTitle);
        }
    },
    addNewBoardEventListener: function (addNewBoarButton) {
        addNewBoarButton.addEventListener("click", this.createNewBoard);
    },
    addRegisterEventListeners: function () {
        document.querySelector("#register").addEventListener("click", this.register);
        document.querySelector("#login").addEventListener("click", this.login);
    },
    register: function () {
        let form = document.querySelector('#log-user');
        form.innerHTML = `
        <div id="new-user">
            <p><label for="username">Username:</label>
            <input type="text" id="username" name="username" placeholder="choose a name" required></p>
            <p><label for="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="choose a password" required></p>
            <p><button type="submit" id="sendRegistration">Submit</button></p>
        </div>`;
        document.querySelector("#sendRegistration").addEventListener('click', () => {
            let registrationData = {
                username: document.querySelector('#username').value,
                password: document.querySelector('#password').value
            }
            dataHandler._api_post('/registration', registrationData, function (confirmation){
                document.querySelector("#new-user").innerHTML = ' ';
                let feedback = `<p id="confirmation">${confirmation}</p>`;
                header.insertAdjacentHTML('afterend', feedback);
                setTimeout(() => document.querySelector("#confirmation").remove(), 5000);
            })
        })
    },
    login: function () {
        let form = document.querySelector('#log-user');
        form.innerHTML = `
        <div id="log-user">
            <p><label for="username">Username:</label>
            <input type="text" id="username" name="username" placeholder="Your username" required></p>
            <p><label for="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="Your password" required></p>
            <p><button type="submit" id="sendLoginData">Submit</button></p>
        </div>`;
        document.querySelector("#sendLoginData").addEventListener('click', () => {
            let loginData = {
                username: document.querySelector('#username').value,
                password: document.querySelector('#password').value
            }
            dataHandler._api_post('/login', loginData, function (success) {
                if (success) {
                    sessionStorage.setItem('username', loginData.username);
                    document.querySelector("#log-user").innerHTML = ' ';
                    dom.user_in();
                }
                else {
                    let loginForm = document.querySelector("#log-user");
                    let errorMessage = `<p id="error">Wrong username or password!</p>`;
                    loginForm.insertAdjacentHTML("beforeend", errorMessage);
                    setTimeout(() => document.querySelector("#error").remove(), 5000);
                }
            })
        })
    },
    user_in: function () {
        let loginButton = document.querySelector("#login");
        let welcomeUser = document.querySelector("#hello");
        welcomeUser.innerHTML = `Welcome, ${sessionStorage.getItem('username')}!`;
        loginButton.removeEventListener('click', dom.login);
        loginButton.innerHTML = "Log out";
        loginButton.addEventListener('click', dom.logout);
    },
    logout: function () {
        dataHandler._api_get('/logout', function (success) {
            sessionStorage.clear();
            let logoutButton = document.querySelector('#login');
            logoutButton.removeEventListener('click', dom.logout);
            logoutButton.innerHTML = "Log in";
            logoutButton.addEventListener('click', dom.login);
            document.querySelector('#hello').innerHTML = " ";
        })
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
            <label for="title">Board title</label>
            <input type="text" id="title" name="title">
            <button type="submit" id="newBoardSubmit">Save</button>
        </div>
        `;
        header.insertAdjacentHTML('beforeend', submit);
        document.querySelector('#newBoardSubmit').addEventListener('click', () => {
            dataHandler.createNewBoard(dom.getNewTitle(), (board) => {
                dom.appendNewBoard(board);
                document.querySelector("#addNewBoard").remove();
                let addNewBoardButton = `
                    <button id="newBoard" class="board-toggle data-toggle">Add Board  <i class="fas fa-plus"></i></button>
                `;
                header.insertAdjacentHTML("beforeend", addNewBoardButton);
                dom.addNewBoardEventListener(document.querySelector("#newBoard"));
                dom.addEventListenerToCards();
            })
        })
    },
    getNewTitle: function () {
        const title = document.querySelector('#title').value;
        return {title}
    },
    appendNewBoard: function (board) {
        const container = document.querySelector('.board-container');
        let boardList = `
            <section class="board" id="board-${board.id}">
            <div class="board-header" id="heading${board.id}">
                <span class="board-title">${board.title}</span> 
                <button class="board-add">Add Card  <i class="fas fa-plus"></i></button> 
                <button class="board-add" id="addColumnToBoard-${board.id}">Add Column  <i class="fas fa-plus"></i></button> 
                <button class="data-toggle board-toggle" data-boardContent="${board.id}" data-toggle="collapse" data-target="#collapse${board.id}" aria-expanded="true" aria-controls="collapse${board.id}">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            </section>
            `;
        container.insertAdjacentHTML("beforeend", boardList);
        document.querySelector(`[data-boardContent="${board.id}"]`).addEventListener("click", this.loadCards);
        document.querySelector(`#board-${board.id}`).lastElementChild.firstElementChild.addEventListener("click", this.changeBoardTitle);
        document.querySelector(`#addColumnToBoard-${board.id}`).addEventListener("click", this.addColumnToBoard);
    },
    addEventListenerToCards: function () {
        let cards = document.querySelectorAll('.card');
        for (let card of cards) {
            card.addEventListener('dragstart', dom.dragStartHandler)
            card.addEventListener('dragend', dom.dragEndHandler)
        }
    },
    addEventListenerToContainer: function () {
        let containers = document.querySelectorAll('.board-column')
        for (let container of containers) {
            container.addEventListener("dragenter", dom.dropZoneEnterHandler);
            container.addEventListener("dragleave", dom.dropZoneLeaveHandler);
            container.addEventListener("dragover", dom.dropZoneOverHandler);
            container.addEventListener("drop", dom.dropZoneDropHandler);
        }
    },
    dragStartHandler: function (e) {
        let data = JSON.parse(this.dataset.json);
        dom.setDropZonesHighlight(data.board_id);
        this.classList.add('dragged', 'drag-feedback');
        e.dataTransfer.setData('type/dragged-box', 'dragged');
    },
    dragEndHandler: function () {
        let actualDataset = this
        let data = JSON.parse(this.dataset.json);
        let newStatus = this.parentNode.dataset.status
        dom.setDropZonesHighlight(data.board_id, false)
        this.classList.remove('dragged');
        this.classList.remove('drag-feedback');
        dom.changeStatus(actualDataset, data, newStatus);
    },
    dropZoneEnterHandler: function (e) {
        if (e.dataTransfer.types.includes('type/dragged-box')) {
            this.classList.add("over-zone");
            e.preventDefault();
        }
    },
    dropZoneLeaveHandler: function (e) {
        if (e.dataTransfer.types.includes('type/dragged-box') &&
            e.relatedTarget !== null &&
            e.currentTarget !== e.relatedTarget.closest('.bord-column-content')) {
            this.classList.remove("over-zone");
        }
    },
    dropZoneOverHandler: function (e) {
        e.preventDefault()
    },
    dropZoneDropHandler: function (e) {
        e.preventDefault();
        let dropZone;
        let boardId = e.target.parentNode;
        let draggedElement = document.querySelector('.dragged');
        let cardJsonData = JSON.parse(draggedElement.dataset.json)
        if (e.target.classList.contains('active-zone')) {
            dropZone = e.target.querySelector('.board-column-content')
        } else if (e.target.classList.contains('board-column-content')) {
            dropZone = e.target;
            boardId = e.target.parentNode.parentNode
        } else if (e.target.classList.contains('card')) {
            dropZone = e.target.parentNode;
            boardId = e.target.parentNode.parentNode.parentNode
        } else if (e.target.classList.contains('card-title')) {
            dropZone = e.target.parentNode.parentNode
            boardId = e.target.parentNode.parentNode.parentNode.parentNode
        }
        if (parseInt(boardId.dataset.parent) === cardJsonData.board_id) {
            dropZone.appendChild(draggedElement)
        }
    },
    setDropZonesHighlight: function (cardBoardId, highlight = true) {
        const dropZones = document.querySelectorAll(".board-column");
        for (const dropZone of dropZones) {
            let boardId = dropZone.parentNode.dataset.parent
            if (highlight && parseInt(boardId) === cardBoardId) {
                dropZone.classList.add("active-zone");
            } else {
                dropZone.classList.remove("active-zone");
                dropZone.classList.remove("over-zone");
            }
        }
    },
    changeBoardTitle: function () {
        let boardId = this.parentNode.parentNode.id.split("-")[1];
        let oldTitle = this.innerHTML;
        let head = this.parentNode;
        this.remove();
        let submit = `
            <div id="addNewBoardTitle" class="board-add">
                <label for="title"></label>
                <input type="text" id="title" name="title" placeholder="${oldTitle}">
                <button type="submit" id="newTitleSubmit">Save</button>
            </div>
            `;
        head.insertAdjacentHTML('afterbegin', submit);
        document.querySelector('#newTitleSubmit').addEventListener('click', (e) => {
            let newTitle = dom.getNewTitle();
            dataHandler.changeBoardTitle(boardId, newTitle, (response) => {
                let newBoardTitle = `
                    <span class="board-title">${newTitle['title']}</span>
                `;
                document.querySelector("#addNewBoardTitle").remove();
                document.querySelector(`#heading${boardId}`).insertAdjacentHTML('afterbegin', newBoardTitle);
                document.querySelector(`#board-${boardId}`).lastElementChild.firstElementChild.addEventListener("click", dom.changeBoardTitle);
            });
        })
    },
    addColumnToBoard: function () {
        let columnData = {board_id: this.id.split("-")[1]};
        let submit = `
        <div id="newColumnTitle" class="board-add">
            <label for="title"></label>
            <input type="text" id="title" name="title" placeholder="New Column">
            <button type="submit" id="newTitleSubmit">Save</button>
        </div>
        `;
        this.insertAdjacentHTML("afterend", submit);
        this.remove();
        document.querySelector('#newTitleSubmit').addEventListener('click', (e) => {
            let columnTitle = dom.getNewTitle();
            Object.assign(columnData, columnTitle);
            dataHandler.addColumnToBoard(columnData, (response) => {
                if (response !== "ok") {
                    alert(response);
                } else {
                    let addNewColumn = `
                        <button class="board-add" id="addColumnToBoard-${columnData.board_id}">Add Column  <i class="fas fa-plus"></i></button> 
                    `;
                    document.querySelector("#newColumnTitle").insertAdjacentHTML("beforebegin", addNewColumn);
                    document.querySelector("#newColumnTitle").remove();
                    document.querySelector(`#addColumnToBoard-${columnData.board_id}`).addEventListener("click", dom.addColumnToBoard);
                    if (document.querySelector(`#heading${columnData.board_id}`).nextElementSibling) {
                        let newColumn = `
                            <div class="board-column">
                                <div class="board-column-title">${columnData.title}</div>
                                <div class="board-column-content" data-status="${columnData.title}"></div>
                            </div>
                            `;
                        let boardBody = document.querySelector(`#collapse${columnData.board_id}`)
                        boardBody.insertAdjacentHTML('beforeend', newColumn);
                        dom.addEventListenerToContainer();
                        document.querySelector(`[data-status="${columnData.title}"`).previousElementSibling.addEventListener("click", dom.changeColumnTitle);
                    };
                };
            });
        })
    },
    changeStatus: function (actualDataset, data, newStatus) {
        let cardId = data.id;
        dataHandler.changeCardTitle(cardId, newStatus, () => {
            data.status_id = actualDataset.parentNode.dataset.status
            actualDataset.dataset.json = JSON.stringify(data)
        })
    },
    changeColumnTitle: function () {
        let boardId = this.parentNode.parentNode.dataset.parent;
        let oldTitle = this.innerHTML;
        let linput = `
                <input type="text" id="title" name="title" class="submit-${boardId}" placeholder="${oldTitle}">
            `;
        this.insertAdjacentHTML("afterend", linput);
        this.remove();
        // not working yet....
        // document.querySelector(".board-header").addEventListener("click", () => {
        //     console.log('1')
        //     dom.backOldTitle(boardId, oldTitle);
        // })
        document.querySelector(`.submit-${boardId}`).addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                let newTitle = dom.getNewTitle();
                let columnIndex = dom.getColumnIndex(boardId, oldTitle);
                if (newTitle.title !== oldTitle) {
                    let data = {board_id: boardId, column_index: columnIndex, old_title: oldTitle, new_title: newTitle.title};
                    dataHandler.changeColumnTitle(data, (response) => {
                        if (response === "update") {
                            dom.backOldTitle(boardId, newTitle.title);
                            document.querySelector(`[data-status="${oldTitle}"]`).setAttribute("data-status", newTitle.title);
                        } else {
                            alert(response)
                            dom.backOldTitle(boardId, oldTitle);
                        }
                    });
                } else {
                    dom.backOldTitle(boardId, oldTitle);
                };
            }
            if (e.keyCode === 27) {
                dom.backOldTitle(boardId, oldTitle);
            }
            // columnTitle.addEventListener("click", dom.changeColumnTitle)
        });
    },
    backOldTitle: function (boardId, oldTitle) {
        let title = `
            <div class="board-column-title">${oldTitle}</div>
        `;
        document.querySelector(`.submit-${boardId}`).insertAdjacentHTML("afterend", title);
        document.querySelector(`.submit-${boardId}`).nextElementSibling.addEventListener("click", dom.changeColumnTitle);
        document.querySelector(`.submit-${boardId}`).remove();
    },
    getColumnIndex: function (boardId, oldTitle) {
        let columns = document.querySelector(`[data-parent="${boardId}"]`).children;
        let index = 0;
        for (let column of columns) {
            if (column.children[0].tagName === "INPUT") {
                return index;
            }
            index++;
        }
    }
};
