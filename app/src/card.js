import {generateId} from './ids.js';

export default class Card{

    id;
    tittle;

    constructor(tittle){
        this.tittle = tittle;
        this.id = generateId();
    }

    getHTMl(board, boardIndex, index){
        const id = `card--${this.id}`;
        const dataid = `data-id = "${id}"`;
        return `<div class="card" id="${id}" data-boardid="board--${board.id}" draggable="true">
        <div class="card-wrapper" ${dataid}>
            <div class="title" ${dataid}>
                ${this.tittle}
            </div>
            <div class="options" ${dataid}>
                <button class="more-options" ${dataid}>...</button>
                <div class="submenu">
                    <ul>
                        <li><a href="#" class="card-submenu-edit" ${dataid} data-index ="${index}" data-board-index ="${boardIndex}" >Editar</a></li>
                        <li><a href="#" class="card-submenu-delete" ${dataid} data-index ="${index}" data-board-index ="${boardIndex}">Eliminar</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="placeholder" data-id="${id}" id="${generateId()}"></div>
    </div>`;
    }
}