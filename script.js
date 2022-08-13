const formAll = document.querySelector('.form-all');
const formActive = document.querySelector('.form-active');
const inputAll = document.querySelector('.input-all');
const inputActive = document.querySelector('.input-active');
const submitBtn = document.querySelector('.btn-submit');
const deleteAllBtn = document.querySelector('.btn-delete-all');
const todoListAll = document.querySelector('.todo-list--all');
const todoListActive = document.querySelector('.todo-list--active');
const todoListCompleted = document.querySelector('.todo-list--completed');

let count = 0;
//if there's no todos array in localStorage, create it//
if (!localStorage.getItem('todos')) {
    const todos = {
        all: [],
        active: [],
        completed: []
    };
    localStorage.setItem("todos", JSON.stringify(todos));
};
let todos = JSON.parse(localStorage.getItem('todos'));

//when user opens the app, update html according to the arrays//
if (todos.all.length >= 1) {
    updateHtml(todos.all, todoListAll, false);
    updateHtml(todos.active, todoListActive, false);
    updateHtml(todos.completed, todoListCompleted, true);
};

function updateHtml(todos, todoList, isForCompleted) {
    todoList.innerHTML = '';
    const listType = todoList.getAttribute('data-list');
    for (let i = 0; i < todos.length; i++) {
        const newTodo = document.createElement('li');
        newTodo.innerHTML = `
            <input type="checkbox" id="checkbox-${listType}${i + 1}" ${isForCompleted ? 'checked disabled' : ''}>
            <label for="checkbox-${listType}${i + 1}">${todos[i]} ${isForCompleted ? `<button class="btn btn-delete"><i
                  class="fa-solid fa-trash"></i></button>` : ''}</label>
        `;
        todoList.append(newTodo);

        //check todos in all tab if they're completed (e.g. in completed array)//
        if (isForCompleted) {
            todoListAll.querySelectorAll('input').forEach(input => {
                if (todos.includes(input.nextElementSibling.innerText)) {
                    input.checked = true;
                };
            });
        };

        document.querySelectorAll('.btn-delete')
            .forEach(btn => btn.addEventListener('click', deleteTodo));

        document.querySelectorAll('input[type=checkbox]')
            .forEach(checkbox => checkbox.addEventListener('change', modifyCompletedArray));
    };
};


function deleteTodo(e) {
    //delete todo on button click and remove it from completed array//
    const todoText = e.target.parentElement.parentElement.innerText;
    todos.completed = todos.completed.filter(todo => todo !== todoText);

    //do the same for all array//
    todos.all = todos.all.filter(todo => todo !== todoText);

    localStorage.setItem("todos", JSON.stringify(todos));

    updateHtml(todos.completed, todoListCompleted, true);
};
deleteAllBtn.addEventListener('click', () => {
    //empty the completed array and set all array to whatever was in the active array//
    todos.completed = [];
    todos.all = todos.active;
    localStorage.setItem("todos", JSON.stringify(todos));

    updateHtml(todos.all, todoListAll, false);
    updateHtml(todos.completed, todoListCompleted, true);
});



function modifyCompletedArray(e) {
    const todoText = e.target.nextElementSibling.innerText.trim();
    if (e.target.checked) {
        //when user checks a checkbox, add the todo to the completed array//
        todos.completed.push(todoText);
        //filter out the checked todo from active array//
        todos.active = todos.active.filter(todo => todo !== todoText);
    } else {
        //when user unchecks a checkbox, remove the todo from completed array//
        todos.completed = todos.completed.filter(todo => todo !== todoText);
        //and push it to active array//
        todos.active = todos.all.filter(todo => todo === todoText);
    }
    localStorage.setItem("todos", JSON.stringify(todos));

    updateHtml(todos.active, todoListActive, false);
    updateHtml(todos.completed, todoListCompleted, true);
}

const submitForm = (todoList, input, isActiveForm) => {
    const listType = todoList.getAttribute('data-list');

    const todoText = input.value.trim();
    if (todoText) {
        if (!todos.all.includes(todoText) && !todos.active.includes(todoText)) {
            todos.all.push(todoText);
            todos.active.push(todoText);
            localStorage.setItem("todos", JSON.stringify(todos));

            count++; // this is for numerating the checkboxes in their ids//
            const newTodo = document.createElement('li');
            newTodo.innerHTML = `
            <input type="checkbox" id="${isActiveForm ? `checkbox-${listType}${count}}` : `checkbox${count}`}">
            <label for="checkbox${count}">${todoText}</label>
        `;
            todoList.append(newTodo);
        }
        document.querySelectorAll('input[type=checkbox]')
            .forEach(checkbox => checkbox.addEventListener('change', modifyCompletedArray));
    };
}
formAll.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm(todoListAll, inputAll, false);
});
formActive.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm(todoListActive, inputActive, true);
});


//when user cycles through tabs, update html according to arrays//
const tabs = document.querySelectorAll('[role="tab"]');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        updateHtml(todos.all, todoListAll, false);
        updateHtml(todos.active, todoListActive, false);
        updateHtml(todos.completed, todoListCompleted, true);
    });
});