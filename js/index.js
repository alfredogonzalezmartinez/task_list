(function () {
    const input = document.querySelector('#itnew');
    const form = document.querySelector('#formitnew');
    const selectList = document.querySelector('#slist');
    const listsContainer = document.querySelector('#list-container');

    let tasks = [];
    let lists = [
        { id: uuidv4(), text: 'General', count: 0 },
        { id: uuidv4(), text: 'Casa', count: 0 },
        { id: uuidv4(), text: 'Trabajo', count: 0 }
    ];

    document.addEventListener('DOMContentLoaded', e => {
        refresUI();
        lists.forEach(list => {
            selectList.innerHTML += `<option value="${list.id}">${list.text}</option>`
        })
    })

    // Create a task class object
    function task(id, text, list, completed) {
        return { id: id, text: text, list: list, completed: completed }
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const text = input.value.trim();
        const listId = selectList.value;

        if (text === '') return false;

        const newTask = new task(uuidv4(), text, listId, false);

        tasks.push(newTask);
        input.value = '';

        refresUI();
    });

    function refresUI() {
        renderTasks();
        renderLists();
    }

    function renderTasks() {
        const tasksContainer = document.querySelector('#tasks-container');
        tasksContainer.innerHTML = '';

        tasks.forEach(task => {
            tasksContainer.innerHTML += renderTask(task);
        })

        // Add event to checkbox
        document.querySelectorAll('.task label input').forEach(item => {
            item.addEventListener('click', e => {
                const id = e.target.parentNode.parentNode.getAttribute('data-id');
                const index = tasks.findIndex(task => task.id === id);

                tasks[index].completed = !tasks[index].completed;
            })
        });

        // Add event to button
        document.querySelectorAll('.task button').forEach(item => {
            item.addEventListener('click', e => {
                const id = e.target.parentNode.getAttribute('data-id');
                const obj = getItemAndIndex(tasks, { id: id })

                tasks.splice(obj.index, 1)

                renderLists();
                renderTasks();
            })
        });
    };

    function getItemAndIndex(arr, obj) {
        const key = Object.keys(obj);
        const value = obj[key];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i][key] === value) {
                return { index: i, item: arr[i] };
            }
        }
    }

    function renderTask(task) {
        return `
            <div class="task" data-id="${task.id}">
                <label class="checkbox-container">
                    ${task.text.replace(/</g, "&lt;")} 
                    <input type="checkbox" ${(task.completed) ? 'checked="checked"' : ''}/>
                    <span class="checkmark"></span>
                </label>
                <button></button>
            </div>
        `;
    }

    function renderLists() {
        lists.forEach(list => {
            list.count = 0;
        });

        tasks.forEach(task => {
            lists.forEach(list => {
                if (task.list === list.id) {
                    list.count++;
                }
            });
        });

        listsContainer.innerHTML = '';
        lists.forEach(list => {
            listsContainer.innerHTML += renderListsItem(list);
        })
    };

    function renderListsItem(list) {
        return `
            <div class="list">
                <h3>${list.text}</h3>
                <span>${list.count} tareas</span>
            </div>
        `;
    }

    // Create globally-unique identifiers
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

})();