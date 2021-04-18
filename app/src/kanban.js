import Board from './baord.js';
import Card from './card.js'
import { get, post } from './http.js';

export default class Kanban {
    boards;
    url;

    constructor() {
        this.boards = [];
        this.url = 'http://localhost:3000'
    }

    add(board) {
        this.boards.push(board);

        post(`${this.url}/new-board`, 'json', {
            id: board.id, title:board.tittle
        })
            .then(response => {
                console.log(response);
            });
    }

    addCard(card, indexBoard) {
        this.getBoard(indexBoard).add(card);

        post(`${this.url}/update-all`, 'json', {
            boards: this.toJSON()
        })
            .then(response => {
                console.log(response);
            });
    }

    getBoard(index) {

        return this.boards[index];
    }



    getIndex(id) {
        return this.boards.findIndex(board => board.id == id);
    }

    removeCard(indexBoard, indexCard) {
        // Al hacerl de esta forma regresa un arreglo de elementos eliminados
        const card = this.getBoard(indexBoard).items.splice(indexCard, 1)[0];
        get(`${this.url}/delete-card/${indexBoard}/${indexCard}`)
        .then(response=>{
            console.log(response);
        })
        return card;
    }

    insertCard(card, indexBoard, indexCard) {
        this.getBoard(indexBoard).items.splice(indexCard + 1, 0, card);
    }

    moveCard(indexBoardSrc, indexCardSrc, indexBoardTarget, indexCardTarget) {
        const srcCard = this.removeCard(indexBoardSrc, indexCardSrc);
        this.insertCard(srcCard, indexBoardTarget, indexCardTarget);

        post(`${this.url}/update-all`, 'json', {
            boards: this.toJSON()
        })
            .then(response => {
                console.log(response);
            });
    }

    updateBoard(id, index, tittle) {
        this.getBoard(index).tittle = tittle;

        post(`${this.url}/update-board`, 'json', {
            id:id, 
            title:tittle
        })
            .then(response => {
                console.log(response);
            });
    }

    removeBoard(index) {
        const id = this.boards[index].id;
        this.boards.splice(index, 1);

        get(`${this.url}/delete-board/${id}`)
        .then(response =>{
            console.log(response);
        })
    }

    updateCard(indexBoard, indexCard, tittle) {
        const card = this.boards[indexBoard].items[indexCard];
        card.tittle = tittle;

        post(`${this.url}/update-card`, 'json', {
            id:card.id, 
            title:tittle,
            indexBoard: indexBoard
        })
            .then(response => {
                console.log(response);
            });
    }

    async loadBoards() {
        try {
            const data = await get(this.url);

            this.boards = data.boards.map(board => {

                const cards = board.cards.map(card => {
                    const newCard = new Card(card.title);
                    newCard.id = card.id;

                    return newCard;
                });

                const newBoard = new Board(board.title, cards);
                newBoard.id = board.id;

                return newBoard;
            });
        } catch (ex) {
            console.error("algo pasa dude");
        }
    }

    toJSON() {
        const json = this.boards.map(board =>{
            
            const cards =  board.items.map(card => {
                //const card2 = new Card();
                return {
                    id: card.id, 
                    title: card.tittle
                }
            });
            return{
                id:board.id,
                title:board.tittle,
                cards:cards
            }
        });

        return json;
    }
}