import Board from "./baord.js";
import Card from "./card.js";
import Kanban from "./kanban.js";

//variable que se utiliza para saber si el drag and a drop a realizar es valido dentro de la zonas establecidas
let dropOk = false;

const kanban = new Kanban();

await kanban.loadBoards();
/*const card01 = new Card("Tarea 1");
const card02 = new Card("Tarea 2");
const card03 = new Card("Tarea 3");
const card04 = new Card("Tarea 4");
const card05 = new Card("Tarea 5");
const card06 = new Card("Tarea 6");

//const cardd = new Card();

const baord01 = new Board("TODO", [card01, card02]);
const baord02 = new Board("IN PROGRESS", [card03, card04]);
const baord03 = new Board("DONE", [card05, card06]);

//const boardd = new Board();

kanban.add(baord01);
kanban.add(baord02);
kanban.add(baord03);

console.log(kanban);*/

const container = document.querySelector("#container");
const newBoardBoutton = document.querySelector("#new-board-button");

newBoardBoutton.addEventListener("click", addBoard);

renderUI();

function renderUI() {
    const boardsHTML = kanban.boards.map((board, boardIndex) => {
        const cardsHTML = board.items.map((card, index) => {
            return card.getHTMl(board, boardIndex, index);
        });
        return board.getHTMl(boardIndex, cardsHTML);
    });

    container.innerHTML = boardsHTML.join("");

    enableNewCard();
    
    enableDragAndDropsEvents();
}

function addBoard(e) {
    const name = prompt("Name of the board");
    if (name) {
        const board = new Board(name, []);
        kanban.add(board);

        renderUI();
    }
}

function enableNewCard() {
    document.querySelectorAll(".form-new").forEach((form) => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const text = form.querySelector(".text").value;
            const card = new Card(text);

            const indexBoard = form.querySelector(".index-board").value;
            kanban.addCard(card, indexBoard);
            renderUI();
        });
    });

    configureSubMenus();
}


function configureSubMenus() {
    const moreBUttons = document.querySelectorAll(".more-options");

    moreBUttons.forEach((button) => {
        button.addEventListener("click", showMoreOptions);
    });

    const editBoardButtons = document.querySelectorAll('.board-submenu-edit');
    const deleteBoardButtons = document.querySelectorAll('.board-submenu-delete');
    const editCardButtons = document.querySelectorAll('.card-submenu-edit');
    const deleteCardButtons = document.querySelectorAll('.card-submenu-delete');

    editBoardButtons.forEach(button => {
        button.addEventListener('click', editBoard);
    });
    deleteBoardButtons.forEach(button => {
        button.addEventListener('click', deleteBoard);
    });
    editCardButtons.forEach(button => {
        button.addEventListener('click', editCard);
    });
    deleteCardButtons.forEach(button => {
        button.addEventListener('click', deleteCard);
    });
}

function showMoreOptions(e) {
    const submenu = e.target.nextElementSibling;
    //toggle permite poner una clase, si existe la desaparece y si no existe la crea.
    submenu.classList.toggle("submenu-active");
}

//evento end window permite cerrar la tarjeta de opciones cuando se da click por fuera del elemento
window.addEventListener("click", (e) => {
    //matches funcion que regresa true o false si encuentra un selector
    if (!e.target.matches(".more-options")) {
        const menus = Array.from(document.querySelectorAll(".submenu-active"));
        menus.forEach((menu) => {
            if (menu.classList.contains("submenu-active")) {
                menu.classList.remove("submenu-active");
            }
        });
    }
});

function editBoard(e){
    const id = e.target.getAttribute('data-id');
    const index = e.target.getAttribute('data-index');
    const currenTitle = kanban.getBoard(index).tittle;
    const title = prompt('New Tittle', currenTitle);

    if(title){
        kanban.updateBoard(id, index, title);
        renderUI();
    }
}

function deleteBoard(e){
    const index = e.target.getAttribute('data-index');
    kanban.removeBoard(index);
    renderUI();
}

function editCard(e){
    const indexBoard =e.target.getAttribute('data-board-index');
    const indexCard = e.target.getAttribute('data-index');
    const currenTitle = kanban.getBoard(indexBoard).get(indexCard).tittle;
    const title = prompt('New title', currenTitle);

    if(title){
        kanban.updateCard(indexBoard,indexCard,title);
        renderUI();
    }
}

