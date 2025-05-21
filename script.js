document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            tasks.push({ text: taskText, completed: false });
            taskInput.value = '';
            saveAndRenderTasks();
        } else {
            alert('Task cannot be empty!'); // potential bug
        }
    }

    function toggleTaskStatus(index) {
        tasks[index].completed = !tasks[index].completed;
        saveAndRenderTasks();
    }

    function removeTask(index) {
        tasks.splice(index, 1);
        saveAndRenderTasks();
    }

    function saveAndRenderTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.textContent = task.text;
            if (task.completed) {
                li.classList.add('completed');
            }
            li.addEventListener('click', () => toggleTaskStatus(index));

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.classList.add('remove-btn');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevents toggleTaskStatus from firing
                removeTask(index);
            });

            li.appendChild(removeBtn);
            taskList.appendChild(li);
        });
    }
});
