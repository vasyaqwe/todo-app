const formAll = document.querySelector('.form-all');
const formActive = document.querySelector('.form-active');
const submitBtn = document.querySelector('.btn-submit');
const deleteAllBtn = document.querySelector('.btn-delete-all');
const todoListAll = document.querySelector('.todo-list--all');
const todoListActive = document.querySelector('.todo-list--active');
const todoListCompleted = document.querySelector('.todo-list--completed');

let todos = JSON.parse(localStorage.getItem('todos')) || { all: [], active: [], completed: [] };

if (todos.all.length >= 1) {
    renderTodos();
}

formAll.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm(e);
})
formActive.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm(e);
})

function submitForm(e) {
    const todoText = e.target.firstElementChild.value.trim();
    if (todoText) {
        if (!todos.all.includes(todoText) && !todos.active.includes(todoText)) {
            todos.all.push(todoText);
            todos.active.push(todoText);
            renderTodos();
        }
        document.querySelectorAll('input[type=checkbox]')
            .forEach(checkbox => checkbox.addEventListener('change', modifyTodosArray));
    };
}

function updateHtml(todos, todoList) {
    const isCompletedList = todoList.dataset.list === 'completed' && true;
    const listType = todoList.getAttribute('data-list');

    todoList.innerHTML = todos.map((todo, i) => `
        <li>
            <input type="checkbox" id="checkbox-${listType}${i + 1}" ${isCompletedList && 'checked disabled'}>
            <label for="checkbox-${listType}${i + 1}">${todo} ${isCompletedList ? `<button class="btn btn-delete"><i
                  class="fa-solid fa-trash"></i></button>` : ''}</label>
        </li>
        `).join('');

    if (isCompletedList) {
        if (todos.length === 0) {
            deleteAllBtn.setAttribute("data-visible", false);
            todoList.innerHTML = `<p style="opacity: 0.7;">Nothing here...</p>`
        } else {
            deleteAllBtn.setAttribute("data-visible", true);
        }

        todoListAll.querySelectorAll('input').forEach(input => {
            todos.includes(input.nextElementSibling.innerText) ? input.checked = true : input
        });
    };

    document.querySelectorAll('.btn-delete')
        .forEach(btn => btn.addEventListener('click', deleteTodo));

    document.querySelectorAll('input[type=checkbox]')
        .forEach(checkbox => checkbox.addEventListener('change', modifyTodosArray));
}
function renderTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
    updateHtml(todos.all, todoListAll);
    updateHtml(todos.active, todoListActive);
    updateHtml(todos.completed, todoListCompleted);
}

function modifyTodosArray(e) {
    const todoText = e.target.nextElementSibling.innerText.trim();
    if (e.target.checked) {
        todos.completed.push(todoText);
        todos.active = todos.active.filter(todo => todo !== todoText);
    } else {
        todos.completed = todos.completed.filter(todo => todo !== todoText);
        todos.active.push(todos.all.filter(todo => todo === todoText).join(''));
    }
    renderTodos();
}

function deleteTodo(e) {
    const todoText = e.target.parentElement.parentElement.innerText;
    todos.completed = todos.completed.filter(todo => todo !== todoText);
    todos.all = todos.all.filter(todo => todo !== todoText);
    renderTodos();
}
deleteAllBtn.addEventListener('click', () => {
    todos.all = [...todos.active];
    todos.completed = [];
    renderTodos();
})


const tabs = document.querySelectorAll('[role="tab"]');
tabs[0].addEventListener('click', () => {
    setTimeout(() => {
        todoListAll.querySelectorAll('input').forEach(input => {
            if (todos.completed.includes(input.nextElementSibling.innerText)) {
                input.checked = true;
            };
        });
    }, 10);
})
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        renderTodos();
    });
})