function deleteCard(e){
    const indexBoard =e.target.getAttribute('data-board-index');
    const indexCard = e.target.getAttribute('data-index');

    kanban.removeCard(indexBoard,indexCard);

    renderUI();
}

//DRAG AND DROP 

/* Son metotodos configurados y establecidos por javascript y html y se utilizan para arrastrar elementos de un lugar se compone de diferentes metodos como se mostrará acontinuacion revisar video de teoria de udemy por si algo se olvida */

const classes = {
    hide: 'hide',
    placeholder: 'placeholder',
    active: 'placeholder-active'
};

function enableDragAndDropsEvents(){
    const cards = document.querySelectorAll('.card');

    cards.forEach(card =>{
        card.addEventListener('dragstart', dragstart);
        card.addEventListener('dragend', dragend);
    });

    const boards = document.querySelectorAll('.board');

    boards.forEach(board=>{
        board.addEventListener('dragenter', dragenter);
        //dragover (cudndo se mueva el cursor con el elmento)
        board.addEventListener('dragover', dragover);
        //dragleave cuando salga del target
        board.addEventListener('dragleave', dragleave);
        //drop para eliminar el elemento del target 
        board.addEventListener('drop', drop);
    })
}

function dragstart(e){
    const boardId = e.target.getAttribute('data-boardid');
    const cardID = e.target.id;

    //dataTransfer es un metodo de drag and drop que nos permite una vez eliminado el objeto obtener la informacion de dicho objeto y setData permite especificar el tipo de dato a mandar y luego la informacín.
    e.dataTransfer.setData('text/plain', JSON.stringify({boardId,cardID}));
    e.target.classList.add(classes.hide);
}

function dragend(e){
    e.target.classList.remove(classes.hide);
}

// Debe añádir las clases de nuestro tablero para que se ilumine 
function dragenter(e){
    e.preventDefault();
    const item = e.target;
    dropOk = true;

    if(item.classList.contains(classes.placeholder)){
        item.classList.add(classes.active);
    }
}

function dragover(e){
    e.preventDefault();
    const item = e.target;

    if(item.classList.contains(classes.placeholder) || item.classList.contains('board')){
        item.classList.add(classes.active);
    }else if(item.getAttribute('data-id') != undefined){
        const id = item.getAttribute('data-id');
        document.querySelector('#' +id).querySelector('.placeholder').classList.add(classes.active);
    }
}

function dragleave(e){
    e.target.classList.remove(classes.active);
    document.querySelectorAll('.' + classes.active).forEach(style => style.classList.remove(classes.active))
}

function drop(e){
    e.preventDefault();
    let target, id;

    if(e.target.getAttribute('data-id') == undefined){
        target = e.target;
    }else{
        id= e.target.getAttribute('data-id');
        target = document.querySelector('#'+ id);
    }

    if(!dropOk){
        return false;
    }

    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const draggable = document.querySelector('#' + data.cardID);

    let targetBoardId, targetCardId;

    if(target.classList.contains('card')){
        targetBoardId =target.parentElement.parentElement.id;

        targetCardId = target.id;

        //Metodo que permite agregar un elemento como hermano de otro
        target.insertAdjacentElement('afterend', draggable);
    }else if(target.classList.contains('board')){
        targetBoardId = target.id;
        targetCardId = undefined;
        target.querySelector('.items').appendChild(draggable);
    }

    if(!targetCardId && !targetBoardId){
        return false;
    }

    targetBoardId = targetBoardId.split('--')[1];
    targetCardId = targetCardId?.split('--')[1] ?? -1;
    data.cardID = data.cardID.split('--')[1];
    data.boardId = data.boardId.split('--')[1];

    const indexBoardSrc = kanban.getIndex(data.boardId);
    const indexBoardTarget = kanban.getIndex(targetBoardId);
    const indexCardSrc= kanban.getBoard(indexBoardSrc).getIndex(data.cardID);
    const indexCardTarget = (targetCardId === -1) ? kanban.getBoard(indexBoardTarget).length : kanban.getBoard(indexBoardTarget).getIndex(targetCardId);

    kanban.moveCard(indexBoardSrc, indexCardSrc, indexBoardTarget, indexCardTarget);

    draggable.classList.remove(classes.hide);
    
    renderUI();

    console.log(kanban);
    
    
}