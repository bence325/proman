import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        this.addNewBoardEventListener(document.querySelector("#newBoard"));
        if (sessionStorage.getItem('username')) {
            dom.user_in();
        } else {
            this.addRegisterEventListeners();
        }
    },
    loadBoards: function () {
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        let boardsContainer = document.querySelector('#boards');
        boardsContainer.innerHTML = "";
        let boardContainer = document.querySelector('#boards');
        boardContainer.classList.add('board-container', 'p-2');

        for (let board of boards) {
            this.appendNewBoard(board)
        }
        dom.newCardEventListener();
        dom.addEventListenerToBoardBins();
    },
    loadCards: function () {
        let boardBody = this.parentNode.parentNode;
        let boardHeader = boardBody.querySelector('.board-header')
        let boardId = boardBody.id.split("-")[1];
        let boardColumns = boardBody.querySelector(".board-columns");
        let arrow = boardBody.querySelector(".fas");
        dom.displayButtons(boardHeader)
        if (!boardColumns) {
            dom.loadStatusesToBoard(boardBody, boardId);
            dataHandler.getCardsByBoardId(parseInt(boardBody.id.split("-")[1]), function (cards) {
                if (cards) {
                    dom.showCards(boardBody, cards);
                }
            });
            arrow.classList.remove("fa-chevron-down");
            arrow.classList.add("fa-chevron-up");
        } else {
            dom.displayButtons(boardHeader, false)
            boardColumns.remove();
            arrow.classList.remove("fa-chevron-up");
            arrow.classList.add("fa-chevron-down");
        }
    },
    showCards: function (board, cards) {
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
        dom.addEventListenerToBins();
    },
    loadStatusesToBoard: function (boardBody, boardId) {
        dataHandler.getStatusesToBoard(boardId, function (statuses) {
            dom.addStatusColumns(boardBody, boardId);
        });
    },
    addStatusColumns: function (boardBody, boardId) {
        let columnList = "";
        for (let columnName of dataHandler._data['statuses']) {
            columnList += `
                <div class="board-column">
                    <div class="board-column-title">
                        <div>${columnName}</div>
                        <div class="column-trash" data-column="${columnName}"><i class="fas fa-trash-alt board"></i></div>
                    </div>
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
        dom.addEventListenerToColumnBins();
        let columnTitles = document.querySelectorAll('.board-column-title');
        for (let columnTitle of columnTitles) {
            columnTitle.children[0].addEventListener("click", dom.changeColumnTitle);
        }
    },
    addNewBoardEventListener: function (addNewBoarButton) {
        addNewBoarButton.addEventListener("click", this.createNewBoard);
    },
    addNewPrivateBoardEventListener: function (privateBoardButton) {
        privateBoardButton.addEventListener('click', this.createPrivateBoard);
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
            dataHandler.registration( registrationData, function (confirmation) {
                document.querySelector("#new-user").innerHTML = ' ';
                let feedback = `<p id="confirmation">${confirmation}</p>`;
                let header = document.querySelector("#header");
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
            dataHandler.login(loginData, function(success) {dom.login_success(success, loginData)});
        })
    },
    login_success: function(success, loginData){
        if (success) {
                sessionStorage.setItem('username', loginData.username);
                document.querySelector("#log-user").innerHTML = ' ';
                dom.user_in();
            } else {
                dom.failed_login();
            }
    },
    failed_login: function () {
                let loginForm = document.querySelector("#log-user");
                let errorMessage = `<p id="error">Wrong username or password!</p>`;
                loginForm.insertAdjacentHTML("beforeend", errorMessage);
                setTimeout(() => document.querySelector("#error").remove(), 5000);
    },
    user_in: function () {
        let loginButton = document.querySelector("#login");
        let welcomeUser = document.querySelector("#hello");
        let registerButton = document.querySelector('#register');
        let privateBoardCreator = document.querySelector('#newPrivateBoard');
        privateBoardCreator.classList.remove('hidden');
        privateBoardCreator.classList.add('board-toggle');
        privateBoardCreator.addEventListener('click', dom.createPrivateBoard);
        registerButton.remove();
        let username = sessionStorage.getItem('username');
        welcomeUser.innerHTML = `Welcome, ${sessionStorage.getItem('username')}!`;
        welcomeUser.classList.remove('hidden');
        loginButton.removeEventListener('click', dom.login);
        loginButton.innerHTML = "Log out";
        loginButton.addEventListener('click', dom.logout);
        dataHandler.get_privateBoards(username, function (boards) {
            dom.showBoards(boards);
        });
    },
    logout: function () {
        dataHandler._api_get('/logout', function (success) {
            sessionStorage.clear();
            let privateBoardCreator = document.querySelector('#newPrivateBoard');
            privateBoardCreator.classList.remove('board-toggle');
            privateBoardCreator.classList.add('hidden');
            let logoutButton = document.querySelector('#login');
            logoutButton.removeEventListener('click', dom.logout);
            logoutButton.innerHTML = "Log in";
            logoutButton.addEventListener('click', dom.login);
            document.querySelector('#hello').classList.add('hidden');
            let registerButton = `<button id="register">Register</button>`
            let logo = document.querySelector('#logo');
            logo.insertAdjacentHTML("afterend", registerButton);
            document.querySelector('#register').addEventListener('click', dom.register);
            dataHandler.clear_boards();
            dom.loadBoards();
        })
    },
    createNewBoard: function (e) {
        let header = document.querySelector("#header");
        e.currentTarget.remove();
        if (sessionStorage.getItem('username')) {
            let privateBoardCreator = document.querySelector('#newPrivateBoard');
            privateBoardCreator.classList.add('hidden');
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
                if (sessionStorage.getItem('username')) {
                    let privateBoardCreator = document.querySelector('#newPrivateBoard');
                    privateBoardCreator.classList.remove('hidden');
                }
                dom.addNewBoardEventListener(document.querySelector("#newBoard"));
                dom.addEventListenerToCards();
                dom.addEventListenerToBoardBins();
                dom.newCardEventListener();
            })
        })
    },
    createPrivateBoard: function (e) {
        let header = document.querySelector("#header");
        let publicBoardButton = document.querySelector('#newBoard');
        e.currentTarget.classList.add('hidden');
        publicBoardButton.classList.add('hidden');
        let submit = `
        <div id="addNewBoard" class="board-toggle">
            <label for="title">Board title (private)</label>
            <input type="text" id="title" name="title">
            <button type="submit" id="newBoardSubmit">Save</button>
        </div>
        `;
        header.insertAdjacentHTML('beforeend', submit);
        document.querySelector('#newBoardSubmit').addEventListener('click', () => {
            let privateBoardData = {
                'username': sessionStorage.getItem('username'),
                'title': document.querySelector('#title').value + ' (private)'}
            dataHandler.createNewPrivateBoard(privateBoardData, (board) => {
                dom.appendNewBoard(board);
                document.querySelector("#addNewBoard").remove();
                let privateBoardCreator = document.querySelector('#newPrivateBoard');
                privateBoardCreator.classList.remove('hidden');
                privateBoardCreator.classList.add('board-toggle');
                publicBoardButton.classList.remove('hidden');
                publicBoardButton.classList.add('board-toggle');
                dom.addNewPrivateBoardEventListener(document.querySelector("#newPrivateBoard"));
                dom.addEventListenerToCards();
                dom.addEventListenerToBoardBins();
                dom.newCardEventListener();
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
                <button class="board-add-card hidden" id="${board.id}">Add Card  <i class="fas fa-plus"></i></button> 
                <button class="board-add hidden" id="addColumnToBoard-${board.id}">Add Column  <i class="fas fa-plus"></i></button> 
                <button class="board-toggle "> 
                    <div id="board-trash" data-boardId="${board.id}"><i class="fas fa-trash-alt board"></i></div>
                </button>
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
            card.addEventListener('dragstart', dom.dragStartHandler);
            card.addEventListener('dragend', dom.dragEndHandler);
        }
    },
    addEventListenerToContainer: function () {
        let containers = document.querySelectorAll('.board-column');
        for (let container of containers) {
            container.addEventListener("dragenter", dom.dropZoneEnterHandler);
            container.addEventListener("dragleave", dom.dropZoneLeaveHandler);
            container.addEventListener("dragover", dom.dropZoneOverHandler);
            container.addEventListener("drop", dom.dropZoneDropHandler);
        }
    },
    addEventListenerToBins: function () {
        let bins = document.querySelectorAll('.card-remove');
        bins.forEach(bin => bin.addEventListener('click', dom.removeCard));
    },
    addEventListenerToBoardBins: function () {
        let bins = document.querySelectorAll('#board-trash');
        bins.forEach(bin => bin.addEventListener('click', dom.removeBoard))
    },
    addEventListenerToColumnBins: function () {
        let bins = document.querySelectorAll('.column-trash');
        bins.forEach(bin => bin.addEventListener('click', dom.removeColumn))
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
        let boardId = e.target.closest('.board-columns');
        let draggedElement = document.querySelector('.dragged');
        let cardJsonData = JSON.parse(draggedElement.dataset.json)
        if (e.target.closest('.board-column').classList.contains('active-zone')) {
            dropZone = e.target.closest('.board-column').querySelector('.board-column-content');
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
                                <div class="board-column-title">${columnData.title}
                                    <div class="column-trash" data-column="${columnData.title}"><i class="fas fa-trash-alt board"></i></div>
                                </div>
                                <div class="board-column-content" data-status="${columnData.title}"></div>
                            </div>
                            `;
                        let boardBody = document.querySelector(`#collapse${columnData.board_id}`)
                        boardBody.insertAdjacentHTML('beforeend', newColumn);
                        dom.addEventListenerToContainer();
                        dom.addEventListenerToColumnBins();
                        document.querySelector(`[data-status="${columnData.title}"`).previousElementSibling.addEventListener("click", dom.changeColumnTitle);
                    }
                }
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
    addNewCard: function () {
        let cardData = {board_id: this.id};
        let submit = `
        <div id="newColumnTitle" class="board-add">
            <label for="title"></label>
            <input type="text" id="title" name="title" placeholder="New Card">
            <button type="submit" id="newCardSubmit">Save</button>
        </div>
        `;
        this.insertAdjacentHTML("afterend", submit);
        this.remove();
        let parent = document.querySelector(`[data-parent="${cardData.board_id}"]`)
        let status = parent.children[0].children[1].dataset.status
        Object.assign(cardData, {status})
        document.querySelector('#newCardSubmit').addEventListener('click', (e) => {
            let cardTitle = dom.getNewTitle();
            Object.assign(cardData, cardTitle);
            dataHandler.createNewCard(cardData, cardData.board_id, (response) => {
                let addNewColumn = `
                        <button class="board-add-card" id="${cardData.board_id}">Add Card <i class="fas fa-plus"></i></button> 
                    `;
                document.querySelector("#newColumnTitle").insertAdjacentHTML("beforebegin", addNewColumn);
                document.querySelector("#newColumnTitle").remove();
                document.querySelector(`#heading${cardData.board_id}`).children[1].addEventListener("click", dom.addNewCard);
                response.status_id = cardData.status
                let jsonData = JSON.stringify(response)
                let boardColumn = (document.querySelector(`[data-parent='${cardData.board_id}']`)).children[0]
                let column = boardColumn.children[1]
                let newCard = `
                <div class="card" draggable="true" data-json='${jsonData}'>
                    <div class="card-remove">
                        <i class="fas fa-trash-alt"></i>
                    </div>
                    <div class="card-title" data-cardId="${response['id']}">${response['title']}</div>
                </div>
                `;
                column.insertAdjacentHTML('afterbegin', newCard);
                dom.addEventListenerToCards();
                dom.addEventListenerToBins();
            });
        })
    },
    newCardEventListener: function () {
        let newCardButtons = document.querySelectorAll('.board-add-card');
        newCardButtons.forEach(newButton => newButton.addEventListener('click', dom.addNewCard));
    },
    changeColumnTitle: function () {
        let boardId = this.closest('[data-parent]').dataset.parent;
        let oldTitle = this.innerHTML;
        let linput = `
                <input type="text" id="title" name="title" class="submit-${boardId}" placeholder="${oldTitle}">
            `;
        this.insertAdjacentHTML("beforebegin", linput);
        this.remove();
        document.querySelector(`.submit-${boardId}`).addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                let newTitle = dom.getNewTitle();
                let columnIndex = dom.getColumnIndex(boardId, oldTitle);
                if (newTitle.title !== oldTitle) {
                    let data = {
                        board_id: boardId,
                        column_index: columnIndex,
                        old_title: oldTitle,
                        new_title: newTitle.title
                    };
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
                }
                ;
            }
            if (e.keyCode === 27) {
                dom.backOldTitle(boardId, oldTitle);
            }
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
    },
    displayButtons: function (boardHeader, visible = true) {
        let addCard = boardHeader.querySelector('.board-add-card');
        let addColumn = boardHeader.querySelector('.board-add');
        if (visible) {
            addCard.classList.remove('hidden')
            addColumn.classList.remove('hidden')
        } else {
            addCard.classList.add('hidden')
            addColumn.classList.add('hidden')
        }
    },
    removeCard: function () {
        let card_id = JSON.parse(this.parentElement.dataset.json).id;
        let card = this.parentElement;
        dataHandler.removeCard(card_id, () => {
            card.remove()
        })
    },
    removeBoard: function () {
        let board_id = this.dataset.boardid;
        let board = document.querySelector(`#board-${board_id}`);
        dataHandler.removeBoard(board_id, () => {
                board.remove()
        })
    },
    removeColumn: function () {
        let columnName = this.dataset.column;
        let boardId = this.closest('.board-columns').dataset.parent;
        let column = this.closest('.board-column');
        dataHandler.removeColumn(columnName, boardId, () => {
            column.remove()
        })
    }
};
