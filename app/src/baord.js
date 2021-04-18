import {generateId} from './ids.js';

export default class Board{
    id;
    tittle;
    itmes;

    constructor(tittle, items){
        this.id = generateId();
        this.tittle = tittle;
        this.items = [...items];
    }

    getIndex(id){
        //findIndex es un callback que retorna el primer index que encuentere en este caso buscara el index que sea igual al index que le llega en el parametro 
        return this.items.findIndex(item=> item.id == id);
    }

    get(index){
        return this.items[index];
    }

    add(card){
        this.items.push(card);
    }

    get lenght(){
        return this.items.length;
    }

    getHTMl(boardIndex, cards){
        return`
        <div class="board" id = "board--${this.id}">
            <div class="header">
                <div class="title">
                    ${this.tittle}
                </div>
                <div class="options">
                    <button class="more-options">...</button>
                    <div class="submenu">
                        <ul>
                            <li><a href="#" class="board-submenu-edit" data-id="${this.id}" data-index="${boardIndex}">Edit</a></li>
                            <li><a href="#" class="board-submenu-delete" data-id="${this.id}" data-index="${boardIndex}">Delete</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        
            <div class="items">
                ${cards.join('')}
            </div>
            <div class="new-item">
                <form action="#" class="form-new">
                    <input type="text" class="new-input text" placeholder="+Add another card" name="" id="">
                    <input type="hidden" class="index-board" name="" value="${boardIndex}">
                </form>
            </div>
    </div>`
    }
}